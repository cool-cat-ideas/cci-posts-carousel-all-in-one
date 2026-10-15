import { execFileSync, spawnSync } from 'node:child_process';
import { createHash } from 'node:crypto';
import { existsSync, mkdirSync, readdirSync, readFileSync, rmSync, statSync, writeFileSync } from 'node:fs';
import { basename, dirname, join, relative, resolve, sep } from 'node:path';
import { fileURLToPath } from 'node:url';

const pluginSlug = 'wp-posts-carousel';
const scriptDir = dirname(fileURLToPath(import.meta.url));
const pluginDir = resolve(scriptDir, '..');
const releaseDir = process.env.CCI_RELEASE_DIR ? resolve(process.env.CCI_RELEASE_DIR) : resolve(pluginDir, '..', '..', 'releases', 'wordpress');
const packageDir = join(releaseDir, pluginSlug);
const legacyZipPath = join(releaseDir, `${pluginSlug}.zip`);

const includeRoots = [
	'assets',
	'blocks',
	'i18n',
	'includes',
	'integrations',
	'languages',
	'libraries',
	'templates',
	'LICENSE',
	'readme.txt',
	'wp-posts-carousel.php',
];

const generatedJavaScriptPatterns = [
	/^admin-v2\.js(?:\.LICENSE\.txt)?$/,
	/^frontend-loader\.js(?:\.LICENSE\.txt)?$/,
	/^[0-9]+\.[a-f0-9]+\.js(?:\.LICENSE\.txt)?$/,
	/^[0-9]+\.[a-f0-9]+\.js\.map$/,
];

const generatedCssPatterns = [
	/^[0-9]+\.css$/,
];

const excludePatterns = [
	/(?:^|\/)(?:\.(?:git|github|gitlab|svn|hg|vscode|idea|fleet|playwright(?:-cli)?|cache|turbo|next|release-stage)|node_modules|__pycache__|tests?|test-results|playwright-report|blob-report|coverage)(?:\/|$)/,
	/(?:^|\/)(?:\.env(?:\.[^/]*)?|\.npmrc|\.editorconfig|\.gitignore|\.gitattributes|AGENTS\.md|PROJECT_GUIDE\.md|Thumbs\.db|pnpm-lock\.yaml|yarn\.lock|composer\.lock)$/,
	/(?:^|\/)(?:(?:playwright|vitest|vite|webpack|tailwind|postcss|eslint|stylelint|babel|jest)\.config\.|tsconfig(?:\.|$)|\.eslintrc|\.prettier)/,
	/\.(?:log|pyc|tsbuildinfo|code-workspace)$/,
	/(?:^|\/)[^/]+:Zone\.Identifier$/,
	/^assets\/scss(?:\/|$)/,
	/^assets\/images\/demo-(?:blog-product-panorama\.png|connected-strip\.svg|products(?:\/|$))/,
	/\.DS_Store$/,
	/\.map$/,
];

function run(command, args, options = {}) {
	console.log(`> ${command} ${args.join(' ')}`);
	const result = spawnSync(command, args, {
		cwd: pluginDir,
		stdio: 'inherit',
		shell: false,
		...options,
	});

	if (result.status !== 0) {
		process.exit(result.status || 1);
	}
}

function assertInside(parent, target) {
	const relativePath = relative(parent, target);

	if (relativePath.startsWith('..') || relativePath === '' || relativePath.includes(`..${sep}`)) {
		throw new Error(`Refusing to remove path outside ${parent}: ${target}`);
	}
}

function shouldExclude(relativePath) {
	const normalized = relativePath.replaceAll('\\', '/');

	return excludePatterns.some((pattern) => pattern.test(normalized));
}

function listPackageFiles() {
	const files = [];

	function visit(relativePath) {
		const source = join(pluginDir, relativePath);

		if (!existsSync(source) || shouldExclude(relativePath)) {
			return;
		}

		if (statSync(source).isDirectory()) {
			for (const entry of readdirSync(source)) {
				visit(join(relativePath, entry));
			}

			return;
		}

		files.push(relativePath.replaceAll('\\', '/'));
	}

	for (const root of includeRoots) {
		visit(root);
	}

	return files.sort();
}

function cleanGeneratedAssets() {
	const generatedDirectories = [
		{ path: join(pluginDir, 'assets', 'js'), patterns: generatedJavaScriptPatterns },
		{ path: join(pluginDir, 'assets', 'css'), patterns: generatedCssPatterns },
	];

	for (const generatedDirectory of generatedDirectories) {
		if (!existsSync(generatedDirectory.path)) {
			continue;
		}

		for (const entry of readdirSync(generatedDirectory.path)) {
			if (!generatedDirectory.patterns.some((pattern) => pattern.test(entry))) {
				continue;
			}

			const target = join(generatedDirectory.path, entry);
			assertInside(generatedDirectory.path, target);
			rmSync(target, { force: true });
		}
	}
}

function copyEntry(source, target, rootRelative = '') {
	if (!existsSync(source)) {
		return;
	}

	const stats = statSync(source);
	const relativePath = rootRelative || basename(source);

	if (shouldExclude(relativePath)) {
		return;
	}

	if (stats.isDirectory()) {
		mkdirSync(target, { recursive: true });

		for (const entry of readdirSync(source)) {
			copyEntry(join(source, entry), join(target, entry), join(relativePath, entry));
		}

		return;
	}

	mkdirSync(dirname(target), { recursive: true });
	execFileSync(process.execPath, [
		'-e',
		"require('node:fs').copyFileSync(process.argv[1], process.argv[2])",
		source,
		target,
	]);
}

function readVersion() {
	const pluginFile = readFileSync(join(pluginDir, 'wp-posts-carousel.php'), 'utf8');
	const match = pluginFile.match(/^\s*\*\s*Version:\s*(.+)$/m);

	return match ? match[1].trim() : '';
}

function validatePackage() {
	const requiredFiles = [
		'LICENSE',
		'readme.txt',
		'wp-posts-carousel.php',
		'assets/js/admin-v2.js',
		'assets/js/frontend-loader.js',
		'blocks/carousel/index.js',
		'includes/api/class-api.php',
		'templates/default/template.json',
	];

	for (const file of requiredFiles) {
		if (!existsSync(join(packageDir, file))) {
			throw new Error(`Release package is missing required file: ${file}`);
		}
	}

	const forbiddenPaths = [
		'node_modules',
		'docs',
		'.wordpress-org',
		'README.md',
		'src',
		'.git',
		'vendor',
		'webpack.config.js',
		'package.json',
		'package-lock.json',
	];

	for (const item of forbiddenPaths) {
		if (existsSync(join(packageDir, item))) {
			throw new Error(`Release package contains forbidden path: ${item}`);
		}
	}

	const forbiddenFiles = [
		'includes/class-demo-content.php',
		'assets/images/demo-blog-product-panorama.png',
		'assets/images/demo-connected-strip.svg',
		'assets/images/demo-products',
	];

	for (const file of forbiddenFiles) {
		if (existsSync(join(packageDir, file))) {
			throw new Error(`Release package contains demo-only tooling: ${file}`);
		}
	}
}

function makeZip(zipPath) {
	rmSync(zipPath, { force: true });
	rmSync(legacyZipPath, { force: true });

	if (process.platform === 'win32') {
		run('powershell', [
			'-NoProfile',
			'-ExecutionPolicy',
			'Bypass',
			'-Command',
			`Compress-Archive -Path '${packageDir.replaceAll("'", "''")}' -DestinationPath '${zipPath.replaceAll("'", "''")}' -Force`,
		]);
		return;
	}

	const zipCheck = spawnSync('zip', ['--version'], { stdio: 'ignore' });

	if (zipCheck.status === 0) {
		run('zip', ['-qr', zipPath, pluginSlug], { cwd: releaseDir, shell: false });
		return;
	}

	const pythonCheck = spawnSync('python3', ['--version'], { stdio: 'ignore' });

	if (pythonCheck.status === 0) {
		run('python3', [
			'-c',
			[
				'import os, sys, zipfile',
				'root, slug, zip_path = sys.argv[1], sys.argv[2], sys.argv[3]',
				'base = os.path.join(root, slug)',
				'with zipfile.ZipFile(zip_path, "w", zipfile.ZIP_DEFLATED) as archive:',
				'    for dirpath, _dirnames, filenames in os.walk(base):',
				'        for filename in filenames:',
				'            path = os.path.join(dirpath, filename)',
				'            archive.write(path, os.path.relpath(path, root))',
			].join('\n'),
			releaseDir,
			pluginSlug,
			zipPath,
		], { cwd: releaseDir, shell: false });
		return;
	}

	const powershellCheck = spawnSync('powershell.exe', ['-NoProfile', '-Command', '$PSVersionTable.PSVersion.ToString()'], {
		stdio: 'ignore',
	});

	if (powershellCheck.status === 0) {
		const powershellPackageDir = toWindowsPath(packageDir);
		const powershellZipPath = toWindowsPath(zipPath);

		run('powershell.exe', [
			'-NoProfile',
			'-ExecutionPolicy',
			'Bypass',
			'-Command',
			`Compress-Archive -Path '${powershellPackageDir.replaceAll("'", "''")}' -DestinationPath '${powershellZipPath.replaceAll("'", "''")}' -Force`,
		], { shell: false });
		return;
	}

	console.warn('Zip command not found. Release folder was prepared without creating a ZIP.');
}

function toWindowsPath(path) {
	if (process.platform === 'win32') {
		return path;
	}

	const result = spawnSync('wslpath', ['-w', path], {
		encoding: 'utf8',
	});

	if (result.status === 0 && result.stdout.trim()) {
		return result.stdout.trim();
	}

	return path;
}

function main() {
	if (process.argv.includes('--list-files')) {
		console.log(JSON.stringify(listPackageFiles(), null, 2));
		return;
	}

	const version = readVersion();

	if (!version) {
		throw new Error('Could not read plugin version from wp-posts-carousel.php');
	}

	const zipPath = join(releaseDir, `${pluginSlug}-${version}.zip`);

	console.log(`Preparing ${pluginSlug} ${version} for WordPress.org.`);
	cleanGeneratedAssets();
	run(process.execPath, ['node_modules/webpack/bin/webpack.js', '--config', 'webpack.config.js', '--mode=production']);

	mkdirSync(releaseDir, { recursive: true });
	assertInside(releaseDir, packageDir);
	rmSync(packageDir, { recursive: true, force: true });
	mkdirSync(packageDir, { recursive: true });

	for (const root of includeRoots) {
		copyEntry(join(pluginDir, root), join(packageDir, root), root);
	}

	validatePackage();
	makeZip(zipPath);

	if (!existsSync(zipPath)) {
		throw new Error(`Release ZIP was not created: ${zipPath}`);
	}

	const checksum = createHash('sha256').update(readFileSync(zipPath)).digest('hex');
	writeFileSync(`${zipPath}.sha256`, `${checksum}  ${basename(zipPath)}\n`);

	if (existsSync(zipPath)) {
		assertInside(releaseDir, packageDir);
		rmSync(packageDir, { recursive: true, force: true });
	}

	console.log(existsSync(zipPath) ? `Release ZIP: ${zipPath}` : 'Release ZIP was not created.');
}

main();

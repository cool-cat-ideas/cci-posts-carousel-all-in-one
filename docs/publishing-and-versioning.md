# Publishing and package contents

This guide describes the public repository, the installable WordPress package
and the assets used by the WordPress.org listing. Release notes are maintained
in the `Changelog` section of `readme.txt`.

## Release artifacts

The release script writes ZIP files to the workspace release directory:

```text
CCI_DEV/releases/wordpress/
  cci-posts-carousel-2.1.1.zip
```

Do not keep generated `dist/` directories in product folders unless the product
explicitly requires them.

## Public repository contents

Keep plugin sources, compiled runtime assets, tests, user and API documentation,
build configuration, the lockfile and `.wordpress-org/` screenshots in Git.
The [source build guide](./building-from-source.md) describes the shared framework
and Pro checkout requirements.

Local Playwright session files, generated QA screenshots and test reports do not
belong in the public repository. Store these outside the product or in the
ignored output directories. Release notes are maintained in `readme.txt` and
included in the installable package.

## Screenshots, logo and README files

Keep the directory screenshots in the Git repository under `.wordpress-org/`.
They are documentation assets, separate from the plugin's runtime `assets/`
directory:

```text
wp-posts-carousel/
  README.md
  readme.txt
  .wordpress-org/
    screenshot-1.png
    ...
    screenshot-19.png
  assets/images/wp-posts-carousel-logo.png
  templates/default/screenshot.png
```

- `README.md` is the GitHub overview, with the existing logo and relative image
  links such as `![Carousel dashboard](.wordpress-org/screenshot-1.png)`.
- `readme.txt` is the WordPress.org listing. The numbered entries in its
  `== Screenshots ==` section map to `screenshot-1.png`, `screenshot-2.png`, etc.
  Keep all 11 filenames and captions in the same order.
- Directory screenshots and `README.md` are excluded from the installable ZIP.
  Runtime graphics remain included: the admin logo and
  `templates/*/screenshot.png` are used inside the plugin.
- GitHub's automatically generated source archives include repository files,
  including documentation images. Attach the ZIP produced by the release
  script when distributing an installation package.

The admin captures show a demo with Pro active. Captions distinguish Free
features, Pro templates and separately installed extensions.

### WordPress.org SVN mapping

Copy the contents of `.wordpress-org/` into the SVN checkout's top-level
`assets/` directory, beside `trunk/` and `tags/`:

```text
svn-checkout/
  assets/
    screenshot-1.png
    ...
    screenshot-19.png
  trunk/
    readme.txt
    wp-posts-carousel.php
    assets/                 # runtime JS, CSS and images from the package
    ...
  tags/
    <stable-tag>/
      readme.txt
      ...
```

Do not copy `.wordpress-org/` or the directory screenshots into `trunk/` or a
version tag. Prepare plugin files from the release package rather than copying
the complete development repository into SVN.

After copying the screenshots, review the SVN diff and add new files. PNG files
should have `svn:mime-type` set to `image/png`. When removing a previously
published screenshot, remove that specific SVN asset and update the numbering
and captions together.

For caption changes, update `readme.txt` in `trunk/` and in the version selected
by `Stable tag`; the directory reads the active tag's README. Image and caption
updates alone do not require a plugin version increase. Do not overwrite the
released tag's plugin code when updating its README.

WordPress.org displays branding through dedicated directory icons and banners.
Use its supported names and exact sizes, for example `icon-128x128.png`,
`icon-256x256.png` and `banner-772x250.png`, also in the top-level SVN `assets/`.
The wide runtime logo used in the GitHub README is not automatically a correctly
sized WordPress.org icon or banner.

Official references: [WordPress.org plugin assets](https://developer.wordpress.org/plugins/wordpress-org/plugin-assets/),
[WordPress.org readme parsing](https://developer.wordpress.org/plugins/wordpress-org/how-your-readme-txt-works/),
[GitHub relative README image links](https://docs.github.com/en/repositories/managing-your-repositorys-settings-and-features/customizing-your-repository/about-readmes#relative-links-and-image-paths-in-markdown-files)
and [GitHub source archives](https://docs.github.com/en/repositories/working-with-files/using-files/downloading-source-code-archives).

### Check package contents without creating a ZIP

From the plugin directory, using the workspace Node toolchain:

```sh
../../scripts/run-node node scripts/build-wp-release.mjs --list-files
```

This prints a JSON list based on the current files and the release allowlist.
It does not build assets, stage a release, remove files or create a ZIP. A normal
release build regenerates assets before applying the same inclusion rules.

## Release checks

Review code and documentation changes together. Before publishing, check that:

- `readme.txt` and the plugin header describe the same version;
- the `Changelog` section of `readme.txt` describes the released version;
- changes to public behavior are documented under `docs/{version}/`;
- changes to public hooks, endpoints, template manifests and saved carousel
  data are documented.

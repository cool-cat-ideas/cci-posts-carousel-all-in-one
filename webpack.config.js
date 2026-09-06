const path = require( 'path' );
const MiniCssExtractPlugin = require( 'mini-css-extract-plugin' );
const CssMinimizerPlugin = require( 'css-minimizer-webpack-plugin' );

module.exports = ( env, argv ) => {
	const production = argv.mode === 'production';
	const scriptRule = {
		test: /\.jsx?$/,
		exclude: /node_modules/,
		loader: 'babel-loader',
	};
	const cssRule = ( extract = false ) => ( {
		test: /\.css$/i,
		use: [
			extract ? MiniCssExtractPlugin.loader : 'style-loader',
			'css-loader',
			'postcss-loader',
		],
	} );
	const adminCssPlugins = production
		? [
			new MiniCssExtractPlugin( {
				filename: '../css/[name].css',
				chunkFilename: '../css/[name].css',
			} ),
		]
		: [];

	const baseConfig = {
		output: {
			filename: '[name].js',
			chunkFilename: '[name].[contenthash:8].js',
			publicPath: 'auto',
			path: path.resolve( __dirname, 'assets/js' ),
			clean: {
				keep: /wp-posts-carousel\.js$/,
			},
		},

		devtool: production ? false : 'source-map',
		optimization: production
			? {
				minimizer: [ '...', new CssMinimizerPlugin() ],
			}
			: undefined,

		resolve: {
			extensions: [ '.js', '.jsx', '.json' ],
			symlinks: false,
		},
	};

	return [
		{
			...baseConfig,
			name: 'admin-v2',
			entry: {
				'admin-v2': path.resolve( __dirname, 'src/admin-v2/index.jsx' ),
			},
			module: {
				rules: [ scriptRule, cssRule( production ) ],
			},
			plugins: adminCssPlugins,
			resolve: {
				...baseConfig.resolve,
				alias: {
					react$: path.resolve( __dirname, 'src/admin-v2/lib/wp-element-react.js' ),
					'react/jsx-runtime$': path.resolve( __dirname, 'src/admin-v2/lib/wp-element-jsx-runtime.js' ),
					'react/jsx-dev-runtime$': path.resolve( __dirname, 'src/admin-v2/lib/wp-element-jsx-runtime.js' ),
					'react-dom$': path.resolve( __dirname, 'src/admin-v2/lib/wp-element-dom.js' ),
					'react-dom/client$': path.resolve( __dirname, 'src/admin-v2/lib/wp-element-dom.js' ),
				},
			},
		},
		{
			...baseConfig,
			name: 'frontend-loader',
			dependencies: [ 'admin-v2' ],
			entry: {
				'frontend-loader': path.resolve( __dirname, 'src/front-app/loader.js' ),
			},
			module: {
				rules: [ scriptRule, cssRule( false ) ],
			},
			output: {
				...baseConfig.output,
				clean: false,
			},
		},
	];
};

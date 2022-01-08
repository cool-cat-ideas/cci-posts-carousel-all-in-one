const path = require( 'path' );

module.exports = ( env, argv ) => {
	let production = argv.mode === 'production';

	return [
		//react
		{
			entry: {
				'admin': path.resolve( __dirname, 'src/admin-app/index.js' ),
			},
			//entry: ["./src/admin-app/index.js"],
			output: {
				filename: '[name].js',
				publicPath: '/wp-content/plugins/wp-posts-carousel/assets/js/',
				path: path.resolve( __dirname, 'assets/js' ),
			},

			devtool: production ? '' : 'source-map',

			resolve: {
				extensions: [ '.js', '.jsx', '.json' ],
			},

			module: {
				rules: [
					{
						test: /\.jsx?$/,
						exclude: /node_modules/,
						loader: 'babel-loader',
					},
					{
						test: /\.s[ac]ss$/i,
						use: [
							// Creates `style` nodes from JS strings
							'style-loader',
							// Translates CSS into CommonJS
							'css-loader',
							// Compiles Sass to CSS
							'sass-loader',
						],
					},
					{
						test: /\.(woff2?|ttf|otf|eot|svg)$/,
						use: [
							{
								loader: 'file-loader',
								options: {
									limit: 10000,
									name: '[name].[ext]',
									publicPath: '../fonts',
									emitFile: false,
								},
							},
						],
					},
				],
			},
			// optimization: {
			// 	minimize: true,
			// 	namedModules: true,
			// 	namedChunks: true,
			// 	removeAvailableModules: true,
			// 	flagIncludedChunks: true,
			// 	occurrenceOrder: false,
			// 	usedExports: true,
			// 	concatenateModules: true,
			// 	sideEffects: false, // <----- in prod defaults to true if left blank
			// }
		},
		//php
		{},
	];
};

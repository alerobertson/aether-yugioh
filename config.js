const path = require('path');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const HtmlBeautifyPlugin = require('beautify-html-webpack-plugin');

module.exports = {
    mode: 'development',
    devtool: false,
    entry: path.join(__dirname, 'index.js'),
    plugins: [
        new CleanWebpackPlugin(),
        new MiniCssExtractPlugin({
            filename: '[name].[contenthash].css'
        }),
        new HtmlWebpackPlugin({
            publicPath: './',
            minify: false,
            template: './index.html',
            favicon: "./assets/images/favicon.ico"
        }),
        new HtmlBeautifyPlugin()
    ],
    module: {
        rules: [
            {
                test: /\.css$/i,
                use: [
                    MiniCssExtractPlugin.loader,
                    'css-loader'
                ]
            },
            {
                test: /\.html$/i,
                loader: 'html-loader',
            },
            {
                test: /\.(js|jsx)$/,
                exclude: /node_modules/,
                use: ['babel-loader']
            },
            {
                test: /\.s[ac]ss$/i,
                use: [
                    // Creates `style` nodes from JS strings
                    "style-loader",
                    // Translates CSS into CommonJS
                    "css-loader",
                    // Compiles Sass to CSS
                    "sass-loader",
                ],
            },
            {
                test: /\.(png|svg|jpg|jpeg|gif)$/i,
                type: 'asset/resource'
            },
        ]
    },
    resolve: {
        alias: {
          '@components': path.join(__dirname, 'components'),
          '@style-variables': path.join(__dirname, 'styles/_variables.scss'),
          '@style-mixins': path.join(__dirname, 'styles/_mixins.scss'),
          '@api-operations': path.join(__dirname, 'operations/api.js'),
          '@pages': path.join(__dirname, 'pages'),
          '@images': path.join(__dirname, 'assets/images/')
        }
    },
    output: {
        filename: '[name].[contenthash].js',
        path: __dirname + '/dist'
    },
    devServer: {
        compress: true,
        port: 5000,
        hot: true,
        historyApiFallback: true
    },
};
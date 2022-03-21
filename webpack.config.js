var HtmlWebpackPlugin = require('html-webpack-plugin');
const path = require('path');
const Dotenv = require('dotenv-webpack');

module.exports = {
    mode: 'development',
    module: {
        rules: [
            {
                test: /\.jsx?$/,
                loader: 'babel-loader'
            },
            {
                test: /\.less$/,
                use: [
                    { loader: 'style-loader' },
                    { loader: 'css-loader' },
                    { loader: 'less-loader' }
                ]
            }
        ]
    },
    resolve: {
        mainFiles: ['index', 'Index'],
        extensions: ['.js', '.jsx'],
        alias: {
            '@': path.resolve(__dirname, 'src/'),
        }
    },
    plugins: [new HtmlWebpackPlugin({
        template: './src/index.html'
    }),
        new Dotenv()],
    devServer: {
        historyApiFallback: true
    },
    devtool: 'eval-cheap-module-source-map',
    externals: {
        // global app config object
        config: JSON.stringify({
            apiUrl: 'http://localhost:8000/api'
        })
    }
}
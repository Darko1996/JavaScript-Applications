const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');

module.exports = {
    entry: ['babel-polyfill', './src/js/index.js'], //odakle pocinje da uzima js 
    output: {
        path: path.resolve(__dirname, 'dist'), //smesta ih ovde 
        filename: 'js/bundle.js'
    },
    devServer: {
        contentBase: './dist' //live dev server
    },
    plugins: [
        new HtmlWebpackPlugin({
            filename: 'index.html', //kopira index.html iz src u dist fajl (iako ga ne prikazuje u dist. Prikazuje ga u dev i build verziji.) automatski spaja sve js u index i unosi <script> tagove
            template: './src/index.html'
        })
    ],
    module: { //babel kompailer konvertuje ES6+ u ES5 (.babelrc)
        rules: [
            {
                test: /\.js$/,
                exclude: /node_modules/,
                use: {
                    loader: 'babel-loader'
                }
            }
        ]
    }
};
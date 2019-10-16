
var path = require('path');
var WriteFilePlugin = require('write-file-webpack-plugin');
var CopyPlugin = require('copy-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin')
const { BaseHrefWebpackPlugin } = require('base-href-webpack-plugin');


module.exports = {
    context: __dirname,
    entry: './index.js',
    output: {
        publicPath: '/bpm86dev/IncentivesPortal',
        path: path.join(__dirname, '/bpm86dev/IncentivesPortal'),
        filename: 'index.js'
    },
    plugins: [

        // new HtmlWebpackPlugin(), // Required dependency
        // new BaseHrefWebpackPlugin({ baseHref: '/bpm86dev/IncentivesPortal' }),
        new WriteFilePlugin(),
        new CopyPlugin([
            { 
              from: path.join(__dirname, '/../AICPortal'), 
              to: path.join(__dirname, '/bpm86dev/IncentivesPortal'),
              ignore: ['.git'],
            }
          ]),
    ],
    module: {
        rules: [
          {
            test: /\.html$/i,
            exclude: /node_modules/,
            use: 'raw-loader',
          },
          {
            test: /\.css$/,
            use: ['style-loader', 'css-loader'],
          },
          {
            test: /\.(js|jsx)$/,
            exclude: /node_modules/,
            use: {
              loader: "babel-loader"
            }
          }
        ],
      },
    // devtool: 'source-map',
    devServer: {
        contentBase: path.join(__dirname, ''),
        compress: false,
        port: 4300,
        publicPath: path.join(__dirname, '/bpm86dev/IncentivesPortal'),
        proxy: {
          '/bpm86dev/ui-services': {
            
              target: 'https://ssointernal-dev1.vwoa.na.vwg/bpm86dev/ui-services',
              secure: false,
              changeOrigin: true,
              cookieDomainRewrite: true
            
          }
        },
        // open: true, // Here
        openPage: 'bpm86dev/IncentivesPortal' // And here
    }
}
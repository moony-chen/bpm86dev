
var path = require('path');
var WriteFilePlugin = require('write-file-webpack-plugin');
var CopyPlugin = require('copy-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin')
const { BaseHrefWebpackPlugin } = require('base-href-webpack-plugin');

const contextPath = 'bpmstg'
const envs = {
  bpmstg: 'https://www-qa.accessaudi.com/',
  bpm86dev: 'https://ssointernal-dev1.vwoa.na.vwg/'
}

module.exports = {
    context: __dirname,
    entry: './index.js',
    output: {
        publicPath: `/${contextPath}/IncentivesPortal`,
        path: path.join(__dirname, '/dist'),
        filename: 'index.js'
    },
    plugins: [

        // new HtmlWebpackPlugin(), // Required dependency
        // new BaseHrefWebpackPlugin({ baseHref: '/bpm86dev/IncentivesPortal' }),
        new WriteFilePlugin(),
        new CopyPlugin([
            { 
              from: path.join(__dirname, '/../AICPortal'), 
              to: path.join(__dirname, `dist/${contextPath}/IncentivesPortal`),
              ignore: ['.git/**/*'],
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
        contentBase: path.join(__dirname, '/dist'),
        compress: false,
        port: 4300,
        publicPath: path.join(__dirname, `/dist/${contextPath}/IncentivesPortal`),
        proxy: {
          [`/${contextPath}/ui-services`]: {
            
              target: envs[contextPath],
              secure: false,
              changeOrigin: true,
              cookieDomainRewrite: true,
              headers: {
                'Cookie': '<INTERT Cookie HERE>'
              }
          }
        },
        open: true,
        openPage: `${contextPath}/IncentivesPortal`
    }
}
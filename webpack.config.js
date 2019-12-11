
var path = require('path');
var WriteFilePlugin = require('write-file-webpack-plugin');
var CopyPlugin = require('copy-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin')
const { BaseHrefWebpackPlugin } = require('base-href-webpack-plugin');
const ReplaceInFileWebpackPlugin = require('replace-in-file-webpack-plugin');

const contextPath = 'bpm86dev'
const envs = {
  bpmstg: 'https://www-qa.accessaudi.com/',
  bpm86dev: 'https://www-dev.accessaudi.com/'
}

const proxy = {
            
  target: envs[contextPath],
  secure: false,
  changeOrigin: true,
  cookieDomainRewrite: true,
  headers: {
    'Cookie': '<Input Cookie Here>'
  }
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
          new ReplaceInFileWebpackPlugin([
            {
              dir: path.join(__dirname, `dist/${contextPath}/IncentivesPortal/app/shared/services`),
              files: ['sessionTimeoutService.js'],
              rules: [{
                  search: '20 * 60 * 1000',
                  replace: '2000 * 60 * 1000'
              }]
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
          [`/${contextPath}/ui-services`]: proxy,
          [`/${contextPath}/rest`]: proxy,
          [`/${contextPath}/portal`]: proxy
        },
        open: true,
        openPage: `${contextPath}/IncentivesPortal`
    }
}
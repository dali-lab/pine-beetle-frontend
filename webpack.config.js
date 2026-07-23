const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const ESLintPlugin = require('eslint-webpack-plugin');

const env = process.env.NODE_ENV || 'development';
// set to 'production' or 'development' in your env

const finalCSSLoader = (env === 'production') ? MiniCssExtractPlugin.loader : { loader: 'style-loader' };
const autoprefixer = require('autoprefixer');

const DotenvPlugin = require('dotenv-webpack');

const postcssPresets = require('postcss-preset-env');

const ReactRefreshWebpackPlugin = require('@pmmmwh/react-refresh-webpack-plugin');

module.exports = {
  mode: env,
  output: {
    publicPath: '/',
    // Content-hash the entry bundle in production so every deploy produces a new
    // filename. Without this the bundle is always "main.js", the injected
    // index.html is byte-identical across deploys, and browsers/CDNs keep
    // serving a stale bundle no matter how hard the user refreshes. (Code-split
    // chunks are already hashed via the default chunkFilename.)
    filename: env === 'production' ? '[name].[contenthash].js' : '[name].js',
  },
  entry: ['./src'], // this is where our app lives
  devtool: env === 'development' ? 'eval-source-map' : undefined, // this enables debugging with source in chrome devtools
  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: /node_modules/,
        use: [
          {
            loader: 'babel-loader',
            options: {
              plugins: [env === 'development' && 'react-refresh/babel'].filter(Boolean),
            },
          },
        ],
      },
      {
        test: /\.s?css/,
        use: [
          finalCSSLoader,
          {
            loader: 'css-loader',
            options: {
              sourceMap: true,
            },
          },
          {
            loader: 'postcss-loader',
            ident: 'postcss',
            options: {
              postcssOptions: {
                plugins: [
                  autoprefixer(),
                  postcssPresets({ browsers: 'last 2 versions' }),
                ],
              },
              sourceMap: true,
            },
          },
          {
            loader: 'sass-loader',
            options: {
              sourceMap: true,
              additionalData: '@import "src/styles/colors.scss";',
            },
          },
        ],
      },
      {
        test: /\.(jpe?g|png|gif|svg|ttf|woff|woff2|pdf)$/,
        use: [
          {
            loader: 'file-loader',
            options: {
              useRelativePath: true,
              name: '[name].[ext]',
            },
          },
        ],
      },
    ],
  },
  plugins: [
    new ESLintPlugin({ cache: true }),
    new MiniCssExtractPlugin({
      // Hash the extracted CSS too, for the same cache-busting reason as the JS.
      filename: env === 'production' ? '[name].[contenthash].css' : '[name].css',
    }),
    new HtmlWebpackPlugin({
      template: './src/index.html',
      filename: './index.html',
    }),
    new DotenvPlugin({
      path: '.env',
      safe: true,
      allowEmptyValues: true,
      systemvars: true,
    }),
    env === 'development' && new ReactRefreshWebpackPlugin(),
  ].filter(Boolean),
  devServer: {
    hot: true,
    historyApiFallback: {
      disableDotRule: true,
    },
    client: {
      overlay: {
        warnings: false,
      },
    },
  },
};

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
  output: { publicPath: '/' },
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
            },
          },
        ],
      },
      {
        test: /\.(jpe?g|png|gif|svg|ttf|woff|woff2)$/,
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
    new ESLintPlugin(),
    new MiniCssExtractPlugin(),
    new HtmlWebpackPlugin({
      template: './src/index.html',
      filename: './index.html',
    }),
    new DotenvPlugin({
      path: '.env',
      safe: true,
      systemvars: true,
    }),
    env === 'development' && new ReactRefreshWebpackPlugin(),
  ].filter(Boolean),
  devServer: {
    hot: true,
    historyApiFallback: true,
    client: {
      overlay: {
        warnings: false,
      },
    },
  },
};

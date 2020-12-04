/*
 * @Author: louzhedong
 * @Date: 2020-04-02 16:00:17
 * @LastEditors: louzhedong
 * @LastEditTime: 2020-12-03 15:25:36
 * @Description: 描述
 * @@Copyrigh: © 2020 杭州杰竞科技有限公司 版权所有
 */
const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const SetScriptTimestampPlugin = require('./plugins/SetScriptTimestampPlugin');
const HelloPlugin = require('./plugins/HelloPulgin');
const webpack = require('webpack');

module.exports = {
  entry: path.resolve(__dirname, 'src/index.js'),
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: '[name].bundle.js',
  },
  mode: 'development',
  devtool: 'inline-source-map',
  devServer: {
    contentBase: path.resolve(__dirname, 'dist'),
    host: '0.0.0.0',
    open: true,
  },
  module: {
    rules: [
      {
        test: /\.css$/,
        use: ['style-loader', 'css-loader'],
      },
    ],
  },
  plugins: [
    new HtmlWebpackPlugin({ template: 'public/index.html' }),
    new HelloPlugin({ options: true }),
    new SetScriptTimestampPlugin(),
  ],
};

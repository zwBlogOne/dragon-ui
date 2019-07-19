const path = require('path');
const webpack = require('webpack');
const UglifyJsPlugin = require('uglifyjs-webpack-plugin');
const OptimizeCSSAssetsPlugin = require('optimize-css-assets-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
// const { BundleAnalyzerPlugin } = require('webpack-bundle-analyzer');
const config = require('./config.base');

const env = process.env.NODE_ENV;
const version = process.env.VERSION || require('../../package.json').version;

config.mode = 'development';
config.devtool = 'source-map';

config.entry = {
  'dragon-ui': [
    './components/index.tsx',
  ],
};

config.output = {
  library: 'dragon-ui',
  libraryTarget: 'umd',
  path: path.join(process.cwd(), 'dist'),
  filename: '[name].js',
};

config.externals = {
  react: {
    root: 'React',
    commonjs2: 'react',
    commonjs: 'react',
    amd: 'react',
  },
  'react-dom': {
    root: 'ReactDOM',
    commonjs2: 'react-dom',
    commonjs: 'react-dom',
    amd: 'react-dom',
  },
};

const cssConfig = {
  filename: '[name].css',
};

if (env === 'production') {
  cssConfig.filename = '[name].min.css';
  config.mode = 'production';
  config.output.filename = '[name].min.js';
  config.optimization = {
    minimizer: [
      new UglifyJsPlugin({
        cache: true,
        parallel: true,
        sourceMap: true,
        uglifyOptions: {
          output: {
            comments: false,
          },
        },
      }),
      new OptimizeCSSAssetsPlugin({}),
    ],
  };

  // config.plugins.push(new BundleAnalyzerPlugin({
  //   analyzerMode: 'static',
  // }));
}

config.plugins.push(
  new MiniCssExtractPlugin(cssConfig),
  new webpack.BannerPlugin(`
  dragon-ui v${version}

  Github: https://jeromelin.github.io/dragon-ui/

  Copyright (c) 2013-present, ZhonganTech, Inc.

  This source code is licensed under the MIT license found in the
  LICENSE file in the root directory of this source tree.
`)
);

config.plugins.push(new webpack.DefinePlugin({
  'process.env.NODE_ENV': JSON.stringify(env || 'production'),
  __DEBUG__: false,
}));

module.exports = config;

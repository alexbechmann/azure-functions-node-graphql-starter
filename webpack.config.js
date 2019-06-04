const fs = require('fs');
const path = require('path');
const WebpackBar = require('webpackbar');
const nodeExternals = require('webpack-node-externals');
const rootDir = path.resolve(__dirname);

const IS_DEV = process.env.NODE_ENV === 'development';

let dirs = [];
for (const file of fs.readdirSync(rootDir)) {
  if (fs.statSync(path.join(rootDir, file)).isDirectory() && fs.existsSync(path.join(rootDir, file, 'function.json'))) {
    dirs = [...dirs, file];
  }
}

module.exports = {
  entry: dirs.reduce((acc, dir) => {
    acc[dir] = path.resolve(rootDir, dir, 'index.ts');
    return acc;
  }, {}),
  mode: process.env.NODE_ENV,
  target: 'node',
  externals: [nodeExternals()],
  module: {
    rules: [
      {
        test: /\.(js|jsx|ts|tsx)$/,
        loader: 'ts-loader',
        options: {
          transpileOnly: true,
          configFile: path.resolve(__dirname, 'tsconfig.json')
        }
      },
      {
        test: /\.(js|jsx|ts|tsx)?$/,
        loader: 'prettier-loader',
        exclude: /node_modules/
      }
    ]
  },
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: '[name]/index.js',
    library: 'library',
    libraryTarget: 'umd'
  },
  resolve: {
    extensions: ['.ts', '.tsx', '.mjs', '.js', '.graphql']
  },
  plugins: [
    new WebpackBar({
      name: 'functions'
    })
  ]
};

import path from 'path';
import webpack from 'webpack';

const resolve = path.resolve;
const CONTEXT = resolve(__dirname, 'src');


export default (env = {}) => {
  const config = {module: {rules: []}, plugins: []};

  config.context = CONTEXT;

  config.entry = {
    index: resolve(CONTEXT, 'index.js')
  };

  config.output = {
    path: resolve(__dirname, 'dist'),
    filename: `interface${env.min ? '.min' : ''}.js`,
    sourceMapFilename: '[file].map',
    library: 'Interface',
    libraryTarget: 'umd'
  };

  config.module.rules.push({
    test: /\.(m)?js$/,
    exclude: /node_modules/,
    use: [
      {
        loader: 'babel-loader'
      }
    ]
  });

  if (env.min) {
    config.plugins.push(new webpack.optimize.UglifyJsPlugin({
      compress: {
        warnings: false,
        dead_code: true // eslint-disable-line camelcase
      },
      mangle: true,
      output: {
        comments: false
      },
      sourceMap: true
    }));
  }

  config.bail = true;

  config.devtool = 'cheap-module-source-map';

  return config;
};

import {resolve} from 'path';
import webpack from 'webpack';

const CONTEXT = resolve(__dirname, 'src');


export default (env = {}) => {
  const config = {module: {rules: []}, plugins: []};

  config.context = CONTEXT;

  config.entry = {
    index: resolve(CONTEXT, 'index.js')
  };

  config.output = {
    path: resolve(__dirname, 'dist'),
    filename: env.min ? 'interface.min.js' : 'interface.js',
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

  config.node = {
    // Don't mock "process".
    process: false
  };

  config.bail = true;

  config.devtool = 'source-map';

  return config;
};

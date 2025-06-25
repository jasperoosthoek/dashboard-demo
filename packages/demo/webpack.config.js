const { NxAppWebpackPlugin } = require('@nx/webpack/app-plugin');
const { NxReactWebpackPlugin } = require('@nx/react/webpack-plugin');
const { join, resolve } = require('path');

const path = require('path');
const fs = require('fs');

// const TsconfigPathsPlugin = require('tsconfig-paths-webpack-plugin');

const config = {
  output: {
    path: join(__dirname, '../dist/demo'),
  },
  devServer: {
    port: 4200,
    historyApiFallback: {
      index: '/index.html',
      disableDotRule: true,
      htmlAcceptHeaders: ['text/html', 'application/xhtml+xml'],
    },
  },
  plugins: [
    new NxAppWebpackPlugin({
      tsConfig: './tsconfig.app.json',
      compiler: 'babel',
      main: './src/main.tsx',
      index: './src/index.html',
      baseHref: '/',
      assets: ['./src/favicon.png', './src/assets', "./src/mockServiceWorker.js"],
      styles: ['./src/styles.scss'],
      outputHashing: process.env['NODE_ENV'] === 'production' ? 'all' : 'none',
      optimization: process.env['NODE_ENV'] === 'production',
    }),
    new NxReactWebpackPlugin({
      // Uncomment this line if you don't want to use SVGR
      // See: https://react-svgr.com/
      // svgr: false
    }),
  ],
  resolve: {
    symlinks: false,
  },
    ignoreWarnings: [
    {
      module: /tough-cookie/,
      message: /Critical dependency: require function is used/,
    },
  ],
};

if (true || process.env.DEVELOP_REACT_TOOLBOX === 'true') {
  const reactToolboxPath = path.resolve(__dirname, '../../../react-toolbox/src');
  const aliasReactDom = {
    'react': resolve(__dirname, '../../node_modules/react'),
    'react-dom': resolve(__dirname, '../../node_modules/react-dom'),
  }
  if (fs.existsSync(reactToolboxPath)) {
    console.log(`Loading module @jasperoosthoek/react-toolbox from ${reactToolboxPath}`);


    config.resolve = {
      ...config.resolve,
      symlinks: false,
      alias: {
        '@jasperoosthoek/react-toolbox': reactToolboxPath,
        'react-dnd': resolve(__dirname, '../../node_modules/react-dnd'),
        'react-dnd-html5-backend': resolve(__dirname, '../../node_modules/react-dnd-html5-backend'),
        'react-toastify': resolve(__dirname, '../../node_modules/react-toastify'),
        ...aliasReactDom,
      }
    };
  } else {
    console.log('Failed to locate the @jasperoosthoek/react-toolbox module at', reactToolboxPath);
  }
  
  const zustandCrudRegistryPath = path.resolve(__dirname, '../../../react-router-zustand/app/crud');
  if (fs.existsSync(zustandCrudRegistryPath)) {
    console.log(`Loading module @jasperoosthoek/zustand-crud-registry from ${zustandCrudRegistryPath}`);

    config.resolve = {
      ...config.resolve,
      symlinks: false,
      alias: {
        ...config.resolve.alias || {},
        // '@jasperoosthoek/zustand-crud-registry': zustandCrudRegistryPath,
        'zustand': resolve(__dirname, '../../node_modules/zustand'),
        'tslib': resolve(__dirname, '../../node_modules/tslib'),
        ...aliasReactDom,
      }
    };
  } else {
    console.log('Failed to locate the @jasperoosthoek/zustand-crud-registry module at', zustandCrudRegistryPath);
  }
}

module.exports = config;

// dev config: common config + dev environment configuration
const { merge } = require("webpack-merge"); // merge webpack configs
const commonConfig = require("./webpack.common"); // import the common config file
const { HotModuleReplacementPlugin } = require("webpack");

// export the merged common + dev environment configs
module.exports = merge(commonConfig, {
  // change webpack behavior depending on the runtime environment
  mode: "development", // https://webpack.js.org/configuration/mode/#mode-development

  // https://webpack.js.org/configuration/devtool/
  // produces a source map file that "decodes" the minified bundle.js file
  // helps with debugging to map to correct (source code) line numbers
  devtool: "inline-source-map",

  // set up the development server
  devServer: {
    // HMR: https://webpack.js.org/concepts/hot-module-replacement/
    hot: true, // hot-reloading (whenever file changes are saved)
    port: 3000,
    contentBase: "./dist", // server the dist/ dir (index.html and bundle.js)
  },

  // rules for how webpack should build and process the dep tree
  // https://webpack.js.org/configuration/module/#modulerules
  module: {
    rules: [
      {
        // regex rule for which files the rule applies to
        test: /\.js$/, // anything ending in .js in this case
        // how to process files matching the rule
        use: ["source-map-loader"], // produces a build/bundle.js.map file in output
        // when to apply the rule
        enforce: "pre", // before bundling to create the sourcemap from source code not bundled code
      },
    ],
  },

  // plugin for implementing HMR
  plugins: [
    new HotModuleReplacementPlugin(),
  ],
});

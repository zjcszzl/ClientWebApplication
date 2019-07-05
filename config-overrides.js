// const { injectBabelPlugin } = require('react-app-rewired')

// module.exports = function override(config, env) {
//    config = injectBabelPlugin(
//      ['import', { libraryName: 'antd-mobile', libraryDirectory: 'es', style: 'css' }],
//      config,
//    )
//   return config
// };

const {
  override,
  fixBabelImports
} = require("customize-cra");

module.exports = override(
  fixBabelImports("import", {
    libraryName: "antd-mobile", libraryDirectory: "es", style: 'css' // change importing css to less
  })
);


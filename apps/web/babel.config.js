const { stareezyBabelPlugin } = require("@stareezy-ui/compiler");

module.exports = function (api) {
  api.cache(true);
  return {
    presets: ["babel-preset-expo"],
    plugins: [stareezyBabelPlugin()],
  };
};

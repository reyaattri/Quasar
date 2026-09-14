const { getDefaultConfig } = require("expo/metro-config");

const config = getDefaultConfig(__dirname);
// Commons speaker recordings are original Ogg audio assets.
if (!config.resolver.assetExts.includes("ogg"))
  config.resolver.assetExts.push("ogg");
module.exports = config;

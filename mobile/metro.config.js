const { getDefaultConfig } = require('expo/metro-config');

// SDK 52+ Metro already watches the pnpm workspace. Do not replace watchFolders.
module.exports = getDefaultConfig(__dirname);

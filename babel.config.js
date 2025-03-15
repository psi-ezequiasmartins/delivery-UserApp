module.exports = function(api) {
  api.cache(true);
  return {
    presets: ['babel-preset-expo'],
    // presets: ['module:metro-react-native-babel-preset'], ***
    plugins: [
      ["module:react-native-dotenv", {
        "moduleName": "@env",
        "path": ".env",
        "blacklist": null,
        "whitelist": null,
        "safe": false,
        "allowUndefined": true
      }],
    ],
  };
};

// module.exports = {
//   presets: ['babel-preset-expo'],
//   plugins: [
//     ['module:react-native-dotenv', {
//       moduleName: '@env',
//       path: '.env', // Certifique-se de que o caminho do arquivo .env está correto
//     }],
//   ],
// };
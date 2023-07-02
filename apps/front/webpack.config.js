module.exports = (config, context) => {
  // config.target = 'electron23.1-preload';
  // config.resolve.fallback['fs'] = false;
  // config.resolve.fallback['path'] = false;

  config.module.rules.push({
    test: /\.(png|jp(e*)g|svg|gif)$/,
    type: 'asset/resource',
  });

  return config;
};

const { composePlugins, withNx } = require('@nrwl/webpack');
const { withReact } = require('@nrwl/react');

module.exports = composePlugins(withNx(), withReact(), (config, { options, context }) => {
  config.target = 'electron23.1-main';
  config.resolve.fallback['fs'] = false;
  config.resolve.fallback['path'] = false;

  return config;
});

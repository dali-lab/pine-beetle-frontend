module.exports = (api) => {
  // This caches the Babel config
  api.cache(() => process.env.NODE_ENV);

  return {
    plugins: [
      '@babel/plugin-transform-runtime',
      '@babel/plugin-proposal-class-properties',
      '@babel/plugin-proposal-object-rest-spread',
      // Applies the react-refresh Babel plugin on non-production mnly
      ...(api.env('production') ? [] : ['react-refresh/babel']),
    ],
    presets: [
      // Enable development transform of React with new automatic runtime
      ['@babel/preset-react', { development: !api.env('production'), runtime: 'automatic' }],
      ['@babel/preset-env', { targets: '> 0.25%, not dead' }],
    ],
  };
};

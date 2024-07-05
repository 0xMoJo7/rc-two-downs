const withTM = require('next-transpile-modules')([]);

const nextConfig = withTM({
  reactStrictMode: true,
  typescript: {
    ignoreBuildErrors: true,
  },
});

module.exports = nextConfig;

import withTM from 'next-transpile-modules';

const nextConfig = withTM([])({
  reactStrictMode: true,
  typescript: {
    ignoreBuildErrors: true,
  },
});

export default nextConfig;


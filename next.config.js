/** @type {import('next').NextConfig} */
module.exports = {
  reactStrictMode: true,
  webpack(config) {
    config.module.rules.push({
      test: /\.svg$/i,
      issuer: /\.[jt]sx?$/,
      use: ['@svgr/webpack'],
    });

    return config;
  },
  images: {
    disableStaticImages: true, // For svg file's static typing. See https://zenn.dev/catnose99/articles/49c12f84182bdf
  },
};

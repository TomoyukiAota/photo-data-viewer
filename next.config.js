const isPdvInPlm = process.env.PDV_IN_PLM === 'True';

/** @type {import('next').NextConfig} */
module.exports = {
  // Change distDir so that running "npm run dev:plm" and "npm run dev" do not collide.
  distDir: isPdvInPlm ? '.next_plm' : module.exports.distDir,

  reactStrictMode: true,
  webpack(config, { isServer }) {
    config.module.rules.push({
      test: /\.svg$/i,
      issuer: /\.[jt]sx?$/,
      use: ['@svgr/webpack'],
    });

    if (!isServer) {
      // This is to avoid the "Module not found: Can't resolve 'fs'" error.
      // Reference: https://github.com/vercel/next.js/issues/7755#issuecomment-812805708
      config.resolve.fallback.fs = false;

      // config.target needs to be different value for different deployment.
      // To deploy as standalone app, config.target needs to be the default value, so it's not set.
      // To deploy in Photo Location Map, set config.target to 'electron-renderer' to be able to call the functions in fs (e.g. fs.readFileSync).
      if (isPdvInPlm) {
        config.target = 'electron-renderer';
      }
    }

    return config;
  },
  images: {
    disableStaticImages: true, // For svg file's static typing. See https://zenn.dev/catnose99/articles/49c12f84182bdf
  },
};

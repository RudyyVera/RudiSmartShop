const withPWA = require("next-pwa");

module.exports = withPWA({
  pwa: {
    dest: "bublic",
    register: true,
    skipWaiting: true,
    disable: process.env.NODE_ENV === "development",
  },
  images: {
    domains: [
      "images.unsplash.com",
      "bigcommerce.vercel.store",
      "demo.vercel.store",
      "cdn11.bigcommerce.com",
    ],
    remotePatterns: [
      {
        protocol: "https",
        hostname: "images.unsplash.com",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "bigcommerce.vercel.store",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "demo.vercel.store",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "cdn11.bigcommerce.com",
        pathname: "/**",
      },
    ],
  },
});

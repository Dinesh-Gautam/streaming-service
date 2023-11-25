/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    domains: [
      "www.gravatar.com",
      "secure.gravatar.com",
      "image.tmdb.org",
      "dinesh-gautam-animated-journey-j99669r6jvpfj6qr-3000.preview.app.github.dev/",
      "images.metahub.space",
    ],
  },
};

module.exports = nextConfig;

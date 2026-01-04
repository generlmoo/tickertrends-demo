module.exports = {
  reactStrictMode: true,
  images: {
    domains: ['muckrack.com'],
  },
  env: {
    API_URL: process.env.API_URL || 'http://localhost:5000/api',
  },
};
const path = require('path')

const repo = 'WMS' // Replace with your repository name

module.exports = {
  reactStrictMode: true,
  output: 'export',
  basePath: '/WMS',
  assetPrefix: process.env.NODE_ENV === 'production' ? `/${repo}/` : '',
  webpack: (config) => {
    config.resolve.alias['@'] = path.resolve(__dirname)
    return config
  },
}

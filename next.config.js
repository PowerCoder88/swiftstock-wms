const path = require('path')

module.exports = {
  reactStrictMode: true,
  basePath: process.env.NODE_ENV === 'production' ? '/WMS' : '',
  assetPrefix: process.env.NODE_ENV === 'production' ? '/WMS/' : '',
  webpack: (config) => {
    config.resolve.alias['@'] = path.resolve(__dirname)
    return config
  },
}

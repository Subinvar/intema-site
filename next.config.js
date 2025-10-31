// next.config.mjs или next.config.js
import createNextIntlPlugin from 'next-intl/plugin';
// или: const createNextIntlPlugin = require('next-intl/plugin');

const withNextIntl = createNextIntlPlugin('./src/i18n/request.ts');

const nextConfig = {
  // turbopack: {},
};

export default withNextIntl(nextConfig);
// или для CJS:
// module.exports = withNextIntl(nextConfig);
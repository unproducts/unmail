import { defineConfig } from 'vitepress';

export default defineConfig({
  title: 'Unmail',
  description: 'A unified email service provider library for Node.js',
  themeConfig: {
    logo: '/unmail-cover.png',
    nav: [
      { text: 'Home', link: '/' },
      { text: 'Docs', link: '/docs/quick-start' },
    ],
    sidebar: {
      '/docs/': [
        {
          text: 'Documentation',
          items: [
            { text: 'Quick Start', link: '/docs/quick-start' },
            { text: 'Drivers', link: '/docs/drivers' },
            {
              text: 'Extending Unmail',
              link: '/docs/extending-unmail',
              items: [
                { text: 'Creating Drivers', link: '/docs/extending-unmail/creating-drivers' },
                { text: 'Modifying Payloads', link: '/docs/extending-unmail/modifying-payloads' },
              ],
            },
            { text: 'API Reference', link: '/docs/api-reference' },
          ],
        },
      ],
    },
    socialLinks: [{ icon: 'github', link: 'https://github.com/unproducts/unmail' }],
  },
});

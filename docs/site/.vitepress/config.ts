import { defineConfig } from 'vitepress'

export default defineConfig({
  title: "Unmail",
  description: "A unified email service provider library for Node.js",
  themeConfig: {
    logo: '/unmail-cover.png',
    nav: [
      { text: 'Home', link: '/' },
      { text: 'Docs', link: '/docs/getting-started' },
      { text: 'Drivers', link: '/docs/drivers/overview' }
    ],
    sidebar: {
      '/docs/': [
        {
          text: 'Introduction',
          items: [
            { text: 'Getting Started', link: '/docs/getting-started' },
            { text: 'Installation', link: '/docs/installation' },
            { text: 'Quick Start', link: '/docs/quick-start' },
          ]
        },
        {
          text: 'API Reference',
          items: [
            { text: 'Core', link: '/docs/api/core' },
            { text: 'Types', link: '/docs/api/types' },
            { text: 'Responses', link: '/docs/api/responses' }
          ]
        },
        {
          text: 'Drivers',
          items: [
            { text: 'Overview', link: '/docs/drivers/overview' },
            { text: 'Available Drivers', link: '/docs/drivers/available-drivers' },
            { text: 'Creating Drivers', link: '/docs/drivers/creating-drivers' },
          ]
        }
      ],
    },
    socialLinks: [
      { icon: 'github', link: 'https://github.com/unproducts/unmail' }
    ]
  }
})

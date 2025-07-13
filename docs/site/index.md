---
layout: home

hero:
  name: "@unproducts/unmail"
  text: "Unified Email Service Provider"
  tagline: A powerful, type-safe library for sending emails through multiple providers with a single interface
  image:
    src: /unproducts-logo.png
    alt: Unproducts Logo
  actions:
    - theme: brand
      text: Get Started
      link: /docs/quick-start
    - theme: alt
      text: View on GitHub
      link: https://github.com/unproducts/unmail

features:
  - icon: 🚀
    title: Multiple Providers
    details: Support for SendGrid, Mailchimp, Mailjet, MailerSend, Resend, Postmark, and more
  - icon: 🔄
    title: Unified Interface
    details: Single consistent API across all email service providers
  - icon: 🛡️
    title: Type Safety
    details: Built with TypeScript for robust type checking and better developer experience
  - icon: 📧
    title: Rich Email Features
    details: Support for templates, attachments, CC/BCC, custom headers, and more
  - icon: 🧪
    title: Testing Support
    details: Built-in mock driver for testing email functionality
  - icon: 🔌
    title: Extensible
    details: Easy to add new email service providers through the driver interface
---

<style>
:root {
  --vp-home-hero-name-color: transparent;
  --vp-home-hero-name-background: -webkit-linear-gradient(120deg, #9BA5DE 30%, #8188D3);

  --vp-home-hero-image-background-image: linear-gradient(-45deg, #22223B 50%, #9BA5DE 50%);
  --vp-home-hero-image-filter: blur(44px);
}

@media (min-width: 640px) {
  :root {
    --vp-home-hero-image-filter: blur(56px);
  }
}

@media (min-width: 960px) {
  :root {
    --vp-home-hero-image-filter: blur(68px);
  }
}
</style>

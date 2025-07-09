<img src="/docs/unmail-cover.png"/>

# @unproducts/unmail

<!-- automd:badges color=yellow -->

[![npm version](https://img.shields.io/npm/v/@unproducts/unmail?color=yellow)](https://npmjs.com/package/@unproducts/unmail)
[![npm downloads](https://img.shields.io/npm/dm/@unproducts/unmail?color=yellow)](https://npm.chart.dev/@unproducts/unmail)

<!-- /automd -->

Unified email API for sending transactional emails across 10+ providers. You can write your own drivers too.
<br/><br/>
✅ **Built-in drivers for major providers.**<br/>
✅ **Shipped with built in server for microservice requirements.**<br/>
✅ **Built in testing drivers to mock mail sending in unit tests and local development.**<br/>
✅ **Comprehensive support for writing custom drivers.**<br/>
✅ **Support for raw SMTP (via Node Mailer)**<br/>

<img src="/docs/unmail-info.png" width="600"/>

## Supported Drivers Checklist

| Name       | Status |
| ---------- | ------ |
| Mailchimp  | ✅     |
| Mailersend | ✅     |
| Resend     | ✅     |
| Sendgrid   | ✅     |
| Mailjet    | ✅     |
| Postmark   | ✅     |
| Listmonk   |        |
| Sendinblue |        |

## Usage

Install package:

<!-- automd:pm-install -->

```sh
# ✨ Auto-detect
npx nypm install @unproducts/unmail

# npm
npm install @unproducts/unmail

# yarn
yarn add @unproducts/unmail

# pnpm
pnpm install @unproducts/unmail

# bun
bun install @unproducts/unmail

# deno
deno install @unproducts/unmail
```

<!-- /automd -->

Import:

**ESM** (Node.js, Bun)

```js
import { createUnmail } from '@unproducts/unmail';
```

**CommonJS** (Legacy Node.js)

```js
const { createUnmail } = require('@unproducts/unmail');
```

## Development

<details>

<summary>local development</summary>

- Clone this repository
- Install latest LTS version of [Node.js](https://nodejs.org/en/)
- Install dependencies using `yarn install`
- Run interactive tests using `yarn dev`

</details>

## License

<!-- automd:contributors license=MIT -->

Published under the [MIT](https://github.com/unproducts/unmail/blob/main/LICENSE) license.
Made by [community](https://github.com/unproducts/unmail/graphs/contributors) 💛
<br><br>
<a href="https://github.com/unproducts/unmail/graphs/contributors">
<img src="https://contrib.rocks/image?repo=unproducts/unmail" />
</a>

<!-- /automd -->

<!-- automd:with-automd -->

---

_🤖 auto updated with [automd](https://automd.unjs.io)_

<!-- /automd -->

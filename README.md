# Base nuxt3 template

This is a basic nuxt3 template with some modules and packages installed and common settings used.

Look at the [Nuxt 3 documentation](https://nuxt.com/docs/getting-started/introduction) to learn more.

## Table of contents

- [Base nuxt3 template](#base-nuxt3-template)
  - [Table of contents](#table-of-contents)
  - [Setup](#setup)
  - [Env config](#env-config)
    - [Fields](#fields)
  - [Installed modules](#installed-modules)
  - [Vite plugins](#vite-plugins)
  - [Development Server](#development-server)
    - [Local](#local)
    - [With nginx](#with-nginx)
  - [Production](#production)

## Setup

Make sure to install the dependencies:

```bash
npm i  # npm
pnpm i # pnpm
```

## Env config

Copy `.env.development` to `.env.development.local` and edit it.

```bash
cp .env.development .env.development.local
vim .env.development.local
```

### Fields
- `DEV_SERVER_HOST` - Development server host.
- `DEV_SERVER_PORT` - Development server port.

## Installed modules
- [@unocss/nuxt](https://unocss.dev/integrations/nuxt) - The Nuxt module for UnoCSS.
- [@vueuse/nuxt](https://vueuse.org/nuxt/README.html) - An add-on of VueUse, which provides better Nuxt integration auto-import capabilities.
- [nuxt-purgecss](https://nuxt.com/modules/purgecss) - Drop superfluous CSS!

## Vite plugins
- [vite-plugin-remove-console](https://www.npmjs.com/package/vite-plugin-remove-console) - A vite plugin that remove all the specified console types in the production environment.

## Development Server

Start the development command is:

```bash
npm run dev   #npm
pnpm run dev  #pnpm
```

### Local

Start the development server on `http://DEV_SERVER_HOST:DEV_SERVER_PORT`, default is `http://localhost:3000`.

### With nginx

This is a basic nginx configuration with ssl for a development server:

```nginx
server {
  listen 443 http2 ssl;
  server_name SERVER_NAME; # Replace SERVER_NAME with your real domain.

  # Headers

  # If you want to use nuxt-devtools, set the value to SAMEORIGIN.
  add_header X-Frame-Options "DENY" always;

  # SSL
  # Load your ssl configuration or setup certificate.

  # Dev server
  location / {
    proxy_buffering off;
    proxy_http_version 1.1;
    proxy_redirect off;
    proxy_request_buffering off;
    proxy_set_header Connection "upgrade";
    proxy_set_header Host $host;
    proxy_set_header REMOTE_ADDR $remote_addr;
    proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
    proxy_set_header X-Forwarded-Proto $scheme;
    proxy_set_header X-Real-IP $remote_addr;
    proxy_set_header Upgrade $http_upgrade;
    proxy_pass http://DEV_SERVER_HOST:DEV_SERVER_PORT; # Replace SERVER_HOST and SERVER_PORT with .env.development.local field value.
  }
}
```

## Production

Build the application for production:

```bash
npm run build
```

Locally preview production build:

```bash
npm run preview
```

Check out the [deployment documentation](https://nuxt.com/docs/getting-started/deployment) for more information.

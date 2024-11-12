# 2048 game

[![Unit tests](https://github.com/aliaks-ei/game-2048/actions/workflows/unit-tests.yml/badge.svg)](https://github.com/aliaks-ei/game-2048/actions/workflows/unit-tests.yml)
[![E2E tests](https://github.com/aliaks-ei/game-2048/actions/workflows/e2e-tests.yml/badge.svg)](https://github.com/aliaks-ei/game-2048/actions/workflows/e2e-tests.yml)
[![Netlify Status](https://api.netlify.com/api/v1/badges/c08b8cee-71fd-4c1a-917d-889238349fd0/deploy-status)](https://app.netlify.com/sites/game-2048-aliaksei/deploys)

## Project Setup

```sh
npm install
```

### Compile and Hot-Reload for Development

```sh
npm run dev
```

### Type-Check, Compile and Minify for Production

```sh
npm run build
```

### Run Unit Tests with [Vitest](https://vitest.dev/)

```sh
npm run test:unit
```

### Run End-to-End Tests with [Cypress](https://www.cypress.io/)

```sh
npm run test:e2e:dev
```

This runs the end-to-end tests against the Vite development server.
It is much faster than the production build.

But it's still recommended to test the production build with `test:e2e` before deploying (e.g. in CI environments):

```sh
npm run build
npm run test:e2e
```

### Lint with [ESLint](https://eslint.org/)

```sh
npm run lint
```

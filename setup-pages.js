#!/usr/bin/env node
/**
 * Run once: node setup-pages.js
 * Creates the GitHub Actions workflow for GitHub Pages deployment.
 */
const fs = require('fs');
const path = require('path');

const workflowDir = path.join(__dirname, '.github', 'workflows');
const workflowFile = path.join(workflowDir, 'deploy.yml');

const yaml = `name: Deploy to GitHub Pages

on:
  push:
    branches: [main]
  workflow_dispatch:

permissions:
  contents: read
  pages: write
  id-token: write

concurrency:
  group: pages
  cancel-in-progress: true

jobs:
  build:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: 20
          cache: npm
      - run: npm ci
      - run: npm run build-nolog
      - uses: actions/upload-pages-artifact@v3
        with:
          path: dist

  deploy:
    needs: build
    runs-on: ubuntu-latest
    environment:
      name: github-pages
      url: \${{ steps.deployment.outputs.page_url }}
    steps:
      - uses: actions/deploy-pages@v4
`;

fs.mkdirSync(workflowDir, { recursive: true });
fs.writeFileSync(workflowFile, yaml, 'utf8');

console.log('✅ Fichier créé : .github/workflows/deploy.yml');
console.log('');
console.log('Prochaines étapes :');
console.log('  1. git add .github');
console.log('  2. git commit -m "Add GitHub Pages deployment"');
console.log('  3. git push');
console.log('  4. Sur GitHub : Settings → Pages → Source → GitHub Actions');
console.log('');
console.log('Ton jeu sera en ligne sur :');
console.log('  https://LienardEdwin.github.io/devoxx-gamejam/');

// These are important and needed before anything else

import 'zone.js/dist/zone-node';
// tslint:disable-next-line: no-implicit-dependencies
import 'reflect-metadata';

// Required for Firebase
(global as any).WebSocket = require('ws');
(global as any).XMLHttpRequest = require('xmlhttprequest').XMLHttpRequest;

import { enableProdMode } from '@angular/core';
import { existsSync, mkdirSync, readFileSync, writeFileSync } from 'fs';
import { join } from 'path';

// Faster server renders w/ Prod mode (dev mode never needed)
enableProdMode();

// Import module map for lazy loading
import { provideModuleMap } from '@nguniversal/module-map-ngfactory-loader';
import { renderModuleFactory } from '@angular/platform-server';
import { ROUTES } from './static.paths';

// * NOTE :: leave this as require() since this file is built Dynamically from webpack
// tslint:disable-next-line: no-require-imports
const { AppServerModuleNgFactory, LAZY_MODULE_MAP } = require('./dist/server/main');

const BROWSER_FOLDER = join(process.cwd(), 'browser');

// Load the index.html file containing referances to your application bundle.
const index = readFileSync(join('browser', 'index.html'), 'utf8');

let previousRender = Promise.resolve();

// Iterate each route path
ROUTES.forEach(route => {
  const fullPath = join(BROWSER_FOLDER, route);

  // Make sure the directory structure is there
  if (!existsSync(fullPath)) {
    mkdirSync(fullPath);
  }

  // Writes rendered HTML to index.html, replacing the file if it already exists.
  previousRender = previousRender.then(_ => renderModuleFactory(AppServerModuleNgFactory, {
    document: index,
    url: route,
    extraProviders: [
      provideModuleMap(LAZY_MODULE_MAP)
    ]
  })).then(html => writeFileSync(join(fullPath, 'index.html'), html));
});

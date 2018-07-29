// tslint:disable:no-console no-require-imports no-implicit-dependencies no-import-side-effect

// These are important and needed before anything else
import 'zone.js/dist/zone-node';
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

const { AppServerModuleNgFactory, LAZY_MODULE_MAP } = require('./dist/server/main');

const BROWSER_FOLDER = join(process.cwd(), 'browser');

async function prerender(): Promise<any> {
  // Load the index.html file containing references to your application bundle.
  const index = await readFileSync(join('browser', 'index.html'), 'utf8');

  // Iterate each route path
  for (const route of ROUTES) {
    const fullPath = join(BROWSER_FOLDER, route);

    // Make sure the directory structure is there
    if (!existsSync(fullPath)) {
      mkdirSync(fullPath);
    }

    // Writes rendered HTML to index.html, replacing the file if it already exists.
    const html = await renderModuleFactory(AppServerModuleNgFactory, {
      document: index,
      url: route,
      extraProviders: [
        provideModuleMap(LAZY_MODULE_MAP)
      ]
    });

    await writeFileSync(join(fullPath, 'index.html'), html);
    console.log(`${route} done`);
  }
  console.log('prerender done');
  process.exit();
}

prerender();

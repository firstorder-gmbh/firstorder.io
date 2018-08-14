<p align="center">
  <img src="src/assets/img/favicons/safari-pinned-tab.svg" alt="Logo" height="320"/>
</p>

# firstorder.io
[![Travis](https://img.shields.io/travis/firstorder-gmbh/firstorder.io.svg)](https://travis-ci.org/firstorder-gmbh/firstorder.io)
[![CodeFactor](https://www.codefactor.io/repository/github/firstorder-gmbh/firstorder.io/badge)](https://www.codefactor.io/repository/github/firstorder-gmbh/firstorder.io)

<em>ORDER, ORDER, ORDER!</em>

<strong>First Order's mission is to standardize all websites</strong>
with cutting edge technology and best web design guidelines that support all devices and browsers.

## Packages & Features
* [Angular 6](https://github.com/angular/angular): Single-page application
* [Universal](https://github.com/angular/universal): Prerender, Better performance, SEO friendly
* [Material](https://github.com/angular/material2): Best design, angular components
* [Theming](https://material.angular.io/guide/theming): 6 Themes: Light-Grey, Dark-Grey, Light-Indigo, Dark-Pink, Light-Deeppurple, Dark-Purple
* [Translate](https://github.com/ngx-translate/core): English, German and Arabic
* [Bidi](https://material.angular.io/cdk/bidi/overview): Right-To-Left for Arabic
* [RxJS](https://github.com/reactivex/rxjs): Reactive Extensions for JavaScript
* [HtmlLint](https://github.com/htmllint/htmllint): Lint all Html templates
* [StyleLint](https://github.com/stylelint/stylelint): Lint all scss files
* [TSLint](https://github.com/palantir/tslint): Lint all TypeScript files
* [Travis CI](https://github.com/travis-ci/travis-ci): Continous Intergration with Travis
* [Firebase](https://firebase.google.com): Deploy website on Firebase

## Getting Started

This demo is built following the [Angular-CLI Wiki guide](https://github.com/angular/angular-cli/wiki/stories-universal-rendering)

We're utilizing packages from the [Angular Universal @nguniversal](https://github.com/angular/universal) repo, such as [ng-module-map-ngfactory-loader](https://github.com/angular/universal/modules/module-map-ngfactory-loader) to enable Lazy Loading.

---

### Build Time Prerendering Vs. Server Side Rendering(ssr)
This repo demonstrates the use of 2 different forms of Server Side Rendering.

**Prerender** 
* Happens at build time
* Renders your application and replaces the dist index.html with a version rendered at the route `/`.

**Server-Side Rendering(ssr)**
* Happens at runtime
* Uses `ngExpressEngine` to render your application on the fly at the requested url.

---

### Installation
* `npm install` or `yarn`
* `npm install -g firebase-tools`
* `cd functions && npm install && cd ..`

### Development (Client-side only rendering)
* run `npm run start` which will start `ng serve`

### Production (also for testing SSR/Pre-rendering locally)
**`npm run build:ssr && npm run serve:ssr`** - Compiles your application and spins up a Node Express to serve your Universal application on `http://localhost:4000`.

**`npm run build:prerender && npm run serve:prerender`** - Compiles your application and prerenders your applications files, spinning up a demo http-server so you can view it on `http://localhost:8080`
**Note**: To deploy your static site to a static hosting platform you will have to deploy the `dist/browser` folder, rather than the usual `dist`


## Universal "Gotchas"
Moved to [/angular/universal/blob/master/docs/gotchas.md](https://github.com/angular/universal/blob/master/docs/gotchas.md)

# License
[![MIT License](https://img.shields.io/badge/license-MIT-blue.svg?style=flat)](/LICENSE)

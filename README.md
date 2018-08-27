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
* [Travis CI](https://github.com/travis-ci/travis-ci): Continuous Integration with Travis
* [Firebase](https://firebase.google.com): Deploy website on Firebase


## Getting Started


### Firebase
This website uses [Google Firebase](https://firebase.google.com) as a back-end.

* You will need to create a Google account if you don't have one
* Get started with the [Spark Plan](https://firebase.google.com/pricing), you can upgrade later
* Create a project in the [Firebase Console](https://console.firebase.google.com), name it yourwebsite-com (if your domain is yourwebsite.com, we replace the dots with -)
* Goto Develop -> Authentication and click on Web Setup button on the upper right side, copy the config values there to src/environments/environment.ts and environment.prod.ts.
* Edit in src/environments/environment.prod.ts the origin path with https://yourwebsite.com, to solve some CORS problems on production
* Edit .firebaserc file in this repo and put yourwebsite-com, you will use it with the firebase terminal commands
* Search the entire repo for 'firstorder', check carefully every occurrence and replace it with 'yourwebsite', particularly in angular.json and package.json


### Database
This website uses [Cloud Firestore](https://firebase.google.com/docs/firestore) as a database, it's a NoSQL cloud database to store and sync data for client- and server-side.

* In your [Firebase Console](https://console.firebase.google.com) goto Develop -> Database and select Cloud Firestore
* In this repo there is a backups/myDatabase dump which you can manually restore in the console data editor. 
* Or use [firestore-backup-restore](https://www.npmjs.com/package/firestore-backup-restore) to restore it automatically
`npm install -g firestore-backup-restore`

* To restore the database, open terminal in the root project folder and run
`firestore-backup-restore --accountCredentials path/to/account/credentials/file.json --backupPath backups/myDatabase`

* To backup the database again, run
`firestore-backup-restore --restoreAccountCredentials path/to/account/credentials/file.json --backupPath backups/myDatabase --prettyPrint`

**Note**: All titles and descriptions MUST be defined in English in the database under the 'en' parameter, and optionally in other languages 'de', 'ar'.
This to ensure proper fallback to 'en' in case a translation is not found.


### Storage
Firebase Storage can keep all the files that are not static assets to the project. 
These can be product files, profile pictures or uploaded files.

We recommend storing file metadata in the Database using the same path and :fileid like is Storage:
`Database/files/:fileid/metadata`
`Storage/files/:fileid/filename.ext`


### Installation & Build
* To view/debug/test the website we use [Google Chrome](https://www.google.com/chrome).

* To edit the project we are using [Visual Studio Code](https://code.visualstudio.com). 
Download and install it. Also install the recommended extensions when prompted.

* Install [Node.js & npm](https://nodejs.org/en/download)

* Open the project in Visual Studio Code, goto -> View -> Terminal and run
`npm install` or `yarn`
`npm install -g firebase-tools`
`cd functions && npm install && cd ..`

For Development (Client-side only rendering)
* run `npm run start` which will start `ng serve`
You can now test your website locally with Chrome on `http://localhost:4200`

For Production (also for testing SSR/Pre-rendering locally)
**`npm run build:ssr && npm run serve:ssr`** - Compiles your application and spins up a Node Express to serve your Universal application on `http://localhost:4000`.

**`npm run build:prerender && npm run serve:prerender`** - Compiles your application and pre-renders your applications files, spinning up a demo http-server so you can view it on `http://localhost:8080`
**Note**: To deploy your static site to a static hosting platform you will have to deploy the `dist/browser` folder, rather than the usual `dist`


### Hosting
Firebase Hosting can be used to host your static `dist/browser` website files. It takes care of your https security certificates for free, caches your files and much more.

* First connect your domain to the hosting in the Firebase console -> Development -> Hosting.
You should have 3 domains like this:
`yourwebsite-com.firebaseapp.com` Default (already created)
`yourwebsite.com` Serve traffic from this domain
`www.yourwebsite.com` Redirect this domain to another -> yourdomain.com

* Here is how you can [deploy your website](https://firebase.google.com/docs/hosting/deploying)

* In this repo the firebase.json file is already initialized to deploy your static pre-rendered files from the `dist/browser` folder to Firebase Hosting, so just run:
`firebase login`
`firebase deploy`


All done. Navigate to https://yourwebsite.com to see it live.


# License
[![MIT License](https://img.shields.io/badge/license-MIT-blue.svg?style=flat)](/LICENSE)

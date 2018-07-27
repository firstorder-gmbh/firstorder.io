import * as functions from 'firebase-functions';
import * as admin from 'firebase-admin';
// Create and Deploy Cloud Function with TypeScript using script that is
// defined in functions/package.json:
//    cd functions
//    npm run deploy

 // Start writing Firebase Functions
 // https://firebase.google.com/docs/functions/typescript
 //
 // curl https://us-central1-$(firebase use).cloudfunctions.net/helloWorld
export const helloWorld = functions.https.onRequest((request, response) => {
  response.send('Hello from Firebase!');
});

export const duplicateProducts = functions.https.onRequest((request, response) => {
  // Copy firestore collection to a new document
  admin.initializeApp();
  const firestore = admin.firestore();
  firestore.collection('products').get().then(query => {
      query.forEach (doc => {
          const promise = firestore.collection('products').doc().set(doc.data());
      });
  });
  response.send('Products copied!');
});

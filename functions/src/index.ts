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

 // curl https://us-central1-$(firebase use).cloudfunctions.net/duplicateProducts
export const duplicateProducts = functions.https.onRequest((request, response) => {
  // Copy firestore collection to a new document
  if (!admin.apps.length) {
    admin.initializeApp();
  }
  const firestore = admin.firestore();
  void firestore.collection('products').get().then(query => {
      query.forEach (doc => {
          void firestore.collection('products').doc().set(doc.data());
      });
  });
  response.send('Products copied!');
});

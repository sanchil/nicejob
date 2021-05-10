/**
 * code for firestore data base
 * 
 * 
 * 
 */
const path = require('path');

const Firestore = require('@google-cloud/firestore'); //console.log(path.resolve('src/keys/',process.env.GOOGLE_APPLICATION_CREDENTIALS));


const connectdb = new Firestore({
  projectId: 'nicedb314',
  keyFilename: path.resolve('src/keys/', process.env.GOOGLE_APPLICATION_CREDENTIALS)
});
/* const quickstart= async ()=>{
  // Obtain a document reference.
  //const document = db.doc('posts/intro-to-firestore');
  

const document = db.collection('Users').doc('3');

  // Enter new data into the document.
  await document.set({
    title: 'Welcome to Firestore',
    body: 'Hello World',
  });
  console.log('Entered new data into the document');

  // Update an existing document.
  await document.update({
    body: 'My first Firestore app',
  });
  console.log('Updated an existing document');

  // Read the document.
  const doc = await document.get();
  console.log('Read the document');

  // Delete the document.
  //await document.delete();
  //console.log('Deleted the document');
}
quickstart();

 */

module.exports = connectdb;
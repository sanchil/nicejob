/**
 * code for firestore queries
 * 
 * 
 * 
 */


var db = require('../index.js');

const addDoc = async (collection, id, data) => {
  const userCollections = db.collection(collection);
  return userCollections.doc(id)
    .set(data)
    .then(() => {
      console.log("Add doc called");
    })
    .catch((error) => {
      console.error("Error adding document: ", error);
    });
}

const updateDoc = async (collection, id, data) => {
  const userCollections = db.collection(collection);
  return userCollections.doc(id)
    .update(data)
    .then(() => {
      console.log("Update doc called");
    })
    .catch((error) => {
      // The document probably doesn't exist.
      console.error("Error updating document: ", error);
    });
}

const getDoc = async (collection, id) => {
  const userCollections = db.collection(collection);
  return userCollections.doc(id).get();
  /* .get()
  .then((doc) => {
    if (doc.exists) {
      console.log("Document data:", doc.data());
    } else {
      // doc.data() will be undefined in this case
      console.log("No such document!");
    }
  })
  .catch((error) => {
    // The document probably doesn't exist.
    console.log("Error getting document:", error);
  });
*/
}


const getDocSet = async (collection) => {
  const userCollections = db.collection(collection);
  return userCollections
  //  .orderBy("first_name")
   // .limit(2)
    .get();

}




module.exports = {
  addDoc,
  updateDoc,
  getDoc,
  getDocSet
}


//####################################################################

//const docRef = db.collection('users').doc('alovelace');


/* await docRef.set({
  first: 'Ada',
  last: 'Lovelace',
  born: 1815
});

const snapshot = await db.collection('users').get();
snapshot.forEach((doc) => {
  console.log(doc.id, '=>', doc.data());
});
 */

//####################################################################
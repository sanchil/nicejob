/**
 * ##########################################################################
 * ##########################################################################
 * ##########################################################################
 * code for firestore queries
 * 
 * 
 * ##########################################################################
 */
const {
  nanoid
} = require('nanoid');

var connectdb = require('../../firedb');
/**
 * ##########################################################################
 * Writes a document to the database, and to the in-memory cache.
 * ### Parameters
 *
 * | Parameter    | Type   | Required | Description |
 * | ------------ | ------ | -------- | ----------- |
 * | `collection` | `string` whose value is enforced by `DataType` | &check;  | Firestore collection |
 * | `id`         | `string` | &check;  | Firestore document ID |
 * | `document`   | `object` whose shape is enforced by `DataType` | &check;  | Firestore document ID |
 * ##########################################################################
 */


const write = async (params, data) => {
  const userCollections = connectdb.collection(params.collection);
  let newid = "";

  if (params.id) {
    return userCollections.doc(params.id).update(data).then(() => {
      console.log("Update doc called");
    }).catch(error => {
      // The document probably doesn't exist.
      console.error("Error updating document: ", error);
    });
  } else {
    if (data.email) {
      newid = data.email.replace(/\s+/g, '') + '_' + nanoid(4);
    } else {
      newid = nanoid(4);
    }

    console.log("Datra: ", data.email);
    return userCollections.doc(newid).set(data).then(() => {
      console.log("Add doc called");
    }).catch(error => {
      console.error("Error adding document: ", error);
    });
  }
};
/**
 * ##########################################################################
 * Retrieves a single document from the database, or, if applicable, 
 * from the in-memory cache.
 * 
 * 
 * ##########################################################################
 */


const readOne = async params => {
  var getOptions = {
    source: 'cache'
  };
  const userCollections = connectdb.collection(params.collection);
  return userCollections.doc(params.id).get(getOptions).then(doc => doc).catch(err => {
    // add a check to an error code.
    return userCollections.doc(params.id).get();
  });
};
/**
 * ##########################################################################
 * Retrieves a set of documents from the database, or, if applicable, 
 * from the in-memory cache.
 * 
 * 
 * ##########################################################################
 */


const readMany = async (params, lim) => {
  const userCollections = connectdb.collection(params.collection);
  const limNum = parseInt(Number(lim));
  var getOptions = {
    source: 'cache'
  };

  if (limNum > 0) {
    return userCollections.limit(limNum).get(getOptions).then(doc => doc).catch(err => {
      // add a check to an error code.
      return userCollections.limit(limNum).get();
    });
  } else {
    return [];
  }
};

module.exports = {
  write,
  readOne,
  readMany
};
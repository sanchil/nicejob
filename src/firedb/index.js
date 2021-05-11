/**
 * code for firestore data base
 * 
 * 
 * 
 */


const path  = require('path');
const Firestore = require('@google-cloud/firestore');
 
const fireDBCon = new Firestore();



module.exports = fireDBCon;
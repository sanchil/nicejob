/**
 * #############################################################
 * 
 * 
 * 
 * 
 * #############################################################
 */

var Database = require('fire-store-api');
const { json } = require('express');

const db = new Database({
    project_id: process.env.PROJID,
    cache_max_age: process.env.NICEAPP_CACHE_MAX_AGE,
    cache_allocated_memory: process.env.NICEAPP_CACHE_ALLOCATED_MEM
});

const readOneCtrl = (req, res, next) => {
    if (req.params.id) {
        db.readOne(req.params).then(doc => {
            if (doc.exists) {
                res.json(doc.data());
            } else {

                console.log("No such document!");
                res.json({ "error": "Document does not exist" });
            }
        }).catch(error => {
            // The document probably doesn't exist.
            console.log("Error getting document:", error);
            res.json({ "error": error });
        });
    } else {
        console.log("Get Doc failed. Improper Id");
        res.json({ "error": "Get Doc failed. Improper Id" });
    }
};

const readManyCtrl = (req, res, next) => {
    if (req.params.collection) {
        let arr = [];
        const lim = req.query.limit ? req.query.limit : 10;
        console.log("limit: ", lim);
        db.readMany(req.params, lim).then(snapshots => {
            snapshots.forEach(doc => {
                arr.push(doc.data());
            });
        }).then(() => {
            res.json(arr);
        }).catch(err => {
            console.log(err);
            res.json(err);
        });
    } else {
        console.log("Get collections failed");
        res.json({ "error": "Get Doc collections failed. Improper Id" });
    }
};

const writeCtrl = (req, res, next) => {
    const params = {};
    params['collection'] = req.params.collection;
    params['id'] = req.params.id;
    db.write(params, req.body);

    res.json(req.body);
};

const updateDocCtrl = (req, res, next) => {
    if (req.params.id) {
        queries.updateDoc(req.params.collection, req.params.id, req.body);
    } else {
        console.log("Doc update failed. Improper Id");
    }
    res.json(req.body);
};

module.exports = {
    writeCtrl,
    readOneCtrl,
    updateDocCtrl,
    readManyCtrl
};
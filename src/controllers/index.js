/**
 * #############################################################
 * 
 * 
 * 
 * 
 * #############################################################
 */

const { google } = require('googleapis');
const Compute = require('@google-cloud/compute');
const { JWT } = require('google-auth-library');


const fetch = require('node-fetch');
const fs = require('fs');

var Database = require('fire-store-api');
const { json } = require('express');

const db = new Database({
    project_id: process.env.PROJID,
    cache_max_age: process.env.NICEAPP_CACHE_MAX_AGE,
    cache_allocated_memory: process.env.NICEAPP_CACHE_ALLOCATED_MEM,
});

const basicContrl = (req, res, next) => {
    console.log("Url: ", req.url);
    res.json({ "hello": "world !!!" });

}


const readOneCtrl = (req, res, next) => {
    if (req.params.id) {
        db.readOne(req.params)
            .then((doc) => {
                if (doc.exists) {
                    res.json(doc.data());
                } else {

                    console.log("No such document!");
                    res.json({ "error": "Document does not exist" });
                }
            })
            .catch((error) => {
                // The document probably doesn't exist.
                console.log("Error getting document:", error);
                res.json({ "error": error });
            });

    } else {
        console.log("Get Doc failed. Improper Id");
        res.json({ "error": "Get Doc failed. Improper Id" });
    }
    //next();

}

const readManyCtrl = (req, res, next) => {
    if (req.params.collection) {
        let arr = [];
        const lim = req.query.limit ? req.query.limit : 10;
        console.log("limit: ", lim);
        db.readMany(req.params, lim)
            .then((snapshots) => {
                snapshots.forEach((doc) => {
                    arr.push(doc.data());
                })
            })
            .then(() => {
                res.json(arr);
            })
            .catch(err => {
                console.log(err);
                res.json(err);
            })

    } else {
        console.log("Get collections failed");
        res.json({ "error": "Get Doc collections failed. Improper Id" });
    }
    //next();

}


const writeCtrl = (req, res, next) => {
    const params = {}
    params['collection'] = req.params.collection;

    db.write(params, req.body);

    res.json(req.body);
    //next();
}


const updateDocCtrl = (req, res, next) => {

    if (req.params.id) {
        const params = {}
        params['collection'] = req.params.collection;
        params['id'] = req.params.id;
        //console.log("Controller params id",params['id']);
        db.write(req.params, req.body);
    } else {
        console.log("Doc update failed. Improper Id");
    }
    res.json(req.body);
    //next();
}

// for routehandler for  /health



const createJwt = (projectId, privateKeyFile, algorithm) => {
    // Create a JWT to authenticate this device. The device will be disconnected
    // after the token expires, and will have to reconnect with a new token. The
    // audience field should always be set to the GCP project id.
    const token = {
        iat: parseInt(Date.now() / 1000),
        exp: parseInt(Date.now() / 1000) + 20 * 60, // 20 minutes
        aud: projectId,
    };
    const privateKey = fs.readFileSync(privateKeyFile);
    return jwt.sign(token, privateKey, { algorithm: algorithm });
}


const healthReportCtrl = (req, res, next) => {

    let keys = JSON.parse(fs.readFileSync(process.env.GOOGLE_APPLICATION_CREDENTIALS));


    /*   async function main() {
         const client = new JWT({
           email: keys.client_email,
           key: keys.private_key,
           scopes: ['https://www.googleapis.com/auth/cloud-platform'],
         });
         const url = `https://dns.googleapis.com/dns/v1/projects/${keys.project_id}`;
         const result = await client.request({url});
         console.log(client);
         res.json(client);
       }
       
       main().catch(console.error);  */


    /*   
*/

    async function getToken() {
        const client = new JWT({
            email: keys.client_email,
            key: keys.private_key,
            scopes: ['https://www.googleapis.com/auth/cloud-platform'],
        });
        const url = `https://dns.googleapis.com/dns/v1/projects/${keys.project_id}`;
        const result = await client.request({ url });

        req.session.jwt = client;
        req.session.access_token = client.credentials.access_token;
        // console.log(req.session.jwt.credentials.access_token);
        return client;

    }

    getToken()
        .then(client => {
            const url1 = `https://compute.googleapis.com/compute/v1/projects/${keys.project_id}/zones/northamerica-northeast1-b/instanceGroupManagers/nice-group/listManagedInstances`;
            fetch(url1, {
                method: 'post',
                headers: { 'Authorization': 'Bearer ' + req.session.access_token }
            })
                .then(result => result.json())
                .then(json => {
                    let report ="";
                    if (json) {
                        json.managedInstances.forEach(instance => {
                           
                            report=report+`<p><b>Instance ID:</b> ${instance.id}</p>`;
                            report=report+`<p><b>Instance Status:</b> ${instance.instanceStatus}</p>`;
                            report=report+`<p><b>Action Required:</b> ${instance.currentAction}</p>`;
                            report=report+`<p><b>InstanceStatus:</b> ${instance.instance}</p>`;
                           
                        });

                        res.send(report);
                    } else {
                        res.send('<p>No Information on current Instance Status</p>')
                    }                    
                });

        })
        .catch(console.error);



}


module.exports = {
    basicContrl,
    writeCtrl,
    readOneCtrl,
    updateDocCtrl,
    readManyCtrl,
    healthReportCtrl,
}
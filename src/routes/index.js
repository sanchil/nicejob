/**
 * #############################################################
 * 
 * 
 * 
 * 
 * #############################################################
 */

var express = require('express');
var controllers = require('../controllers');
var router = express.Router();

router
  .route('/')
  .get((req, res, next) => {
    res.json({ "hello": "world" });
  })


router
  .route('/:collection/:id')
  .get(controllers.readOneCtrl)
  .post(controllers.updateDocCtrl)

router
  .route('/:collection')
  .get(controllers.readManyCtrl)
  .post(controllers.writeCtrl)


module.exports = router;

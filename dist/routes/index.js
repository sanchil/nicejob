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

router.route('/').get(controllers.basicContrl);

router.route('/health').get(controllers.healthReportCtrl);

router.route('/:collection/:id').get(controllers.readOneCtrl).post(controllers.updateDocCtrl);

router.route('/:collection').get(controllers.readManyCtrl).post(controllers.writeCtrl);

module.exports = router;
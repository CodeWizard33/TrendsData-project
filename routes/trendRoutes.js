const express = require('express');
const { getAllApiResponses, getAllApiTrends1Response, getAllApiTrends2Response } = require('../controllers/trendsController');
const { getAllNewApiResponses, } = require('../controllers/newTrendsController');
const router = express.Router();

router.route('/load-all-trends1').get(getAllApiTrends1Response)
router.route('/load-all-trends2').get(getAllApiTrends2Response)
router.route('/load-all-newTrends').get(getAllNewApiResponses)

module.exports = router;

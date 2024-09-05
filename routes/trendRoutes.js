const express = require('express');
const { getAllApiResponses } = require('../controllers/trendsController');
const { getAllNewApiResponses, } = require('../controllers/newTrendsController');
const router = express.Router();

router.route('/load-all-trends').get(getAllApiResponses)
router.route('/load-all-newTrends').get(getAllNewApiResponses)

module.exports = router;

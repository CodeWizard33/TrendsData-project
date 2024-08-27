const express = require('express');
const { getAllGemeineTrends, getGoogleTrends, getTiktokTrends, getSpotifyData, getNetflixTrends, getSpotifyChartTrends, getPodcastTrends, getYoutubeChartTrends, getYoutubeTrends, getGamesTrends, getAppsTrends, getNetflixTop10Trends, getDPATrends, getTrends24, getAllApiResponses } = require('../controllers/trendsController');
const router = express.Router();

//router.route('/allgemeine').get(getAllGemeineTrends)
// router.route('/google').get(getGoogleTrends)
// router.route('/tiktok').get(getTiktokTrends)
// router.route('/netflix').get(getNetflixTrends)
// router.route('/spotify').get(getSpotifyData)
// router.route('/spotify-chart').get(getSpotifyChartTrends)
// router.route('/DPA-trends').get(getDPATrends)
// router.route('/podcast-trends').get(getPodcastTrends)
// router.route('/youtube-chart').get(getYoutubeChartTrends)
// router.route('/youtube-trends').get(getYoutubeTrends)
// router.route('/games-trends').get(getGamesTrends)
router.route('/apps-trends').get(getAppsTrends)
// router.route('/trends-24').get(getTrends24)
// router.route('/netflix-top-10').get(getNetflixTop10Trends)
router.route('/load-all-trends').get(getAllApiResponses)

module.exports = router;

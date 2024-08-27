const { apiResponse } = require("../helpers/apiResponse");
const cheerio = require('cheerio')

// loading all Api's response into a single controller 
exports.getAllApiResponses = async (req, res) => {

    const allApiResponses = []

    try {
        const { 0: gemeineTrends, 1: tiktokTrends, 2: netflixTrends, 3: spotifyChartTrends, 4: dpaTrends, 5: gamesTrends } = await Promise.all([await getAllGemeineTrends(), await getTiktokTrends(), await getNetflixTrends(), await getSpotifyChartTrends(), await getDPATrends(), await getGamesTrends()])
        allApiResponses.push(
            {
                "source": "Trends24",
                "url": "https://trends24.in/germany/",
                "data": gemeineTrends[0]
            },
            {
                "source": "Tiktok Hashtags",
                "url": "https://ads.tiktok.com/business/creativecenter/inspiration/popular/hashtag/pc/en?from=001010",
                "data": tiktokTrends
            },
            {
                "source": "Top 10 Movies",
                "url": "https://www.whats-on-netflix.com/most-popular/",
                "data": netflixTrends
            },
            {
                "source": "Spotify Chart Trends",
                "url": "https://kworb.net/spotify/country/de_daily.html",
                "data": spotifyChartTrends
            },
            {
                "source": "DPA Trends",
                "url": "https://dpa-factchecking.com/",
                "data": dpaTrends
            },
            {
                "source": "Games Trends",
                "url": "https://www.gamestar.de/charts/",
                "data": gamesTrends
            }
        )

        return apiResponse('success', 'data loaded successfully', allApiResponses, 200, res)

    } catch (error) {
        apiResponse('fail', 'server error', {}, 500, res)
    }
}

// ok
const getAllGemeineTrends = async () => {
    try {
        const chartData = [];
        const response = await fetch("https://trends24.in/germany/")
        const result = await response.text()
        const $ = cheerio.load(result)

        const trends = {
        }

        $('.list-container ol').first().find('li').each((index, ele) => {
            const $ele = $(ele);
            const trend = $ele.find('a').text()
            trends[`${index + 1}`] = trend;
            chartData.push(trends);
        })

        const formatedData = [{
            'latest': Object.fromEntries(Object.entries(chartData[0]).slice(0, 20)),
            '1 hour': Object.fromEntries(Object.entries(chartData[1]).slice(0, 20)),
            '2 hour': Object.fromEntries(Object.entries(chartData[2]).slice(0, 20)),
            '3 hour': Object.fromEntries(Object.entries(chartData[3]).slice(0, 20)),
            '4 hour': Object.fromEntries(Object.entries(chartData[4]).slice(0, 20)),
            '5 hour': Object.fromEntries(Object.entries(chartData[5]).slice(0, 20)),
            '6 hour': Object.fromEntries(Object.entries(chartData[6]).slice(0, 20)),
            '7 hour': Object.fromEntries(Object.entries(chartData[7]).slice(0, 20)),
            '8 hour': Object.fromEntries(Object.entries(chartData[8]).slice(0, 20)),
            '9 hour': Object.fromEntries(Object.entries(chartData[9]).slice(0, 20)),
            '10 hour': Object.fromEntries(Object.entries(chartData[10]).slice(0, 20)),
            '11 hour': Object.fromEntries(Object.entries(chartData[11]).slice(0, 20)),
            '12 hour': Object.fromEntries(Object.entries(chartData[12]).slice(0, 20)),
            '13 hour': Object.fromEntries(Object.entries(chartData[13]).slice(0, 20)),
            '14 hour': Object.fromEntries(Object.entries(chartData[14]).slice(0, 20)),
            '15 hour': Object.fromEntries(Object.entries(chartData[16]).slice(0, 20)),
        }]

        return formatedData

    } catch (error) {
        throw new Error(error)
    }
}

// issue in this controller will fix it soon
exports.getGoogleTrends = async (req, res) => {
    try {
        const chartData = [];
        const response = await fetch("https://trends.google.de/trends/trendingsearches/realtime?geo=DE&hl=de&category=all")

        if (!response.ok) {
            return apiResponse('fail', "Failed to fetch data", {}, response.status, res);
        }

        const result = await response.text()
        const $ = cheerio.load(result)

        const secondBody = $('table tbody').eq(1);

        secondBody.find('tr').each((index, element) => {
            const $ele = $(element);
            // console.log($ele, 'ele ------>');

            console.log($ele.find('td'), 'td00>');

            const pos = $ele.find('td').text()
            // Add more selectors based on the structure of the table
            console.log(pos, 'pos---------->');

            chartData.push({
                pos,
                // Add more fields here
            });
        });
        return apiResponse('success', "data loaded Successfully", chartData, 201, res)

    } catch (error) {
        apiResponse('fail', "No data were found", {}, 500, res)

    }
}

// ok
const getTiktokTrends = async (req, res) => {
    try {
        const chartData = [];
        const response = await fetch("https://ads.tiktok.com/business/creativecenter/inspiration/popular/hashtag/pc/en?from=001010")
        // if (!response.ok) {
        //     return apiResponse('fail', "Failed to fetch data", {}, response.status, res);
        // }

        const result = await response.text()
        const $ = cheerio.load(result)

        $('.CommonDataList_listWrap__4ejAT .CommonDataList_cardWrapper__kHTJP').each((index, ele) => {
            const $ele = $(ele);
            const rank = $ele.find('.RankingStatus_rankingIndex__ZMDrH').text().trim();
            const hashTags = $ele.find('.CardPc_titleText__RYOWo').text().trim();
            const posts = $ele.find('.CardPc_itemValue__XGDmG').text().trim();

            chartData.push({
                rank,
                hashTags,
                posts
            });
        })

        return chartData

        // return apiResponse('success', "data loaded Successfully", chartData, 201, res)

    } catch (error) {
        // apiResponse('fail', "No data were found", {}, 500, res)
        throw new Error(error)
    }
}

// ok
const getNetflixTrends = async (req, res) => {
    try {
        const chartData = [];
        const response = await fetch("https://www.whats-on-netflix.com/most-popular/")
        const result = await response.text()
        const $ = cheerio.load(result)
        const secondBody = $('table').eq(6);
        let formatedData;
        const tvTrends = {
        }
        const moviesTrends = {
        }

        secondBody.find('tbody tr').each((index, element) => {
            const $ele = $(element);
            const rank = $ele.find('td').eq(0).text()
            const tvShow = $ele.find('td').eq(1).text()
            const movies = $ele.find('td').eq(2).text()

            tvTrends[index] = tvShow
            moviesTrends[index] = movies

            formatedData = [
                {
                    'topTvShows': tvTrends,
                    'topMovies': moviesTrends
                }
            ]
        })
        // return apiResponse('success', "data loaded Successfully", formatedData, 201, res)
        return formatedData

    } catch (error) {
        // apiResponse('fail', "No data were found", {}, 500, res)
        throw new Error(error)
    }
}

// ok
const getSpotifyChartTrends = async (req, res) => {
    try {
        const chartData = [];
        const response = await fetch("https://kworb.net/spotify/country/de_daily.html")
        // if (!response.ok) {
        //     return apiResponse('fail', "Failed to fetch data", {}, response.status, res);
        // }

        const result = await response.text()

        const $ = cheerio.load(result)

        $('#spotifydaily tbody tr').each((index, ele) => {
            const $ele = $(ele);
            const pos = $ele.find('td').eq(0).text().trim();
            const artistTitle = $ele.find('td').eq(2).text().trim();
            const days = $ele.find('td').eq(3).text().trim();
            const peak = $ele.find('td').eq(4).text().trim();
            const peakTimes = $ele.find('td').eq(5).text().trim();
            const streams = $ele.find('td').eq(6).text().trim();
            const streamsChange = $ele.find('td').eq(7).text().trim();
            const weeklyStreams = $ele.find('td').eq(8).text().trim();
            const weeklyStreamsChange = $ele.find('td').eq(9).text().trim();
            const totalStreams = $ele.find('td').eq(10).text().trim();

            chartData.push({
                pos,
                artistTitle,
                days,
                peak,
                peakTimes,
                streams,
                streamsChange,
                weeklyStreams,
                weeklyStreamsChange,
                totalStreams
            });
        })

        // return apiResponse('success', "data loaded Successfully", result, 201, res)
        return chartData

    } catch (error) {
        // apiResponse('fail', "No data were found", {}, 500, res)
        throw new Error(error)

    }
}

// ok
const getDPATrends = async (req, res) => {
    try {
        const response = await fetch("https://dpa-factchecking.com/")
        const result = await response.text()
        const $ = cheerio.load(result)
        const cards = $('.section .columns')
        let formatedData = []

        cards.each((i, ele) => {
            const $ele = $(ele)

            const titles = $ele.find('.article-box').map((index, item) => {
                return {
                    title: $(item).find('h4').text(),
                    desc: $(item).find('h3').text(),
                }
            }).get();

            const href = $ele.find('table tbody tr').map((i, ele) => {
                const href = $(ele).find('td a').attr('href'); // Get the href attribute of the <a> tag
                return { href }
            }).get();

            titles.forEach((article, index) => {
                if (href[index]) {
                    article.href = href[index].href; // Add the href to the corresponding article object
                }
            });

            formatedData = [...titles]
        })


        return formatedData

    } catch (error) {
        apiResponse('fail', "No data were found", {}, 500, res)

    }
}

// getting upexpected data result
exports.getPodcastTrends = async (req, res) => {
    try {
        const chartData = [];
        const response = await fetch("https://podwatch.io/charts/")
        if (!response.ok) {
            return apiResponse('fail', "Failed to fetch data", {}, response.status, res);
        }

        const result = await response.text()
        const $ = cheerio.load(result)

        $('table tbody').each((index, ele) => {
            const $ele = $(ele);
            console.log($ele.html());
            const platz = $ele.find('tr .title_column font').text();
            console.log(platz, 'platz');

            chartData.push({
                platz,
            });
        })

        return apiResponse('success', "data loaded Successfully", chartData, 201, res)

    } catch (error) {
        apiResponse('fail', "No data were found", {}, 500, res)

    }
}

// getting upexpected data result
exports.getYoutubeChartTrends = async (req, res) => {
    try {
        const chartData = [];
        const response = await fetch("https://charts.youtube.com/de")
        if (!response.ok) {
            return apiResponse('fail', "Failed to fetch data", {}, response.status, res);
        }

        const result = await response.text()

        console.log(response, result, 'res result');


        // const $ = cheerio.load(result)

        // $('#spotifydaily tbody tr').each((index, ele) => {
        //     const $ele = $(ele);
        //     const pos = $ele.find('td').eq(0).text().trim();
        //     const artistTitle = $ele.find('td').eq(2).text().trim();
        //     const days = $ele.find('td').eq(3).text().trim();
        //     const peak = $ele.find('td').eq(4).text().trim();
        //     const peakTimes = $ele.find('td').eq(5).text().trim();
        //     const streams = $ele.find('td').eq(6).text().trim();
        //     const streamsChange = $ele.find('td').eq(7).text().trim();
        //     const weeklyStreams = $ele.find('td').eq(8).text().trim();
        //     const weeklyStreamsChange = $ele.find('td').eq(9).text().trim();
        //     const totalStreams = $ele.find('td').eq(10).text().trim();

        //     chartData.push({
        //         pos,
        //         artistTitle,
        //         days,
        //         peak,
        //         peakTimes,
        //         streams,
        //         streamsChange,
        //         weeklyStreams,
        //         weeklyStreamsChange,
        //         totalStreams
        //     });
        // })

        return apiResponse('success', "data loaded Successfully", result, 201, res)

    } catch (error) {
        apiResponse('fail', "No Users were found", {}, 500, res)

    }
}

// facing issue
exports.getYoutubeTrends = async (req, res) => {
    try {
        const chartData = [];
        const response = await fetch("https://www.youtube.com/feed/trending?app=desktop&hl=de&gl=DE")
        const result = await response.text()

        const $ = cheerio.load(result)

        console.log($.text()); // Log the entire HTML

        console.log($('#contents').length);


        return apiResponse('success', "data loaded Successfully", result, 201, res)

    } catch (error) {
        apiResponse('fail', "No Users were found", {}, 500, res)

    }
}

// ok
const getGamesTrends = async (req, res) => {
    try {
        let formatedData;
        const response = await fetch("https://www.gamestar.de/charts/")

        const result = await response.text()
        const $ = cheerio.load(result)

        $('.box-reload').each((_, ele) => {
            const $ele = $(ele);

            const data = $ele.find('.test-list .media-right').map((i, item) => {
                return { position: i + 1, Name: $(item).find('a').text(), release: $(item).find('.info').eq(2).text() }
            }).get()


            if (!formatedData) {
                formatedData = data
            }
        })

        return formatedData;

    } catch (error) {
        apiResponse('fail', "No data were found", {}, 500, res)

    }
}

exports.getAppsTrends = async (req, res) => {
    try {
        const response = await fetch("https://appfigures.com/top-apps/ios-app-store/germany/iphone/top-overall")
        const result = await response.text()
        const $ = cheerio.load(result)
        const formatedData = []

        $('.s418648088-0').each((index, ele) => {
            const $ele = $(ele);
            const freeGames = $ele.find('.s1488507463-0 a').map((i, item) => {
                return {
                    Position: i + 1,
                    Name: $(item).text(),
                }
            }).get().slice(0, 20);

            const paid = $ele.find('.s-355733509-4 a').map((i, item) => {
                return {
                    Position: i + 1,
                    Name: $(item).text(),
                }
            }).get().slice(0, 20);

            const grossing = $ele.find('.s1488507463-0').eq(2).find('a').map((i, item) => {
                const Name = $(item).text().trim();
                if (Name) {

                    return {
                        Position: Name.split('.')[0],
                        Name: Name.split('. ')[1]
                    }
                }
            }).get().filter(Boolean).slice(0, 20);


            console.log(grossing);



        })

        return apiResponse('success', "data loaded Successfully", result, 201, res)

    } catch (error) {
        apiResponse('fail', "No Users were found", {}, 500, res)

    }
}

exports.getTrends24 = async (req, res) => {
    try {
        const chartData = [];
        const response = await fetch("https://trends24.in/germany/")
        if (!response.ok) {
            return apiResponse('fail', "Failed to fetch data", {}, response.status, res);
        }

        const result = await response.text()

        console.log(response, result, 'res result');


        return apiResponse('success', "data loaded Successfully", result, 201, res)

    } catch (error) {
        apiResponse('fail', "No Users were found", {}, 500, res)

    }
}

exports.getNetflixTop10Trends = async (req, res) => {
    try {
        const chartData = [];
        const response = await fetch("https://www.whats-on-netflix.com/most-popular/")
        if (!response.ok) {
            return apiResponse('fail', "Failed to fetch data", {}, response.status, res);
        }

        const result = await response.text()

        console.log(response, result, 'res result');


        // const $ = cheerio.load(result)

        // $('#spotifydaily tbody tr').each((index, ele) => {
        //     const $ele = $(ele);
        //     const pos = $ele.find('td').eq(0).text().trim();
        //     const artistTitle = $ele.find('td').eq(2).text().trim();
        //     const days = $ele.find('td').eq(3).text().trim();
        //     const peak = $ele.find('td').eq(4).text().trim();
        //     const peakTimes = $ele.find('td').eq(5).text().trim();
        //     const streams = $ele.find('td').eq(6).text().trim();
        //     const streamsChange = $ele.find('td').eq(7).text().trim();
        //     const weeklyStreams = $ele.find('td').eq(8).text().trim();
        //     const weeklyStreamsChange = $ele.find('td').eq(9).text().trim();
        //     const totalStreams = $ele.find('td').eq(10).text().trim();

        //     chartData.push({
        //         pos,
        //         artistTitle,
        //         days,
        //         peak,
        //         peakTimes,
        //         streams,
        //         streamsChange,
        //         weeklyStreams,
        //         weeklyStreamsChange,
        //         totalStreams
        //     });
        // })

        return apiResponse('success', "data loaded Successfully", result, 201, res)

    } catch (error) {
        apiResponse('fail', "No Users were found", {}, 500, res)

    }
}

exports.getSpotifyData = async (req, res) => {
    try {
        const chartData = [];
        const response = await fetch("https://kworb.net/spotify/country/de_daily.html")

        if (!response.ok) {
            return apiResponse('fail', "Failed to fetch data", {}, response.status, res);
        }

        const result = await response.text()
        const $ = cheerio.load(result)

        $('#spotifydaily tbody tr').each((index, ele) => {
            const $ele = $(ele);
            const pos = $ele.find('td').eq(0).text().trim();
            const artistTitle = $ele.find('td').eq(2).text().trim();
            const days = $ele.find('td').eq(3).text().trim();
            const peak = $ele.find('td').eq(4).text().trim();
            const peakTimes = $ele.find('td').eq(5).text().trim();
            const streams = $ele.find('td').eq(6).text().trim();
            const streamsChange = $ele.find('td').eq(7).text().trim();
            const weeklyStreams = $ele.find('td').eq(8).text().trim();
            const weeklyStreamsChange = $ele.find('td').eq(9).text().trim();
            const totalStreams = $ele.find('td').eq(10).text().trim();

            chartData.push({
                pos,
                artistTitle,
                days,
                peak,
                peakTimes,
                streams,
                streamsChange,
                weeklyStreams,
                weeklyStreamsChange,
                totalStreams
            });
        })

        return apiResponse('success', "data loaded Successfully", chartData, 201, res)

    } catch (error) {
        apiResponse('fail', "No Users were found", {}, 500, res)

    }
}



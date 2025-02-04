const { apiResponse } = require("../helpers/apiResponse");
const cheerio = require('cheerio')
const puppeteer = require('puppeteer')


// loading all Api's response into a single controller 
exports.getAllApiResponses = async (req, res) => {

    const allApiResponses = [];    
    try {
        const { 0: gemeineTrends, 1: tiktokTrends, 2: netflixTrends, 3: spotifyChartTrends, 4: dpaTrends, 5: gamesTrends, 6: appTrends, 7: podcastTrends, 8: googleTrends } = await Promise.all([await getAllGemeineTrends(), await getTiktokTrends(), await getNetflixTrends(), await getSpotifyChartTrends(), await getDPATrends(), await getGamesTrends(), await getAppsTrends(), await getPodcastTrends(), await getGoogleTrends()])
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
                "url": "https://dpa-factchecking.com/germany",
                "data": dpaTrends
            },
            {
                "source": "Games Trends",
                "url": "https://www.gamestar.de/charts/",
                "data": gamesTrends
            },
            {
                "source": "App Trends",
                "url": "https://appfigures.com/top-apps/ios-app-store/germany/iphone/top-overall",
                "data": appTrends.splice(3)
            },
            {
                "source": "PodCast Trends",
                "url": "https://podwatch.io/charts/",
                "data": podcastTrends.flat().splice(0, 20)
            },
            {
                "source": "Google Trends",
                "url": "https://trends.google.de/trending?geo=DE&hl=de",
                "data": googleTrends
            },

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
        }]

        return formatedData

    } catch (error) {
        throw new Error(error)
    }
}

// Ok
const getGoogleTrends = async (req, res) => {
    const formatedData = [];

    try {
        const browser = await puppeteer.launch({ headless: true, args: ['--no-sandbox', '--disable-setuid-sandbox'] });
        const page = await browser.newPage();

        await page.goto('https://trends.google.de/trending?geo=DE&hl=de',{timeout:60000}); // Replace with your actual URL
        await page.waitForSelector('.enOdEe-wZVHld-zg7Cn' || 'table');

        const data = await page.evaluate(() => {
            const rows = Array.from(document.querySelectorAll('tbody tr'));
            const data = rows.map(row => {
                const Angesagt = row.querySelector('.mZ3RIc')?.innerText.trim();
                const Suchvolumen = row.querySelector('.lqv0Cb')?.innerText.trim(); // Adjust this based on your actual structure
                const Gestartet = row.querySelector('.vdw3Ld')?.innerText.trim(); // Adjust this based on your actual structure
                return {
                    Angesagt,
                    Suchvolumen,
                    Gestartet
                };
            });

            return data
        });

        await browser.close();
        formatedData.push(...data)
        return formatedData

    } catch (error) {
        console.error(error);
    }
}

// ok
const getTiktokTrends = async (req, res) => {
    try {
        const chartData = [];
        const response = await fetch("https://ads.tiktok.com/business/creativecenter/inspiration/popular/hashtag/pc/en?from=001010", {
            headers: {
                'Accept-Language': 'de-DE,de;q=0.9', // Setting German language preference
                'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/58.0.3029.110 Safari/537.3'
            }
        })

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

        return chartData

    } catch (error) {
        throw new Error(error)

    }
}

// ok
const getDPATrends = async (req, res) => {
    const formatedData = []
    let combineArray = []

    try {
        const response = await fetch("https://dpa-factchecking.com/germany")
        const result = await response.text()
        const $ = cheerio.load(result)
        const cards = $('.all-content-box')

        const cardPromise = cards.map(async (i, ele) => {
            const $ele = $(ele)
            let detailUrl;

            const infoPromise = $ele.find('.column').map(async (index, item) => {
                detailUrl = $(item).find('a').attr('href');
                const d = await getDPADetailsTrends(detailUrl)
                return {
                    time: $(item).find('time').text(),
                    sub_title: $(item).find('h4').text(),
                    title: $(item).find('h3').text(),
                    description: $(item).find('p').text(),
                    details: d
                }
            }).get();

            const hrefs = $ele.find('table tbody tr').slice(0, 4).map(async (i, item) => {
                const timeDate = $(item).find('time').text();
                const linkUrl = $(item).find('a').attr('href');
                const linkText = $(item).find('a').text();
                const d = await getDPADetailsTrends(linkUrl)
                return {
                    time: timeDate,
                    title: linkText,
                    detail: d
                }
            }).get();

            const info = await Promise.all(infoPromise)
            const h = await Promise.all(hrefs)

            combineArray = [...info, ...h]

            return combineArray
        }).get()

        const allCardData = await Promise.all(cardPromise.flat());
        formatedData.push(...allCardData.flat());

        return formatedData

    } catch (error) {
        apiResponse('fail', "No data were found", 500, res)

    }
}

// Ok DPA details api 
const getDPADetailsTrends = async (trendId) => {
    let id;
    if (trendId.includes('/germany')) {
        id = './' + trendId.split('/').pop() + '/'
    } else {
        id = trendId
    }
    const detailResponse = await fetch(`https://dpa-factchecking.com/germany/${id}`);
    const detailResult = await detailResponse.text();
    const detail$ = cheerio.load(detailResult);

    const details = detail$('.article-container .content').first().map((i, item) => {
        const nestedTitle = detail$(item).find('h1').text().trim();// Example of nested data extraction
        const nestedDate = detail$(item).find('.info-row .date').text().trim();// Example of nested data extraction
        const nestedDesc = detail$(item).find('.main p').text().trim();// Example of nested data extraction

        const nestedlinks = detail$(item).find('.infobox p').map((i, link) => {
            const nLink = detail$(link).text()
            const url = detail$(link).find('a').attr('href')
            return { nLink, url };
        }).get();

        return {
            title: nestedTitle,
            url: `https://dpa-factchecking.com/germany/${id}`,
            date: nestedDate,
            description: nestedDesc,
            links: nestedlinks.splice(0, 5)
        }
    }).get();

    return details
}

// Ok
const getPodcastTrends = async (req, res) => {
    const formatedData = [];

    try {
        const browser = await puppeteer.launch({ headless: true, args: ['--no-sandbox', '--disable-setuid-sandbox'] })
        const page = await browser.newPage();

        await page.goto('https://podwatch.io/charts/',{timeout:60000}); // Replace with your actual URL

        // Wait for the specific element to be rendered by Vue.js
        await page.waitForSelector('.top_100_charts');

        // Extract the table headers and body data
        const data = await page.evaluate(() => {
            const headers = Array.from(document.querySelectorAll('thead tr th')).map(th => th.innerText.trim());

            const rows = Array.from(document.querySelectorAll('tbody tr'));
            const chartData = rows.map(row => {
                const Platz = row.querySelector('td').innerText.trim();
                const Podcast = row.querySelector('a')?.innerText.trim(); // Adjust this based on your actual structure

                return {
                    Platz: Platz.split('.')[0],
                    Podcast,
                };
            });

            return { chartData };
        });

        formatedData.push(data.chartData);
        await browser.close();

        return formatedData

    } catch (error) {
        console.error(error);
        return apiResponse('fail', "No data were found", 500, res);
    }

}

// getting upexpected data result
exports.getYoutubeChartTrends = async (req, res) => {
    // try {
    //     const chartData = [];
    //     const response = await fetch("https://charts.youtube.com/de")
    //     if (!response.ok) {
    //         return apiResponse('fail', "Failed to fetch data", {}, response.status, res);
    //     }

    //     const result = await response.text()

    //     console.log(response, result, 'res result');


    //     return apiResponse('success', "data loaded Successfully", result, 201, res)

    // } catch (error) {
    //     apiResponse('fail', "No Users were found", {}, 500, res)

    // }

    const formatedData = [];

    try {
        const browser = await puppeteer.launch({ headless: true, args: ['--no-sandbox', '--disable-setuid-sandbox'] })
        const page = await browser.newPage();

        await page.goto('https://charts.youtube.com/de', { waitUntil: "networkidle2",timeout:60000 }); // Replace with your actual URL
        await page.waitForSelector('#chart-entries-container', { visible: true, timeout: 6000 });

        const content = await page.content();
        // console.log(content, 'contnet ------------->');



        // Extract the table headers and body data
        const data = await page.evaluate(() => {
            const data = []
            const entries = document.querySelectorAll('.chart-entries-container .style-scope');
            // const headers = Array.from(document.querySelectorAll('#chart-entries-container')).map(th => th.innerText.trim());

            entries.forEach(entry => {
                const rank = entry.querySelector('.rank')?.innerText.trim();
                const title = entry.querySelector('.title')?.innerText.trim();
                const artist = entry.querySelector('.artist')?.innerText.trim();
                const views = entry.querySelector('.views')?.innerText.trim();

                data.push({ rank, title, artist, views });
            });

            return { data, entries };



            // const rows = Array.from(document.querySelectorAll('.style-scope'));
            // const chartData = rows.map(row => {
            //     const Rank = row.querySelector('.rankForTrendingVideoEntity ').innerText.trim();
            //     // const Podcast = row.querySelector('a')?.innerText.trim(); // Adjust this based on your actual structure

            //     return {
            //         Rank,
            //         // Podcast,
            //     };
            // });

            // return { chartData, headers };

        });


        await browser.close();

        return

    } catch (error) {
        console.error(error);
        return apiResponse('fail', "No data were found", 500, res);
    }
}

// facing issue
exports.getYoutubeTrends = async (req, res) => {

    try {
        const browser = await puppeteer.launch({ headless: true, args: ['--no-sandbox', '--disable-setuid-sandbox'] })
        const page = await browser.newPage();

        await page.goto('https://www.youtube.com/feed/trending', { waitUntil: "networkidle2",timeout:60000 }); // Replace with your actual URL
        await page.waitForSelector('#contents', { visible: true, timeout: 6000 });

        const content = await page.content();


        // Extract the table headers and body data
        const data = await page.evaluate(() => {
            const data = []
            const entries = document.querySelectorAll('#grid-container');
            console.log(entries, 'entries ----------->');


            // entries.forEach(entry => {
            //     const rank = entry.querySelector('#title-wrapper #video-title')?.innerText.trim();
            //     const name = entry.querySelector('#title-wrapper #channel-name')?.innerText.trim();
            //     // const artist = entry.querySelector('.artist')?.innerText.trim();
            //     // const views = entry.querySelector('.views')?.innerText.trim();

            //     data.push({ rank, name });
            // });

            return { entries };
        });


        // await browser.close();

        console.log(data, 'formatedData ----------->');
        return

    } catch (error) {
        console.error(error);
        return apiResponse('fail', "No data were found", 500, res);
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
                return {
                    position: i + 1,
                    Name: $(item).find('a').text(),
                    release: $(item).find('.info').eq(2).text(),
                }
            }).get()

            const rating = $ele.find('.points').map((i, item) => {

                return $(item).text().split('G')[0]

            }).get()

            const joinedArr = rating.map((ele, index) => {
                return {
                    ...data[index],
                    rating: ele
                };
            });

            if (!formatedData) {
                formatedData = joinedArr
            }
        })

        return formatedData;

    } catch (error) {
        apiResponse('fail', "No data were found", {}, 500, res)

    }
}

// ok
const getAppsTrends = async (req, res) => {
    try {
        const response = await fetch("https://appfigures.com/top-apps/ios-app-store/germany/iphone/top-overall")
        const result = await response.text()
        const $ = cheerio.load(result)
        const formatedData = []

        $('.s418648088-0').each((index, ele) => {
            const $ele = $(ele);

            const freeGames = $ele.find('.s1488507463-0 a').map((i, item) => {
                const Name = $(item).text()
                if (Name) {
                    return {
                        Position: Name.split('.')[0],
                        Name: Name.split('. ')[1]
                    }
                }
            }).get().slice(0, 20);

            const paid = $ele.find('.s-355733509-4 a').map((i, item) => {
                const Name = $(item).text()
                if (Name) {
                    return {
                        Position: Name.split('.')[0],
                        Name: Name.split('. ')[1]
                    }
                }
            }).get().filter(Boolean).slice(0, 20);

            const grossing = $ele.find('.s1488507463-0').eq(2).find('a').map((i, item) => {
                const Name = $(item).text().trim();
                if (Name) {

                    return {
                        Position: Name.split('.')[0],
                        Name: Name.split('. ')[1]
                    }
                }
            }).get().filter(Boolean).slice(0, 20);

            formatedData.push({ freeGames, paid, grossing })
        })

        return formatedData

    } catch (error) {
        apiResponse('fail', "No Users were found", {}, 500, res)

    }
}




const { apiResponse } = require("../helpers/apiResponse")
const cheerio = require("cheerio")

exports.getAllNewApiResponses = async (_, res) => {

    const allApiResponses = []
    try {
        const {
            0: spiegelTrends,
            1: fazTrends,
            2: sternTrends,
            3: tagesschautTrends,
            4: focusTrends,
            5: weltTrends,
            6: newFeedTrends,
            7: ESTTrends,
            8: bildTrends,
            9: politicsTrends,
        } = await Promise.all([
            await getAllSPIEGELTrends(),
            await getAllFAZTrends(),
            await getAllSTERNTrends(),
            await getAllTAGESSCHAUTrends(),
            await getAllFOCUSTrends(),
            await getAllWELTTrends(),
            await getAllNEWFEEDTrends(),
            await getAllALLESTrends(),
            await getAllBILDTrends(),
            await getAllPOLITICSTrends()
        ])

        allApiResponses.push(
            {
                "source": "SPIEGEL",
                "url": "https://www.spiegel.de/schlagzeilen/index.rss",
                "data": spiegelTrends
            },
            {
                "source": "FAZ",
                "url": "https://www.faz.net/rss/aktuell/",
                "data": fazTrends
            },
            {
                "source": "STERN",
                "url": "https://www.stern.de/feed/standard/all/",
                "data": sternTrends
            },
            {
                "source": "TAGESSCHAU",
                "url": "https://www.tagesschau.de/xml/rss2/",
                "data": tagesschautTrends
            },
            {
                "source": "FOCUS",
                "url": "https://rss.focus.de/fol/XML/rss_folnews.xml",
                "data": focusTrends
            },
            {
                "source": "WELT",
                "url": "https://www.welt.de/feeds/latest.rss",
                "data": weltTrends
            },
            {
                "source": "NEW FEED",
                "url": "https://newsfeed.zeit.de/index",
                "data": newFeedTrends
            },
            {
                "source": "ALLEST",
                "url": "https://rss.sueddeutsche.de/rss/Alles",
                "data": ESTTrends
            },
            {
                "source": "BILD",
                "url": "http://www.bild.de/rssfeeds/rss3-20745882,feed=alles.bild.html",
                "data": bildTrends
            },
            {
                "source": "POLITICS",
                "url": "https://www.n-tv.de/rss/Politik",
                "data": politicsTrends
            },
        )

        return apiResponse('success', 'data loaded successfully', allApiResponses, 200, res)

    } catch (error) {
        apiResponse('fail', 'server error', {}, 500, res)
    }
}


const getAllSPIEGELTrends = async () => {
    try {
        const response = await fetch("https://www.spiegel.de/schlagzeilen/index.rss")
        const result = await response.text()
        const $ = cheerio.load(result)
        const formatData = []

        $('item').each((_, ele) => {
            const data = $(ele).map((_, ele) => {
                return {

                    title: $(ele).find('title').text(),
                    link: $(ele).find('guid').text(),
                    desc: $(ele).find('description').text(),
                    pubDate: $(ele).find('pubDate').text()
                }
            })

            formatData.push(...data)

        })
        return formatData.splice(0, 7)

    } catch (error) {
        throw new Error(error)
    }
}

const getAllFAZTrends = async () => {
    try {
        const response = await fetch("https://www.faz.net/rss/aktuell/")
        const result = await response.text()
        const $ = cheerio.load(result)
        const formatData = []

        $('item').each((_, ele) => {
            const data = $(ele).map((_, ele) => {
                return {

                    title: $(ele).find('title').text(),
                    link: $(ele).find('guid').text(),
                    desc: $(ele).find('description').text(),
                    pubDate: $(ele).find('pubDate').text()
                }
            })

            formatData.push(...data)

        })

        return formatData.splice(0, 7)

    } catch (error) {
        throw new Error(error)
    }
}

const getAllSTERNTrends = async () => {
    try {
        const response = await fetch("https://www.stern.de/feed/standard/all/")
        const result = await response.text()
        const $ = cheerio.load(result)
        const formatData = []

        $('item').each((_, ele) => {
            const data = $(ele).map((_, ele) => {
                return {

                    title: $(ele).find('title').text(),
                    link: $(ele).find('guid').text(),
                    desc: $(ele).find('description').text(),
                    pubDate: $(ele).find('pubDate').text()
                }
            })

            formatData.push(...data)

        })

        return formatData.splice(0, 7)

    } catch (error) {
        throw new Error(error)
    }
}

const getAllTAGESSCHAUTrends = async () => {
    try {
        const response = await fetch("https://www.tagesschau.de/infoservices/alle-meldungen-100~rss2.xml")
        const result = await response.text()
        const $ = cheerio.load(result)
        const formatData = []

        $('item').each((_, ele) => {
            const data = $(ele).map((_, ele) => {
                return {

                    title: $(ele).find('title').text(),
                    link: $(ele).find('guid').text(),
                    desc: $(ele).find('description').text(),
                    pubDate: $(ele).find('pubDate').text()
                }
            })

            formatData.push(...data)

        })

        return formatData.splice(0, 7)

    } catch (error) {
        throw new Error(error)
    }
}

const getAllFOCUSTrends = async () => {
    try {
        const response = await fetch("https://rss.focus.de/fol/XML/rss_folnews.xml")
        const result = await response.text()
        const $ = cheerio.load(result)
        const formatData = []

        $('item').each((_, ele) => {
            const data = $(ele).map((_, ele) => {
                return {

                    title: $(ele).find('title').text().trim(),
                    link: $(ele).find('guid').text(),
                    desc: $(ele).find('description').text().trim(),
                    pubDate: $(ele).find('pubDate').text().trim()
                }
            })

            formatData.push(...data)

        })

        return formatData.splice(0, 7)

    } catch (error) {
        throw new Error(error)
    }
}

const getAllWELTTrends = async () => {
    try {
        const response = await fetch("https://www.welt.de/feeds/latest.rss")
        const result = await response.text()
        const $ = cheerio.load(result, { xmlMode: true })
        const formatData = []

        $('item').each((_, ele) => {
            const data = $(ele).map((_, ele) => {
                return {

                    title: $(ele).find('title').text().trim(),
                    link: $(ele).find('link').text(),
                    desc: $(ele).find('description').text().trim(),
                    pubDate: $(ele).find('pubDate').text().trim()
                }
            })

            formatData.push(...data)

        })

        return formatData.splice(0, 7)

    } catch (error) {
        throw new Error(error)
    }
}

const getAllNEWFEEDTrends = async () => {
    try {
        const response = await fetch("https://newsfeed.zeit.de/index")
        const result = await response.text()
        const $ = cheerio.load(result, { xmlMode: true })
        const formatData = []

        $('item').each((_, ele) => {
            const data = $(ele).map((_, ele) => {
                return {

                    title: $(ele).find('title').text().trim(),
                    link: $(ele).find('link').text(),
                    desc: $(ele).find('description').text().trim(),
                    pubDate: $(ele).find('pubDate').text().trim()
                }
            })

            formatData.push(...data)

        })

        return formatData.splice(0, 7)

    } catch (error) {
        throw new Error(error)
    }
}

const getAllALLESTrends = async () => {
    try {
        const response = await fetch("https://rss.sueddeutsche.de/rss/Alles")
        const result = await response.text()
        const $ = cheerio.load(result, { xmlMode: true })
        const formatData = []

        $('item').each((_, ele) => {
            const data = $(ele).map((_, ele) => {
                return {

                    title: $(ele).find('title').text().trim(),
                    link: $(ele).find('link').text(),
                    desc: $(ele).find('description').text().trim(),
                    pubDate: $(ele).find('pubDate').text().trim()
                }
            })

            formatData.push(...data)

        })

        return formatData.splice(0, 7)

    } catch (error) {
        throw new Error(error)
    }
}

// 9 remaining
const getAllPOLITICSTrends = async () => {
    try {
        const response = await fetch("https://www.n-tv.de/rss/Politik")
        const result = await response.text()
        const $ = cheerio.load(result, { xmlMode: true })
        const formatData = []

        $('.group article').each((_, ele) => {
            const data = $(ele).map((_, ele) => {
                return {
                    info: $(ele).find('.teaser__content .teaser__infos a').text().trim(),
                    link: $(ele).find('.teaser__content a').attr('href'),
                    heading: $(ele).find('.teaser__content .teaser__kicker').text().trim(),
                    headline: $(ele).find('.teaser__content .teaser__headline').text().trim(),
                    desc: $(ele).find('.teaser__content .teaser__text').text().trim(),
                }
            })

            formatData.push(...data)

        })

        return formatData.splice(0, 7)

    } catch (error) {
        throw new Error(error)
    }
}

const getAllBILDTrends = async () => {
    try {
        const response = await fetch("https://www.bild.de/rssfeeds/vw-alles/vw-alles-26970192,dzbildplus=false,sort=1,teaserbildmobil=false,view=rss2,wtmc=ob.feed.bild.xml")
        const result = await response.text()
        const $ = cheerio.load(result, { xmlMode: true })
        const formatData = []

        $('item').each((_, ele) => {
            const data = $(ele).map((_, ele) => {
                return {

                    title: $(ele).find('title').text().trim(),
                    link: $(ele).find('link').text(),
                    desc: $(ele).find('description ').text().trim(),
                    pubDate: $(ele).find('pubDate').text().trim()
                }
            })

            formatData.push(...data)

        })

        return formatData.splice(0, 7)

    } catch (error) {
        throw new Error(error)
    }
}


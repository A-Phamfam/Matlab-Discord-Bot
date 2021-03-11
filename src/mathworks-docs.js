let fetch = require('./fetch');
const request = require('request-promise');
const http = require("https");

async function searchDocs(query) {
    const queryURL = 'https://mathworks.com/help/search/suggest/doccenter/en/R2021a?q=' + query;
    const d = await fetch(queryURL, 'json');
    const suggestion = d.pages[0].suggestions[0];
    return {
        title: suggestion.title.join(''),
        summary: suggestion.summary.join(''),
        product: suggestion.product,
        url: 'https://mathworks.com/help/' + suggestion.path
    };
}

// Grabbing latest blog entry
async function getNewestBlogEntry() {
    const d = await fetch('https://blogs.mathworks.com/');
    let [, , date] = /^(.*?)on (.+)$/.exec(d('.blogger-name').eq(0).text().trim());
    const a = d('.post-title > a').eq(0);
    return {
        title: a.text().trim(),
        url: a.attr('href'),
        date: date,
        datenum: parseDate(date)
    };
}

// Grabbing latest tweet
async function getNewestTweet() {

    // Use an HTTPS request with the twitter v2 API to grab the 20 latest tweets from the @MATLAB account.
    // Search for the newest self published tweet (no quotes, no retweets, etc)
    let latestTweet = await request.get("https://api.twitter.com/2/tweets/search/recent?query=from:MATLAB&tweet.fields=created_at,id,lang,referenced_tweets&expansions=author_id&user.fields=created_at&max_results=20", {
        json: true,
        'auth': {
            'bearer': process.env.TWITTER_BEARER_TOKEN
        }
    }).then((body) => {
        // If there was an error, return JSON with "error" field
        if (!("data" in body)) { 
            throw("No tweets found in last 7 days from API request. (Account is no longer active?)");
        }
    
        // Look for the first non referenced tweet and return it
        for(var i = 0; i < body.data.length; i++) {
            if(!("referenced_tweets" in body.data[i])) {
                return {
                    title: body.data[i].id,
                    url: "https://twitter.com/MATLAB/status/" + body.data[i].id
                };
            }
        }
        
        // If we got this far, this means there are no original tweets to post, only retweets... throw error.
        // Kinda dumb way to handle this, but it works good 'nuff
        throw("Account only contains retweets");
    
    }).catch((err) => {
        // Want to throw the other errors so that they are caught by the cronjob
        throw(err);
    });

    return latestTweet;
}

// Grabbing latest youtube video
async function getNewestVideo() {
    // Grab the google APIs token 
    let token = process.env.YOUTUBE_AUTH_KEY;
    const video = (await fetch('https://www.googleapis.com/youtube/v3/search?key=' + token + '&channelId=UCgdHSFcXvkN6O3NXvif0-pA&part=snippet,id&order=date&maxResults=1', 'json')).items[0];
    return {
        title: video.snippet.title,
        description: video.snippet.description,
        url: 'https://youtube.com/watch?v=' + video.id.videoId,
        date: video.snippet.publishedAt
    }
}

function parseDate(date) {
    const currentYear = (new Date()).getFullYear().toString();
    if (!date.endsWith(currentYear)) {
        date += ', ' + currentYear;
    }
    return Date.parse(date);
}

module.exports = {
    searchDocs,
    getNewestBlogEntry,
    getNewestTweet,
    getNewestVideo
};

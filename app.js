'use strict'

const Twitter = require('twitter')
const cron = require('cron').CronJob

require('dotenv').config()

const client = new Twitter({
  consumer_key: process.env.CONSUMER_KEY,
  consumer_secret: process.env.CONSUMER_SECRET,
  access_token_key: process.env.ACCESS_TOKEN_KEY,
  access_token_secret: process.env.ACCESS_TOKEN_SECRET,
})

function getHomeTimeline() {
  client.get('statuses/home_timeline', {}, function(error, tweets, response) {
    if(error) console.log(error)
    console.log(tweets)
  })
}

const cronJob = new cron({
  cronTime: '00 0-59/1 * * * *',
  start: true,
  onTick: function() {
    // getHomeTimeline()
  }
})

// streaming API
const stream = client.stream('statuses/filter', { track: '@juschin_'})

stream.on('data', function(tweet) {
  console.log(tweet.text)

  const tweetMessage = '@' + tweet.user.screen_name + 'へんしん！'
  client.post('statuses/update', {
    status: tweetMessage,
    in_reply_to_status_id: tweet.id_str
  })
  .then((tweet) => {
    console.log(tweet)
  })
  .catch((error) => {
    throw error
  })
})

stream.on('error', function(error) {
  throw error
})

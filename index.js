require('dotenv').config();
const schedule = require('node-schedule');
const twit = require("twit");
const moment = require("moment");
const fetch = require("node-fetch");

schedule.scheduleJob('0 * * * *', function(){
  getWeather();
});

var t = new twit({
  consumer_key:         process.env.consumer_key,
  consumer_secret:      process.env.consumer_secret,
  access_token:         process.env.access_token,
  access_token_secret:  process.env.access_token_secret,
  timeout_ms:           60*1000
})

function getWeather(){
  var urlApi='https://community-open-weather-map.p.rapidapi.com/weather?id=2172797&lang=sp&units=metric&q=Punta+Arenas';
  var headersOW= { headers: { 'X-RapidAPI-Key': process.env.rapidApi } };
  var timestamp = moment().tz("America/Punta_Arenas").format('LT');
  fetch(urlApi, headersOW)
      .then(res => res.json())
      .then(json => {
          var status = `El #tiempo en #puq: ${json.main.temp}º , ${json.weather[0].description}, humedad del ${json.main.humidity}% a las ${timestamp}`;
          console.log(status);
          t.post('statuses/update', { status: status }, function(err, data, response) {
              console.log(data)
          })
      })
      .catch(err => console.error(err));
}

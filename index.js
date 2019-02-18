require('dotenv').config();
const schedule = require('node-schedule');
const Twit = require('twit');
const moment = require('moment');
const fetch = require('node-fetch');

const t = new Twit({
  consumer_key: process.env.consumer_key,
  consumer_secret: process.env.consumer_secret,
  access_token: process.env.access_token,
  access_token_secret: process.env.access_token_secret,
  timeout_ms: 60 * 1000,
});

function getWeather() {
  const urlApi = 'https://community-open-weather-map.p.rapidapi.com/weather?id=2172797&lang=sp&units=metric&q=Punta+Arenas';
  const headersOW = { headers: { 'X-RapidAPI-Key': process.env.rapidApi } };
  const timestamp = moment().tz('America/Punta_Arenas').format('LT');
  fetch(urlApi, headersOW)
    .then(res => res.json())
    .then((json) => {
      const status = `El #tiempo en #puq: ${json.main.temp}º , ${json.weather[0].description}, humedad del ${json.main.humidity}% a las ${timestamp}`;
      console.log(status);
      t.post('statuses/update', { status }, (err, data) => {
        console.log(data);
      });
    })
    .catch(err => console.error(err));
}
getWeather();
schedule.scheduleJob('0 * * * *', () => {
  getWeather();
});

import {getForecast} from 'app/forecast/forecast.services.js';

getForecast()
    .then(function(forecastData) {
        console.log(forecastData);
    });

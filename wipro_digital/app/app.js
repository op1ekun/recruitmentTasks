import {getForecast} from './forecast/forecast.services.js';
import {IMPERIAL, METRIC} from './constants.js';

let units = IMPERIAL;

getForecast()
    .then(function(forecastData) {
        'use strict';

        const cityCnt = document.querySelector('.city');
        const rainCnt = document.querySelector('.rain > span');
        const tempCnt = document.querySelector('.temp > span');
        const presCnt = document.querySelector('.pres > span');

        cityCnt.innerHTML = forecastData.city.name;
        rainCnt.innerHTML = (forecastData.list[0].rain['3h'] || 0) * 100 + ' mm';
        tempCnt.innerHTML = Math.round(forecastData.list[0].main.temp) + (units === METRIC ? '&deg;C' : '&deg;F');
        presCnt.innerHTML = Math.round(forecastData.list[0].main.pressure) + ' hPa';

        console.debug(forecastData);
    });
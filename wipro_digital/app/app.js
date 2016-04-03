import {getForecast} from 'app/forecast/forecast.services.js';

const IMPERIAL = 'imperial';
const METRIC = 'metric';
let units = IMPERIAL;

getForecast(undefined, undefined, units)
    .then(function(forecastData) {
        'use strict';

        const listLength = forecastData.list.length;

        const cityCnt = document.querySelector('.city');
        const rainCnt = document.querySelector('.rain > span');
        const tempCnt = document.querySelector('.temp > span');
        const presCnt = document.querySelector('.pres > span');

        cityCnt.innerHTML = forecastData.city.name;
        rainCnt.innerHTML = (forecastData.list[listLength-1].rain['3h'] || 0) * 100 + 'mm';
        tempCnt.innerHTML = Math.round(forecastData.list[listLength-1].main.temp) + (units === METRIC ? '&deg;C' : '&deg;F');
        presCnt.innerHTML = Math.round(forecastData.list[listLength-1].main.pressure) + 'hPa';

        console.log(forecastData);
    });

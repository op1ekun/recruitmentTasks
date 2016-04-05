import {IMPERIAL, METRIC} from '../constants.js';

const cityCnt = document.querySelector('.city');
const rainCnt = document.querySelector('.rain > span');
const tempCnt = document.querySelector('.temp > span');
const presCnt = document.querySelector('.pres > span');

export let forecastEventHandlers = {

    // a part of forecast view
    onNext: null,
    onPrev: null,
};

// not sure if these are app/forecast lvl methods
export function updateForecast(forecastData) {
    const {response, params} = forecastData; 


    cityCnt.innerHTML = `${response.city.name}, ${response.city.country}`;
    rainCnt.innerHTML = (response.list[0].rain && response.list[0].rain['3h'] || 0) * 100 + ' mm';
    tempCnt.innerHTML = Math.round(response.list[0].main.temp) + (params.units === METRIC ? '&deg;C' : '&deg;F');
    presCnt.innerHTML = Math.round(response.list[0].main.pressure) + ' hPa';
}
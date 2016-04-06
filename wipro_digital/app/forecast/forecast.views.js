import {IMPERIAL} from '../constants.js';

const cityCnt = document.querySelector('.city');
const rainCnt = document.querySelector('.rain > span');
const tempCnt = document.querySelector('.temp > span');
const presCnt = document.querySelector('.pres > span');
const cloudsCnt = document.querySelector('.clouds > span');
const nextButton = document.querySelector('.actions > .next');
const prevButton = document.querySelector('.actions > .prev');

/**
 * S
 * @param  {[type]} options.response [description]
 * @param  {[type]} options.params   [description]
 * @return {[type]}                  [description]
 */
function render({response, params}) {
    'use strict';

    const singleForecast = response.singleForecast;

    cityCnt.innerHTML = `${response.city.name}, ${response.city.country}`;
    rainCnt.innerHTML = `${singleForecast.rain && singleForecast.rain['3h'] || 0} mm`;
    tempCnt.innerHTML = `${Math.round(singleForecast.main.temp)}${(params.units === IMPERIAL ? '&deg;F' : '&deg;C')}`;
    presCnt.innerHTML = `${Math.round(singleForecast.main.pressure)} hPa`;
    cloudsCnt.innerHTML = `${singleForecast.clouds.all}%`;
}

export let forecastEventHandlers = {

    // a part of forecast view
    onNext: null,
    onPrev: null
};

/**
 * [updateForecast description]
 * @param  {[type]} forecastData [description]
 * @return {[type]}              [description]
 */
export function updateForecast(forecastData) {
    'use strict';

    render(forecastData);
}

/**
 * [getNextData description]
 * @param  {[type]} nextData [description]
 * @return {[type]}          [description]
 */
export function getNextData(nextData) {
    'use strict';
    render(nextData);
}

/**
 * [getPrevData description]
 * @param  {[type]} prevData [description]
 * @return {[type]}          [description]
 */
export function getPrevData(prevData) {
    'use strict';
    render(prevData);
}

nextButton.addEventListener('click', () => {
    'use strict';

    // if callback is configured
    if (forecastEventHandlers.onNext) {
        forecastEventHandlers.onNext();
    }
});

prevButton.addEventListener('click', () => {
    'use strict';

    // if callback is configured
    if (forecastEventHandlers.onPrev) {
        forecastEventHandlers.onPrev();
    }
});
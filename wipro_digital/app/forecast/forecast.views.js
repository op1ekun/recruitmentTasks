import {IMPERIAL} from '../constants.js';

const forecastCnt = document.querySelector('.forecast');
const cityCnt = document.querySelector('.forecast .city');
const rainCnt = document.querySelector('.rain > span');
const tempCnt = document.querySelector('.temp > span');
const presCnt = document.querySelector('.pres > span');
const cloudsCnt = document.querySelector('.clouds > span');
const dateCnt = document.querySelector('.time > h2');
const timeCnt = document.querySelector('.time > h3');
const nextButton = document.querySelector('.actions > .next');
const prevButton = document.querySelector('.actions > .prev');

export let viewState = {
    next: true,
    prev: true,
    loading: true
};

export let forecastEventHandlers = {
    onNext: null,
    onPrev: null
};

/**
 * Renders valuse into the html using html template strings.
 * 
 * @param  {Object} options.response    the response object for a single forecast
 * @param  {Object} options.params      thee query parameters
 * @return {undefined}
 */
function render({response, params}) {
    'use strict';

    const {name, country} = response.city;
    const {rain, main, clouds, dt} = response.singleForecast;

    // convert UNIX timestamp to milliseconds
    const date = new Date(dt*1000);
    const year = date.getUTCFullYear();

    // parsing date - ugh
    let day = date.getUTCDate();
    day = day < 10 ? `0${day}` : day;

    let month = date.getUTCMonth() + 1;
    month = month < 10 ? `0${month}` : month;

    let hours = date.getUTCHours();
    hours = hours < 10 ? `0${hours}` : hours;

    let minutes = date.getUTCMinutes();
    minutes = minutes < 10 ? `0${minutes}` : minutes;

    let seconds = date.getUTCSeconds();
    seconds = seconds < 10 ? `0${seconds}` : seconds;

    // no optimized
    // TODO diff content, and only overwrite where there's a change
    cityCnt.innerHTML = `${name}, ${country}`;
    rainCnt.innerHTML = `${rain && rain['3h'] || 0} mm`;
    tempCnt.innerHTML = `${Math.round(main.temp)}${(params.units === IMPERIAL ? '&deg;F' : '&deg;C')}`;
    presCnt.innerHTML = `${Math.round(main.pressure)} hPa`;
    cloudsCnt.innerHTML = `${clouds.all}%`;
    dateCnt.innerHTML = `${day}/${month}/${year}`;
    timeCnt.innerHTML = `${hours}:${minutes}:${seconds}`;

    // not optimized
    // actions as above
    nextButton.disabled = viewState.next ? false : true;
    prevButton.disabled = viewState.prev ? false : true;

    viewState.loading ? 
        forecastCnt.className += ' loading' : 
        forecastCnt.className = forecastCnt.className.replace(/\sloading/, '');
}

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
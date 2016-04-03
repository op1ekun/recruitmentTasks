import config from  '../../config.js';

/**
 * [queryURLTmpl description]
 * @param  {[type]} city    [description]
 * @param  {[type]} country [description]
 * @param  {[type]} units   [description]
 * @return {[type]}         [description]
 */
function queryURLTmpl(city, country, units) {
    'use strict';

    const apiKey = config.apiKey;

    return `http://api.openweathermap.org/data/2.5/forecast?q=${city},${country}&mode=json&appid=${apiKey}&units=${units}`;
}

/**
 * [getForecast description]
 * @param  {String} city    [description]
 * @param  {String} country [description]
 * @param  {String} units   [description]
 * @return {[type]}         [description]
 */
export function getForecast(city = 'London', country = 'UK', units = 'imperial') {
    'use strict';

    const queryURL = queryURLTmpl(city, country, units);

    return fetch(queryURL, {
            method: 'get'
        })
        .then(function(response) {
            return response.json();
        })
        .catch(function(err) {
            console.error(err);
        });
}

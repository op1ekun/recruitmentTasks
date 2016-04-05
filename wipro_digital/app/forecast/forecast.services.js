import config from '../config.js';
import {IMPERIAL, METRIC} from '../constants.js';

/**
 * Parse and return an API query URL.
 * 
 * @param  {String} city    the name of a city
 * @param  {String} country the name of a country
 * @param  {String} units   units format, either metric or imperial
 * @return {String}         the parsed template string
 */
function getQueryURL(city, country, units) {
    'use strict';

    return `http://api.openweathermap.org/data/2.5/forecast?q=${city},${country}&mode=json&appid=${config.apiKey}&units=${units}`;
}

/**
 * Get forecast data from api for given location.
 * 
 * @param  {String} city    the name of a city, defaults to 'London'
 * @param  {String} country the name of a country, defaults to 'UK'
 * @param  {String} units   units format, either metric or imperial, defaults to 'metric'
 * @return {Promise}        a Promise that eventually returns a custom object with response, and query parameters 
 */
export function getForecast(city = 'London', country = 'UK', units = METRIC) {
    'use strict';

    const queryURL = getQueryURL(city, country, units);

    return fetch(queryURL, {
            method: 'get'
        })
        .then(function(response) {
            
            return response.json()
                .then(function(parsedData) {

                    return {
                        // original response
                        response: parsedData,
                        // query params sent to API
                        params: {
                            city: city,
                            country: country,
                            units: units
                        }
                    }
                });
        })
        .catch(function(err) {
            console.error(err);
        });
}

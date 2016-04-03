import config from  '../../config.js';

function queryURLTmpl(city, country) {
    const apiKey = config.apiKey;

    return `http://api.openweathermap.org/data/2.5/forecast?q=${city},${country}&mode=json&appid=${apiKey}`;
}

export function getForecast(city = 'London', country= 'UK') {

    const queryURL = queryURLTmpl(city, country);

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

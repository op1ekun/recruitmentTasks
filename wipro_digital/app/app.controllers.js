import {getForecast} from './forecast/forecast.services.js';
import {appEventHandlers} from './app.views.js';
import {updateForecast, forecastEventHandlers} from './forecast/forecast.views.js';

appEventHandlers.onSearch = (searchText, units) => {
	'use strict';

    let [city, country] = searchText.split(',');

    getForecast(city, country, units)
        .then(function(forecastData) {
            updateForecast(forecastData);            
        });
};

getForecast()
    .then(function(forecastData) {
        'use strict';

        updateForecast(forecastData);
    });
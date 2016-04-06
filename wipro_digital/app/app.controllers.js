import {getForecast} from './forecast/forecast.services.js';
import {appEventHandlers} from './app.views.js';
import {updateForecast, forecastEventHandlers, viewState} from './forecast/forecast.views.js';

// holds current forecast data form API
let currentData;
// the index of the current (single) forecast
let currentForcastIndex = 0;

/**
 * Prepares data for the view, and and updates it.
 * 
 * @param  {Object} forecastData    bespoke data object containing both the original response and query params
 * @return {undefined}
 */
function updateForecastView({params, response}) {
    'use strict';

    updateForecast({
        params: params,
        response: {
            city: response.city,
            singleForecast: response.list[currentForcastIndex]
        }
    });   
}

/**
 * A handler for the on search event.
 * Calls service method to get forecast data from API.
 * 
 * @param  {String} searchText  the text that user entered in the search box
 * @param  {String} units       either 'metric' or 'imperial'
 * @return {undefined}
 */
appEventHandlers.onSearch = (searchText, units) => {
    'use strict';

    viewState.loading = true;
    updateForecastView(currentData);

    let [city, country] = searchText.split(',');

    getForecast(city, country, units)
        .then((forecastData) => {
            // refresh data
            currentData = forecastData;
            // reset index
            currentForcastIndex = 0;
            viewState.loading = false;
            updateForecastView(currentData);
        });
};

/**
 * A handler for the on next event.
 * Updates firect view if update is available.
 * 
 * @return {undefined}
 */
forecastEventHandlers.onNext = () => {
    'use strict';

    if (currentForcastIndex + 1 < currentData.response.list.length) {
        currentForcastIndex++;
        viewState.next = true;
        viewState.prev = true;
    }
    else {
        viewState.next = false;
    }

    updateForecastView(currentData);
};

/**
 * A handler for the on prev event.
 * Updates firect view if update is available.
 * 
 * @return {undefined}
 */
forecastEventHandlers.onPrev = () => {
    'use strict';

    if (currentForcastIndex - 1 >= 0) {
        currentForcastIndex--;
        viewState.next = true;
        viewState.prev = true;
    }
    else {
        viewState.prev = false;
    }    

    updateForecastView(currentData);
};

// init
getForecast()
    .then((forecastData) => {
        'use strict';

        // refresh data
        currentData = forecastData;
        // reset index
        currentForcastIndex = 0;
        
        viewState.loading = false;
        viewState.prev = false;
        updateForecastView(currentData);
    });
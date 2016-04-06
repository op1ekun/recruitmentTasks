import {METRIC} from './constants.js';

export let appEventHandlers = {
    onSearch: null,
    onRefresh: null
};

const searchTextInput = document.querySelector('#searchText');
const searchButton = document.querySelector('#search');
const unitsCnt = document.querySelector('#units');

// default
let unitsFormat  = METRIC;

// a bit of event delegation
unitsCnt.addEventListener('click', (ev) => {
    'use strict';

    const nodeName = ev.target.nodeName.toLowerCase();

    if (nodeName === 'input') {
        unitsFormat = ev.target.value;
    }
    else {
        unitsFormat = ev.target.control.value;
    }
});

// listens for user's kepresses, and passes data to controller
searchTextInput.addEventListener('keypress', (ev) => {
    'use strict';

    // only on enter
    if (ev.keyCode === 13) {

        // if callback is configured
        if (appEventHandlers.onSearch && searchTextInput.value) {
            appEventHandlers.onSearch(searchTextInput.value, unitsFormat);

            // reset the search input
            searchTextInput.value = '';
        }
    }
});

// listens for user's clicks, and passes data to controller
searchButton.addEventListener('click', () => {
    'use strict';

    // if callback is configured
    if (appEventHandlers.onSearch && searchTextInput.value) {
        appEventHandlers.onSearch(searchTextInput.value, unitsFormat);

        // reset the search input
        searchTextInput.value = '';
    }
});
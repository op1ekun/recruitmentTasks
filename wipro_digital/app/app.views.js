export let appEventHandlers = {
    onSearch: null,
    onRefresh: null
}

let searchTextInput = document.querySelector('.searchBox > .searchText');
let searchButton = document.querySelector('.searchBox > .search');

// listens for user's kepresses, and passes data to controller
searchTextInput.addEventListener('keypress', (ev) => {

    // only on enter
    if (ev.keyCode === 13) {

        // if callback is configured
        if (appEventHandlers.onSearch && searchTextInput.value) {
            appEventHandlers.onSearch(searchTextInput.value);

            // reset the search input
            searchTextInput.value = '';
        }
    }
});

// listens for user's clicks, and passes data to controller
searchButton.addEventListener('click', (ev) => {
    // if callback is configured
    if (appEventHandlers.onSearch && searchTextInput.value) {
        appEventHandlers.onSearch(searchTextInput.value);

        // reset the search input
        searchTextInput.value = '';
    }
});
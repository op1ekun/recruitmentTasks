angular.module('registerService', [
])
.factory('registerService', function($http) {
    'use strict';

    // TODO provide constant service
    var postURL = '/rest/register';

    function registerUser(userInput) {

        return $http.post(postURL, userInput);
    }

    return {
        registerUser: registerUser
    };
});
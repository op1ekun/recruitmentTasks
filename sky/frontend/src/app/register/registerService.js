angular.module('app')
    .factory('registerService', function($http) {
        // TODO provide constant service
        var postURL = '/rest/register';

        function registerUser(userInput) {

            return $http.post(postURL, userInput);
        }

        return {
            registerUser: registerUser
        };
    });
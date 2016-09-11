var app = angular.module('app', ['ui.router']);

app.config(function($locationProvider, $stateProvider, $urlRouterProvider) {

    //Avoid using hashes on the URL, whenever the browser supports this feature
    $locationProvider.html5Mode(true);

    // For any unmatched url, redirect to the home page
    $urlRouterProvider.otherwise("/register");

    // Now set up the states
    $stateProvider
        .state('register', {
            url: "/register",
            templateUrl: "src/app/register/register.html",
            controller: 'RegisterCtrl'
        })
});
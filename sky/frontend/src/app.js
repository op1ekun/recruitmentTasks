angular.module('app', [
    // all dependencies require by the app are loaded here
    'ui.router',
    'registerModule',
    'thanksModule'
])
.config(function($locationProvider, $stateProvider, $urlRouterProvider) {
    'use strict';

    //Avoid using hashes on the URL, whenever the browser supports this feature
    $locationProvider.html5Mode(true);

    // For any unmatched url, redirect to the home page
    $urlRouterProvider.otherwise("/register");

    // Now set up the states
    $stateProvider
        .state('register', {
            url: '/register',
            templateUrl: 'src/register/register.tmpl',
            controller: 'RegisterCtrl',
            controllerAs: 'rc'
        });

    $stateProvider
        .state('thanks', {
            url: '/thanks',
            templateUrl: 'src/thanks/thanks.tmpl',
            controller: 'ThanksCtrl',
            controllerAs: 'tc'
        });
});
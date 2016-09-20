/* global angular */
angular.module('registerFormDirective', [
    'registerFormCtrl'
])
.directive('registerForm', function registerFormDirective() {
    'use strict';

    return {
        scope: {},
        restrict: 'E',
        transclude: true,
        replace: true,
        templateUrl: 'src/register/registerForm.tmpl',
        controller: 'RegisterFormCtrl',
        controllerAs: 'rfc',
        bindToController: {
            colours: '='
        }
    };
});
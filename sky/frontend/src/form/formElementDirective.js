angular.module('formElementDirective', [
])
.directive('formElement', function formElementDirective() {
    'use strict';
    return {
        scope: {
            label: '@'
        },
        restrict: 'E',
        transclude: true,
        replace: true,
        templateUrl: 'src/form/form.tmpl'
    };
});
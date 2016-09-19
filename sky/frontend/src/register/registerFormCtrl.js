/* global angular */
angular.module('registerFormCtrl', [
    'registerService'
])
.controller('RegisterFormCtrl', [ 'registerService', function RegisterFormCtrl(registerService) {
    'use strict';

    var rfc = this;

    rfc.selectedColour = '';
    rfc.email = '';

    rfc.selectColour = function(colour) {
        rfc.selectedColour = colour;
    };

    rfc.registerUser = function() {
        return registerService
            .registerUser({
                colour: rfc.selectedColour,
                email: rfc.email
            });
    };
}]);

/* global angular */
angular.module('registerFormCtrl', [
    'ui.router',
    'registerService'
])
.controller('RegisterFormCtrl', [ 'registerService', '$state',
    function RegisterFormCtrl(registerService, $state) {
        'use strict';

        var rfc = this;

        // viewModel
        // hold the reference to slected colour object
        rfc.selectedColour = null;
        rfc.email = '';

        // error flags
        rfc.errors = {
            colour: false,
            email: false
        }

        /**
         * Saves the selected colour in the viewModel
         *
         * @param   {Object} colour     the selected colour object
         * @returns {undefined}
         */
        rfc.selectColour = function(colour) {
            if (rfc.selectedColour) {
                rfc.selectedColour.selected = false;
            }

            rfc.selectedColour = colour;
            rfc.selectedColour.selected = true;

            rfc.errors.colour = false;
        };

        /**
         * Checks if data exists, and validates its correctness.
         * Registers user with provided colour, and email data.
         * Transitions to the 'thanks' if successful
         *
         * @uses registerService    a serivice to use register backend
         * @returns {undefined} 
         */
        rfc.registerUser = function() {
            // a very simplistic data validation
            // it seems no $parsers nor $validators
            // are available for bindToController controllers :(
            if (!rfc.selectedColour) {
                rfc.errors.colour = true;    
            }

            if (rfc.email &&
                (/^(\w+\.?)+@(\w+\.)+[a-z]+$/).test(rfc.email)) {
                rfc.errors.email = false;
            } else {
                rfc.errors.email = true;
            }

            if (rfc.errors.colour || rfc.errors.email) {
                return;
            }

            registerService
                .registerUser({
                    colour: rfc.selectedColour.name,
                    email: rfc.email
                })
                .then(function() {
                    $state.transitionTo('thanks');
                });
        };
    }]);

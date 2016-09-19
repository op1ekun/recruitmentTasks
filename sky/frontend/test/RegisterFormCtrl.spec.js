/* global describe */
/* global module */
/* global beforeEach */
/* global inject */
/* global it */
/* global expect */
describe('RegisterForm Ctrl', function () {
    'use strict';

    var rfc;
    var mockService;
    var q;

    // CONSTANTS
    var COLOUR = 'red';
    var EMAIL = 'valid@email.com';

    beforeEach(module('registerFormCtrl'));

    beforeEach(inject(function (_$controller_, _$q_) {
        q = _$q_;

        mockService = {
            registerUser: function() {}
        };

        spyOn(mockService, 'registerUser')
            .and.callFake(function() {
                return q.resolve();
            });

        rfc = _$controller_('RegisterFormCtrl', { 'registerService': mockService });
    }));

    describe('selectColor()', function() {

        it('sets selectedColour property in the controller',  function() {
            rfc.selectColour(COLOUR)
            expect(rfc.selectedColour).toEqual(COLOUR);
        }); 
    });

    describe('registerUser()', function() {

        // a smoke test to set interface expectation
        it('returns a $q promise', function() {
            expect(rfc.registerUser() instanceof q).toBeTruthy();
        });

        it('calls registerService.registerUser() method with colour, and email data', function() {
            rfc.selectedColour = COLOUR;
            rfc.email = EMAIL;

            rfc.registerUser();

            expect(mockService.registerUser)
                .toHaveBeenCalledWith({
                    colour: COLOUR,
                    email: EMAIL
                })
        });

        it('raises errors if the colour, the email or both are not set', function() {
            rfc.registerUser();

            expect(rfc.errors.colour).toBeTruthy();
            expect(rfc.errors.email).toBeTruthy();
        });
    });
});
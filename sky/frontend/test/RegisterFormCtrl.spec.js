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

    it('sets default values', function() {
        expect(rfc.selectedColour).toBeNull();
        expect(rfc.email).toEqual('');
        expect(rfc.errors.colour).toEqual(false);
        expect(rfc.errors.email).toEqual(false);
    });

    describe('selectColor()', function() {

        it('sets selectedColour property in the controller',  function() {
            rfc.selectColour({
                name: COLOUR
            })
            expect(rfc.selectedColour.name).toEqual(COLOUR);
        }); 
    });

    describe('registerUser()', function() {

        it('calls registerService.registerUser() method with colour, and email data', function() {
            rfc.selectedColour = {
                name: COLOUR
            };
            
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
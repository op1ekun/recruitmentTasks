/* global describe */
/* global module */
/* global beforeEach */
/* global inject */
/* global it */
/* global expect */
/* global angular */
describe('RegisterForm Directive', function() {
    'use strict';

    var scope;
    var compile; 
    var elem;

    // CONSTANTS
    var BLACK = 'black';
    var YELLOW = 'yellow';
    var ORANGE = 'orange';
    var GREEN = 'green';
    var BLUE = 'blue';
    var VALID_EMAIL = 'valid@emial.com';

    beforeEach(function() {
        module('registerFormDirective');
        module('partials');
    });

    beforeEach(inject(function(_$rootScope_, _$compile_) {
        scope = _$rootScope_.$new();
        compile = _$compile_;
        elem = angular.element('<register-form colours="viewModel.colours"></register-form>');

        scope.viewModel = {
            colours: [
            {
                name: BLACK
            },
            {
                name: YELLOW
            },
            {
                name: ORANGE
            },
            {
                name: GREEN
            },
            {
                name: BLUE
            }
            
        ]};

        scope.$apply(function() {
            compile(elem)(scope);
        });
    }));

    it('renders markup', function() {        
        expect(elem[0].outerHTML).toContain('form');
        expect(elem[0].outerHTML).toContain('section');
        expect(elem[0].outerHTML).toContain(BLACK);
        expect(elem[0].outerHTML).toContain(YELLOW);
        expect(elem[0].outerHTML).toContain(ORANGE);
        expect(elem[0].outerHTML).toContain(GREEN);
        expect(elem[0].outerHTML).toContain(BLUE);
        expect(elem[0].outerHTML).toContain('input type="submit"');
        expect(elem[0].outerHTML).toContain('value="Register!"');
    });

    // kind of an integration test due to using external controller, 
    // and controllerAs instead of isolated scope
    it('selects a color when a radio button is clicked', function() {
        var rfc = elem.isolateScope().rfc;

        var yellowInput = elem[0].querySelector('input[type=radio][value=' + YELLOW + ']');
        yellowInput.click();
        expect(rfc.selectedColour.name).toEqual(YELLOW);

        var blueInput = elem[0].querySelector('input[type=radio][value=' + BLUE + ']');
        blueInput.click();

        expect(rfc.selectedColour.name).toEqual(BLUE);
    });

    // kind of an integration test due to using external controller, 
    // and controllerAs instead of isolated scope
    it('sets email property in the controller', function() {
        var rfc = elem.isolateScope().rfc;

        var emailInput = elem[0].querySelector('input[type=text][name=email]');

        emailInput.value = VALID_EMAIL;
        emailInput.dispatchEvent(new KeyboardEvent('input'));

        expect(rfc.email).toEqual(VALID_EMAIL)
    });

    it('calls registerUser() when submit button is clicked', function() {
        var rfc = elem.isolateScope().rfc;

        spyOn(rfc, 'registerUser')
            .and.callFake(function() {
                { success: true }
            });

        var submitBtn = elem[0].querySelector('input[type=submit]');
        submitBtn.click();

        expect(rfc.registerUser).toHaveBeenCalled();
    });
});
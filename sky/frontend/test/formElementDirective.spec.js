/* global describe */
/* global module */
/* global beforeEach */
/* global inject */
/* global it */
/* global expect */
/* global angular */
describe('formElementDirective', function() {
    'use strict';

    var scope, compile, elem;

    beforeEach(function() {
        module('formElementDirective');
        module('partials');
    });

    it('renders default markup', inject(function(_$rootScope_, _$compile_) {
        scope = _$rootScope_.$new();
        compile = _$compile_;

        elem = angular.element('<form-element label="Register!"></form-element>');

        scope.$apply(function() {
            compile(elem)(scope);
        });
        
        expect(elem[0].outerHTML).toContain('form');
        expect(elem[0].outerHTML).toContain('<input type="submit" value="Register!">');
        expect(elem[0].outerHTML).toContain('submit');
    }));

    it('renders transcluded markup', inject(function(_$rootScope_, _$compile_) {
        scope = _$rootScope_.$new();
        compile = _$compile_;

        elem = angular.element(
            '<form-element label="Register!">' +
                '<input type="radio" value="black">' +
                '<input type="radio" value="yellow">' +
                '<input type="radio" value="orange">' +
                '<input type="radio" value="green">' +
                '<input type="radio" value="blue">' +
            '</form-element>'
        );

        scope.$apply(function() {
            compile(elem)(scope);
        });

        expect(elem[0].outerHTML).toContain('form');
        expect(elem[0].outerHTML).toContain('input type="radio" value="orange"');
        expect(elem[0].outerHTML).toContain('input type="submit" value="Register!"');
        expect(elem[0].outerHTML).toContain('submit');
    }));
});
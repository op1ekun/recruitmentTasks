/* global describe */
/* global module */
/* global beforeEach */
/* global inject */
/* global it */
/* global expect */
describe('Register Ctrl', function () {
    'use strict';

    beforeEach(module('RegisterCtrl'));

    it('sets hello placeholder on scope', inject(function ($rootScope, $controller) {
        var scope = $rootScope.$new();

        $controller('RegisterCtrl', {$scope: scope});

        expect(scope.hello).toEqual('world');
    }));

});
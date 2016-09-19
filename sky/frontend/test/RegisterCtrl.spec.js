/* global describe */
/* global module */
/* global beforeEach */
/* global inject */
/* global it */
/* global expect */
describe('Register Ctrl', function () {
    'use strict';

    beforeEach(module('RegisterCtrl'));

    it('sets hello placeholder in the controller', inject(function ($controller) {
        var rc = $controller('RegisterCtrl');

        expect(rc.hello).toEqual('world');
    }));

    it('sets colours config in the controller', inject(function ($controller) {
        var rc = $controller('RegisterCtrl');

        expect(rc.colours).toEqual([
            {
                name: 'black'
            },
            {
                name: 'yellow'
            },
            {
                name: 'orange'
            },
            {
                name: 'green'
            },
            {
                name: 'blue'
            }
        ]);
    }));

});
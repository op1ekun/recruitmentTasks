angular.module('RegisterCtrl', [
])
.controller('RegisterCtrl', [ function () {
    'use strict';
    // controllerAs used
    // now it's just a Plain Old Javascript Object :)
    var rc = this;

    rc.hello = 'world';

    // the register directive is configurable,
    // and requires colours configuration from the outside
    rc.colours = [
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
    ];

}]);
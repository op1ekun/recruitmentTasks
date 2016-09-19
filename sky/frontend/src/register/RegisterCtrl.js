angular.module('RegisterCtrl', [
])
.controller('RegisterCtrl', [ function () {
    'use strict';
    var rc = this;

    rc.hello = 'world';
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
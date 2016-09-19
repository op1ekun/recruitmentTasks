// controllers, services, directives etc.
// are now separate modules that together build a component
// eg. registerModule
// 
// this is inspired by ES6 modules system,
// where you can import parts of the module
// here you can use registerService as a standalone module
// 
// Moreover it eases unit testsing thanks to mocking only the module under test,
// no need to bootstrap the whole app
angular.module('registerModule', [
    'RegisterCtrl',
    'registerService',
    // 'registerDirective',
]);
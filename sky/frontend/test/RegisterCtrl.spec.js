describe('Register Ctrl', function () {

    beforeEach(module('app'));

    it('sets hello placeholder on scope', inject(function ($rootScope, $controller) {
        var scope = $rootScope.$new();

        $controller('RegisterCtrl', {$scope: scope});

        expect(scope.hello).toEqual('world');
    }));

});
describe('registerSerivce', function() {
    var httpBackend;
    var registerSerivce;
    var successResponse = {
        success: true
    };

    beforeEach(function(done) {
        module('app');

        inject(function(_$httpBackend_, _registerService_) {
            httpBackend = _$httpBackend_;
            registerSerivce = _registerService_;

            httpBackend.when('GET', 'src/app/register/register.html')
                .respond('');

            httpBackend.when('POST', '/rest/register')
                .respond(successResponse);

            done();
        });
    });

    afterEach(function() {
        // httpBackend.verifyNoOutstandingExpectation();
        // httpBackend.verifyNoOutstandingRequest();
    });

    it('send a valid request', function(done) {

        registerSerivce.registerUser({
            email: 'valid@email.com',
            colour: 'red'
        })
        .then(function(result) {
            expect(result.data).toEqual(successResponse);
            done();
        });

        httpBackend.flush();
    });
});

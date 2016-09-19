/* global describe */
/* global module */
/* global beforeEach */
/* global afterEach */
/* global inject */
/* global it */
/* global expect */
describe('registerService', function() {
    'use strict';

    var httpBackend;
    var registerSerivce;
    var successResponse = {
        success: true
    };

    beforeEach(function(done) {
        module('registerService');

        inject(function(_$httpBackend_, _registerService_) {
            httpBackend = _$httpBackend_;
            registerSerivce = _registerService_;

            httpBackend.whenPOST('/rest/register')
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

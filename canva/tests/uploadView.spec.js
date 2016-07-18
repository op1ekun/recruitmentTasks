/* global chai */
import UploadView from '../src/uploadView.js';
const expect = chai.expect;

describe('uploadView', () => {
    const bodyElem = document.querySelector('body');

    beforeEach((done) => {
        bodyElem.innerHTML += '<main>' +
            '<input type="file" id="upload-img" accept="image/*">' +
        '</main>' +
        '<section>' +
            '<canvas id="source-img"></canvas>' +
            '<div id="mosaic-img"></div>' +
        '</section>';

        done();
    });

    afterEach((done) => {
        bodyElem.innerHTML = '';
        done();
    });

    it('throws a ReferenceError if controller is not provided', () => {
        try {
            const uploadView = new UploadView(); // eslint-disable-line no-unused-vars
        } catch (err) {
            expect(err).to.be.instanceof(ReferenceError);
            expect(err.message).to.be.equal('controller is undefined');
        }
    });

    it('throws a TypeError if controller is not an object', () => {
        try {
            const uploadView = new UploadView('not an object'); // eslint-disable-line no-unused-vars
        } catch (err) {
            expect(err).to.be.instanceof(TypeError);
            expect(err.message).to.be.equal('controller is not an object');
        }
    });

    it('creates and instance of a view if controller object is passed, a default source, and mosaic elements exist', (done) => {
        try {
            const uploadView = new UploadView({});
            expect(uploadView).to.be.instanceof(UploadView);
            done();
        } catch (err) {
            done(err);
        }
    });

    it('creates an instance of a view if selectors for existing elements are provided', (done) => {
        try {
            const uploadView = new UploadView({}, '#upload-img', '#source-img');
            expect(uploadView).to.be.instanceof(UploadView);
            done();
        } catch (err) {
            done(err);
        }
    });

    it('creates an instance only if the first selector is provided, and the', (done) => {
        try {
            const uploadView = new UploadView({}, '#upload-img');
            expect(uploadView).to.be.instanceof(UploadView);
            done();
        } catch (err) {
            done(err);
        }
    });

    it('exposes inImageRendered event handler', () => {
        const uploadView = new UploadView({});
        expect(uploadView.onImageRendered).to.be.null; // eslint-disable-line no-unused-expressions
    });
});

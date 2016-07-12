/* global chai */
import * as uploadView from '../src/uploadView.js';
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
        uploadView.eventHandlers.onImageRendered = null;
        done();
    });

    it('exposes event handlers object', () => {
        expect(uploadView.eventHandlers).to.be.an('object');
        expect(uploadView.eventHandlers.onImageRendered).to.be.null; // eslint-disable-line no-unused-expressions
    });

    describe('.init()', () => {

        it('resolves Promise if inititialization is successful', (done) => {
            uploadView.init()
                .then(() => {
                    done();
                });
        });

        it('rejects Promise if inititialization fails', (done) => {
            bodyElem.innerHTML = '';

            uploadView.init()
                .catch((err) => {
                    expect(err).to.be.instanceof(TypeError);
                    done();
                });
        });
    });
});

/* global chai */
import * as mosaicView from '../src/mosaicView.js';
const expect = chai.expect;

describe('mosaicView', () => {
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

    it('implements .init() method', () => {
        expect(mosaicView.init).to.be.a('function');
        expect(mosaicView.init().then).to.be.a('function');
    });

    it('implements .render() method', () => {
        expect(mosaicView.render).to.be.a('function');
        expect(mosaicView.render().then).to.be.a('function');
    });

    describe('.init()', () => {

        it('resolves Promise if inititialization is successful', (done) => {
            mosaicView.init()
                .then(() => {
                    done();
                });
        });

        it('rejects Promise if inititialization fails', (done) => {
            bodyElem.innerHTML = '';

            mosaicView.init()
                .catch((err) => {
                    expect(err).to.be.instanceof(TypeError);
                    done();
                });
        });
    });
});

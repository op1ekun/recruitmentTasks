/* global chai */
import MosaicView from '../src/mosaicView.js';
const expect = chai.expect;

describe('MosaicView class', () => {
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

    it('exposes static util methods', () => {
        expect(MosaicView.rgbToHex).to.be.instanceof(Function);
        expect(MosaicView.avgColor).to.be.instanceof(Function);
    });

    it('throws a ReferenceError if tile service is not provided', (done) => {
        try {
            const mosaicView = new MosaicView(); // eslint-disable-line no-unused-vars
        } catch (err) {
            expect(err).to.be.instanceof(ReferenceError);
            expect(err.message).to.be.equal('tileService is undefined');
            done();
        }
    });

    it('throws a TypeError if tile service is not an object', (done) => {
        try {
            const mosaicView = new MosaicView('not an object'); // eslint-disable-line no-unused-vars
        } catch (err) {
            expect(err).to.be.instanceof(TypeError);
            expect(err.message).to.be.equal('tileService is not an object');
            done();
        }
    });

    it('creates and instance of a view if tile service object is passed, and a default mosaic element exists', (done) => {
        try {
            const mosaicView = new MosaicView({});
            expect(mosaicView).to.be.instanceof(MosaicView);
            done();
        } catch (err) {
            done(err);
        }
    });

    describe('mosaicView instance', () => {

        it('exposes public render method', (done) => {
            try {
                const mosaicView = new MosaicView({});
                expect(mosaicView.render).to.be.instanceof(Function);
                done();
            } catch (err) {
                done(err);
            }
        });
    });
});

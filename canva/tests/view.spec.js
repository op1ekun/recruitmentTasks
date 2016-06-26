/* global chai */
// import chai from '../node_modules/chai/chai.js';
import * as view from '../src/view.js';
import * as mosaicRenderer from '../src/mosaicRenderer.js';

const origMosaicRenderer = mosaicRenderer;
const expect = chai.expect;

describe('view', () => {

    const bodyElem = document.querySelector('body');

    beforeEach((done) => {
        mosaicRenderer.drawMosaic = chai.spy();

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
        mosaicRenderer.drawMosaic = origMosaicRenderer.drawMosaic;
        bodyElem.innerHTML = '';
        done();
    });

    it('implements .init() method', () => {
        expect(view.init).to.be.a('function');
        expect(view.init().then).to.be.a('function');
    });

    // ? what should be a part of public interface here ?
    it('implements .upload() method', () => {
        expect(view.upload).to.be.a('function');
        expect(view.upload().then).to.be.a('function');
    });

    it('implements .render() method', () => {
        expect(view.render).to.be.a('function');
        expect(view.render().then).to.be.a('function');
    });
});

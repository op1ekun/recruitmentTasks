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
        done();
    });

    it('implements .init() method', () => {
        expect(uploadView.init).to.be.a('function');
        expect(uploadView.init().then).to.be.a('function');
    });

    // ? what should be a part of public interface here ?
    it('implements .upload() method', () => {
        expect(uploadView.upload).to.be.a('function');
        expect(uploadView.upload().then).to.be.a('function');
    });

    it('implements .render() method', () => {
        expect(uploadView.render).to.be.a('function');
        expect(uploadView.render().then).to.be.a('function');
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

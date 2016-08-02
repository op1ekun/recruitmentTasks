/* global window */
/* global chai */
import * as uploadController from '../src/uploadController.js';
import FileReaderStub from './stubs/fileReaderStub.js';
import FileStub from './stubs/fileStub.js';

const expect = chai.expect;

const origFileReader = window.FileReader;
const origFile = window.File;

describe('uploadController', () => {

    beforeEach((done) => {
        if ((navigator.userAgent).match(/PhantomJS/ig)) {
            window.FileReader = FileReaderStub;
            window.File = FileStub;
        }
        done();
    });

    afterEach((done) => {
        window.FileReader = origFileReader;
        window.File = origFile;
        done();
    });

    describe('.handleFileUpload()', () => {

        it('resolves Promise with file source string if the upload was successful', (done) => {
            uploadController.handleFileUpload(new File([], 'fakeFile', { type: 'image/jpg' }))
                .then((srcString) => {
                    expect(srcString).to.contain('data:');
                    done();
                });

        });

        it('rejects Promise with a TypeError if file is not an instance of File', (done) => {
            uploadController.handleFileUpload({})
                .catch((err) => {
                    expect(err).to.be.instanceof(TypeError);
                    expect(err.message).to.be.equal('file is not an instance of File');
                    done();
                });
        });

        it('rejects Promise with a TypeError if no file was provided', (done) => {
            uploadController.handleFileUpload()
                .catch((err) => {
                    expect(err).to.be.instanceof(TypeError);
                    expect(err.message).to.be.equal('file is undefined');
                    done();
                });
        });
    });
});

/* global window */
/* global TILE_WIDTH */
/* global chai */
import * as tileService from '../src/tileService.js';
import fetchStub, { SVG_TMPL } from './stubs/fetchStub.js';

const expect = chai.expect;

describe('tileService', () => {
    const hexColor = 'ff6600';
    const origFetch = window.fetch;

    beforeEach((done) => {
        window.fetch = fetchStub;
        done();
    });

    afterEach((done) => {
        window.fetch = origFetch;
        done();
    });

    describe('.getTile()', () => {

        it('resolves Promise with <svg> template string if hexadeciaml color value is passed', (done) => {
            const processedTemplate = SVG_TMPL.replace('%s', hexColor).replace('%d', TILE_WIDTH);

            tileService.getTile(hexColor)
                .then((svgTile) => {
                    expect(svgTile).to.be.equal(processedTemplate);
                    done();
                });
        });

        it('rejects Promise with TypeError if no color passed', (done) => {
            tileService.getTile()
                .catch((err) => {
                    expect(err).to.be.instanceof(ReferenceError);
                    expect(err.message).to.be.equal('hexColor is undefined');
                    done();
                });
        });

        it('rejects Promise with TypeError if incorrect value is passed', (done) => {
            tileService.getTile('notAColor')
                .catch((err) => {
                    expect(err).to.be.instanceof(TypeError);
                    expect(err.message).to.be.equal('hexColor is not a hexadecimal color');
                    done();
                });
        });
    });
});

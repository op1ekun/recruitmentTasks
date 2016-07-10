/* global window */
/* global TILE_WIDTH */
/* global chai */
import * as tileService from '../src/tileService';

const expect = chai.expect;
const svgTemplate = '<svg xmlns="http://www.w3.org/2000/svg" version="1.1" xmlns:xlink="http://www.w3.org/1999/xlink" width="%d" height="%d">' +
    '<ellipse cx="50%" cy="50%" rx="50%" ry="50%" fill="#%s"></ellipse>' +
  '</svg>';

/**
 * Only works for the color endpoint.
 * Doesn't throw network errors.
 *
 * @param   {String}    url an endpoint URL
 * @returns {Promise}
 */
function fetchStub(url) {

    return new Promise((resolve) => {
        const matched = url.match(/^\/color\/([0-9a-fA-F]{6})/);

        if (matched) {
            resolve({
                ok: true,
                text: () => new Promise((resolve) => { // eslint-disable-line no-shadow
                    resolve(svgTemplate.replace('%s', matched[1]).replace('%d', TILE_WIDTH));
                }),
            });
        } else {
            resolve({
                ok: false,
            });
        }
    });
}

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

    it('implementes .getTile method', () => {
        expect(tileService.getTile).to.be.a('function');
        expect(tileService.getTile(hexColor).then).to.be.a('function');
    });

    describe('.getTile()', () => {

        it('resolves Promise with <svg> template string if hexadeciaml color value is passed', (done) => {
            const processedTemplate = svgTemplate.replace('%s', hexColor).replace('%d', TILE_WIDTH);

            tileService.getTile(hexColor)
                .then((svgTile) => {
                    expect(svgTile).to.be.equal(processedTemplate);
                    done();
                });
        });

        it('rejects Promise with TypeError if no color passed', (done) => {
            tileService.getTile()
                .catch((err) => {
                    expect(err).to.be.instanceof(TypeError);
                    expect(err.message).to.be.equal('passed value is not a hexadecimal color');
                    done();
                });
        });

        it('rejects Promise with TypeError if incorrect value is passed', (done) => {
            tileService.getTile('notAColor')
                .catch((err) => {
                    expect(err).to.be.instanceof(TypeError);
                    expect(err.message).to.be.equal('passed value is not a hexadecimal color');
                    done();
                });
        });
    });
});

/* global chai */
import { TILE_WIDTH } from '../src/constants.js';
import * as tileService from '../src/tileService.js';

const expect = chai.expect;

describe('tileService', () => {
    const hexColor = 'ff6600';

    it('exports svg template', () => {
        expect(tileService.SVG_TMPL).to.be.a('string');
    });

    describe('.getTile()', () => {

        it('resolves Promise with <svg> template string if hexadeciaml color value is passed', (done) => {
            const processedTemplate = tileService.SVG_TMPL.replace('%s', hexColor).replace(/%d/g, TILE_WIDTH);

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

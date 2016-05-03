import chai from '../../node_modules/chai/chai.js';
import view from '../modules/view.js';

const expect = chai.expect;

describe('view', () => {

    afterEach((done) => {
        view.setConfig();
        done();
    });

    it('implements .render() method', (done) => {
        expect(view.render).to.be.a('function');
        done();
    });

    it('implements .getConfig() method', (done) => {
        expect(view.getConfig).to.be.a('function');
        done();
    });

    it('implements .setConfig() method', (done) => {
        expect(view.setConfig).to.be.a('function');
        done();
    });

    describe('.setConfig()', () => {

        it('sets view\'s internal config', (done) => {
            const testConfig = {
                template: '',
                data: {},
                eventOne: () => {},
                eventTwo: () => {},
            };

            view.setConfig(testConfig);

            expect(view.getConfig()).to.be.equal(testConfig);
            done();
        });
    });
});

import chai from '../../node_modules/chai/chai.js';
import * as view from '../modules/view.js';
import * as template from '../modules/view/template.js';

const expect = chai.expect;

/* STUB template */
const FAKE_PARSED_TMPL = '<h1 data-event="click:clearTitle">fake template</h1>';
/* eslint arrow-body-style: ["error", "always"] */
template.compile = () => {

    /* eslint arrow-body-style: ["error", "always"] */
    return () => {
        return new Promise((resolve) => {
            resolve(FAKE_PARSED_TMPL);
        });
    };
};

/* KUDOS to https://gist.github.com/ryanand26/ef712e7c61dd2a886103 */
function clickElem(el) {
    const ev = document.createEvent('MouseEvent');

    ev.initMouseEvent(
        'click',
        true /* bubble */, true /* cancelable */,
        window, null,
        0, 0, 0, 0, /* coordinates */
        false, false, false, false, /* modifier keys */
        0 /* left */, null
    );

    el.dispatchEvent(ev);
}

describe('view', () => {

    beforeEach(() => {
        const templateElem = document.createElement('div');
        templateElem.id = 'content-template';
        templateElem.innerHTML = FAKE_PARSED_TMPL;

        const contentElem = document.createElement('div');
        contentElem.className = 'content trololo';

        document.querySelector('body').appendChild(templateElem);
        document.querySelector('body').appendChild(contentElem);
    });

    afterEach(() => {
        const contentElem = document.querySelector('.content');
        const templateElem = document.querySelector('#content-template');
        contentElem.parentNode.removeChild(contentElem);
        templateElem.parentNode.removeChild(templateElem);

        view.setConfig();
    });

    it('implements .render() method', () => {
        expect(view.render).to.be.a('function');
    });

    it('implements .getConfig() method', () => {
        expect(view.getConfig).to.be.a('function');
    });

    it('implements .setConfig() method', () => {
        expect(view.setConfig).to.be.a('function');
    });

    describe('.setConfig()', () => {

        it('sets view\'s internal config', () => {
            const testConfig = {
                template: '',
                data: {},
                eventOne: () => {},
                eventTwo: () => {},
            };

            view.setConfig(testConfig);

            expect(view.getConfig()).to.be.equal(testConfig);
        });
    });

    describe('.render()', () => {

        it('eventually renders parsed template into a DOM element', (done) => {
            view.setConfig({
                template: '#content-template',
                data: {},
            });

            view.render('.content')
                .then(() => {
                    const contentElem = document.querySelector('.content');
                    expect(contentElem.innerHTML).to.be.equal(FAKE_PARSED_TMPL);
                    done();
                });
        });

        it('attaches event handlers to the newly rendered element', (done) => {
            view.setConfig({
                template: '#content-template',
                data: {},
                clearTitle: () => {
                    done();
                },
            });

            view.render('.content')
                .then(() => {
                    const eventElem = document.querySelector('.content > *[data-event="click:clearTitle"]');

                    clickElem(eventElem);
                });

        });
    });
});

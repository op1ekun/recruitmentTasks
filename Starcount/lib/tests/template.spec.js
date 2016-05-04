import chai from '../../node_modules/chai/chai.js';
import * as template from '../modules/view/template.js';

const expect = chai.expect;

describe('template', () => {

    it('implements .compile() method', () => {
        expect(template.compile).to.be.a('function');
    });

    describe('.compile()', () => {

        it('returns a function - a compiled template', () => {
            expect(template.compile()).to.be.a('function');
        });

        it('the returned function returns parsed template - a string', (done) => {
            const compiledTmpl = template.compile('<h1>{{fakeTitle42}}</h1><h2>{{noValue}}</h2><div>{{fakeValue1}}</div><footer>{{fakeTitle42}}</footer>');
            compiledTmpl({
                fakeTitle42: 'this is a fake title',
                fakeValue1: 'this is a fake value',
            }).then((parsedTmpl) => {
                expect(parsedTmpl).to.be.equal('<h1>this is a fake title</h1><h2></h2><div>this is a fake value</div><footer>this is a fake title</footer>');
                done();
            });
        });
    });
});

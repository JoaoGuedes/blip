import { Router } from './Router';
import * as chai from 'chai';
import * as sinon from 'sinon';
import * as jsdom from 'jsdom-global';

describe('Router', function() {

    let expect = chai.expect;

    before(() => {
        jsdom.default();
    });

    it('should return correct param', () => {
        let regex = /([A-Za-z0-9]+=[A-Za-z0-9]+)/g,
            param = Router.getParamFromRegex('foo', '?id=12&foo=bar&wtv=test', regex);

        expect(param).to.equal('bar');
    });

})

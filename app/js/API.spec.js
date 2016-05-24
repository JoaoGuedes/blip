import { API } from './API';
import { Storage } from './Storage';
import * as chai from 'chai';
import * as sinon from 'sinon';
import * as jsdom from 'jsdom-global';

describe('API', function() {

    let api, storage, expect = chai.expect;

    before(() => {
        jsdom.default();
        window.localStorage = {
            setItem: (key, value) => {
                window.localStorage[key] = value;
            },
            getItem: (key) => window.localStorage[key]
        };
        storage = new Storage();
        api = new API(storage);
    });

    it('should fetch file', done => {
        api.fetch('http://jsonplaceholder.typicode.com/posts/1')
            .then(result => {
                expect(result.id).to.equal(1);
                done();
            })
            .catch(err => done(err));
    });

    it('should fail when no arguments are passed', done => {
        api.getLocation()
            .catch(err => { done(); });
    });

    it('should return correct location', done => {
        api.getLocation('porto')
            .then(result => {
                expect(result.location.city).to.equal('Porto');
                done();
            })
            .catch(err => { done(err); });
    });

    it('should return correct location from cache', done => {
        api.getLocation('lisboa')
            .then(result => {
                expect(result.cached).to.be.undefined;
                return api.getLocation('LisBoA');
            })
            .then(result => {
                expect(result.cached).to.be.true;
                done();
            })
            .catch(err => { done(err); });
    });

    it('shouldn\'t return location from cache', done => {
        api.getLocation('braga')
            .then(result => {
                expect(result.cached).to.be.undefined;
                done();
            })
            .catch(err => { done(err); });
    });

    it('shouldn\'t return a valid location', done => {
        api.getLocation('foo444')
            .then(result => {
                expect(result).to.be.null;
                done();
            })
            .catch(err => { done(err); });
    });

});

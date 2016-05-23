import { API } from './API';
import * as chai from 'chai';
import * as Model from '../public/models/games.json';
import * as sinon from 'sinon';
import * as jsdom from 'jsdom-global';

describe('API', function() {

    let api, stub, expect = chai.expect;

    before(() => {
        jsdom.default()
        api = new API();
        api.storage.games = Model.games.slice(0,3);
    });

    after(() => {
        api.storage.games = undefined;
    });

    it('should fetch file', done => {
        api.fetch('http://jsonplaceholder.typicode.com/posts/1')
            .then(result => {
                expect(result.id).to.equal(1);
                done();
            })
            .catch(err => {
                done(err)
            });
    });

    it('should return model', done => {
        stub = sinon.stub(api, 'fetch', function(url) {
            return new Promise(resolve => resolve(Model));
        })

        api.getAll()
            .then(result => {
                expect(result.length).to.equal(118);
                stub.restore();
                done();
            })
            .catch(err => {
                stub.restore();
                done(err);
            });

    })

    it('should append extra properties to model', done => {
        let stub = sinon.stub(api, 'fetch', function(url) {
            return new Promise(resolve => resolve(Model));
        })

        api.getAll()
            .then(result => {
                expect(result[0]).to.have.property('images');
                expect(result[0]).to.have.property('id');
                expect(result[0]).to.have.property('name');
                stub.restore();
                done();
            })
            .catch(err => {
                stub.restore();
                done(err);
            });
    })

    it('should return correct game', done => {

        api.getByIndex(0)
            .then(result => {
                expect(result.id).to.equal(0);
                expect(result.name).to.equal("8-Ball Pool");
                done();
            })
            .catch(err => {
                done(err)
            });

    })


})

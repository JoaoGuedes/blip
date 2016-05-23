import { Storage } from './Storage';
import * as chai from 'chai';
import * as Model from '../public/models/games.json';
import * as sinon from 'sinon';
import * as jsdom from 'jsdom-global';

xdescribe('Storage', function() {

    let storage, stub, expect = chai.expect;

    before(() => {
        jsdom.default();
        window.localStorage = {
            setItem: (key, value) => {
                window.localStorage[key] = value;
            },
            getItem: (key) => window.localStorage[key]
        };
        storage = new Storage();
    });

    it('should contain game', () => {
        storage.games = Model.games.slice(0,3);
        let game = Model.games[2];
        let contains = storage.contains(game);
        expect(contains).to.be.true;
    });

    it('should not contain game', () => {
        storage.games = Model.games.slice(0,3);
        let game = Model.games[5];
        let contains = storage.contains(game);
        expect(contains).to.be.false;
    });

    it('should add game', () => {
        storage.games = Model.games.slice(0,3);
        let game = Model.games[5];
        storage.add(game);
        let contains = storage.contains(game);
        expect(contains).to.be.true;
    });

    it('should remove game', () => {
        storage.games = Model.games.slice(0,3);
        let game = Model.games[2];
        storage.remove(game);
        let contains = storage.contains(game);
        expect(contains).to.be.false;
    });

})

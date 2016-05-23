let instance;

export class Storage {

    constructor() {
        if (!instance) {
            this.games = this._get('games', []);
            instance = this;
        }
        return instance;
    }

    /**
     * Get key in localStorage or [] if undefined
     */
    _get(key, dflt) {
        return window.localStorage ? JSON.parse(window.localStorage.getItem(key) || JSON.stringify(dflt)) : undefined;
    }

    /**
     * Stores key with data in localStorage
     */
    _store(key, data) {

        if (!window.localStorage) {
            return -1;
        }
        window.localStorage.setItem(key, JSON.stringify(data))
        this[key] = this._get(key, []);
        return true;
    }

    /**
     * Is game contained in localStorage?
     */
    contains(game) {
        return this.games.filter(lsGame => lsGame.short === game.short).length > 0;
    };

    /**
     * Add game to localStorage
     */
    add(game) {

        if (this.games.indexOf(game.index) === -1) {
            this.games.push(game);
            game.added = true;
        }
        this._store('games', this.games);

    };

    /**
     * Remove game from localStorage
     */
    remove(game) {

        let games = this.games.filter(lsGame => lsGame.short !== game.short)
        game.added = false;

        this._store('games', games);
    };

};

let instance;
let MINUTES = 60*1000;

export class Storage {

    constructor() {
        if (!instance) {
            instance = this;
        }
        return instance;
    }

    /**
     * Get key in localStorage
     */
    _get(key) {
        let item = window.localStorage.getItem(key);
        return item ? JSON.parse(item) : null;
    }

    /**
     * Stores key with data in localStorage
     */
    _store(key, data) {
        window.localStorage.setItem(key, JSON.stringify(data));
    }

    /**
     * Add to localStorage
     */
    add(url, data) {

        if (!window.localStorage) {
            return false;
        }

        let model = this._get('model') || {};
        model[url] = Object.assign(Object.assign({}, data), { cached: true });
        this._store('model', model);
    };

    _isWithinTTL(value) {
        let date = Date.parse(value.query.created),
            validUntil = date + parseInt(value.query.results.channel.ttl)*MINUTES;

        return Date.now() <= validUntil;
    }

    /**
     * If query returns no results, assume query is valid.
     * Otherwise check if it's within TTL.
     */
    _isValid(value) {
        return value.query.count === 0 ? true : this._isWithinTTL(value);
    }

    /**
     * Get from localStorage
     */
    retrieve(url) {

        if (!window.localStorage) {
            return false;
        }

        let model = this._get('model'),
            value = model ? model[url] : null;

        return value && this._isValid(value) ? value : false;
    }

};

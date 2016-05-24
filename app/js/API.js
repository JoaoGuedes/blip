'use strict';

let instance;

/**
 * Returns data from JSON
 * Singleton class
 */

export class API {

    constructor() {
        if (!instance) {
            this.init();
            instance = this;
        }
        return instance;
    }

    init() {
        this.query = 'select * from weather.forecast where u="c" and woeid in (select woeid from geo.places(1) where text="%s")';
        this.url = 'https://query.yahooapis.com/v1/public/yql?format=json&env=store%3A%2F%2Fdatatables.org%2Falltableswithkeys&q';
        this.cache = {};
    };

    /**
     * Requests URL
     * @returns Promise resolved with value or error if it returns > 400 or is unable to parse JSON.
     */
    fetch(url) {

        if (this.cache[url]) {
            return new Promise((resolve,reject) => resolve(this.cache[url]));
        }

        let xhttp = new XMLHttpRequest();
        xhttp.open("GET", url, true);
        xhttp.send();

        return new Promise((resolve, reject) => {
            xhttp.onreadystatechange = () => {
                if (xhttp.readyState === 4 && xhttp.status === 200) {
                    try {
                        let parsedData = JSON.parse(xhttp.responseText);
                        this.cache[url] = Object.assign(Object.create(parsedData), { cached: true });
                        resolve(parsedData);
                    }
                    catch(exception) {
                        reject(new Error(exception));
                    }
                } else if (xhttp.readyState === 4 && xhttp.status >= 400){
                    reject(new Error('Error on Request'));
                }
            };
        });
    };

    /**
     * Get location
     * @returns Promise with data
     */
    getLocation(location) {

        if (!location) {
            return new Promise((resolve, reject) => reject());
        }

        let query = this.query.replace('%s', location.toLowerCase()),
            url = `${this.url}=${query}`;

        return this.fetch(url)
                    .then(data => {
                        if (data.query.count === 0) {
                            return null;
                        }
                        return Object.assign(data.query.results.channel, { cached: data.cached });
                    });

    }

}

'use strict';

let instance;

/**
 * Returns data from JSON
 * Singleton class
 */
export class API {

    constructor(storage) {
        if (!instance) {
            this.query = 'select * from weather.forecast where u="%f" and woeid in (select woeid from geo.places(1) where text="%s")';
            this.url = 'https://query.yahooapis.com/v1/public/yql?format=json&env=store%3A%2F%2Fdatatables.org%2Falltableswithkeys&q';
            this.storage = storage;
            instance = this;
        }
        return instance;
    }

    /**
     * Requests URL
     * @returns Promise resolved with value or error if it returns > 400 or is unable to parse JSON.
     */
    fetch(url) {
        let xhttp = new XMLHttpRequest();
        xhttp.open("GET", url, true);
        xhttp.send();

        return new Promise((resolve, reject) => {
            xhttp.onreadystatechange = () => {
                if (xhttp.readyState === 4 && xhttp.status === 200) {
                    try {
                        let parsedData = JSON.parse(xhttp.responseText);
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
     * Gets URL if cached, or fetches it otherwise.
     */
    get(url) {

        let cached = this.storage.retrieve(url);

        if (cached) {
            return new Promise((resolve,reject) => resolve(cached));
        } else {
            return this.fetch(url)
                        .then(result => {
                            this.storage.add(url, result);
                            return result;
                        });
        }
    };

    /**
     * Get location
     * @returns Promise with data
     */
    getLocation(location, inCelsius) {

        if (!location) {
            return new Promise((resolve, reject) => reject());
        }

        let degrees = inCelsius ? 'c' : 'f',
            query = this.query
                    .replace('%f', degrees)
                    .replace('%s', location.toLowerCase()),
            url = `${this.url}=${query}`;

        return this.get(url)
                    .then(data => {
                        if (data.query.count === 0) {
                            return null;
                        }
                        return Object.assign(data.query.results.channel, { cached: data.cached });
                    });

    }

}

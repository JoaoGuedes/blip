'use strict';

let instance;

/**
 * Returns data from JSON
 * Singleton class
 */
export class API {

    constructor() {
        if (!instance) {
            this.query = 'select * from weather.forecast where u="c" and woeid in (select woeid from geo.places(1) where text="%s")';
            this.url = 'https://query.yahooapis.com/v1/public/yql?format=json&env=store%3A%2F%2Fdatatables.org%2Falltableswithkeys&q';
            this.cache = {};
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
            xhttp.onreadystatechange = function() {
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
     * Get location
     * @returns Promise with data
     */
    getLocation(location) {

        if (!location) {
            return new Promise((resolve, reject) => reject());
        }

        location = location.toLowerCase();

        let query = this.query.replace('%s', location),
            url = `${this.url}=${query}`;

        if (this.cache[location]) {
            return new Promise((resolve,reject) => resolve(Object.assign(this.cache[location], { cached: true })));
        } else {
            return this.fetch(url)
                        .then(data => {
                            if (data.query.count === 0) {
                                return null;
                            }

                            let payload = data.query.results.channel;
                            this.cache[location] = payload;
                            return payload;
                        });
        }

    }

}

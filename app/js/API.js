'use strict';

import { Storage } from './Storage';

let instance;

/**
 * Returns data from JSON
 * Singleton class
 */
export class API {

    constructor() {
        if (!instance) {
            this.storage = new Storage();
            this.query = 'select * from weather.forecast where woeid in (select woeid from geo.places(1) where text=\'%s\')';
            this.url = 'https://query.yahooapis.com/v1/public/yql?format=json&env=store%3A%2F%2Fdatatables.org%2Falltableswithkeys&q=';
            this.locations = {};
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

        /*if (this.model) {
            return new Promise(resolve => resolve(this.model));
        }*/


        let query = this.query.replace('%s', location),
            url = `${this.url}${query}`;

        return this.fetch(url)
                    .then(data => console.log(data));

    }

    /**
     * Get game by index
     * @returns Promise with data
     */
    getByIndex(index) {

        if (this.model) {
            return new Promise(resolve => resolve(this.model[index]))
        }
        else {
            return this.getAll().then(() => this.model[index]);
        }
    }
}

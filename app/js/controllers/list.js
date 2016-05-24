'use strict';

import { API } from '../API';

export class Controller {

    constructor() {

        this.API = new API();

        this.controller = {
            search: (event, scope) => {
                event.preventDefault();
                scope.error = false;
                scope.searching = true;
                this.getWeather(scope.query).then(() => { scope.searching = false; });
            }
        };

        this.scope = {
            controller: this.controller
        };

        this.bind(this.scope);
    }

    getWeather(location) {
        return this.API.getLocation(location)
            .then(result => {
                if (result) {
                    this.scope.model = result;
                    this.scope.model.item.forecast.splice(5);
                } else {
                    this.scope.error = 'Unable to find location!';
                }
            })
            .catch(() => {
                this.scope.error = 'Unable to find location!';
            });
    }

    /**
     * Binds scope to body
     */
    bind(scope) {
        rivets.bind(document.body, scope);
        document.body.className = "visible"; //to avoid flickering
    }



}

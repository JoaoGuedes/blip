'use strict';

import { API } from '../API';
import { Storage } from '../Storage';

export class Controller {

    constructor() {

        //Instantiate API
        this.API = new API(new Storage());

        //Define controller to be used on view
        this.controller = {

            //Calls API on manipulates control variables (searching/error)
            search: (event, scope, prevent) => {
                if (!prevent) {
                    event.preventDefault();
                }
                scope.error = false;
                scope.searching = true;
                this.getWeather(scope.query, scope.mode.celsius).then(() => { scope.searching = false; });
            },

            //Checkbox toggles celsius mode and triggers new search
            toggle: (event, scope) => {
                scope.mode.celsius = event.srcElement.checked;
                this.controller.search(event, scope, true);
            },

            //Debounces input events, so clicking the search button is not needed
            debounce: (() => {
                let interval;
                const DEBOUNCE = 2000;

                return (event, scope) => {

                    if (interval) {
                        return;
                    }

                    interval = window.setTimeout(() => {
                        console.log('searching');
                        this.controller.search(event, scope, true);
                        interval = undefined;
                    }, DEBOUNCE);

                };
            })(),
        };

        //Define scope, which will be used on the view
        this.scope = {
            controller: this.controller,
            mode: {
                celsius: true
            }
        };

        this.bind(this.scope);
    }

    getWeather(location, inCelsius) {
        return this.API.getLocation(location, inCelsius)
            .then(result => {
                if (result) {
                    this.scope.model = result;
                    this.scope.model.item.forecast.splice(5);
                } else {
                    this.scope.error = 'Unable to find location';
                }
            })
            .catch(() => {
                this.scope.error = 'Unable to find location';
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

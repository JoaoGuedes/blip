'use strict';

import { API } from '../API';
import { Storage } from '../Storage';

export class Controller {

    constructor() {

        this.API = new API(new Storage());

        this.controller = {
            search: (event, scope) => {
                scope.error = false;
                scope.searching = true;
                this.getWeather(scope.query, scope.mode.celsius).then(() => { scope.searching = false; });
            },
            toggle: (event, scope) => {
                scope.mode.celsius = event.srcElement.checked;
                this.controller.search(event, scope);
            },
            debounce: (function() {
                let closure, DEBOUNCE = 3000;

                return function(event, scope) {

                    window.setTimeout(() => {
                        console.log(scope.query, closure);
                        if (scope.query === closure) {
                            return;
                        }
                        closure = scope.query;
                        this.controller.search(event, scope);
                    }, DEBOUNCE);

                }.bind(this);
            }.bind(this))(),
        };

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

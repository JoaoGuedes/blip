'use strict';

import { API } from '../API';
import { Storage } from '../Storage';

export class BaseController {

    /**
     * @constructor
     * Instantiates API and localStorage.
     * Stores controller passed from subclass.
     * Returns model from subclass and merges it with controller.
     */
    constructor(controller) {
        this.API = new API();
        this.storage = new Storage();
        this.controller = controller;

        this.model.then((data) => this.addController(data));
    }

    /**
     * Default model for subclasses, returns all games
     */
    get model() {
        return this.API.getAll().catch(console.log);
    }

    /**
     * Merges controller and model in scope
     */
    addController(data) {
        let scope = {
            model       : data,
            controller  : this.controller
        };
        this.bind(scope);
    }

    /**
     * Binds scope to body
     */
    bind(scope) {
        rivets.bind(document.body, scope);
        document.body.className = "visible"; //to avoid flickering
    }

}

'use strict';

import { BaseController } from './Base';
import { Router } from '../Router';

export class Controller extends BaseController {

    constructor() {
        let controller = {
            portfolio: {
                add     : (event,scope) => this.storage.add(scope.model),
                remove  : (event,scope) => this.storage.remove(scope.model)
            }
        };
        super(controller);
    }

    get model() {
        return this.API.getByIndex(Router.getParam('id'));
    }

}

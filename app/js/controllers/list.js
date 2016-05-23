'use strict';

import { BaseController } from './Base';
import { Router } from '../Router';

export class Controller extends BaseController {

    constructor() {

        //Define controller to be assigned in superclass.
        let controller = {
            view: {
                list    : () => { this.controller.view.asList = true; },    //change view mode to list
                grid    : () => { this.controller.view.asList = false; },   //change view mode to grid
                asList  : false, //current view mode (defaults to grid)
            },
            go: (event,scope) => {
                event.stopPropagation();                                    //Avoid bubbling up of click event
                Router.go(`view.html?id=${scope.game.id}`);                 //Go to view URL with id of game
            },
            portfolio: {
                add     : (event,scope) => this.storage.add(scope.game),    //Add game to localStorage
                remove  : (event,scope) => {
                    this.storage.remove(scope.game);                        //Remove game fmor localStorage
                    scope.model.splice(0,0);                                //force array refresh;
                },
                toggle  : (event,scope) => {                                //Toggle remove and add from localStorage
                    if (scope.game.added) {
                        this.controller.portfolio.remove(event, scope)
                    } else {
                        this.controller.portfolio.add(event, scope);
                    }
                },
                active  : false                                             //Toggle show my collection or all games
            }
        };
        super(controller);
    }

}

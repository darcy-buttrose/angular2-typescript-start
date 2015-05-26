/// <reference path="../_references.d.ts" />
import {bootstrap, Component, View, For, If, Switch, SwitchWhen, SwitchDefault} from 'angular2/angular2';

@View({
  templateUrl: 'src/ui/app.html'
})
@Component({
  selector: 'second-app'
})
export class App {
    name : string;

    constructor() {
        this.name = 'Alice';
    }
}

export function main() {
   // You can use the light dom of the <hello-app> tag as temporary content (for
   // example 'Loading...') before the application is ready.
   console.log('bootstrapping')
   bootstrap(App);
}

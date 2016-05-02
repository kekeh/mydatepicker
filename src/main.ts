import { provide } from "angular2/core";
import { bootstrap } from "angular2/platform/browser";

// App component
import {SampleDateApp} from "./sample-date-app/index";

bootstrap(SampleDateApp, []).catch((error: Error) => console.error(error));

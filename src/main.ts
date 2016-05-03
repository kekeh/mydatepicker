import {provide} from "@angular/core";
import {bootstrap} from "@angular/platform-browser-dynamic";

// App component
import {SampleDateApp} from "./sample-date-app/index";

bootstrap(SampleDateApp, []).catch((error: Error) => console.error(error));

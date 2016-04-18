# mydatepicker v. 0.0.2

**Angular2 date picker - Angular2 reusable UI component**

## Description
Simple Angular2 date picker. Uses version "2.0.0-beta.13" of Angular2.

##Getting Started
1. Fork and clone this repo
2. npm install
3. Run the TypeScript compiler and watch for changes "npm run tsc"
4. Open second terminal and launch the app in the browser "npm start"

## Installation

To install this component to an external project, follow the procedure:

1. Make sure you're using Webpack and have installed `raw-loader`.
2. `npm install ForNeVeR/mydatepicker`.
3. `import {MyDatePicker} from 'MyDatePicker/src/app/mydatepicker';`
4. Use the following snippet inside your template:

   ```html
   <my-date-picker [options]="myDatePickerOptions"
                   (dateChanged)="onDateChanged($event)"
                   [selDate]="selectedDate"></my-date-picker>
   ```

### defaultMonth
If `selDate` is not specified, when the datepicker is opened, it will
ordinarily default to selecting the current date. If you would prefer
a different year and month to be the default for a freshly chosen date
picking operation, specify a `[defaultMonth]` in the same format as
that for the datepicker options (`yyyy.mm` if not otherwise specified).

## Demo
Online demo is [here](http://kekeh.github.io/mydatepicker)

## Compatibility (tested with)
* Firefox (latest)
* Chromium (latest)

## License
* License: MIT

## Author
* Author: kekeh

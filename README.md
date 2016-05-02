# mydatepicker v. 0.0.7

**Angular 2 date picker - Angular2 reusable UI component**

## Description
Simple Angular2 date picker. Uses version "2.0.0-beta.17" of Angular2.

##Getting Started
1. Fork and clone this repo
2. npm install
3. Open a terminal and type "npm start"

## Installation

To install this component to an external project, follow the procedure:

1. Make sure you're using Webpack and have installed `raw-loader`, `postcss-loader` and `sass-loader`.
2. `npm install kekeh/mydatepicker`.
3. `import {MyDatePicker} from 'MyDatePicker/src/index';`
4. Use the following snippet inside your template:

   ```html
   <my-date-picker [options]="myDatePickerOptions"
                   (dateChanged)="onDateChanged($event)"
                   [selDate]="selectedDate"></my-date-picker>
   ```

## Demo
Online demo is [here](http://kekeh.github.io/mydatepicker)

## Compatibility (tested with)
* Firefox (latest)
* Chromium (latest)

## License
* License: MIT

## Author
* Author: kekeh

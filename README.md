# mydatepicker v. 0.0.27

**Angular 2 date picker - Angular2 reusable UI component**

## Description
Simple Angular2 date picker. Online demo is [here](http://kekeh.github.io/mydatepicker)

## Getting Started
1. Fork and clone this repo
2. npm install
3. Open a terminal and type "npm start"
4. Open "http://localhost:5000" to browser

## Installation

To install this component to an external project, follow the procedure:

1. Make sure you're using Webpack. You can check needed dependencies from the package.json file of this module.
2. `npm install mydatepicker`.
3. Add *MyDatePickerModule* import to your @NgModule like example below
    ```js
    import { NgModule } from '@angular/core';
    import { BrowserModule } from '@angular/platform-browser';
    import { MyTestApp } from './my-test-app';
    import { MyDatePickerModule } from 'mydatepicker/src/my-date-picker/my-date-picker.module';

    @NgModule({
        imports:      [ BrowserModule, MyDatePickerModule ],
        declarations: [ MyTestApp ],
        bootstrap:    [ MyTestApp ]
    })
    export class MyTestAppModule {}
    ```

4. Use the following snippet inside your template:

   ```html
   <my-date-picker [options]="myDatePickerOptions"
                   (dateChanged)="onDateChanged($event)"></my-date-picker>
   ```

* Mandatory attributes:
  * [options]="myDatePickerOptions"
  * (dateChanged)="onDateChanged($event)"

* Optional attributes:
  * [selDate]="selectedDate" || [defaultMonth]="defaultMonth"
  * [locale]="locale"

* Example of the options data (not all properties listed):
```js
    myDatePickerOptions = {
        todayBtnTxt: 'Today',
        dateFormat: 'yyyy-mm-dd',
        firstDayOfWeek: 'mo',
        sunHighlight: true,
        height: '34px',
        width: '260px',
        inline: false,
        disableUntil: {year: 2016, month: 8, day: 10},
        selectionTxtFontSize: '16px'
    };
```

* Example of the date changed callback:
```js
    onDateChanged(event:any) {
        console.log('onDateChanged(): ', event.date, ' - formatted: ', event.formatted, ' - epoc timestamp: ', event.epoc);
    }
```

## Usage

All input properties are optional.

### options
Bind to an object containing replacements for any of the following defaults:

#### dayLabels
  `{su: 'Sun', mo: 'Mon', tu: 'Tue', we: 'Wed', th: 'Thu', fr: 'Fri', sa: 'Sat'}`
  
#### monthLabels
  `{ 1: 'Jan', 2: 'Feb', 3: 'Mar', 4: 'Apr', 5: 'May', 6: 'Jun', 7: 'Jul', 8: 'Aug', 9: 'Sep', 10: 'Oct', 11: 'Nov', 12: 'Dec' }`
    
#### dateFormat
  `'yyyy-mm-dd'`
  
#### todayBtnTxt
  `'Today'`
  
#### firstDayOfWeek
  `'mo'`
  
#### sunHighlight
  `true`
  
#### disableUntil
  `{year: 2016, month: 6, day: 26}`
  
#### disableSince
  `{year: 2016, month: 7, day: 22}`
  
#### disableWeekends
  `false`

#### inline
  `false`
  
#### height
  `'34px'`
  
#### width
  `'100%'`

#### selectionTxtFontSize
  `'18px'`

#### alignSelectorRight
   `'false'`

### locale
A two-letter ISO 639-1 language code can be provided as shorthand for several of
the options listed above. Currently supported languages: en, fr, ja and fi.
If the locale is used it overrides dayLabels, monthLabels, dateFormat, todayBtnTxt,
firstDayOfWeek and sunHighlight properties from the options.

* new locale data can be added to [this](https://github.com/kekeh/mydatepicker/blob/master/src/my-date-picker/my-date-picker.locale.service.ts) file.


### selDate
Provide the initially chosen date that will display both in the text input field
and provide the default for the popped-up datepicker.

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
* Edge
* IE11

## License
* License: MIT

## Author
* Author: kekeh

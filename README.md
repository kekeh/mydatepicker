# mydatepicker

**New datepicker library**

__If your Angular version is >= 7.2 you can use a new version ([angular-mydatepicker](https://github.com/kekeh/angular-mydatepicker)) of this component:__ 
* [repository](https://github.com/kekeh/angular-mydatepicker) 
* [online demo](https://kekeh.github.io/angular-mydatepicker/) 


**Version compatibility of this library**

| Library version | Angular version | Branch | Installation |
| :-------------- | :-------------- | :----- | :----------- |
| < 9.0.0 | >= 2 and < 9 | master | npm install --save mydatepicker@latest| 
| >= 9.0.0 | >= 9 | angularIvy | npm install --save mydatepicker@ng9 | 


**Angular date picker**

[![Build Status](https://travis-ci.org/kekeh/mydatepicker.svg?branch=master)](https://travis-ci.org/kekeh/mydatepicker)
[![codecov](https://codecov.io/gh/kekeh/mydatepicker/branch/master/graph/badge.svg)](https://codecov.io/gh/kekeh/mydatepicker)
[![npm](https://img.shields.io/npm/v/mydatepicker.svg?maxAge=2592000?style=flat-square)](https://www.npmjs.com/package/mydatepicker)
[![npm](https://img.shields.io/npm/dt/mydatepicker.svg)](https://www.npmjs.com/package/mydatepicker)

## Description
Highly configurable Angular date picker. Compatible __Angular2+__.

Online demo is [here](http://kekeh.github.io/mydatepicker)

If you want to set own styles to the input box, the calendar and the clear buttons you can try [this](https://github.com/kekeh/ngx-mydatepicker)
attribute directive date picker.

## Installation

To install this component to an external project, follow the procedure:

1. __npm install mydatepicker --save__

2. Add __MyDatePickerModule__ import to your __@NgModule__ like example below
    ```ts
    import { NgModule } from '@angular/core';
    import { BrowserModule } from '@angular/platform-browser';
    import { MyTestApp } from './my-test-app';
    import { MyDatePickerModule } from 'mydatepicker';

    @NgModule({
        imports:      [ BrowserModule, MyDatePickerModule ],
        declarations: [ MyTestApp ],
        bootstrap:    [ MyTestApp ]
    })
    export class MyTestAppModule {}
    ```

3. If you are using __systemjs__ package loader add the following mydatepicker properties to the __System.config__:
    ```js
    (function (global) {
        System.config({
            paths: {
                'npm:': 'node_modules/'
            },
            map: {
                // Other components are here...

                'mydatepicker': 'npm:mydatepicker/bundles/mydatepicker.umd.min.js'
            },
            packages: {
            }
        });
    })(this);
    ```

## Usage

Use one of the following three options.

### 1. ngModel binding

In this option the ngModel binding is used. [Here](https://github.com/kekeh/mydatepicker/tree/master/sampleapp/sample-date-picker-access-modifier)
is an example application. It shows how to use the __ngModel__.

To use ngModel define the application class as follows:

```ts
import {IMyDpOptions} from 'mydatepicker';
// other imports here...
interface IModel = {
    date:{
        year: number, 
        month: number, 
        day: number 
    }
}
export class MyTestApp {
    
    public myDatePickerOptions: IMyDpOptions = {
        // other options...
        dateFormat: 'dd.mm.yyyy',
    };

    // Initialized to specific date (09.10.2018).
    public model: IModel = { date: { year: 2018, month: 10, day: 9 } };

    constructor() { }
}
```

Add the following snippet inside your template:

```html
<form #myForm="ngForm" novalidate>
    <my-date-picker name="mydate" [options]="myDatePickerOptions"
                    [(ngModel)]="model" required></my-date-picker>
</form>
```

### 2. Reactive forms

In this option the value accessor of reactive forms is used. [Here](https://github.com/kekeh/mydatepicker/tree/master/sampleapp/sample-date-picker-access-modifier)
is an example application. It shows how to use the __formControlName__.

To use reactive forms define the application class as follows:

```ts
import {IMyDpOptions} from 'mydatepicker';
// other imports here...

export class MyTestApp implements OnInit {

    public myDatePickerOptions: IMyDpOptions = {
        // other options...
        dateFormat: 'dd.mm.yyyy',
    };

    public myForm: FormGroup;

    constructor(private formBuilder: FormBuilder) { }

    ngOnInit() {
        this.myForm = this.formBuilder.group({
            // Empty string or null means no initial value. Can be also specific date for
            // example: {date: {year: 2018, month: 10, day: 9}} which sets this date to initial
            // value.

            myDate: [null, Validators.required]
            // other controls are here...
        });
    }

    setDate(): void {
        // Set today date using the patchValue function
        let date = new Date();
        this.myForm.patchValue({myDate: {
        date: {
            year: date.getFullYear(),
            month: date.getMonth() + 1,
            day: date.getDate()}
        }});
    }

    clearDate(): void {
        // Clear the date using the patchValue function
        this.myForm.patchValue({myDate: null});
    }
}
```

Add the following snippet inside your template:

```html
<form [formGroup]="myForm" novalidate>
    <my-date-picker name="mydate" [options]="myDatePickerOptions"
                    formControlName="myDate"></my-date-picker>
  <!-- other controls are here... -->
</form>
```

### 3. Callbacks

In this option the mydatepicker sends data back to host application using callbacks. [Here](https://github.com/kekeh/mydatepicker/tree/master/sampleapp/sample-date-picker-normal)
is an example application. It shows how to use callbacks.

To use callbacks define the application class as follows:

```js
import {IMyDpOptions, IMyDateModel} from 'mydatepicker';
// other imports here...

export class MyTestApp {

    myDatePickerOptions: IMyDpOptions = {
        // other options...
        dateFormat: 'dd.mm.yyyy',
    };

    constructor() { }

    // dateChanged callback function called when the user select the date. This is mandatory callback
    // in this option. There are also optional inputFieldChanged and calendarViewChanged callbacks.
    onDateChanged(event: IMyDateModel) {
        // event properties are: event.date, event.jsdate, event.formatted and event.epoc
    }
}
```

Add the following snippet inside your template:

```html
<my-date-picker [options]="myDatePickerOptions"
                (dateChanged)="onDateChanged($event)"></my-date-picker>
```

## Attributes

### options attribute

Value of the __options__ attribute is a type of [IMyDpOptions](https://github.com/kekeh/mydatepicker/blob/master/src/my-date-picker/interfaces/my-options.interface.ts). It can contain the following properties.

| Option        | Default       | Type   | Description  |
| :------------ | :------------ | :----- | :--------- |
| __dayLabels__     | {su: 'Sun', mo: 'Mon', tu: 'Tue', we: 'Wed', th: 'Thu', fr: 'Fri', sa: 'Sat'} | [IMyDayLabels](https://github.com/kekeh/mydatepicker/blob/master/src/my-date-picker/interfaces/my-day-labels.interface.ts) | Day labels visible on the selector. |
| __monthLabels__   | { 1: 'Jan', 2: 'Feb', 3: 'Mar', 4: 'Apr', 5: 'May', 6: 'Jun', 7: 'Jul', 8: 'Aug', 9: 'Sep', 10: 'Oct', 11: 'Nov', 12: 'Dec' } | [IMyMonthLabels](https://github.com/kekeh/mydatepicker/blob/master/src/my-date-picker/interfaces/my-month-labels.interface.ts) | Month labels visible on the selector. |
| __dateFormat__    | yyyy-mm-dd | string |  Date format on the selection area and the callback. For example: d.m.yyyy, dd.mm.yyyy, yyyy-m-d, yyyy-mm-dd, d mmm yyyy, dd mmm yyyy (d = Day not leading zero, dd = Day with leading zero, m = Month not leading zero, mm = Month with leading zero, mmm = Month as a text, yyyy = Year four digit) |
| __showTodayBtn__   | true | boolean | Show 'Today' button on calendar. |
| __todayBtnTxt__   | Today | string | Today button text. Can be used if __showTodayBtn = true__. |
| __firstDayOfWeek__   | mo | string | First day of week on calendar. One of the following: mo, tu, we, th, fr, sa, su |
| __sunHighlight__   | true | boolean | Sunday red colored on calendar. |
| __satHighlight__   | false | boolean | Saturday red colored on calendar. |
| __highlightDates__   | no default value | Array<[IMyDate](https://github.com/kekeh/mydatepicker/blob/master/src/my-date-picker/interfaces/my-date.interface.ts)> | Dates red colored on calendar. For example: [{year: 2016, month: 11, day: 14}, {year: 2016, month: 1, day: 15}] |
| __markCurrentDay__   | true | boolean | Is current day (today) marked on calendar. |
| __markCurrentMonth__   | true | boolean | Is current month marked on calendar. Can be used if __monthSelector = true__. |
| __markCurrentYear__   | true | boolean | Is current year marked on calendar. Can be used if __yearSelector = true__. |
| __monthSelector__  | true | boolean | If month label is selected opens a selector of months. |
| __yearSelector__  | true | boolean | If year label is selected opens a selector of years. |
| __minYear__   | 1000 | number | Minimum allowed year in calendar. Cannot be less than 1000. |
| __maxYear__   | 9999 | number | Maximum allowed year in calendar. Cannot be more than 9999. |
| __disableUntil__   | no default value | [IMyDate](https://github.com/kekeh/mydatepicker/blob/master/src/my-date-picker/interfaces/my-date.interface.ts) | Disable dates backward starting from the given date. For example: {year: 2016, month: 6, day: 26}. To reset existing disableUntil value set: {year: 0, month: 0, day: 0} |
| __disableSince__   | no default value | [IMyDate](https://github.com/kekeh/mydatepicker/blob/master/src/my-date-picker/interfaces/my-date.interface.ts) | Disable dates forward starting from the given date. For example: {year: 2016, month: 7, day: 22}. To reset existing disableSince value set: {year: 0, month: 0, day: 0} |
| __disableDays__   | no default value  | Array<[IMyDate](https://github.com/kekeh/mydatepicker/blob/master/src/my-date-picker/interfaces/my-date.interface.ts)> | Disable single dates one by one. Array of disabled dates. For example: [{year: 2016, month: 11, day: 14}, {year: 2016, month: 1, day: 15}]. To reset existing disableDays value set empty array to it. |
| __enableDays__   | no default value  | Array<[IMyDate](https://github.com/kekeh/mydatepicker/blob/master/src/my-date-picker/interfaces/my-date.interface.ts)> | Enable given dates one by one if the date is disabled. For example if you disable the date range and want to enable some dates in range. Array of enabled days. For example: [{year: 2016, month: 11, day: 14}, {year: 2016, month: 1, day: 15}]. To reset existing enableDays value set empty array to it. |
| __disableDateRanges__   | no default value | Array<[IMyDateRange](https://github.com/kekeh/mydatepicker/blob/master/src/my-date-picker/interfaces/my-date-range.interface.ts)> | Disable date ranges. For example: [{begin: {year: 2016, month: 11, day: 14}, end: {year: 2016, month: 11, day: 20}}]. To reset existing disableDateRanges value set empty array to it. |
| __disableWeekends__   | false | boolean | Disable weekends (Saturday and Sunday). |
| __disableWeekdays__   | no default value | Array< string > | Disable weekdays. Array of weekdays to disable. Weekdays are same strings as the __firstDayOfWeek__ option. For example: ['tu', 'we'] which disables Tuesdays and Wednesdays. |
| __markDates__   | no default value | Array<[IMyMarkedDates](https://github.com/kekeh/mydatepicker/blob/master/src/my-date-picker/interfaces/my-marked-dates.interface.ts)> | Mark dates for different colors. For example: [{dates: [{year: 2016, month: 11, day: 14}, {year: 2016, month: 12, day: 16}], color: '#004198'}, {dates: [{year: 2017, month: 10, day: 1}, {year: 2017, month: 11, day: 4}], color: 'green'}]. To reset existing markDates value set empty array to it. |
| __markWeekends__   | no default value | [IMyMarkedDate](https://github.com/kekeh/mydatepicker/blob/master/src/my-date-picker/interfaces/my-marked-date.interface.ts) | Mark weekends (Saturday and Sunday). For example: {marked: true, color: 'red'}. Value of color can be any CSS color code. To reset existing markWeekends set: {marked: false, color: ''} |
| __disableHeaderButtons__   | true | boolean | Prevent to change the calendar view with header buttons if previous or next month are fully disabled by disableUntil or disableSince. |
| __showWeekNumbers__   | false | boolean | Are week numbers visible or not on calendar. Can be used if __firstDayOfWeek = mo__. |
| __selectorHeight__   | 232px | string | Selector height. |
| __selectorWidth__   | 252px | string | Selector width. |
| __allowDeselectDate__   | false | boolean | Is deselect of selected date allowed or not. |
| __inline__   | false | boolean | Show mydatepicker in inline mode. |
| __showClearDateBtn__   | true | boolean | Is clear date button shown or not. Can be used if __inline = false__. |
| __showDecreaseDateBtn__   | false | boolean | Is decrease date button shown or not. Can be used if __inline = false__. |
| __showIncreaseDateBtn__   | false | boolean | Is increase date button shown or not. Can be used if __inline = false__. |
| __height__   | 34px | string | mydatepicker height in without selector. Can be used if __inline = false__. |
| __width__   | 100% | string | mydatepicker width. Can be used if __inline = false__. |
| __selectionTxtFontSize__   | 14px | string | Selection area font size. Can be used if __inline = false__. |
| __alignSelectorRight__   | false | boolean | Align selector right. Can be used if __inline = false__. |
| __openSelectorTopOfInput__   | false | boolean | Open selector top of input field. The selector arrow cannot be shown if this option is true. Can be used if __inline = false__. |
| __indicateInvalidDate__   | true | boolean | If user typed date is not same format as __dateFormat__, show red background in the selection area. Can be used if __inline = false__. |
| __componentDisabled__   | false | boolean | Is selection area input field and buttons disabled or not (input disabled flag). You can also disable component by __disabled__ attribute. Can be used if __inline = false__. |
| __editableDateField__   | true | boolean | Is selection area input field editable or not (input readonly flag). Can be used if __inline = false__. |
| __showSelectorArrow__   | true | boolean | Is selector (calendar) arrow shown or not. Can be used if __inline = false__. |
| __showInputField__   | true | boolean | Is selection area input field shown or not. If not, just show the icon. Can be used if __inline = false__. |
| __openSelectorOnInputClick__   | false | boolean | Open selector when the input field is clicked. Can be used if __inline = false and editableDateField = false__. |
| __allowSelectionOnlyInCurrentMonth__ | true | boolean | Is a date selection allowed or not other than current month. |
| __ariaLabelInputField__   | Date input field | string | Aria label text of input field. |
| __ariaLabelClearDate__   | Clear Date | string | Aria label text of clear date button. |
| __ariaLabelDecreaseDate__   | Decrease Date | string | Aria label text of decrease date button. |
| __ariaLabelIncreaseDate__   | Increase Date | string | Aria label text of increase date button. |
| __ariaLabelOpenCalendar__   | Open Calendar | string | Aria label text of open calendar button. |
| __ariaLabelPrevMonth__   | Previous Month | string | Aria label text of previous month button. |
| __ariaLabelNextMonth__   | Next Month | string | Aria label text of next month button. |
| __ariaLabelPrevYear__   | Previous Year | string | Aria label text of previous year button. |
| __ariaLabelNextYear__   | Next Year | string | Aria label text of next year button. |
| __ariaLabelDay__   | Days | string | Aria label text of day button. |

* Example of the options data (not all properties listed):
```ts
  myDatePickerOptions: IMyDpOptions = {
      todayBtnTxt: 'Today',
      dateFormat: 'yyyy-mm-dd',
      firstDayOfWeek: 'mo',
      sunHighlight: true,
      inline: false,
      disableUntil: {year: 2016, month: 8, day: 10}
  };
```

### locale attribute

An ISO 639-1 language code can be provided as shorthand for the following options (dayLabels, monthLabels, dateFormat, todayBtnTxt, firstDayOfWeek and sunHighlight).
Currently supported languages: __en__, __fr__, __fr-ch__, __ja__, __fi__, __es__, __hu__, __sv__, __nl__, __ru__, __uk__, __no__, __tr__,
__pt-br__, __de__, __de-ch__, __it__, __it-ch__, __pl__, __my__, __sk__, __sl__, __zh-cn__, __he__, __ro__, __ca__, __id__, __en-au__, __am-et__, __cs__, __el__, __kk__,
__th__, __ko-kr__, __da__, __lt__, __vi__, __bn__, __bg__, __hr__, __ar__,  __is__, __tw__, __lv__ and __et__.

The __locale__ options can be override by __options__ attribute.

* new locale data can be added to [this](https://github.com/kekeh/mydatepicker/blob/master/src/my-date-picker/services/my-date-picker.locale.service.ts)
file. If you want to add a new locale create a pull request.
* locales can be tested [here](http://kekeh.github.io/mydatepicker/#inlinemode)

### defaultMonth attribute

If __selDate__ is not specified, when the calendar is opened, it will
ordinarily default to selecting the current date. If you would prefer
a different year and month to be the default for a freshly chosen date
picking operation, specify a __defaultMonth__ attribute.

Value of the defaultMonth attribute can be:
  * [IMyDefaultMonth](https://github.com/kekeh/mydatepicker/blob/master/src/my-date-picker/interfaces/my-default-month.interface.ts) object. The value of __defMonth__ property can be a string which contain year number and month number separated by delimiter. The delimiter can be any special character. For example: __08-2016__ or __08/2016__.
  * a string which contain year number and month number separated by delimiter. The delimiter can be any special character. For example: __08-2016__ or __08/2016__.

[Here](https://github.com/kekeh/mydatepicker/wiki/Initialize-with-defaultMonth-attribute) is an example on how to use this attribute.

### placeholder attribute

Placeholder text in the input field. [Here](https://github.com/kekeh/mydatepicker/wiki/Set-placeholder) is an example on how to use this attribute.

### disabled attribute

Boolean value indicating is the component disabled or not. [Here](https://github.com/kekeh/mydatepicker/wiki/Disable-component-with-disabled-attribute) is an example on how to use this attribute.

### selector attribute

Selector can be opened or closed using this attribute. Value of the selector attribute can be:
  * [IMySelector](https://github.com/kekeh/mydatepicker/blob/master/src/my-date-picker/interfaces/my-selector.interface.ts) object. The value of __open__ property is a boolean value indicating the state of the selector.

[Here](https://github.com/kekeh/mydatepicker/wiki/Open-selector-with-selector-attribute) is an example on how to use this attribute. Another way is to call a function of mydatepicker. [Here](https://github.com/kekeh/mydatepicker/wiki/Calling-date-picker-function) is an example.

## Callbacks

### dateChanged callback
  * called when the date is selected, removed or input field typing is valid
  * event parameter:
    * event.date: Date object in the following format: { day: 22, month: 11, year: 2016 }
    * event.jsdate: Javascript Date object
    * event.formatted: Date string in the same format as dateFormat option is: '2016-11-22'
    * event.epoc: Epoc time stamp number: 1479765600
  * event parameter type is [IMyDateModel](https://github.com/kekeh/mydatepicker/blob/master/src/my-date-picker/interfaces/my-date-model.interface.ts)

  * Example of the dateChanged callback:
  ```js
  onDateChanged(event: IMyDateModel) {
    console.log('onDateChanged(): ', event.date, ' - jsdate: ', new Date(event.jsdate).toLocaleDateString(), ' - formatted: ', event.formatted, ' - epoc timestamp: ', event.epoc);
  }
  ```

### inputFieldChanged callback
  * called when the value change in the input field, date is selected or date is cleared (can be used in validation, returns true or false indicating is date valid or not in the input field)
  * event parameter:
    * event.value: Value of the input field. For example: '2016-11-22'
    * event.dateFormat: Date format string in the same format as dateFormat option is. For example: 'yyyy-mm-dd'
    * event.valid: Boolean value indicating is the input field value valid or not. For example: true
  * event parameter type is [IMyInputFieldChanged](https://github.com/kekeh/mydatepicker/blob/master/src/my-date-picker/interfaces/my-input-field-changed.interface.ts)

  * Example of the input field changed callback:
  ```js
  onInputFieldChanged(event: IMyInputFieldChanged) {
    console.log('onInputFieldChanged(): Value: ', event.value, ' - dateFormat: ', event.dateFormat, ' - valid: ', event.valid);
  }
  ```

### calendarViewChanged callback
  * called when the calendar view change (year or month change)
  * event parameter:
    * event.year: Year number in calendar. For example: 2016
    * event.month: Month number in calendar. For example: 11
    * event.first: First day of selected month and year. Type of [IMyWeekday](https://github.com/kekeh/mydatepicker/blob/master/src/my-date-picker/interfaces/my-weekday.interface.ts). For example: {number: 1, weekday: "tu"}
    * event.last: Last day of selected month and year. Type of [IMyWeekday](https://github.com/kekeh/mydatepicker/blob/master/src/my-date-picker/interfaces/my-weekday.interface.ts). For example: {number: 30, weekday: "we"}
  * event parameter type is [IMyCalendarViewChanged](https://github.com/kekeh/mydatepicker/blob/master/src/my-date-picker/interfaces/my-calendar-view-changed.interface.ts)
  * values of the weekday property are same as values of the __firstDayOfWeek__ option

  * Example of the calendar view changed callback:
  ```js
  onCalendarViewChanged(event: IMyCalendarViewChanged) {
    console.log('onCalendarViewChanged(): Year: ', event.year, ' - month: ', event.month, ' - first: ', event.first, ' - last: ', event.last);
  }
  ```

### calendarToggle callback
  * called when the calendar is opened or closed
    * event: number from 1 to 4 indicating the reason of the event
      * 1 = calendar opened
      * 2 = calendar closed by date select
      * 3 = calendar closed by calendar button
      * 4 = calendar closed by outside click (document click)
      * 5 = calendar closed by ESC key
      * 6 = calendar closed by API call

  * Example of the calendar toggle callback:
  ```js
    onCalendarToggle(event: number): void {
        console.log('onCalendarClosed(): Reason: ', event);
    }
  ```

### inputFocusBlur callback
  * called when the input box get or lost focus
  * event parameter:
    * event.reason: Reason of the event:
      * 1 = focus to input box
      * 2 = focus out of input box
    * event.value: Value of input box
  * event parameter type is [IMyInputFocusBlur](https://github.com/kekeh/mydatepicker/blob/master/src/my-date-picker/interfaces/my-input-focus-blur.interface.ts)

  * Example of the input focus blur callback:
  ```js
    onInputFocusBlur(event: IMyInputFocusBlur): void {
        console.log('onInputFocusBlur(): Reason: ', event. reason, ' - Value: ', event.value);
    }
  ```

## Change styles of the component

The styles of the component can be changed by overriding the styles.

Create a separate stylesheet file which contain the changed styles. Then import the stylesheet file in the place which
is after the place where the component is loaded.

The [sampleapp](https://github.com/kekeh/mydatepicker/tree/master/sampleapp) of the component contain an example:

* [override.css](https://github.com/kekeh/mydatepicker/blob/master/sampleapp/override.css) contain the changed styles.
* [index.html](https://github.com/kekeh/mydatepicker/blob/master/sampleapp/index.html) contain import of the override.css file.


## Development of this component

* At first fork and clone this repo.

* Install all dependencies:
  1. __npm install__
  2. __npm install --global gulp-cli__

* Build the __npmdist__ folder and execute __tslint__:
  1. __gulp all__

* Execute unit tests and coverage (output is generated to the __test-output__ folder):
  1. __npm test__

* Run sample application:
  1. __npm start__
  2. Open __http://localhost:5000__ to browser

* Build a local npm installation package:
  1. __gulp all__
  2. __cd npmdist__
  3. __npm pack__
    * local installation package is created to the __npmdist__ folder. For example: __mydatepicker-1.1.1.tgz__

* Install local npm package to your project:
  1. __npm install path_to_npmdist/mydatepicker-1.1.1.tgz__

## Demo
Online demo is [here](http://kekeh.github.io/mydatepicker)

## Compatibility (tested with)
* Firefox (latest)
* Chrome (latest)
* Chromium (latest)
* Edge
* IE11
* Safari

## License
* License: MIT

## Author
* Author: kekeh

## Keywords
* Date picker
* Angular2+
* typescript

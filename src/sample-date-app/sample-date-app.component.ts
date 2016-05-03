import {Component, OnInit} from '@angular/core';
import {MyDatePicker} from '../my-date-picker/index';

declare var require;
const styles: string = require('./sample-date-app.component.scss');
const template: string = require('./sample-date-app.component.html');

@Component({
    selector: 'sample-date-picker',
    directives: [MyDatePicker],
    styles: [styles],
    template
})

export class SampleDateApp implements OnInit {
    private myDatePickerOptions = {
        todayBtnTxt: 'Today',
        dateFormat: 'dd.mm.yyyy',
        firstDayOfWeek: 'mo',
        sunHighlight: true,
        height: '34px',
        width: '260px'
    };
    selectedDate: string = '20.12.2015';

    constructor() {}

    ngOnInit() {
        console.log('onInit(): SampleDatePicker')
    }

    onDateChanged(event) {
        console.log('onDateChanged(): ', event.date, ' - formatted: ', event.formatted, ' - epoc timestamp: ', event.epoc);
    }
}

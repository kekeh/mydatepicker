import {Component, OnInit} from '@angular/core';
import {FormGroup, FormBuilder, Validators} from '@angular/forms';
import {IMyOptions} from '../../src/my-date-picker/interfaces';

declare var require:any;
const amSampleTpl: string = require('./sample-date-picker-access-modifier.html');

@Component({
    selector: 'sample-date-picker-access-modifier',
    template: amSampleTpl
})

export class SampleDatePickerAccessModifier implements OnInit {

    private myDatePickerOptions: IMyOptions = {
        dateFormat: 'dd.mm.yyyy',
        height: '34px',
        width: '210px',
        inline: false
    };

    private myForm: FormGroup;

    //private model: string = '';   // not initial date set
    //private model: Object = {date: {year: 2018, month: 10, day: 9}};   // this example is initialized to specific date

    private model = {
        mydate: <Object> {date: {year: 2018, month: 10, day: 9}},
        property1: true,
        property2: 'testing...'
    };


    private selector: number = 0;

    constructor(private formBuilder: FormBuilder) { }

    ngOnInit() {
        console.log('onInit(): SampleDatePickerReactiveForms');
        this.myForm = this.formBuilder.group({
            //myDate: ['', Validators.required]   // not initial date set
            myDate: [{date: {year: 2018, month: 10, day: 9}}, Validators.required]   // this example is initialized to specific date
        });
    }

    // ngModel functions here
    onSubmitNgModel(): void {
        console.log('Value: ', this.model);
    }

    clearNgModelDate(): void {
        this.model.mydate = '';
    }

    toggleSelector(event: any): void {
        event.stopPropagation();
        this.selector++;
    }


    // Reactive forms functions here
    onSubmitReactiveForms(): void {
        console.log('Value: ', this.myForm.controls['myDate'].value,
            ' - Valid: ', this.myForm.controls['myDate'].valid,
            ' - Invalid: ', this.myForm.controls['myDate'].invalid,
            ' - Dirty: ', this.myForm.controls['myDate'].dirty,
            ' - Pristine: ', this.myForm.controls['myDate'].pristine,
            ' - Touched: ', this.myForm.controls['myDate'].touched);
    }

    setDate(): void {
        // Set today using the setValue function
        let date: Date = new Date();
        this.myForm.setValue({myDate: {date: {year: date.getFullYear(), month: date.getMonth() + 1, day: date.getDate()}}});
    }

    resetDate(): void {
        // Reset date picker to specific date (today)
        let date: Date = new Date();
        this.myForm.reset({myDate: {date: {year: date.getFullYear(), month: date.getMonth() + 1, day: date.getDate()}}});
    }

    clearDate(): void {
        // Clear the date using the setValue function
        this.myForm.setValue({myDate: ''});
    }
}

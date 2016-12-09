///<reference path="../../node_modules/@types/jasmine/index.d.ts"/>

import {ComponentFixture, TestBed} from '@angular/core/testing';
import {By} from '@angular/platform-browser';
import {DebugElement} from '@angular/core';
import {MyDatePicker} from './my-date-picker.component';
import {InputFocusDirective} from './directives/my-date-picker.input.directive';

let comp: MyDatePicker;
let fixture: ComponentFixture<MyDatePicker>;
let de: DebugElement;
let el: HTMLElement;

let PREVMONTH: string = '.header tr td:first-child div .headerbtncell:first-child .headerbtn';
let NEXTMONTH: string = '.header tr td:first-child div .headerbtncell:last-child .headerbtn';
let PREVYEAR: string = '.header tr td:last-child div .headerbtncell:first-child .headerbtn';
let NEXTYEAR: string = '.header tr td:last-child div .headerbtncell:last-child .headerbtn';

function getDateString(date:any):string {
    return date.getFullYear() + '-' + (date.getMonth() + 1 < 10 ? '0' + date.getMonth() + 1 : date.getMonth() + 1) + '-' + (date.getDate() < 10 ? '0' + date.getDate() : date.getDate());
}

function getElement(id:string):DebugElement {
    return de.query(By.css(id));
}

function getElements(id:string):Array<DebugElement> {
    return de.queryAll(By.css(id));
}

describe('MyDatePicker', () => {
    beforeEach(() => {
        TestBed.configureTestingModule({
            declarations: [MyDatePicker, InputFocusDirective],
        });

        fixture = TestBed.createComponent(MyDatePicker);

        comp = fixture.componentInstance;

        de = fixture.debugElement.query(By.css('.mydp'));
        el = de.nativeElement;
    });

    it('set valid date', () => {
        comp.selectionDayTxt = '2016-08-22';
        fixture.detectChanges();
        let selection = getElement('.selection');
        expect(selection.nativeElement.value).toContain('2016-08-22');
    });

    it('open/close selector', () => {
        fixture.detectChanges();
        let btnpicker = getElement('.btnpicker');
        let selector = getElement('.selector');
        expect(selector).toBe(null);

        btnpicker.nativeElement.click();
        fixture.detectChanges();
        selector = getElement('.selector');
        expect(selector).not.toBe(null);

        btnpicker.nativeElement.click();
        fixture.detectChanges();
        selector = getElement('.selector');
        expect(selector).toBe(null);
    });

    it('select current day from the selector and clear', () => {
        let date = new Date();
        comp.selectedMonth = {monthTxt: '', monthNbr: date.getMonth() + 1, year: date.getFullYear()};

        fixture.detectChanges();
        let btnpicker = getElement('.btnpicker');
        btnpicker.nativeElement.click();

        fixture.detectChanges();
        let currday = getElement('.currday');
        expect(currday).not.toBe(null);

        currday.nativeElement.click();

        let dateStr = getDateString(date);
        fixture.detectChanges();
        let selection = getElement('.selection');
        expect(selection.nativeElement.value).toContain(dateStr);

        fixture.detectChanges();
        let btnclear = getElement('.btnclear');
        btnclear.nativeElement.click();
        expect(selection.nativeElement.value).toContain('');
    });

    it('select today button', () => {
        let date = new Date();

        fixture.detectChanges();
        let btnpicker = getElement('.btnpicker');
        btnpicker.nativeElement.click();

        fixture.detectChanges();
        let today = getElement('.headertodaybtn');
        expect(today).not.toBe(null);

        today.nativeElement.click();

        let dateStr = getDateString(date);
        fixture.detectChanges();
        let selection = getElement('.selection');
        expect(selection.nativeElement.value).toContain(dateStr);

        fixture.detectChanges();
        let btnclear = getElement('.btnclear');
        btnclear.nativeElement.click();
        expect(selection.nativeElement.value).toContain('');
    });

    it('select previous month', () => {
        comp.selectedMonth = {monthTxt: '', monthNbr: 5, year: 2016};

        fixture.detectChanges();
        let btnpicker = getElement('.btnpicker');
        btnpicker.nativeElement.click();

        fixture.detectChanges();
        let prevmonth = getElement('.header tr td:first-child .headerbtn:first-child');
        expect(prevmonth).not.toBe(null);

        prevmonth.nativeElement.click();

        expect(comp.visibleMonth.monthTxt).toBe('Apr');
        expect(comp.visibleMonth.monthNbr).toBe(4);
        expect(comp.visibleMonth.year).toBe(2016);
    });

    it('select next month', () => {
        comp.selectedMonth = {monthTxt: '', monthNbr: 5, year: 2016};

        fixture.detectChanges();
        let btnpicker = getElement('.btnpicker');
        btnpicker.nativeElement.click();

        fixture.detectChanges();
        let nextmonth = getElement(NEXTMONTH);
        expect(nextmonth).not.toBe(null);

        nextmonth.nativeElement.click();

        expect(comp.visibleMonth.monthTxt).toBe('Jun');
        expect(comp.visibleMonth.monthNbr).toBe(6);
        expect(comp.visibleMonth.year).toBe(2016);
    });

    it('select previous month january change year', () => {
        comp.selectedMonth = {monthTxt: '', monthNbr: 1, year: 2016};

        fixture.detectChanges();
        let btnpicker = getElement('.btnpicker');
        btnpicker.nativeElement.click();

        fixture.detectChanges();
        let prevmonth = getElement(PREVMONTH);
        expect(prevmonth).not.toBe(null);

        prevmonth.nativeElement.click();

        expect(comp.visibleMonth.year).toBe(2015);
    });

    it('select next month december change year', () => {
        comp.selectedMonth = {monthTxt: '', monthNbr: 12, year: 2016};

        fixture.detectChanges();
        let btnpicker = getElement('.btnpicker');
        btnpicker.nativeElement.click();

        fixture.detectChanges();
        let nextmonth = getElement(NEXTMONTH);
        expect(nextmonth).not.toBe(null);

        nextmonth.nativeElement.click();

        expect(comp.visibleMonth.year).toBe(2017);
    });

    it('select previous month from selector', () => {
        comp.selectedMonth = {monthTxt: '', monthNbr: 5, year: 2016};

        fixture.detectChanges();
        let btnpicker = getElement('.btnpicker');
        btnpicker.nativeElement.click();

        comp.parseOptions();

        fixture.detectChanges();
        let prevmonth = getElement(PREVMONTH);
        expect(prevmonth).not.toBe(null);

        prevmonth.nativeElement.click();
        expect(comp.visibleMonth.monthNbr).toBe(4);
        expect(comp.visibleMonth.monthTxt).toBe('Apr');

        prevmonth.nativeElement.click();
        expect(comp.visibleMonth.monthNbr).toBe(3);
        expect(comp.visibleMonth.monthTxt).toBe('Mar');
    });

    it('select next month from selector', () => {
        comp.selectedMonth = {monthTxt: '', monthNbr: 5, year: 2016};

        fixture.detectChanges();
        let btnpicker = getElement('.btnpicker');
        btnpicker.nativeElement.click();

        comp.parseOptions();

        fixture.detectChanges();
        let nextmonth = getElement(NEXTMONTH);
        expect(nextmonth).not.toBe(null);

        nextmonth.nativeElement.click();
        expect(comp.visibleMonth.monthNbr).toBe(6);
        expect(comp.visibleMonth.monthTxt).toBe('Jun');

        nextmonth.nativeElement.click();
        expect(comp.visibleMonth.monthNbr).toBe(7);
        expect(comp.visibleMonth.monthTxt).toBe('Jul');
    });

    it('select previous year', () => {
        comp.selectedMonth = {monthTxt: '', monthNbr: 5, year: 2016};

        fixture.detectChanges();
        let btnpicker = getElement('.btnpicker');
        btnpicker.nativeElement.click();

        comp.parseOptions();

        fixture.detectChanges();
        let prevyear = getElement(PREVYEAR);
        expect(prevyear).not.toBe(null);

        prevyear.nativeElement.click();
        fixture.detectChanges();
        let yearLabel = getElement('.headeryeartxt .headerlabelbtn');
        expect(yearLabel).not.toBe(null);
        expect(yearLabel.nativeElement.textContent).toBe('2015');
    });

    it('select next year', () => {
        comp.selectedMonth = {monthTxt: '', monthNbr: 5, year: 2016};

        fixture.detectChanges();
        let btnpicker = getElement('.btnpicker');
        btnpicker.nativeElement.click();

        comp.parseOptions();

        fixture.detectChanges();
        let nextyear = getElement(NEXTYEAR);
        expect(nextyear).not.toBe(null);

        nextyear.nativeElement.click();

        fixture.detectChanges();
        let yearLabel = getElement('.headeryeartxt .headerlabelbtn');
        expect(yearLabel).not.toBe(null);
        expect(yearLabel.nativeElement.textContent).toBe('2017');
    });

    it('test calendar year 2016 month one by one - next month button', () => {
        comp.selectedMonth = {monthTxt: '', monthNbr: 1, year: 2016};

        comp.options = {firstDayOfWeek: 'mo'};

        comp.parseOptions();

        fixture.detectChanges();
        let btnpicker = getElement('.btnpicker');
        btnpicker.nativeElement.click();

        fixture.detectChanges();
        let monthlabel = getElement('.monthlabel');
        expect(monthlabel).not.toBe(null);
        expect(monthlabel.nativeElement.textContent.trim()).toBe('Jan');

        fixture.detectChanges();
        let yearlabel = getElement('.yearlabel');
        expect(yearlabel).not.toBe(null);
        expect(yearlabel.nativeElement.textContent.trim()).toBe('2016');

        comp.generateCalendar(1, 2016);

        let beginDate: Array<string> = ['28', '1', '29', '28', '25', '30', '27', '1', '29', '26', '31', '28'];
        let endDate: Array<string> = ['7', '13', '10', '8', '5', '10', '7', '11', '9', '6', '11', '8'];

        let i: number = 0;
        do {
            fixture.detectChanges();
            let currmonth = getElements('.caltable tbody tr td');
            expect(currmonth).not.toBe(null);
            expect(currmonth.length).toBe(42);

            expect(currmonth[0]).not.toBe(null);
            expect(currmonth[0].nativeElement.textContent.trim()).toBe(beginDate[i]);

            expect(currmonth[41]).not.toBe(null);
            expect(currmonth[41].nativeElement.textContent.trim()).toBe(endDate[i]);

            comp.nextMonth();

            i++;
        } while (i < 12)
    });

    it('test calendar year 2016 month one by one - previous month button', () => {
        comp.selectedMonth = {monthTxt: '', monthNbr: 12, year: 2016};

        comp.options = {firstDayOfWeek: 'mo'};

        comp.parseOptions();

        fixture.detectChanges();
        let btnpicker = getElement('.btnpicker');
        btnpicker.nativeElement.click();

        fixture.detectChanges();
        let monthlabel = getElement('.monthlabel');
        expect(monthlabel).not.toBe(null);
        expect(monthlabel.nativeElement.textContent.trim()).toBe('Dec');

        fixture.detectChanges();
        let yearlabel = getElement('.yearlabel');
        expect(yearlabel).not.toBe(null);
        expect(yearlabel.nativeElement.textContent.trim()).toBe('2016');

        comp.generateCalendar(12, 2016);

        let beginDate: Array<string> = ['28', '1', '29', '28', '25', '30', '27', '1', '29', '26', '31', '28'];
        let endDate: Array<string> = ['7', '13', '10', '8', '5', '10', '7', '11', '9', '6', '11', '8'];

        let i: number = 11;
        do {
            fixture.detectChanges();
            let currmonth = getElements('.caltable tbody tr td');
            expect(currmonth).not.toBe(null);
            expect(currmonth.length).toBe(42);

            expect(currmonth[0]).not.toBe(null);
            expect(currmonth[0].nativeElement.textContent.trim()).toBe(beginDate[i]);

            expect(currmonth[41]).not.toBe(null);
            expect(currmonth[41].nativeElement.textContent.trim()).toBe(endDate[i]);

            comp.prevMonth();

            i--;
        } while (i >= 0)
    });

    // options
    it('options - dayLabels', () => {
        comp.selectedMonth = {monthTxt: '', monthNbr: 5, year: 2016};
        comp.options = {dayLabels:  {su: '1', mo: '2', tu: '3', we: '4', th: '5', fr: '6', sa: '7'}, firstDayOfWeek: 'su'};

        comp.parseOptions();

        fixture.detectChanges();
        let btnpicker = getElement('.btnpicker');
        btnpicker.nativeElement.click();

        fixture.detectChanges();
        let ths = getElements('.caltable thead tr th');
        expect(ths.length).toBe(7);
        for(let i in ths) {
            let el = ths[i];
            expect(parseInt(el.nativeElement.textContent)).toBe(parseInt(i) + 1);
        }
    });

    it('options - monthLabels', () => {
        comp.selectedMonth = {monthTxt: '', monthNbr: 1, year: 2016};
        comp.options = {monthLabels:  { 1: '1', 2: '2', 3: '3', 4: '4', 5: '5', 6: '6', 7: '7', 8: '8', 9: '9', 10: '10', 11: '11', 12: '12' }};

        comp.parseOptions();

        fixture.detectChanges();
        let btnpicker = getElement('.btnpicker');
        btnpicker.nativeElement.click();

        fixture.detectChanges();
        let nextmonth = getElement(NEXTMONTH);
        expect(nextmonth).not.toBe(null);

        for(let i = 1; i <= 12; i++) {
            fixture.detectChanges();
            let monthLabel = getElement('.headermonthtxt .headerlabelbtn');
            expect(parseInt(monthLabel.nativeElement.textContent)).toBe(i);
            nextmonth.nativeElement.click();
        }
    });

    it('options - date format', () => {
        comp.options = {dateFormat: 'dd.mm.yyyy', indicateInvalidDate: true};

        comp.parseOptions();

        let value = {target:{value:'2016-08-22'}};
        comp.userDateInput(value);
        expect(comp.invalidDate).toBe(true);

        fixture.detectChanges();
        let invaliddate = getElement('.invaliddate');
        expect(invaliddate).not.toBe(null);

        value = {target:{value:'2016-08-2'}};
        comp.userDateInput(value);
        expect(comp.invalidDate).toBe(true);

        value = {target:{value:'16.09/2016'}};
        comp.userDateInput(value);
        expect(comp.invalidDate).toBe(true);

        value = {target:{value:'2016-08-xx'}};
        comp.userDateInput(value);
        expect(comp.invalidDate).toBe(true);

        value = {target:{value:'16.09.999'}};
        comp.userDateInput(value);
        expect(comp.invalidDate).toBe(true);

        value = {target:{value:'16.09.19999'}};
        comp.userDateInput(value);
        expect(comp.invalidDate).toBe(true);

        value = {target:{value:'16.09.2016'}};
        comp.userDateInput(value);
        expect(comp.invalidDate).toBe(false);

        comp.options = {dateFormat: 'dd mmm yyyy', indicateInvalidDate: true};

        comp.parseOptions();

        value = {target:{value:'2016-08-22'}};
        comp.userDateInput(value);
        expect(comp.invalidDate).toBe(true);

        value = {target:{value:'22 Aug 2016'}};
        comp.userDateInput(value);
        expect(comp.invalidDate).toBe(false);
    });

    it('options - show today button', () => {
        comp.selectedMonth = {monthTxt: '', monthNbr: 1, year: 2016};

        comp.parseOptions();

        fixture.detectChanges();
        let btnpicker = getElement('.btnpicker');
        btnpicker.nativeElement.click();

        fixture.detectChanges();
        let headertodaybtn = getElement('.headertodaybtn');
        expect(headertodaybtn).not.toBe(null);

        btnpicker.nativeElement.click();

        comp.options = {showTodayBtn: false};
        comp.parseOptions();

        fixture.detectChanges();
        btnpicker = getElement('.btnpicker');
        btnpicker.nativeElement.click();

        fixture.detectChanges();
        headertodaybtn = getElement('.headertodaybtn');
        expect(headertodaybtn).toBe(null);

        btnpicker.nativeElement.click();

        comp.options = {showTodayBtn: true};
        comp.parseOptions();

        fixture.detectChanges();
        btnpicker = getElement('.btnpicker');
        btnpicker.nativeElement.click();

        fixture.detectChanges();
        headertodaybtn = getElement('.headertodaybtn');
        expect(headertodaybtn).not.toBe(null);
    });

    it('options - today button text', () => {
        comp.selectedMonth = {monthTxt: '', monthNbr: 1, year: 2016};
        comp.options = {todayBtnTxt: 'test text'};

        comp.parseOptions();

        fixture.detectChanges();
        let btnpicker = getElement('.btnpicker');
        btnpicker.nativeElement.click();

        fixture.detectChanges();
        let headertodaybtn = getElement('.headertodaybtn');
        expect(headertodaybtn).not.toBe(null);
        expect(headertodaybtn.nativeElement.textContent).toBe('test text');
    });

    it('options - first day of week', () => {
        comp.selectedMonth = {monthTxt: '', monthNbr: 5, year: 2016};
        comp.options = {firstDayOfWeek: 'tu'};

        comp.parseOptions();

        fixture.detectChanges();
        let btnpicker = getElement('.btnpicker');
        btnpicker.nativeElement.click();

        fixture.detectChanges();
        let first = getElement('.caltable thead tr th:first-child');
        expect(first).not.toBe(null);
        expect(first.nativeElement.textContent).toBe('Tue');

        let last = getElement('.caltable thead tr th:last-child');
        expect(last).not.toBe(null);
        expect(last.nativeElement.textContent).toBe('Mon');
    });

    it('options - sunday highlight', () => {
        comp.selectedMonth = {monthTxt: '', monthNbr: 5, year: 2016};
        comp.options = {sunHighlight: true};

        comp.parseOptions();

        fixture.detectChanges();
        let btnpicker = getElement('.btnpicker');
        btnpicker.nativeElement.click();

        fixture.detectChanges();
        let sunday = getElement('.sunday');
        expect(sunday).not.toBe(null);

        btnpicker.nativeElement.click();

        comp.options = {sunHighlight: false};

        comp.parseOptions();

        fixture.detectChanges();
        btnpicker.nativeElement.click();

        comp.parseOptions();

        fixture.detectChanges();
        sunday = getElement('.sunday');
        expect(sunday).toBe(null);
    });

    it('options - current day marked', () => {
        comp.options = {markCurrentDay: true};

        comp.parseOptions();

        fixture.detectChanges();
        let btnpicker = getElement('.btnpicker');
        btnpicker.nativeElement.click();

        fixture.detectChanges();
        let currday = getElement('.currday');
        expect(currday).not.toBe(null);

        btnpicker.nativeElement.click();

        comp.options = {markCurrentDay: false};

        comp.parseOptions();

        fixture.detectChanges();
        btnpicker.nativeElement.click();

        comp.parseOptions();

        fixture.detectChanges();
        currday = getElement('.currday');
        expect(currday).toBe(null);
    });

    it('options - editable month and year', () => {
        comp.selectedMonth = {monthTxt: '', monthNbr: 5, year: 2016};
        comp.options = {editableMonthAndYear: true};

        comp.parseOptions();

        fixture.detectChanges();
        let btnpicker = getElement('.btnpicker');
        btnpicker.nativeElement.click();

        fixture.detectChanges();
        let montlabel = getElement('.headermonthtxt .headerlabelbtn');
        expect(montlabel).not.toBe(null);
        montlabel.nativeElement.click();

        fixture.detectChanges();
        let monthinput = getElement('.monthinput');
        expect(monthinput).not.toBe(null);

        comp.userMonthInput({target:{value:'jan'}});

        fixture.detectChanges();
        montlabel = getElement('.headermonthtxt .headerlabelbtn');
        expect(montlabel).not.toBe(null);
        expect(montlabel.nativeElement.textContent).toBe('Jan');


        fixture.detectChanges();
        let yearlabel = getElement('.headeryeartxt .headerlabelbtn');
        expect(yearlabel).not.toBe(null);
        yearlabel.nativeElement.click();

        fixture.detectChanges();
        let yearinput = getElement('.yearinput');
        expect(yearinput).not.toBe(null);

        comp.userYearInput({target:{value:'2019'}});

        fixture.detectChanges();
        yearlabel = getElement('.headeryeartxt .headerlabelbtn');
        expect(yearlabel).not.toBe(null);
        expect(yearlabel.nativeElement.textContent).toBe('2019');
    });

    it('options - min year', () => {
        comp.visibleMonth = {monthTxt: 'May', monthNbr: 5, year: 2016};
        comp.options = {minYear: 2000};

        comp.parseOptions();

        fixture.detectChanges();
        let btnpicker = getElement('.btnpicker');
        btnpicker.nativeElement.click();

        fixture.detectChanges();
        let yearlabel = getElement('.headeryeartxt .headerlabelbtn');
        expect(yearlabel).not.toBe(null);
        yearlabel.nativeElement.click();

        fixture.detectChanges();
        let yearinput = getElement('.yearinput');
        expect(yearinput).not.toBe(null);

        comp.userYearInput({target:{value:1999}});

        fixture.detectChanges();
        let invalidyear = getElement('.invalidyear');
        expect(invalidyear).not.toBe(null);

        comp.userYearInput({target:{value:2000}});

        fixture.detectChanges();
        yearlabel = getElement('.headeryeartxt .headerlabelbtn');
        expect(yearlabel).not.toBe(null);
        expect(yearlabel.nativeElement.textContent).toBe('2000');
    });

    it('options - max year', () => {
        comp.visibleMonth = {monthTxt: 'May', monthNbr: 5, year: 2016};
        comp.options = {maxYear: 2020};

        comp.parseOptions();

        fixture.detectChanges();
        let btnpicker = getElement('.btnpicker');
        btnpicker.nativeElement.click();

        fixture.detectChanges();
        let yearlabel = getElement('.headeryeartxt .headerlabelbtn');
        expect(yearlabel).not.toBe(null);
        yearlabel.nativeElement.click();

        fixture.detectChanges();
        let yearinput = getElement('.yearinput');
        expect(yearinput).not.toBe(null);

        comp.userYearInput({target:{value:2021}});

        fixture.detectChanges();
        let invalidyear = getElement('.invalidyear');
        expect(invalidyear).not.toBe(null);

        comp.userYearInput({target:{value:2020}});

        fixture.detectChanges();
        yearlabel = getElement('.headeryeartxt .headerlabelbtn');
        expect(yearlabel).not.toBe(null);
        expect(yearlabel.nativeElement.textContent).toBe('2020');
    });

    it('options - disable until', () => {
        comp.selectedMonth = {monthTxt: '', monthNbr: 10, year: 2016};
        comp.options = {disableUntil: {year: 2016, month: 10, day: 5}};

        comp.parseOptions();

        fixture.detectChanges();
        let btnpicker = getElement('.btnpicker');
        btnpicker.nativeElement.click();

        comp.generateCalendar(10, 2016);

        fixture.detectChanges();
        let disabled = getElements('tr .disabled');
        expect(disabled).not.toBe(null);
        expect(disabled.length).toBe(10);

        let firstDisabled = disabled[0];
        expect(firstDisabled.nativeElement.textContent.trim()).toBe('26');

        let lastDisabled = disabled[disabled.length - 1];
        expect(lastDisabled.nativeElement.textContent.trim()).toBe('5');

        fixture.detectChanges();
        lastDisabled.nativeElement.click();
        let selection = getElement('.selection');
        expect(selection.nativeElement.value).toBe('');

        fixture.detectChanges();
        let selectableDays = getElements('.tablesingleday');
        expect(selectableDays).not.toBe(null);
        expect(selectableDays.length).toBe(26);

        selectableDays[0].nativeElement.click();
        fixture.detectChanges();
        selection = getElement('.selection');
        expect(selection.nativeElement.value).toContain('2016-10-06');
    });

    it('options - disable since', () => {
        comp.selectedMonth = {monthTxt: '', monthNbr: 10, year: 2016};
        comp.options = {disableSince: {year: 2016, month: 10, day: 30}};

        comp.parseOptions();

        fixture.detectChanges();
        let btnpicker = getElement('.btnpicker');
        btnpicker.nativeElement.click();

        comp.generateCalendar(10, 2016);

        fixture.detectChanges();
        let disabled = getElements('tr .disabled');
        expect(disabled).not.toBe(null);
        expect(disabled.length).toBe(8);

        let firstDisabled = disabled[0];
        expect(firstDisabled.nativeElement.textContent.trim()).toBe('30');

        let lastDisabled = disabled[disabled.length - 1];
        expect(lastDisabled.nativeElement.textContent.trim()).toBe('6');

        fixture.detectChanges();
        lastDisabled.nativeElement.click();
        let selection = getElement('.selection');
        expect(selection.nativeElement.value).toBe('');

        fixture.detectChanges();
        let selectableDays = getElements('.tablesingleday');
        expect(selectableDays).not.toBe(null);
        expect(selectableDays.length).toBe(29);

        selectableDays[5].nativeElement.click();

        fixture.detectChanges();
        selection = getElement('.selection');
        expect(selection.nativeElement.value).toContain('2016-10-06');
    });

    it('options - disable days one by one', () => {
        comp.selectedMonth = {monthTxt: '', monthNbr: 10, year: 2016};
        comp.options = {disableDays: [{year: 2016, month: 10, day: 5}, {year: 2016, month: 10, day: 10}]};

        comp.parseOptions();

        fixture.detectChanges();
        let btnpicker = getElement('.btnpicker');
        btnpicker.nativeElement.click();

        comp.generateCalendar(10, 2016);

        fixture.detectChanges();
        let disabled = getElements('tr .disabled');
        expect(disabled).not.toBe(null);
        expect(disabled.length).toBe(2);

        let firstDisabled = disabled[0];
        expect(firstDisabled.nativeElement.textContent.trim()).toBe('5');

        let lastDisabled = disabled[1];
        expect(lastDisabled.nativeElement.textContent.trim()).toBe('10');
    });

    it('options - disable today - today button disabled', () => {
        comp.selectedMonth = {monthTxt: '', monthNbr: 10, year: 2016};

        let date = new Date();
        comp.options = {disableDays: [{year: date.getFullYear(), month: date.getMonth() + 1, day: date.getDate()}]};

        comp.parseOptions();

        fixture.detectChanges();
        let btnpicker = getElement('.btnpicker');
        btnpicker.nativeElement.click();

        comp.generateCalendar(10, 2016);

        fixture.detectChanges();
        let headertodaybtn = getElement('.headertodaybtn');
        expect(headertodaybtn).not.toBe(null);
        expect(headertodaybtn.properties['disabled']).toBe(true);

        fixture.detectChanges();
        headertodaybtn.nativeElement.click();
        let selector = getElement('.selector');
        expect(selector).not.toBe(null);

        btnpicker.nativeElement.click();

        comp.options = {disableDays: []};
        comp.parseOptions();

        fixture.detectChanges();
        btnpicker.nativeElement.click();
        comp.generateCalendar(10, 2016);

        fixture.detectChanges();
        headertodaybtn = getElement('.headertodaybtn');
        expect(headertodaybtn).not.toBe(null);
        expect(headertodaybtn.properties['disabled']).toBe(false);

        headertodaybtn.nativeElement.click();

        fixture.detectChanges();
        let selection = getElement('.selection');
        expect(selection).not.toBe(null);
        expect(selection.nativeElement.value).toBe(getDateString(date));
    });

    it('options - disable weekends', () => {
        comp.selectedMonth = {monthTxt: '', monthNbr: 10, year: 2016};
        comp.options = {firstDayOfWeek: 'mo', disableWeekends: true};

        comp.parseOptions();

        fixture.detectChanges();
        let btnpicker = getElement('.btnpicker');
        btnpicker.nativeElement.click();

        comp.generateCalendar(10, 2016);

        fixture.detectChanges();
        let disabled = getElements('tr .disabled');
        expect(disabled).not.toBe(null);
        expect(disabled.length).toBe(12);

        let firstDisabled = disabled[0];
        expect(firstDisabled.nativeElement.textContent.trim()).toBe('1');

        let secondDisabled = disabled[1];
        expect(secondDisabled.nativeElement.textContent.trim()).toBe('2');

        let lastDisabled = disabled[disabled.length - 1];
        expect(lastDisabled.nativeElement.textContent.trim()).toBe('6');

        fixture.detectChanges();
        firstDisabled.nativeElement.click();
        let selection = getElement('.selection');
        expect(selection.nativeElement.value).toBe('');

        fixture.detectChanges();
        secondDisabled.nativeElement.click();
        selection = getElement('.selection');
        expect(selection.nativeElement.value).toBe('');

        fixture.detectChanges();
        let selectableDays = getElements('.tablesingleday');
        expect(selectableDays).not.toBe(null);
        expect(selectableDays.length).toBe(21);

        selectableDays[0].nativeElement.click();

        fixture.detectChanges();
        selection = getElement('.selection');
        expect(selection.nativeElement.value).toContain('2016-10-03');
    });

    it('options - inline', () => {
        comp.selectedMonth = {monthTxt: '', monthNbr: 10, year: 2016};
        comp.options = {inline: true};

        comp.parseOptions();

        fixture.detectChanges();
        let selector = getElement('.selector');
        expect(selector).not.toBe(null);

        fixture.detectChanges();
        let selectiongroup = getElement('.selectiongroup');
        expect(selectiongroup).toBe(null);
    });

    it('options - height', () => {
        comp.selectedMonth = {monthTxt: '', monthNbr: 10, year: 2016};
        comp.options = {height: '50px'};

        comp.parseOptions();

        fixture.detectChanges();
        let selection = getElement('.selection');
        expect(selection).not.toBe(null);
        expect(selection.styles['height']).toBe('50px');
    });

    it('options - width', () => {
        comp.selectedMonth = {monthTxt: '', monthNbr: 10, year: 2016};
        comp.options = {width: '300px'};

        comp.parseOptions();

        fixture.detectChanges();
        expect(de).not.toBe(null);
        expect(de.styles['width']).toBe('300px');

        comp.options = {width: '20%'};

        comp.parseOptions();

        fixture.detectChanges();
        expect(de).not.toBe(null);
        expect(de.styles['width']).toBe('20%');
    });

    it('options - selection text font size', () => {
        comp.selectedMonth = {monthTxt: '', monthNbr: 10, year: 2016};
        comp.options = {selectionTxtFontSize: '10px'};

        comp.parseOptions();

        fixture.detectChanges();
        let selection = getElement('.selection');
        expect(selection).not.toBe(null);
        expect(selection.styles['font-size']).toBe('10px');
    });

    it('options - align selector right', () => {
        comp.selectedMonth = {monthTxt: '', monthNbr: 10, year: 2016};
        comp.options = {alignSelectorRight: true};

        fixture.detectChanges();
        let btnpicker = getElement('.btnpicker');
        btnpicker.nativeElement.click();

        comp.parseOptions();

        fixture.detectChanges();
        let alignselectorright = getElement('.alignselectorright');
        expect(alignselectorright).not.toBe(null);

        comp.options = {alignSelectorRight: false};

        comp.parseOptions();

        fixture.detectChanges();
        alignselectorright = getElement('.alignselectorright');
        expect(alignselectorright).toBe(null);
    });

    it('options - indicate invalid date', () => {
        comp.selectedMonth = {monthTxt: '', monthNbr: 10, year: 2016};
        comp.options = {indicateInvalidDate: true, dateFormat: 'dd.mm.yyyy'};

        comp.parseOptions();

        comp.userDateInput({target:{value:'2016-08-22'}});
        fixture.detectChanges();
        let invaliddate = getElement('.invaliddate');
        expect(invaliddate).not.toBe(null);

        comp.userDateInput({target:{value:'2016-08-xx'}});
        fixture.detectChanges();
        invaliddate = getElement('.invaliddate');
        expect(invaliddate).not.toBe(null);

        comp.userDateInput({target:{value:'2016-08-99'}});
        fixture.detectChanges();
        invaliddate = getElement('.invaliddate');
        expect(invaliddate).not.toBe(null);

        comp.userDateInput({target:{value:'10.10.2016'}});
        fixture.detectChanges();
        invaliddate = getElement('.invaliddate');
        expect(invaliddate).toBe(null);
    });
    
    it('options - disableUntil input dates validation', ()=> {
        comp.options = {
            indicateInvalidDate: true, 
            dateFormat: 'dd.mm.yyyy', 
            disableUntil:{year: 2016, month: 11, day: 4}
        };
        
        comp.parseOptions();
        
        comp.userDateInput({target:{value:'11.12.2015'}});
        fixture.detectChanges();
        let invaliddate = getElement('.invaliddate');
        expect(invaliddate).not.toBe(null);

        comp.userDateInput({target:{value:'11.06.2016'}});
        fixture.detectChanges();
        invaliddate = getElement('.invaliddate');
        expect(invaliddate).not.toBe(null);

        comp.userDateInput({target:{value:'04.11.2016'}});
        fixture.detectChanges();
        invaliddate = getElement('.invaliddate');
        expect(invaliddate).not.toBe(null);

        comp.userDateInput({target:{value:'05.11.2016'}});
        fixture.detectChanges();
        invaliddate = getElement('.invaliddate');
        expect(invaliddate).toBe(null);

        comp.options = {
            indicateInvalidDate: true,
            dateFormat: 'dd.mm.yyyy',
            disableUntil:{year: 0, month: 0, day: 0}
        };

        comp.parseOptions();

        comp.userDateInput({target:{value:'11.12.2015'}});
        fixture.detectChanges();
        invaliddate = getElement('.invaliddate');
        expect(invaliddate).toBe(null);
    });

    it('options - disableSince input dates validation', ()=> {
        comp.options = {
            indicateInvalidDate: true,
            dateFormat: 'dd.mm.yyyy',
            disableSince:{year: 2016, month: 11, day: 22}
        };

        comp.parseOptions();

        comp.userDateInput({target:{value:'08.12.2017'}});
        fixture.detectChanges();
        let invaliddate = getElement('.invaliddate');
        expect(invaliddate).not.toBe(null);

        comp.userDateInput({target:{value:'08.12.2016'}});
        fixture.detectChanges();
        invaliddate = getElement('.invaliddate');
        expect(invaliddate).not.toBe(null);

        comp.userDateInput({target:{value:'23.11.2016'}});
        fixture.detectChanges();
        invaliddate = getElement('.invaliddate');
        expect(invaliddate).not.toBe(null);

        comp.userDateInput({target:{value:'21.11.2016'}});
        fixture.detectChanges();
        invaliddate = getElement('.invaliddate');
        expect(invaliddate).toBe(null);

        comp.options = {
            indicateInvalidDate: true,
            dateFormat: 'dd.mm.yyyy',
            disableSince:{year: 0, month: 0, day: 0}
        };

        comp.parseOptions();

        comp.userDateInput({target:{value:'11.12.2015'}});
        fixture.detectChanges();
        invaliddate = getElement('.invaliddate');
        expect(invaliddate).toBe(null);
    });

    it('options - disable weekends input date validation', () => {
        comp.selectedMonth = {monthTxt: '', monthNbr: 11, year: 2016};
        comp.options = {
            indicateInvalidDate: true,
            dateFormat: 'dd.mm.yyyy',
            disableWeekends: true,
            firstDayOfWeek: 'mo'
        };

        comp.parseOptions();

        comp.userDateInput({target:{value:'05.11.2016'}});
        fixture.detectChanges();
        let invaliddate = getElement('.invaliddate');
        expect(invaliddate).not.toBe(null);

        comp.userDateInput({target:{value:'06.11.2016'}});
        fixture.detectChanges();
        invaliddate = getElement('.invaliddate');
        expect(invaliddate).not.toBe(null);

        comp.userDateInput({target:{value:'12.11.2016'}});
        fixture.detectChanges();
        invaliddate = getElement('.invaliddate');
        expect(invaliddate).not.toBe(null);

        comp.userDateInput({target:{value:'13.11.2016'}});
        fixture.detectChanges();
        invaliddate = getElement('.invaliddate');
        expect(invaliddate).not.toBe(null);

        comp.userDateInput({target:{value:'19.11.2016'}});
        fixture.detectChanges();
        invaliddate = getElement('.invaliddate');
        expect(invaliddate).not.toBe(null);

        comp.userDateInput({target:{value:'20.11.2016'}});
        fixture.detectChanges();
        invaliddate = getElement('.invaliddate');
        expect(invaliddate).not.toBe(null);

        comp.userDateInput({target:{value:'26.11.2016'}});
        fixture.detectChanges();
        invaliddate = getElement('.invaliddate');
        expect(invaliddate).not.toBe(null);

        comp.userDateInput({target:{value:'27.11.2016'}});
        fixture.detectChanges();
        invaliddate = getElement('.invaliddate');
        expect(invaliddate).not.toBe(null);

        comp.userDateInput({target:{value:'04.11.2016'}});
        fixture.detectChanges();
        invaliddate = getElement('.invaliddate');
        expect(invaliddate).toBe(null);
    });

    it('options - disableDays input date validation', () => {
        comp.selectedMonth = {monthTxt: '', monthNbr: 11, year: 2016};
        comp.options = {
            indicateInvalidDate: true,
            dateFormat: 'dd.mm.yyyy',
            disableDays: [
                {year: 2016, month: 11, day: 1},
                {year: 2016, month: 11, day: 3},
                {year: 2016, month: 11, day: 5},
                {year: 2016, month: 11, day: 7}
            ],
            firstDayOfWeek: 'mo'
        };

        comp.parseOptions();

        comp.userDateInput({target:{value:'01.11.2016'}});
        fixture.detectChanges();
        let invaliddate = getElement('.invaliddate');
        expect(invaliddate).not.toBe(null);

        comp.userDateInput({target:{value:'03.11.2016'}});
        fixture.detectChanges();
        invaliddate = getElement('.invaliddate');
        expect(invaliddate).not.toBe(null);

        comp.userDateInput({target:{value:'05.11.2016'}});
        fixture.detectChanges();
        invaliddate = getElement('.invaliddate');
        expect(invaliddate).not.toBe(null);

        comp.userDateInput({target:{value:'07.11.2016'}});
        fixture.detectChanges();
        invaliddate = getElement('.invaliddate');
        expect(invaliddate).not.toBe(null);

        comp.userDateInput({target:{value:'02.11.2016'}});
        fixture.detectChanges();
        invaliddate = getElement('.invaliddate');
        expect(invaliddate).toBe(null);
    });

    it('options - show date format in placeholder', () => {
        comp.selectedMonth = {monthTxt: '', monthNbr: 10, year: 2016};
        comp.options = {showDateFormatPlaceholder: true, dateFormat: 'dd.mm.yyyy'};

        comp.parseOptions();

        fixture.detectChanges();
        let selection = getElement('.selection');
        expect(selection).not.toBe(null);
        expect(selection.properties['placeholder']).toBe(comp.opts.dateFormat);

        comp.options = {showDateFormatPlaceholder: false, dateFormat: 'dd.mm.yyyy'};

        comp.parseOptions();

        fixture.detectChanges();
        selection = getElement('.selection');
        expect(selection).not.toBe(null);
        expect(selection.properties['placeholder']).toBe('');
    });

    it('options - disable component', () => {
        comp.selectedMonth = {monthTxt: '', monthNbr: 10, year: 2016};
        comp.options = {componentDisabled: true};
        comp.parseOptions();

        fixture.detectChanges();
        let btnpicker = getElement('.btnpicker');

        btnpicker.nativeElement.click();
        fixture.detectChanges();

        let selector = getElement('.selector');
        expect(selector).toBe(null);

        fixture.detectChanges();
        let selection = getElement('.selection');

        selection.nativeElement.value = '2016-11-14';

        fixture.detectChanges();
        expect(selection.nativeElement.value).toContain('');
    });

    it('options - editable date field', () => {
        comp.selectedMonth = {monthTxt: '', monthNbr: 10, year: 2016};
        comp.options = {editableDateField: false};
        comp.parseOptions();

        fixture.detectChanges();
        let selection = getElement('.selection');

        selection.nativeElement.value = '2016-11-14';

        fixture.detectChanges();
        expect(selection.nativeElement.value).toContain('');

        comp.options = {editableDateField: true};
        comp.parseOptions();

        fixture.detectChanges();
        selection = getElement('.selection');

        selection.nativeElement.value = '2016-11-14';

        fixture.detectChanges();
        expect(selection.nativeElement.value).toContain('2016-11-14');
    });

    it('locale - use fr locale', () => {
        comp.selectedMonth = {monthTxt: '', monthNbr: 1, year: 2016};
        comp.locale = 'fr';

        comp.parseOptions();

        fixture.detectChanges();
        let btnpicker = getElement('.btnpicker');
        btnpicker.nativeElement.click();

        fixture.detectChanges();
        let days = getElements('.caltable thead tr th');
        expect(days.length).toBe(7);
        expect(days[0].nativeElement.textContent).toBe('Lun');
        expect(days[1].nativeElement.textContent).toBe('Mar');
        expect(days[2].nativeElement.textContent).toBe('Mer');
        expect(days[3].nativeElement.textContent).toBe('Jeu');
        expect(days[4].nativeElement.textContent).toBe('Ven');
        expect(days[5].nativeElement.textContent).toBe('Sam');
        expect(days[6].nativeElement.textContent).toBe('Dim');

        fixture.detectChanges();
        let nextmonth = getElement(NEXTMONTH);
        expect(nextmonth).not.toBe(null);

        fixture.detectChanges();
        let monthLabel = getElement('.headermonthtxt .headerlabelbtn');
        expect(monthLabel.nativeElement.textContent).toBe('Jan');

        nextmonth.nativeElement.click();
        fixture.detectChanges();
        monthLabel = getElement('.headermonthtxt .headerlabelbtn');
        expect(monthLabel.nativeElement.textContent).toBe('Fév');

        nextmonth.nativeElement.click();
        fixture.detectChanges();
        monthLabel = getElement('.headermonthtxt .headerlabelbtn');
        expect(monthLabel.nativeElement.textContent).toBe('Mar');

        nextmonth.nativeElement.click();
        fixture.detectChanges();
        monthLabel = getElement('.headermonthtxt .headerlabelbtn');
        expect(monthLabel.nativeElement.textContent).toBe('Avr');

        nextmonth.nativeElement.click();
        fixture.detectChanges();
        monthLabel = getElement('.headermonthtxt .headerlabelbtn');
        expect(monthLabel.nativeElement.textContent).toBe('Mai');

        nextmonth.nativeElement.click();
        fixture.detectChanges();
        monthLabel = getElement('.headermonthtxt .headerlabelbtn');
        expect(monthLabel.nativeElement.textContent).toBe('Juin');

        nextmonth.nativeElement.click();
        fixture.detectChanges();
        monthLabel = getElement('.headermonthtxt .headerlabelbtn');
        expect(monthLabel.nativeElement.textContent).toBe('Juil');

        nextmonth.nativeElement.click();
        fixture.detectChanges();
        monthLabel = getElement('.headermonthtxt .headerlabelbtn');
        expect(monthLabel.nativeElement.textContent).toBe('Aoû');

        nextmonth.nativeElement.click();
        fixture.detectChanges();
        monthLabel = getElement('.headermonthtxt .headerlabelbtn');
        expect(monthLabel.nativeElement.textContent).toBe('Sep');

        nextmonth.nativeElement.click();
        fixture.detectChanges();
        monthLabel = getElement('.headermonthtxt .headerlabelbtn');
        expect(monthLabel.nativeElement.textContent).toBe('Oct');

        nextmonth.nativeElement.click();
        fixture.detectChanges();
        monthLabel = getElement('.headermonthtxt .headerlabelbtn');
        expect(monthLabel.nativeElement.textContent).toBe('Nov');

        nextmonth.nativeElement.click();
        fixture.detectChanges();
        monthLabel = getElement('.headermonthtxt .headerlabelbtn');
        expect(monthLabel.nativeElement.textContent).toBe('Déc');

        fixture.detectChanges();
        let headertodaybtn = getElement('.headertodaybtn');
        expect(headertodaybtn).not.toBe(null);
        expect(headertodaybtn.nativeElement.textContent).toBe('Aujourd\'hui');

        fixture.detectChanges();
        let firstDayOfWeek = getElement('.caltable thead tr th:first-child');
        expect(firstDayOfWeek).not.toBe(null);
        expect(firstDayOfWeek.nativeElement.textContent).toBe('Lun');

        fixture.detectChanges();
        let sunday = getElement('.sunday');
        expect(sunday).not.toBe(null);

        comp.userDateInput({target:{value:'10/10/2016'}});
        expect(comp.invalidDate).toBe(false);

        fixture.detectChanges();
        let invaliddate = getElement('.invaliddate');
        expect(invaliddate).toBe(null);
    });

    it('selDate - initially selected date - string', () => {
        let date: string = '2017-10-11';
        comp.selectedDate = comp.parseSelectedDate(date);

        comp.parseOptions();

        fixture.detectChanges();
        let selection = getElement('.selection');
        expect(selection).not.toBe(null);
        expect(selection.nativeElement.value).toContain('2017-10-11');


        fixture.detectChanges();
        let btnpicker = getElement('.btnpicker');
        btnpicker.nativeElement.click();

        fixture.detectChanges();
        let selectedday = getElement('.selectedday div span');
        expect(selectedday).not.toBe(null);
        expect(selectedday.nativeElement.textContent).toContain('11');

        fixture.detectChanges();
        let monthLabel = getElement('.headermonthtxt .headerlabelbtn');
        expect(monthLabel).not.toBe(null);
        expect(monthLabel.nativeElement.textContent).toBe('Oct');

        fixture.detectChanges();
        let yearLabel = getElement('.headeryeartxt .headerlabelbtn');
        expect(yearLabel).not.toBe(null);
        expect(yearLabel.nativeElement.textContent).toBe('2017');
    });

    it('selDate - initially selected date - object', () => {
        let date: Object = {year: 2017, month: 10, day: 11};
        comp.selectedDate = comp.parseSelectedDate(date);

        comp.parseOptions();

        fixture.detectChanges();
        let selection = getElement('.selection');
        expect(selection).not.toBe(null);
        expect(selection.nativeElement.value).toContain('2017-10-11');
        expect(comp.selectionDayTxt).toContain('2017-10-11');

        fixture.detectChanges();
        let btnpicker = getElement('.btnpicker');
        btnpicker.nativeElement.click();

        fixture.detectChanges();
        let selectedday = getElement('.selectedday div span');
        expect(selectedday).not.toBe(null);
        expect(selectedday.nativeElement.textContent).toContain('11');

        fixture.detectChanges();
        let monthLabel = getElement('.headermonthtxt .headerlabelbtn');
        expect(monthLabel).not.toBe(null);
        expect(monthLabel.nativeElement.textContent).toBe('Oct');

        fixture.detectChanges();
        let yearLabel = getElement('.headeryeartxt .headerlabelbtn');
        expect(yearLabel).not.toBe(null);
        expect(yearLabel.nativeElement.textContent).toBe('2017');
    });

    it('defaultMonth - initially selected month', () => {
        comp.selectedMonth = comp.parseSelectedMonth('2019-08');

        fixture.detectChanges();
        let btnpicker = getElement('.btnpicker');
        btnpicker.nativeElement.click();

        fixture.detectChanges();
        let monthLabel = getElement('.headermonthtxt .headerlabelbtn');
        expect(monthLabel).not.toBe(null);
        expect(monthLabel.nativeElement.textContent).toBe('Aug');

        fixture.detectChanges();
        let yearLabel = getElement('.headeryeartxt .headerlabelbtn');
        expect(yearLabel).not.toBe(null);
        expect(yearLabel.nativeElement.textContent).toBe('2019');
    });

});






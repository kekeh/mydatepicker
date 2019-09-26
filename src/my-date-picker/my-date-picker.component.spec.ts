///<reference path="../../node_modules/@types/jasmine/index.d.ts"/>

import {FormsModule} from "@angular/forms";
import {ComponentFixture, TestBed} from '@angular/core/testing';
import {By} from '@angular/platform-browser';
import {DebugElement} from '@angular/core';
import {MyDatePicker} from './my-date-picker.component';
import {FocusDirective} from './directives/my-date-picker.focus.directive';


let comp: MyDatePicker;
let fixture: ComponentFixture<MyDatePicker>;
let de: DebugElement;
let el: HTMLElement;

let PREVMONTH: string = '.header tr td:first-child div .headerbtncell:first-child .headerbtn';
let NEXTMONTH: string = '.header tr td:first-child div .headerbtncell:last-child .headerbtn';
let PREVYEAR: string = '.header tr td:last-child div .headerbtncell:first-child .headerbtn';
let NEXTYEAR: string = '.header tr td:last-child div .headerbtncell:last-child .headerbtn';

function getDateString(date:any):string {
    return ((date.getMonth() + 1) < 10 ? '0' + (date.getMonth() + 1) : (date.getMonth() + 1)) + '/' +
            (date.getDate() < 10 ? '0' + date.getDate() : date.getDate()) + '/' +
            date.getFullYear();
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
            imports: [FormsModule],
            declarations: [MyDatePicker, FocusDirective],
        });

        fixture = TestBed.createComponent(MyDatePicker);

        comp = fixture.componentInstance;

        de = fixture.debugElement.query(By.css('.mydp'));
        el = de.nativeElement;
    });

    it('set valid date', () => {
        comp.localeSelectionDayTxt = '2016-08-22';
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
        let markcurrday = getElement('.markcurrday');
        expect(markcurrday).not.toBe(null);

        markcurrday.nativeElement.click();

        let dateStr = getDateString(date);
        fixture.detectChanges();
        let selection = getElement('.selection');
        expect(selection.nativeElement.value).toContain(dateStr);

        fixture.detectChanges();
        let btnclear = getElement('.btnclear');
        btnclear.nativeElement.click();
        expect(selection.nativeElement.value).toContain('');
    });

    it('select/unselect current day from the selector', () => {
        let date = new Date();
        comp.selectedMonth = {monthTxt: '', monthNbr: date.getMonth() + 1, year: date.getFullYear()};

        comp.options = {allowDeselectDate: true};
        comp.parseOptions();

        fixture.detectChanges();
        let btnpicker = getElement('.btnpicker');
        btnpicker.nativeElement.click();

        fixture.detectChanges();
        let markcurrday = getElement('.markcurrday');
        expect(markcurrday).not.toBe(null);

        markcurrday.nativeElement.click();

        let dateStr = getDateString(date);
        fixture.detectChanges();
        let selection = getElement('.selection');
        expect(selection.nativeElement.value).toContain(dateStr);

        fixture.detectChanges();
        btnpicker = getElement('.btnpicker');
        btnpicker.nativeElement.click();


        fixture.detectChanges();
        let selectedday = getElement('.selectedday');
        expect(selectedday).not.toBe(null);

        fixture.detectChanges();
        markcurrday = getElement('.markcurrday');
        expect(markcurrday).not.toBe(null);
        markcurrday.nativeElement.click();

        fixture.detectChanges();
        selectedday = getElement('.selectedday');
        expect(selectedday).toBe(null);

        fixture.detectChanges();
        selection = getElement('.selection');
        expect(selection.nativeElement.value).toBe('');
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
        let prevmonth = getElement(PREVMONTH);
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

        comp.generateCalendar(1, 2016, true);

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

            comp.onNextMonth();

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

        comp.generateCalendar(12, 2016, true);

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

            comp.onPrevMonth();

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

        comp.onUserDateInput('2016-08-22');
        expect(comp.invalidDate).toBe(true);

        fixture.detectChanges();
        let invaliddate = getElement('.invaliddate');
        expect(invaliddate).not.toBe(null);

        comp.onUserDateInput('2016-08-2');
        expect(comp.invalidDate).toBe(true);

        comp.onUserDateInput('16.09/2016');
        expect(comp.invalidDate).toBe(true);

        comp.onUserDateInput('2016-08-xx');
        expect(comp.invalidDate).toBe(true);

        comp.onUserDateInput('16.09.999');
        expect(comp.invalidDate).toBe(true);

        comp.onUserDateInput('16.09.19999');
        expect(comp.invalidDate).toBe(true);

        comp.onUserDateInput('16.09.2016');
        expect(comp.invalidDate).toBe(false);

        comp.options = {dateFormat: 'dd mmm yyyy', indicateInvalidDate: true};

        comp.parseOptions();

        comp.onUserDateInput('2016-08-22');
        expect(comp.invalidDate).toBe(true);

        comp.onUserDateInput('22 Aug 2016');
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
        let headertodaybtn = getElement('.headertodaybtn span:last-child');
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
        let highlight = getElements('.highlight');
        expect(highlight).not.toBe(null);
        expect(highlight.length).toBe(6);

        btnpicker.nativeElement.click();

        comp.options = {sunHighlight: false};

        comp.parseOptions();

        fixture.detectChanges();
        btnpicker.nativeElement.click();

        comp.parseOptions();

        fixture.detectChanges();
        highlight = getElements('.highlight');
        expect(highlight.length).toBe(0);
    });

    it('options - saturday highlight', () => {
        comp.selectedMonth = {monthTxt: '', monthNbr: 5, year: 2016};
        comp.options = {satHighlight: true, sunHighlight: false};

        comp.parseOptions();

        fixture.detectChanges();
        let btnpicker = getElement('.btnpicker');
        btnpicker.nativeElement.click();

        fixture.detectChanges();
        let highlight = getElements('.highlight');
        expect(highlight).not.toBe(null);
        expect(highlight.length).toBe(6);

        btnpicker.nativeElement.click();

        comp.options = {satHighlight: false, sunHighlight: false};

        comp.parseOptions();

        fixture.detectChanges();
        btnpicker.nativeElement.click();

        comp.parseOptions();

        fixture.detectChanges();
        highlight = getElements('.highlight');
        expect(highlight.length).toBe(0);
    });

    it('options - highlight dates', () => {
        comp.selectedMonth = {monthTxt: '', monthNbr: 1, year: 2016};

        comp.options = {
            sunHighlight: false,
            satHighlight: false,
            highlightDates: [{year: 2016, month: 1, day: 10}, {year: 2016, month: 1, day: 12}, {year: 2016, month: 1, day: 13}]
        };

        comp.parseOptions();

        fixture.detectChanges();
        let btnpicker = getElement('.btnpicker');
        btnpicker.nativeElement.click();

        fixture.detectChanges();
        let highlight = getElements('.highlight');
        expect(highlight).not.toBe(null);
        expect(highlight.length).toBe(3);

        fixture.detectChanges();
        btnpicker = getElement('.btnpicker');
        btnpicker.nativeElement.click();


        comp.options.highlightDates = [];

        comp.parseOptions();

        fixture.detectChanges();
        btnpicker = getElement('.btnpicker');
        btnpicker.nativeElement.click();

        fixture.detectChanges();
        highlight = getElements('.highlight');
        expect(highlight.length).toBe(0);
    });

    it('options - mark current day', () => {
        comp.options = {markCurrentDay: true};

        comp.parseOptions();

        fixture.detectChanges();
        let btnpicker = getElement('.btnpicker');
        btnpicker.nativeElement.click();

        fixture.detectChanges();
        let markcurrday = getElement('.markcurrday');
        expect(markcurrday).not.toBe(null);

        btnpicker.nativeElement.click();

        comp.options = {markCurrentDay: false};

        comp.parseOptions();

        fixture.detectChanges();
        btnpicker.nativeElement.click();

        comp.parseOptions();

        fixture.detectChanges();
        markcurrday = getElement('.markcurrday');
        expect(markcurrday).toBe(null);
    });

    it('options - mark current month', () => {
        comp.options = {markCurrentMonth: true};

        comp.parseOptions();

        fixture.detectChanges();
        let btnpicker = getElement('.btnpicker');
        btnpicker.nativeElement.click();

        fixture.detectChanges();
        let monthlabel = getElement('.monthlabel');
        monthlabel.nativeElement.click();

        fixture.detectChanges();
        let markcurrmonth = getElement('.markcurrmonth');
        expect(markcurrmonth).not.toBe(null);
    });

    it('options - mark current year', () => {
        comp.options = {markCurrentYear: true};

        comp.parseOptions();

        fixture.detectChanges();
        let btnpicker = getElement('.btnpicker');
        btnpicker.nativeElement.click();

        fixture.detectChanges();
        let yearlabel = getElement('.yearlabel');
        yearlabel.nativeElement.click();

        fixture.detectChanges();
        let markcurryear = getElement('.markcurryear');
        expect(markcurryear).not.toBe(null);
    });

    it('options - month selector', () => {
        comp.selectedMonth = {monthTxt: 'May', monthNbr: 5, year: 2016};
        comp.options = {monthSelector: true};

        comp.parseOptions();

        fixture.detectChanges();
        let btnpicker = getElement('.btnpicker');
        btnpicker.nativeElement.click();

        fixture.detectChanges();
        let montlabel = getElement('.headermonthtxt .headerlabelbtn');
        expect(montlabel).not.toBe(null);
        montlabel.nativeElement.click();

        fixture.detectChanges();
        let monthtable = getElement('.monthtable');
        expect(monthtable).not.toBe(null);

        fixture.detectChanges();
        let monthcell = getElements('.monthcell');
        expect(monthcell).not.toBe(null);
        expect(monthcell.length).toBe(12);

        fixture.detectChanges();
        expect(monthcell[0].nativeElement.textContent.trim()).toBe('Jan');

        fixture.detectChanges();
        expect(monthcell[11].nativeElement.textContent.trim()).toBe('Dec');

        fixture.detectChanges();
        let selectedmonth = getElement('.selectedmonth');
        expect(selectedmonth).not.toBe(null);
        expect(selectedmonth.nativeElement.textContent.trim()).toBe('May');
        selectedmonth.nativeElement.click();

        fixture.detectChanges();
        monthtable = getElement('.monthtable');
        expect(monthtable).toBe(null);
    });

    it('options - year selector', () => {
        comp.selectedMonth = {monthTxt: 'May', monthNbr: 5, year: 2016};
        comp.options = {yearSelector: true};

        comp.parseOptions();

        fixture.detectChanges();
        let btnpicker = getElement('.btnpicker');
        btnpicker.nativeElement.click();

        fixture.detectChanges();
        let yearlabel = getElement('.headeryeartxt .headerlabelbtn');
        expect(yearlabel).not.toBe(null);
        yearlabel.nativeElement.click();

        fixture.detectChanges();
        let yeartable = getElement('.yeartable');
        expect(yeartable).not.toBe(null);

        fixture.detectChanges();
        let yearcell = getElements('.yearcell');
        expect(yearcell).not.toBe(null);
        expect(yearcell.length).toBe(25);

        fixture.detectChanges();
        expect(yearcell[0].nativeElement.textContent.trim()).toBe('2016');

        fixture.detectChanges();
        expect(yearcell[24].nativeElement.textContent.trim()).toBe('2040');

        fixture.detectChanges();
        let selectedyear = getElement('.selectedyear');
        expect(selectedyear).not.toBe(null);
        expect(selectedyear.nativeElement.textContent.trim()).toBe('2016');

        selectedyear.nativeElement.click();

        fixture.detectChanges();
        yeartable = getElement('.yeartable');
        expect(yeartable).toBe(null);
    });

    it('options - disable header buttons', () => {
        comp.selectedMonth = {monthTxt: '', monthNbr: 5, year: 2016};
        comp.options = {
            disableHeaderButtons: true,
            disableUntil: {year: 2016, month: 4, day: 10}
        };

        comp.parseOptions();

        fixture.detectChanges();
        let btnpicker = getElement('.btnpicker');
        btnpicker.nativeElement.click();

        fixture.detectChanges();
        let montlabel = getElement('.headermonthtxt .headerlabelbtn');
        expect(montlabel).not.toBe(null);
        expect(montlabel.nativeElement.textContent).toBe('May');

        fixture.detectChanges();
        let prevmonth = getElement(PREVMONTH);
        expect(prevmonth).not.toBe(null);
        prevmonth.nativeElement.click();

        fixture.detectChanges();
        montlabel = getElement('.headermonthtxt .headerlabelbtn');
        expect(montlabel).not.toBe(null);
        expect(montlabel.nativeElement.textContent).toBe('Apr');

        fixture.detectChanges();
        let headerbtndisabled = getElements('.headerbtndisabled');
        expect(headerbtndisabled).not.toBe(null);
        expect(headerbtndisabled.length).toBe(2);

        prevmonth.nativeElement.click();

        fixture.detectChanges();
        montlabel = getElement('.headermonthtxt .headerlabelbtn');
        expect(montlabel).not.toBe(null);
        expect(montlabel.nativeElement.textContent).toBe('Apr');

        fixture.detectChanges();
        let prevyear = getElement(PREVYEAR);
        expect(prevyear).not.toBe(null);
        prevyear.nativeElement.click();

        fixture.detectChanges();
        let yearlabel = getElement('.headeryeartxt .headerlabelbtn');
        expect(yearlabel).not.toBe(null);
        expect(yearlabel.nativeElement.textContent).toBe('2016');

        btnpicker.nativeElement.click();


        comp.options = {
            disableHeaderButtons: true,
            disableSince: {year: 2016, month: 7, day: 10}
        };

        comp.parseOptions();

        fixture.detectChanges();
        btnpicker = getElement('.btnpicker');
        btnpicker.nativeElement.click();

        fixture.detectChanges();
        montlabel = getElement('.headermonthtxt .headerlabelbtn');
        expect(montlabel).not.toBe(null);
        expect(montlabel.nativeElement.textContent).toBe('May');

        fixture.detectChanges();
        let nextmonth = getElement(NEXTMONTH);
        expect(nextmonth).not.toBe(null);
        nextmonth.nativeElement.click();

        fixture.detectChanges();
        montlabel = getElement('.headermonthtxt .headerlabelbtn');
        expect(montlabel).not.toBe(null);
        expect(montlabel.nativeElement.textContent).toBe('Jun');

        fixture.detectChanges();
        headerbtndisabled = getElements('.headerbtndisabled');
        expect(headerbtndisabled).not.toBe(null);
        expect(headerbtndisabled.length).toBe(2);

        prevmonth.nativeElement.click();

        fixture.detectChanges();
        montlabel = getElement('.headermonthtxt .headerlabelbtn');
        expect(montlabel).not.toBe(null);
        expect(montlabel.nativeElement.textContent).toBe('Jun');

        fixture.detectChanges();
        let nextyear = getElement(NEXTYEAR);
        expect(nextyear).not.toBe(null);
        nextyear.nativeElement.click();

        fixture.detectChanges();
        yearlabel = getElement('.headeryeartxt .headerlabelbtn');
        expect(yearlabel).not.toBe(null);
        expect(yearlabel.nativeElement.textContent).toBe('2016');
    });

    it('options - min year', () => {
        comp.selectedMonth = {monthTxt: 'May', monthNbr: 5, year: 2016};
        comp.options = {minYear: 2015};

        comp.parseOptions();

        fixture.detectChanges();
        let btnpicker = getElement('.btnpicker');
        btnpicker.nativeElement.click();

        fixture.detectChanges();
        let prevyear = getElement(PREVYEAR);
        expect(prevyear).not.toBe(null);
        prevyear.nativeElement.click();

        expect(comp.visibleMonth.monthTxt).toBe('May');
        expect(comp.visibleMonth.monthNbr).toBe(5);
        expect(comp.visibleMonth.year).toBe(2015);

        fixture.detectChanges();
        let daycell = getElements('.daycell');
        expect(daycell).not.toBe(null);
        expect(daycell.length).toBe(42);

        fixture.detectChanges();
        expect(daycell[0].nativeElement.textContent.trim()).toBe('27');

        fixture.detectChanges();
        expect(daycell[41].nativeElement.textContent.trim()).toBe('7');


        fixture.detectChanges();
        prevyear = getElement(PREVYEAR);
        expect(prevyear).not.toBe(null);
        prevyear.nativeElement.click();

        expect(comp.visibleMonth.monthTxt).toBe('May');
        expect(comp.visibleMonth.monthNbr).toBe(5);
        expect(comp.visibleMonth.year).toBe(2015);

        fixture.detectChanges();
        daycell = getElements('.daycell');
        expect(daycell).not.toBe(null);
        expect(daycell.length).toBe(42);

        fixture.detectChanges();
        expect(daycell[0].nativeElement.textContent.trim()).toBe('27');

        fixture.detectChanges();
        expect(daycell[41].nativeElement.textContent.trim()).toBe('7');

        fixture.detectChanges();
        let headerbtndisabled = getElement('.headerbtndisabled');
        expect(headerbtndisabled).not.toBe(null);
    });

    it('options - max year', () => {
        comp.selectedMonth = {monthTxt: 'May', monthNbr: 5, year: 2016};
        comp.options = {maxYear: 2017};

        comp.parseOptions();

        fixture.detectChanges();
        let btnpicker = getElement('.btnpicker');
        btnpicker.nativeElement.click();

        fixture.detectChanges();
        let nextyear = getElement(NEXTYEAR);
        expect(nextyear).not.toBe(null);
        nextyear.nativeElement.click();

        expect(comp.visibleMonth.monthTxt).toBe('May');
        expect(comp.visibleMonth.monthNbr).toBe(5);
        expect(comp.visibleMonth.year).toBe(2017);

        fixture.detectChanges();
        let daycell = getElements('.daycell');
        expect(daycell).not.toBe(null);
        expect(daycell.length).toBe(42);

        fixture.detectChanges();
        expect(daycell[0].nativeElement.textContent.trim()).toBe('1');

        fixture.detectChanges();
        expect(daycell[41].nativeElement.textContent.trim()).toBe('11');


        fixture.detectChanges();
        nextyear = getElement(NEXTYEAR);
        expect(nextyear).not.toBe(null);
        nextyear.nativeElement.click();

        expect(comp.visibleMonth.monthTxt).toBe('May');
        expect(comp.visibleMonth.monthNbr).toBe(5);
        expect(comp.visibleMonth.year).toBe(2017);

        fixture.detectChanges();
        daycell = getElements('.daycell');
        expect(daycell).not.toBe(null);
        expect(daycell.length).toBe(42);

        fixture.detectChanges();
        expect(daycell[0].nativeElement.textContent.trim()).toBe('1');

        fixture.detectChanges();
        expect(daycell[41].nativeElement.textContent.trim()).toBe('11');

        fixture.detectChanges();
        let headerbtndisabled = getElement('.headerbtndisabled');
        expect(headerbtndisabled).not.toBe(null);
    });

    it('options - disable until', () => {
        comp.selectedMonth = {monthTxt: '', monthNbr: 10, year: 2016};
        comp.options = {disableUntil: {year: 2016, month: 10, day: 5}};

        comp.parseOptions();

        fixture.detectChanges();
        let btnpicker = getElement('.btnpicker');
        btnpicker.nativeElement.click();

        comp.generateCalendar(10, 2016, true);

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
        expect(selection.nativeElement.value).toContain('10/06/2016');
    });

    it('options - disable since', () => {
        comp.selectedMonth = {monthTxt: '', monthNbr: 10, year: 2016};
        comp.options = {disableSince: {year: 2016, month: 10, day: 30}};

        comp.parseOptions();

        fixture.detectChanges();
        let btnpicker = getElement('.btnpicker');
        btnpicker.nativeElement.click();

        comp.generateCalendar(10, 2016, true);

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
        expect(selection.nativeElement.value).toContain('10/06/2016');
    });

    it('options - disable days one by one', () => {
        comp.selectedMonth = {monthTxt: '', monthNbr: 10, year: 2016};
        comp.options = {disableDays: [{year: 2016, month: 10, day: 5}, {year: 2016, month: 10, day: 10}]};

        comp.parseOptions();

        fixture.detectChanges();
        let btnpicker = getElement('.btnpicker');
        btnpicker.nativeElement.click();

        comp.generateCalendar(10, 2016, true);

        fixture.detectChanges();
        let disabled = getElements('tr .disabled');
        expect(disabled).not.toBe(null);
        expect(disabled.length).toBe(2);

        let firstDisabled = disabled[0];
        expect(firstDisabled.nativeElement.textContent.trim()).toBe('5');

        let lastDisabled = disabled[1];
        expect(lastDisabled.nativeElement.textContent.trim()).toBe('10');
    });

    it('options - enable disabled days one by one', () => {
        comp.selectedMonth = {monthTxt: '', monthNbr: 1, year: 2017};
        comp.options = {
            dateFormat: 'dd.mm.yyyy',
            disableDateRanges: [{begin: {year: 2017, month: 1, day: 1}, end: {year: 2017, month: 1, day: 31}}],
            enableDays: [{year: 2017, month: 1, day: 5}, {year: 2017, month: 1, day: 6}, {year: 2017, month: 1, day: 7}, {year: 2017, month: 1, day: 8}]
        };

        comp.parseOptions();

        fixture.detectChanges();
        let btnpicker = getElement('.btnpicker');
        btnpicker.nativeElement.click();

        comp.generateCalendar(1, 2017, true);

        fixture.detectChanges();
        let disabled = getElements('tr .disabled');
        expect(disabled).not.toBe(null);
        expect(disabled.length).toBe(27);

        let firstDisabled = disabled[0];
        expect(firstDisabled.nativeElement.textContent.trim()).toBe('1');

        let lastDisabled = disabled[disabled.length - 1];
        expect(lastDisabled.nativeElement.textContent.trim()).toBe('31');

        fixture.detectChanges();
        let alldates = getElements('.caltable .daycell');
        expect(alldates).not.toBe(null);
        expect(alldates.length).toBe(42);

        fixture.detectChanges();
        let firstEnabled = alldates[10];
        firstEnabled.nativeElement.click();

        fixture.detectChanges();
        let selection = getElement('.selection');
        expect(selection).not.toBe(null);
        expect(selection.nativeElement.value).toBe('05.01.2017');
    });

    it('options - disable date ranges', () => {
        comp.selectedMonth = {monthTxt: '', monthNbr: 10, year: 2016};
        comp.options = {
            disableDateRanges: [
                {begin: {year: 2016, month: 10, day: 5}, end: {year: 2016, month: 10, day: 7}},
                {begin: {year: 2016, month: 10, day: 9}, end: {year: 2016, month: 10, day: 11}}
                ]
        };

        comp.parseOptions();

        fixture.detectChanges();
        let btnpicker = getElement('.btnpicker');
        btnpicker.nativeElement.click();

        comp.generateCalendar(10, 2016, true);

        fixture.detectChanges();
        let disabled = getElements('.disabled');
        expect(disabled).not.toBe(null);
        expect(disabled.length).toBe(6);


        expect(disabled[0].nativeElement.textContent.trim()).toBe('5');
        expect(disabled[1].nativeElement.textContent.trim()).toBe('6');
        expect(disabled[2].nativeElement.textContent.trim()).toBe('7');

        expect(disabled[3].nativeElement.textContent.trim()).toBe('9');
        expect(disabled[4].nativeElement.textContent.trim()).toBe('10');
        expect(disabled[5].nativeElement.textContent.trim()).toBe('11');
        btnpicker.nativeElement.click();


        comp.options = {disableDateRanges: []};

        comp.parseOptions();

        fixture.detectChanges();
        btnpicker = getElement('.btnpicker');
        btnpicker.nativeElement.click();

        comp.generateCalendar(10, 2016, true);

        fixture.detectChanges();
        disabled = getElements('.disabled');
        expect(disabled).not.toBe(null);
        expect(disabled.length).toBe(0);
    });

    it('options - disable today - today button disabled', () => {
        comp.selectedMonth = {monthTxt: '', monthNbr: 10, year: 2016};

        let date = new Date();
        comp.options = {disableDays: [{year: date.getFullYear(), month: date.getMonth() + 1, day: date.getDate()}]};

        comp.parseOptions();

        fixture.detectChanges();
        let btnpicker = getElement('.btnpicker');
        btnpicker.nativeElement.click();

        comp.generateCalendar(10, 2016, true);

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
        comp.generateCalendar(10, 2016, true);

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

    it('options - mark dates', () => {
        comp.selectedMonth = {monthTxt: '', monthNbr: 1, year: 2017};

        comp.options = {markDates: [{dates: [{year: 2017, month: 1, day: 14}, {year: 2017, month: 1, day: 15}], color: 'red'}]};

        comp.parseOptions();

        fixture.detectChanges();
        let btnpicker = getElement('.btnpicker');
        btnpicker.nativeElement.click();

        fixture.detectChanges();
        let markdate = getElements('.markdate');
        expect(markdate).not.toBe(null);
        expect(markdate.length).toBe(2);

        fixture.detectChanges();
        btnpicker = getElement('.btnpicker');
        btnpicker.nativeElement.click();


        comp.options = {markDates: []};

        comp.parseOptions();

        fixture.detectChanges();
        btnpicker = getElement('.btnpicker');
        btnpicker.nativeElement.click();

        fixture.detectChanges();
        markdate = getElements('.markdate');
        expect(markdate).not.toBe(null);
        expect(markdate.length).toBe(0);
    });

    it('options - mark weekends', () => {
        comp.selectedMonth = {monthTxt: '', monthNbr: 1, year: 2017};

        comp.options = {markWeekends: {marked: true, color: 'red'}};

        comp.parseOptions();

        fixture.detectChanges();
        let btnpicker = getElement('.btnpicker');
        btnpicker.nativeElement.click();

        fixture.detectChanges();
        let markdate = getElements('.markdate');
        expect(markdate).not.toBe(null);
        expect(markdate.length).toBe(12);

        fixture.detectChanges();
        btnpicker = getElement('.btnpicker');
        btnpicker.nativeElement.click();


        comp.options = {markWeekends: {marked: false, color: ''}};

        comp.parseOptions();

        fixture.detectChanges();
        btnpicker = getElement('.btnpicker');
        btnpicker.nativeElement.click();

        fixture.detectChanges();
        markdate = getElements('.markdate');
        expect(markdate).not.toBe(null);
        expect(markdate.length).toBe(0);
    });

    it('options - disable weekends', () => {
        comp.selectedMonth = {monthTxt: '', monthNbr: 10, year: 2016};
        comp.options = {firstDayOfWeek: 'mo', disableWeekends: true};

        comp.parseOptions();

        fixture.detectChanges();
        let btnpicker = getElement('.btnpicker');
        btnpicker.nativeElement.click();

        comp.generateCalendar(10, 2016, true);

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
        expect(selection.nativeElement.value).toContain('10/03/2016');
    });

    it('options - allow deselect date', () => {
        let date = new Date();
        comp.selectedMonth = {monthTxt: '', monthNbr: date.getMonth() + 1, year: date.getFullYear()};

        comp.options = {allowDeselectDate: false};

        comp.parseOptions();

        fixture.detectChanges();
        let btnpicker = getElement('.btnpicker');
        btnpicker.nativeElement.click();

        fixture.detectChanges();
        let markcurrday = getElement('.markcurrday');
        expect(markcurrday).not.toBe(null);

        markcurrday.nativeElement.click();

        fixture.detectChanges();
        btnpicker = getElement('.btnpicker');
        btnpicker.nativeElement.click();

        fixture.detectChanges();
        markcurrday = getElement('.markcurrday');
        expect(markcurrday).not.toBe(null);

        fixture.detectChanges();
        let selector = getElement('.selector');
        expect(selector).not.toBe(null);
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

    it('options - show clear date button', () => {
        let date = new Date();
        comp.selectedMonth = {monthTxt: '', monthNbr: date.getMonth() + 1, year: date.getFullYear()};

        fixture.detectChanges();
        let btnpicker = getElement('.btnpicker');
        btnpicker.nativeElement.click();

        fixture.detectChanges();
        let markcurrday = getElement('.markcurrday');
        expect(markcurrday).not.toBe(null);

        markcurrday.nativeElement.click();

        fixture.detectChanges();
        let btnclear = getElement('.btnclear');
        expect(btnclear).not.toBe(null);

        btnclear.nativeElement.click();

        comp.options = {showClearDateBtn: true};
        comp.parseOptions();

        fixture.detectChanges();
        btnpicker = getElement('.btnpicker');
        btnpicker.nativeElement.click();

        fixture.detectChanges();
        markcurrday = getElement('.markcurrday');
        expect(markcurrday).not.toBe(null);

        markcurrday.nativeElement.click();

        fixture.detectChanges();
        btnclear = getElement('.btnclear');
        expect(btnclear).not.toBe(null);
        btnclear.nativeElement.click();

        btnclear.nativeElement.click();


        comp.options = {showClearDateBtn: false};
        comp.parseOptions();

        fixture.detectChanges();
        btnpicker = getElement('.btnpicker');
        btnpicker.nativeElement.click();

        fixture.detectChanges();
        markcurrday = getElement('.markcurrday');
        expect(markcurrday).not.toBe(null);

        markcurrday.nativeElement.click();

        fixture.detectChanges();
        btnclear = getElement('.btnclear');
        expect(btnclear).toBe(null);
    });

    it('options - show decrease date button', () => {
        let date = new Date();
        comp.selectedMonth = {monthTxt: '', monthNbr: date.getMonth() + 1, year: date.getFullYear()};

        fixture.detectChanges();
        let btnpicker = getElement('.btnpicker');
        btnpicker.nativeElement.click();

        fixture.detectChanges();
        let markcurrday = getElement('.markcurrday');
        expect(markcurrday).not.toBe(null);

        markcurrday.nativeElement.click();

        fixture.detectChanges();
        let btndecrease = getElement('.btndecrease');
        expect(btndecrease).toBe(null);

        comp.options = {showDecreaseDateBtn: true};
        comp.parseOptions();

        fixture.detectChanges();
        btnpicker = getElement('.btnpicker');
        btnpicker.nativeElement.click();

        fixture.detectChanges();
        markcurrday = getElement('.markcurrday');
        expect(markcurrday).not.toBe(null);

        markcurrday.nativeElement.click();

        fixture.detectChanges();
        btndecrease = getElement('.btndecrease');
        expect(btndecrease).not.toBe(null);
        btndecrease.nativeElement.click();

        btndecrease.nativeElement.click();

        fixture.detectChanges();
        let btnclear = getElement('.btnclear');
        btnclear.nativeElement.click();

        comp.options = {showDecreaseDateBtn: false};
        comp.parseOptions();

        fixture.detectChanges();
        btnpicker = getElement('.btnpicker');
        btnpicker.nativeElement.click();

        fixture.detectChanges();
        markcurrday = getElement('.markcurrday');
        expect(markcurrday).not.toBe(null);

        markcurrday.nativeElement.click();

        fixture.detectChanges();
        btndecrease = getElement('.btndecrease');
        expect(btndecrease).toBe(null);
    });

    it('options - show increase date button', () => {
        let date = new Date();
        comp.selectedMonth = {monthTxt: '', monthNbr: date.getMonth() + 1, year: date.getFullYear()};

        fixture.detectChanges();
        let btnpicker = getElement('.btnpicker');
        btnpicker.nativeElement.click();

        fixture.detectChanges();
        let markcurrday = getElement('.markcurrday');
        expect(markcurrday).not.toBe(null);

        markcurrday.nativeElement.click();

        fixture.detectChanges();
        let btnincrease = getElement('.btnincrease');
        expect(btnincrease).toBe(null);

        comp.options = {showIncreaseDateBtn: true};
        comp.parseOptions();

        fixture.detectChanges();
        btnpicker = getElement('.btnpicker');
        btnpicker.nativeElement.click();

        fixture.detectChanges();
        markcurrday = getElement('.markcurrday');
        expect(markcurrday).not.toBe(null);

        markcurrday.nativeElement.click();

        fixture.detectChanges();
        btnincrease = getElement('.btnincrease');
        expect(btnincrease).not.toBe(null);
        btnincrease.nativeElement.click();

        btnincrease.nativeElement.click();

        fixture.detectChanges();
        let btnclear = getElement('.btnclear');
        btnclear.nativeElement.click();


        comp.options = {showIncreaseDateBtn: false};
        comp.parseOptions();

        fixture.detectChanges();
        btnpicker = getElement('.btnpicker');
        btnpicker.nativeElement.click();

        fixture.detectChanges();
        markcurrday = getElement('.markcurrday');
        expect(markcurrday).not.toBe(null);

        markcurrday.nativeElement.click();

        fixture.detectChanges();
        btnincrease = getElement('.btnincrease');
        expect(btnincrease).toBe(null);
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

    it('options - selector height', () => {
        comp.selectedMonth = {monthTxt: '', monthNbr: 10, year: 2016};
        comp.options = {selectorHeight: '200px'};

        comp.parseOptions();

        fixture.detectChanges();
        let btnpicker = getElement('.btnpicker');
        btnpicker.nativeElement.click();

        fixture.detectChanges();
        let selector = getElement('.selector');
        expect(selector).not.toBe(null);
        expect(selector.styles['height']).toBe('200px');
    });

    it('options - selector width', () => {
        comp.selectedMonth = {monthTxt: '', monthNbr: 10, year: 2016};
        comp.options = {selectorWidth: '220px'};

        comp.parseOptions();

        fixture.detectChanges();
        let btnpicker = getElement('.btnpicker');
        btnpicker.nativeElement.click();

        fixture.detectChanges();
        let selector = getElement('.selector');
        expect(selector).not.toBe(null);
        expect(selector.styles['width']).toBe('220px');
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

    it('options - open selector top of input', () => {
        comp.selectedMonth = {monthTxt: '', monthNbr: 10, year: 2016};
        comp.options = {openSelectorTopOfInput: true, height: '30px'};

        comp.parseOptions();

        fixture.detectChanges();
        let btnpicker = getElement('.btnpicker');
        btnpicker.nativeElement.click();

        let value: string = comp.getSelectorTopPosition();
        expect(value).not.toBe(null);
        expect(value).toBe('32px');

        btnpicker.nativeElement.click();


        comp.options = {openSelectorTopOfInput: false};

        comp.parseOptions();

        fixture.detectChanges();
        btnpicker = getElement('.btnpicker');
        btnpicker.nativeElement.click();

        value = comp.getSelectorTopPosition();
        expect(value).toBe(undefined);


        btnpicker.nativeElement.click();

        comp.options = {};

        comp.parseOptions();

        fixture.detectChanges();
        btnpicker = getElement('.btnpicker');
        btnpicker.nativeElement.click();

        value = comp.getSelectorTopPosition();
        expect(value).toBe(undefined);
    });

    it('options - indicate invalid date', () => {
        comp.selectedMonth = {monthTxt: '', monthNbr: 10, year: 2016};
        comp.options = {indicateInvalidDate: true, dateFormat: 'dd.mm.yyyy'};

        comp.parseOptions();

        comp.onUserDateInput('2016-08-22');
        fixture.detectChanges();
        let invaliddate = getElement('.invaliddate');
        expect(invaliddate).not.toBe(null);

        comp.onUserDateInput('2016-08-xx');
        fixture.detectChanges();
        invaliddate = getElement('.invaliddate');
        expect(invaliddate).not.toBe(null);

        comp.onUserDateInput('2016-08-99');
        fixture.detectChanges();
        invaliddate = getElement('.invaliddate');
        expect(invaliddate).not.toBe(null);

        comp.onUserDateInput('10.10.2016');
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

        comp.onUserDateInput('11.12.2015');
        fixture.detectChanges();
        let invaliddate = getElement('.invaliddate');
        expect(invaliddate).not.toBe(null);

        comp.onUserDateInput('11.06.2016');
        fixture.detectChanges();
        invaliddate = getElement('.invaliddate');
        expect(invaliddate).not.toBe(null);

        comp.onUserDateInput('04.11.2016');
        fixture.detectChanges();
        invaliddate = getElement('.invaliddate');
        expect(invaliddate).not.toBe(null);

        comp.onUserDateInput('05.11.2016');
        fixture.detectChanges();
        invaliddate = getElement('.invaliddate');
        expect(invaliddate).toBe(null);

        comp.options = {
            indicateInvalidDate: true,
            dateFormat: 'dd.mm.yyyy',
            disableUntil:{year: 0, month: 0, day: 0}
        };

        comp.parseOptions();

        comp.onUserDateInput('11.12.2015');
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

        comp.onUserDateInput('08.12.2017');
        fixture.detectChanges();
        let invaliddate = getElement('.invaliddate');
        expect(invaliddate).not.toBe(null);

        comp.onUserDateInput('08.12.2016');
        fixture.detectChanges();
        invaliddate = getElement('.invaliddate');
        expect(invaliddate).not.toBe(null);

        comp.onUserDateInput('23.11.2016');
        fixture.detectChanges();
        invaliddate = getElement('.invaliddate');
        expect(invaliddate).not.toBe(null);

        comp.onUserDateInput('21.11.2016');
        fixture.detectChanges();
        invaliddate = getElement('.invaliddate');
        expect(invaliddate).toBe(null);

        comp.options = {
            indicateInvalidDate: true,
            dateFormat: 'dd.mm.yyyy',
            disableSince:{year: 0, month: 0, day: 0}
        };

        comp.parseOptions();

        comp.onUserDateInput('11.12.2015');
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

        comp.onUserDateInput('05.11.2016');
        fixture.detectChanges();
        let invaliddate = getElement('.invaliddate');
        expect(invaliddate).not.toBe(null);

        comp.onUserDateInput('06.11.2016');
        fixture.detectChanges();
        invaliddate = getElement('.invaliddate');
        expect(invaliddate).not.toBe(null);

        comp.onUserDateInput('12.11.2016');
        fixture.detectChanges();
        invaliddate = getElement('.invaliddate');
        expect(invaliddate).not.toBe(null);

        comp.onUserDateInput('13.11.2016');
        fixture.detectChanges();
        invaliddate = getElement('.invaliddate');
        expect(invaliddate).not.toBe(null);

        comp.onUserDateInput('19.11.2016');
        fixture.detectChanges();
        invaliddate = getElement('.invaliddate');
        expect(invaliddate).not.toBe(null);

        comp.onUserDateInput('20.11.2016');
        fixture.detectChanges();
        invaliddate = getElement('.invaliddate');
        expect(invaliddate).not.toBe(null);

        comp.onUserDateInput('26.11.2016');
        fixture.detectChanges();
        invaliddate = getElement('.invaliddate');
        expect(invaliddate).not.toBe(null);

        comp.onUserDateInput('27.11.2016');
        fixture.detectChanges();
        invaliddate = getElement('.invaliddate');
        expect(invaliddate).not.toBe(null);

        comp.onUserDateInput('04.11.2016');
        fixture.detectChanges();
        invaliddate = getElement('.invaliddate');
        expect(invaliddate).toBe(null);
    });

    it('options - disable weekdays', () => {
        comp.selectedMonth = {monthTxt: '', monthNbr: 7, year: 2017};
        comp.options = {
            disableWeekdays: ['tu', 'th'],
            firstDayOfWeek: 'mo'
        };

        comp.parseOptions();

        fixture.detectChanges();
        let btnpicker = getElement('.btnpicker');
        btnpicker.nativeElement.click();

        fixture.detectChanges();
        let disabled = getElements('.disabled');
        expect(disabled.length).toBe(12);

        expect(disabled[0].nativeElement.textContent.trim()).toBe('27');
        expect(disabled[disabled.length - 1].nativeElement.textContent.trim()).toBe('3');

        btnpicker.nativeElement.click();


        comp.options.disableWeekdays = [];

        comp.parseOptions();

        fixture.detectChanges();
        btnpicker = getElement('.btnpicker');
        btnpicker.nativeElement.click();

        fixture.detectChanges();
        disabled = getElements('.disabled');
        expect(disabled.length).toBe(0);
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

        comp.onUserDateInput('01.11.2016');
        fixture.detectChanges();
        let invaliddate = getElement('.invaliddate');
        expect(invaliddate).not.toBe(null);

        comp.onUserDateInput('03.11.2016');
        fixture.detectChanges();
        invaliddate = getElement('.invaliddate');
        expect(invaliddate).not.toBe(null);

        comp.onUserDateInput('05.11.2016');
        fixture.detectChanges();
        invaliddate = getElement('.invaliddate');
        expect(invaliddate).not.toBe(null);

        comp.onUserDateInput('07.11.2016');
        fixture.detectChanges();
        invaliddate = getElement('.invaliddate');
        expect(invaliddate).not.toBe(null);

        comp.onUserDateInput('02.11.2016');
        fixture.detectChanges();
        invaliddate = getElement('.invaliddate');
        expect(invaliddate).toBe(null);
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

    it('options - click input to open selector', () => {

        let selection: DebugElement,
            selector: DebugElement;

        comp.selectedMonth = {monthTxt: '', monthNbr: 10, year: 2016};
        comp.options = {editableDateField: true};
        comp.parseOptions();

        fixture.detectChanges();
        selection = getElement('.selection');

        selection.nativeElement.click();

        fixture.detectChanges();
        selector = getElement('.selector');
        expect(selector).toBe(null);

        comp.options = {editableDateField: false, openSelectorOnInputClick: true};
        comp.parseOptions();

        fixture.detectChanges();
        selection = getElement('.selection');

        selection.nativeElement.click();

        fixture.detectChanges();
        selector = getElement('.selector');
        expect(selector).not.toBe(null);
    });

    it('options - show selector arrow', () => {
        comp.selectedMonth = {monthTxt: '', monthNbr: 10, year: 2016};
        comp.options = {};
        comp.parseOptions();

        fixture.detectChanges();
        let btnpicker = getElement('.btnpicker');
        btnpicker.nativeElement.click();

        fixture.detectChanges();
        let selectorarrow = getElement('.selectorarrow');
        expect(selectorarrow).not.toBe(null);
        btnpicker.nativeElement.click();


        comp.options = {showSelectorArrow: false};
        comp.parseOptions();

        fixture.detectChanges();
        btnpicker = getElement('.btnpicker');
        btnpicker.nativeElement.click();

        fixture.detectChanges();
        selectorarrow = getElement('.selectorarrow');
        expect(selectorarrow).toBe(null);
        btnpicker.nativeElement.click();


        comp.options = {showSelectorArrow: true};
        comp.parseOptions();

        fixture.detectChanges();
        btnpicker = getElement('.btnpicker');
        btnpicker.nativeElement.click();

        fixture.detectChanges();
        selectorarrow = getElement('.selectorarrow');
        expect(selectorarrow).not.toBe(null);
        btnpicker.nativeElement.click();
    });

    it('options - show input field', () => {
        comp.selectedMonth = {monthTxt: '', monthNbr: 10, year: 2016};
        comp.options = {};
        comp.parseOptions();

        fixture.detectChanges();
        let selection = getElement('.selection');
        expect(selection).not.toBe(null);


        comp.options = {showInputField: false};
        comp.parseOptions();

        fixture.detectChanges();
        selection = getElement('.selection');
        expect(selection).toBe(null);


        comp.options = {showInputField: true};
        comp.parseOptions();

        fixture.detectChanges();
        selection = getElement('.selection');
        expect(selection).not.toBe(null);
    });

    it('options - show week numbers', () => {
        comp.selectedMonth = {monthTxt: '', monthNbr: 1, year: 2017};
        comp.options = {showWeekNumbers: false};
        comp.parseOptions();

        fixture.detectChanges();
        let btnpicker = getElement('.btnpicker');
        btnpicker.nativeElement.click();

        fixture.detectChanges();
        let weekdaytitleweeknbr = getElement('.weekdaytitleweeknbr');
        expect(weekdaytitleweeknbr).toBe(null);

        fixture.detectChanges();
        let daycellweeknbr = getElements('.daycellweeknbr');
        expect(daycellweeknbr.length).toBe(0);

        btnpicker.nativeElement.click();


        comp.options = {showWeekNumbers: true};
        comp.parseOptions();

        fixture.detectChanges();
        btnpicker = getElement('.btnpicker');
        btnpicker.nativeElement.click();

        fixture.detectChanges();
        weekdaytitleweeknbr = getElement('.weekdaytitleweeknbr');
        expect(weekdaytitleweeknbr).not.toBe(null);

        fixture.detectChanges();
        daycellweeknbr = getElements('.daycellweeknbr');
        expect(daycellweeknbr.length).toBe(6);

        expect(daycellweeknbr[0].nativeElement.textContent.trim()).toBe('52');
        expect(daycellweeknbr[1].nativeElement.textContent.trim()).toBe('1');
        expect(daycellweeknbr[2].nativeElement.textContent.trim()).toBe('2');
        expect(daycellweeknbr[3].nativeElement.textContent.trim()).toBe('3');
        expect(daycellweeknbr[4].nativeElement.textContent.trim()).toBe('4');
        expect(daycellweeknbr[5].nativeElement.textContent.trim()).toBe('5');

        fixture.detectChanges();
        let prevyear = getElement(PREVYEAR);
        expect(prevyear).not.toBe(null);
        prevyear.nativeElement.click();

        fixture.detectChanges();
        daycellweeknbr = getElements('.daycellweeknbr');
        expect(daycellweeknbr.length).toBe(6);

        expect(daycellweeknbr[0].nativeElement.textContent.trim()).toBe('53');
        expect(daycellweeknbr[1].nativeElement.textContent.trim()).toBe('1');
        expect(daycellweeknbr[2].nativeElement.textContent.trim()).toBe('2');
        expect(daycellweeknbr[3].nativeElement.textContent.trim()).toBe('3');
        expect(daycellweeknbr[4].nativeElement.textContent.trim()).toBe('4');
        expect(daycellweeknbr[5].nativeElement.textContent.trim()).toBe('5');

        prevyear.nativeElement.click();

        fixture.detectChanges();
        daycellweeknbr = getElements('.daycellweeknbr');
        expect(daycellweeknbr.length).toBe(6);

        expect(daycellweeknbr[0].nativeElement.textContent.trim()).toBe('1');
        expect(daycellweeknbr[1].nativeElement.textContent.trim()).toBe('2');
        expect(daycellweeknbr[2].nativeElement.textContent.trim()).toBe('3');
        expect(daycellweeknbr[3].nativeElement.textContent.trim()).toBe('4');
        expect(daycellweeknbr[4].nativeElement.textContent.trim()).toBe('5');
        expect(daycellweeknbr[5].nativeElement.textContent.trim()).toBe('6');
    });

    it('options - aria label texts', () => {
        comp.selectedDate = comp.parseSelectedDate('2017-10-11');
        comp.options = {showDecreaseDateBtn: true, showIncreaseDateBtn: true};
        comp.parseOptions();

        fixture.detectChanges();
        let btnpicker = getElement('.btnpicker');
        expect(btnpicker).not.toBe(null);
        expect(btnpicker.nativeElement.attributes['aria-label'].textContent).toBe('Open Calendar');

        btnpicker.nativeElement.click();

        fixture.detectChanges();
        let selection = getElement('.selection');
        expect(selection).not.toBe(null);
        expect(selection.nativeElement.attributes['aria-label'].textContent).toBe('Date input field');

        fixture.detectChanges();
        let btnclear = getElement('.btnclear');
        expect(btnclear).not.toBe(null);
        expect(btnclear.nativeElement.attributes['aria-label'].textContent).toBe('Clear Date');

        fixture.detectChanges();
        let btndecrease = getElement('.btndecrease');
        expect(btndecrease).not.toBe(null);
        expect(btndecrease.nativeElement.attributes['aria-label'].textContent).toBe('Decrease Date');

        fixture.detectChanges();
        let btnincrease = getElement('.btnincrease');
        expect(btnincrease).not.toBe(null);
        expect(btnincrease.nativeElement.attributes['aria-label'].textContent).toBe('Increase Date');

        fixture.detectChanges();
        let prevmonth = getElement(PREVMONTH);
        expect(prevmonth).not.toBe(null);
        expect(prevmonth.nativeElement.attributes['aria-label'].textContent).toBe('Previous Month');

        fixture.detectChanges();
        let nextmonth = getElement(NEXTMONTH);
        expect(nextmonth).not.toBe(null);
        expect(nextmonth.nativeElement.attributes['aria-label'].textContent).toBe('Next Month');

        fixture.detectChanges();
        let prevyear = getElement(PREVYEAR);
        expect(prevyear).not.toBe(null);
        expect(prevyear.nativeElement.attributes['aria-label'].textContent).toBe('Previous Year');

        fixture.detectChanges();
        let nextyear = getElement(NEXTYEAR);
        expect(nextyear).not.toBe(null);
        expect(nextyear.nativeElement.attributes['aria-label'].textContent).toBe('Next Year');

        btnpicker.nativeElement.click();

        comp.options = {
            ariaLabelInputField: 'text 1',
            ariaLabelClearDate: 'text 2',
            ariaLabelDecreaseDate: 'text 3',
            ariaLabelIncreaseDate: 'text 4',
            ariaLabelOpenCalendar: 'text 5',
            ariaLabelPrevMonth: 'text 6',
            ariaLabelNextMonth: 'text 7',
            ariaLabelPrevYear: 'text 8',
            ariaLabelNextYear: 'text 9'
        };
        comp.parseOptions();

        fixture.detectChanges();
        btnpicker = getElement('.btnpicker');
        expect(btnpicker).not.toBe(null);
        expect(btnpicker.nativeElement.attributes['aria-label'].textContent).toBe(comp.options.ariaLabelOpenCalendar);

        btnpicker.nativeElement.click();

        fixture.detectChanges();
        selection = getElement('.selection');
        expect(selection).not.toBe(null);
        expect(selection.nativeElement.attributes['aria-label'].textContent).toBe(comp.options.ariaLabelInputField);

        fixture.detectChanges();
        btnclear = getElement('.btnclear');
        expect(btnclear).not.toBe(null);
        expect(btnclear.nativeElement.attributes['aria-label'].textContent).toBe(comp.options.ariaLabelClearDate);

        fixture.detectChanges();
        btndecrease = getElement('.btndecrease');
        expect(btndecrease).not.toBe(null);
        expect(btndecrease.nativeElement.attributes['aria-label'].textContent).toBe(comp.options.ariaLabelDecreaseDate);

        fixture.detectChanges();
        btnincrease = getElement('.btnincrease');
        expect(btnincrease).not.toBe(null);
        expect(btnincrease.nativeElement.attributes['aria-label'].textContent).toBe(comp.options.ariaLabelIncreaseDate);

        fixture.detectChanges();
        prevmonth = getElement(PREVMONTH);
        expect(prevmonth).not.toBe(null);
        expect(prevmonth.nativeElement.attributes['aria-label'].textContent).toBe(comp.options.ariaLabelPrevMonth);

        fixture.detectChanges();
        nextmonth = getElement(NEXTMONTH);
        expect(nextmonth).not.toBe(null);
        expect(nextmonth.nativeElement.attributes['aria-label'].textContent).toBe(comp.options.ariaLabelNextMonth);

        fixture.detectChanges();
        prevyear = getElement(PREVYEAR);
        expect(prevyear).not.toBe(null);
        expect(prevyear.nativeElement.attributes['aria-label'].textContent).toBe(comp.options.ariaLabelPrevYear);

        fixture.detectChanges();
        nextyear = getElement(NEXTYEAR);
        expect(nextyear).not.toBe(null);
        expect(nextyear.nativeElement.attributes['aria-label'].textContent).toBe(comp.options.ariaLabelNextYear);
    });

    it('options - allowSelectionOnlyInCurrentMonth', () => {
        comp.selectedMonth = {monthTxt: '', monthNbr: 10, year: 2017};
        comp.options = {allowSelectionOnlyInCurrentMonth: true};

        comp.parseOptions();

        fixture.detectChanges();
        let btnpicker = getElement('.btnpicker');
        btnpicker.nativeElement.click();

        fixture.detectChanges();
        let selection = getElement('.selection');
        let daycell = getElements('.daycell');
        daycell[37].nativeElement.click();

        fixture.detectChanges();
        expect(selection.nativeElement.value).toBe('');
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
        let headertodaybtn = getElement('.headertodaybtn span:last-child');
        expect(headertodaybtn).not.toBe(null);
        expect(headertodaybtn.nativeElement.textContent).toBe('Aujourd\'hui');

        fixture.detectChanges();
        let firstDayOfWeek = getElement('.caltable thead tr th:first-child');
        expect(firstDayOfWeek).not.toBe(null);
        expect(firstDayOfWeek.nativeElement.textContent).toBe('Lun');

        fixture.detectChanges();
        let highlight = getElements('.highlight');
        expect(highlight).not.toBe(null);
        expect(highlight.length).toBe(6);

        comp.onUserDateInput('10/10/2016');
        expect(comp.invalidDate).toBe(false);

        fixture.detectChanges();
        let invaliddate = getElement('.invaliddate');
        expect(invaliddate).toBe(null);
    });
   
    it('selDate - initially selected date - string', () => {
        let date: string = '10/11/2017';
        comp.selectedDate = comp.parseSelectedDate(date);

        comp.parseOptions();

        fixture.detectChanges();
        let selection = getElement('.selection');
        expect(selection).not.toBe(null);
        expect(selection.nativeElement.value).toContain('10/11/2017');


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
        expect(selection.nativeElement.value).toContain('10/11/2017');
        expect(comp.selectionDayTxt).toContain('10/11/2017');

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

    it('disabled - disable component', () => {
        comp.selectedMonth = {monthTxt: '', monthNbr: 10, year: 2016};
        comp.disabled = true;

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


        comp.disabled = false;

        comp.parseOptions();

        fixture.detectChanges();
        btnpicker = getElement('.btnpicker');

        btnpicker.nativeElement.click();
        fixture.detectChanges();

        selector = getElement('.selector');
        expect(selector).not.toBe(null);

        fixture.detectChanges();
        selection = getElement('.selection');

        selection.nativeElement.value = '2016-11-14';

        fixture.detectChanges();
        expect(selection.nativeElement.value).toContain('2016-11-14');
    });

    it('placeholder - placeholder text', () => {
        comp.placeholder = '';

        fixture.detectChanges();
        let selection = getElement('.selection');
        expect(selection).not.toBe(null);
        expect(selection.properties['placeholder']).toBe('');

        comp.placeholder = 'Select date';

        fixture.detectChanges();
        selection = getElement('.selection');
        expect(selection).not.toBe(null);
        expect(selection.properties['placeholder']).toBe(comp.placeholder);
    });

    it('locale - use id locale', () => {
        comp.selectedMonth = {monthTxt: '', monthNbr: 1, year: 2016};
        comp.locale = 'id';

        comp.parseOptions();

        fixture.detectChanges();
        let btnpicker = getElement('.btnpicker');
        btnpicker.nativeElement.click();

        fixture.detectChanges();
        let days = getElements('.caltable thead tr th');
        expect(days.length).toBe(7);
        expect(days[0].nativeElement.textContent).toBe('Min');
        expect(days[1].nativeElement.textContent).toBe('Sen');
        expect(days[2].nativeElement.textContent).toBe('Sel');
        expect(days[3].nativeElement.textContent).toBe('Rab');
        expect(days[4].nativeElement.textContent).toBe('Kam');
        expect(days[5].nativeElement.textContent).toBe('Jum');
        expect(days[6].nativeElement.textContent).toBe('Sab');

        fixture.detectChanges();
        let nextmonth = getElement(NEXTMONTH);
        expect(nextmonth).not.toBe(null);

        fixture.detectChanges();
        let monthLabel = getElement('.headermonthtxt .headerlabelbtn');
        expect(monthLabel.nativeElement.textContent).toBe('Jan');

        nextmonth.nativeElement.click();
        fixture.detectChanges();
        monthLabel = getElement('.headermonthtxt .headerlabelbtn');
        expect(monthLabel.nativeElement.textContent).toBe('Feb');

        nextmonth.nativeElement.click();
        fixture.detectChanges();
        monthLabel = getElement('.headermonthtxt .headerlabelbtn');
        expect(monthLabel.nativeElement.textContent).toBe('Mar');

        nextmonth.nativeElement.click();
        fixture.detectChanges();
        monthLabel = getElement('.headermonthtxt .headerlabelbtn');
        expect(monthLabel.nativeElement.textContent).toBe('Apr');

        nextmonth.nativeElement.click();
        fixture.detectChanges();
        monthLabel = getElement('.headermonthtxt .headerlabelbtn');
        expect(monthLabel.nativeElement.textContent).toBe('Mei');

        nextmonth.nativeElement.click();
        fixture.detectChanges();
        monthLabel = getElement('.headermonthtxt .headerlabelbtn');
        expect(monthLabel.nativeElement.textContent).toBe('Jun');

        nextmonth.nativeElement.click();
        fixture.detectChanges();
        monthLabel = getElement('.headermonthtxt .headerlabelbtn');
        expect(monthLabel.nativeElement.textContent).toBe('Jul');

        nextmonth.nativeElement.click();
        fixture.detectChanges();
        monthLabel = getElement('.headermonthtxt .headerlabelbtn');
        expect(monthLabel.nativeElement.textContent).toBe('Ags');

        nextmonth.nativeElement.click();
        fixture.detectChanges();
        monthLabel = getElement('.headermonthtxt .headerlabelbtn');
        expect(monthLabel.nativeElement.textContent).toBe('Sep');

        nextmonth.nativeElement.click();
        fixture.detectChanges();
        monthLabel = getElement('.headermonthtxt .headerlabelbtn');
        expect(monthLabel.nativeElement.textContent).toBe('Okt');

        nextmonth.nativeElement.click();
        fixture.detectChanges();
        monthLabel = getElement('.headermonthtxt .headerlabelbtn');
        expect(monthLabel.nativeElement.textContent).toBe('Nov');

        nextmonth.nativeElement.click();
        fixture.detectChanges();
        monthLabel = getElement('.headermonthtxt .headerlabelbtn');
        expect(monthLabel.nativeElement.textContent).toBe('Des');

        fixture.detectChanges();
        let headertodaybtn = getElement('.headertodaybtn span:last-child');
        expect(headertodaybtn).not.toBe(null);
        expect(headertodaybtn.nativeElement.textContent).toBe('Hari ini');

        fixture.detectChanges();
        let firstDayOfWeek = getElement('.caltable thead tr th:first-child');
        expect(firstDayOfWeek).not.toBe(null);
        expect(firstDayOfWeek.nativeElement.textContent).toBe('Min');

        fixture.detectChanges();
        let highlight = getElements('.highlight');
        expect(highlight).not.toBe(null);
        expect(highlight.length).toBe(6);

        comp.onUserDateInput('10-10-2016');
        expect(comp.invalidDate).toBe(false);

        fixture.detectChanges();
        let invaliddate = getElement('.invaliddate');
        expect(invaliddate).toBe(null);
    });


    it('"selects" the date if the selected date is not the same as the input date on input changed and the input date is valid', () => {
        spyOn(comp, 'selectDate');
        comp.selectedDate = { day: 31, month: 8, year: 2017 };
        comp.options = { dateFormat: 'dd-mm-yyyy' }
        comp.setOptions();

        comp.onUserDateInput('31-08-2017'); // Already selected input
        expect(comp.selectDate).not.toHaveBeenCalled();

        comp.onUserDateInput('0-10-2017'); // Invalid input
        expect(comp.selectDate).not.toHaveBeenCalled();

        comp.onUserDateInput('01-10-2017'); // Different date
        expect(comp.selectDate).toHaveBeenCalled();
    });
   
    it('locale - use ar locale', () => {
        comp.selectedMonth = {monthTxt: '', monthNbr: 1, year: 2016};
        comp.locale = 'ar';

        comp.parseOptions();

        fixture.detectChanges();
        let btnpicker = getElement('.btnpicker');
        btnpicker.nativeElement.click();

        fixture.detectChanges();
        let days = getElements('.caltable thead tr th');
        expect(days.length).toBe(7);
        expect(days[0].nativeElement.textContent).toBe('الأحد');
        expect(days[1].nativeElement.textContent).toBe('الاثنين');
        expect(days[2].nativeElement.textContent).toBe('الثلاثاء');
        expect(days[3].nativeElement.textContent).toBe('الاربعاء');
        expect(days[4].nativeElement.textContent).toBe('الخميس');
        expect(days[5].nativeElement.textContent).toBe('الجمعة');
        expect(days[6].nativeElement.textContent).toBe('السبت');

        fixture.detectChanges();
        let nextmonth = getElement(NEXTMONTH);
        expect(nextmonth).not.toBe(null);

        fixture.detectChanges();
        let monthLabel = getElement('.headermonthtxt .headerlabelbtn');
        expect(monthLabel.nativeElement.textContent).toBe('يناير');

        nextmonth.nativeElement.click();
        fixture.detectChanges();
        monthLabel = getElement('.headermonthtxt .headerlabelbtn');
        expect(monthLabel.nativeElement.textContent).toBe('فبراير');

        nextmonth.nativeElement.click();
        fixture.detectChanges();
        monthLabel = getElement('.headermonthtxt .headerlabelbtn');
        expect(monthLabel.nativeElement.textContent).toBe('مارس');

        nextmonth.nativeElement.click();
        fixture.detectChanges();
        monthLabel = getElement('.headermonthtxt .headerlabelbtn');
        expect(monthLabel.nativeElement.textContent).toBe('ابريل');

        nextmonth.nativeElement.click();
        fixture.detectChanges();
        monthLabel = getElement('.headermonthtxt .headerlabelbtn');
        expect(monthLabel.nativeElement.textContent).toBe('مايو');

        nextmonth.nativeElement.click();
        fixture.detectChanges();
        monthLabel = getElement('.headermonthtxt .headerlabelbtn');
        expect(monthLabel.nativeElement.textContent).toBe('يونيو');

        nextmonth.nativeElement.click();
        fixture.detectChanges();
        monthLabel = getElement('.headermonthtxt .headerlabelbtn');
        expect(monthLabel.nativeElement.textContent).toBe('يوليو');

        nextmonth.nativeElement.click();
        fixture.detectChanges();
        monthLabel = getElement('.headermonthtxt .headerlabelbtn');
        expect(monthLabel.nativeElement.textContent).toBe('أغسطس');

        nextmonth.nativeElement.click();
        fixture.detectChanges();
        monthLabel = getElement('.headermonthtxt .headerlabelbtn');
        expect(monthLabel.nativeElement.textContent).toBe('سبتمبر');

        nextmonth.nativeElement.click();
        fixture.detectChanges();
        monthLabel = getElement('.headermonthtxt .headerlabelbtn');
        expect(monthLabel.nativeElement.textContent).toBe('أكتوبر');

        nextmonth.nativeElement.click();
        fixture.detectChanges();
        monthLabel = getElement('.headermonthtxt .headerlabelbtn');
        expect(monthLabel.nativeElement.textContent).toBe('نوفمبر');

        nextmonth.nativeElement.click();
        fixture.detectChanges();
        monthLabel = getElement('.headermonthtxt .headerlabelbtn');
        expect(monthLabel.nativeElement.textContent).toBe('ديسمبر');

        fixture.detectChanges();
        let headertodaybtn = getElement('.headertodaybtn span:last-child');
        expect(headertodaybtn).not.toBe(null);
        expect(headertodaybtn.nativeElement.textContent).toBe('اليوم');

        fixture.detectChanges();
        let firstDayOfWeek = getElement('.caltable thead tr th:first-child');
        expect(firstDayOfWeek).not.toBe(null);
        expect(firstDayOfWeek.nativeElement.textContent).toBe('السبت');

        fixture.detectChanges();
        let highlight = getElements('.highlight');
        expect(highlight).not.toBe(null);
        expect(highlight.length).toBe(6);

        comp.onUserDateInput('10-10-2016');
        expect(comp.invalidDate).toBe(false);

        fixture.detectChanges();
        let invaliddate = getElement('.invaliddate');
        expect(invaliddate).toBe(null);
    });

});

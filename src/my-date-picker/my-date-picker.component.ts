import { Component, Input, Output, EventEmitter, OnChanges, SimpleChanges, ElementRef, ViewEncapsulation, ChangeDetectorRef, Renderer, forwardRef } from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';
import { IMyDate, IMyDateRange, IMyMonth, IMyCalendarDay, IMyWeek, IMyDayLabels, IMyMonthLabels, IMyOptions, IMyDateModel, IMyInputAutoFill, IMyInputFieldChanged, IMyCalendarViewChanged, IMyInputFocusBlur } from './interfaces/index';
import { LocaleService } from './services/my-date-picker.locale.service';
import { UtilService } from './services/my-date-picker.util.service';

// webpack1_
declare var require: any;
const myDpStyles: string = require('./my-date-picker.component.css');
const myDpTpl: string = require('./my-date-picker.component.html');
// webpack2_

export const MYDP_VALUE_ACCESSOR: any = {
    provide: NG_VALUE_ACCESSOR,
    useExisting: forwardRef(() => MyDatePicker),
    multi: true
};

enum CalToggle {
    Open = 1,
    CloseByDateSel = 2,
    CloseByCalBtn = 3,
    CloseByOutClick = 4
}

enum Year {
    min = 1000,
    max = 9999
}

enum InputFocusBlur {
    focus = 1,
    blur = 2
}

enum KeyCode {
    enter = 13,
    space = 32,
    leftArrow = 37,
    rigthArrow = 39
}

enum MonthId {
    prev = 1,
    curr = 2,
    next = 3
}

@Component({
    // tslint:disable-next-line:component-selector
    selector: 'my-date-picker',
    exportAs: 'mydatepicker',
    styles: [myDpStyles],
    template: myDpTpl,
    providers: [LocaleService, UtilService, MYDP_VALUE_ACCESSOR],
    encapsulation: ViewEncapsulation.None
})

// tslint:disable-next-line:component-class-suffix
export class MyDatePicker implements OnChanges, ControlValueAccessor {
    @Input() options: any;
    @Input() locale: string;
    @Input() defaultMonth: string;
    @Input() selDate: string;
    @Input() placeholder: string;
    @Input() selector: number;
    @Output() dateChanged: EventEmitter<IMyDateModel> = new EventEmitter<IMyDateModel>();
    @Output() inputFieldChanged: EventEmitter<IMyInputFieldChanged> = new EventEmitter<IMyInputFieldChanged>();
    @Output() calendarViewChanged: EventEmitter<IMyCalendarViewChanged> = new EventEmitter<IMyCalendarViewChanged>();
    @Output() calendarToggle: EventEmitter<number> = new EventEmitter<number>();
    @Output() inputFocusBlur: EventEmitter<IMyInputFocusBlur> = new EventEmitter<IMyInputFocusBlur>();



    showSelector: boolean = false;
    visibleMonth: IMyMonth = { monthTxt: '', monthNbr: 0, year: 0 };
    selectedMonth: IMyMonth = { monthTxt: '', monthNbr: 0, year: 0 };
    selectedDate: IMyDate = { year: 0, month: 0, day: 0 };
    weekDays: Array<string> = [];
    dates: Array<IMyWeek> = [];
    selectionDayTxt: string = '';
    invalidDate: boolean = false;
    disableTodayBtn: boolean = false;
    dayIdx: number = 0;
    weekDayOpts: Array<string> = ['su', 'mo', 'tu', 'we', 'th', 'fr', 'sa'];
    autoFillOpts: IMyInputAutoFill = { separator: '', formatParts: [], enabled: true };

    editMonth: boolean = false;
    invalidMonth: boolean = false;
    editYear: boolean = false;
    invalidYear: boolean = false;

    prevMonthDisabled: boolean = false;
    nextMonthDisabled: boolean = false;
    prevYearDisabled: boolean = false;
    nextYearDisabled: boolean = false;

    prevMonthId: number = MonthId.prev;
    currMonthId: number = MonthId.curr;
    nextMonthId: number = MonthId.next;

    // Default options
    opts: IMyOptions = {
        dayLabels: <IMyDayLabels>{},
        monthLabels: <IMyMonthLabels>{},
        dateFormat: <string>'',
        showTodayBtn: <boolean>true,
        todayBtnTxt: <string>'',
        firstDayOfWeek: <string>'',
        sunHighlight: <boolean>true,
        markCurrentDay: <boolean>true,
        disableUntil: <IMyDate>{ year: 0, month: 0, day: 0 },
        disableSince: <IMyDate>{ year: 0, month: 0, day: 0 },
        disableDays: <Array<IMyDate>>[],
        enableDays: <Array<IMyDate>>[],
        disableDateRanges: <Array<IMyDateRange>>[],
        disableWeekends: <boolean>false,
        showWeekNumbers: <boolean>false,
        height: <string>'34px',
        width: <string>'100%',
        selectionTxtFontSize: <string>'18px',
        inline: <boolean>false,
        showClearDateBtn: <boolean>true,
        alignSelectorRight: <boolean>false,
        openSelectorTopOfInput: <boolean>false,
        indicateInvalidDate: <boolean>true,
        editableDateField: <boolean>true,
        editableMonthAndYear: <boolean>true,
        disableHeaderButtons: <boolean>true,
        minYear: <number>Year.min,
        maxYear: <number>Year.max,
        componentDisabled: <boolean>false,
        inputValueRequired: <boolean>false,
        showSelectorArrow: <boolean>true,
        showInputField: <boolean>true,
        openSelectorOnInputClick: <boolean>false,
        inputAutoFill: <boolean>true,
        ariaLabelInputField: <string>'Date input field',
        ariaLabelClearDate: <string>'Clear Date',
        ariaLabelOpenCalendar: <string>'Open Calendar',
        ariaLabelPrevMonth: <string>'Previous Month',
        ariaLabelNextMonth: <string>'Next Month',
        ariaLabelPrevYear: <string>'Previous Year',
        ariaLabelNextYear: <string>'Next Year',
        onlyNumbers: <boolean>false
    };

    onChangeCb: (_: any) => void = () => { };
    onTouchedCb: () => void = () => { };

    constructor(
        public elem: ElementRef,
        private renderer: Renderer,
        private cdr: ChangeDetectorRef,
        private localeService: LocaleService,
        private utilService: UtilService) {
        this.setLocaleOptions();
        renderer.listenGlobal('document', 'click', (event: any) => {
            if (this.showSelector && event.target &&
                this.elem.nativeElement !== event.target &&
                !this.elem.nativeElement.contains(event.target)) {
                this.showSelector = false;
                this.calendarToggle.emit(CalToggle.CloseByOutClick);
            }
            if (this.opts.editableMonthAndYear && event.target && this.elem.nativeElement.contains(event.target)) {
                this.resetMonthYearEdit();
            }
        });
    }

    setLocaleOptions(): void {
        const opts: IMyOptions = this.localeService.getLocaleOptions(this.locale);
        Object.keys(opts).forEach((k) => {
            (<IMyOptions>this.opts)[k] = opts[k];
        });
    }

    setOptions(): void {
        if (this.options !== undefined) {
            Object.keys(this.options).forEach((k) => {
                (<IMyOptions>this.opts)[k] = this.options[k];
            });
        }
        if (this.opts.minYear < Year.min) {
            this.opts.minYear = Year.min;
        }
        if (this.opts.maxYear > Year.max) {
            this.opts.maxYear = Year.max;
        }

        const separator: string = this.utilService.getDateFormatSeparator(this.opts.dateFormat);
        this.autoFillOpts = { separator: separator, formatParts: this.opts.dateFormat.split(separator), enabled: this.opts.inputAutoFill };
    }

    getComponentWidth(): string {
        if (this.opts.showInputField) {
            return this.opts.width;
        } else if (this.selectionDayTxt.length > 0 && this.opts.showClearDateBtn) {
            return '60px';
        } else {
            return '30px';
        }
    }

    getSelectorTopPosition(): string {
        if (this.opts.openSelectorTopOfInput) {
            return this.elem.nativeElement.children[0].offsetHeight + 'px';
        }
    }

    resetMonthYearEdit(): void {
        this.editMonth = false;
        this.editYear = false;
        this.invalidMonth = false;
        this.invalidYear = false;
    }

    editMonthClicked(event: any): void {
        event.stopPropagation();
        if (this.opts.editableMonthAndYear) {
            this.editMonth = true;
        }
    }

    editYearClicked(event: any): void {
        event.stopPropagation();
        if (this.opts.editableMonthAndYear) {
            this.editYear = true;
        }
    }

    userDateInput(event: any): void {
        this.invalidDate = false;
        if (event.target.value.length === 0) {
            this.clearDate();
        }
        else {
            const date: IMyDate = this.utilService.isDateValid(
                event.target.value,
                this.opts.dateFormat,
                this.opts.minYear,
                this.opts.maxYear,
                this.opts.disableUntil,
                this.opts.disableSince,
                this.opts.disableWeekends,
                this.opts.disableDays,
                this.opts.disableDateRanges,
                this.opts.monthLabels,
                this.opts.enableDays);
            if (date.day !== 0 && date.month !== 0 && date.year !== 0) {
                this.selectDate(date);
            }
            else {
                this.invalidDate = true;
            }
        }
        if (this.invalidDate) {
            this.inputFieldChanged.emit({
                value: event.target.value,
                dateFormat: this.opts.dateFormat,
                valid: !(event.target.value.length === 0 || this.invalidDate)
            });
            this.onChangeCb('');
            this.onTouchedCb();
        }
    }

    onFocusInput(event: any): void {
        this.inputFocusBlur.emit({ reason: InputFocusBlur.focus, value: event.target.value });
    }

    onBlurInput(event: any): void {
        this.selectionDayTxt = event.target.value;
        this.onTouchedCb();
        this.inputFocusBlur.emit({ reason: InputFocusBlur.blur, value: event.target.value });
    }

    userMonthInput(event: any): void {
        if (this.preventUserInput(event)) {
            return;
        }

        this.invalidMonth = false;

        const m: number = this.utilService.isMonthLabelValid(event.target.value, this.opts.monthLabels);
        if (m !== -1) {
            this.editMonth = false;
            if (m !== this.visibleMonth.monthNbr) {
                this.visibleMonth = { monthTxt: this.monthText(m), monthNbr: m, year: this.visibleMonth.year };
                this.generateCalendar(m, this.visibleMonth.year, true);
            }
        } else {
            this.invalidMonth = true;
        }
    }

    userYearInput(event: any): void {
        if (this.preventUserInput(event)) {
            return;
        }

        this.invalidYear = false;

        const y: number = this.utilService.isYearLabelValid(Number(event.target.value), this.opts.minYear, this.opts.maxYear);
        if (y !== -1) {
            this.editYear = false;
            if (y !== this.visibleMonth.year) {
                this.visibleMonth = { monthTxt: this.visibleMonth.monthTxt, monthNbr: this.visibleMonth.monthNbr, year: y };
                this.generateCalendar(this.visibleMonth.monthNbr, y, true);
            }
        } else {
            this.invalidYear = true;
        }
    }

    preventUserInput(event: any): boolean {
        return event.keyCode === KeyCode.enter || event.keyCode === KeyCode.leftArrow || event.keyCode === KeyCode.rigthArrow;
    }

    isTodayDisabled(): void {
        this.disableTodayBtn = this.utilService.isDisabledDay(
            this.getToday(),
            this.opts.disableUntil,
            this.opts.disableSince,
            this.opts.disableWeekends,
            this.opts.disableDays,
            this.opts.disableDateRanges,
            this.opts.enableDays);
    }

    parseOptions(): void {
        if (this.locale) {
            this.setLocaleOptions();
        }
        this.setOptions();
        this.isTodayDisabled();
        this.dayIdx = this.weekDayOpts.indexOf(this.opts.firstDayOfWeek);
        if (this.dayIdx !== -1) {
            let idx: number = this.dayIdx;
            for (let i = 0; i < this.weekDayOpts.length; i++) {
                this.weekDays.push(this.opts.dayLabels[this.weekDayOpts[idx]]);
                idx = this.weekDayOpts[idx] === 'sa' ? 0 : idx + 1;
            }
        }
    }

    writeValue(value: Object): void {
        if (value && value['date']) {
            this.updateDateValue(this.parseSelectedDate(value['date']), false);
        } else if (value === '') {
            this.updateDateValue({ year: 0, month: 0, day: 0 }, true);
        }
    }

    registerOnChange(fn: any): void {
        this.onChangeCb = fn;
    }

    registerOnTouched(fn: any): void {
        this.onTouchedCb = fn;
    }

    ngOnChanges(changes: SimpleChanges): void {
        if (changes.hasOwnProperty('selector') && changes['selector'].currentValue > 0) {
            this.openBtnClicked();
        }

        if (changes.hasOwnProperty('placeholder')) {
            this.placeholder = changes['placeholder'].currentValue;
        }

        if (changes.hasOwnProperty('locale')) {
            this.locale = changes['locale'].currentValue;
        }

        if (changes.hasOwnProperty('options')) {
            this.options = changes['options'].currentValue;
        }

        this.weekDays.length = 0;
        this.parseOptions();

        if (changes.hasOwnProperty('defaultMonth')) {
            const dm: string = changes['defaultMonth'].currentValue;
            if (dm !== null && dm !== undefined && dm !== '') {
                this.selectedMonth = this.parseSelectedMonth(dm);
            }
            else {
                this.selectedMonth = { monthTxt: '', monthNbr: 0, year: 0 };
            }
        }

        if (changes.hasOwnProperty('selDate')) {
            const sd: any = changes['selDate'];
            if (sd.currentValue !== null &&
                sd.currentValue !== undefined &&
                sd.currentValue !== '' &&
                Object.keys(sd.currentValue).length !== 0) {
                this.selectedDate = this.parseSelectedDate(sd.currentValue);
                setTimeout(() => {
                    this.onChangeCb(this.getDateModel(this.selectedDate));
                });
            } else {
                // Do not clear on init
                if (!sd.isFirstChange()) {
                    this.clearDate();
                }
            }
        }
        if (this.opts.inline) {
            this.setVisibleMonth();
        } else if (this.showSelector) {
            this.generateCalendar(this.visibleMonth.monthNbr, this.visibleMonth.year, false);
        }
    }

    removeBtnClicked(): void {
        // Remove date button clicked
        this.clearDate();
        if (this.showSelector) {
            this.calendarToggle.emit(CalToggle.CloseByCalBtn);
        }
        this.showSelector = false;
    }

    openBtnClicked(): void {
        // Open selector button clicked
        this.showSelector = !this.showSelector;
        if (this.showSelector) {
            this.setVisibleMonth();
            this.calendarToggle.emit(CalToggle.Open);
        } else {
            this.calendarToggle.emit(CalToggle.CloseByCalBtn);
        }
    }

    setVisibleMonth(): void {
        // Sets visible month of calendar
        let y: number = 0, m: number = 0;
        if (!this.utilService.isInitializedDate(this.selectedDate)) {
            if (this.selectedMonth.year === 0 && this.selectedMonth.monthNbr === 0) {
                const today: IMyDate = this.getToday();
                y = today.year;
                m = today.month;
            } else {
                y = this.selectedMonth.year;
                m = this.selectedMonth.monthNbr;
            }
        } else {
            y = this.selectedDate.year;
            m = this.selectedDate.month;
        }
        this.visibleMonth = { monthTxt: this.opts.monthLabels[m], monthNbr: m, year: y };

        // Create current month
        this.generateCalendar(m, y, true);
    }

    prevMonth(): void {
        // Previous month from calendar
        const d: Date = this.getDate(this.visibleMonth.year, this.visibleMonth.monthNbr, 1);
        d.setMonth(d.getMonth() - 1);

        const y: number = d.getFullYear();
        const m: number = d.getMonth() + 1;

        this.visibleMonth = { monthTxt: this.monthText(m), monthNbr: m, year: y };
        this.generateCalendar(m, y, true);
    }

    nextMonth(): void {
        // Next month from calendar
        const d: Date = this.getDate(this.visibleMonth.year, this.visibleMonth.monthNbr, 1);
        d.setMonth(d.getMonth() + 1);

        const y: number = d.getFullYear();
        const m: number = d.getMonth() + 1;

        this.visibleMonth = { monthTxt: this.monthText(m), monthNbr: m, year: y };
        this.generateCalendar(m, y, true);
    }

    prevYear(): void {
        // Previous year from calendar
        this.visibleMonth.year--;
        this.generateCalendar(this.visibleMonth.monthNbr, this.visibleMonth.year, true);
    }

    nextYear(): void {
        // Next year from calendar
        this.visibleMonth.year++;
        this.generateCalendar(this.visibleMonth.monthNbr, this.visibleMonth.year, true);
    }

    todayClicked(): void {
        // Today button clicked
        const today: IMyDate = this.getToday();
        this.selectDate(today);
        if (this.opts.inline && today.year !== this.visibleMonth.year || today.month !== this.visibleMonth.monthNbr) {
            this.visibleMonth = { monthTxt: this.opts.monthLabels[today.month], monthNbr: today.month, year: today.year };
            this.generateCalendar(today.month, today.year, true);
        }
    }

    cellClicked(cell: any): void {
        // Cell clicked on the calendar
        if (cell.cmo === this.prevMonthId) {
            // Previous month day
            this.prevMonth();
        } else if (cell.cmo === this.currMonthId) {
            // Current month day - if date is already selected clear it
            if (cell.dateObj.year === this.selectedDate.year &&
                cell.dateObj.month === this.selectedDate.month &&
                cell.dateObj.day === this.selectedDate.day) {
                this.clearDate();
            } else {
                this.selectDate(cell.dateObj);
            }
        } else if (cell.cmo === this.nextMonthId) {
            // Next month day
            this.nextMonth();
        }
        this.resetMonthYearEdit();
    }

    cellKeyDown(event: any, cell: any) {
        // Cell keyboard handling
        if ((event.keyCode === KeyCode.enter || event.keyCode === KeyCode.space) && !cell.disabled) {
            event.preventDefault();
            this.cellClicked(cell);
        }
    }

    clearDate(): void {
        // Clears the date and notifies parent using callbacks and value accessor
        const date: IMyDate = { year: 0, month: 0, day: 0 };
        this.dateChanged.emit({ date: date, jsdate: null, formatted: '', epoc: 0 });
        this.onChangeCb('');
        this.onTouchedCb();
        this.updateDateValue(date, true);
    }

    selectDate(date: IMyDate): void {
        // Date selected, notifies parent using callbacks and value accessor
        const dateModel: IMyDateModel = this.getDateModel(date);
        this.dateChanged.emit(dateModel);
        this.onChangeCb(dateModel);
        this.onTouchedCb();
        this.updateDateValue(date, false);
        if (this.showSelector) {
            this.calendarToggle.emit(CalToggle.CloseByDateSel);
        }
        this.showSelector = false;
    }

    updateDateValue(date: IMyDate, clear: boolean): void {
        // Updates date values
        this.selectedDate = date;
        this.selectionDayTxt = clear ? '' : this.formatDate(date);
        this.inputFieldChanged.emit({ value: this.selectionDayTxt, dateFormat: this.opts.dateFormat, valid: !clear });
        this.invalidDate = false;
    }

    getDateModel(date: IMyDate): IMyDateModel {
        // Creates a date model object from the given parameter
        return {
            date: date,
            jsdate: this.getDate(date.year, date.month, date.day),
            formatted: this.formatDate(date),
            epoc: Math.round(this.getTimeInMilliseconds(date) / 1000.0)
        };
    }

    preZero(val: string): string {
        // Prepend zero if smaller than 10
        // tslint:disable-next-line:radix
        return parseInt(val) < 10 ? '0' + val : val;
    }

    formatDate(val: any): string {
        // Returns formatted date string, if mmm is part of dateFormat returns month as a string
        const formatted: string = this.opts.dateFormat.replace('yyyy', val.year).replace('dd', this.preZero(val.day));
        return this.opts.dateFormat.indexOf('mmm') !== -1 ?
            formatted.replace('mmm', this.monthText(val.month)) : formatted.replace('mm', this.preZero(val.month));
    }

    monthText(m: number): string {
        // Returns month as a text
        return this.opts.monthLabels[m];
    }

    monthStartIdx(y: number, m: number): number {
        // Month start index
        const d = new Date();
        d.setDate(1);
        d.setMonth(m - 1);
        d.setFullYear(y);
        const idx = d.getDay() + this.sundayIdx();
        return idx >= 7 ? idx - 7 : idx;
    }

    daysInMonth(m: number, y: number): number {
        // Return number of days of current month
        return new Date(y, m, 0).getDate();
    }

    daysInPrevMonth(m: number, y: number): number {
        // Return number of days of the previous month
        const d: Date = this.getDate(y, m, 1);
        d.setMonth(d.getMonth() - 1);
        return this.daysInMonth(d.getMonth() + 1, d.getFullYear());
    }

    isCurrDay(d: number, m: number, y: number, cmo: number, today: IMyDate): boolean {
        // Check is a given date the today
        return d === today.day && m === today.month && y === today.year && cmo === this.currMonthId;
    }

    getToday(): IMyDate {
        const date: Date = new Date();
        return { year: date.getFullYear(), month: date.getMonth() + 1, day: date.getDate() };
    }

    getTimeInMilliseconds(date: IMyDate): number {
        return this.getDate(date.year, date.month, date.day).getTime();
    }

    getDayNumber(date: IMyDate): number {
        // Get day number: su=0, mo=1, tu=2, we=3 ...
        const d: Date = this.getDate(date.year, date.month, date.day);
        return d.getDay();
    }

    getWeekday(date: IMyDate): string {
        // Get weekday: su, mo, tu, we ...
        return this.weekDayOpts[this.getDayNumber(date)];
    }

    getDate(year: number, month: number, day: number): Date {
        // Creates a date object from given year, month and day
        return new Date(year, month - 1, day, 0, 0, 0, 0);
    }

    sundayIdx(): number {
        // Index of Sunday day
        return this.dayIdx > 0 ? 7 - this.dayIdx : 0;
    }

    generateCalendar(m: number, y: number, notifyChange: boolean): void {
        this.dates.length = 0;
        const today: IMyDate = this.getToday();
        const monthStart: number = this.monthStartIdx(y, m);
        const dInThisM: number = this.daysInMonth(m, y);
        const dInPrevM: number = this.daysInPrevMonth(m, y);

        let dayNbr: number = 1;
        let cmo: number = this.prevMonthId;
        for (let i = 1; i < 7; i++) {
            const week: Array<IMyCalendarDay> = [];
            if (i === 1) {
                // First week
                const pm = dInPrevM - monthStart + 1;
                // Previous month
                for (let j = pm; j <= dInPrevM; j++) {
                    const date: IMyDate = { year: y, month: m - 1, day: j };
                    week.push({
                        dateObj: date,
                        cmo: cmo,
                        currDay: this.isCurrDay(j, m, y, cmo, today),
                        dayNbr: this.getDayNumber(date),
                        disabled: this.utilService.isDisabledDay(
                            date,
                            this.opts.disableUntil,
                            this.opts.disableSince,
                            this.opts.disableWeekends,
                            this.opts.disableDays,
                            this.opts.disableDateRanges,
                            this.opts.enableDays)
                    });
                }

                cmo = this.currMonthId;
                // Current month
                const daysLeft: number = 7 - week.length;
                for (let j = 0; j < daysLeft; j++) {
                    const date: IMyDate = { year: y, month: m, day: dayNbr };
                    week.push({
                        dateObj: date,
                        cmo: cmo,
                        currDay: this.isCurrDay(dayNbr, m, y, cmo, today),
                        dayNbr: this.getDayNumber(date),
                        disabled: this.utilService.isDisabledDay(
                            date,
                            this.opts.disableUntil,
                            this.opts.disableSince,
                            this.opts.disableWeekends,
                            this.opts.disableDays,
                            this.opts.disableDateRanges,
                            this.opts.enableDays)
                    });
                    dayNbr++;
                }
            }
            else {
                // Rest of the weeks
                for (let j = 1; j < 8; j++) {
                    if (dayNbr > dInThisM) {
                        // Next month
                        dayNbr = 1;
                        cmo = this.nextMonthId;
                    }
                    const date: IMyDate = { year: y, month: cmo === this.currMonthId ? m : m + 1, day: dayNbr };
                    week.push({
                        dateObj: date,
                        cmo: cmo,
                        currDay: this.isCurrDay(dayNbr, m, y, cmo, today),
                        dayNbr: this.getDayNumber(date),
                        disabled: this.utilService.isDisabledDay(
                            date, this.opts.disableUntil,
                            this.opts.disableSince,
                            this.opts.disableWeekends,
                            this.opts.disableDays,
                            this.opts.disableDateRanges,
                            this.opts.enableDays)
                    });
                    dayNbr++;
                }
            }
            const weekNbr: number = this.opts.showWeekNumbers && this.opts.firstDayOfWeek === 'mo' ?
                this.utilService.getWeekNumber(week[0].dateObj) : 0;
            this.dates.push({ week: week, weekNbr: weekNbr });
        }

        this.setHeaderBtnDisabledState(m, y);

        if (notifyChange) {
            // Notify parent
            this.calendarViewChanged.emit({
                year: y,
                month: m,
                first: { number: 1, weekday: this.getWeekday({ year: y, month: m, day: 1 }) },
                last: { number: dInThisM, weekday: this.getWeekday({ year: y, month: m, day: dInThisM }) }
            });
        }
    }

    parseSelectedDate(selDate: any): IMyDate {
        // Parse selDate value - it can be string or IMyDate object
        let date: IMyDate = { day: 0, month: 0, year: 0 };
        if (typeof selDate === 'string') {
            const sd: string = <string>selDate;
            date.day = this.utilService.parseDatePartNumber(this.opts.dateFormat, sd, 'dd');

            date.month = this.opts.dateFormat.indexOf('mmm') !== -1
                ? this.utilService.parseDatePartMonthName(this.opts.dateFormat, sd, 'mmm', this.opts.monthLabels)
                : this.utilService.parseDatePartNumber(this.opts.dateFormat, sd, 'mm');

            date.year = this.utilService.parseDatePartNumber(this.opts.dateFormat, sd, 'yyyy');
        } else if (typeof selDate === 'object') {
            date = selDate;
        }
        this.selectionDayTxt = this.formatDate(date);
        return date;
    }

    parseSelectedMonth(ms: string): IMyMonth {
        return this.utilService.parseDefaultMonth(ms);
    }

    setHeaderBtnDisabledState(m: number, y: number): void {
        let dpm: boolean = false;
        let dpy: boolean = false;
        let dnm: boolean = false;
        let dny: boolean = false;
        if (this.opts.disableHeaderButtons) {
            dpm = this.utilService.isMonthDisabledByDisableUntil(
                {
                    year: m === 1 ? y - 1 : y,
                    month: m === 1 ? 12 : m - 1,
                    day: this.daysInMonth(m === 1 ? 12 : m - 1, m === 1 ? y - 1 : y)
                },
                this.opts.disableUntil);
            dpy = this.utilService.isMonthDisabledByDisableUntil(
                { year: y - 1, month: m, day: this.daysInMonth(m, y - 1) }, this.opts.disableUntil);
            dnm = this.utilService.isMonthDisabledByDisableSince(
                { year: m === 12 ? y + 1 : y, month: m === 12 ? 1 : m + 1, day: 1 }, this.opts.disableSince);
            dny = this.utilService.isMonthDisabledByDisableSince({ year: y + 1, month: m, day: 1 }, this.opts.disableSince);
        }
        this.prevMonthDisabled = m === 1 && y === this.opts.minYear || dpm;
        this.prevYearDisabled = y - 1 < this.opts.minYear || dpy;
        this.nextMonthDisabled = m === 12 && y === this.opts.maxYear || dnm;
        this.nextYearDisabled = y + 1 > this.opts.maxYear || dny;
    }
}

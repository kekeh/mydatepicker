"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var core_1 = require("@angular/core");
var my_date_picker_locale_service_1 = require("./services/my-date-picker.locale.service");
var my_date_picker_validator_service_1 = require("./services/my-date-picker.validator.service");
var MyDatePicker = (function () {
    function MyDatePicker(elem, renderer, localeService, validatorService) {
        var _this = this;
        this.elem = elem;
        this.renderer = renderer;
        this.localeService = localeService;
        this.validatorService = validatorService;
        this.dateChanged = new core_1.EventEmitter();
        this.inputFieldChanged = new core_1.EventEmitter();
        this.calendarViewChanged = new core_1.EventEmitter();
        this.showSelector = false;
        this.visibleMonth = { monthTxt: "", monthNbr: 0, year: 0 };
        this.selectedMonth = { monthTxt: "", monthNbr: 0, year: 0 };
        this.selectedDate = { year: 0, month: 0, day: 0 };
        this.weekDays = [];
        this.dates = [];
        this.selectionDayTxt = "";
        this.invalidDate = false;
        this.disableTodayBtn = false;
        this.dayIdx = 0;
        this.weekDayOpts = ["su", "mo", "tu", "we", "th", "fr", "sa"];
        this.editMonth = false;
        this.invalidMonth = false;
        this.editYear = false;
        this.invalidYear = false;
        this.PREV_MONTH = 1;
        this.CURR_MONTH = 2;
        this.NEXT_MONTH = 3;
        this.opts = {
            dayLabels: {},
            monthLabels: {},
            dateFormat: "",
            showTodayBtn: true,
            todayBtnTxt: "",
            firstDayOfWeek: "",
            sunHighlight: true,
            markCurrentDay: true,
            disableUntil: { year: 0, month: 0, day: 0 },
            disableSince: { year: 0, month: 0, day: 0 },
            disableDays: [],
            disableWeekends: false,
            height: "34px",
            width: "100%",
            selectionTxtFontSize: "18px",
            inline: false,
            alignSelectorRight: false,
            indicateInvalidDate: true,
            showDateFormatPlaceholder: false,
            editableDateField: true,
            editableMonthAndYear: true,
            minYear: 1000,
            maxYear: 9999,
            componentDisabled: false
        };
        this.setLocaleOptions();
        renderer.listenGlobal("document", "click", function (event) {
            if (_this.showSelector && event.target && _this.elem.nativeElement !== event.target && !_this.elem.nativeElement.contains(event.target)) {
                _this.showSelector = false;
            }
            if (_this.opts.editableMonthAndYear && event.target && _this.elem.nativeElement.contains(event.target)) {
                _this.resetMonthYearEdit();
            }
        });
    }
    MyDatePicker.prototype.setLocaleOptions = function () {
        var _this = this;
        var opts = this.localeService.getLocaleOptions(this.locale);
        Object.keys(opts).forEach(function (k) {
            _this.opts[k] = opts[k];
        });
    };
    MyDatePicker.prototype.setOptions = function () {
        var _this = this;
        if (this.options !== undefined) {
            Object.keys(this.options).forEach(function (k) {
                _this.opts[k] = _this.options[k];
            });
        }
        if (this.opts.minYear < 1000) {
            this.opts.minYear = 1000;
        }
        if (this.opts.maxYear > 9999) {
            this.opts.minYear = 9999;
        }
    };
    MyDatePicker.prototype.resetMonthYearEdit = function () {
        this.editMonth = false;
        this.editYear = false;
        this.invalidMonth = false;
        this.invalidYear = false;
    };
    MyDatePicker.prototype.editMonthClicked = function (event) {
        event.stopPropagation();
        if (this.opts.editableMonthAndYear) {
            this.editMonth = true;
        }
    };
    MyDatePicker.prototype.editYearClicked = function (event) {
        event.stopPropagation();
        if (this.opts.editableMonthAndYear) {
            this.editYear = true;
        }
    };
    MyDatePicker.prototype.userDateInput = function (event) {
        this.invalidDate = false;
        if (event.target.value.length === 0) {
            this.clearDate();
        }
        else {
            var date = this.validatorService.isDateValid(event.target.value, this.opts.dateFormat, this.opts.minYear, this.opts.maxYear, this.opts.disableUntil, this.opts.disableSince, this.opts.disableWeekends, this.opts.disableDays, this.opts.monthLabels);
            if (date.day !== 0 && date.month !== 0 && date.year !== 0) {
                this.selectDate({ day: date.day, month: date.month, year: date.year });
            }
            else {
                this.invalidDate = true;
                this.selectionDayTxt = event.target.value;
            }
        }
        if (this.invalidDate) {
            this.inputFieldChanged.emit({ value: event.target.value, dateFormat: this.opts.dateFormat, valid: !(event.target.value.length === 0 || this.invalidDate) });
        }
    };
    MyDatePicker.prototype.userMonthInput = function (event) {
        if (event.keyCode === 13 || event.keyCode === 37 || event.keyCode === 39) {
            return;
        }
        this.invalidMonth = false;
        var m = this.validatorService.isMonthLabelValid(event.target.value, this.opts.monthLabels);
        if (m !== -1) {
            this.editMonth = false;
            if (m !== this.visibleMonth.monthNbr) {
                this.visibleMonth = { monthTxt: this.monthText(m), monthNbr: m, year: this.visibleMonth.year };
                this.generateCalendar(m, this.visibleMonth.year);
            }
        }
        else {
            this.invalidMonth = true;
        }
    };
    MyDatePicker.prototype.userYearInput = function (event) {
        if (event.keyCode === 13 || event.keyCode === 37 || event.keyCode === 39) {
            return;
        }
        this.invalidYear = false;
        var y = this.validatorService.isYearLabelValid(Number(event.target.value), this.opts.minYear, this.opts.maxYear);
        if (y !== -1) {
            this.editYear = false;
            if (y !== this.visibleMonth.year) {
                this.visibleMonth = { monthTxt: this.visibleMonth.monthTxt, monthNbr: this.visibleMonth.monthNbr, year: y };
                this.generateCalendar(this.visibleMonth.monthNbr, y);
            }
        }
        else {
            this.invalidYear = true;
        }
    };
    MyDatePicker.prototype.isTodayDisabled = function () {
        this.disableTodayBtn = this.validatorService.isDisabledDay(this.getToday(), this.opts.disableUntil, this.opts.disableSince, this.opts.disableWeekends, this.opts.disableDays);
    };
    MyDatePicker.prototype.parseOptions = function () {
        this.setOptions();
        if (this.locale) {
            this.setLocaleOptions();
        }
        this.isTodayDisabled();
        this.dayIdx = this.weekDayOpts.indexOf(this.opts.firstDayOfWeek);
        if (this.dayIdx !== -1) {
            var idx = this.dayIdx;
            for (var i = 0; i < this.weekDayOpts.length; i++) {
                this.weekDays.push(this.opts.dayLabels[this.weekDayOpts[idx]]);
                idx = this.weekDayOpts[idx] === "sa" ? 0 : idx + 1;
            }
        }
    };
    MyDatePicker.prototype.ngOnChanges = function (changes) {
        if (changes.hasOwnProperty("locale")) {
            this.locale = changes["locale"].currentValue;
        }
        if (changes.hasOwnProperty("options")) {
            this.options = changes["options"].currentValue;
        }
        this.weekDays.length = 0;
        this.parseOptions();
        if (changes.hasOwnProperty("defaultMonth")) {
            var dm = changes["defaultMonth"].currentValue;
            if (dm !== null && dm !== undefined && dm !== "") {
                this.selectedMonth = this.parseSelectedMonth(dm);
            }
            else {
                this.selectedMonth = { monthTxt: "", monthNbr: 0, year: 0 };
            }
        }
        if (changes.hasOwnProperty("selDate")) {
            var sd = changes["selDate"];
            if (sd.currentValue !== null && sd.currentValue !== undefined && sd.currentValue !== "" && Object.keys(sd.currentValue).length !== 0) {
                this.selectedDate = this.parseSelectedDate(sd.currentValue);
            }
            else {
                if (!sd.isFirstChange()) {
                    this.clearDate();
                }
            }
        }
        if (this.opts.inline) {
            this.setVisibleMonth();
        }
    };
    MyDatePicker.prototype.removeBtnClicked = function () {
        this.clearDate();
    };
    MyDatePicker.prototype.openBtnClicked = function () {
        this.showSelector = !this.showSelector;
        if (this.showSelector) {
            this.setVisibleMonth();
        }
    };
    MyDatePicker.prototype.setVisibleMonth = function () {
        var y = 0, m = 0;
        if (this.selectedDate.year === 0 && this.selectedDate.month === 0 && this.selectedDate.day === 0) {
            if (this.selectedMonth.year === 0 && this.selectedMonth.monthNbr === 0) {
                var today = this.getToday();
                y = today.year;
                m = today.month;
            }
            else {
                y = this.selectedMonth.year;
                m = this.selectedMonth.monthNbr;
            }
        }
        else {
            y = this.selectedDate.year;
            m = this.selectedDate.month;
        }
        this.visibleMonth = { monthTxt: this.opts.monthLabels[m], monthNbr: m, year: y };
        this.generateCalendar(m, y);
    };
    MyDatePicker.prototype.clearDate = function () {
        this.selectionDayTxt = "";
        this.selectedDate = { year: 0, month: 0, day: 0 };
        this.dateChanged.emit({ date: {}, jsdate: null, formatted: this.selectionDayTxt, epoc: 0 });
        this.inputFieldChanged.emit({ value: "", dateFormat: this.opts.dateFormat, valid: false });
        this.invalidDate = false;
    };
    MyDatePicker.prototype.prevMonth = function () {
        var d = this.getDate(this.visibleMonth.year, this.visibleMonth.monthNbr, 1);
        d.setMonth(d.getMonth() - 1);
        var y = d.getFullYear();
        var m = d.getMonth() + 1;
        this.visibleMonth = { monthTxt: this.monthText(m), monthNbr: m, year: y };
        this.generateCalendar(m, y);
    };
    MyDatePicker.prototype.nextMonth = function () {
        var d = this.getDate(this.visibleMonth.year, this.visibleMonth.monthNbr, 1);
        d.setMonth(d.getMonth() + 1);
        var y = d.getFullYear();
        var m = d.getMonth() + 1;
        this.visibleMonth = { monthTxt: this.monthText(m), monthNbr: m, year: y };
        this.generateCalendar(m, y);
    };
    MyDatePicker.prototype.prevYear = function () {
        if (this.visibleMonth.year - 1 < this.opts.minYear) {
            return;
        }
        this.visibleMonth.year--;
        this.generateCalendar(this.visibleMonth.monthNbr, this.visibleMonth.year);
    };
    MyDatePicker.prototype.nextYear = function () {
        if (this.visibleMonth.year + 1 > this.opts.maxYear) {
            return;
        }
        this.visibleMonth.year++;
        this.generateCalendar(this.visibleMonth.monthNbr, this.visibleMonth.year);
    };
    MyDatePicker.prototype.todayClicked = function () {
        var today = this.getToday();
        this.selectDate({ day: today.day, month: today.month, year: today.year });
        if (this.opts.inline && today.year !== this.visibleMonth.year || today.month !== this.visibleMonth.monthNbr) {
            this.visibleMonth = { monthTxt: this.opts.monthLabels[today.month], monthNbr: today.month, year: today.year };
            this.generateCalendar(today.month, today.year);
        }
    };
    MyDatePicker.prototype.cellClicked = function (cell) {
        if (cell.cmo === this.PREV_MONTH) {
            this.prevMonth();
        }
        else if (cell.cmo === this.CURR_MONTH) {
            this.selectDate(cell.dateObj);
        }
        else if (cell.cmo === this.NEXT_MONTH) {
            this.nextMonth();
        }
        this.resetMonthYearEdit();
    };
    MyDatePicker.prototype.cellKeyDown = function (event, cell) {
        if ((event.keyCode === 13 || event.keyCode === 32) && !cell.disabled) {
            event.preventDefault();
            this.cellClicked(cell);
        }
    };
    MyDatePicker.prototype.selectDate = function (date) {
        this.selectedDate = { day: date.day, month: date.month, year: date.year };
        this.selectionDayTxt = this.formatDate(this.selectedDate);
        this.showSelector = false;
        this.dateChanged.emit({ date: this.selectedDate, jsdate: this.getDate(date.year, date.month, date.day), formatted: this.selectionDayTxt, epoc: Math.round(this.getTimeInMilliseconds(this.selectedDate) / 1000.0) });
        this.inputFieldChanged.emit({ value: this.selectionDayTxt, dateFormat: this.opts.dateFormat, valid: true });
        this.invalidDate = false;
    };
    MyDatePicker.prototype.preZero = function (val) {
        return parseInt(val) < 10 ? "0" + val : val;
    };
    MyDatePicker.prototype.formatDate = function (val) {
        var formatted = this.opts.dateFormat.replace("yyyy", val.year).replace("dd", this.preZero(val.day));
        return this.opts.dateFormat.indexOf("mmm") !== -1 ? formatted.replace("mmm", this.monthText(val.month)) : formatted.replace("mm", this.preZero(val.month));
    };
    MyDatePicker.prototype.monthText = function (m) {
        return this.opts.monthLabels[m];
    };
    MyDatePicker.prototype.monthStartIdx = function (y, m) {
        var d = new Date();
        d.setDate(1);
        d.setMonth(m - 1);
        d.setFullYear(y);
        var idx = d.getDay() + this.sundayIdx();
        return idx >= 7 ? idx - 7 : idx;
    };
    MyDatePicker.prototype.daysInMonth = function (m, y) {
        return new Date(y, m, 0).getDate();
    };
    MyDatePicker.prototype.daysInPrevMonth = function (m, y) {
        var d = this.getDate(y, m, 1);
        d.setMonth(d.getMonth() - 1);
        return this.daysInMonth(d.getMonth() + 1, d.getFullYear());
    };
    MyDatePicker.prototype.isCurrDay = function (d, m, y, cmo, today) {
        return d === today.day && m === today.month && y === today.year && cmo === this.CURR_MONTH;
    };
    MyDatePicker.prototype.getToday = function () {
        var date = new Date();
        return { year: date.getFullYear(), month: date.getMonth() + 1, day: date.getDate() };
    };
    MyDatePicker.prototype.getTimeInMilliseconds = function (date) {
        return this.getDate(date.year, date.month, date.day).getTime();
    };
    MyDatePicker.prototype.getDayNumber = function (date) {
        var d = this.getDate(date.year, date.month, date.day);
        return d.getDay();
    };
    MyDatePicker.prototype.getWeekday = function (date) {
        return this.weekDayOpts[this.getDayNumber(date)];
    };
    MyDatePicker.prototype.getDate = function (year, month, day) {
        return new Date(year, month - 1, day, 0, 0, 0, 0);
    };
    MyDatePicker.prototype.sundayIdx = function () {
        return this.dayIdx > 0 ? 7 - this.dayIdx : 0;
    };
    MyDatePicker.prototype.generateCalendar = function (m, y) {
        this.dates.length = 0;
        var today = this.getToday();
        var monthStart = this.monthStartIdx(y, m);
        var dInThisM = this.daysInMonth(m, y);
        var dInPrevM = this.daysInPrevMonth(m, y);
        var dayNbr = 1;
        var cmo = this.PREV_MONTH;
        for (var i = 1; i < 7; i++) {
            var week = [];
            if (i === 1) {
                var pm = dInPrevM - monthStart + 1;
                for (var j = pm; j <= dInPrevM; j++) {
                    var date = { year: y, month: m - 1, day: j };
                    week.push({ dateObj: date, cmo: cmo, currDay: this.isCurrDay(j, m, y, cmo, today), dayNbr: this.getDayNumber(date), disabled: this.validatorService.isDisabledDay(date, this.opts.disableUntil, this.opts.disableSince, this.opts.disableWeekends, this.opts.disableDays) });
                }
                cmo = this.CURR_MONTH;
                var daysLeft = 7 - week.length;
                for (var j = 0; j < daysLeft; j++) {
                    var date = { year: y, month: m, day: dayNbr };
                    week.push({ dateObj: date, cmo: cmo, currDay: this.isCurrDay(dayNbr, m, y, cmo, today), dayNbr: this.getDayNumber(date), disabled: this.validatorService.isDisabledDay(date, this.opts.disableUntil, this.opts.disableSince, this.opts.disableWeekends, this.opts.disableDays) });
                    dayNbr++;
                }
            }
            else {
                for (var j = 1; j < 8; j++) {
                    if (dayNbr > dInThisM) {
                        dayNbr = 1;
                        cmo = this.NEXT_MONTH;
                    }
                    var date = { year: y, month: cmo === this.CURR_MONTH ? m : m + 1, day: dayNbr };
                    week.push({ dateObj: date, cmo: cmo, currDay: this.isCurrDay(dayNbr, m, y, cmo, today), dayNbr: this.getDayNumber(date), disabled: this.validatorService.isDisabledDay(date, this.opts.disableUntil, this.opts.disableSince, this.opts.disableWeekends, this.opts.disableDays) });
                    dayNbr++;
                }
            }
            this.dates.push(week);
        }
        this.calendarViewChanged.emit({ year: y, month: m, first: { number: 1, weekday: this.getWeekday({ year: y, month: m, day: 1 }) }, last: { number: dInThisM, weekday: this.getWeekday({ year: y, month: m, day: dInThisM }) } });
    };
    MyDatePicker.prototype.parseSelectedDate = function (selDate) {
        var date = { day: 0, month: 0, year: 0 };
        if (typeof selDate === "string") {
            var sd = selDate;
            date.day = this.validatorService.parseDatePartNumber(this.opts.dateFormat, sd, "dd");
            date.month = this.opts.dateFormat.indexOf("mmm") !== -1
                ? this.validatorService.parseDatePartMonthName(this.opts.dateFormat, sd, "mmm", this.opts.monthLabels)
                : this.validatorService.parseDatePartNumber(this.opts.dateFormat, sd, "mm");
            date.year = this.validatorService.parseDatePartNumber(this.opts.dateFormat, sd, "yyyy");
        }
        else if (typeof selDate === "object") {
            date = selDate;
        }
        this.selectionDayTxt = this.formatDate(date);
        return date;
    };
    MyDatePicker.prototype.parseSelectedMonth = function (ms) {
        return this.validatorService.parseDefaultMonth(ms);
    };
    return MyDatePicker;
}());
__decorate([
    core_1.Input(),
    __metadata("design:type", Object)
], MyDatePicker.prototype, "options", void 0);
__decorate([
    core_1.Input(),
    __metadata("design:type", String)
], MyDatePicker.prototype, "locale", void 0);
__decorate([
    core_1.Input(),
    __metadata("design:type", String)
], MyDatePicker.prototype, "defaultMonth", void 0);
__decorate([
    core_1.Input(),
    __metadata("design:type", String)
], MyDatePicker.prototype, "selDate", void 0);
__decorate([
    core_1.Output(),
    __metadata("design:type", core_1.EventEmitter)
], MyDatePicker.prototype, "dateChanged", void 0);
__decorate([
    core_1.Output(),
    __metadata("design:type", core_1.EventEmitter)
], MyDatePicker.prototype, "inputFieldChanged", void 0);
__decorate([
    core_1.Output(),
    __metadata("design:type", core_1.EventEmitter)
], MyDatePicker.prototype, "calendarViewChanged", void 0);
MyDatePicker = __decorate([
    core_1.Component({
        selector: "my-date-picker",
        styles: [".mydp{min-width:100px;border-radius:2px;line-height:1.1;display:inline-block;position:relative}.mydp *{-moz-box-sizing:border-box;-webkit-box-sizing:border-box;box-sizing:border-box;font-family:Arial,Helvetica,sans-serif;padding:0;margin:0}.mydp .selector{margin-top:2px;margin-left:-1px;position:absolute;width:262px;padding:3px;border-radius:2px;background-color:#DDD;z-index:100}.mydp .alignselectorright{right:-1px}.mydp .selectiongroup{position:relative;display:table;border:none;background-color:#FFF}.mydp .selection{background-color:#FFF;display:table-cell;position:absolute;width:100%;font-weight:700;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;text-align:center}.mydp .invaliddate,.mydp .invalidmonth,.mydp .invalidyear{background-color:#F1DEDE}.mydp ::-ms-clear{display:none}.mydp .headerbtncell,.mydp .selbtngroup{display:table-cell;vertical-align:middle}.mydp .selbtngroup{position:relative;white-space:nowrap;width:1%;text-align:right;font-size:0}.mydp .btnclear,.mydp .btnpicker{height:100%;width:30px;border:none;border-left:1px solid #CCC;padding:0;outline:0;font:inherit;-moz-user-select:none}.mydp .btnclearenabled,.mydp .btnpickerenabled,.mydp .headertodaybtnenabled{cursor:pointer}.mydp .btncleardisabled,.mydp .btnpickerdisabled,.mydp .headertodaybtndisabled{cursor:not-allowed}.mydp .btnclear,.mydp .btnpicker,.mydp .headertodaybtn{background:#FFF}.mydp .header{width:100%;height:30px;margin-bottom:1px;background-color:#FAFAFA}.mydp .header td{vertical-align:middle;border:none;line-height:0}.mydp .currday div,.mydp .selectedday div{border:1px solid #004198}.mydp .header td:nth-child(1){font-size:16px;padding-left:4px}.mydp .header td:nth-child(2){text-align:center}.mydp .header td:nth-child(3){font-size:16px;padding-right:4px}.mydp .caltable{table-layout:fixed;width:100%;background-color:#FFF;font-size:14px}.mydp .caltable,.mydp .daycell,.mydp .weekdaytitle{border-collapse:collapse;color:#036;line-height:1.1}.mydp .daycell,.mydp .weekdaytitle{padding:5px;text-align:center}.mydp .weekdaytitle{background-color:#DDD;font-size:12px;font-weight:700;vertical-align:middle}.mydp .daycell{cursor:pointer;height:30px}.mydp .daycell div{background-color:inherit;vertical-align:middle}.mydp .daycell div span{vertical-align:middle}.mydp .inlinedp{position:relative}.mydp .nextmonth,.mydp .prevmonth{color:#CCC}.mydp .disabled{cursor:default!important;color:#CCC!important;background:#FBEFEF!important}.mydp .sunday{color:#C30000}.mydp .sundayDim{opacity:.5}.mydp .currmonth{background-color:#F6F6F6;font-weight:700}.mydp .selectedday div{background-color:#8EBFFF!important;border-radius:0}.mydp .selectmenu{height:24px;width:60px}.mydp .headerbtncell{background-color:#FAFAFA;cursor:pointer}.mydp .headerbtn,.mydp .headerlabelbtn{background:#FAFAFA;border:none;height:18px}.mydp .headerbtn{width:16px}.mydp .headerlabelbtn{font-size:14px}.mydp,.mydp .headertodaybtn,.mydp .monthinput,.mydp .yearinput{border:1px solid #CCC}.mydp .btnclear,.mydp .btnpicker,.mydp .headerbtn,.mydp .headermonthtxt,.mydp .headertodaybtn,.mydp .headeryeartxt,.mydp .selection{color:#000}.mydp .headertodaybtn{padding:0 4px;border-radius:2px;font-size:11px;min-width:60px;height:22px}.mydp button::-moz-focus-inner{border:0}.mydp .headermonthtxt,.mydp .headeryeartxt{min-width:40px;text-align:center;display:table-cell;vertical-align:middle;font-size:14px}.mydp .btnclear:focus,.mydp .btnpicker:focus,.mydp .headertodaybtn:focus{background:#ADD8E6}.mydp .headerbtn:focus,.mydp .monthlabel:focus,.mydp .yearlabel:focus{color:#ADD8E6;outline:0}.mydp .daycell:focus{outline:#CCC solid 1px}.mydp .icon-calendar,.mydp .icon-cross{font-size:16px}.mydp .icon-left,.mydp .icon-right{color:#222;font-size:16px;vertical-align:middle}.mydp table{display:table}.mydp table td{padding:0}.mydp table,.mydp td,.mydp th{border:none}.mydp .btnclearenabled:hover,.mydp .btnpickerenabled:hover,.mydp .headertodaybtnenabled:hover,.mydp .tablesingleday:hover{background-color:#8BDAF4}.mydp .headerbtn,.mydp .monthlabel,.mydp .yearlabel{cursor:pointer}.mydp .monthinput,.mydp .yearinput{width:40px;height:22px;text-align:center;font-weight:700;outline:0;border-radius:2px}.mydp .headerbtn:hover,.mydp .monthlabel:hover,.mydp .yearlabel:hover{color:#8BDAF4}@font-face{font-family:mydatepicker;src:url(data:application/x-font-ttf;charset=utf-8;base64,AAEAAAALAIAAAwAwT1MvMg8SAssAAAC8AAAAYGNtYXDMUczTAAABHAAAAGxnYXNwAAAAEAAAAYgAAAAIZ2x5ZmFQ1q4AAAGQAAABbGhlYWQGZuTFAAAC/AAAADZoaGVhB4IDyQAAAzQAAAAkaG10eBYAAnAAAANYAAAAIGxvY2EBdAE0AAADeAAAABJtYXhwABUAPgAAA4wAAAAgbmFtZQ5R9RkAAAOsAAABnnBvc3QAAwAAAAAFTAAAACAAAwOaAZAABQAAApkCzAAAAI8CmQLMAAAB6wAzAQkAAAAAAAAAAAAAAAAAAAABEAAAAAAAAAAAAAAAAAAAAABAAADmBwPA/8AAQAPAAEAAAAABAAAAAAAAAAAAAAAgAAAAAAADAAAAAwAAABwAAQADAAAAHAADAAEAAAAcAAQAUAAAABAAEAADAAAAAQAg5gDmAuYF5gf//f//AAAAAAAg5gDmAuYF5gf//f//AAH/4xoEGgMaARoAAAMAAQAAAAAAAAAAAAAAAAAAAAAAAQAB//8ADwABAAAAAAAAAAAAAgAANzkBAAAAAAEAAAAAAAAAAAACAAA3OQEAAAAAAQAAAAAAAAAAAAIAADc5AQAAAAAMAEAAAAPAA4AABAAJAA4AEwAYAB0AIgAnACwAMQA2ADsAABMRMxEjFyE1IRUDITUhFQERMxEjJRUzNSMTFTM1IzMVMzUjMxUzNSMBFTM1IzMVMzUjMxUzNSMTFTM1I0Bzc0ADAP0AQAOA/IADDXNz/ZOAgCCAgMCAgMCAgP6AgIDAgIDAgIAggIADAP1AAsBzc3P9c3NzAwD9QALAgMDA/sCAgICAgID/AICAgICAgAJAwMAAAAAAAgBwADADkANQAAQACQAANwEnARcDATcBB+kCp3n9WXl5Aqd5/Vl5MAKnef1ZeQKn/Vl5Aqd5AAABAOAAAAMgA4AAAwAAAQMBJQMgA/3DASADgPyAAcPfAAEA4AAAAyADgAADAAA3EwEF4AMCPf7gAAOA/j3fAAAAAQAAAAEAAF0/BsNfDzz1AAsEAAAAAADRxFAkAAAAANHEUCQAAAAAA8ADgAAAAAgAAgAAAAAAAAABAAADwP/AAAAEAAAAAAADwAABAAAAAAAAAAAAAAAAAAAACAQAAAAAAAAAAAAAAAIAAAAEAABABAAAcAQAAOAEAADgAAAAAAAKABQAHgB6AJYApgC2AAAAAQAAAAgAPAAMAAAAAAACAAAAAAAAAAAAAAAAAAAAAAAAAA4ArgABAAAAAAABAAkAAAABAAAAAAACAAcAcgABAAAAAAADAAkAPAABAAAAAAAEAAkAhwABAAAAAAAFAAsAGwABAAAAAAAGAAkAVwABAAAAAAAKABoAogADAAEECQABABIACQADAAEECQACAA4AeQADAAEECQADABIARQADAAEECQAEABIAkAADAAEECQAFABYAJgADAAEECQAGABIAYAADAAEECQAKADQAvHZzZHBpY2tlcgB2AHMAZABwAGkAYwBrAGUAclZlcnNpb24gMS4wAFYAZQByAHMAaQBvAG4AIAAxAC4AMHZzZHBpY2tlcgB2AHMAZABwAGkAYwBrAGUAcnZzZHBpY2tlcgB2AHMAZABwAGkAYwBrAGUAclJlZ3VsYXIAUgBlAGcAdQBsAGEAcnZzZHBpY2tlcgB2AHMAZABwAGkAYwBrAGUAckZvbnQgZ2VuZXJhdGVkIGJ5IEljb01vb24uAEYAbwBuAHQAIABnAGUAbgBlAHIAYQB0AGUAZAAgAGIAeQAgAEkAYwBvAE0AbwBvAG4ALgAAAAMAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA=) format('truetype');font-weight:400;font-style:normal}.mydp .icon{font-family:mydatepicker;font-style:normal;font-weight:400;font-variant:normal;text-transform:none;-webkit-font-smoothing:antialiased;-moz-osx-font-smoothing:grayscale}.mydp .icon-calendar:before{content:\"\\e600\"}.mydp .icon-cross:before{content:\"\\e602\"}.mydp .icon-left:before{content:\"\\e605\"}.mydp .icon-right:before{content:\"\\e607\"}"],
        template: "<div class=\"mydp\" [ngStyle]=\"{'width': opts.width, 'border': opts.inline ? 'none' : null}\"><div class=\"selectiongroup\" *ngIf=\"!opts.inline\"><input type=\"text\" class=\"selection\" [attr.maxlength]=\"opts.dateFormat.length\" [ngClass]=\"{'invaliddate': invalidDate&&opts.indicateInvalidDate}\" placeholder=\"{{opts.showDateFormatPlaceholder?opts.dateFormat:''}}\" [ngStyle]=\"{'height': opts.height, 'line-height': opts.height, 'font-size': opts.selectionTxtFontSize, 'border': 'none', 'padding-right': selectionDayTxt.length>0 ? '60px' : '30px'}\" (keyup)=\"userDateInput($event)\" [value]=\"selectionDayTxt\" [disabled]=\"opts.componentDisabled\" [readonly]=\"!opts.editableDateField\" aria-label=\"SelectedDate\"> <span class=\"selbtngroup\" [style.height]=\"opts.height\"><button type=\"button\" class=\"btnclear\" *ngIf=\"selectionDayTxt.length>0\" (click)=\"removeBtnClicked()\" [ngClass]=\"{'btnclearenabled': !opts.componentDisabled, 'btncleardisabled': opts.componentDisabled}\" [disabled]=\"opts.componentDisabled\" aria-label=\"ClearDate\"><span class=\"icon icon-cross\" [ngStyle]=\"{'line-height': opts.height}\"></span></button> <button type=\"button\" class=\"btnpicker\" (click)=\"openBtnClicked()\" [ngClass]=\"{'btnpickerenabled': !opts.componentDisabled, 'btnpickerdisabled': opts.componentDisabled}\" [disabled]=\"opts.componentDisabled\" aria-label=\"OpenSelector\"><span class=\"icon icon-calendar\" [ngStyle]=\"{'line-height': opts.height}\"></span></button></span></div><div class=\"selector\" *ngIf=\"showSelector||opts.inline\" [ngClass]=\"{'inlinedp': opts.inline, 'alignselectorright': opts.alignSelectorRight}\"><table class=\"header\"><tr><td><div style=\"float:left\"><div class=\"headerbtncell\"><button type=\"button\" class=\"headerbtn icon icon-left\" (click)=\"prevMonth()\"></button></div><div class=\"headermonthtxt\"><input type=\"text\" *ngIf=\"editMonth\" class=\"monthinput\" maxlength=\"4\" inputFocus [value]=\"visibleMonth.monthTxt\" (keyup)=\"userMonthInput($event)\" (click)=\"$event.stopPropagation()\" [ngClass]=\"{'invalidmonth': invalidMonth}\"> <button class=\"headerlabelbtn\" type=\"button\" [ngClass]=\"{'monthlabel': opts.editableMonthAndYear}\" *ngIf=\"!editMonth\" (click)=\"opts.editableMonthAndYear&&editMonthClicked($event)\" tabindex=\"{{opts.editableMonthAndYear?'0':'-1'}}\">{{visibleMonth.monthTxt}}</button></div><div class=\"headerbtncell\"><button type=\"button\" class=\"headerbtn icon icon-right\" (click)=\"nextMonth()\"></button></div></div></td><td *ngIf=\"opts.showTodayBtn\"><button type=\"button\" class=\"headertodaybtn\" (click)=\"todayClicked()\" [disabled]=\"disableTodayBtn\" [ngClass]=\"{'headertodaybtnenabled': !disableTodayBtn, 'headertodaybtndisabled': disableTodayBtn}\">{{opts.todayBtnTxt}}</button></td><td><div style=\"float:right\"><div class=\"headerbtncell\"><button type=\"button\" class=\"headerbtn icon icon-left\" (click)=\"prevYear()\"></button></div><div class=\"headeryeartxt\"><input type=\"text\" *ngIf=\"editYear\" class=\"yearinput\" maxlength=\"4\" inputFocus [value]=\"visibleMonth.year\" (keyup)=\"userYearInput($event)\" (click)=\"$event.stopPropagation()\" [ngClass]=\"{'invalidyear': invalidYear}\"> <button class=\"headerlabelbtn\" type=\"button\" [ngClass]=\"{'yearlabel': opts.editableMonthAndYear}\" *ngIf=\"!editYear\" (click)=\"opts.editableMonthAndYear&&editYearClicked($event)\" tabindex=\"{{opts.editableMonthAndYear?'0':'-1'}}\">{{visibleMonth.year}}</button></div><div class=\"headerbtncell\"><button type=\"button\" class=\"headerbtn icon icon-right\" (click)=\"nextYear()\"></button></div></div></td></tr></table><table class=\"caltable\"><thead><tr><th class=\"weekdaytitle\" *ngFor=\"let d of weekDays\" scope=\"col\">{{d}}</th></tr></thead><tbody><tr *ngFor=\"let w of dates\"><td class=\"daycell\" *ngFor=\"let d of w\" [ngClass]=\"{'currmonth':d.cmo===CURR_MONTH&&!d.disabled, 'currday':d.currDay&&opts.markCurrentDay, 'selectedday':selectedDate.day===d.dateObj.day && selectedDate.month===d.dateObj.month && selectedDate.year===d.dateObj.year && d.cmo===CURR_MONTH, 'disabled': d.disabled, 'tablesingleday': d.cmo===CURR_MONTH&&!d.disabled}\" (click)=\"!d.disabled&&cellClicked(d);$event.stopPropagation()\" (keydown)=\"cellKeyDown($event, d)\" tabindex=\"0\"><div [ngClass]=\"{'prevmonth':d.cmo===PREV_MONTH,'currmonth':d.cmo===CURR_MONTH,'nextmonth':d.cmo===NEXT_MONTH,'sunday':d.dayNbr === 0 && opts.sunHighlight}\"><span [ngClass]=\"{'sundayDim': opts.sunHighlight && d.dayNbr === 0 && (d.cmo===PREV_MONTH || d.cmo===NEXT_MONTH || d.disabled)}\">{{d.dateObj.day}}</span></div></td></tr></tbody></table></div></div>",
        providers: [my_date_picker_locale_service_1.LocaleService, my_date_picker_validator_service_1.ValidatorService],
        encapsulation: core_1.ViewEncapsulation.None
    }),
    __metadata("design:paramtypes", [core_1.ElementRef, core_1.Renderer, my_date_picker_locale_service_1.LocaleService, my_date_picker_validator_service_1.ValidatorService])
], MyDatePicker);
exports.MyDatePicker = MyDatePicker;

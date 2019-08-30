import { Injectable } from "@angular/core";
import { IMyDate } from "../interfaces/my-date.interface";
import { IMyDateRange } from "../interfaces/my-date-range.interface";
import { IMyMonth } from "../interfaces/my-month.interface";
import { IMyMonthLabels } from "../interfaces/my-month-labels.interface";
import { IMyMarkedDates } from "../interfaces/my-marked-dates.interface";
import { IMyMarkedDate } from "../interfaces/my-marked-date.interface";
import { IMyDateFormat } from "../interfaces/my-date-format.interface";

const M = "m";
const MM = "mm";
const MMM = "mmm";
const D = "d";
const DD = "dd";
const YYYY = "yyyy";

@Injectable()
export class UtilService {
    weekDays: Array<string> = ["su", "mo", "tu", "we", "th", "fr", "sa"];

    isDateValid(dateStr: string, dateFormat: string, minYear: number, maxYear: number, disableUntil: IMyDate, disableSince: IMyDate, disableWeekends: boolean, disableWeekDays: Array<string>, disableDays: Array<IMyDate>, disableDateRanges: Array<IMyDateRange>, monthLabels: IMyMonthLabels, enableDays: Array<IMyDate>): IMyDate {
        let returnDate: IMyDate = {day: 0, month: 0, year: 0};
        let daysInMonth: Array<number> = [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];
        let isMonthStr: boolean = dateFormat.indexOf(MMM) !== -1;
        let delimeters: Array<string> = this.getDateFormatDelimeters(dateFormat);

        let dateValue: Array<IMyDateFormat> = this.getDateValue(dateStr, dateFormat, delimeters);
        let year: number = this.getNumberByValue(dateValue[0]);
        let month: number = isMonthStr ? this.getMonthNumberByMonthName(dateValue[1], monthLabels) : this.getNumberByValue(dateValue[1]);
        let day: number = this.getNumberByValue(dateValue[2]);

        if (month !== -1 && day !== -1 && year !== -1) {
            if (year < minYear || year > maxYear || month < 1 || month > 12) {
                return returnDate;
            }

            let date: IMyDate = {year: year, month: month, day: day};

            if (this.isDisabledDay(date, minYear, maxYear, disableUntil, disableSince, disableWeekends, disableWeekDays, disableDays, disableDateRanges, enableDays)) {
                return returnDate;
            }

            if (year % 400 === 0 || (year % 100 !== 0 && year % 4 === 0)) {
                daysInMonth[1] = 29;
            }

            if (day < 1 || day > daysInMonth[month - 1]) {
                return returnDate;
            }

            // Valid date
            return date;
        }
        return returnDate;
    }

    getDateValue(dateStr: string, dateFormat: string, delimeters: Array<string>): Array<IMyDateFormat> {
        let del: string = delimeters[0];
        if (delimeters[0] !== delimeters[1]) {
            del = delimeters[0] + delimeters[1];
        }

        let re: any = new RegExp("[" + del + "]");
        let ds: Array<string> = dateStr.split(re);
        let df: Array<string> = dateFormat.split(re);
        let da: Array<IMyDateFormat> = [];

        for (let i = 0; i < df.length; i++) {
            if (df[i].indexOf(YYYY) !== -1) {
                da[0] = {value: ds[i], format: df[i]};
            }
            if (df[i].indexOf(M) !== -1) {
                da[1] = {value: ds[i], format: df[i]};
            }
            if (df[i].indexOf(D) !== -1) {
                da[2] = {value: ds[i], format: df[i]};
            }
        }
        return da;
    }

    getMonthNumberByMonthName(df: IMyDateFormat, monthLabels: IMyMonthLabels): number {
        if (df.value) {
            for (let key = 1; key <= 12; key++) {
                if (df.value.toLowerCase() === monthLabels[key].toLowerCase()) {
                    return key;
                }
            }
        }
        return -1;
    }

    getNumberByValue(df: IMyDateFormat): number {
        if (!/^\d+$/.test(df.value)) {
            return -1;
        }

        let nbr: number = Number(df.value);
        if (df.format.length === 1 && df.value.length !== 1 && nbr < 10 || df.format.length === 1 && df.value.length !== 2 && nbr >= 10) {
            nbr = -1;
        }
        else if (df.format.length === 2 && df.value.length > 2) {
            nbr = -1;
        }
        return nbr;
    }

    getDateFormatDelimeters(dateFormat: string): Array<string> {
        return dateFormat.match(/[^(dmy)]{1,}/g);
    }

    parseDefaultMonth(monthString: string): IMyMonth {
        let month: IMyMonth = {monthTxt: "", monthNbr: 0, year: 0};
        if (monthString !== "") {
            let split = monthString.split(monthString.match(/[^0-9]/)[0]);
            month.monthNbr = split[0].length === 2 ? parseInt(split[0]) : parseInt(split[1]);
            month.year = split[0].length === 2 ? parseInt(split[1]) : parseInt(split[0]);
        }
        return month;
    }

    formatDate(date: IMyDate, dateFormat: string, monthLabels: IMyMonthLabels): string {
        let formatted: string = dateFormat.replace(YYYY, String(date.year));

        if (dateFormat.indexOf(MMM) !== -1) {
            formatted = formatted.replace(MMM, monthLabels[date.month]);
        }
        else if (dateFormat.indexOf(MM) !== -1) {
            formatted = formatted.replace(MM, this.preZero(date.month));
        }
        else {
            formatted = formatted.replace(M, String(date.month));
        }

        if (dateFormat.indexOf(DD) !== -1) {
            formatted = formatted.replace(DD, this.preZero(date.day));
        }
        else {
            formatted = formatted.replace(D, String(date.day));
        }
        return formatted;
    }

    preZero(val: number): string {
        return val < 10 ? "0" + val : String(val);
    }

    isDisabledDay(date: IMyDate, minYear: number, maxYear: number, disableUntil: IMyDate, disableSince: IMyDate, disableWeekends: boolean, disableWeekDays: Array<string>, disableDays: Array<IMyDate>, disableDateRanges: Array<IMyDateRange>, enableDays: Array<IMyDate>): boolean {
        for (let e of enableDays) {
            if (e.year === date.year && e.month === date.month && e.day === date.day) {
                return false;
            }
        }

        let dn = this.getDayNumber(date);

        if (date.year < minYear && date.month === 12 || date.year > maxYear && date.month === 1) {
            return true;
        }

        let dateMs: number = this.getTimeInMilliseconds(date);
        if (this.isInitializedDate(disableUntil) && dateMs <= this.getTimeInMilliseconds(disableUntil)) {
            return true;
        }

        if (this.isInitializedDate(disableSince) && dateMs >= this.getTimeInMilliseconds(disableSince)) {
            return true;
        }

        if (disableWeekends) {
            if (dn === 0 || dn === 6) {
                return true;
            }
        }

        if (disableWeekDays.length > 0) {
            for (let wd of disableWeekDays) {
                if (dn === this.getWeekdayIndex(wd)) {
                    return true;
                }
            }
        }

        for (let d of disableDays) {
            if (d.year === date.year && d.month === date.month && d.day === date.day) {
                return true;
            }
        }

        for (let d of disableDateRanges) {
            if (this.isInitializedDate(d.begin) && this.isInitializedDate(d.end) && dateMs >= this.getTimeInMilliseconds(d.begin) && dateMs <= this.getTimeInMilliseconds(d.end)) {
                return true;
            }
        }
        return false;
    }

    isMarkedDate(date: IMyDate, markedDates: Array<IMyMarkedDates>, markWeekends: IMyMarkedDate): IMyMarkedDate {
        for (let md of markedDates) {
            for (let d of md.dates) {
                if (d.year === date.year && d.month === date.month && d.day === date.day) {
                    return {marked: true, color: md.color};
                }
            }
        }
        if (markWeekends && markWeekends.marked) {
            let dayNbr = this.getDayNumber(date);
            if (dayNbr === 0 || dayNbr === 6) {
                return {marked: true, color: markWeekends.color};
            }
        }
        return {marked: false, color: ""};
    }

    isHighlightedDate(date: IMyDate, sunHighlight: boolean, satHighlight: boolean, highlightDates: Array<IMyDate>): boolean {
        let dayNbr: number = this.getDayNumber(date);
        if (sunHighlight && dayNbr === 0 || satHighlight && dayNbr === 6) {
            return true;
        }
        for (let d of highlightDates) {
            if (d.year === date.year && d.month === date.month && d.day === date.day) {
                return true;
            }
        }
        return false;
    }

    getWeekNumber(date: IMyDate): number {
        let d: Date = new Date(date.year, date.month - 1, date.day, 0, 0, 0, 0);
        d.setDate(d.getDate() + (d.getDay() === 0 ? -3 : 4 - d.getDay()));
        return Math.round(((d.getTime() - new Date(d.getFullYear(), 0, 4).getTime()) / 86400000) / 7) + 1;
    }

    isMonthDisabledByDisableUntil(date: IMyDate, disableUntil: IMyDate): boolean {
        return this.isInitializedDate(disableUntil) && this.getTimeInMilliseconds(date) <= this.getTimeInMilliseconds(disableUntil);
    }

    isMonthDisabledByDisableSince(date: IMyDate, disableSince: IMyDate): boolean {
        return this.isInitializedDate(disableSince) && this.getTimeInMilliseconds(date) >= this.getTimeInMilliseconds(disableSince);
    }

    isInitializedDate(date: IMyDate): boolean {
        return date.year !== 0 && date.month !== 0 && date.day !== 0;
    }

    isSameDate(d1: IMyDate, d2: IMyDate): boolean {
        return d1.year === d2.year && d1.month === d2.month && d1.day === d2.day;
    }

    getTimeInMilliseconds(date: IMyDate): number {
        return new Date(date.year, date.month - 1, date.day, 0, 0, 0, 0).getTime();
    }

    getDayNumber(date: IMyDate): number {
        return new Date(date.year, date.month - 1, date.day, 0, 0, 0, 0).getDay();
    }

    getWeekDays(): Array<string> {
        return this.weekDays;
    }

    getWeekdayIndex(wd: string) {
        return this.weekDays.indexOf(wd);
    }
}
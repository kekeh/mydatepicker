import {Injectable} from '@angular/core';
import {IMyDate} from './interfaces/index';

@Injectable()
export class DateValidatorService {

    isDateValid(date:string, dateFormat:string): IMyDate {
        let daysInMonth:Array<number> = [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];

        let returnDate:IMyDate = {day: 0, month: 0, year: 0};

        if(date.length !== 10) {
            return returnDate;
        }

        let separator = dateFormat.replace(/[dmy]/g, '')[0];

        let parts = date.split(separator);
        if(parts.length !== 3) {
            return returnDate;
        }

        let dpos = dateFormat.indexOf('dd');
        let mpos = dateFormat.indexOf('mm');
        let ypos = dateFormat.indexOf('yyyy');

        if (dpos !== -1 && mpos !== -1 && ypos !== -1) {
            let day = parseInt(date.substring(dpos, dpos + 2)) || 0;
            let month = parseInt(date.substring(mpos, mpos + 2)) || 0;
            let year = parseInt(date.substring(ypos, ypos + 4)) || 0;

            if(day === 0 || month === 0 || year === 0) {
                return returnDate;
            }

            if(year < 1000 || year > 9999 || month < 1 || month > 12) {
                return returnDate;
            }

            if(year % 400 === 0 || (year % 100 !== 0 && year % 4 === 0)) {
                daysInMonth[1] = 29;
            }

            if(day < 1 || day > daysInMonth[month - 1]) {
                return returnDate;
            }

            // Valid date
            return {day: day, month: month, year: year};
        }
        return returnDate;
    }
}
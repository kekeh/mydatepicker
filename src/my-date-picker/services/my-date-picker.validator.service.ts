import {Injectable} from '@angular/core';
import {IMyDate} from '../interfaces/my-date.interface';
import {IMyMonthLabels} from '../interfaces/my-month-labels.interface';

@Injectable()
export class ValidatorService {

    isDateValid(date:string, dateFormat:string, minYear:number, maxYear:number, disableUntil:IMyDate, disableSince:IMyDate): IMyDate {
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

            if(year < minYear || year > maxYear || month < 1 || month > 12) {
                return returnDate;
            }
            
            if(disableUntil.day > 0 && disableUntil.month > 0 && disableUntil.year > 0){
                //disableUntil is set
                //caller assumes risk of invalid day/month/year being provided
                if(year < disableUntil.year){
                    return returnDate;
                }
                if(year === disableUntil.year){
                    if(month < disableUntil.month){
                        return returnDate;
                    }
                    if (month === disableUntil.month && day <= disableUntil.day){
                        return returnDate;
                    }
                }
                
            }
            
            if (disableSince.day > 0 && disableSince.month > 0 && disableSince.year > 0){
                //disableSince is set
                //caller assumes risk of invalid day/month/year being provided
                if(year > disableSince.year){
                    return returnDate;
                }
                if(year === disableSince.year){
                    if(month > disableSince.month){
                        return returnDate;
                    }
                    if(month === disableSince.month && day >= disableSince.day){
                        return returnDate;
                    }
                }
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

    isMonthLabelValid(monthLabel:string, monthLabels:IMyMonthLabels): number {
        for (let key = 1; key <= 12; key++) {
            if (monthLabel.toLowerCase() === monthLabels[key].toLowerCase()) {
                return key;
            }
        }
        return -1;
    }

    isYearLabelValid(yearLabel:number, minYear:number, maxYear:number): number {
        if (yearLabel >= minYear && yearLabel <= maxYear) {
            return yearLabel;
        }
        return -1;
    }
}
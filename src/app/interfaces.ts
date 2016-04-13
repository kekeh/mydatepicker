export interface MyDate {
    year: number;
    month: number;
    day: number;
}

export interface MyMonth {
    monthTxt: string;
    monthNbr: number;
    year: number;
}

export interface MyWeek {
    day: number;
    month: number;
    year: number;
    cmo: number;
    currDay: boolean;
    sun: boolean;
}

export interface MyDayLabels {
    [day: string]: string;
}

export interface MyMonthLabels {
    [month: number]: string;
}

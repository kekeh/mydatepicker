import { IMyWeekday } from "./my-weekday.interface";

export interface IMyCalendarViewChanged {
    year: number;
    month: number;
    first: IMyWeekday;
    last: IMyWeekday;
}

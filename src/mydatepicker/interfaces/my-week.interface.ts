import { IMyCalendarDay } from "./my-calendar-day.interface";

export interface IMyWeek {
    week: Array<IMyCalendarDay>;
    weekNbr: number;
}
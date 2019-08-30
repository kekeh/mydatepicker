import { IMyDate } from "./my-date.interface";

export interface IMyDateModel {
    date: IMyDate;
    jsdate: Date;
    formatted: string;
    epoc: number;
}

import { IMyOptions } from "./my-options.interface";

export interface IMyLocales {
    [lang: string]: IMyOptions;
}
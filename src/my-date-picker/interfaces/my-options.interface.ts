import { IMyDayLabels } from "./my-day-labels.interface";
import { IMyMonthLabels } from "./my-month-labels.interface";
import { IMyDate } from "./my-date.interface";

export interface IMyOptions {
    dayLabels?: IMyDayLabels;
    monthLabels?: IMyMonthLabels;
    dateFormat?: string;
    showTodayBtn?: boolean;
    todayBtnTxt?: string;
    firstDayOfWeek?: string;
    sunHighlight?: boolean;
    markCurrentDay?: boolean;
    disableUntil?: IMyDate;
    disableSince?: IMyDate;
    disableDays?: Array<IMyDate>;
    disableWeekends?: boolean;
    height?: string;
    width?: string;
    selectionTxtFontSize?: string;
    inline?: boolean;
    alignSelectorRight?: boolean;
    indicateInvalidDate?: boolean;
    showDateFormatPlaceholder?: boolean;
    editableDateField?: boolean;
    editableMonthAndYear?: boolean;
    minYear?: number;
    maxYear?: number;
    componentDisabled?: boolean;
    [key: string]: any;
}

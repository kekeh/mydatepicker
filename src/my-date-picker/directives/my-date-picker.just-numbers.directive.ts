import { Directive, ElementRef, HostListener, Input } from "@angular/core";

@Directive({
    // tslint:disable-next-line:directive-selector
    selector: "[justNumbers]"
})
export class JustNumbersDirective {
    @Input() justNumbers: boolean;

    regExp: string = "^[0-9]*$";
    constructor(private el: ElementRef) { }

    @HostListener("keydown", ["$event"]) onKeyDown(event: any) {
        if (this.justNumbers) {
            const e = <KeyboardEvent>event;

            /*
        13 enter, 27 esc, 9 tab, 8 backspace, 46 delete
        */
            if ([46, 8, 9, 27, 13].indexOf(e.keyCode) !== -1 ||
                // Allow: Ctrl+A
                (e.keyCode === 65 && e.ctrlKey === true) ||
                // Allow: Ctrl+C
                (e.keyCode === 67 && e.ctrlKey === true) ||
                // Allow: Ctrl+X
                (e.keyCode === 88 && e.ctrlKey === true) ||
                // Allow: home, end, left, right
                (e.keyCode >= 35 && e.keyCode <= 39)) {
                // let it happen, don't do anything
                return;
            }
            const ch = e.char ? e.char : e.key;
            const regEx = new RegExp(this.regExp);
            if (regEx.test(ch)) {
                return;
            } else {
                e.preventDefault();
            }

        } else {
            return;
        }

    }
}
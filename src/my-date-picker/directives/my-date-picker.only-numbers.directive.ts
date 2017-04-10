import { Directive, ElementRef, HostListener, Input } from "@angular/core";

@Directive({
    // tslint:disable-next-line:directive-selector
    selector: "[onlyNumbers]"
})
export class OnlyNumbersDirective {
    @Input() onlyNumbers: boolean;

    regExp: string = "^[0-9]*$";
    constructor(private el: ElementRef) { }

    @HostListener("keydown", ["$event"]) onKeyDown(event: any) {
        console.log("aca", this.onlyNumbers);
        if (this.onlyNumbers) {
            const e = <KeyboardEvent>event;

            if ([46, 8, 9, 27, 13, 110, 190].indexOf(e.keyCode) !== -1 ||
                // Allow: Ctrl+A
                (e.keyCode === 65 && e.ctrlKey === true) ||
                // Allow: Ctrl+C
                (e.keyCode === 67 && e.ctrlKey === true) ||
                // Allow: Ctrl+X
                (e.keyCode === 88 && e.ctrlKey === true) ||
                // Allow: home, end, left, right
                (e.keyCode >= 35 && e.keyCode <= 39)) {
                // let it happen, don"t do anything
                return;
            }
            const ch = e.char ? e.char : e.key;
            const regEx = new RegExp(this.regExp);
            console.log(regEx.test(ch));
            if (regEx.test(ch)) {
                return;
            } else {
                event.preventDefault();
            }

        } else {
            return;
        }

    }
}
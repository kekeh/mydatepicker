import { Directive, ElementRef, HostListener, Input } from "@angular/core";

@Directive({
    selector: "[myinputnumeric]"
})
export class NumericDateDirective {
    private regexStr = "^[0-9/.-]*$";
    private allowedKeys: Array<string> = ["Backspace", "Tab", "End", "Home", "ArrowLeft", "ArrowRight"];
    constructor(private element: ElementRef) {       
    }
    @HostListener("keydown", ["$event"]) onKeyDown(event: KeyboardEvent) {
        if (this.allowedKeys.indexOf(event.key) !== -1) {
            return;
        }
        let current: string = this.element.nativeElement.value;
        let next: string = current.concat(event.key);
        let regEx = new RegExp(this.regexStr);
        if (regEx.test(next)) {
            return;
        }
        else {
            event.preventDefault();
        }
    }
}
import { CommonModule } from "@angular/common";
import { FormsModule } from "@angular/forms";
import { NgModule } from "@angular/core";
import { MyDatePicker } from "./my-date-picker.component";
import { FocusDirective } from "./directives/my-date-picker.focus.directive";
import { InputAutoFillDirective } from "./directives/my-date-picker.input.auto.fill.directive";
import { NumericDateDirective } from "./directives/my-date-picker.numeric.directive";

@NgModule({
    imports: [CommonModule, FormsModule],
    declarations: [MyDatePicker, FocusDirective, InputAutoFillDirective, NumericDateDirective],
    exports: [MyDatePicker, FocusDirective, InputAutoFillDirective, NumericDateDirective]
})
export class MyDatePickerModule {
}

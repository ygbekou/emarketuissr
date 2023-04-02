import { Directive, Input, ElementRef } from '@angular/core';
import { Validator, AbstractControl, NG_VALIDATORS } from '@angular/forms';
@Directive({
  // tslint:disable-next-line: directive-selector
  selector: '[maxBillAmount]',
  providers: [
    { provide: NG_VALIDATORS, useExisting: MaxAmountDirective, multi: true }
  ]
})
export class MaxAmountDirective implements Validator {
  @Input() maxBillAmount: number;

  constructor(private el: ElementRef) {}

  validate(c: AbstractControl): { [key: string]: any } {
    if (c.value && this.maxBillAmount && c.value > this.maxBillAmount) {
      return {
        result: true
      };
    }
    return null;
  }
}

import {Directive, ElementRef, HostListener} from '@angular/core';
import {PhoneNumberFormatPipe} from "../pipes/phone-number-format.pipe";

@Directive({
  selector: '[phoneNumber]'
})
export class PhoneNumberDirective {
  inputElement: HTMLInputElement;
  onlyDigitsRegex = RegExp('[0-9]');
  private navigationKeys = [
    'Backspace',
    'Delete',
    'Tab',
    'Escape',
    'Enter',
    'Home',
    'End',
    'ArrowLeft',
    'ArrowRight',
    'Clear',
    'Copy',
    'Paste',
  ];

  constructor(public el: ElementRef,
              private phoneNumberFormatPipe: PhoneNumberFormatPipe) {
    this.inputElement = el.nativeElement;
  }

  @HostListener('keydown', ['$event'])
  onKeyDown(e): any {
    if (
      this.navigationKeys.indexOf(e.key) > -1 || // Allow: navigation keys: backspace, delete, arrows etc.
      (e.key === 'a' && e.ctrlKey === true) || // Allow: Ctrl+A
      (e.key === 'c' && e.ctrlKey === true) || // Allow: Ctrl+C
      (e.key === 'v' && e.ctrlKey === true) || // Allow: Ctrl+V
      (e.key === 'x' && e.ctrlKey === true) || // Allow: Ctrl+X
      (e.key === 'a' && e.metaKey === true) || // Allow: Cmd+A (Mac)
      (e.key === 'c' && e.metaKey === true) || // Allow: Cmd+C (Mac)
      (e.key === 'v' && e.metaKey === true) || // Allow: Cmd+V (Mac)
      (e.key === 'x' && e.metaKey === true) // Allow: Cmd+X (Mac)
    ) {
      // let it happen, don't do anything
      return;
    }

    const value = e.target.value;
    if (value.length >= 13 || !this.onlyDigitsRegex.test(e.key)) {
      e.preventDefault();
      return;
    }
  }

  @HostListener('keyup', ['$event'])
  onKeyUp(e): any {
    e.target.value = this.phoneNumberFormatPipe.transform(e.target.value);
  }

  @HostListener('blur', ['$event'])
  onBlur(e): any {
    e.target.value = this.phoneNumberFormatPipe.transform(e.target.value);
  }

  @HostListener('paste', ['$event'])
  onPaste(e): any {
    let pastedInput: string;
    // @ts-ignore
    if (window.clipboardData) {
      // Browser is IE
      // @ts-ignore
      pastedInput = window.clipboardData.getData('text');
    } else if (e.clipboardData && e.clipboardData.getData) {
      // Other browsers
      pastedInput = e.clipboardData.getData('text/plain');
    }
    e.target.value = this.phoneNumberFormatPipe.transform(pastedInput);
  }
}

import * as i0 from '@angular/core';
import { Directive, Input, NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DomHandler } from 'primeng/dom';

class AutoFocus {
    constructor(host) {
        this.host = host;
        this.focused = false;
    }
    ngAfterContentChecked() {
        if (!this.focused) {
            if (this.autofocus) {
                const focusableElements = DomHandler.getFocusableElements(this.host.nativeElement);
                if (focusableElements.length === 0) {
                    this.host.nativeElement.focus();
                }
                if (focusableElements.length > 0) {
                    focusableElements[0].focus();
                }
                this.focused = true;
            }
        }
    }
}
AutoFocus.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "14.0.7", ngImport: i0, type: AutoFocus, deps: [{ token: i0.ElementRef }], target: i0.ɵɵFactoryTarget.Directive });
AutoFocus.ɵdir = i0.ɵɵngDeclareDirective({ minVersion: "14.0.0", version: "14.0.7", type: AutoFocus, selector: "[pAutoFocus]", inputs: { autofocus: "autofocus" }, host: { classAttribute: "p-element" }, ngImport: i0 });
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "14.0.7", ngImport: i0, type: AutoFocus, decorators: [{
            type: Directive,
            args: [{
                    selector: '[pAutoFocus]',
                    host: {
                        class: 'p-element'
                    }
                }]
        }], ctorParameters: function () { return [{ type: i0.ElementRef }]; }, propDecorators: { autofocus: [{
                type: Input
            }] } });
class AutoFocusModule {
}
AutoFocusModule.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "14.0.7", ngImport: i0, type: AutoFocusModule, deps: [], target: i0.ɵɵFactoryTarget.NgModule });
AutoFocusModule.ɵmod = i0.ɵɵngDeclareNgModule({ minVersion: "14.0.0", version: "14.0.7", ngImport: i0, type: AutoFocusModule, declarations: [AutoFocus], imports: [CommonModule], exports: [AutoFocus] });
AutoFocusModule.ɵinj = i0.ɵɵngDeclareInjector({ minVersion: "12.0.0", version: "14.0.7", ngImport: i0, type: AutoFocusModule, imports: [CommonModule] });
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "14.0.7", ngImport: i0, type: AutoFocusModule, decorators: [{
            type: NgModule,
            args: [{
                    imports: [CommonModule],
                    exports: [AutoFocus],
                    declarations: [AutoFocus]
                }]
        }] });

/**
 * Generated bundle index. Do not edit.
 */

export { AutoFocus, AutoFocusModule };
//# sourceMappingURL=primeng-autofocus.mjs.map

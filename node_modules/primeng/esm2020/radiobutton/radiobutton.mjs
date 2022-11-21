import { NgModule, Component, Input, Output, EventEmitter, forwardRef, ViewChild, ChangeDetectionStrategy, Injectable } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NG_VALUE_ACCESSOR, NgControl } from '@angular/forms';
import * as i0 from "@angular/core";
import * as i1 from "@angular/common";
export const RADIO_VALUE_ACCESSOR = {
    provide: NG_VALUE_ACCESSOR,
    useExisting: forwardRef(() => RadioButton),
    multi: true
};
export class RadioControlRegistry {
    constructor() {
        this.accessors = [];
    }
    add(control, accessor) {
        this.accessors.push([control, accessor]);
    }
    remove(accessor) {
        this.accessors = this.accessors.filter((c) => {
            return c[1] !== accessor;
        });
    }
    select(accessor) {
        this.accessors.forEach((c) => {
            if (this.isSameGroup(c, accessor) && c[1] !== accessor) {
                c[1].writeValue(accessor.value);
            }
        });
    }
    isSameGroup(controlPair, accessor) {
        if (!controlPair[0].control) {
            return false;
        }
        return controlPair[0].control.root === accessor.control.control.root && controlPair[1].name === accessor.name;
    }
}
RadioControlRegistry.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "14.0.7", ngImport: i0, type: RadioControlRegistry, deps: [], target: i0.ɵɵFactoryTarget.Injectable });
RadioControlRegistry.ɵprov = i0.ɵɵngDeclareInjectable({ minVersion: "12.0.0", version: "14.0.7", ngImport: i0, type: RadioControlRegistry, providedIn: 'root' });
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "14.0.7", ngImport: i0, type: RadioControlRegistry, decorators: [{
            type: Injectable,
            args: [{
                    providedIn: 'root'
                }]
        }] });
export class RadioButton {
    constructor(cd, injector, registry) {
        this.cd = cd;
        this.injector = injector;
        this.registry = registry;
        this.onClick = new EventEmitter();
        this.onFocus = new EventEmitter();
        this.onBlur = new EventEmitter();
        this.onModelChange = () => { };
        this.onModelTouched = () => { };
    }
    ngOnInit() {
        this.control = this.injector.get(NgControl);
        this.checkName();
        this.registry.add(this.control, this);
    }
    handleClick(event, radioButton, focus) {
        event.preventDefault();
        if (this.disabled) {
            return;
        }
        this.select(event);
        if (focus) {
            radioButton.focus();
        }
    }
    select(event) {
        if (!this.disabled) {
            this.inputViewChild.nativeElement.checked = true;
            this.checked = true;
            this.onModelChange(this.value);
            this.registry.select(this);
            this.onClick.emit({ originalEvent: event, value: this.value });
        }
    }
    writeValue(value) {
        this.checked = value == this.value;
        if (this.inputViewChild && this.inputViewChild.nativeElement) {
            this.inputViewChild.nativeElement.checked = this.checked;
        }
        this.cd.markForCheck();
    }
    registerOnChange(fn) {
        this.onModelChange = fn;
    }
    registerOnTouched(fn) {
        this.onModelTouched = fn;
    }
    setDisabledState(val) {
        this.disabled = val;
        this.cd.markForCheck();
    }
    onInputFocus(event) {
        this.focused = true;
        this.onFocus.emit(event);
    }
    onInputBlur(event) {
        this.focused = false;
        this.onModelTouched();
        this.onBlur.emit(event);
    }
    onChange(event) {
        this.select(event);
    }
    focus() {
        this.inputViewChild.nativeElement.focus();
    }
    ngOnDestroy() {
        this.registry.remove(this);
    }
    checkName() {
        if (this.name && this.formControlName && this.name !== this.formControlName) {
            this.throwNameError();
        }
        if (!this.name && this.formControlName) {
            this.name = this.formControlName;
        }
    }
    throwNameError() {
        throw new Error(`
          If you define both a name and a formControlName attribute on your radio button, their values
          must match. Ex: <p-radioButton formControlName="food" name="food"></p-radioButton>
        `);
    }
}
RadioButton.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "14.0.7", ngImport: i0, type: RadioButton, deps: [{ token: i0.ChangeDetectorRef }, { token: i0.Injector }, { token: RadioControlRegistry }], target: i0.ɵɵFactoryTarget.Component });
RadioButton.ɵcmp = i0.ɵɵngDeclareComponent({ minVersion: "14.0.0", version: "14.0.7", type: RadioButton, selector: "p-radioButton", inputs: { value: "value", formControlName: "formControlName", name: "name", disabled: "disabled", label: "label", tabindex: "tabindex", inputId: "inputId", ariaLabelledBy: "ariaLabelledBy", ariaLabel: "ariaLabel", style: "style", styleClass: "styleClass", labelStyleClass: "labelStyleClass" }, outputs: { onClick: "onClick", onFocus: "onFocus", onBlur: "onBlur" }, host: { classAttribute: "p-element" }, providers: [RADIO_VALUE_ACCESSOR], viewQueries: [{ propertyName: "inputViewChild", first: true, predicate: ["rb"], descendants: true }], ngImport: i0, template: `
        <div [ngStyle]="style" [ngClass]="{ 'p-radiobutton p-component': true, 'p-radiobutton-checked': checked, 'p-radiobutton-disabled': disabled, 'p-radiobutton-focused': focused }" [class]="styleClass">
            <div class="p-hidden-accessible">
                <input
                    #rb
                    type="radio"
                    [attr.id]="inputId"
                    [attr.name]="name"
                    [attr.value]="value"
                    [attr.tabindex]="tabindex"
                    [attr.aria-checked]="checked"
                    [attr.aria-label]="ariaLabel"
                    [attr.aria-labelledby]="ariaLabelledBy"
                    [checked]="checked"
                    (change)="onChange($event)"
                    (focus)="onInputFocus($event)"
                    (blur)="onInputBlur($event)"
                    [disabled]="disabled"
                />
            </div>
            <div (click)="handleClick($event, rb, true)" [ngClass]="{ 'p-radiobutton-box': true, 'p-highlight': checked, 'p-disabled': disabled, 'p-focus': focused }">
                <span class="p-radiobutton-icon"></span>
            </div>
        </div>
        <label
            (click)="select($event)"
            [class]="labelStyleClass"
            [ngClass]="{ 'p-radiobutton-label': true, 'p-radiobutton-label-active': rb.checked, 'p-disabled': disabled, 'p-radiobutton-label-focus': focused }"
            *ngIf="label"
            [attr.for]="inputId"
            >{{ label }}</label
        >
    `, isInline: true, dependencies: [{ kind: "directive", type: i1.NgClass, selector: "[ngClass]", inputs: ["class", "ngClass"] }, { kind: "directive", type: i1.NgIf, selector: "[ngIf]", inputs: ["ngIf", "ngIfThen", "ngIfElse"] }, { kind: "directive", type: i1.NgStyle, selector: "[ngStyle]", inputs: ["ngStyle"] }], changeDetection: i0.ChangeDetectionStrategy.OnPush });
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "14.0.7", ngImport: i0, type: RadioButton, decorators: [{
            type: Component,
            args: [{
                    selector: 'p-radioButton',
                    template: `
        <div [ngStyle]="style" [ngClass]="{ 'p-radiobutton p-component': true, 'p-radiobutton-checked': checked, 'p-radiobutton-disabled': disabled, 'p-radiobutton-focused': focused }" [class]="styleClass">
            <div class="p-hidden-accessible">
                <input
                    #rb
                    type="radio"
                    [attr.id]="inputId"
                    [attr.name]="name"
                    [attr.value]="value"
                    [attr.tabindex]="tabindex"
                    [attr.aria-checked]="checked"
                    [attr.aria-label]="ariaLabel"
                    [attr.aria-labelledby]="ariaLabelledBy"
                    [checked]="checked"
                    (change)="onChange($event)"
                    (focus)="onInputFocus($event)"
                    (blur)="onInputBlur($event)"
                    [disabled]="disabled"
                />
            </div>
            <div (click)="handleClick($event, rb, true)" [ngClass]="{ 'p-radiobutton-box': true, 'p-highlight': checked, 'p-disabled': disabled, 'p-focus': focused }">
                <span class="p-radiobutton-icon"></span>
            </div>
        </div>
        <label
            (click)="select($event)"
            [class]="labelStyleClass"
            [ngClass]="{ 'p-radiobutton-label': true, 'p-radiobutton-label-active': rb.checked, 'p-disabled': disabled, 'p-radiobutton-label-focus': focused }"
            *ngIf="label"
            [attr.for]="inputId"
            >{{ label }}</label
        >
    `,
                    providers: [RADIO_VALUE_ACCESSOR],
                    changeDetection: ChangeDetectionStrategy.OnPush,
                    host: {
                        class: 'p-element'
                    }
                }]
        }], ctorParameters: function () { return [{ type: i0.ChangeDetectorRef }, { type: i0.Injector }, { type: RadioControlRegistry }]; }, propDecorators: { value: [{
                type: Input
            }], formControlName: [{
                type: Input
            }], name: [{
                type: Input
            }], disabled: [{
                type: Input
            }], label: [{
                type: Input
            }], tabindex: [{
                type: Input
            }], inputId: [{
                type: Input
            }], ariaLabelledBy: [{
                type: Input
            }], ariaLabel: [{
                type: Input
            }], style: [{
                type: Input
            }], styleClass: [{
                type: Input
            }], labelStyleClass: [{
                type: Input
            }], onClick: [{
                type: Output
            }], onFocus: [{
                type: Output
            }], onBlur: [{
                type: Output
            }], inputViewChild: [{
                type: ViewChild,
                args: ['rb']
            }] } });
export class RadioButtonModule {
}
RadioButtonModule.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "14.0.7", ngImport: i0, type: RadioButtonModule, deps: [], target: i0.ɵɵFactoryTarget.NgModule });
RadioButtonModule.ɵmod = i0.ɵɵngDeclareNgModule({ minVersion: "14.0.0", version: "14.0.7", ngImport: i0, type: RadioButtonModule, declarations: [RadioButton], imports: [CommonModule], exports: [RadioButton] });
RadioButtonModule.ɵinj = i0.ɵɵngDeclareInjector({ minVersion: "12.0.0", version: "14.0.7", ngImport: i0, type: RadioButtonModule, imports: [CommonModule] });
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "14.0.7", ngImport: i0, type: RadioButtonModule, decorators: [{
            type: NgModule,
            args: [{
                    imports: [CommonModule],
                    exports: [RadioButton],
                    declarations: [RadioButton]
                }]
        }] });
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicmFkaW9idXR0b24uanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi9zcmMvYXBwL2NvbXBvbmVudHMvcmFkaW9idXR0b24vcmFkaW9idXR0b24udHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUEsT0FBTyxFQUFFLFFBQVEsRUFBRSxTQUFTLEVBQUUsS0FBSyxFQUFFLE1BQU0sRUFBYyxZQUFZLEVBQUUsVUFBVSxFQUFFLFNBQVMsRUFBcUIsdUJBQXVCLEVBQUUsVUFBVSxFQUErQixNQUFNLGVBQWUsQ0FBQztBQUN6TSxPQUFPLEVBQUUsWUFBWSxFQUFFLE1BQU0saUJBQWlCLENBQUM7QUFDL0MsT0FBTyxFQUFFLGlCQUFpQixFQUF3QixTQUFTLEVBQUUsTUFBTSxnQkFBZ0IsQ0FBQzs7O0FBRXBGLE1BQU0sQ0FBQyxNQUFNLG9CQUFvQixHQUFRO0lBQ3JDLE9BQU8sRUFBRSxpQkFBaUI7SUFDMUIsV0FBVyxFQUFFLFVBQVUsQ0FBQyxHQUFHLEVBQUUsQ0FBQyxXQUFXLENBQUM7SUFDMUMsS0FBSyxFQUFFLElBQUk7Q0FDZCxDQUFDO0FBS0YsTUFBTSxPQUFPLG9CQUFvQjtJQUhqQztRQUlZLGNBQVMsR0FBVSxFQUFFLENBQUM7S0EyQmpDO0lBekJHLEdBQUcsQ0FBQyxPQUFrQixFQUFFLFFBQXFCO1FBQ3pDLElBQUksQ0FBQyxTQUFTLENBQUMsSUFBSSxDQUFDLENBQUMsT0FBTyxFQUFFLFFBQVEsQ0FBQyxDQUFDLENBQUM7SUFDN0MsQ0FBQztJQUVELE1BQU0sQ0FBQyxRQUFxQjtRQUN4QixJQUFJLENBQUMsU0FBUyxHQUFHLElBQUksQ0FBQyxTQUFTLENBQUMsTUFBTSxDQUFDLENBQUMsQ0FBQyxFQUFFLEVBQUU7WUFDekMsT0FBTyxDQUFDLENBQUMsQ0FBQyxDQUFDLEtBQUssUUFBUSxDQUFDO1FBQzdCLENBQUMsQ0FBQyxDQUFDO0lBQ1AsQ0FBQztJQUVELE1BQU0sQ0FBQyxRQUFxQjtRQUN4QixJQUFJLENBQUMsU0FBUyxD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YixLQUFLO2dCQUVHLFVBQVU7c0JBQWxCLEtBQUs7Z0JBRUcsZUFBZTtzQkFBdkIsS0FBSztnQkFFSSxPQUFPO3NCQUFoQixNQUFNO2dCQUVHLE9BQU87c0JBQWhCLE1BQU07Z0JBRUcsTUFBTTtzQkFBZixNQUFNO2dCQUVVLGNBQWM7c0JBQTlCLFNBQVM7dUJBQUMsSUFBSTs7QUFnSG5CLE1BQU0sT0FBTyxpQkFBaUI7OzhHQUFqQixpQkFBaUI7K0dBQWpCLGlCQUFpQixpQkEvSWpCLFdBQVcsYUEySVYsWUFBWSxhQTNJYixXQUFXOytHQStJWCxpQkFBaUIsWUFKaEIsWUFBWTsyRkFJYixpQkFBaUI7a0JBTDdCLFFBQVE7bUJBQUM7b0JBQ04sT0FBTyxFQUFFLENBQUMsWUFBWSxDQUFDO29CQUN2QixPQUFPLEVBQUUsQ0FBQyxXQUFXLENBQUM7b0JBQ3RCLFlBQVksRUFBRSxDQUFDLFdBQVcsQ0FBQztpQkFDOUIiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgeyBOZ01vZHVsZSwgQ29tcG9uZW50LCBJbnB1dCwgT3V0cHV0LCBFbGVtZW50UmVmLCBFdmVudEVtaXR0ZXIsIGZvcndhcmRSZWYsIFZpZXdDaGlsZCwgQ2hhbmdlRGV0ZWN0b3JSZWYsIENoYW5nZURldGVjdGlvblN0cmF0ZWd5LCBJbmplY3RhYmxlLCBJbmplY3RvciwgT25Jbml0LCBPbkRlc3Ryb3kgfSBmcm9tICdAYW5ndWxhci9jb3JlJztcbmltcG9ydCB7IENvbW1vbk1vZHVsZSB9IGZyb20gJ0Bhbmd1bGFyL2NvbW1vbic7XG5pbXBvcnQgeyBOR19WQUxVRV9BQ0NFU1NPUiwgQ29udHJvbFZhbHVlQWNjZXNzb3IsIE5nQ29udHJvbCB9IGZyb20gJ0Bhbmd1bGFyL2Zvcm1zJztcblxuZXhwb3J0IGNvbnN0IFJBRElPX1ZBTFVFX0FDQ0VTU09SOiBhbnkgPSB7XG4gICAgcHJvdmlkZTogTkdfVkFMVUVfQUNDRVNTT1IsXG4gICAgdXNlRXhpc3Rpbmc6IGZvcndhcmRSZWYoKCkgPT4gUmFkaW9CdXR0b24pLFxuICAgIG11bHRpOiB0cnVlXG59O1xuXG5ASW5qZWN0YWJsZSh7XG4gICAgcHJvdmlkZWRJbjogJ3Jvb3QnXG59KVxuZXhwb3J0IGNsYXNzIFJhZGlvQ29udHJvbFJlZ2lzdHJ5IHtcbiAgICBwcml2YXRlIGFjY2Vzc29yczogYW55W10gPSBbXTtcblxuICAgIGFkZChjb250cm9sOiBOZ0NvbnRyb2wsIGFjY2Vzc29yOiBSYWRpb0J1dHRvbikge1xuICAgICAgICB0aGlzLmFjY2Vzc29ycy5wdXNoKFtjb250cm9sLCBhY2Nlc3Nvcl0pO1xuICAgIH1cblxuICAgIHJlbW92ZShhY2Nlc3NvcjogUmFkaW9CdXR0b24pIHtcbiAgICAgICAgdGhpcy5hY2Nlc3NvcnMgPSB0aGlzLmFjY2Vzc29ycy5maWx0ZXIoKGMpID0+IHtcbiAgICAgICAgICAgIHJldHVybiBjWzFdICE9PSBhY2Nlc3NvcjtcbiAgICAgICAgfSk7XG4gICAgfVxuXG4gICAgc2VsZWN0KGFjY2Vzc29yOiBSYWRpb0J1dHRvbikge1xuICAgICAgICB0aGlzLmFjY2Vzc29ycy5mb3JFYWNoKChjKSA9PiB7XG4gICAgICAgICAgICBpZiAodGhpcy5pc1NhbWVHcm91cChjLCBhY2Nlc3NvcikgJiYgY1sxXSAhPT0gYWNjZXNzb3IpIHtcbiAgICAgICAgICAgICAgICBjWzFdLndyaXRlVmFsdWUoYWNjZXNzb3IudmFsdWUpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9KTtcbiAgICB9XG5cbiAgICBwcml2YXRlIGlzU2FtZUdyb3VwKGNvbnRyb2xQYWlyOiBbTmdDb250cm9sLCBSYWRpb0J1dHRvbl0sIGFjY2Vzc29yOiBSYWRpb0J1dHRvbik6IGJvb2xlYW4ge1xuICAgICAgICBpZiAoIWNvbnRyb2xQYWlyWzBdLmNvbnRyb2wpIHtcbiAgICAgICAgICAgIHJldHVybiBmYWxzZTtcbiAgICAgICAgfVxuXG4gICAgICAgIHJldHVybiBjb250cm9sUGFpclswXS5jb250cm9sLnJvb3QgPT09IGFjY2Vzc29yLmNvbnRyb2wuY29udHJvbC5yb290ICYmIGNvbnRyb2xQYWlyWzFdLm5hbWUgPT09IGFjY2Vzc29yLm5hbWU7XG4gICAgfVxufVxuXG5AQ29tcG9uZW50KHtcbiAgICBzZWxlY3RvcjogJ3AtcmFkaW9CdXR0b24nLFxuICAgIHRlbXBsYXRlOiBgXG4gICAgICAgIDxkaXYgW25nU3R5bGVdPVwic3R5bGVcIiBbbmdDbGFzc109XCJ7ICdwLXJhZGlvYnV0dG9uIHAtY29tcG9uZW50JzogdHJ1ZSwgJ3AtcmFkaW9idXR0b24tY2hlY2tlZCc6IGNoZWNrZWQsICdwLXJhZGlvYnV0dG9uLWRpc2FibGVkJzogZGlzYWJsZWQsICdwLXJhZGlvYnV0dG9uLWZvY3VzZWQnOiBmb2N1c2VkIH1cIiBbY2xhc3NdPVwic3R5bGVDbGFzc1wiPlxuICAgICAgICAgICAgPGRpdiBjbGFzcz1cInAtaGlkZGVuLWFjY2Vzc2libGVcIj5cbiAgICAgICAgICAgICAgICA8aW5wdXRcbiAgICAgICAgICAgICAgICAgICAgI3JiXG4gICAgICAgICAgICAgICAgICAgIHR5cGU9XCJyYWRpb1wiXG4gICAgICAgICAgICAgICAgICAgIFthdHRyLmlkXT1cImlucHV0SWRcIlxuICAgICAgICAgICAgICAgICAgICBbYXR0ci5uYW1lXT1cIm5hbWVcIlxuICAgICAgICAgICAgICAgICAgICBbYXR0ci52YWx1ZV09XCJ2YWx1ZVwiXG4gICAgICAgICAgICAgICAgICAgIFthdHRyLnRhYmluZGV4XT1cInRhYmluZGV4XCJcbiAgICAgICAgICAgICAgICAgICAgW2F0dHIuYXJpYS1jaGVja2VkXT1cImNoZWNrZWRcIlxuICAgICAgICAgICAgICAgICAgICBbYXR0ci5hcmlhLWxhYmVsXT1cImFyaWFMYWJlbFwiXG4gICAgICAgICAgICAgICAgICAgIFthdHRyLmFyaWEtbGFiZWxsZWRieV09XCJhcmlhTGFiZWxsZWRCeVwiXG4gICAgICAgICAgICAgICAgICAgIFtjaGVja2VkXT1cImNoZWNrZWRcIlxuICAgICAgICAgICAgICAgICAgICAoY2hhbmdlKT1cIm9uQ2hhbmdlKCRldmVudClcIlxuICAgICAgICAgICAgICAgICAgICAoZm9jdXMpPVwib25JbnB1dEZvY3VzKCRldmVudClcIlxuICAgICAgICAgICAgICAgICAgICAoYmx1cik9XCJvbklucHV0Qmx1cigkZXZlbnQpXCJcbiAgICAgICAgICAgICAgICAgICAgW2Rpc2FibGVkXT1cImRpc2FibGVkXCJcbiAgICAgICAgICAgICAgICAvPlxuICAgICAgICAgICAgPC9kaXY+XG4gICAgICAgICAgICA8ZGl2IChjbGljayk9XCJoYW5kbGVDbGljaygkZXZlbnQsIHJiLCB0cnVlKVwiIFtuZ0NsYXNzXT1cInsgJ3AtcmFkaW9idXR0b24tYm94JzogdHJ1ZSwgJ3AtaGlnaGxpZ2h0JzogY2hlY2tlZCwgJ3AtZGlzYWJsZWQnOiBkaXNhYmxlZCwgJ3AtZm9jdXMnOiBmb2N1c2VkIH1cIj5cbiAgICAgICAgICAgICAgICA8c3BhbiBjbGFzcz1cInAtcmFkaW9idXR0b24taWNvblwiPjwvc3Bhbj5cbiAgICAgICAgICAgIDwvZGl2PlxuICAgICAgICA8L2Rpdj5cbiAgICAgICAgPGxhYmVsXG4gICAgICAgICAgICAoY2xpY2spPVwic2VsZWN0KCRldmVudClcIlxuICAgICAgICAgICAgW2NsYXNzXT1cImxhYmVsU3R5bGVDbGFzc1wiXG4gICAgICAgICAgICBbbmdDbGFzc109XCJ7ICdwLXJhZGlvYnV0dG9uLWxhYmVsJzogdHJ1ZSwgJ3AtcmFkaW9idXR0b24tbGFiZWwtYWN0aXZlJzogcmIuY2hlY2tlZCwgJ3AtZGlzYWJsZWQnOiBkaXNhYmxlZCwgJ3AtcmFkaW9idXR0b24tbGFiZWwtZm9jdXMnOiBmb2N1c2VkIH1cIlxuICAgICAgICAgICAgKm5nSWY9XCJsYWJlbFwiXG4gICAgICAgICAgICBbYXR0ci5mb3JdPVwiaW5wdXRJZFwiXG4gICAgICAgICAgICA+e3sgbGFiZWwgfX08L2xhYmVsXG4gICAgICAgID5cbiAgICBgLFxuICAgIHByb3ZpZGVyczogW1JBRElPX1ZBTFVFX0FDQ0VTU09SXSxcbiAgICBjaGFuZ2VEZXRlY3Rpb246IENoYW5nZURldGVjdGlvblN0cmF0ZWd5Lk9uUHVzaCxcbiAgICBob3N0OiB7XG4gICAgICAgIGNsYXNzOiAncC1lbGVtZW50J1xuICAgIH1cbn0pXG5leHBvcnQgY2xhc3MgUmFkaW9CdXR0b24gaW1wbGVtZW50cyBDb250cm9sVmFsdWVBY2Nlc3NvciwgT25Jbml0LCBPbkRlc3Ryb3kge1xuICAgIEBJbnB1dCgpIHZhbHVlOiBhbnk7XG5cbiAgICBASW5wdXQoKSBmb3JtQ29udHJvbE5hbWU6IHN0cmluZztcblxuICAgIEBJbnB1dCgpIG5hbWU6IHN0cmluZztcblxuICAgIEBJbnB1dCgpIGRpc2FibGVkOiBib29sZWFuO1xuXG4gICAgQElucHV0KCkgbGFiZWw6IHN0cmluZztcblxuICAgIEBJbnB1dCgpIHRhYmluZGV4OiBudW1iZXI7XG5cbiAgICBASW5wdXQoKSBpbnB1dElkOiBzdHJpbmc7XG5cbiAgICBASW5wdXQoKSBhcmlhTGFiZWxsZWRCeTogc3RyaW5nO1xuXG4gICAgQElucHV0KCkgYXJpYUxhYmVsOiBzdHJpbmc7XG5cbiAgICBASW5wdXQoKSBzdHlsZTogYW55O1xuXG4gICAgQElucHV0KCkgc3R5bGVDbGFzczogc3RyaW5nO1xuXG4gICAgQElucHV0KCkgbGFiZWxTdHlsZUNsYXNzOiBzdHJpbmc7XG5cbiAgICBAT3V0cHV0KCkgb25DbGljazogRXZlbnRFbWl0dGVyPGFueT4gPSBuZXcgRXZlbnRFbWl0dGVyKCk7XG5cbiAgICBAT3V0cHV0KCkgb25Gb2N1czogRXZlbnRFbWl0dGVyPGFueT4gPSBuZXcgRXZlbnRFbWl0dGVyKCk7XG5cbiAgICBAT3V0cHV0KCkgb25CbHVyOiBFdmVudEVtaXR0ZXI8YW55PiA9IG5ldyBFdmVudEVtaXR0ZXIoKTtcblxuICAgIEBWaWV3Q2hpbGQoJ3JiJykgaW5wdXRWaWV3Q2hpbGQ6IEVsZW1lbnRSZWY7XG5cbiAgICBwdWJsaWMgb25Nb2RlbENoYW5nZTogRnVuY3Rpb24gPSAoKSA9PiB7fTtcblxuICAgIHB1YmxpYyBvbk1vZGVsVG91Y2hlZDogRnVuY3Rpb24gPSAoKSA9PiB7fTtcblxuICAgIHB1YmxpYyBjaGVja2VkOiBib29sZWFuO1xuXG4gICAgcHVibGljIGZvY3VzZWQ6IGJvb2xlYW47XG5cbiAgICBjb250cm9sOiBOZ0NvbnRyb2w7XG5cbiAgICBjb25zdHJ1Y3RvcihwdWJsaWMgY2Q6IENoYW5nZURldGVjdG9yUmVmLCBwcml2YXRlIGluamVjdG9yOiBJbmplY3RvciwgcHJpdmF0ZSByZWdpc3RyeTogUmFkaW9Db250cm9sUmVnaXN0cnkpIHt9XG5cbiAgICBuZ09uSW5pdCgpIHtcbiAgICAgICAgdGhpcy5jb250cm9sID0gdGhpcy5pbmplY3Rvci5nZXQoTmdDb250cm9sKTtcbiAgICAgICAgdGhpcy5jaGVja05hbWUoKTtcbiAgICAgICAgdGhpcy5yZWdpc3RyeS5hZGQodGhpcy5jb250cm9sLCB0aGlzKTtcbiAgICB9XG5cbiAgICBoYW5kbGVDbGljayhldmVudCwgcmFkaW9CdXR0b24sIGZvY3VzKSB7XG4gICAgICAgIGV2ZW50LnByZXZlbnREZWZhdWx0KCk7XG5cbiAgICAgICAgaWYgKHRoaXMuZGlzYWJsZWQpIHtcbiAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgfVxuXG4gICAgICAgIHRoaXMuc2VsZWN0KGV2ZW50KTtcblxuICAgICAgICBpZiAoZm9jdXMpIHtcbiAgICAgICAgICAgIHJhZGlvQnV0dG9uLmZvY3VzKCk7XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICBzZWxlY3QoZXZlbnQpIHtcbiAgICAgICAgaWYgKCF0aGlzLmRpc2FibGVkKSB7XG4gICAgICAgICAgICB0aGlzLmlucHV0Vmlld0NoaWxkLm5hdGl2ZUVsZW1lbnQuY2hlY2tlZCA9IHRydWU7XG4gICAgICAgICAgICB0aGlzLmNoZWNrZWQgPSB0cnVlO1xuICAgICAgICAgICAgdGhpcy5vbk1vZGVsQ2hhbmdlKHRoaXMudmFsdWUpO1xuICAgICAgICAgICAgdGhpcy5yZWdpc3RyeS5zZWxlY3QodGhpcyk7XG4gICAgICAgICAgICB0aGlzLm9uQ2xpY2suZW1pdCh7IG9yaWdpbmFsRXZlbnQ6IGV2ZW50LCB2YWx1ZTogdGhpcy52YWx1ZSB9KTtcbiAgICAgICAgfVxuICAgIH1cblxuICAgIHdyaXRlVmFsdWUodmFsdWU6IGFueSk6IHZvaWQge1xuICAgICAgICB0aGlzLmNoZWNrZWQgPSB2YWx1ZSA9PSB0aGlzLnZhbHVlO1xuXG4gICAgICAgIGlmICh0aGlzLmlucHV0Vmlld0NoaWxkICYmIHRoaXMuaW5wdXRWaWV3Q2hpbGQubmF0aXZlRWxlbWVudCkge1xuICAgICAgICAgICAgdGhpcy5pbnB1dFZpZXdDaGlsZC5uYXRpdmVFbGVtZW50LmNoZWNrZWQgPSB0aGlzLmNoZWNrZWQ7XG4gICAgICAgIH1cblxuICAgICAgICB0aGlzLmNkLm1hcmtGb3JDaGVjaygpO1xuICAgIH1cblxuICAgIHJlZ2lzdGVyT25DaGFuZ2UoZm46IEZ1bmN0aW9uKTogdm9pZCB7XG4gICAgICAgIHRoaXMub25Nb2RlbENoYW5nZSA9IGZuO1xuICAgIH1cblxuICAgIHJlZ2lzdGVyT25Ub3VjaGVkKGZuOiBGdW5jdGlvbik6IHZvaWQge1xuICAgICAgICB0aGlzLm9uTW9kZWxUb3VjaGVkID0gZm47XG4gICAgfVxuXG4gICAgc2V0RGlzYWJsZWRTdGF0ZSh2YWw6IGJvb2xlYW4pOiB2b2lkIHtcbiAgICAgICAgdGhpcy5kaXNhYmxlZCA9IHZhbDtcbiAgICAgICAgdGhpcy5jZC5tYXJrRm9yQ2hlY2soKTtcbiAgICB9XG5cbiAgICBvbklucHV0Rm9jdXMoZXZlbnQpIHtcbiAgICAgICAgdGhpcy5mb2N1c2VkID0gdHJ1ZTtcbiAgICAgICAgdGhpcy5vbkZvY3VzLmVtaXQoZXZlbnQpO1xuICAgIH1cblxuICAgIG9uSW5wdXRCbHVyKGV2ZW50KSB7XG4gICAgICAgIHRoaXMuZm9jdXNlZCA9IGZhbHNlO1xuICAgICAgICB0aGlzLm9uTW9kZWxUb3VjaGVkKCk7XG4gICAgICAgIHRoaXMub25CbHVyLmVtaXQoZXZlbnQpO1xuICAgIH1cblxuICAgIG9uQ2hhbmdlKGV2ZW50KSB7XG4gICAgICAgIHRoaXMuc2VsZWN0KGV2ZW50KTtcbiAgICB9XG5cbiAgICBmb2N1cygpIHtcbiAgICAgICAgdGhpcy5pbnB1dFZpZXdDaGlsZC5uYXRpdmVFbGVtZW50LmZvY3VzKCk7XG4gICAgfVxuXG4gICAgbmdPbkRlc3Ryb3koKSB7XG4gICAgICAgIHRoaXMucmVnaXN0cnkucmVtb3ZlKHRoaXMpO1xuICAgIH1cblxuICAgIHByaXZhdGUgY2hlY2tOYW1lKCkge1xuICAgICAgICBpZiAodGhpcy5uYW1lICYmIHRoaXMuZm9ybUNvbnRyb2xOYW1lICYmIHRoaXMubmFtZSAhPT0gdGhpcy5mb3JtQ29udHJvbE5hbWUpIHtcbiAgICAgICAgICAgIHRoaXMudGhyb3dOYW1lRXJyb3IoKTtcbiAgICAgICAgfVxuICAgICAgICBpZiAoIXRoaXMubmFtZSAmJiB0aGlzLmZvcm1Db250cm9sTmFtZSkge1xuICAgICAgICAgICAgdGhpcy5uYW1lID0gdGhpcy5mb3JtQ29udHJvbE5hbWU7XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICBwcml2YXRlIHRocm93TmFtZUVycm9yKCkge1xuICAgICAgICB0aHJvdyBuZXcgRXJyb3IoYFxuICAgICAgICAgIElmIHlvdSBkZWZpbmUgYm90aCBhIG5hbWUgYW5kIGEgZm9ybUNvbnRyb2xOYW1lIGF0dHJpYnV0ZSBvbiB5b3VyIHJhZGlvIGJ1dHRvbiwgdGhlaXIgdmFsdWVzXG4gICAgICAgICAgbXVzdCBtYXRjaC4gRXg6IDxwLXJhZGlvQnV0dG9uIGZvcm1Db250cm9sTmFtZT1cImZvb2RcIiBuYW1lPVwiZm9vZFwiPjwvcC1yYWRpb0J1dHRvbj5cbiAgICAgICAgYCk7XG4gICAgfVxufVxuXG5ATmdNb2R1bGUoe1xuICAgIGltcG9ydHM6IFtDb21tb25Nb2R1bGVdLFxuICAgIGV4cG9ydHM6IFtSYWRpb0J1dHRvbl0sXG4gICAgZGVjbGFyYXRpb25zOiBbUmFkaW9CdXR0b25dXG59KVxuZXhwb3J0IGNsYXNzIFJhZGlvQnV0dG9uTW9kdWxlIHt9XG4iXX0=
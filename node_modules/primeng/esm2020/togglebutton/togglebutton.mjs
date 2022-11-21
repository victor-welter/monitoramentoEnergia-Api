import { NgModule, Component, Input, Output, EventEmitter, forwardRef, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RippleModule } from 'primeng/ripple';
import { NG_VALUE_ACCESSOR } from '@angular/forms';
import * as i0 from "@angular/core";
import * as i1 from "@angular/common";
import * as i2 from "primeng/ripple";
export const TOGGLEBUTTON_VALUE_ACCESSOR = {
    provide: NG_VALUE_ACCESSOR,
    useExisting: forwardRef(() => ToggleButton),
    multi: true
};
export class ToggleButton {
    constructor(cd) {
        this.cd = cd;
        this.iconPos = 'left';
        this.onChange = new EventEmitter();
        this.checked = false;
        this.onModelChange = () => { };
        this.onModelTouched = () => { };
    }
    toggle(event) {
        if (!this.disabled) {
            this.checked = !this.checked;
            this.onModelChange(this.checked);
            this.onModelTouched();
            this.onChange.emit({
                originalEvent: event,
                checked: this.checked
            });
            this.cd.markForCheck();
        }
    }
    onBlur() {
        this.onModelTouched();
    }
    writeValue(value) {
        this.checked = value;
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
    get hasOnLabel() {
        return this.onLabel && this.onLabel.length > 0;
    }
    get hasOffLabel() {
        return this.onLabel && this.onLabel.length > 0;
    }
}
ToggleButton.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "14.0.7", ngImport: i0, type: ToggleButton, deps: [{ token: i0.ChangeDetectorRef }], target: i0.ɵɵFactoryTarget.Component });
ToggleButton.ɵcmp = i0.ɵɵngDeclareComponent({ minVersion: "14.0.0", version: "14.0.7", type: ToggleButton, selector: "p-toggleButton", inputs: { onLabel: "onLabel", offLabel: "offLabel", onIcon: "onIcon", offIcon: "offIcon", ariaLabelledBy: "ariaLabelledBy", disabled: "disabled", style: "style", styleClass: "styleClass", inputId: "inputId", tabindex: "tabindex", iconPos: "iconPos" }, outputs: { onChange: "onChange" }, host: { classAttribute: "p-element" }, providers: [TOGGLEBUTTON_VALUE_ACCESSOR], ngImport: i0, template: `
        <div
            [ngClass]="{ 'p-button p-togglebutton p-component': true, 'p-button-icon-only': onIcon && offIcon && !hasOnLabel && !hasOffLabel, 'p-highlight': checked, 'p-disabled': disabled }"
            [ngStyle]="style"
            [class]="styleClass"
            (click)="toggle($event)"
            (keydown.enter)="toggle($event)"
            [attr.tabindex]="disabled ? null : '0'"
            role="checkbox"
            [attr.aria-checked]="checked"
            pRipple
        >
            <span *ngIf="onIcon || offIcon" [class]="checked ? this.onIcon : this.offIcon" [ngClass]="{ 'p-button-icon': true, 'p-button-icon-left': iconPos === 'left', 'p-button-icon-right': iconPos === 'right' }"></span>
            <span class="p-button-label">{{ checked ? (hasOnLabel ? onLabel : '') : hasOffLabel ? offLabel : '' }}</span>
        </div>
    `, isInline: true, styles: [".p-button{margin:0;display:inline-flex;cursor:pointer;-webkit-user-select:none;user-select:none;align-items:center;vertical-align:bottom;text-align:center;overflow:hidden;position:relative}.p-button-label{flex:1 1 auto}.p-button-icon-right{order:1}.p-button:disabled{cursor:default}.p-button-icon-only{justify-content:center}.p-button-icon-only:after{content:\"p\";visibility:hidden;clip:rect(0 0 0 0);width:0}.p-button-vertical{flex-direction:column}.p-button-icon-bottom{order:2}.p-buttonset .p-button{margin:0}.p-buttonset .p-button:not(:last-child){border-right:0 none}.p-buttonset .p-button:not(:first-of-type):not(:last-of-type){border-radius:0}.p-buttonset .p-button:first-of-type{border-top-right-radius:0;border-bottom-right-radius:0}.p-buttonset .p-button:last-of-type{border-top-left-radius:0;border-bottom-left-radius:0}.p-buttonset .p-button:focus{position:relative;z-index:1}\n"], dependencies: [{ kind: "directive", type: i1.NgClass, selector: "[ngClass]", inputs: ["class", "ngClass"] }, { kind: "directive", type: i1.NgIf, selector: "[ngIf]", inputs: ["ngIf", "ngIfThen", "ngIfElse"] }, { kind: "directive", type: i1.NgStyle, selector: "[ngStyle]", inputs: ["ngStyle"] }, { kind: "directive", type: i2.Ripple, selector: "[pRipple]" }], changeDetection: i0.ChangeDetectionStrategy.OnPush });
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "14.0.7", ngImport: i0, type: ToggleButton, decorators: [{
            type: Component,
            args: [{ selector: 'p-toggleButton', template: `
        <div
            [ngClass]="{ 'p-button p-togglebutton p-component': true, 'p-button-icon-only': onIcon && offIcon && !hasOnLabel && !hasOffLabel, 'p-highlight': checked, 'p-disabled': disabled }"
            [ngStyle]="style"
            [class]="styleClass"
            (click)="toggle($event)"
            (keydown.enter)="toggle($event)"
            [attr.tabindex]="disabled ? null : '0'"
            role="checkbox"
            [attr.aria-checked]="checked"
            pRipple
        >
            <span *ngIf="onIcon || offIcon" [class]="checked ? this.onIcon : this.offIcon" [ngClass]="{ 'p-button-icon': true, 'p-button-icon-left': iconPos === 'left', 'p-button-icon-right': iconPos === 'right' }"></span>
            <span class="p-button-label">{{ checked ? (hasOnLabel ? onLabel : '') : hasOffLabel ? offLabel : '' }}</span>
        </div>
    `, providers: [TOGGLEBUTTON_VALUE_ACCESSOR], changeDetection: ChangeDetectionStrategy.OnPush, host: {
                        class: 'p-element'
                    }, styles: [".p-button{margin:0;display:inline-flex;cursor:pointer;-webkit-user-select:none;user-select:none;align-items:center;vertical-align:bottom;text-align:center;overflow:hidden;position:relative}.p-button-label{flex:1 1 auto}.p-button-icon-right{order:1}.p-button:disabled{cursor:default}.p-button-icon-only{justify-content:center}.p-button-icon-only:after{content:\"p\";visibility:hidden;clip:rect(0 0 0 0);width:0}.p-button-vertical{flex-direction:column}.p-button-icon-bottom{order:2}.p-buttonset .p-button{margin:0}.p-buttonset .p-button:not(:last-child){border-right:0 none}.p-buttonset .p-button:not(:first-of-type):not(:last-of-type){border-radius:0}.p-buttonset .p-button:first-of-type{border-top-right-radius:0;border-bottom-right-radius:0}.p-buttonset .p-button:last-of-type{border-top-left-radius:0;border-bottom-left-radius:0}.p-buttonset .p-button:focus{position:relative;z-index:1}\n"] }]
        }], ctorParameters: function () { return [{ type: i0.ChangeDetectorRef }]; }, propDecorators: { onLabel: [{
                type: Input
            }], offLabel: [{
                type: Input
            }], onIcon: [{
                type: Input
            }], offIcon: [{
                type: Input
            }], ariaLabelledBy: [{
                type: Input
            }], disabled: [{
                type: Input
            }], style: [{
                type: Input
            }], styleClass: [{
                type: Input
            }], inputId: [{
                type: Input
            }], tabindex: [{
                type: Input
            }], iconPos: [{
                type: Input
            }], onChange: [{
                type: Output
            }] } });
export class ToggleButtonModule {
}
ToggleButtonModule.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "14.0.7", ngImport: i0, type: ToggleButtonModule, deps: [], target: i0.ɵɵFactoryTarget.NgModule });
ToggleButtonModule.ɵmod = i0.ɵɵngDeclareNgModule({ minVersion: "14.0.0", version: "14.0.7", ngImport: i0, type: ToggleButtonModule, declarations: [ToggleButton], imports: [CommonModule, RippleModule], exports: [ToggleButton] });
ToggleButtonModule.ɵinj = i0.ɵɵngDeclareInjector({ minVersion: "12.0.0", version: "14.0.7", ngImport: i0, type: ToggleButtonModule, imports: [CommonModule, RippleModule] });
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "14.0.7", ngImport: i0, type: ToggleButtonModule, decorators: [{
            type: NgModule,
            args: [{
                    imports: [CommonModule, RippleModule],
                    exports: [ToggleButton],
                    declarations: [ToggleButton]
                }]
        }] });
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoidG9nZ2xlYnV0dG9uLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vc3JjL2FwcC9jb21wb25lbnRzL3RvZ2dsZWJ1dHRvbi90b2dnbGVidXR0b24udHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUEsT0FBTyxFQUFFLFFBQVEsRUFBRSxTQUFTLEVBQUUsS0FBSyxFQUFFLE1BQU0sRUFBRSxZQUFZLEVBQUUsVUFBVSxFQUFFLHVCQUF1QixFQUFxQixNQUFNLGVBQWUsQ0FBQztBQUN6SSxPQUFPLEVBQUUsWUFBWSxFQUFFLE1BQU0saUJBQWlCLENBQUM7QUFDL0MsT0FBTyxFQUFFLFlBQVksRUFBRSxNQUFNLGdCQUFnQixDQUFDO0FBQzlDLE9BQU8sRUFBRSxpQkFBaUIsRUFBd0IsTUFBTSxnQkFBZ0IsQ0FBQzs7OztBQUl6RSxNQUFNLENBQUMsTUFBTSwyQkFBMkIsR0FBUTtJQUM1QyxPQUFPLEVBQUUsaUJBQWlCO0lBQzFCLFdBQVcsRUFBRSxVQUFVLENBQUMsR0FBRyxFQUFFLENBQUMsWUFBWSxDQUFDO0lBQzNDLEtBQUssRUFBRSxJQUFJO0NBQ2QsQ0FBQztBQTJCRixNQUFNLE9BQU8sWUFBWTtJQStCckIsWUFBbUIsRUFBcUI7UUFBckIsT0FBRSxHQUFGLEVBQUUsQ0FBbUI7UUFWL0IsWUFBTyxHQUFXLE1BQU0sQ0FBQztRQUV4QixhQUFRLEdBQXNCLElBQUksWUFBWSxFQUFFLENBQUM7UUFFM0QsWUFBTyxHQUFZLEtBQUssQ0FBQztRQUV6QixrQkFBYSxHQUFhLEdBQUcsRUFBRSxHQUFFLENBQUMsQ0FBQztRQUVuQyxtQkFBYyxHQUFhLEdBQUcsRUFBRSxHQUFFLENBQUMsQ0FBQztJQUVPLENBQUM7SUFFNUMsTUFBTSxDQUFDLEtBQVk7UUFDZixJQUFJLENBQUMsSUFBSSxDQUFDLFFBQVEsRUFBRTtZQUNoQixJQUFJLENBQUMsT0FBTyxHQUFHLENBQUMsSUFBSSxDQUFDLE9BQU8sQ0FBQztZQUM3QixJQUFJLENBQUMsYUFBYSxDQUFDLElBQUksQ0FBQyxPQUFPLENBQUMsQ0FBQztZQUNqQyxJQUFJLENBQUMsY0FBYyxFQUFFLENBQUM7WUFDdEIsSUFBSSxDQUFDLFFBQVEsQ0FBQyxJQUFJLENBQUM7Z0JBQ2YsYUFBYSxFQUFFLEtBQUs7Z0JBQ3BCLE9BQU8sRUFBRSxJQUFJLENBQUMsT0FBTzthQUN4QixDQUFDLENBQUM7WUFFSCxJQUFJLENBQUMsRUFBRSxDQUFDLFlBQVksRUFBRSxDQUFDO1NBQzFCO0lBQ0wsQ0FBQztJQUVELE1BQU07UUFDRixJQUFJLENBQUMsY0FBYyxFQUFFLENBQUM7SUFDMUIsQ0FBQztJQUVELFVBQVUsQ0FBQyxLQUFVO1FBQ2pCLElBQUksQ0FBQyxPQUFPLEdBQUcsS0FBSyxDQUFDO1FBQ3JCLElBQUksQ0FBQyxFQUFFLENBQUMsWUFBWSxFQUFFLENBQUM7SUFDM0IsQ0FBQztJQUVELGdCQUFnQixDQUFDLEVBQVk7UUFDekIsSUFBSSxDQUFDLGFBQWEsR0FBRyxFQUFFLENBQUM7SUFDNUIsQ0FBQztJQUVELGlCQUFpQixDQUFDLEVBQVk7UUFDMUIsSUFBSSxDQUFDLGNBQWMsR0FBRyxFQUFFLENBQUM7SUFDN0IsQ0FBQztJQUVELGdCQUFnQixDQUFDLEdBQVk7UUFDekIsSUFBSSxDQUFDLFFBQVEsR0FBRyxHQUFHLENBQUM7UUFDcEIsSUFBSSxDQUFDLEVBQUUsQ0FBQyxZQUFZLEVBQUUsQ0FBQztJQUMzQixDQUFDO0lBRUQsSUFBSSxVQUFVO1FBQ1YsT0FBTyxJQUFJLENBQUMsT0FBTyxJQUFJLElBQUksQ0FBQyxPQUFPLENBQUMsTUFBTSxHQUFHLENBQUMsQ0FBQztJQUNuRCxDQUFDO0lBRUQsSUFBSSxXQUFXO1FBQ1gsT0FBTyxJQUFJLENBQUMsT0FBTyxJQUFJLElBQUksQ0FBQyxPQUFPLENBQUMsTUFBTSxHQUFHLENBQUMsQ0FBQztJQUNuRCxDQUFDOzt5R0EzRVEsWUFBWTs2RkFBWixZQUFZLCtXQVBWLENBQUMsMkJBQTJCLENBQUMsMEJBaEI5Qjs7Ozs7Ozs7Ozs7Ozs7O0tBZVQ7MkZBUVEsWUFBWTtrQkF6QnhCLFNBQVM7K0JBQ0ksZ0JBQWdCLFlBQ2hCOzs7Ozs7Ozs7Ozs7Ozs7S0FlVCxhQUNVLENBQUMsMkJBQTJCLENBQUMsbUJBQ3ZCLHVCQUF1QixDQUFDLE1BQU0sUUFFekM7d0JBQ0YsS0FBSyxFQUFFLFdBQVc7cUJBQ3JCO3dHQUdRLE9BQU87c0JBQWYsS0FBSztnQkFFRyxRQUFRO3NCQUFoQixLQUFLO2dCQUVHLE1BQU07c0JBQWQsS0FBSztnQkFFRyxPQUFPO3NCQUFmLEtBQUs7Z0JBRUcsY0FBYztzQkFBdEIsS0FBSztnQkFFRyxRQUFRO3NCQUFoQixLQUFLO2dCQUVHLEtBQUs7c0JBQWIsS0FBSztnQkFFRyxVQUFVO3NCQUFsQixLQUFLO2dCQUVHLE9BQU87c0JBQWYsS0FBSztnQkFFRyxRQUFRO3NCQUFoQixLQUFLO2dCQUVHLE9BQU87c0JBQWYsS0FBSztnQkFFSSxRQUFRO3NCQUFqQixNQUFNOztBQTREWCxNQUFNLE9BQU8sa0JBQWtCOzsrR0FBbEIsa0JBQWtCO2dIQUFsQixrQkFBa0IsaUJBbkZsQixZQUFZLGFBK0VYLFlBQVksRUFBRSxZQUFZLGFBL0UzQixZQUFZO2dIQW1GWixrQkFBa0IsWUFKakIsWUFBWSxFQUFFLFlBQVk7MkZBSTNCLGtCQUFrQjtrQkFMOUIsUUFBUTttQkFBQztvQkFDTixPQUFPLEVBQUUsQ0FBQyxZQUFZLEVBQUUsWUFBWSxDQUFDO29CQUNyQyxPQUFPLEVBQUUsQ0FBQyxZQUFZLENBQUM7b0JBQ3ZCLFlBQVksRUFBRSxDQUFDLFlBQVksQ0FBQztpQkFDL0IiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgeyBOZ01vZHVsZSwgQ29tcG9uZW50LCBJbnB1dCwgT3V0cHV0LCBFdmVudEVtaXR0ZXIsIGZvcndhcmRSZWYsIENoYW5nZURldGVjdGlvblN0cmF0ZWd5LCBDaGFuZ2VEZXRlY3RvclJlZiB9IGZyb20gJ0Bhbmd1bGFyL2NvcmUnO1xuaW1wb3J0IHsgQ29tbW9uTW9kdWxlIH0gZnJvbSAnQGFuZ3VsYXIvY29tbW9uJztcbmltcG9ydCB7IFJpcHBsZU1vZHVsZSB9IGZyb20gJ3ByaW1lbmcvcmlwcGxlJztcbmltcG9ydCB7IE5HX1ZBTFVFX0FDQ0VTU09SLCBDb250cm9sVmFsdWVBY2Nlc3NvciB9IGZyb20gJ0Bhbmd1bGFyL2Zvcm1zJztcblxudHlwZSBUb2dnbGVCdXR0b25JY29uUG9zaXRpb24gPSAnbGVmdCcgfCAncmlnaHQnO1xuXG5leHBvcnQgY29uc3QgVE9HR0xFQlVUVE9OX1ZBTFVFX0FDQ0VTU09SOiBhbnkgPSB7XG4gICAgcHJvdmlkZTogTkdfVkFMVUVfQUNDRVNTT1IsXG4gICAgdXNlRXhpc3Rpbmc6IGZvcndhcmRSZWYoKCkgPT4gVG9nZ2xlQnV0dG9uKSxcbiAgICBtdWx0aTogdHJ1ZVxufTtcblxuQENvbXBvbmVudCh7XG4gICAgc2VsZWN0b3I6ICdwLXRvZ2dsZUJ1dHRvbicsXG4gICAgdGVtcGxhdGU6IGBcbiAgICAgICAgPGRpdlxuICAgICAgICAgICAgW25nQ2xhc3NdPVwieyAncC1idXR0b24gcC10b2dnbGVidXR0b24gcC1jb21wb25lbnQnOiB0cnVlLCAncC1idXR0b24taWNvbi1vbmx5Jzogb25JY29uICYmIG9mZkljb24gJiYgIWhhc09uTGFiZWwgJiYgIWhhc09mZkxhYmVsLCAncC1oaWdobGlnaHQnOiBjaGVja2VkLCAncC1kaXNhYmxlZCc6IGRpc2FibGVkIH1cIlxuICAgICAgICAgICAgW25nU3R5bGVdPVwic3R5bGVcIlxuICAgICAgICAgICAgW2NsYXNzXT1cInN0eWxlQ2xhc3NcIlxuICAgICAgICAgICAgKGNsaWNrKT1cInRvZ2dsZSgkZXZlbnQpXCJcbiAgICAgICAgICAgIChrZXlkb3duLmVudGVyKT1cInRvZ2dsZSgkZXZlbnQpXCJcbiAgICAgICAgICAgIFthdHRyLnRhYmluZGV4XT1cImRpc2FibGVkID8gbnVsbCA6ICcwJ1wiXG4gICAgICAgICAgICByb2xlPVwiY2hlY2tib3hcIlxuICAgICAgICAgICAgW2F0dHIuYXJpYS1jaGVja2VkXT1cImNoZWNrZWRcIlxuICAgICAgICAgICAgcFJpcHBsZVxuICAgICAgICA+XG4gICAgICAgICAgICA8c3BhbiAqbmdJZj1cIm9uSWNvbiB8fCBvZmZJY29uXCIgW2NsYXNzXT1cImNoZWNrZWQgPyB0aGlzLm9uSWNvbiA6IHRoaXMub2ZmSWNvblwiIFtuZ0NsYXNzXT1cInsgJ3AtYnV0dG9uLWljb24nOiB0cnVlLCAncC1idXR0b24taWNvbi1sZWZ0JzogaWNvblBvcyA9PT0gJ2xlZnQnLCAncC1idXR0b24taWNvbi1yaWdodCc6IGljb25Qb3MgPT09ICdyaWdodCcgfVwiPjwvc3Bhbj5cbiAgICAgICAgICAgIDxzcGFuIGNsYXNzPVwicC1idXR0b24tbGFiZWxcIj57eyBjaGVja2VkID8gKGhhc09uTGFiZWwgPyBvbkxhYmVsIDogJycpIDogaGFzT2ZmTGFiZWwgPyBvZmZMYWJlbCA6ICcnIH19PC9zcGFuPlxuICAgICAgICA8L2Rpdj5cbiAgICBgLFxuICAgIHByb3ZpZGVyczogW1RPR0dMRUJVVFRPTl9WQUxVRV9BQ0NFU1NPUl0sXG4gICAgY2hhbmdlRGV0ZWN0aW9uOiBDaGFuZ2VEZXRlY3Rpb25TdHJhdGVneS5PblB1c2gsXG4gICAgc3R5bGVVcmxzOiBbJy4uL2J1dHRvbi9idXR0b24uY3NzJ10sXG4gICAgaG9zdDoge1xuICAgICAgICBjbGFzczogJ3AtZWxlbWVudCdcbiAgICB9XG59KVxuZXhwb3J0IGNsYXNzIFRvZ2dsZUJ1dHRvbiBpbXBsZW1lbnRzIENvbnRyb2xWYWx1ZUFjY2Vzc29yIHtcbiAgICBASW5wdXQoKSBvbkxhYmVsOiBzdHJpbmc7XG5cbiAgICBASW5wdXQoKSBvZmZMYWJlbDogc3RyaW5nO1xuXG4gICAgQElucHV0KCkgb25JY29uOiBzdHJpbmc7XG5cbiAgICBASW5wdXQoKSBvZmZJY29uOiBzdHJpbmc7XG5cbiAgICBASW5wdXQoKSBhcmlhTGFiZWxsZWRCeTogc3RyaW5nO1xuXG4gICAgQElucHV0KCkgZGlzYWJsZWQ6IGJvb2xlYW47XG5cbiAgICBASW5wdXQoKSBzdHlsZTogYW55O1xuXG4gICAgQElucHV0KCkgc3R5bGVDbGFzczogc3RyaW5nO1xuXG4gICAgQElucHV0KCkgaW5wdXRJZDogc3RyaW5nO1xuXG4gICAgQElucHV0KCkgdGFiaW5kZXg6IG51bWJlcjtcblxuICAgIEBJbnB1dCgpIGljb25Qb3M6IHN0cmluZyA9ICdsZWZ0JztcblxuICAgIEBPdXRwdXQoKSBvbkNoYW5nZTogRXZlbnRFbWl0dGVyPGFueT4gPSBuZXcgRXZlbnRFbWl0dGVyKCk7XG5cbiAgICBjaGVja2VkOiBib29sZWFuID0gZmFsc2U7XG5cbiAgICBvbk1vZGVsQ2hhbmdlOiBGdW5jdGlvbiA9ICgpID0+IHt9O1xuXG4gICAgb25Nb2RlbFRvdWNoZWQ6IEZ1bmN0aW9uID0gKCkgPT4ge307XG5cbiAgICBjb25zdHJ1Y3RvcihwdWJsaWMgY2Q6IENoYW5nZURldGVjdG9yUmVmKSB7fVxuXG4gICAgdG9nZ2xlKGV2ZW50OiBFdmVudCkge1xuICAgICAgICBpZiAoIXRoaXMuZGlzYWJsZWQpIHtcbiAgICAgICAgICAgIHRoaXMuY2hlY2tlZCA9ICF0aGlzLmNoZWNrZWQ7XG4gICAgICAgICAgICB0aGlzLm9uTW9kZWxDaGFuZ2UodGhpcy5jaGVja2VkKTtcbiAgICAgICAgICAgIHRoaXMub25Nb2RlbFRvdWNoZWQoKTtcbiAgICAgICAgICAgIHRoaXMub25DaGFuZ2UuZW1pdCh7XG4gICAgICAgICAgICAgICAgb3JpZ2luYWxFdmVudDogZXZlbnQsXG4gICAgICAgICAgICAgICAgY2hlY2tlZDogdGhpcy5jaGVja2VkXG4gICAgICAgICAgICB9KTtcblxuICAgICAgICAgICAgdGhpcy5jZC5tYXJrRm9yQ2hlY2soKTtcbiAgICAgICAgfVxuICAgIH1cblxuICAgIG9uQmx1cigpIHtcbiAgICAgICAgdGhpcy5vbk1vZGVsVG91Y2hlZCgpO1xuICAgIH1cblxuICAgIHdyaXRlVmFsdWUodmFsdWU6IGFueSk6IHZvaWQge1xuICAgICAgICB0aGlzLmNoZWNrZWQgPSB2YWx1ZTtcbiAgICAgICAgdGhpcy5jZC5tYXJrRm9yQ2hlY2soKTtcbiAgICB9XG5cbiAgICByZWdpc3Rlck9uQ2hhbmdlKGZuOiBGdW5jdGlvbik6IHZvaWQge1xuICAgICAgICB0aGlzLm9uTW9kZWxDaGFuZ2UgPSBmbjtcbiAgICB9XG5cbiAgICByZWdpc3Rlck9uVG91Y2hlZChmbjogRnVuY3Rpb24pOiB2b2lkIHtcbiAgICAgICAgdGhpcy5vbk1vZGVsVG91Y2hlZCA9IGZuO1xuICAgIH1cblxuICAgIHNldERpc2FibGVkU3RhdGUodmFsOiBib29sZWFuKTogdm9pZCB7XG4gICAgICAgIHRoaXMuZGlzYWJsZWQgPSB2YWw7XG4gICAgICAgIHRoaXMuY2QubWFya0ZvckNoZWNrKCk7XG4gICAgfVxuXG4gICAgZ2V0IGhhc09uTGFiZWwoKTogYm9vbGVhbiB7XG4gICAgICAgIHJldHVybiB0aGlzLm9uTGFiZWwgJiYgdGhpcy5vbkxhYmVsLmxlbmd0aCA+IDA7XG4gICAgfVxuXG4gICAgZ2V0IGhhc09mZkxhYmVsKCk6IGJvb2xlYW4ge1xuICAgICAgICByZXR1cm4gdGhpcy5vbkxhYmVsICYmIHRoaXMub25MYWJlbC5sZW5ndGggPiAwO1xuICAgIH1cbn1cblxuQE5nTW9kdWxlKHtcbiAgICBpbXBvcnRzOiBbQ29tbW9uTW9kdWxlLCBSaXBwbGVNb2R1bGVdLFxuICAgIGV4cG9ydHM6IFtUb2dnbGVCdXR0b25dLFxuICAgIGRlY2xhcmF0aW9uczogW1RvZ2dsZUJ1dHRvbl1cbn0pXG5leHBvcnQgY2xhc3MgVG9nZ2xlQnV0dG9uTW9kdWxlIHt9XG4iXX0=
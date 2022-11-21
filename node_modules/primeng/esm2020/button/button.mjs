import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, ContentChildren, Directive, EventEmitter, Input, NgModule, Output, ViewEncapsulation } from '@angular/core';
import { PrimeTemplate } from 'primeng/api';
import { DomHandler } from 'primeng/dom';
import { RippleModule } from 'primeng/ripple';
import { ObjectUtils } from 'primeng/utils';
import * as i0 from "@angular/core";
import * as i1 from "@angular/common";
import * as i2 from "primeng/ripple";
export class ButtonDirective {
    constructor(el) {
        this.el = el;
        this.iconPos = 'left';
        this.loadingIcon = 'pi pi-spinner pi-spin';
        this._loading = false;
    }
    ngAfterViewInit() {
        this._initialStyleClass = this.el.nativeElement.className;
        DomHandler.addMultipleClasses(this.el.nativeElement, this.getStyleClass());
        if (this.icon || this.loading) {
            this.createIconEl();
        }
        if (this.label) {
            let labelElement = document.createElement('span');
            if (this.icon && !this.label) {
                labelElement.setAttribute('aria-hidden', 'true');
            }
            labelElement.className = 'p-button-label';
            labelElement.appendChild(document.createTextNode(this.label));
            this.el.nativeElement.appendChild(labelElement);
        }
        this.initialized = true;
    }
    getStyleClass() {
        let styleClass = 'p-button p-component';
        if (this.icon && !this.label && ObjectUtils.isEmpty(this.el.nativeElement.textContent)) {
            styleClass = styleClass + ' p-button-icon-only';
        }
        if (this.loading) {
            styleClass = styleClass + ' p-disabled p-button-loading';
            if (!this.icon && this.label)
                styleClass = styleClass + ' p-button-loading-label-only';
        }
        return styleClass;
    }
    setStyleClass() {
        let styleClass = this.getStyleClass();
        this.el.nativeElement.className = styleClass + ' ' + this._initialStyleClass;
    }
    createIconEl() {
        let iconElement = document.createElement('span');
        iconElement.className = 'p-button-icon';
        iconElement.setAttribute('aria-hidden', 'true');
        let iconPosClass = this.label ? 'p-button-icon-' + this.iconPos : null;
        if (iconPosClass) {
            DomHandler.addClass(iconElement, iconPosClass);
        }
        let iconClass = this.getIconClass();
        if (iconClass) {
            DomHandler.addMultipleClasses(iconElement, iconClass);
        }
        this.el.nativeElement.insertBefore(iconElement, this.el.nativeElement.firstChild);
    }
    getIconClass() {
        return this.loading ? 'p-button-loading-icon ' + this.loadingIcon : this._icon;
    }
    setIconClass() {
        let iconElement = DomHandler.findSingle(this.el.nativeElement, '.p-button-icon');
        if (iconElement) {
            if (this.iconPos)
                iconElement.className = 'p-button-icon p-button-icon-' + this.iconPos + ' ' + this.getIconClass();
            else
                iconElement.className = 'p-button-icon ' + this.getIconClass();
        }
        else {
            this.createIconEl();
        }
    }
    removeIconElement() {
        let iconElement = DomHandler.findSingle(this.el.nativeElement, '.p-button-icon');
        this.el.nativeElement.removeChild(iconElement);
    }
    get label() {
        return this._label;
    }
    set label(val) {
        this._label = val;
        if (this.initialized) {
            DomHandler.findSingle(this.el.nativeElement, '.p-button-label').textContent = this._label;
            if (this.loading || this.icon) {
                this.setIconClass();
            }
            this.setStyleClass();
        }
    }
    get icon() {
        return this._icon;
    }
    set icon(val) {
        this._icon = val;
        if (this.initialized) {
            this.setIconClass();
            this.setStyleClass();
        }
    }
    get loading() {
        return this._loading;
    }
    set loading(val) {
        this._loading = val;
        if (this.initialized) {
            if (this.loading || this.icon)
                this.setIconClass();
            else
                this.removeIconElement();
            this.setStyleClass();
        }
    }
    ngOnDestroy() {
        this.initialized = false;
    }
}
ButtonDirective.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "14.0.7", ngImport: i0, type: ButtonDirective, deps: [{ token: i0.ElementRef }], target: i0.ɵɵFactoryTarget.Directive });
ButtonDirective.ɵdir = i0.ɵɵngDeclareDirective({ minVersion: "14.0.0", version: "14.0.7", type: ButtonDirective, selector: "[pButton]", inputs: { iconPos: "iconPos", loadingIcon: "loadingIcon", label: "label", icon: "icon", loading: "loading" }, host: { classAttribute: "p-element" }, ngImport: i0 });
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "14.0.7", ngImport: i0, type: ButtonDirective, decorators: [{
            type: Directive,
            args: [{
                    selector: '[pButton]',
                    host: {
                        class: 'p-element'
                    }
                }]
        }], ctorParameters: function () { return [{ type: i0.ElementRef }]; }, propDecorators: { iconPos: [{
                type: Input
            }], loadingIcon: [{
                type: Input
            }], label: [{
                type: Input
            }], icon: [{
                type: Input
            }], loading: [{
                type: Input
            }] } });
export class Button {
    constructor() {
        this.type = 'button';
        this.iconPos = 'left';
        this.loading = false;
        this.loadingIcon = 'pi pi-spinner pi-spin';
        this.onClick = new EventEmitter();
        this.onFocus = new EventEmitter();
        this.onBlur = new EventEmitter();
    }
    ngAfterContentInit() {
        this.templates.forEach((item) => {
            switch (item.getType()) {
                case 'content':
                    this.contentTemplate = item.template;
                    break;
                default:
                    this.contentTemplate = item.template;
                    break;
            }
        });
    }
    badgeStyleClass() {
        return {
            'p-badge p-component': true,
            'p-badge-no-gutter': this.badge && String(this.badge).length === 1
        };
    }
}
Button.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "14.0.7", ngImport: i0, type: Button, deps: [], target: i0.ɵɵFactoryTarget.Component });
Button.ɵcmp = i0.ɵɵngDeclareComponent({ minVersion: "14.0.0", version: "14.0.7", type: Button, selector: "p-button", inputs: { type: "type", iconPos: "iconPos", icon: "icon", badge: "badge", label: "label", disabled: "disabled", loading: "loading", loadingIcon: "loadingIcon", style: "style", styleClass: "styleClass", badgeClass: "badgeClass", ariaLabel: "ariaLabel" }, outputs: { onClick: "onClick", onFocus: "onFocus", onBlur: "onBlur" }, host: { classAttribute: "p-element" }, queries: [{ propertyName: "templates", predicate: PrimeTemplate }], ngImport: i0, template: `
        <button
            [attr.type]="type"
            [attr.aria-label]="ariaLabel"
            [class]="styleClass"
            [ngStyle]="style"
            [disabled]="disabled || loading"
            [ngClass]="{
                'p-button p-component': true,
                'p-button-icon-only': icon && !label,
                'p-button-vertical': (iconPos === 'top' || iconPos === 'bottom') && label,
                'p-disabled': this.disabled || this.loading,
                'p-button-loading': this.loading,
                'p-button-loading-label-only': this.loading && !this.icon && this.label
            }"
            (click)="onClick.emit($event)"
            (focus)="onFocus.emit($event)"
            (blur)="onBlur.emit($event)"
            pRipple
        >
            <ng-content></ng-content>
            <ng-container *ngTemplateOutlet="contentTemplate"></ng-container>
            <span
                [ngClass]="{
                    'p-button-icon': true,
                    'p-button-icon-left': iconPos === 'left' && label,
                    'p-button-icon-right': iconPos === 'right' && label,
                    'p-button-icon-top': iconPos === 'top' && label,
                    'p-button-icon-bottom': iconPos === 'bottom' && label
                }"
                [class]="loading ? 'p-button-loading-icon ' + loadingIcon : icon"
                *ngIf="!contentTemplate && (icon || loading)"
                [attr.aria-hidden]="true"
            ></span>
            <span class="p-button-label" [attr.aria-hidden]="icon && !label" *ngIf="!contentTemplate && label">{{ label }}</span>
            <span [ngClass]="badgeStyleClass()" [class]="badgeClass" *ngIf="!contentTemplate && badge">{{ badge }}</span>
        </button>
    `, isInline: true, dependencies: [{ kind: "directive", type: i1.NgClass, selector: "[ngClass]", inputs: ["class", "ngClass"] }, { kind: "directive", type: i1.NgIf, selector: "[ngIf]", inputs: ["ngIf", "ngIfThen", "ngIfElse"] }, { kind: "directive", type: i1.NgTemplateOutlet, selector: "[ngTemplateOutlet]", inputs: ["ngTemplateOutletContext", "ngTemplateOutlet", "ngTemplateOutletInjector"] }, { kind: "directive", type: i1.NgStyle, selector: "[ngStyle]", inputs: ["ngStyle"] }, { kind: "directive", type: i2.Ripple, selector: "[pRipple]" }], changeDetection: i0.ChangeDetectionStrategy.OnPush, encapsulation: i0.ViewEncapsulation.None });
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "14.0.7", ngImport: i0, type: Button, decorators: [{
            type: Component,
            args: [{
                    selector: 'p-button',
                    template: `
        <button
            [attr.type]="type"
            [attr.aria-label]="ariaLabel"
            [class]="styleClass"
            [ngStyle]="style"
            [disabled]="disabled || loading"
            [ngClass]="{
                'p-button p-component': true,
                'p-button-icon-only': icon && !label,
                'p-button-vertical': (iconPos === 'top' || iconPos === 'bottom') && label,
                'p-disabled': this.disabled || this.loading,
                'p-button-loading': this.loading,
                'p-button-loading-label-only': this.loading && !this.icon && this.label
            }"
            (click)="onClick.emit($event)"
            (focus)="onFocus.emit($event)"
            (blur)="onBlur.emit($event)"
            pRipple
        >
            <ng-content></ng-content>
            <ng-container *ngTemplateOutlet="contentTemplate"></ng-container>
            <span
                [ngClass]="{
                    'p-button-icon': true,
                    'p-button-icon-left': iconPos === 'left' && label,
                    'p-button-icon-right': iconPos === 'right' && label,
                    'p-button-icon-top': iconPos === 'top' && label,
                    'p-button-icon-bottom': iconPos === 'bottom' && label
                }"
                [class]="loading ? 'p-button-loading-icon ' + loadingIcon : icon"
                *ngIf="!contentTemplate && (icon || loading)"
                [attr.aria-hidden]="true"
            ></span>
            <span class="p-button-label" [attr.aria-hidden]="icon && !label" *ngIf="!contentTemplate && label">{{ label }}</span>
            <span [ngClass]="badgeStyleClass()" [class]="badgeClass" *ngIf="!contentTemplate && badge">{{ badge }}</span>
        </button>
    `,
                    changeDetection: ChangeDetectionStrategy.OnPush,
                    encapsulation: ViewEncapsulation.None,
                    host: {
                        class: 'p-element'
                    }
                }]
        }], propDecorators: { type: [{
                type: Input
            }], iconPos: [{
                type: Input
            }], icon: [{
                type: Input
            }], badge: [{
                type: Input
            }], label: [{
                type: Input
            }], disabled: [{
                type: Input
            }], loading: [{
                type: Input
            }], loadingIcon: [{
                type: Input
            }], style: [{
                type: Input
            }], styleClass: [{
                type: Input
            }], badgeClass: [{
                type: Input
            }], ariaLabel: [{
                type: Input
            }], templates: [{
                type: ContentChildren,
                args: [PrimeTemplate]
            }], onClick: [{
                type: Output
            }], onFocus: [{
                type: Output
            }], onBlur: [{
                type: Output
            }] } });
export class ButtonModule {
}
ButtonModule.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "14.0.7", ngImport: i0, type: ButtonModule, deps: [], target: i0.ɵɵFactoryTarget.NgModule });
ButtonModule.ɵmod = i0.ɵɵngDeclareNgModule({ minVersion: "14.0.0", version: "14.0.7", ngImport: i0, type: ButtonModule, declarations: [ButtonDirective, Button], imports: [CommonModule, RippleModule], exports: [ButtonDirective, Button] });
ButtonModule.ɵinj = i0.ɵɵngDeclareInjector({ minVersion: "12.0.0", version: "14.0.7", ngImport: i0, type: ButtonModule, imports: [CommonModule, RippleModule] });
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "14.0.7", ngImport: i0, type: ButtonModule, decorators: [{
            type: NgModule,
            args: [{
                    imports: [CommonModule, RippleModule],
                    exports: [ButtonDirective, Button],
                    declarations: [ButtonDirective, Button]
                }]
        }] });
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiYnV0dG9uLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vc3JjL2FwcC9jb21wb25lbnRzL2J1dHRvbi9idXR0b24udHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUEsT0FBTyxFQUFFLFlBQVksRUFBRSxNQUFNLGlCQUFpQixDQUFDO0FBQy9DLE9BQU8sRUFBbUMsdUJBQXVCLEVBQUUsU0FBUyxFQUFFLGVBQWUsRUFBRSxTQUFTLEVBQWMsWUFBWSxFQUFFLEtBQUssRUFBRSxRQUFRLEVBQWEsTUFBTSxFQUEwQixpQkFBaUIsRUFBRSxNQUFNLGVBQWUsQ0FBQztBQUN6TyxPQUFPLEVBQUUsYUFBYSxFQUFFLE1BQU0sYUFBYSxDQUFDO0FBQzVDLE9BQU8sRUFBRSxVQUFVLEVBQUUsTUFBTSxhQUFhLENBQUM7QUFDekMsT0FBTyxFQUFFLFlBQVksRUFBRSxNQUFNLGdCQUFnQixDQUFDO0FBQzlDLE9BQU8sRUFBRSxXQUFXLEVBQUUsTUFBTSxlQUFlLENBQUM7Ozs7QUFVNUMsTUFBTSxPQUFPLGVBQWU7SUFleEIsWUFBbUIsRUFBYztRQUFkLE9BQUUsR0FBRixFQUFFLENBQVk7UUFkeEIsWUFBTyxHQUF1QixNQUFNLENBQUM7UUFFckMsZ0JBQVcsR0FBVyx1QkFBdUIsQ0FBQztRQU1oRCxhQUFRLEdBQVksS0FBSyxDQUFDO0lBTUcsQ0FBQztJQUVyQyxlQUFlO1FBQ1gsSUFBSSxDQUFDLGtCQUFrQixHQUFHLElBQUksQ0FBQyxFQUFFLENBQUMsYUFBYSxDQUFDLFNBQVMsQ0FBQztRQUMxRCxVQUFVLENBQUMsa0JBQWtCLENBQUMsSUFBSSxDQUFDLEVBQUUsQ0FBQyxhQUFhLEVBQUUsSUFBSSxDQUFDLGFBQWEsRUFBRSxDQUFDLENBQUM7UUFFM0UsSUFBSSxJQUFJLENBQUMsSUFBSSxJQUFJLElBQUksQ0FBQyxPQUFPLEVBQUU7WUFDM0IsSUFBSSxDQUFDLFlBQVksRUFBRSxDQUFDO1NBQ3ZCO1FBRUQsSUFBSSxJQUFJLENBQUMsS0FB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Z0JBRUcsUUFBUTtzQkFBaEIsS0FBSztnQkFFRyxPQUFPO3NCQUFmLEtBQUs7Z0JBRUcsV0FBVztzQkFBbkIsS0FBSztnQkFFRyxLQUFLO3NCQUFiLEtBQUs7Z0JBRUcsVUFBVTtzQkFBbEIsS0FBSztnQkFFRyxVQUFVO3NCQUFsQixLQUFLO2dCQUVHLFNBQVM7c0JBQWpCLEtBQUs7Z0JBSTBCLFNBQVM7c0JBQXhDLGVBQWU7dUJBQUMsYUFBYTtnQkFFcEIsT0FBTztzQkFBaEIsTUFBTTtnQkFFRyxPQUFPO3NCQUFoQixNQUFNO2dCQUVHLE1BQU07c0JBQWYsTUFBTTs7QUE2QlgsTUFBTSxPQUFPLFlBQVk7O3lHQUFaLFlBQVk7MEdBQVosWUFBWSxpQkE5UFosZUFBZSxFQWdNZixNQUFNLGFBMERMLFlBQVksRUFBRSxZQUFZLGFBMVAzQixlQUFlLEVBZ01mLE1BQU07MEdBOEROLFlBQVksWUFKWCxZQUFZLEVBQUUsWUFBWTsyRkFJM0IsWUFBWTtrQkFMeEIsUUFBUTttQkFBQztvQkFDTixPQUFPLEVBQUUsQ0FBQyxZQUFZLEVBQUUsWUFBWSxDQUFDO29CQUNyQyxPQUFPLEVBQUUsQ0FBQyxlQUFlLEVBQUUsTUFBTSxDQUFDO29CQUNsQyxZQUFZLEVBQUUsQ0FBQyxlQUFlLEVBQUUsTUFBTSxDQUFDO2lCQUMxQyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7IENvbW1vbk1vZHVsZSB9IGZyb20gJ0Bhbmd1bGFyL2NvbW1vbic7XG5pbXBvcnQgeyBBZnRlckNvbnRlbnRJbml0LCBBZnRlclZpZXdJbml0LCBDaGFuZ2VEZXRlY3Rpb25TdHJhdGVneSwgQ29tcG9uZW50LCBDb250ZW50Q2hpbGRyZW4sIERpcmVjdGl2ZSwgRWxlbWVudFJlZiwgRXZlbnRFbWl0dGVyLCBJbnB1dCwgTmdNb2R1bGUsIE9uRGVzdHJveSwgT3V0cHV0LCBRdWVyeUxpc3QsIFRlbXBsYXRlUmVmLCBWaWV3RW5jYXBzdWxhdGlvbiB9IGZyb20gJ0Bhbmd1bGFyL2NvcmUnO1xuaW1wb3J0IHsgUHJpbWVUZW1wbGF0ZSB9IGZyb20gJ3ByaW1lbmcvYXBpJztcbmltcG9ydCB7IERvbUhhbmRsZXIgfSBmcm9tICdwcmltZW5nL2RvbSc7XG5pbXBvcnQgeyBSaXBwbGVNb2R1bGUgfSBmcm9tICdwcmltZW5nL3JpcHBsZSc7XG5pbXBvcnQgeyBPYmplY3RVdGlscyB9IGZyb20gJ3ByaW1lbmcvdXRpbHMnO1xuXG50eXBlIEJ1dHRvbkljb25Qb3NpdGlvbiA9ICdsZWZ0JyB8ICdyaWdodCcgfCAndG9wJyB8ICdib3R0b20nO1xuXG5ARGlyZWN0aXZlKHtcbiAgICBzZWxlY3RvcjogJ1twQnV0dG9uXScsXG4gICAgaG9zdDoge1xuICAgICAgICBjbGFzczogJ3AtZWxlbWVudCdcbiAgICB9XG59KVxuZXhwb3J0IGNsYXNzIEJ1dHRvbkRpcmVjdGl2ZSBpbXBsZW1lbnRzIEFmdGVyVmlld0luaXQsIE9uRGVzdHJveSB7XG4gICAgQElucHV0KCkgaWNvblBvczogQnV0dG9uSWNvblBvc2l0aW9uID0gJ2xlZnQnO1xuXG4gICAgQElucHV0KCkgbG9hZGluZ0ljb246IHN0cmluZyA9ICdwaSBwaS1zcGlubmVyIHBpLXNwaW4nO1xuXG4gICAgcHVibGljIF9sYWJlbDogc3RyaW5nO1xuXG4gICAgcHVibGljIF9pY29uOiBzdHJpbmc7XG5cbiAgICBwdWJsaWMgX2xvYWRpbmc6IGJvb2xlYW4gPSBmYWxzZTtcblxuICAgIHB1YmxpYyBpbml0aWFsaXplZDogYm9vbGVhbjtcblxuICAgIHB1YmxpYyBfaW5pdGlhbFN0eWxlQ2xhc3M6IHN0cmluZztcblxuICAgIGNvbnN0cnVjdG9yKHB1YmxpYyBlbDogRWxlbWVudFJlZikge31cblxuICAgIG5nQWZ0ZXJWaWV3SW5pdCgpIHtcbiAgICAgICAgdGhpcy5faW5pdGlhbFN0eWxlQ2xhc3MgPSB0aGlzLmVsLm5hdGl2ZUVsZW1lbnQuY2xhc3NOYW1lO1xuICAgICAgICBEb21IYW5kbGVyLmFkZE11bHRpcGxlQ2xhc3Nlcyh0aGlzLmVsLm5hdGl2ZUVsZW1lbnQsIHRoaXMuZ2V0U3R5bGVDbGFzcygpKTtcblxuICAgICAgICBpZiAodGhpcy5pY29uIHx8IHRoaXMubG9hZGluZykge1xuICAgICAgICAgICAgdGhpcy5jcmVhdGVJY29uRWwoKTtcbiAgICAgICAgfVxuXG4gICAgICAgIGlmICh0aGlzLmxhYmVsKSB7XG4gICAgICAgICAgICBsZXQgbGFiZWxFbGVtZW50ID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnc3BhbicpO1xuICAgICAgICAgICAgaWYgKHRoaXMuaWNvbiAmJiAhdGhpcy5sYWJlbCkge1xuICAgICAgICAgICAgICAgIGxhYmVsRWxlbWVudC5zZXRBdHRyaWJ1dGUoJ2FyaWEtaGlkZGVuJywgJ3RydWUnKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGxhYmVsRWxlbWVudC5jbGFzc05hbWUgPSAncC1idXR0b24tbGFiZWwnO1xuICAgICAgICAgICAgbGFiZWxFbGVtZW50LmFwcGVuZENoaWxkKGRvY3VtZW50LmNyZWF0ZVRleHROb2RlKHRoaXMubGFiZWwpKTtcblxuICAgICAgICAgICAgdGhpcy5lbC5uYXRpdmVFbGVtZW50LmFwcGVuZENoaWxkKGxhYmVsRWxlbWVudCk7XG4gICAgICAgIH1cblxuICAgICAgICB0aGlzLmluaXRpYWxpemVkID0gdHJ1ZTtcbiAgICB9XG5cbiAgICBnZXRTdHlsZUNsYXNzKCk6IHN0cmluZyB7XG4gICAgICAgIGxldCBzdHlsZUNsYXNzID0gJ3AtYnV0dG9uIHAtY29tcG9uZW50JztcbiAgICAgICAgaWYgKHRoaXMuaWNvbiAmJiAhdGhpcy5sYWJlbCAmJiBPYmplY3RVdGlscy5pc0VtcHR5KHRoaXMuZWwubmF0aXZlRWxlbWVudC50ZXh0Q29udGVudCkpIHtcbiAgICAgICAgICAgIHN0eWxlQ2xhc3MgPSBzdHlsZUNsYXNzICsgJyBwLWJ1dHRvbi1pY29uLW9ubHknO1xuICAgICAgICB9XG5cbiAgICAgICAgaWYgKHRoaXMubG9hZGluZykge1xuICAgICAgICAgICAgc3R5bGVDbGFzcyA9IHN0eWxlQ2xhc3MgKyAnIHAtZGlzYWJsZWQgcC1idXR0b24tbG9hZGluZyc7XG4gICAgICAgICAgICBpZiAoIXRoaXMuaWNvbiAmJiB0aGlzLmxhYmVsKSBzdHlsZUNsYXNzID0gc3R5bGVDbGFzcyArICcgcC1idXR0b24tbG9hZGluZy1sYWJlbC1vbmx5JztcbiAgICAgICAgfVxuXG4gICAgICAgIHJldHVybiBzdHlsZUNsYXNzO1xuICAgIH1cblxuICAgIHNldFN0eWxlQ2xhc3MoKSB7XG4gICAgICAgIGxldCBzdHlsZUNsYXNzID0gdGhpcy5nZXRTdHlsZUNsYXNzKCk7XG4gICAgICAgIHRoaXMuZWwubmF0aXZlRWxlbWVudC5jbGFzc05hbWUgPSBzdHlsZUNsYXNzICsgJyAnICsgdGhpcy5faW5pdGlhbFN0eWxlQ2xhc3M7XG4gICAgfVxuXG4gICAgY3JlYXRlSWNvbkVsKCkge1xuICAgICAgICBsZXQgaWNvbkVsZW1lbnQgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdzcGFuJyk7XG4gICAgICAgIGljb25FbGVtZW50LmNsYXNzTmFtZSA9ICdwLWJ1dHRvbi1pY29uJztcbiAgICAgICAgaWNvbkVsZW1lbnQuc2V0QXR0cmlidXRlKCdhcmlhLWhpZGRlbicsICd0cnVlJyk7XG4gICAgICAgIGxldCBpY29uUG9zQ2xhc3MgPSB0aGlzLmxhYmVsID8gJ3AtYnV0dG9uLWljb24tJyArIHRoaXMuaWNvblBvcyA6IG51bGw7XG5cbiAgICAgICAgaWYgKGljb25Qb3NDbGFzcykge1xuICAgICAgICAgICAgRG9tSGFuZGxlci5hZGRDbGFzcyhpY29uRWxlbWVudCwgaWNvblBvc0NsYXNzKTtcbiAgICAgICAgfVxuXG4gICAgICAgIGxldCBpY29uQ2xhc3MgPSB0aGlzLmdldEljb25DbGFzcygpO1xuXG4gICAgICAgIGlmIChpY29uQ2xhc3MpIHtcbiAgICAgICAgICAgIERvbUhhbmRsZXIuYWRkTXVsdGlwbGVDbGFzc2VzKGljb25FbGVtZW50LCBpY29uQ2xhc3MpO1xuICAgICAgICB9XG5cbiAgICAgICAgdGhpcy5lbC5uYXRpdmVFbGVtZW50Lmluc2VydEJlZm9yZShpY29uRWxlbWVudCwgdGhpcy5lbC5uYXRpdmVFbGVtZW50LmZpcnN0Q2hpbGQpO1xuICAgIH1cblxuICAgIGdldEljb25DbGFzcygpIHtcbiAgICAgICAgcmV0dXJuIHRoaXMubG9hZGluZyA/ICdwLWJ1dHRvbi1sb2FkaW5nLWljb24gJyArIHRoaXMubG9hZGluZ0ljb24gOiB0aGlzLl9pY29uO1xuICAgIH1cblxuICAgIHNldEljb25DbGFzcygpIHtcbiAgICAgICAgbGV0IGljb25FbGVtZW50ID0gRG9tSGFuZGxlci5maW5kU2luZ2xlKHRoaXMuZWwubmF0aXZlRWxlbWVudCwgJy5wLWJ1dHRvbi1pY29uJyk7XG4gICAgICAgIGlmIChpY29uRWxlbWVudCkge1xuICAgICAgICAgICAgaWYgKHRoaXMuaWNvblBvcykgaWNvbkVsZW1lbnQuY2xhc3NOYW1lID0gJ3AtYnV0dG9uLWljb24gcC1idXR0b24taWNvbi0nICsgdGhpcy5pY29uUG9zICsgJyAnICsgdGhpcy5nZXRJY29uQ2xhc3MoKTtcbiAgICAgICAgICAgIGVsc2UgaWNvbkVsZW1lbnQuY2xhc3NOYW1lID0gJ3AtYnV0dG9uLWljb24gJyArIHRoaXMuZ2V0SWNvbkNsYXNzKCk7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICB0aGlzLmNyZWF0ZUljb25FbCgpO1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgcmVtb3ZlSWNvbkVsZW1lbnQoKSB7XG4gICAgICAgIGxldCBpY29uRWxlbWVudCA9IERvbUhhbmRsZXIuZmluZFNpbmdsZSh0aGlzLmVsLm5hdGl2ZUVsZW1lbnQsICcucC1idXR0b24taWNvbicpO1xuICAgICAgICB0aGlzLmVsLm5hdGl2ZUVsZW1lbnQucmVtb3ZlQ2hpbGQoaWNvbkVsZW1lbnQpO1xuICAgIH1cblxuICAgIEBJbnB1dCgpIGdldCBsYWJlbCgpOiBzdHJpbmcge1xuICAgICAgICByZXR1cm4gdGhpcy5fbGFiZWw7XG4gICAgfVxuXG4gICAgc2V0IGxhYmVsKHZhbDogc3RyaW5nKSB7XG4gICAgICAgIHRoaXMuX2xhYmVsID0gdmFsO1xuXG4gICAgICAgIGlmICh0aGlzLmluaXRpYWxpemVkKSB7XG4gICAgICAgICAgICBEb21IYW5kbGVyLmZpbmRTaW5nbGUodGhpcy5lbC5uYXRpdmVFbGVtZW50LCAnLnAtYnV0dG9uLWxhYmVsJykudGV4dENvbnRlbnQgPSB0aGlzLl9sYWJlbDtcblxuICAgICAgICAgICAgaWYgKHRoaXMubG9hZGluZyB8fCB0aGlzLmljb24pIHtcbiAgICAgICAgICAgICAgICB0aGlzLnNldEljb25DbGFzcygpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgdGhpcy5zZXRTdHlsZUNsYXNzKCk7XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICBASW5wdXQoKSBnZXQgaWNvbigpOiBzdHJpbmcge1xuICAgICAgICByZXR1cm4gdGhpcy5faWNvbjtcbiAgICB9XG5cbiAgICBzZXQgaWNvbih2YWw6IHN0cmluZykge1xuICAgICAgICB0aGlzLl9pY29uID0gdmFsO1xuXG4gICAgICAgIGlmICh0aGlzLmluaXRpYWxpemVkKSB7XG4gICAgICAgICAgICB0aGlzLnNldEljb25DbGFzcygpO1xuICAgICAgICAgICAgdGhpcy5zZXRTdHlsZUNsYXNzKCk7XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICBASW5wdXQoKSBnZXQgbG9hZGluZygpOiBib29sZWFuIHtcbiAgICAgICAgcmV0dXJuIHRoaXMuX2xvYWRpbmc7XG4gICAgfVxuXG4gICAgc2V0IGxvYWRpbmcodmFsOiBib29sZWFuKSB7XG4gICAgICAgIHRoaXMuX2xvYWRpbmcgPSB2YWw7XG5cbiAgICAgICAgaWYgKHRoaXMuaW5pdGlhbGl6ZWQpIHtcbiAgICAgICAgICAgIGlmICh0aGlzLmxvYWRpbmcgfHwgdGhpcy5pY29uKSB0aGlzLnNldEljb25DbGFzcygpO1xuICAgICAgICAgICAgZWxzZSB0aGlzLnJlbW92ZUljb25FbGVtZW50KCk7XG5cbiAgICAgICAgICAgIHRoaXMuc2V0U3R5bGVDbGFzcygpO1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgbmdPbkRlc3Ryb3koKSB7XG4gICAgICAgIHRoaXMuaW5pdGlhbGl6ZWQgPSBmYWxzZTtcbiAgICB9XG59XG5cbkBDb21wb25lbnQoe1xuICAgIHNlbGVjdG9yOiAncC1idXR0b24nLFxuICAgIHRlbXBsYXRlOiBgXG4gICAgICAgIDxidXR0b25cbiAgICAgICAgICAgIFthdHRyLnR5cGVdPVwidHlwZVwiXG4gICAgICAgICAgICBbYXR0ci5hcmlhLWxhYmVsXT1cImFyaWFMYWJlbFwiXG4gICAgICAgICAgICBbY2xhc3NdPVwic3R5bGVDbGFzc1wiXG4gICAgICAgICAgICBbbmdTdHlsZV09XCJzdHlsZVwiXG4gICAgICAgICAgICBbZGlzYWJsZWRdPVwiZGlzYWJsZWQgfHwgbG9hZGluZ1wiXG4gICAgICAgICAgICBbbmdDbGFzc109XCJ7XG4gICAgICAgICAgICAgICAgJ3AtYnV0dG9uIHAtY29tcG9uZW50JzogdHJ1ZSxcbiAgICAgICAgICAgICAgICAncC1idXR0b24taWNvbi1vbmx5JzogaWNvbiAmJiAhbGFiZWwsXG4gICAgICAgICAgICAgICAgJ3AtYnV0dG9uLXZlcnRpY2FsJzogKGljb25Qb3MgPT09ICd0b3AnIHx8IGljb25Qb3MgPT09ICdib3R0b20nKSAmJiBsYWJlbCxcbiAgICAgICAgICAgICAgICAncC1kaXNhYmxlZCc6IHRoaXMuZGlzYWJsZWQgfHwgdGhpcy5sb2FkaW5nLFxuICAgICAgICAgICAgICAgICdwLWJ1dHRvbi1sb2FkaW5nJzogdGhpcy5sb2FkaW5nLFxuICAgICAgICAgICAgICAgICdwLWJ1dHRvbi1sb2FkaW5nLWxhYmVsLW9ubHknOiB0aGlzLmxvYWRpbmcgJiYgIXRoaXMuaWNvbiAmJiB0aGlzLmxhYmVsXG4gICAgICAgICAgICB9XCJcbiAgICAgICAgICAgIChjbGljayk9XCJvbkNsaWNrLmVtaXQoJGV2ZW50KVwiXG4gICAgICAgICAgICAoZm9jdXMpPVwib25Gb2N1cy5lbWl0KCRldmVudClcIlxuICAgICAgICAgICAgKGJsdXIpPVwib25CbHVyLmVtaXQoJGV2ZW50KVwiXG4gICAgICAgICAgICBwUmlwcGxlXG4gICAgICAgID5cbiAgICAgICAgICAgIDxuZy1jb250ZW50PjwvbmctY29udGVudD5cbiAgICAgICAgICAgIDxuZy1jb250YWluZXIgKm5nVGVtcGxhdGVPdXRsZXQ9XCJjb250ZW50VGVtcGxhdGVcIj48L25nLWNvbnRhaW5lcj5cbiAgICAgICAgICAgIDxzcGFuXG4gICAgICAgICAgICAgICAgW25nQ2xhc3NdPVwie1xuICAgICAgICAgICAgICAgICAgICAncC1idXR0b24taWNvbic6IHRydWUsXG4gICAgICAgICAgICAgICAgICAgICdwLWJ1dHRvbi1pY29uLWxlZnQnOiBpY29uUG9zID09PSAnbGVmdCcgJiYgbGFiZWwsXG4gICAgICAgICAgICAgICAgICAgICdwLWJ1dHRvbi1pY29uLXJpZ2h0JzogaWNvblBvcyA9PT0gJ3JpZ2h0JyAmJiBsYWJlbCxcbiAgICAgICAgICAgICAgICAgICAgJ3AtYnV0dG9uLWljb24tdG9wJzogaWNvblBvcyA9PT0gJ3RvcCcgJiYgbGFiZWwsXG4gICAgICAgICAgICAgICAgICAgICdwLWJ1dHRvbi1pY29uLWJvdHRvbSc6IGljb25Qb3MgPT09ICdib3R0b20nICYmIGxhYmVsXG4gICAgICAgICAgICAgICAgfVwiXG4gICAgICAgICAgICAgICAgW2NsYXNzXT1cImxvYWRpbmcgPyAncC1idXR0b24tbG9hZGluZy1pY29uICcgKyBsb2FkaW5nSWNvbiA6IGljb25cIlxuICAgICAgICAgICAgICAgICpuZ0lmPVwiIWNvbnRlbnRUZW1wbGF0ZSAmJiAoaWNvbiB8fCBsb2FkaW5nKVwiXG4gICAgICAgICAgICAgICAgW2F0dHIuYXJpYS1oaWRkZW5dPVwidHJ1ZVwiXG4gICAgICAgICAgICA+PC9zcGFuPlxuICAgICAgICAgICAgPHNwYW4gY2xhc3M9XCJwLWJ1dHRvbi1sYWJlbFwiIFthdHRyLmFyaWEtaGlkZGVuXT1cImljb24gJiYgIWxhYmVsXCIgKm5nSWY9XCIhY29udGVudFRlbXBsYXRlICYmIGxhYmVsXCI+e3sgbGFiZWwgfX08L3NwYW4+XG4gICAgICAgICAgICA8c3BhbiBbbmdDbGFzc109XCJiYWRnZVN0eWxlQ2xhc3MoKVwiIFtjbGFzc109XCJiYWRnZUNsYXNzXCIgKm5nSWY9XCIhY29udGVudFRlbXBsYXRlICYmIGJhZGdlXCI+e3sgYmFkZ2UgfX08L3NwYW4+XG4gICAgICAgIDwvYnV0dG9uPlxuICAgIGAsXG4gICAgY2hhbmdlRGV0ZWN0aW9uOiBDaGFuZ2VEZXRlY3Rpb25TdHJhdGVneS5PblB1c2gsXG4gICAgZW5jYXBzdWxhdGlvbjogVmlld0VuY2Fwc3VsYXRpb24uTm9uZSxcbiAgICBob3N0OiB7XG4gICAgICAgIGNsYXNzOiAncC1lbGVtZW50J1xuICAgIH1cbn0pXG5leHBvcnQgY2xhc3MgQnV0dG9uIGltcGxlbWVudHMgQWZ0ZXJDb250ZW50SW5pdCB7XG4gICAgQElucHV0KCkgdHlwZTogc3RyaW5nID0gJ2J1dHRvbic7XG5cbiAgICBASW5wdXQoKSBpY29uUG9zOiBCdXR0b25JY29uUG9zaXRpb24gPSAnbGVmdCc7XG5cbiAgICBASW5wdXQoKSBpY29uOiBzdHJpbmc7XG5cbiAgICBASW5wdXQoKSBiYWRnZTogc3RyaW5nO1xuXG4gICAgQElucHV0KCkgbGFiZWw6IHN0cmluZztcblxuICAgIEBJbnB1dCgpIGRpc2FibGVkOiBib29sZWFuO1xuXG4gICAgQElucHV0KCkgbG9hZGluZzogYm9vbGVhbiA9IGZhbHNlO1xuXG4gICAgQElucHV0KCkgbG9hZGluZ0ljb246IHN0cmluZyA9ICdwaSBwaS1zcGlubmVyIHBpLXNwaW4nO1xuXG4gICAgQElucHV0KCkgc3R5bGU6IGFueTtcblxuICAgIEBJbnB1dCgpIHN0eWxlQ2xhc3M6IHN0cmluZztcblxuICAgIEBJbnB1dCgpIGJhZGdlQ2xhc3M6IHN0cmluZztcblxuICAgIEBJbnB1dCgpIGFyaWFMYWJlbDogc3RyaW5nO1xuXG4gICAgY29udGVudFRlbXBsYXRlOiBUZW1wbGF0ZVJlZjxhbnk+O1xuXG4gICAgQENvbnRlbnRDaGlsZHJlbihQcmltZVRlbXBsYXRlKSB0ZW1wbGF0ZXM6IFF1ZXJ5TGlzdDxhbnk+O1xuXG4gICAgQE91dHB1dCgpIG9uQ2xpY2s6IEV2ZW50RW1pdHRlcjxhbnk+ID0gbmV3IEV2ZW50RW1pdHRlcigpO1xuXG4gICAgQE91dHB1dCgpIG9uRm9jdXM6IEV2ZW50RW1pdHRlcjxhbnk+ID0gbmV3IEV2ZW50RW1pdHRlcigpO1xuXG4gICAgQE91dHB1dCgpIG9uQmx1cjogRXZlbnRFbWl0dGVyPGFueT4gPSBuZXcgRXZlbnRFbWl0dGVyKCk7XG5cbiAgICBuZ0FmdGVyQ29udGVudEluaXQoKSB7XG4gICAgICAgIHRoaXMudGVtcGxhdGVzLmZvckVhY2goKGl0ZW0pID0+IHtcbiAgICAgICAgICAgIHN3aXRjaCAoaXRlbS5nZXRUeXBlKCkpIHtcbiAgICAgICAgICAgICAgICBjYXNlICdjb250ZW50JzpcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5jb250ZW50VGVtcGxhdGUgPSBpdGVtLnRlbXBsYXRlO1xuICAgICAgICAgICAgICAgICAgICBicmVhaztcblxuICAgICAgICAgICAgICAgIGRlZmF1bHQ6XG4gICAgICAgICAgICAgICAgICAgIHRoaXMuY29udGVudFRlbXBsYXRlID0gaXRlbS50ZW1wbGF0ZTtcbiAgICAgICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICB9XG4gICAgICAgIH0pO1xuICAgIH1cblxuICAgIGJhZGdlU3R5bGVDbGFzcygpIHtcbiAgICAgICAgcmV0dXJuIHtcbiAgICAgICAgICAgICdwLWJhZGdlIHAtY29tcG9uZW50JzogdHJ1ZSxcbiAgICAgICAgICAgICdwLWJhZGdlLW5vLWd1dHRlcic6IHRoaXMuYmFkZ2UgJiYgU3RyaW5nKHRoaXMuYmFkZ2UpLmxlbmd0aCA9PT0gMVxuICAgICAgICB9O1xuICAgIH1cbn1cblxuQE5nTW9kdWxlKHtcbiAgICBpbXBvcnRzOiBbQ29tbW9uTW9kdWxlLCBSaXBwbGVNb2R1bGVdLFxuICAgIGV4cG9ydHM6IFtCdXR0b25EaXJlY3RpdmUsIEJ1dHRvbl0sXG4gICAgZGVjbGFyYXRpb25zOiBbQnV0dG9uRGlyZWN0aXZlLCBCdXR0b25dXG59KVxuZXhwb3J0IGNsYXNzIEJ1dHRvbk1vZHVsZSB7fVxuIl19
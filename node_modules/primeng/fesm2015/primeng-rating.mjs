import * as i1 from '@angular/common';
import { CommonModule } from '@angular/common';
import * as i0 from '@angular/core';
import { forwardRef, EventEmitter, Component, ChangeDetectionStrategy, ViewEncapsulation, ContentChildren, Input, Output, NgModule } from '@angular/core';
import { NG_VALUE_ACCESSOR } from '@angular/forms';
import { PrimeTemplate, SharedModule } from 'primeng/api';

const RATING_VALUE_ACCESSOR = {
    provide: NG_VALUE_ACCESSOR,
    useExisting: forwardRef(() => Rating),
    multi: true
};
class Rating {
    constructor(cd) {
        this.cd = cd;
        this.isCustomCancelIcon = true;
        this.stars = 5;
        this.cancel = true;
        this.iconOnClass = 'pi pi-star-fill';
        this.iconOffClass = 'pi pi-star';
        this.iconCancelClass = 'pi pi-ban';
        this.onRate = new EventEmitter();
        this.onCancel = new EventEmitter();
        this.onModelChange = () => { };
        this.onModelTouched = () => { };
    }
    ngOnInit() {
        this.starsArray = [];
        for (let i = 0; i < this.stars; i++) {
            this.starsArray[i] = i;
        }
    }
    ngAfterContentInit() {
        this.templates.forEach((item) => {
            switch (item.getType()) {
                case 'onicon':
                    this.onIconTemplate = item.template;
                    break;
                case 'officon':
                    this.offIconTemplate = item.template;
                    break;
                case 'cancel':
                    this.cancelIconTemplate = item.template;
                    break;
            }
        });
    }
    getIconTemplate(i) {
        return !this.value || i >= this.value ? this.offIconTemplate : this.onIconTemplate;
    }
    rate(event, i) {
        if (!this.readonly && !this.disabled) {
            this.value = i + 1;
            this.onModelChange(this.value);
            this.onModelTouched();
            this.onRate.emit({
                originalEvent: event,
                value: i + 1
            });
        }
        event.preventDefault();
    }
    clear(event) {
        if (!this.readonly && !this.disabled) {
            this.value = null;
            this.onModelChange(this.value);
            this.onModelTouched();
            this.onCancel.emit(event);
        }
        event.preventDefault();
    }
    writeValue(value) {
        this.value = value;
        this.cd.detectChanges();
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
    get isCustomIcon() {
        return this.templates && this.templates.length > 0;
    }
}
Rating.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "14.0.7", ngImport: i0, type: Rating, deps: [{ token: i0.ChangeDetectorRef }], target: i0.ɵɵFactoryTarget.Component });
Rating.ɵcmp = i0.ɵɵngDeclareComponent({ minVersion: "14.0.0", version: "14.0.7", type: Rating, selector: "p-rating", inputs: { isCustomCancelIcon: "isCustomCancelIcon", index: "index", disabled: "disabled", readonly: "readonly", stars: "stars", cancel: "cancel", iconOnClass: "iconOnClass", iconOnStyle: "iconOnStyle", iconOffClass: "iconOffClass", iconOffStyle: "iconOffStyle", iconCancelClass: "iconCancelClass", iconCancelStyle: "iconCancelStyle" }, outputs: { onRate: "onRate", onCancel: "onCancel" }, host: { classAttribute: "p-element" }, providers: [RATING_VALUE_ACCESSOR], queries: [{ propertyName: "templates", predicate: PrimeTemplate }], ngImport: i0, template: `
        <div class="p-rating" [ngClass]="{ 'p-readonly': readonly, 'p-disabled': disabled }">
            <ng-container *ngIf="!isCustomIcon; else customTemplate">
                <span *ngIf="cancel" [attr.tabindex]="disabled || readonly ? null : '0'" (click)="clear($event)" (keydown.enter)="clear($event)" class="p-rating-icon p-rating-cancel" [ngClass]="iconCancelClass" [ngStyle]="iconCancelStyle"></span>
                <span
                    *ngFor="let star of starsArray; let i = index"
                    class="p-rating-icon"
                    [attr.tabindex]="disabled || readonly ? null : '0'"
                    (click)="rate($event, i)"
                    (keydown.enter)="rate($event, i)"
                    [ngClass]="!value || i >= value ? iconOffClass : iconOnClass"
                    [ngStyle]="!value || i >= value ? iconOffStyle : iconOnStyle"
                >
                </span>
            </ng-container>
            <ng-template #customTemplate>
                <span *ngIf="cancel" [attr.tabindex]="disabled || readonly ? null : '0'" (click)="clear($event)" (keydown.enter)="clear($event)" class="p-rating-icon p-rating-cancel" [ngStyle]="iconCancelStyle">
                    <ng-container *ngTemplateOutlet="cancelIconTemplate"></ng-container>
                </span>
                <span *ngFor="let star of starsArray; let i = index" class="p-rating-icon" [attr.tabindex]="disabled || readonly ? null : '0'" (click)="rate($event, i)" (keydown.enter)="rate($event, i)">
                    <ng-container *ngTemplateOutlet="getIconTemplate(i)"></ng-container>
                </span>
            </ng-template>
        </div>
    `, isInline: true, styles: [".p-rating-icon{cursor:pointer;display:inline-flex}.p-rating.p-rating-readonly .p-rating-icon{cursor:default}\n"], dependencies: [{ kind: "directive", type: i1.NgClass, selector: "[ngClass]", inputs: ["class", "ngClass"] }, { kind: "directive", type: i1.NgForOf, selector: "[ngFor][ngForOf]", inputs: ["ngForOf", "ngForTrackBy", "ngForTemplate"] }, { kind: "directive", type: i1.NgIf, selector: "[ngIf]", inputs: ["ngIf", "ngIfThen", "ngIfElse"] }, { kind: "directive", type: i1.NgTemplateOutlet, selector: "[ngTemplateOutlet]", inputs: ["ngTemplateOutletContext", "ngTemplateOutlet", "ngTemplateOutletInjector"] }, { kind: "directive", type: i1.NgStyle, selector: "[ngStyle]", inputs: ["ngStyle"] }], changeDetection: i0.ChangeDetectionStrategy.OnPush, encapsulation: i0.ViewEncapsulation.None });
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "14.0.7", ngImport: i0, type: Rating, decorators: [{
            type: Component,
            args: [{ selector: 'p-rating', template: `
        <div class="p-rating" [ngClass]="{ 'p-readonly': readonly, 'p-disabled': disabled }">
            <ng-container *ngIf="!isCustomIcon; else customTemplate">
                <span *ngIf="cancel" [attr.tabindex]="disabled || readonly ? null : '0'" (click)="clear($event)" (keydown.enter)="clear($event)" class="p-rating-icon p-rating-cancel" [ngClass]="iconCancelClass" [ngStyle]="iconCancelStyle"></span>
                <span
                    *ngFor="let star of starsArray; let i = index"
                    class="p-rating-icon"
                    [attr.tabindex]="disabled || readonly ? null : '0'"
                    (click)="rate($event, i)"
                    (keydown.enter)="rate($event, i)"
                    [ngClass]="!value || i >= value ? iconOffClass : iconOnClass"
                    [ngStyle]="!value || i >= value ? iconOffStyle : iconOnStyle"
                >
                </span>
            </ng-container>
            <ng-template #customTemplate>
                <span *ngIf="cancel" [attr.tabindex]="disabled || readonly ? null : '0'" (click)="clear($event)" (keydown.enter)="clear($event)" class="p-rating-icon p-rating-cancel" [ngStyle]="iconCancelStyle">
                    <ng-container *ngTemplateOutlet="cancelIconTemplate"></ng-container>
                </span>
                <span *ngFor="let star of starsArray; let i = index" class="p-rating-icon" [attr.tabindex]="disabled || readonly ? null : '0'" (click)="rate($event, i)" (keydown.enter)="rate($event, i)">
                    <ng-container *ngTemplateOutlet="getIconTemplate(i)"></ng-container>
                </span>
            </ng-template>
        </div>
    `, providers: [RATING_VALUE_ACCESSOR], changeDetection: ChangeDetectionStrategy.OnPush, encapsulation: ViewEncapsulation.None, host: {
                        class: 'p-element'
                    }, styles: [".p-rating-icon{cursor:pointer;display:inline-flex}.p-rating.p-rating-readonly .p-rating-icon{cursor:default}\n"] }]
        }], ctorParameters: function () { return [{ type: i0.ChangeDetectorRef }]; }, propDecorators: { templates: [{
                type: ContentChildren,
                args: [PrimeTemplate]
            }], isCustomCancelIcon: [{
                type: Input
            }], index: [{
                type: Input
            }], disabled: [{
                type: Input
            }], readonly: [{
                type: Input
            }], stars: [{
                type: Input
            }], cancel: [{
                type: Input
            }], iconOnClass: [{
                type: Input
            }], iconOnStyle: [{
                type: Input
            }], iconOffClass: [{
                type: Input
            }], iconOffStyle: [{
                type: Input
            }], iconCancelClass: [{
                type: Input
            }], iconCancelStyle: [{
                type: Input
            }], onRate: [{
                type: Output
            }], onCancel: [{
                type: Output
            }] } });
class RatingModule {
}
RatingModule.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "14.0.7", ngImport: i0, type: RatingModule, deps: [], target: i0.ɵɵFactoryTarget.NgModule });
RatingModule.ɵmod = i0.ɵɵngDeclareNgModule({ minVersion: "14.0.0", version: "14.0.7", ngImport: i0, type: RatingModule, declarations: [Rating], imports: [CommonModule], exports: [Rating, SharedModule] });
RatingModule.ɵinj = i0.ɵɵngDeclareInjector({ minVersion: "12.0.0", version: "14.0.7", ngImport: i0, type: RatingModule, imports: [CommonModule, SharedModule] });
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "14.0.7", ngImport: i0, type: RatingModule, decorators: [{
            type: NgModule,
            args: [{
                    imports: [CommonModule],
                    exports: [Rating, SharedModule],
                    declarations: [Rating]
                }]
        }] });

/**
 * Generated bundle index. Do not edit.
 */

export { RATING_VALUE_ACCESSOR, Rating, RatingModule };
//# sourceMappingURL=primeng-rating.mjs.map

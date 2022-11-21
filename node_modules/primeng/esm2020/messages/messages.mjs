import { NgModule, Component, Input, Output, EventEmitter, Optional, ChangeDetectionStrategy, ContentChildren, ViewEncapsulation } from '@angular/core';
import { CommonModule } from '@angular/common';
import { trigger, style, transition, animate } from '@angular/animations';
import { PrimeTemplate } from 'primeng/api';
import { RippleModule } from 'primeng/ripple';
import * as i0 from "@angular/core";
import * as i1 from "primeng/api";
import * as i2 from "@angular/common";
import * as i3 from "primeng/ripple";
export class Messages {
    constructor(messageService, el, cd) {
        this.messageService = messageService;
        this.el = el;
        this.cd = cd;
        this.closable = true;
        this.enableService = true;
        this.escape = true;
        this.showTransitionOptions = '300ms ease-out';
        this.hideTransitionOptions = '200ms cubic-bezier(0.86, 0, 0.07, 1)';
        this.valueChange = new EventEmitter();
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
        if (this.messageService && this.enableService && !this.contentTemplate) {
            this.messageSubscription = this.messageService.messageObserver.subscribe((messages) => {
                if (messages) {
                    if (messages instanceof Array) {
                        let filteredMessages = messages.filter((m) => this.key === m.key);
                        this.value = this.value ? [...this.value, ...filteredMessages] : [...filteredMessages];
                    }
                    else if (this.key === messages.key) {
                        this.value = this.value ? [...this.value, ...[messages]] : [messages];
                    }
                    this.cd.markForCheck();
                }
            });
            this.clearSubscription = this.messageService.clearObserver.subscribe((key) => {
                if (key) {
                    if (this.key === key) {
                        this.value = null;
                    }
                }
                else {
                    this.value = null;
                }
                this.cd.markForCheck();
            });
        }
    }
    hasMessages() {
        let parentEl = this.el.nativeElement.parentElement;
        if (parentEl && parentEl.offsetParent) {
            return this.contentTemplate != null || (this.value && this.value.length > 0);
        }
        return false;
    }
    clear() {
        this.value = [];
        this.valueChange.emit(this.value);
    }
    removeMessage(i) {
        this.value = this.value.filter((msg, index) => index !== i);
        this.valueChange.emit(this.value);
    }
    get icon() {
        const severity = this.severity || (this.hasMessages() ? this.value[0].severity : null);
        if (this.hasMessages()) {
            switch (severity) {
                case 'success':
                    return 'pi-check';
                    break;
                case 'info':
                    return 'pi-info-circle';
                    break;
                case 'error':
                    return 'pi-times';
                    break;
                case 'warn':
                    return 'pi-exclamation-triangle';
                    break;
                default:
                    return 'pi-info-circle';
                    break;
            }
        }
        return null;
    }
    ngOnDestroy() {
        if (this.messageSubscription) {
            this.messageSubscription.unsubscribe();
        }
        if (this.clearSubscription) {
            this.clearSubscription.unsubscribe();
        }
    }
}
Messages.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "14.0.7", ngImport: i0, type: Messages, deps: [{ token: i1.MessageService, optional: true }, { token: i0.ElementRef }, { token: i0.ChangeDetectorRef }], target: i0.ɵɵFactoryTarget.Component });
Messages.ɵcmp = i0.ɵɵngDeclareComponent({ minVersion: "14.0.0", version: "14.0.7", type: Messages, selector: "p-messages", inputs: { value: "value", closable: "closable", style: "style", styleClass: "styleClass", enableService: "enableService", key: "key", escape: "escape", severity: "severity", showTransitionOptions: "showTransitionOptions", hideTransitionOptions: "hideTransitionOptions" }, outputs: { valueChange: "valueChange" }, host: { classAttribute: "p-element" }, queries: [{ propertyName: "templates", predicate: PrimeTemplate }], ngImport: i0, template: `
        <div class="p-messages p-component" role="alert" [ngStyle]="style" [class]="styleClass">
            <ng-container *ngIf="!contentTemplate; else staticMessage">
                <div
                    *ngFor="let msg of value; let i = index"
                    [class]="'p-message p-message-' + msg.severity"
                    role="alert"
                    [@messageAnimation]="{ value: 'visible', params: { showTransitionParams: showTransitionOptions, hideTransitionParams: hideTransitionOptions } }"
                >
                    <div class="p-message-wrapper">
                        <span
                            [class]="'p-message-icon pi' + (msg.icon ? ' ' + msg.icon : '')"
                            [ngClass]="{ 'pi-info-circle': msg.severity === 'info', 'pi-check': msg.severity === 'success', 'pi-exclamation-triangle': msg.severity === 'warn', 'pi-times-circle': msg.severity === 'error' }"
                        ></span>
                        <ng-container *ngIf="!escape; else escapeOut">
                            <span *ngIf="msg.summary" class="p-message-summary" [innerHTML]="msg.summary"></span>
                            <span *ngIf="msg.detail" class="p-message-detail" [innerHTML]="msg.detail"></span>
                        </ng-container>
                        <ng-template #escapeOut>
                            <span *ngIf="msg.summary" class="p-message-summary">{{ msg.summary }}</span>
                            <span *ngIf="msg.detail" class="p-message-detail">{{ msg.detail }}</span>
                        </ng-template>
                        <button class="p-message-close p-link" (click)="removeMessage(i)" *ngIf="closable" type="button" pRipple>
                            <i class="p-message-close-icon pi pi-times"></i>
                        </button>
                    </div>
                </div>
            </ng-container>
            <ng-template #staticMessage>
                <div [ngClass]="'p-message p-message-' + severity" role="alert">
                    <div class="p-message-wrapper">
                        <ng-container *ngTemplateOutlet="contentTemplate"></ng-container>
                    </div>
                </div>
            </ng-template>
        </div>
    `, isInline: true, styles: [".p-message-wrapper{display:flex;align-items:center}.p-message-close{display:flex;align-items:center;justify-content:center}.p-message-close.p-link{margin-left:auto;overflow:hidden;position:relative}.p-messages .p-message.ng-animating{overflow:hidden}\n"], dependencies: [{ kind: "directive", type: i2.NgClass, selector: "[ngClass]", inputs: ["class", "ngClass"] }, { kind: "directive", type: i2.NgForOf, selector: "[ngFor][ngForOf]", inputs: ["ngForOf", "ngForTrackBy", "ngForTemplate"] }, { kind: "directive", type: i2.NgIf, selector: "[ngIf]", inputs: ["ngIf", "ngIfThen", "ngIfElse"] }, { kind: "directive", type: i2.NgTemplateOutlet, selector: "[ngTemplateOutlet]", inputs: ["ngTemplateOutletContext", "ngTemplateOutlet", "ngTemplateOutletInjector"] }, { kind: "directive", type: i2.NgStyle, selector: "[ngStyle]", inputs: ["ngStyle"] }, { kind: "directive", type: i3.Ripple, selector: "[pRipple]" }], animations: [
        trigger('messageAnimation', [
            transition(':enter', [style({ opacity: 0, transform: 'translateY(-25%)' }), animate('{{showTransitionParams}}')]),
            transition(':leave', [animate('{{hideTransitionParams}}', style({ height: 0, marginTop: 0, marginBottom: 0, marginLeft: 0, marginRight: 0, opacity: 0 }))])
        ])
    ], changeDetection: i0.ChangeDetectionStrategy.OnPush, encapsulation: i0.ViewEncapsulation.None });
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "14.0.7", ngImport: i0, type: Messages, decorators: [{
            type: Component,
            args: [{ selector: 'p-messages', template: `
        <div class="p-messages p-component" role="alert" [ngStyle]="style" [class]="styleClass">
            <ng-container *ngIf="!contentTemplate; else staticMessage">
                <div
                    *ngFor="let msg of value; let i = index"
                    [class]="'p-message p-message-' + msg.severity"
                    role="alert"
                    [@messageAnimation]="{ value: 'visible', params: { showTransitionParams: showTransitionOptions, hideTransitionParams: hideTransitionOptions } }"
                >
                    <div class="p-message-wrapper">
                        <span
                            [class]="'p-message-icon pi' + (msg.icon ? ' ' + msg.icon : '')"
                            [ngClass]="{ 'pi-info-circle': msg.severity === 'info', 'pi-check': msg.severity === 'success', 'pi-exclamation-triangle': msg.severity === 'warn', 'pi-times-circle': msg.severity === 'error' }"
                        ></span>
                        <ng-container *ngIf="!escape; else escapeOut">
                            <span *ngIf="msg.summary" class="p-message-summary" [innerHTML]="msg.summary"></span>
                            <span *ngIf="msg.detail" class="p-message-detail" [innerHTML]="msg.detail"></span>
                        </ng-container>
                        <ng-template #escapeOut>
                            <span *ngIf="msg.summary" class="p-message-summary">{{ msg.summary }}</span>
                            <span *ngIf="msg.detail" class="p-message-detail">{{ msg.detail }}</span>
                        </ng-template>
                        <button class="p-message-close p-link" (click)="removeMessage(i)" *ngIf="closable" type="button" pRipple>
                            <i class="p-message-close-icon pi pi-times"></i>
                        </button>
                    </div>
                </div>
            </ng-container>
            <ng-template #staticMessage>
                <div [ngClass]="'p-message p-message-' + severity" role="alert">
                    <div class="p-message-wrapper">
                        <ng-container *ngTemplateOutlet="contentTemplate"></ng-container>
                    </div>
                </div>
            </ng-template>
        </div>
    `, animations: [
                        trigger('messageAnimation', [
                            transition(':enter', [style({ opacity: 0, transform: 'translateY(-25%)' }), animate('{{showTransitionParams}}')]),
                            transition(':leave', [animate('{{hideTransitionParams}}', style({ height: 0, marginTop: 0, marginBottom: 0, marginLeft: 0, marginRight: 0, opacity: 0 }))])
                        ])
                    ], changeDetection: ChangeDetectionStrategy.OnPush, encapsulation: ViewEncapsulation.None, host: {
                        class: 'p-element'
                    }, styles: [".p-message-wrapper{display:flex;align-items:center}.p-message-close{display:flex;align-items:center;justify-content:center}.p-message-close.p-link{margin-left:auto;overflow:hidden;position:relative}.p-messages .p-message.ng-animating{overflow:hidden}\n"] }]
        }], ctorParameters: function () { return [{ type: i1.MessageService, decorators: [{
                    type: Optional
                }] }, { type: i0.ElementRef }, { type: i0.ChangeDetectorRef }]; }, propDecorators: { value: [{
                type: Input
            }], closable: [{
                type: Input
            }], style: [{
                type: Input
            }], styleClass: [{
                type: Input
            }], enableService: [{
                type: Input
            }], key: [{
                type: Input
            }], escape: [{
                type: Input
            }], severity: [{
                type: Input
            }], showTransitionOptions: [{
                type: Input
            }], hideTransitionOptions: [{
                type: Input
            }], templates: [{
                type: ContentChildren,
                args: [PrimeTemplate]
            }], valueChange: [{
                type: Output
            }] } });
export class MessagesModule {
}
MessagesModule.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "14.0.7", ngImport: i0, type: MessagesModule, deps: [], target: i0.ɵɵFactoryTarget.NgModule });
MessagesModule.ɵmod = i0.ɵɵngDeclareNgModule({ minVersion: "14.0.0", version: "14.0.7", ngImport: i0, type: MessagesModule, declarations: [Messages], imports: [CommonModule, RippleModule], exports: [Messages] });
MessagesModule.ɵinj = i0.ɵɵngDeclareInjector({ minVersion: "12.0.0", version: "14.0.7", ngImport: i0, type: MessagesModule, imports: [CommonModule, RippleModule] });
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "14.0.7", ngImport: i0, type: MessagesModule, decorators: [{
            type: NgModule,
            args: [{
                    imports: [CommonModule, RippleModule],
                    exports: [Messages],
                    declarations: [Messages]
                }]
        }] });
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibWVzc2FnZXMuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi9zcmMvYXBwL2NvbXBvbmVudHMvbWVzc2FnZXMvbWVzc2FnZXMudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUEsT0FBTyxFQUFFLFFBQVEsRUFBRSxTQUFTLEVBQWEsS0FBSyxFQUFFLE1BQU0sRUFBRSxZQUFZLEVBQW9CLFFBQVEsRUFBYyx1QkFBdUIsRUFBRSxlQUFlLEVBQTBCLGlCQUFpQixFQUFxQixNQUFNLGVBQWUsQ0FBQztBQUM1TyxPQUFPLEVBQUUsWUFBWSxFQUFFLE1BQU0saUJBQWlCLENBQUM7QUFDL0MsT0FBTyxFQUFFLE9BQU8sRUFBRSxLQUFLLEVBQUUsVUFBVSxFQUFFLE9BQU8sRUFBRSxNQUFNLHFCQUFxQixDQUFDO0FBQzFFLE9BQU8sRUFBVyxhQUFhLEVBQWtCLE1BQU0sYUFBYSxDQUFDO0FBRXJFLE9BQU8sRUFBRSxZQUFZLEVBQUUsTUFBTSxnQkFBZ0IsQ0FBQzs7Ozs7QUFzRDlDLE1BQU0sT0FBTyxRQUFRO0lBK0JqQixZQUErQixjQUE4QixFQUFTLEVBQWMsRUFBUyxFQUFxQjtRQUFuRixtQkFBYyxHQUFkLGNBQWMsQ0FBZ0I7UUFBUyxPQUFFLEdBQUYsRUFBRSxDQUFZO1FBQVMsT0FBRSxHQUFGLEVBQUUsQ0FBbUI7UUE1QnpHLGFBQVEsR0FBWSxJQUFJLENBQUM7UUFNekIsa0JBQWEsR0FBWSxJQUFJLENBQUM7UUFJOUIsV0FBTSxHQUFZLElBQUksQ0FBQztRQUl2QiwwQkFBcUIsR0FBVyxnQkFBZ0IsQ0FBQztRQUVqRCwwQkFBcUIsR0FBVyxzQ0FBc0MsQ0FBQztRQUl0RSxnQkFBVyxHQUE0QixJQUFJLFlBQVksRUFBYSxDQUFDO0lBUXNDLENBQUM7SUFFdEgsa0JBQWtCO1FBQ2QsSUFBSSxDQUFDLFNBQVMsQ0FBQyxPQUFPLENBQUMsQ0FBQyxJQUFJLEVBQUUsRUFBRTtZQUM1QixRQUFRLElBQUksQ0FBQyxPQUFPLEVBQUUsRUFB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QUFLO2dCQUVHLEtBQUs7c0JBQWIsS0FBSztnQkFFRyxVQUFVO3NCQUFsQixLQUFLO2dCQUVHLGFBQWE7c0JBQXJCLEtBQUs7Z0JBRUcsR0FBRztzQkFBWCxLQUFLO2dCQUVHLE1BQU07c0JBQWQsS0FBSztnQkFFRyxRQUFRO3NCQUFoQixLQUFLO2dCQUVHLHFCQUFxQjtzQkFBN0IsS0FBSztnQkFFRyxxQkFBcUI7c0JBQTdCLEtBQUs7Z0JBRTBCLFNBQVM7c0JBQXhDLGVBQWU7dUJBQUMsYUFBYTtnQkFFcEIsV0FBVztzQkFBcEIsTUFBTTs7QUFvSFgsTUFBTSxPQUFPLGNBQWM7OzJHQUFkLGNBQWM7NEdBQWQsY0FBYyxpQkEzSWQsUUFBUSxhQXVJUCxZQUFZLEVBQUUsWUFBWSxhQXZJM0IsUUFBUTs0R0EySVIsY0FBYyxZQUpiLFlBQVksRUFBRSxZQUFZOzJGQUkzQixjQUFjO2tCQUwxQixRQUFRO21CQUFDO29CQUNOLE9BQU8sRUFBRSxDQUFDLFlBQVksRUFBRSxZQUFZLENBQUM7b0JBQ3JDLE9BQU8sRUFBRSxDQUFDLFFBQVEsQ0FBQztvQkFDbkIsWUFBWSxFQUFFLENBQUMsUUFBUSxDQUFDO2lCQUMzQiIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7IE5nTW9kdWxlLCBDb21wb25lbnQsIE9uRGVzdHJveSwgSW5wdXQsIE91dHB1dCwgRXZlbnRFbWl0dGVyLCBBZnRlckNvbnRlbnRJbml0LCBPcHRpb25hbCwgRWxlbWVudFJlZiwgQ2hhbmdlRGV0ZWN0aW9uU3RyYXRlZ3ksIENvbnRlbnRDaGlsZHJlbiwgUXVlcnlMaXN0LCBUZW1wbGF0ZVJlZiwgVmlld0VuY2Fwc3VsYXRpb24sIENoYW5nZURldGVjdG9yUmVmIH0gZnJvbSAnQGFuZ3VsYXIvY29yZSc7XG5pbXBvcnQgeyBDb21tb25Nb2R1bGUgfSBmcm9tICdAYW5ndWxhci9jb21tb24nO1xuaW1wb3J0IHsgdHJpZ2dlciwgc3R5bGUsIHRyYW5zaXRpb24sIGFuaW1hdGUgfSBmcm9tICdAYW5ndWxhci9hbmltYXRpb25zJztcbmltcG9ydCB7IE1lc3NhZ2UsIFByaW1lVGVtcGxhdGUsIE1lc3NhZ2VTZXJ2aWNlIH0gZnJvbSAncHJpbWVuZy9hcGknO1xuaW1wb3J0IHsgU3Vic2NyaXB0aW9uIH0gZnJvbSAncnhqcyc7XG5pbXBvcnQgeyBSaXBwbGVNb2R1bGUgfSBmcm9tICdwcmltZW5nL3JpcHBsZSc7XG5cbkBDb21wb25lbnQoe1xuICAgIHNlbGVjdG9yOiAncC1tZXNzYWdlcycsXG4gICAgdGVtcGxhdGU6IGBcbiAgICAgICAgPGRpdiBjbGFzcz1cInAtbWVzc2FnZXMgcC1jb21wb25lbnRcIiByb2xlPVwiYWxlcnRcIiBbbmdTdHlsZV09XCJzdHlsZVwiIFtjbGFzc109XCJzdHlsZUNsYXNzXCI+XG4gICAgICAgICAgICA8bmctY29udGFpbmVyICpuZ0lmPVwiIWNvbnRlbnRUZW1wbGF0ZTsgZWxzZSBzdGF0aWNNZXNzYWdlXCI+XG4gICAgICAgICAgICAgICAgPGRpdlxuICAgICAgICAgICAgICAgICAgICAqbmdGb3I9XCJsZXQgbXNnIG9mIHZhbHVlOyBsZXQgaSA9IGluZGV4XCJcbiAgICAgICAgICAgICAgICAgICAgW2NsYXNzXT1cIidwLW1lc3NhZ2UgcC1tZXNzYWdlLScgKyBtc2cuc2V2ZXJpdHlcIlxuICAgICAgICAgICAgICAgICAgICByb2xlPVwiYWxlcnRcIlxuICAgICAgICAgICAgICAgICAgICBbQG1lc3NhZ2VBbmltYXRpb25dPVwieyB2YWx1ZTogJ3Zpc2libGUnLCBwYXJhbXM6IHsgc2hvd1RyYW5zaXRpb25QYXJhbXM6IHNob3dUcmFuc2l0aW9uT3B0aW9ucywgaGlkZVRyYW5zaXRpb25QYXJhbXM6IGhpZGVUcmFuc2l0aW9uT3B0aW9ucyB9IH1cIlxuICAgICAgICAgICAgICAgID5cbiAgICAgICAgICAgICAgICAgICAgPGRpdiBjbGFzcz1cInAtbWVzc2FnZS13cmFwcGVyXCI+XG4gICAgICAgICAgICAgICAgICAgICAgICA8c3BhblxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIFtjbGFzc109XCIncC1tZXNzYWdlLWljb24gcGknICsgKG1zZy5pY29uID8gJyAnICsgbXNnLmljb24gOiAnJylcIlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIFtuZ0NsYXNzXT1cInsgJ3BpLWluZm8tY2lyY2xlJzogbXNnLnNldmVyaXR5ID09PSAnaW5mbycsICdwaS1jaGVjayc6IG1zZy5zZXZlcml0eSA9PT0gJ3N1Y2Nlc3MnLCAncGktZXhjbGFtYXRpb24tdHJpYW5nbGUnOiBtc2cuc2V2ZXJpdHkgPT09ICd3YXJuJywgJ3BpLXRpbWVzLWNpcmNsZSc6IG1zZy5zZXZlcml0eSA9PT0gJ2Vycm9yJyB9XCJcbiAgICAgICAgICAgICAgICAgICAgICAgID48L3NwYW4+XG4gICAgICAgICAgICAgICAgICAgICAgICA8bmctY29udGFpbmVyICpuZ0lmPVwiIWVzY2FwZTsgZWxzZSBlc2NhcGVPdXRcIj5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICA8c3BhbiAqbmdJZj1cIm1zZy5zdW1tYXJ5XCIgY2xhc3M9XCJwLW1lc3NhZ2Utc3VtbWFyeVwiIFtpbm5lckhUTUxdPVwibXNnLnN1bW1hcnlcIj48L3NwYW4+XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgPHNwYW4gKm5nSWY9XCJtc2cuZGV0YWlsXCIgY2xhc3M9XCJwLW1lc3NhZ2UtZGV0YWlsXCIgW2lubmVySFRNTF09XCJtc2cuZGV0YWlsXCI+PC9zcGFuPlxuICAgICAgICAgICAgICAgICAgICAgICAgPC9uZy1jb250YWluZXI+XG4gICAgICAgICAgICAgICAgICAgICAgICA8bmctdGVtcGxhdGUgI2VzY2FwZU91dD5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICA8c3BhbiAqbmdJZj1cIm1zZy5zdW1tYXJ5XCIgY2xhc3M9XCJwLW1lc3NhZ2Utc3VtbWFyeVwiPnt7IG1zZy5zdW1tYXJ5IH19PC9zcGFuPlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIDxzcGFuICpuZ0lmPVwibXNnLmRldGFpbFwiIGNsYXNzPVwicC1tZXNzYWdlLWRldGFpbFwiPnt7IG1zZy5kZXRhaWwgfX08L3NwYW4+XG4gICAgICAgICAgICAgICAgICAgICAgICA8L25nLXRlbXBsYXRlPlxuICAgICAgICAgICAgICAgICAgICAgICAgPGJ1dHRvbiBjbGFzcz1cInAtbWVzc2FnZS1jbG9zZSBwLWxpbmtcIiAoY2xpY2spPVwicmVtb3ZlTWVzc2FnZShpKVwiICpuZ0lmPVwiY2xvc2FibGVcIiB0eXBlPVwiYnV0dG9uXCIgcFJpcHBsZT5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICA8aSBjbGFzcz1cInAtbWVzc2FnZS1jbG9zZS1pY29uIHBpIHBpLXRpbWVzXCI+PC9pPlxuICAgICAgICAgICAgICAgICAgICAgICAgPC9idXR0b24+XG4gICAgICAgICAgICAgICAgICAgIDwvZGl2PlxuICAgICAgICAgICAgICAgIDwvZGl2PlxuICAgICAgICAgICAgPC9uZy1jb250YWluZXI+XG4gICAgICAgICAgICA8bmctdGVtcGxhdGUgI3N0YXRpY01lc3NhZ2U+XG4gICAgICAgICAgICAgICAgPGRpdiBbbmdDbGFzc109XCIncC1tZXNzYWdlIHAtbWVzc2FnZS0nICsgc2V2ZXJpdHlcIiByb2xlPVwiYWxlcnRcIj5cbiAgICAgICAgICAgICAgICAgICAgPGRpdiBjbGFzcz1cInAtbWVzc2FnZS13cmFwcGVyXCI+XG4gICAgICAgICAgICAgICAgICAgICAgICA8bmctY29udGFpbmVyICpuZ1RlbXBsYXRlT3V0bGV0PVwiY29udGVudFRlbXBsYXRlXCI+PC9uZy1jb250YWluZXI+XG4gICAgICAgICAgICAgICAgICAgIDwvZGl2PlxuICAgICAgICAgICAgICAgIDwvZGl2PlxuICAgICAgICAgICAgPC9uZy10ZW1wbGF0ZT5cbiAgICAgICAgPC9kaXY+XG4gICAgYCxcbiAgICBhbmltYXRpb25zOiBbXG4gICAgICAgIHRyaWdnZXIoJ21lc3NhZ2VBbmltYXRpb24nLCBbXG4gICAgICAgICAgICB0cmFuc2l0aW9uKCc6ZW50ZXInLCBbc3R5bGUoeyBvcGFjaXR5OiAwLCB0cmFuc2Zvcm06ICd0cmFuc2xhdGVZKC0yNSUpJyB9KSwgYW5pbWF0ZSgne3tzaG93VHJhbnNpdGlvblBhcmFtc319JyldKSxcbiAgICAgICAgICAgIHRyYW5zaXRpb24oJzpsZWF2ZScsIFthbmltYXRlKCd7e2hpZGVUcmFuc2l0aW9uUGFyYW1zfX0nLCBzdHlsZSh7IGhlaWdodDogMCwgbWFyZ2luVG9wOiAwLCBtYXJnaW5Cb3R0b206IDAsIG1hcmdpbkxlZnQ6IDAsIG1hcmdpblJpZ2h0OiAwLCBvcGFjaXR5OiAwIH0pKV0pXG4gICAgICAgIF0pXG4gICAgXSxcbiAgICBjaGFuZ2VEZXRlY3Rpb246IENoYW5nZURldGVjdGlvblN0cmF0ZWd5Lk9uUHVzaCxcbiAgICBlbmNhcHN1bGF0aW9uOiBWaWV3RW5jYXBzdWxhdGlvbi5Ob25lLFxuICAgIHN0eWxlVXJsczogWycuL21lc3NhZ2VzLmNzcyddLFxuICAgIGhvc3Q6IHtcbiAgICAgICAgY2xhc3M6ICdwLWVsZW1lbnQnXG4gICAgfVxufSlcbmV4cG9ydCBjbGFzcyBNZXNzYWdlcyBpbXBsZW1lbnRzIEFmdGVyQ29udGVudEluaXQsIE9uRGVzdHJveSB7XG4gICAgQElucHV0KCkgdmFsdWU6IE1lc3NhZ2VbXTtcblxuICAgIEBJbnB1dCgpIGNsb3NhYmxlOiBib29sZWFuID0gdHJ1ZTtcblxuICAgIEBJbnB1dCgpIHN0eWxlOiBhbnk7XG5cbiAgICBASW5wdXQoKSBzdHlsZUNsYXNzOiBzdHJpbmc7XG5cbiAgICBASW5wdXQoKSBlbmFibGVTZXJ2aWNlOiBib29sZWFuID0gdHJ1ZTtcblxuICAgIEBJbnB1dCgpIGtleTogc3RyaW5nO1xuXG4gICAgQElucHV0KCkgZXNjYXBlOiBib29sZWFuID0gdHJ1ZTtcblxuICAgIEBJbnB1dCgpIHNldmVyaXR5OiBzdHJpbmc7XG5cbiAgICBASW5wdXQoKSBzaG93VHJhbnNpdGlvbk9wdGlvbnM6IHN0cmluZyA9ICczMDBtcyBlYXNlLW91dCc7XG5cbiAgICBASW5wdXQoKSBoaWRlVHJhbnNpdGlvbk9wdGlvbnM6IHN0cmluZyA9ICcyMDBtcyBjdWJpYy1iZXppZXIoMC44NiwgMCwgMC4wNywgMSknO1xuXG4gICAgQENvbnRlbnRDaGlsZHJlbihQcmltZVRlbXBsYXRlKSB0ZW1wbGF0ZXM6IFF1ZXJ5TGlzdDxhbnk+O1xuXG4gICAgQE91dHB1dCgpIHZhbHVlQ2hhbmdlOiBFdmVudEVtaXR0ZXI8TWVzc2FnZVtdPiA9IG5ldyBFdmVudEVtaXR0ZXI8TWVzc2FnZVtdPigpO1xuXG4gICAgbWVzc2FnZVN1YnNjcmlwdGlvbjogU3Vic2NyaXB0aW9uO1xuXG4gICAgY2xlYXJTdWJzY3JpcHRpb246IFN1YnNjcmlwdGlvbjtcblxuICAgIGNvbnRlbnRUZW1wbGF0ZTogVGVtcGxhdGVSZWY8YW55PjtcblxuICAgIGNvbnN0cnVjdG9yKEBPcHRpb25hbCgpIHB1YmxpYyBtZXNzYWdlU2VydmljZTogTWVzc2FnZVNlcnZpY2UsIHB1YmxpYyBlbDogRWxlbWVudFJlZiwgcHVibGljIGNkOiBDaGFuZ2VEZXRlY3RvclJlZikge31cblxuICAgIG5nQWZ0ZXJDb250ZW50SW5pdCgpIHtcbiAgICAgICAgdGhpcy50ZW1wbGF0ZXMuZm9yRWFjaCgoaXRlbSkgPT4ge1xuICAgICAgICAgICAgc3dpdGNoIChpdGVtLmdldFR5cGUoKSkge1xuICAgICAgICAgICAgICAgIGNhc2UgJ2NvbnRlbnQnOlxuICAgICAgICAgICAgICAgICAgICB0aGlzLmNvbnRlbnRUZW1wbGF0ZSA9IGl0ZW0udGVtcGxhdGU7XG4gICAgICAgICAgICAgICAgICAgIGJyZWFrO1xuXG4gICAgICAgICAgICAgICAgZGVmYXVsdDpcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5jb250ZW50VGVtcGxhdGUgPSBpdGVtLnRlbXBsYXRlO1xuICAgICAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgIH1cbiAgICAgICAgfSk7XG5cbiAgICAgICAgaWYgKHRoaXMubWVzc2FnZVNlcnZpY2UgJiYgdGhpcy5lbmFibGVTZXJ2aWNlICYmICF0aGlzLmNvbnRlbnRUZW1wbGF0ZSkge1xuICAgICAgICAgICAgdGhpcy5tZXNzYWdlU3Vic2NyaXB0aW9uID0gdGhpcy5tZXNzYWdlU2VydmljZS5tZXNzYWdlT2JzZXJ2ZXIuc3Vic2NyaWJlKChtZXNzYWdlczogYW55KSA9PiB7XG4gICAgICAgICAgICAgICAgaWYgKG1lc3NhZ2VzKSB7XG4gICAgICAgICAgICAgICAgICAgIGlmIChtZXNzYWdlcyBpbnN0YW5jZW9mIEFycmF5KSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBsZXQgZmlsdGVyZWRNZXNzYWdlcyA9IG1lc3NhZ2VzLmZpbHRlcigobSkgPT4gdGhpcy5rZXkgPT09IG0ua2V5KTtcbiAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMudmFsdWUgPSB0aGlzLnZhbHVlID8gWy4uLnRoaXMudmFsdWUsIC4uLmZpbHRlcmVkTWVzc2FnZXNdIDogWy4uLmZpbHRlcmVkTWVzc2FnZXNdO1xuICAgICAgICAgICAgICAgICAgICB9IGVsc2UgaWYgKHRoaXMua2V5ID09PSBtZXNzYWdlcy5rZXkpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMudmFsdWUgPSB0aGlzLnZhbHVlID8gWy4uLnRoaXMudmFsdWUsIC4uLlttZXNzYWdlc11dIDogW21lc3NhZ2VzXTtcbiAgICAgICAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAgICAgICAgIHRoaXMuY2QubWFya0ZvckNoZWNrKCk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfSk7XG5cbiAgICAgICAgICAgIHRoaXMuY2xlYXJTdWJzY3JpcHRpb24gPSB0aGlzLm1lc3NhZ2VTZXJ2aWNlLmNsZWFyT2JzZXJ2ZXIuc3Vic2NyaWJlKChrZXkpID0+IHtcbiAgICAgICAgICAgICAgICBpZiAoa2V5KSB7XG4gICAgICAgICAgICAgICAgICAgIGlmICh0aGlzLmtleSA9PT0ga2V5KSB7XG4gICAgICAgICAgICAgICAgICAgICAgICB0aGlzLnZhbHVlID0gbnVsbDtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgIHRoaXMudmFsdWUgPSBudWxsO1xuICAgICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgICAgIHRoaXMuY2QubWFya0ZvckNoZWNrKCk7XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgfVxuICAgIH1cblxuICAgIGhhc01lc3NhZ2VzKCkge1xuICAgICAgICBsZXQgcGFyZW50RWwgPSB0aGlzLmVsLm5hdGl2ZUVsZW1lbnQucGFyZW50RWxlbWVudDtcbiAgICAgICAgaWYgKHBhcmVudEVsICYmIHBhcmVudEVsLm9mZnNldFBhcmVudCkge1xuICAgICAgICAgICAgcmV0dXJuIHRoaXMuY29udGVudFRlbXBsYXRlICE9IG51bGwgfHwgKHRoaXMudmFsdWUgJiYgdGhpcy52YWx1ZS5sZW5ndGggPiAwKTtcbiAgICAgICAgfVxuXG4gICAgICAgIHJldHVybiBmYWxzZTtcbiAgICB9XG5cbiAgICBjbGVhcigpIHtcbiAgICAgICAgdGhpcy52YWx1ZSA9IFtdO1xuICAgICAgICB0aGlzLnZhbHVlQ2hhbmdlLmVtaXQodGhpcy52YWx1ZSk7XG4gICAgfVxuXG4gICAgcmVtb3ZlTWVzc2FnZShpOiBudW1iZXIpIHtcbiAgICAgICAgdGhpcy52YWx1ZSA9IHRoaXMudmFsdWUuZmlsdGVyKChtc2csIGluZGV4KSA9PiBpbmRleCAhPT0gaSk7XG4gICAgICAgIHRoaXMudmFsdWVDaGFuZ2UuZW1pdCh0aGlzLnZhbHVlKTtcbiAgICB9XG5cbiAgICBnZXQgaWNvbigpOiBzdHJpbmcge1xuICAgICAgICBjb25zdCBzZXZlcml0eSA9IHRoaXMuc2V2ZXJpdHkgfHwgKHRoaXMuaGFzTWVzc2FnZXMoKSA/IHRoaXMudmFsdWVbMF0uc2V2ZXJpdHkgOiBudWxsKTtcblxuICAgICAgICBpZiAodGhpcy5oYXNNZXNzYWdlcygpKSB7XG4gICAgICAgICAgICBzd2l0Y2ggKHNldmVyaXR5KSB7XG4gICAgICAgICAgICAgICAgY2FzZSAnc3VjY2Vzcyc6XG4gICAgICAgICAgICAgICAgICAgIHJldHVybiAncGktY2hlY2snO1xuICAgICAgICAgICAgICAgICAgICBicmVhaztcblxuICAgICAgICAgICAgICAgIGNhc2UgJ2luZm8nOlxuICAgICAgICAgICAgICAgICAgICByZXR1cm4gJ3BpLWluZm8tY2lyY2xlJztcbiAgICAgICAgICAgICAgICAgICAgYnJlYWs7XG5cbiAgICAgICAgICAgICAgICBjYXNlICdlcnJvcic6XG4gICAgICAgICAgICAgICAgICAgIHJldHVybiAncGktdGltZXMnO1xuICAgICAgICAgICAgICAgICAgICBicmVhaztcblxuICAgICAgICAgICAgICAgIGNhc2UgJ3dhcm4nOlxuICAgICAgICAgICAgICAgICAgICByZXR1cm4gJ3BpLWV4Y2xhbWF0aW9uLXRyaWFuZ2xlJztcbiAgICAgICAgICAgICAgICAgICAgYnJlYWs7XG5cbiAgICAgICAgICAgICAgICBkZWZhdWx0OlxuICAgICAgICAgICAgICAgICAgICByZXR1cm4gJ3BpLWluZm8tY2lyY2xlJztcbiAgICAgICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cblxuICAgICAgICByZXR1cm4gbnVsbDtcbiAgICB9XG5cbiAgICBuZ09uRGVzdHJveSgpIHtcbiAgICAgICAgaWYgKHRoaXMubWVzc2FnZVN1YnNjcmlwdGlvbikge1xuICAgICAgICAgICAgdGhpcy5tZXNzYWdlU3Vic2NyaXB0aW9uLnVuc3Vic2NyaWJlKCk7XG4gICAgICAgIH1cblxuICAgICAgICBpZiAodGhpcy5jbGVhclN1YnNjcmlwdGlvbikge1xuICAgICAgICAgICAgdGhpcy5jbGVhclN1YnNjcmlwdGlvbi51bnN1YnNjcmliZSgpO1xuICAgICAgICB9XG4gICAgfVxufVxuXG5ATmdNb2R1bGUoe1xuICAgIGltcG9ydHM6IFtDb21tb25Nb2R1bGUsIFJpcHBsZU1vZHVsZV0sXG4gICAgZXhwb3J0czogW01lc3NhZ2VzXSxcbiAgICBkZWNsYXJhdGlvbnM6IFtNZXNzYWdlc11cbn0pXG5leHBvcnQgY2xhc3MgTWVzc2FnZXNNb2R1bGUge31cbiJdfQ==
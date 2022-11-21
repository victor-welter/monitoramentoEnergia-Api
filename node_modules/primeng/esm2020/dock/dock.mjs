import { NgModule, Component, Input, ChangeDetectionStrategy, ViewEncapsulation, ContentChildren } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PrimeTemplate, SharedModule } from 'primeng/api';
import { RouterModule } from '@angular/router';
import { RippleModule } from 'primeng/ripple';
import { TooltipModule } from 'primeng/tooltip';
import * as i0 from "@angular/core";
import * as i1 from "@angular/common";
import * as i2 from "@angular/router";
import * as i3 from "primeng/ripple";
import * as i4 from "primeng/tooltip";
export class Dock {
    constructor(el, cd) {
        this.el = el;
        this.cd = cd;
        this.model = null;
        this.position = 'bottom';
        this.currentIndex = -3;
    }
    ngAfterContentInit() {
        this.templates.forEach((item) => {
            switch (item.getType()) {
                case 'item':
                    this.itemTemplate = item.template;
                    break;
                default:
                    this.itemTemplate = item.template;
                    break;
            }
        });
    }
    onListMouseLeave() {
        this.currentIndex = -3;
        this.cd.markForCheck();
    }
    onItemMouseEnter(index) {
        this.currentIndex = index;
        if (index === 1) {
        }
        this.cd.markForCheck();
    }
    onItemClick(e, item) {
        if (item.command) {
            item.command({ originalEvent: e, item });
        }
    }
    get containerClass() {
        return {
            ['p-dock p-component ' + ` p-dock-${this.position}`]: true
        };
    }
    isClickableRouterLink(item) {
        return item.routerLink && !item.disabled;
    }
    itemClass(index) {
        return {
            'p-dock-item': true,
            'p-dock-item-second-prev': this.currentIndex - 2 === index,
            'p-dock-item-prev': this.currentIndex - 1 === index,
            'p-dock-item-current': this.currentIndex === index,
            'p-dock-item-next': this.currentIndex + 1 === index,
            'p-dock-item-second-next': this.currentIndex + 2 === index
        };
    }
}
Dock.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "14.0.7", ngImport: i0, type: Dock, deps: [{ token: i0.ElementRef }, { token: i0.ChangeDetectorRef }], target: i0.ɵɵFactoryTarget.Component });
Dock.ɵcmp = i0.ɵɵngDeclareComponent({ minVersion: "14.0.0", version: "14.0.7", type: Dock, selector: "p-dock", inputs: { id: "id", style: "style", styleClass: "styleClass", model: "model", position: "position" }, host: { classAttribute: "p-element" }, queries: [{ propertyName: "templates", predicate: PrimeTemplate }], ngImport: i0, template: `
        <div [attr.id]="id" [ngClass]="containerClass" [ngStyle]="style" [class]="styleClass">
            <div class="p-dock-list-container">
                <ul #list class="p-dock-list" role="menu" (mouseleave)="onListMouseLeave()">
                    <li *ngFor="let item of model; let i = index" [ngClass]="itemClass(i)" (mouseenter)="onItemMouseEnter(i)">
                        <a
                            *ngIf="isClickableRouterLink(item); else elseBlock"
                            pRipple
                            [routerLink]="item.routerLink"
                            [queryParams]="item.queryParams"
                            [ngClass]="{ 'p-disabled': item.disabled }"
                            class="p-dock-action"
                            role="menuitem"
                            [routerLinkActiveOptions]="item.routerLinkActiveOptions || { exact: false }"
                            (click)="onItemClick($event, item)"
                            (keydown.enter)="onItemClick($event, item, i)"
                            [target]="item.target"
                            [attr.id]="item.id"
                            [attr.tabindex]="item.disabled || readonly ? null : item.tabindex ? item.tabindex : '0'"
                            pTooltip
                            [tooltipOptions]="item.tooltipOptions"
                            [fragment]="item.fragment"
                            [queryParamsHandling]="item.queryParamsHandling"
                            [preserveFragment]="item.preserveFragment"
                            [skipLocationChange]="item.skipLocationChange"
                            [replaceUrl]="item.replaceUrl"
                            [state]="item.state"
                        >
                            <span class="p-dock-action-icon" *ngIf="item.icon && !itemTemplate" [ngClass]="item.icon" [ngStyle]="item.iconStyle"></span>
                            <ng-container *ngTemplateOutlet="itemTemplate; context: { $implicit: item }"></ng-container>
                        </a>
                        <ng-template #elseBlock>
                            <a
                                [tooltipPosition]="item.tooltipPosition"
                                [attr.href]="item.url || null"
                                class="p-dock-action"
                                role="menuitem"
                                pRipple
                                (click)="onItemClick($event, item)"
                                pTooltip
                                [tooltipOptions]="item.tooltipOptions"
                                [ngClass]="{ 'p-disabled': item.disabled }"
                                (keydown.enter)="onItemClick($event, item, i)"
                                [target]="item.target"
                                [attr.id]="item.id"
                                [attr.tabindex]="item.disabled || (i !== activeIndex && readonly) ? null : item.tabindex ? item.tabindex : '0'"
                            >
                                <span class="p-dock-action-icon" *ngIf="item.icon && !itemTemplate" [ngClass]="item.icon" [ngStyle]="item.iconStyle"></span>
                                <ng-container *ngTemplateOutlet="itemTemplate; context: { $implicit: item }"></ng-container>
                            </a>
                        </ng-template>
                    </li>
                </ul>
            </div>
        </div>
    `, isInline: true, styles: [".p-dock{position:absolute;z-index:1;display:flex;justify-content:center;align-items:center;pointer-events:none}.p-dock-list-container{display:flex;pointer-events:auto}.p-dock-list{margin:0;padding:0;list-style:none;display:flex;align-items:center;justify-content:center}.p-dock-item{transition:all .2s cubic-bezier(.4,0,.2,1);will-change:transform}.p-dock-action{display:flex;flex-direction:column;align-items:center;justify-content:center;position:relative;overflow:hidden;cursor:default}.p-dock-item-second-prev,.p-dock-item-second-next{transform:scale(1.2)}.p-dock-item-prev,.p-dock-item-next{transform:scale(1.4)}.p-dock-item-current{transform:scale(1.6);z-index:1}.p-dock-top{left:0;top:0;width:100%}.p-dock-top .p-dock-item{transform-origin:center top}.p-dock-bottom{left:0;bottom:0;width:100%}.p-dock-bottom .p-dock-item{transform-origin:center bottom}.p-dock-right{right:0;top:0;height:100%}.p-dock-right .p-dock-item{transform-origin:center right}.p-dock-right .p-dock-list{flex-direction:column}.p-dock-left{left:0;top:0;height:100%}.p-dock-left .p-dock-item{transform-origin:center left}.p-dock-left .p-dock-list{flex-direction:column}\n"], dependencies: [{ kind: "directive", type: i1.NgClass, selector: "[ngClass]", inputs: ["class", "ngClass"] }, { kind: "directive", type: i1.NgForOf, selector: "[ngFor][ngForOf]", inputs: ["ngForOf", "ngForTrackBy", "ngForTemplate"] }, { kind: "directive", type: i1.NgIf, selector: "[ngIf]", inputs: ["ngIf", "ngIfThen", "ngIfElse"] }, { kind: "directive", type: i1.NgTemplateOutlet, selector: "[ngTemplateOutlet]", inputs: ["ngTemplateOutletContext", "ngTemplateOutlet", "ngTemplateOutletInjector"] }, { kind: "directive", type: i1.NgStyle, selector: "[ngStyle]", inputs: ["ngStyle"] }, { kind: "directive", type: i2.RouterLinkWithHref, selector: "a[routerLink],area[routerLink]", inputs: ["target", "queryParams", "fragment", "queryParamsHandling", "preserveFragment", "skipLocationChange", "replaceUrl", "state", "relativeTo", "routerLink"] }, { kind: "directive", type: i3.Ripple, selector: "[pRipple]" }, { kind: "directive", type: i4.Tooltip, selector: "[pTooltip]", inputs: ["tooltipPosition", "tooltipEvent", "appendTo", "positionStyle", "tooltipStyleClass", "tooltipZIndex", "escape", "showDelay", "hideDelay", "life", "positionTop", "positionLeft", "fitContent", "pTooltip", "tooltipDisabled", "tooltipOptions"] }], changeDetection: i0.ChangeDetectionStrategy.OnPush, encapsulation: i0.ViewEncapsulation.None });
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "14.0.7", ngImport: i0, type: Dock, decorators: [{
            type: Component,
            args: [{ selector: 'p-dock', template: `
        <div [attr.id]="id" [ngClass]="containerClass" [ngStyle]="style" [class]="styleClass">
            <div class="p-dock-list-container">
                <ul #list class="p-dock-list" role="menu" (mouseleave)="onListMouseLeave()">
                    <li *ngFor="let item of model; let i = index" [ngClass]="itemClass(i)" (mouseenter)="onItemMouseEnter(i)">
                        <a
                            *ngIf="isClickableRouterLink(item); else elseBlock"
                            pRipple
                            [routerLink]="item.routerLink"
                            [queryParams]="item.queryParams"
                            [ngClass]="{ 'p-disabled': item.disabled }"
                            class="p-dock-action"
                            role="menuitem"
                            [routerLinkActiveOptions]="item.routerLinkActiveOptions || { exact: false }"
                            (click)="onItemClick($event, item)"
                            (keydown.enter)="onItemClick($event, item, i)"
                            [target]="item.target"
                            [attr.id]="item.id"
                            [attr.tabindex]="item.disabled || readonly ? null : item.tabindex ? item.tabindex : '0'"
                            pTooltip
                            [tooltipOptions]="item.tooltipOptions"
                            [fragment]="item.fragment"
                            [queryParamsHandling]="item.queryParamsHandling"
                            [preserveFragment]="item.preserveFragment"
                            [skipLocationChange]="item.skipLocationChange"
                            [replaceUrl]="item.replaceUrl"
                            [state]="item.state"
                        >
                            <span class="p-dock-action-icon" *ngIf="item.icon && !itemTemplate" [ngClass]="item.icon" [ngStyle]="item.iconStyle"></span>
                            <ng-container *ngTemplateOutlet="itemTemplate; context: { $implicit: item }"></ng-container>
                        </a>
                        <ng-template #elseBlock>
                            <a
                                [tooltipPosition]="item.tooltipPosition"
                                [attr.href]="item.url || null"
                                class="p-dock-action"
                                role="menuitem"
                                pRipple
                                (click)="onItemClick($event, item)"
                                pTooltip
                                [tooltipOptions]="item.tooltipOptions"
                                [ngClass]="{ 'p-disabled': item.disabled }"
                                (keydown.enter)="onItemClick($event, item, i)"
                                [target]="item.target"
                                [attr.id]="item.id"
                                [attr.tabindex]="item.disabled || (i !== activeIndex && readonly) ? null : item.tabindex ? item.tabindex : '0'"
                            >
                                <span class="p-dock-action-icon" *ngIf="item.icon && !itemTemplate" [ngClass]="item.icon" [ngStyle]="item.iconStyle"></span>
                                <ng-container *ngTemplateOutlet="itemTemplate; context: { $implicit: item }"></ng-container>
                            </a>
                        </ng-template>
                    </li>
                </ul>
            </div>
        </div>
    `, changeDetection: ChangeDetectionStrategy.OnPush, encapsulation: ViewEncapsulation.None, host: {
                        class: 'p-element'
                    }, styles: [".p-dock{position:absolute;z-index:1;display:flex;justify-content:center;align-items:center;pointer-events:none}.p-dock-list-container{display:flex;pointer-events:auto}.p-dock-list{margin:0;padding:0;list-style:none;display:flex;align-items:center;justify-content:center}.p-dock-item{transition:all .2s cubic-bezier(.4,0,.2,1);will-change:transform}.p-dock-action{display:flex;flex-direction:column;align-items:center;justify-content:center;position:relative;overflow:hidden;cursor:default}.p-dock-item-second-prev,.p-dock-item-second-next{transform:scale(1.2)}.p-dock-item-prev,.p-dock-item-next{transform:scale(1.4)}.p-dock-item-current{transform:scale(1.6);z-index:1}.p-dock-top{left:0;top:0;width:100%}.p-dock-top .p-dock-item{transform-origin:center top}.p-dock-bottom{left:0;bottom:0;width:100%}.p-dock-bottom .p-dock-item{transform-origin:center bottom}.p-dock-right{right:0;top:0;height:100%}.p-dock-right .p-dock-item{transform-origin:center right}.p-dock-right .p-dock-list{flex-direction:column}.p-dock-left{left:0;top:0;height:100%}.p-dock-left .p-dock-item{transform-origin:center left}.p-dock-left .p-dock-list{flex-direction:column}\n"] }]
        }], ctorParameters: function () { return [{ type: i0.ElementRef }, { type: i0.ChangeDetectorRef }]; }, propDecorators: { id: [{
                type: Input
            }], style: [{
                type: Input
            }], styleClass: [{
                type: Input
            }], model: [{
                type: Input
            }], position: [{
                type: Input
            }], templates: [{
                type: ContentChildren,
                args: [PrimeTemplate]
            }] } });
export class DockModule {
}
DockModule.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "14.0.7", ngImport: i0, type: DockModule, deps: [], target: i0.ɵɵFactoryTarget.NgModule });
DockModule.ɵmod = i0.ɵɵngDeclareNgModule({ minVersion: "14.0.0", version: "14.0.7", ngImport: i0, type: DockModule, declarations: [Dock], imports: [CommonModule, RouterModule, RippleModule, TooltipModule], exports: [Dock, SharedModule, TooltipModule, RouterModule] });
DockModule.ɵinj = i0.ɵɵngDeclareInjector({ minVersion: "12.0.0", version: "14.0.7", ngImport: i0, type: DockModule, imports: [CommonModule, RouterModule, RippleModule, TooltipModule, SharedModule, TooltipModule, RouterModule] });
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "14.0.7", ngImport: i0, type: DockModule, decorators: [{
            type: NgModule,
            args: [{
                    imports: [CommonModule, RouterModule, RippleModule, TooltipModule],
                    exports: [Dock, SharedModule, TooltipModule, RouterModule],
                    declarations: [Dock]
                }]
        }] });
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZG9jay5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uL3NyYy9hcHAvY29tcG9uZW50cy9kb2NrL2RvY2sudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUEsT0FBTyxFQUFFLFFBQVEsRUFBRSxTQUFTLEVBQUUsS0FBSyxFQUE0Qix1QkFBdUIsRUFBRSxpQkFBaUIsRUFBaUMsZUFBZSxFQUFnQyxNQUFNLGVBQWUsQ0FBQztBQUMvTSxPQUFPLEVBQUUsWUFBWSxFQUFFLE1BQU0saUJBQWlCLENBQUM7QUFDL0MsT0FBTyxFQUFFLGFBQWEsRUFBRSxZQUFZLEVBQUUsTUFBTSxhQUFhLENBQUM7QUFDMUQsT0FBTyxFQUFFLFlBQVksRUFBRSxNQUFNLGlCQUFpQixDQUFDO0FBQy9DLE9BQU8sRUFBRSxZQUFZLEVBQUUsTUFBTSxnQkFBZ0IsQ0FBQztBQUM5QyxPQUFPLEVBQUUsYUFBYSxFQUFFLE1BQU0saUJBQWlCLENBQUM7Ozs7OztBQW1FaEQsTUFBTSxPQUFPLElBQUk7SUFpQmIsWUFBb0IsRUFBYyxFQUFTLEVBQXFCO1FBQTVDLE9BQUUsR0FBRixFQUFFLENBQVk7UUFBUyxPQUFFLEdBQUYsRUFBRSxDQUFtQjtRQVZ2RCxVQUFLLEdBQVUsSUFBSSxDQUFDO1FBRXBCLGFBQVEsR0FBVyxRQUFRLENBQUM7UUFTakMsSUFBSSxDQUFDLFlBQVksR0FBRyxDQUFDLENBQUMsQ0FBQztJQUMzQixDQUFDO0lBRUQsa0JBQWtCO1FBQ2QsSUFBSSxDQUFDLFNBQVMsQ0FBQyxPQUFPLENBQUMsQ0FBQyxJQUFJLEVBQUUsRUFBRTtZQUM1QixRQUFRLElBQUksQ0FBQyxPQUFPLEVBQUUsRUFBRTtnQkFDcEIsS0FBSyxNQUFNO29CQUNQLElBQUksQ0FBQyxZQUFZLEdBQUcsSUFBSSxDQUFDLFFBQVEsQ0FBQztvQkFDbEMsTUFBTTtnQkFFVjtvQkFDSSxJQUFJLENBQUMsWUFBWSxHQUFHLElBQUksQ0FBQyxRQUFRLENBQUM7b0JBQ2xDLE1BQU07YUFD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LCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgeyBOZ01vZHVsZSwgQ29tcG9uZW50LCBJbnB1dCwgRWxlbWVudFJlZiwgQ29udGVudENoaWxkLCBDaGFuZ2VEZXRlY3Rpb25TdHJhdGVneSwgVmlld0VuY2Fwc3VsYXRpb24sIFRlbXBsYXRlUmVmLCBBZnRlckNvbnRlbnRJbml0LCBDb250ZW50Q2hpbGRyZW4sIFF1ZXJ5TGlzdCwgQ2hhbmdlRGV0ZWN0b3JSZWYgfSBmcm9tICdAYW5ndWxhci9jb3JlJztcbmltcG9ydCB7IENvbW1vbk1vZHVsZSB9IGZyb20gJ0Bhbmd1bGFyL2NvbW1vbic7XG5pbXBvcnQgeyBQcmltZVRlbXBsYXRlLCBTaGFyZWRNb2R1bGUgfSBmcm9tICdwcmltZW5nL2FwaSc7XG5pbXBvcnQgeyBSb3V0ZXJNb2R1bGUgfSBmcm9tICdAYW5ndWxhci9yb3V0ZXInO1xuaW1wb3J0IHsgUmlwcGxlTW9kdWxlIH0gZnJvbSAncHJpbWVuZy9yaXBwbGUnO1xuaW1wb3J0IHsgVG9vbHRpcE1vZHVsZSB9IGZyb20gJ3ByaW1lbmcvdG9vbHRpcCc7XG5cbkBDb21wb25lbnQoe1xuICAgIHNlbGVjdG9yOiAncC1kb2NrJyxcbiAgICB0ZW1wbGF0ZTogYFxuICAgICAgICA8ZGl2IFthdHRyLmlkXT1cImlkXCIgW25nQ2xhc3NdPVwiY29udGFpbmVyQ2xhc3NcIiBbbmdTdHlsZV09XCJzdHlsZVwiIFtjbGFzc109XCJzdHlsZUNsYXNzXCI+XG4gICAgICAgICAgICA8ZGl2IGNsYXNzPVwicC1kb2NrLWxpc3QtY29udGFpbmVyXCI+XG4gICAgICAgICAgICAgICAgPHVsICNsaXN0IGNsYXNzPVwicC1kb2NrLWxpc3RcIiByb2xlPVwibWVudVwiIChtb3VzZWxlYXZlKT1cIm9uTGlzdE1vdXNlTGVhdmUoKVwiPlxuICAgICAgICAgICAgICAgICAgICA8bGkgKm5nRm9yPVwibGV0IGl0ZW0gb2YgbW9kZWw7IGxldCBpID0gaW5kZXhcIiBbbmdDbGFzc109XCJpdGVtQ2xhc3MoaSlcIiAobW91c2VlbnRlcik9XCJvbkl0ZW1Nb3VzZUVudGVyKGkpXCI+XG4gICAgICAgICAgICAgICAgICAgICAgICA8YVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICpuZ0lmPVwiaXNDbGlja2FibGVSb3V0ZXJMaW5rKGl0ZW0pOyBlbHNlIGVsc2VCbG9ja1wiXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgcFJpcHBsZVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIFtyb3V0ZXJMaW5rXT1cIml0ZW0ucm91dGVyTGlua1wiXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgW3F1ZXJ5UGFyYW1zXT1cIml0ZW0ucXVlcnlQYXJhbXNcIlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIFtuZ0NsYXNzXT1cInsgJ3AtZGlzYWJsZWQnOiBpdGVtLmRpc2FibGVkIH1cIlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNsYXNzPVwicC1kb2NrLWFjdGlvblwiXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgcm9sZT1cIm1lbnVpdGVtXCJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBbcm91dGVyTGlua0FjdGl2ZU9wdGlvbnNdPVwiaXRlbS5yb3V0ZXJMaW5rQWN0aXZlT3B0aW9ucyB8fCB7IGV4YWN0OiBmYWxzZSB9XCJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAoY2xpY2spPVwib25JdGVtQ2xpY2soJGV2ZW50LCBpdGVtKVwiXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgKGtleWRvd24uZW50ZXIpPVwib25JdGVtQ2xpY2soJGV2ZW50LCBpdGVtLCBpKVwiXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgW3RhcmdldF09XCJpdGVtLnRhcmdldFwiXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgW2F0dHIuaWRdPVwiaXRlbS5pZFwiXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgW2F0dHIudGFiaW5kZXhdPVwiaXRlbS5kaXNhYmxlZCB8fCByZWFkb25seSA/IG51bGwgOiBpdGVtLnRhYmluZGV4ID8gaXRlbS50YWJpbmRleCA6ICcwJ1wiXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgcFRvb2x0aXBcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBbdG9vbHRpcE9wdGlvbnNdPVwiaXRlbS50b29sdGlwT3B0aW9uc1wiXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgW2ZyYWdtZW50XT1cIml0ZW0uZnJhZ21lbnRcIlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIFtxdWVyeVBhcmFtc0hhbmRsaW5nXT1cIml0ZW0ucXVlcnlQYXJhbXNIYW5kbGluZ1wiXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgW3ByZXNlcnZlRnJhZ21lbnRdPVwiaXRlbS5wcmVzZXJ2ZUZyYWdtZW50XCJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBbc2tpcExvY2F0aW9uQ2hhbmdlXT1cIml0ZW0uc2tpcExvY2F0aW9uQ2hhbmdlXCJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBbcmVwbGFjZVVybF09XCJpdGVtLnJlcGxhY2VVcmxcIlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIFtzdGF0ZV09XCJpdGVtLnN0YXRlXCJcbiAgICAgICAgICAgICAgICAgICAgICAgID5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICA8c3BhbiBjbGFzcz1cInAtZG9jay1hY3Rpb24taWNvblwiICpuZ0lmPVwiaXRlbS5pY29uICYmICFpdGVtVGVtcGxhdGVcIiBbbmdDbGFzc109XCJpdGVtLmljb25cIiBbbmdTdHlsZV09XCJpdGVtLmljb25TdHlsZVwiPjwvc3Bhbj5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICA8bmctY29udGFpbmVyICpuZ1RlbXBsYXRlT3V0bGV0PVwiaXRlbVRlbXBsYXRlOyBjb250ZXh0OiB7ICRpbXBsaWNpdDogaXRlbSB9XCI+PC9uZy1jb250YWluZXI+XG4gICAgICAgICAgICAgICAgICAgICAgICA8L2E+XG4gICAgICAgICAgICAgICAgICAgICAgICA8bmctdGVtcGxhdGUgI2Vsc2VCbG9jaz5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICA8YVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBbdG9vbHRpcFBvc2l0aW9uXT1cIml0ZW0udG9vbHRpcFBvc2l0aW9uXCJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgW2F0dHIuaHJlZl09XCJpdGVtLnVybCB8fCBudWxsXCJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgY2xhc3M9XCJwLWRvY2stYWN0aW9uXCJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgcm9sZT1cIm1lbnVpdGVtXCJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgcFJpcHBsZVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAoY2xpY2spPVwib25JdGVtQ2xpY2soJGV2ZW50LCBpdGVtKVwiXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHBUb29sdGlwXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIFt0b29sdGlwT3B0aW9uc109XCJpdGVtLnRvb2x0aXBPcHRpb25zXCJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgW25nQ2xhc3NdPVwieyAncC1kaXNhYmxlZCc6IGl0ZW0uZGlzYWJsZWQgfVwiXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIChrZXlkb3duLmVudGVyKT1cIm9uSXRlbUNsaWNrKCRldmVudCwgaXRlbSwgaSlcIlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBbdGFyZ2V0XT1cIml0ZW0udGFyZ2V0XCJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgW2F0dHIuaWRdPVwiaXRlbS5pZFwiXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIFthdHRyLnRhYmluZGV4XT1cIml0ZW0uZGlzYWJsZWQgfHwgKGkgIT09IGFjdGl2ZUluZGV4ICYmIHJlYWRvbmx5KSA/IG51bGwgOiBpdGVtLnRhYmluZGV4ID8gaXRlbS50YWJpbmRleCA6ICcwJ1wiXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgPlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8c3BhbiBjbGFzcz1cInAtZG9jay1hY3Rpb24taWNvblwiICpuZ0lmPVwiaXRlbS5pY29uICYmICFpdGVtVGVtcGxhdGVcIiBbbmdDbGFzc109XCJpdGVtLmljb25cIiBbbmdTdHlsZV09XCJpdGVtLmljb25TdHlsZVwiPjwvc3Bhbj5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPG5nLWNvbnRhaW5lciAqbmdUZW1wbGF0ZU91dGxldD1cIml0ZW1UZW1wbGF0ZTsgY29udGV4dDogeyAkaW1wbGljaXQ6IGl0ZW0gfVwiPjwvbmctY29udGFpbmVyPlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIDwvYT5cbiAgICAgICAgICAgICAgICAgICAgICAgIDwvbmctdGVtcGxhdGU+XG4gICAgICAgICAgICAgICAgICAgIDwvbGk+XG4gICAgICAgICAgICAgICAgPC91bD5cbiAgICAgICAgICAgIDwvZGl2PlxuICAgICAgICA8L2Rpdj5cbiAgICBgLFxuICAgIGNoYW5nZURldGVjdGlvbjogQ2hhbmdlRGV0ZWN0aW9uU3RyYXRlZ3kuT25QdXNoLFxuICAgIGVuY2Fwc3VsYXRpb246IFZpZXdFbmNhcHN1bGF0aW9uLk5vbmUsXG4gICAgc3R5bGVVcmxzOiBbJy4vZG9jay5jc3MnXSxcbiAgICBob3N0OiB7XG4gICAgICAgIGNsYXNzOiAncC1lbGVtZW50J1xuICAgIH1cbn0pXG5leHBvcnQgY2xhc3MgRG9jayBpbXBsZW1lbnRzIEFmdGVyQ29udGVudEluaXQge1xuICAgIEBJbnB1dCgpIGlkOiBzdHJpbmc7XG5cbiAgICBASW5wdXQoKSBzdHlsZTogYW55O1xuXG4gICAgQElucHV0KCkgc3R5bGVDbGFzczogc3RyaW5nO1xuXG4gICAgQElucHV0KCkgbW9kZWw6IGFueVtdID0gbnVsbDtcblxuICAgIEBJbnB1dCgpIHBvc2l0aW9uOiBzdHJpbmcgPSAnYm90dG9tJztcblxuICAgIEBDb250ZW50Q2hpbGRyZW4oUHJpbWVUZW1wbGF0ZSkgdGVtcGxhdGVzOiBRdWVyeUxpc3Q8YW55PjtcblxuICAgIGl0ZW1UZW1wbGF0ZTogVGVtcGxhdGVSZWY8YW55PjtcblxuICAgIGN1cnJlbnRJbmRleDogbnVtYmVyO1xuXG4gICAgY29uc3RydWN0b3IocHJpdmF0ZSBlbDogRWxlbWVudFJlZiwgcHVibGljIGNkOiBDaGFuZ2VEZXRlY3RvclJlZikge1xuICAgICAgICB0aGlzLmN1cnJlbnRJbmRleCA9IC0zO1xuICAgIH1cblxuICAgIG5nQWZ0ZXJDb250ZW50SW5pdCgpIHtcbiAgICAgICAgdGhpcy50ZW1wbGF0ZXMuZm9yRWFjaCgoaXRlbSkgPT4ge1xuICAgICAgICAgICAgc3dpdGNoIChpdGVtLmdldFR5cGUoKSkge1xuICAgICAgICAgICAgICAgIGNhc2UgJ2l0ZW0nOlxuICAgICAgICAgICAgICAgICAgICB0aGlzLml0ZW1UZW1wbGF0ZSA9IGl0ZW0udGVtcGxhdGU7XG4gICAgICAgICAgICAgICAgICAgIGJyZWFrO1xuXG4gICAgICAgICAgICAgICAgZGVmYXVsdDpcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5pdGVtVGVtcGxhdGUgPSBpdGVtLnRlbXBsYXRlO1xuICAgICAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgIH1cbiAgICAgICAgfSk7XG4gICAgfVxuXG4gICAgb25MaXN0TW91c2VMZWF2ZSgpIHtcbiAgICAgICAgdGhpcy5jdXJyZW50SW5kZXggPSAtMztcbiAgICAgICAgdGhpcy5jZC5tYXJrRm9yQ2hlY2soKTtcbiAgICB9XG5cbiAgICBvbkl0ZW1Nb3VzZUVudGVyKGluZGV4KSB7XG4gICAgICAgIHRoaXMuY3VycmVudEluZGV4ID0gaW5kZXg7XG5cbiAgICAgICAgaWYgKGluZGV4ID09PSAxKSB7XG4gICAgICAgIH1cblxuICAgICAgICB0aGlzLmNkLm1hcmtGb3JDaGVjaygpO1xuICAgIH1cblxuICAgIG9uSXRlbUNsaWNrKGUsIGl0ZW0pIHtcbiAgICAgICAgaWYgKGl0ZW0uY29tbWFuZCkge1xuICAgICAgICAgICAgaXRlbS5jb21tYW5kKHsgb3JpZ2luYWxFdmVudDogZSwgaXRlbSB9KTtcbiAgICAgICAgfVxuICAgIH1cblxuICAgIGdldCBjb250YWluZXJDbGFzcygpIHtcbiAgICAgICAgcmV0dXJuIHtcbiAgICAgICAgICAgIFsncC1kb2NrIHAtY29tcG9uZW50ICcgKyBgIHAtZG9jay0ke3RoaXMucG9zaXRpb259YF06IHRydWVcbiAgICAgICAgfTtcbiAgICB9XG5cbiAgICBpc0NsaWNrYWJsZVJvdXRlckxpbmsoaXRlbTogYW55KSB7XG4gICAgICAgIHJldHVybiBpdGVtLnJvdXRlckxpbmsgJiYgIWl0ZW0uZGlzYWJsZWQ7XG4gICAgfVxuXG4gICAgaXRlbUNsYXNzKGluZGV4KSB7XG4gICAgICAgIHJldHVybiB7XG4gICAgICAgICAgICAncC1kb2NrLWl0ZW0nOiB0cnVlLFxuICAgICAgICAgICAgJ3AtZG9jay1pdGVtLXNlY29uZC1wcmV2JzogdGhpcy5jdXJyZW50SW5kZXggLSAyID09PSBpbmRleCxcbiAgICAgICAgICAgICdwLWRvY2staXRlbS1wcmV2JzogdGhpcy5jdXJyZW50SW5kZXggLSAxID09PSBpbmRleCxcbiAgICAgICAgICAgICdwLWRvY2staXRlbS1jdXJyZW50JzogdGhpcy5jdXJyZW50SW5kZXggPT09IGluZGV4LFxuICAgICAgICAgICAgJ3AtZG9jay1pdGVtLW5leHQnOiB0aGlzLmN1cnJlbnRJbmRleCArIDEgPT09IGluZGV4LFxuICAgICAgICAgICAgJ3AtZG9jay1pdGVtLXNlY29uZC1uZXh0JzogdGhpcy5jdXJyZW50SW5kZXggKyAyID09PSBpbmRleFxuICAgICAgICB9O1xuICAgIH1cbn1cblxuQE5nTW9kdWxlKHtcbiAgICBpbXBvcnRzOiBbQ29tbW9uTW9kdWxlLCBSb3V0ZXJNb2R1bGUsIFJpcHBsZU1vZHVsZSwgVG9vbHRpcE1vZHVsZV0sXG4gICAgZXhwb3J0czogW0RvY2ssIFNoYXJlZE1vZHVsZSwgVG9vbHRpcE1vZHVsZSwgUm91dGVyTW9kdWxlXSxcbiAgICBkZWNsYXJhdGlvbnM6IFtEb2NrXVxufSlcbmV4cG9ydCBjbGFzcyBEb2NrTW9kdWxlIHt9XG4iXX0=
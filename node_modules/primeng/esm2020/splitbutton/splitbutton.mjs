import { NgModule, Component, Input, Output, EventEmitter, ViewChild, ChangeDetectionStrategy, ViewEncapsulation, ContentChildren } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PrimeTemplate } from 'primeng/api';
import { ButtonModule } from 'primeng/button';
import { TieredMenuModule } from 'primeng/tieredmenu';
import * as i0 from "@angular/core";
import * as i1 from "@angular/common";
import * as i2 from "primeng/button";
import * as i3 from "primeng/tieredmenu";
export class SplitButton {
    constructor() {
        this.iconPos = 'left';
        this.onClick = new EventEmitter();
        this.onDropdownClick = new EventEmitter();
        this.showTransitionOptions = '.12s cubic-bezier(0, 0, 0.2, 1)';
        this.hideTransitionOptions = '.1s linear';
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
    onDefaultButtonClick(event) {
        this.onClick.emit(event);
    }
    onDropdownButtonClick(event) {
        this.onDropdownClick.emit(event);
        this.menu.toggle({ currentTarget: this.containerViewChild.nativeElement, relativeAlign: this.appendTo == null });
    }
}
SplitButton.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "14.0.7", ngImport: i0, type: SplitButton, deps: [], target: i0.ɵɵFactoryTarget.Component });
SplitButton.ɵcmp = i0.ɵɵngDeclareComponent({ minVersion: "14.0.0", version: "14.0.7", type: SplitButton, selector: "p-splitButton", inputs: { model: "model", icon: "icon", iconPos: "iconPos", label: "label", style: "style", styleClass: "styleClass", menuStyle: "menuStyle", menuStyleClass: "menuStyleClass", disabled: "disabled", tabindex: "tabindex", appendTo: "appendTo", dir: "dir", expandAriaLabel: "expandAriaLabel", showTransitionOptions: "showTransitionOptions", hideTransitionOptions: "hideTransitionOptions" }, outputs: { onClick: "onClick", onDropdownClick: "onDropdownClick" }, host: { classAttribute: "p-element" }, queries: [{ propertyName: "templates", predicate: PrimeTemplate }], viewQueries: [{ propertyName: "containerViewChild", first: true, predicate: ["container"], descendants: true }, { propertyName: "buttonViewChild", first: true, predicate: ["defaultbtn"], descendants: true }, { propertyName: "menu", first: true, predicate: ["menu"], descendants: true }], ngImport: i0, template: `
        <div #container [ngClass]="'p-splitbutton p-component'" [ngStyle]="style" [class]="styleClass">
            <ng-container *ngIf="contentTemplate; else defaultButton">
                <button class="p-splitbutton-defaultbutton" type="button" pButton [icon]="icon" [iconPos]="iconPos" (click)="onDefaultButtonClick($event)" [disabled]="disabled" [attr.tabindex]="tabindex">
                    <ng-container *ngTemplateOutlet="contentTemplate"></ng-container>
                </button>
            </ng-container>
            <ng-template #defaultButton>
                <button #defaultbtn class="p-splitbutton-defaultbutton" type="button" pButton [icon]="icon" [iconPos]="iconPos" [label]="label" (click)="onDefaultButtonClick($event)" [disabled]="disabled" [attr.tabindex]="tabindex"></button>
            </ng-template>
            <button type="button" pButton class="p-splitbutton-menubutton" icon="pi pi-chevron-down" (click)="onDropdownButtonClick($event)" [disabled]="disabled" [attr.aria-label]="expandAriaLabel"></button>
            <p-tieredMenu #menu [popup]="true" [model]="model" [style]="menuStyle" [styleClass]="menuStyleClass" [appendTo]="appendTo" [showTransitionOptions]="showTransitionOptions" [hideTransitionOptions]="hideTransitionOptions"></p-tieredMenu>
        </div>
    `, isInline: true, styles: [".p-splitbutton{display:inline-flex;position:relative}.p-splitbutton .p-splitbutton-defaultbutton,.p-splitbutton.p-button-rounded>.p-splitbutton-defaultbutton.p-button,.p-splitbutton.p-button-outlined>.p-splitbutton-defaultbutton.p-button{flex:1 1 auto;border-top-right-radius:0;border-bottom-right-radius:0;border-right:0 none}.p-splitbutton-menubutton,.p-splitbutton.p-button-rounded>.p-splitbutton-menubutton.p-button,.p-splitbutton.p-button-outlined>.p-splitbutton-menubutton.p-button{display:flex;align-items:center;justify-content:center;border-top-left-radius:0;border-bottom-left-radius:0}.p-splitbutton .p-menu{min-width:100%}.p-fluid .p-splitbutton{display:flex}\n"], dependencies: [{ kind: "directive", type: i1.NgClass, selector: "[ngClass]", inputs: ["class", "ngClass"] }, { kind: "directive", type: i1.NgIf, selector: "[ngIf]", inputs: ["ngIf", "ngIfThen", "ngIfElse"] }, { kind: "directive", type: i1.NgTemplateOutlet, selector: "[ngTemplateOutlet]", inputs: ["ngTemplateOutletContext", "ngTemplateOutlet", "ngTemplateOutletInjector"] }, { kind: "directive", type: i1.NgStyle, selector: "[ngStyle]", inputs: ["ngStyle"] }, { kind: "directive", type: i2.ButtonDirective, selector: "[pButton]", inputs: ["iconPos", "loadingIcon", "label", "icon", "loading"] }, { kind: "component", type: i3.TieredMenu, selector: "p-tieredMenu", inputs: ["model", "popup", "style", "styleClass", "appendTo", "autoZIndex", "baseZIndex", "autoDisplay", "showTransitionOptions", "hideTransitionOptions"], outputs: ["onShow", "onHide"] }], changeDetection: i0.ChangeDetectionStrategy.OnPush, encapsulation: i0.ViewEncapsulation.None });
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "14.0.7", ngImport: i0, type: SplitButton, decorators: [{
            type: Component,
            args: [{ selector: 'p-splitButton', template: `
        <div #container [ngClass]="'p-splitbutton p-component'" [ngStyle]="style" [class]="styleClass">
            <ng-container *ngIf="contentTemplate; else defaultButton">
                <button class="p-splitbutton-defaultbutton" type="button" pButton [icon]="icon" [iconPos]="iconPos" (click)="onDefaultButtonClick($event)" [disabled]="disabled" [attr.tabindex]="tabindex">
                    <ng-container *ngTemplateOutlet="contentTemplate"></ng-container>
                </button>
            </ng-container>
            <ng-template #defaultButton>
                <button #defaultbtn class="p-splitbutton-defaultbutton" type="button" pButton [icon]="icon" [iconPos]="iconPos" [label]="label" (click)="onDefaultButtonClick($event)" [disabled]="disabled" [attr.tabindex]="tabindex"></button>
            </ng-template>
            <button type="button" pButton class="p-splitbutton-menubutton" icon="pi pi-chevron-down" (click)="onDropdownButtonClick($event)" [disabled]="disabled" [attr.aria-label]="expandAriaLabel"></button>
            <p-tieredMenu #menu [popup]="true" [model]="model" [style]="menuStyle" [styleClass]="menuStyleClass" [appendTo]="appendTo" [showTransitionOptions]="showTransitionOptions" [hideTransitionOptions]="hideTransitionOptions"></p-tieredMenu>
        </div>
    `, changeDetection: ChangeDetectionStrategy.OnPush, encapsulation: ViewEncapsulation.None, host: {
                        class: 'p-element'
                    }, styles: [".p-splitbutton{display:inline-flex;position:relative}.p-splitbutton .p-splitbutton-defaultbutton,.p-splitbutton.p-button-rounded>.p-splitbutton-defaultbutton.p-button,.p-splitbutton.p-button-outlined>.p-splitbutton-defaultbutton.p-button{flex:1 1 auto;border-top-right-radius:0;border-bottom-right-radius:0;border-right:0 none}.p-splitbutton-menubutton,.p-splitbutton.p-button-rounded>.p-splitbutton-menubutton.p-button,.p-splitbutton.p-button-outlined>.p-splitbutton-menubutton.p-button{display:flex;align-items:center;justify-content:center;border-top-left-radius:0;border-bottom-left-radius:0}.p-splitbutton .p-menu{min-width:100%}.p-fluid .p-splitbutton{display:flex}\n"] }]
        }], propDecorators: { model: [{
                type: Input
            }], icon: [{
                type: Input
            }], iconPos: [{
                type: Input
            }], label: [{
                type: Input
            }], onClick: [{
                type: Output
            }], onDropdownClick: [{
                type: Output
            }], style: [{
                type: Input
            }], styleClass: [{
                type: Input
            }], menuStyle: [{
                type: Input
            }], menuStyleClass: [{
                type: Input
            }], disabled: [{
                type: Input
            }], tabindex: [{
                type: Input
            }], appendTo: [{
                type: Input
            }], dir: [{
                type: Input
            }], expandAriaLabel: [{
                type: Input
            }], showTransitionOptions: [{
                type: Input
            }], hideTransitionOptions: [{
                type: Input
            }], containerViewChild: [{
                type: ViewChild,
                args: ['container']
            }], buttonViewChild: [{
                type: ViewChild,
                args: ['defaultbtn']
            }], menu: [{
                type: ViewChild,
                args: ['menu']
            }], templates: [{
                type: ContentChildren,
                args: [PrimeTemplate]
            }] } });
export class SplitButtonModule {
}
SplitButtonModule.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "14.0.7", ngImport: i0, type: SplitButtonModule, deps: [], target: i0.ɵɵFactoryTarget.NgModule });
SplitButtonModule.ɵmod = i0.ɵɵngDeclareNgModule({ minVersion: "14.0.0", version: "14.0.7", ngImport: i0, type: SplitButtonModule, declarations: [SplitButton], imports: [CommonModule, ButtonModule, TieredMenuModule], exports: [SplitButton, ButtonModule, TieredMenuModule] });
SplitButtonModule.ɵinj = i0.ɵɵngDeclareInjector({ minVersion: "12.0.0", version: "14.0.7", ngImport: i0, type: SplitButtonModule, imports: [CommonModule, ButtonModule, TieredMenuModule, ButtonModule, TieredMenuModule] });
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "14.0.7", ngImport: i0, type: SplitButtonModule, decorators: [{
            type: NgModule,
            args: [{
                    imports: [CommonModule, ButtonModule, TieredMenuModule],
                    exports: [SplitButton, ButtonModule, TieredMenuModule],
                    declarations: [SplitButton]
                }]
        }] });
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoic3BsaXRidXR0b24uanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi9zcmMvYXBwL2NvbXBvbmVudHMvc3BsaXRidXR0b24vc3BsaXRidXR0b24udHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUEsT0FBTyxFQUFFLFFBQVEsRUFBRSxTQUFTLEVBQWMsS0FBSyxFQUFFLE1BQU0sRUFBRSxZQUFZLEVBQUUsU0FBUyxFQUFFLHVCQUF1QixFQUFFLGlCQUFpQixFQUFlLGVBQWUsRUFBYSxNQUFNLGVBQWUsQ0FBQztBQUM3TCxPQUFPLEVBQUUsWUFBWSxFQUFFLE1BQU0saUJBQWlCLENBQUM7QUFDL0MsT0FBTyxFQUFZLGFBQWEsRUFBRSxNQUFNLGFBQWEsQ0FBQztBQUN0RCxPQUFPLEVBQUUsWUFBWSxFQUFFLE1BQU0sZ0JBQWdCLENBQUM7QUFDOUMsT0FBTyxFQUFFLGdCQUFnQixFQUFjLE1BQU0sb0JBQW9CLENBQUM7Ozs7O0FBMkJsRSxNQUFNLE9BQU8sV0FBVztJQXZCeEI7UUE0QmEsWUFBTyxHQUE0QixNQUFNLENBQUM7UUFJekMsWUFBTyxHQUFzQixJQUFJLFlBQVksRUFBRSxDQUFDO1FBRWhELG9CQUFlLEdBQXNCLElBQUksWUFBWSxFQUFFLENBQUM7UUFvQnpELDBCQUFxQixHQUFXLGlDQUFpQyxDQUFDO1FBRWxFLDBCQUFxQixHQUFXLFlBQVksQ0FBQztLQWtDekQ7SUF0Qkcsa0JBQWtCO1FBQ2QsSUFBSSxDQUFDLFNBQVMsQ0FBQyxPQUFPLENBQUMsQ0FBQyxJQUFJLEVBQUUsRUFBRTtZQUM1QixRQUFRLElBQUksQ0FBQyxPQUFPLEVBQUUsRUFBRTtnQkFDcEIsS0FBSyxTQUFTO29CQUNWLElBQUksQ0FBQyxlQUFlLEdBQUcsSUFBSSxDQUFDLFFBQVEsQ0FBQztvQkFDckMsTUFBTTtnQkFFVjtvQkFDSSxJQUFJLENBQUMsZUFBZSxHQUFHLElBQUksQ0FBQyxRQUFRLENBQUM7b0JBQ3JDLE1BQU07YUFDYjtRQUNMLENBQUMsQ0FBQyxDQUFDO0lBQ1AsQ0FBQztJQUVELG9CQUFvQixDQUFDLEtBQVk7UUFDN0IsSUFBSSxDQUFDLE9BQU8sQ0FBQyxJQUFJLENBQUMsS0FBSyxDQUFDLENBQUM7SUFDN0IsQ0FBQztJQUVELHFCQUFxQixDQUFDLEtBQVk7UUFDOUIsSUFBSSxDQUFDLGVBQWUsQ0FBQyxJQUFJLENBQUMsS0FBSyxDQUFDLENBQUM7UUFDakMsSUFBSSxDQUFDLElBQUksQ0FBQyxNQUFNLENBQUMsRUFBRSxhQUFhLEVBQUUsSUFBSSxDQUFDLGtCQUFrQixDQUFDLGFBQWEsRUFBRSxhQUFhLEVBQUUsSUFBSSxDQUFDLFFBQVEsSUFBSSxJQUFJLEVBQUUsQ0FBQyxDQUFDO0lBQ3JILENBQUM7O3dHQWxFUSxXQUFXOzRGQUFYLFdBQVcsK2pCQXlDSCxhQUFhLDZUQTlEcEI7Ozs7Ozs7Ozs7Ozs7S0FhVDsyRkFRUSxXQUFXO2tCQXZCdkIsU0FBUzsrQkFDSSxlQUFlLFlBQ2Y7Ozs7Ozs7Ozs7Ozs7S0FhVCxtQkFDZ0IsdUJBQXVCLENBQUMsTUFBTSxpQkFDaEMsaUJBQWlCLENBQUMsSUFBSSxRQUUvQjt3QkFDRixLQUFLLEVBQUUsV0FBVztxQkFDckI7OEJBR1EsS0FBSztzQkFBYixLQUFLO2dCQUVHLElBQUk7c0JBQVosS0FBSztnQkFFRyxPQUFPO3NCQUFmLEtBQUs7Z0JBRUcsS0FBSztzQkFBYixLQUFLO2dCQUVJLE9BQU87c0JBQWhCLE1BQU07Z0JBRUcsZUFBZTtzQkFBeEIsTUFBTTtnQkFFRSxLQUFLO3NCQUFiLEtBQUs7Z0JBRUcsVUFBVTtzQkFBbEIsS0FBSztnQkFFRyxTQUFTO3NCQUFqQixLQUFLO2dCQUVHLGNBQWM7c0JBQXRCLEtBQUs7Z0JBRUcsUUFBUTtzQkFBaEIsS0FBSztnQkFFRyxRQUFRO3NCQUFoQixLQUFLO2dCQUVHLFFBQVE7c0JBQWhCLEtBQUs7Z0JBRUcsR0FBRztzQkFBWCxLQUFLO2dCQUVHLGVBQWU7c0JBQXZCLEtBQUs7Z0JBRUcscUJBQXFCO3NCQUE3QixLQUFLO2dCQUVHLHFCQUFxQjtzQkFBN0IsS0FBSztnQkFFa0Isa0JBQWtCO3NCQUF6QyxTQUFTO3VCQUFDLFdBQVc7Z0JBRUcsZUFBZTtzQkFBdkMsU0FBUzt1QkFBQyxZQUFZO2dCQUVKLElBQUk7c0JBQXRCLFNBQVM7dUJBQUMsTUFBTTtnQkFFZSxTQUFTO3NCQUF4QyxlQUFlO3VCQUFDLGFBQWE7O0FBaUNsQyxNQUFNLE9BQU8saUJBQWlCOzs4R0FBakIsaUJBQWlCOytHQUFqQixpQkFBaUIsaUJBMUVqQixXQUFXLGFBc0VWLFlBQVksRUFBRSxZQUFZLEVBQUUsZ0JBQWdCLGFBdEU3QyxXQUFXLEVBdUVHLFlBQVksRUFBRSxnQkFBZ0I7K0dBRzVDLGlCQUFpQixZQUpoQixZQUFZLEVBQUUsWUFBWSxFQUFFLGdCQUFnQixFQUMvQixZQUFZLEVBQUUsZ0JBQWdCOzJGQUc1QyxpQkFBaUI7a0JBTDdCLFFBQVE7bUJBQUM7b0JBQ04sT0FBTyxFQUFFLENBQUMsWUFBWSxFQUFFLFlBQVksRUFBRSxnQkFBZ0IsQ0FBQztvQkFDdkQsT0FBTyxFQUFFLENBQUMsV0FBVyxFQUFFLFlBQVksRUFBRSxnQkFBZ0IsQ0FBQztvQkFDdEQsWUFBWSxFQUFFLENBQUMsV0FBVyxDQUFDO2lCQUM5QiIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7IE5nTW9kdWxlLCBDb21wb25lbnQsIEVsZW1lbnRSZWYsIElucHV0LCBPdXRwdXQsIEV2ZW50RW1pdHRlciwgVmlld0NoaWxkLCBDaGFuZ2VEZXRlY3Rpb25TdHJhdGVneSwgVmlld0VuY2Fwc3VsYXRpb24sIFRlbXBsYXRlUmVmLCBDb250ZW50Q2hpbGRyZW4sIFF1ZXJ5TGlzdCB9IGZyb20gJ0Bhbmd1bGFyL2NvcmUnO1xuaW1wb3J0IHsgQ29tbW9uTW9kdWxlIH0gZnJvbSAnQGFuZ3VsYXIvY29tbW9uJztcbmltcG9ydCB7IE1lbnVJdGVtLCBQcmltZVRlbXBsYXRlIH0gZnJvbSAncHJpbWVuZy9hcGknO1xuaW1wb3J0IHsgQnV0dG9uTW9kdWxlIH0gZnJvbSAncHJpbWVuZy9idXR0b24nO1xuaW1wb3J0IHsgVGllcmVkTWVudU1vZHVsZSwgVGllcmVkTWVudSB9IGZyb20gJ3ByaW1lbmcvdGllcmVkbWVudSc7XG5cbnR5cGUgU3BsaXRCdXR0b25JY29uUG9zaXRpb24gPSAnbGVmdCcgfCAncmlnaHQnO1xuXG5AQ29tcG9uZW50KHtcbiAgICBzZWxlY3RvcjogJ3Atc3BsaXRCdXR0b24nLFxuICAgIHRlbXBsYXRlOiBgXG4gICAgICAgIDxkaXYgI2NvbnRhaW5lciBbbmdDbGFzc109XCIncC1zcGxpdGJ1dHRvbiBwLWNvbXBvbmVudCdcIiBbbmdTdHlsZV09XCJzdHlsZVwiIFtjbGFzc109XCJzdHlsZUNsYXNzXCI+XG4gICAgICAgICAgICA8bmctY29udGFpbmVyICpuZ0lmPVwiY29udGVudFRlbXBsYXRlOyBlbHNlIGRlZmF1bHRCdXR0b25cIj5cbiAgICAgICAgICAgICAgICA8YnV0dG9uIGNsYXNzPVwicC1zcGxpdGJ1dHRvbi1kZWZhdWx0YnV0dG9uXCIgdHlwZT1cImJ1dHRvblwiIHBCdXR0b24gW2ljb25dPVwiaWNvblwiIFtpY29uUG9zXT1cImljb25Qb3NcIiAoY2xpY2spPVwib25EZWZhdWx0QnV0dG9uQ2xpY2soJGV2ZW50KVwiIFtkaXNhYmxlZF09XCJkaXNhYmxlZFwiIFthdHRyLnRhYmluZGV4XT1cInRhYmluZGV4XCI+XG4gICAgICAgICAgICAgICAgICAgIDxuZy1jb250YWluZXIgKm5nVGVtcGxhdGVPdXRsZXQ9XCJjb250ZW50VGVtcGxhdGVcIj48L25nLWNvbnRhaW5lcj5cbiAgICAgICAgICAgICAgICA8L2J1dHRvbj5cbiAgICAgICAgICAgIDwvbmctY29udGFpbmVyPlxuICAgICAgICAgICAgPG5nLXRlbXBsYXRlICNkZWZhdWx0QnV0dG9uPlxuICAgICAgICAgICAgICAgIDxidXR0b24gI2RlZmF1bHRidG4gY2xhc3M9XCJwLXNwbGl0YnV0dG9uLWRlZmF1bHRidXR0b25cIiB0eXBlPVwiYnV0dG9uXCIgcEJ1dHRvbiBbaWNvbl09XCJpY29uXCIgW2ljb25Qb3NdPVwiaWNvblBvc1wiIFtsYWJlbF09XCJsYWJlbFwiIChjbGljayk9XCJvbkRlZmF1bHRCdXR0b25DbGljaygkZXZlbnQpXCIgW2Rpc2FibGVkXT1cImRpc2FibGVkXCIgW2F0dHIudGFiaW5kZXhdPVwidGFiaW5kZXhcIj48L2J1dHRvbj5cbiAgICAgICAgICAgIDwvbmctdGVtcGxhdGU+XG4gICAgICAgICAgICA8YnV0dG9uIHR5cGU9XCJidXR0b25cIiBwQnV0dG9uIGNsYXNzPVwicC1zcGxpdGJ1dHRvbi1tZW51YnV0dG9uXCIgaWNvbj1cInBpIHBpLWNoZXZyb24tZG93blwiIChjbGljayk9XCJvbkRyb3Bkb3duQnV0dG9uQ2xpY2soJGV2ZW50KVwiIFtkaXNhYmxlZF09XCJkaXNhYmxlZFwiIFthdHRyLmFyaWEtbGFiZWxdPVwiZXhwYW5kQXJpYUxhYmVsXCI+PC9idXR0b24+XG4gICAgICAgICAgICA8cC10aWVyZWRNZW51ICNtZW51IFtwb3B1cF09XCJ0cnVlXCIgW21vZGVsXT1cIm1vZGVsXCIgW3N0eWxlXT1cIm1lbnVTdHlsZVwiIFtzdHlsZUNsYXNzXT1cIm1lbnVTdHlsZUNsYXNzXCIgW2FwcGVuZFRvXT1cImFwcGVuZFRvXCIgW3Nob3dUcmFuc2l0aW9uT3B0aW9uc109XCJzaG93VHJhbnNpdGlvbk9wdGlvbnNcIiBbaGlkZVRyYW5zaXRpb25PcHRpb25zXT1cImhpZGVUcmFuc2l0aW9uT3B0aW9uc1wiPjwvcC10aWVyZWRNZW51PlxuICAgICAgICA8L2Rpdj5cbiAgICBgLFxuICAgIGNoYW5nZURldGVjdGlvbjogQ2hhbmdlRGV0ZWN0aW9uU3RyYXRlZ3kuT25QdXNoLFxuICAgIGVuY2Fwc3VsYXRpb246IFZpZXdFbmNhcHN1bGF0aW9uLk5vbmUsXG4gICAgc3R5bGVVcmxzOiBbJy4vc3BsaXRidXR0b24uY3NzJ10sXG4gICAgaG9zdDoge1xuICAgICAgICBjbGFzczogJ3AtZWxlbWVudCdcbiAgICB9XG59KVxuZXhwb3J0IGNsYXNzIFNwbGl0QnV0dG9uIHtcbiAgICBASW5wdXQoKSBtb2RlbDogTWVudUl0ZW1bXTtcblxuICAgIEBJbnB1dCgpIGljb246IHN0cmluZztcblxuICAgIEBJbnB1dCgpIGljb25Qb3M6IFNwbGl0QnV0dG9uSWNvblBvc2l0aW9uID0gJ2xlZnQnO1xuXG4gICAgQElucHV0KCkgbGFiZWw6IHN0cmluZztcblxuICAgIEBPdXRwdXQoKSBvbkNsaWNrOiBFdmVudEVtaXR0ZXI8YW55PiA9IG5ldyBFdmVudEVtaXR0ZXIoKTtcblxuICAgIEBPdXRwdXQoKSBvbkRyb3Bkb3duQ2xpY2s6IEV2ZW50RW1pdHRlcjxhbnk+ID0gbmV3IEV2ZW50RW1pdHRlcigpO1xuXG4gICAgQElucHV0KCkgc3R5bGU6IGFueTtcblxuICAgIEBJbnB1dCgpIHN0eWxlQ2xhc3M6IHN0cmluZztcblxuICAgIEBJbnB1dCgpIG1lbnVTdHlsZTogYW55O1xuXG4gICAgQElucHV0KCkgbWVudVN0eWxlQ2xhc3M6IHN0cmluZztcblxuICAgIEBJbnB1dCgpIGRpc2FibGVkOiBib29sZWFuO1xuXG4gICAgQElucHV0KCkgdGFiaW5kZXg6IG51bWJlcjtcblxuICAgIEBJbnB1dCgpIGFwcGVuZFRvOiBhbnk7XG5cbiAgICBASW5wdXQoKSBkaXI6IHN0cmluZztcblxuICAgIEBJbnB1dCgpIGV4cGFuZEFyaWFMYWJlbDogc3RyaW5nO1xuXG4gICAgQElucHV0KCkgc2hvd1RyYW5zaXRpb25PcHRpb25zOiBzdHJpbmcgPSAnLjEycyBjdWJpYy1iZXppZXIoMCwgMCwgMC4yLCAxKSc7XG5cbiAgICBASW5wdXQoKSBoaWRlVHJhbnNpdGlvbk9wdGlvbnM6IHN0cmluZyA9ICcuMXMgbGluZWFyJztcblxuICAgIEBWaWV3Q2hpbGQoJ2NvbnRhaW5lcicpIGNvbnRhaW5lclZpZXdDaGlsZDogRWxlbWVudFJlZjtcblxuICAgIEBWaWV3Q2hpbGQoJ2RlZmF1bHRidG4nKSBidXR0b25WaWV3Q2hpbGQ6IEVsZW1lbnRSZWY7XG5cbiAgICBAVmlld0NoaWxkKCdtZW51JykgbWVudTogVGllcmVkTWVudTtcblxuICAgIEBDb250ZW50Q2hpbGRyZW4oUHJpbWVUZW1wbGF0ZSkgdGVtcGxhdGVzOiBRdWVyeUxpc3Q8YW55PjtcblxuICAgIGNvbnRlbnRUZW1wbGF0ZTogVGVtcGxhdGVSZWY8YW55PjtcblxuICAgIG5nQWZ0ZXJDb250ZW50SW5pdCgpIHtcbiAgICAgICAgdGhpcy50ZW1wbGF0ZXMuZm9yRWFjaCgoaXRlbSkgPT4ge1xuICAgICAgICAgICAgc3dpdGNoIChpdGVtLmdldFR5cGUoKSkge1xuICAgICAgICAgICAgICAgIGNhc2UgJ2NvbnRlbnQnOlxuICAgICAgICAgICAgICAgICAgICB0aGlzLmNvbnRlbnRUZW1wbGF0ZSA9IGl0ZW0udGVtcGxhdGU7XG4gICAgICAgICAgICAgICAgICAgIGJyZWFrO1xuXG4gICAgICAgICAgICAgICAgZGVmYXVsdDpcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5jb250ZW50VGVtcGxhdGUgPSBpdGVtLnRlbXBsYXRlO1xuICAgICAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgIH1cbiAgICAgICAgfSk7XG4gICAgfVxuXG4gICAgb25EZWZhdWx0QnV0dG9uQ2xpY2soZXZlbnQ6IEV2ZW50KSB7XG4gICAgICAgIHRoaXMub25DbGljay5lbWl0KGV2ZW50KTtcbiAgICB9XG5cbiAgICBvbkRyb3Bkb3duQnV0dG9uQ2xpY2soZXZlbnQ6IEV2ZW50KSB7XG4gICAgICAgIHRoaXMub25Ecm9wZG93bkNsaWNrLmVtaXQoZXZlbnQpO1xuICAgICAgICB0aGlzLm1lbnUudG9nZ2xlKHsgY3VycmVudFRhcmdldDogdGhpcy5jb250YWluZXJWaWV3Q2hpbGQubmF0aXZlRWxlbWVudCwgcmVsYXRpdmVBbGlnbjogdGhpcy5hcHBlbmRUbyA9PSBudWxsIH0pO1xuICAgIH1cbn1cblxuQE5nTW9kdWxlKHtcbiAgICBpbXBvcnRzOiBbQ29tbW9uTW9kdWxlLCBCdXR0b25Nb2R1bGUsIFRpZXJlZE1lbnVNb2R1bGVdLFxuICAgIGV4cG9ydHM6IFtTcGxpdEJ1dHRvbiwgQnV0dG9uTW9kdWxlLCBUaWVyZWRNZW51TW9kdWxlXSxcbiAgICBkZWNsYXJhdGlvbnM6IFtTcGxpdEJ1dHRvbl1cbn0pXG5leHBvcnQgY2xhc3MgU3BsaXRCdXR0b25Nb2R1bGUge31cbiJdfQ==
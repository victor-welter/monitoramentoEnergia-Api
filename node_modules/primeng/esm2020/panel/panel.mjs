import { NgModule, Component, Input, Output, EventEmitter, ContentChild, ChangeDetectionStrategy, ViewEncapsulation, ContentChildren } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SharedModule, Footer, PrimeTemplate } from 'primeng/api';
import { RippleModule } from 'primeng/ripple';
import { trigger, state, style, transition, animate } from '@angular/animations';
import * as i0 from "@angular/core";
import * as i1 from "@angular/common";
import * as i2 from "primeng/ripple";
let idx = 0;
export class Panel {
    constructor(el) {
        this.el = el;
        this.collapsed = false;
        this.iconPos = 'end';
        this.expandIcon = 'pi pi-plus';
        this.collapseIcon = 'pi pi-minus';
        this.showHeader = true;
        this.toggler = 'icon';
        this.collapsedChange = new EventEmitter();
        this.onBeforeToggle = new EventEmitter();
        this.onAfterToggle = new EventEmitter();
        this.transitionOptions = '400ms cubic-bezier(0.86, 0, 0.07, 1)';
        this.id = `p-panel-${idx++}`;
    }
    ngAfterContentInit() {
        this.templates.forEach((item) => {
            switch (item.getType()) {
                case 'header':
                    this.headerTemplate = item.template;
                    break;
                case 'content':
                    this.contentTemplate = item.template;
                    break;
                case 'footer':
                    this.footerTemplate = item.template;
                    break;
                case 'icons':
                    this.iconTemplate = item.template;
                    break;
                default:
                    this.contentTemplate = item.template;
                    break;
            }
        });
    }
    onHeaderClick(event) {
        if (this.toggler === 'header') {
            this.toggle(event);
        }
    }
    onIconClick(event) {
        if (this.toggler === 'icon') {
            this.toggle(event);
        }
    }
    toggle(event) {
        if (this.animating) {
            return false;
        }
        this.animating = true;
        this.onBeforeToggle.emit({ originalEvent: event, collapsed: this.collapsed });
        if (this.toggleable) {
            if (this.collapsed)
                this.expand(event);
            else
                this.collapse(event);
        }
        event.preventDefault();
    }
    expand(event) {
        this.collapsed = false;
        this.collapsedChange.emit(this.collapsed);
    }
    collapse(event) {
        this.collapsed = true;
        this.collapsedChange.emit(this.collapsed);
    }
    getBlockableElement() {
        return this.el.nativeElement.children[0];
    }
    onToggleDone(event) {
        this.animating = false;
        this.onAfterToggle.emit({ originalEvent: event, collapsed: this.collapsed });
    }
}
Panel.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "14.0.7", ngImport: i0, type: Panel, deps: [{ token: i0.ElementRef }], target: i0.ɵɵFactoryTarget.Component });
Panel.ɵcmp = i0.ɵɵngDeclareComponent({ minVersion: "14.0.0", version: "14.0.7", type: Panel, selector: "p-panel", inputs: { toggleable: "toggleable", header: "header", collapsed: "collapsed", style: "style", styleClass: "styleClass", iconPos: "iconPos", expandIcon: "expandIcon", collapseIcon: "collapseIcon", showHeader: "showHeader", toggler: "toggler", transitionOptions: "transitionOptions" }, outputs: { collapsedChange: "collapsedChange", onBeforeToggle: "onBeforeToggle", onAfterToggle: "onAfterToggle" }, host: { classAttribute: "p-element" }, queries: [{ propertyName: "footerFacet", first: true, predicate: Footer, descendants: true }, { propertyName: "templates", predicate: PrimeTemplate }], ngImport: i0, template: `
        <div [attr.id]="id" [ngClass]="{ 'p-panel p-component': true, 'p-panel-toggleable': toggleable, 'p-panel-expanded': !collapsed && toggleable }" [ngStyle]="style" [class]="styleClass">
            <div class="p-panel-header" *ngIf="showHeader" (click)="onHeaderClick($event)" [attr.id]="id + '-titlebar'">
                <span class="p-panel-title" *ngIf="header" [attr.id]="id + '_header'">{{ header }}</span>
                <ng-content select="p-header"></ng-content>
                <ng-container *ngTemplateOutlet="headerTemplate"></ng-container>
                <div role="tablist" class="p-panel-icons" [ngClass]="{ 'p-panel-icons-start': iconPos === 'start', 'p-panel-icons-end': iconPos === 'end', 'p-panel-icons-center': iconPos === 'center' }">
                    <ng-template *ngTemplateOutlet="iconTemplate"></ng-template>
                    <button
                        *ngIf="toggleable"
                        type="button"
                        [attr.aria-label]="'collapse button'"
                        [attr.id]="id + '-label'"
                        class="p-panel-header-icon p-panel-toggler p-link"
                        pRipple
                        (click)="onIconClick($event)"
                        (keydown.enter)="onIconClick($event)"
                        [attr.aria-controls]="id + '-content'"
                        role="tab"
                        [attr.aria-expanded]="!collapsed"
                    >
                        <span [class]="collapsed ? expandIcon : collapseIcon"></span>
                    </button>
                </div>
            </div>
            <div
                [attr.id]="id + '-content'"
                class="p-toggleable-content"
                [@panelContent]="
                    collapsed
                        ? { value: 'hidden', params: { transitionParams: animating ? transitionOptions : '0ms', height: '0', opacity: '0' } }
                        : { value: 'visible', params: { transitionParams: animating ? transitionOptions : '0ms', height: '*', opacity: '1' } }
                "
                (@panelContent.done)="onToggleDone($event)"
                role="region"
                [attr.aria-hidden]="collapsed"
                [attr.aria-labelledby]="id + '-titlebar'"
            >
                <div class="p-panel-content">
                    <ng-content></ng-content>
                    <ng-container *ngTemplateOutlet="contentTemplate"></ng-container>
                </div>

                <div class="p-panel-footer" *ngIf="footerFacet || footerTemplate">
                    <ng-content select="p-footer"></ng-content>
                    <ng-container *ngTemplateOutlet="footerTemplate"></ng-container>
                </div>
            </div>
        </div>
    `, isInline: true, styles: [".p-panel-header{display:flex;align-items:center}.p-panel-title{line-height:1;order:1}.p-panel-header-icon{display:inline-flex;justify-content:center;align-items:center;cursor:pointer;text-decoration:none;overflow:hidden;position:relative}.p-panel-toggleable.p-panel-expanded .p-toggleable-content:not(.ng-animating){overflow:visible}.p-panel-toggleable .p-toggleable-content{overflow:hidden}\n"], dependencies: [{ kind: "directive", type: i1.NgClass, selector: "[ngClass]", inputs: ["class", "ngClass"] }, { kind: "directive", type: i1.NgIf, selector: "[ngIf]", inputs: ["ngIf", "ngIfThen", "ngIfElse"] }, { kind: "directive", type: i1.NgTemplateOutlet, selector: "[ngTemplateOutlet]", inputs: ["ngTemplateOutletContext", "ngTemplateOutlet", "ngTemplateOutletInjector"] }, { kind: "directive", type: i1.NgStyle, selector: "[ngStyle]", inputs: ["ngStyle"] }, { kind: "directive", type: i2.Ripple, selector: "[pRipple]" }], animations: [
        trigger('panelContent', [
            state('hidden', style({
                height: '0'
            })),
            state('void', style({
                height: '{{height}}'
            }), { params: { height: '0' } }),
            state('visible', style({
                height: '*'
            })),
            transition('visible <=> hidden', [animate('{{transitionParams}}')]),
            transition('void => hidden', animate('{{transitionParams}}')),
            transition('void => visible', animate('{{transitionParams}}'))
        ])
    ], changeDetection: i0.ChangeDetectionStrategy.OnPush, encapsulation: i0.ViewEncapsulation.None });
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "14.0.7", ngImport: i0, type: Panel, decorators: [{
            type: Component,
            args: [{ selector: 'p-panel', template: `
        <div [attr.id]="id" [ngClass]="{ 'p-panel p-component': true, 'p-panel-toggleable': toggleable, 'p-panel-expanded': !collapsed && toggleable }" [ngStyle]="style" [class]="styleClass">
            <div class="p-panel-header" *ngIf="showHeader" (click)="onHeaderClick($event)" [attr.id]="id + '-titlebar'">
                <span class="p-panel-title" *ngIf="header" [attr.id]="id + '_header'">{{ header }}</span>
                <ng-content select="p-header"></ng-content>
                <ng-container *ngTemplateOutlet="headerTemplate"></ng-container>
                <div role="tablist" class="p-panel-icons" [ngClass]="{ 'p-panel-icons-start': iconPos === 'start', 'p-panel-icons-end': iconPos === 'end', 'p-panel-icons-center': iconPos === 'center' }">
                    <ng-template *ngTemplateOutlet="iconTemplate"></ng-template>
                    <button
                        *ngIf="toggleable"
                        type="button"
                        [attr.aria-label]="'collapse button'"
                        [attr.id]="id + '-label'"
                        class="p-panel-header-icon p-panel-toggler p-link"
                        pRipple
                        (click)="onIconClick($event)"
                        (keydown.enter)="onIconClick($event)"
                        [attr.aria-controls]="id + '-content'"
                        role="tab"
                        [attr.aria-expanded]="!collapsed"
                    >
                        <span [class]="collapsed ? expandIcon : collapseIcon"></span>
                    </button>
                </div>
            </div>
            <div
                [attr.id]="id + '-content'"
                class="p-toggleable-content"
                [@panelContent]="
                    collapsed
                        ? { value: 'hidden', params: { transitionParams: animating ? transitionOptions : '0ms', height: '0', opacity: '0' } }
                        : { value: 'visible', params: { transitionParams: animating ? transitionOptions : '0ms', height: '*', opacity: '1' } }
                "
                (@panelContent.done)="onToggleDone($event)"
                role="region"
                [attr.aria-hidden]="collapsed"
                [attr.aria-labelledby]="id + '-titlebar'"
            >
                <div class="p-panel-content">
                    <ng-content></ng-content>
                    <ng-container *ngTemplateOutlet="contentTemplate"></ng-container>
                </div>

                <div class="p-panel-footer" *ngIf="footerFacet || footerTemplate">
                    <ng-content select="p-footer"></ng-content>
                    <ng-container *ngTemplateOutlet="footerTemplate"></ng-container>
                </div>
            </div>
        </div>
    `, animations: [
                        trigger('panelContent', [
                            state('hidden', style({
                                height: '0'
                            })),
                            state('void', style({
                                height: '{{height}}'
                            }), { params: { height: '0' } }),
                            state('visible', style({
                                height: '*'
                            })),
                            transition('visible <=> hidden', [animate('{{transitionParams}}')]),
                            transition('void => hidden', animate('{{transitionParams}}')),
                            transition('void => visible', animate('{{transitionParams}}'))
                        ])
                    ], changeDetection: ChangeDetectionStrategy.OnPush, encapsulation: ViewEncapsulation.None, host: {
                        class: 'p-element'
                    }, styles: [".p-panel-header{display:flex;align-items:center}.p-panel-title{line-height:1;order:1}.p-panel-header-icon{display:inline-flex;justify-content:center;align-items:center;cursor:pointer;text-decoration:none;overflow:hidden;position:relative}.p-panel-toggleable.p-panel-expanded .p-toggleable-content:not(.ng-animating){overflow:visible}.p-panel-toggleable .p-toggleable-content{overflow:hidden}\n"] }]
        }], ctorParameters: function () { return [{ type: i0.ElementRef }]; }, propDecorators: { toggleable: [{
                type: Input
            }], header: [{
                type: Input
            }], collapsed: [{
                type: Input
            }], style: [{
                type: Input
            }], styleClass: [{
                type: Input
            }], iconPos: [{
                type: Input
            }], expandIcon: [{
                type: Input
            }], collapseIcon: [{
                type: Input
            }], showHeader: [{
                type: Input
            }], toggler: [{
                type: Input
            }], collapsedChange: [{
                type: Output
            }], onBeforeToggle: [{
                type: Output
            }], onAfterToggle: [{
                type: Output
            }], transitionOptions: [{
                type: Input
            }], footerFacet: [{
                type: ContentChild,
                args: [Footer]
            }], templates: [{
                type: ContentChildren,
                args: [PrimeTemplate]
            }] } });
export class PanelModule {
}
PanelModule.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "14.0.7", ngImport: i0, type: PanelModule, deps: [], target: i0.ɵɵFactoryTarget.NgModule });
PanelModule.ɵmod = i0.ɵɵngDeclareNgModule({ minVersion: "14.0.0", version: "14.0.7", ngImport: i0, type: PanelModule, declarations: [Panel], imports: [CommonModule, SharedModule, RippleModule], exports: [Panel, SharedModule] });
PanelModule.ɵinj = i0.ɵɵngDeclareInjector({ minVersion: "12.0.0", version: "14.0.7", ngImport: i0, type: PanelModule, imports: [CommonModule, SharedModule, RippleModule, SharedModule] });
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "14.0.7", ngImport: i0, type: PanelModule, decorators: [{
            type: NgModule,
            args: [{
                    imports: [CommonModule, SharedModule, RippleModule],
                    exports: [Panel, SharedModule],
                    declarations: [Panel]
                }]
        }] });
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicGFuZWwuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi9zcmMvYXBwL2NvbXBvbmVudHMvcGFuZWwvcGFuZWwudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUEsT0FBTyxFQUFFLFFBQVEsRUFBRSxTQUFTLEVBQUUsS0FBSyxFQUFFLE1BQU0sRUFBRSxZQUFZLEVBQWMsWUFBWSxFQUFFLHVCQUF1QixFQUFFLGlCQUFpQixFQUFFLGVBQWUsRUFBNEMsTUFBTSxlQUFlLENBQUM7QUFDbE4sT0FBTyxFQUFFLFlBQVksRUFBRSxNQUFNLGlCQUFpQixDQUFDO0FBQy9DLE9BQU8sRUFBRSxZQUFZLEVBQUUsTUFBTSxFQUFFLGFBQWEsRUFBRSxNQUFNLGFBQWEsQ0FBQztBQUVsRSxPQUFPLEVBQUUsWUFBWSxFQUFFLE1BQU0sZ0JBQWdCLENBQUM7QUFDOUMsT0FBTyxFQUFFLE9BQU8sRUFBRSxLQUFLLEVBQUUsS0FBSyxFQUFFLFVBQVUsRUFBRSxPQUFPLEVBQUUsTUFBTSxxQkFBcUIsQ0FBQzs7OztBQUlqRixJQUFJLEdBQUcsR0FBVyxDQUFDLENBQUM7QUF1RnBCLE1BQU0sT0FBTyxLQUFLO0lBNkNkLFlBQW9CLEVBQWM7UUFBZCxPQUFFLEdBQUYsRUFBRSxDQUFZO1FBeEN6QixjQUFTLEdBQVksS0FBSyxDQUFDO1FBTTNCLFlBQU8sR0FBc0IsS0FBSyxDQUFDO1FBRW5DLGVBQVUsR0FBVyxZQUFZLENBQUM7UUFFbEMsaUJBQVksR0FBVyxhQUFhLENBQUM7UUFFckMsZUFBVSxHQUFZLElBQUksQ0FBQztRQUUzQixZQUFPLEdBQVcsTUFBTSxDQUFDO1FBRXhCLG9CQUFlLEdBQXNCLElBQUksWUFBWSxFQUFFLENBQUM7UUFFeEQsbUJBQWMsR0FBc0IsSUFBSSxZQUFZLEVBQUUsQ0FBQztRQUV2RCxrQkFBYSxHQUFzQixJQUFJLFlBQVksRUFBRSxDQUFDO1FBRXZELHNCQUFpQixHQUFXLHNDQUFzQyxDQUFDO1FBZ0I1RSxPQUFFLEdBQVcs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LEVBQUUsQ0FBQyxLQUFLLEVBQUUsWUFBWSxDQUFDO29CQUM5QixZQUFZLEVBQUUsQ0FBQyxLQUFLLENBQUM7aUJBQ3hCIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHsgTmdNb2R1bGUsIENvbXBvbmVudCwgSW5wdXQsIE91dHB1dCwgRXZlbnRFbWl0dGVyLCBFbGVtZW50UmVmLCBDb250ZW50Q2hpbGQsIENoYW5nZURldGVjdGlvblN0cmF0ZWd5LCBWaWV3RW5jYXBzdWxhdGlvbiwgQ29udGVudENoaWxkcmVuLCBRdWVyeUxpc3QsIFRlbXBsYXRlUmVmLCBBZnRlckNvbnRlbnRJbml0IH0gZnJvbSAnQGFuZ3VsYXIvY29yZSc7XG5pbXBvcnQgeyBDb21tb25Nb2R1bGUgfSBmcm9tICdAYW5ndWxhci9jb21tb24nO1xuaW1wb3J0IHsgU2hhcmVkTW9kdWxlLCBGb290ZXIsIFByaW1lVGVtcGxhdGUgfSBmcm9tICdwcmltZW5nL2FwaSc7XG5pbXBvcnQgeyBCbG9ja2FibGVVSSB9IGZyb20gJ3ByaW1lbmcvYXBpJztcbmltcG9ydCB7IFJpcHBsZU1vZHVsZSB9IGZyb20gJ3ByaW1lbmcvcmlwcGxlJztcbmltcG9ydCB7IHRyaWdnZXIsIHN0YXRlLCBzdHlsZSwgdHJhbnNpdGlvbiwgYW5pbWF0ZSB9IGZyb20gJ0Bhbmd1bGFyL2FuaW1hdGlvbnMnO1xuXG50eXBlIFBhbmVsSWNvblBvc2l0aW9uID0gJ3N0YXJ0JyB8ICdlbmQnIHwgJ2NlbnRlcic7XG5cbmxldCBpZHg6IG51bWJlciA9IDA7XG5cbkBDb21wb25lbnQoe1xuICAgIHNlbGVjdG9yOiAncC1wYW5lbCcsXG4gICAgdGVtcGxhdGU6IGBcbiAgICAgICAgPGRpdiBbYXR0ci5pZF09XCJpZFwiIFtuZ0NsYXNzXT1cInsgJ3AtcGFuZWwgcC1jb21wb25lbnQnOiB0cnVlLCAncC1wYW5lbC10b2dnbGVhYmxlJzogdG9nZ2xlYWJsZSwgJ3AtcGFuZWwtZXhwYW5kZWQnOiAhY29sbGFwc2VkICYmIHRvZ2dsZWFibGUgfVwiIFtuZ1N0eWxlXT1cInN0eWxlXCIgW2NsYXNzXT1cInN0eWxlQ2xhc3NcIj5cbiAgICAgICAgICAgIDxkaXYgY2xhc3M9XCJwLXBhbmVsLWhlYWRlclwiICpuZ0lmPVwic2hvd0hlYWRlclwiIChjbGljayk9XCJvbkhlYWRlckNsaWNrKCRldmVudClcIiBbYXR0ci5pZF09XCJpZCArICctdGl0bGViYXInXCI+XG4gICAgICAgICAgICAgICAgPHNwYW4gY2xhc3M9XCJwLXBhbmVsLXRpdGxlXCIgKm5nSWY9XCJoZWFkZXJcIiBbYXR0ci5pZF09XCJpZCArICdfaGVhZGVyJ1wiPnt7IGhlYWRlciB9fTwvc3Bhbj5cbiAgICAgICAgICAgICAgICA8bmctY29udGVudCBzZWxlY3Q9XCJwLWhlYWRlclwiPjwvbmctY29udGVudD5cbiAgICAgICAgICAgICAgICA8bmctY29udGFpbmVyICpuZ1RlbXBsYXRlT3V0bGV0PVwiaGVhZGVyVGVtcGxhdGVcIj48L25nLWNvbnRhaW5lcj5cbiAgICAgICAgICAgICAgICA8ZGl2IHJvbGU9XCJ0YWJsaXN0XCIgY2xhc3M9XCJwLXBhbmVsLWljb25zXCIgW25nQ2xhc3NdPVwieyAncC1wYW5lbC1pY29ucy1zdGFydCc6IGljb25Qb3MgPT09ICdzdGFydCcsICdwLXBhbmVsLWljb25zLWVuZCc6IGljb25Qb3MgPT09ICdlbmQnLCAncC1wYW5lbC1pY29ucy1jZW50ZXInOiBpY29uUG9zID09PSAnY2VudGVyJyB9XCI+XG4gICAgICAgICAgICAgICAgICAgIDxuZy10ZW1wbGF0ZSAqbmdUZW1wbGF0ZU91dGxldD1cImljb25UZW1wbGF0ZVwiPjwvbmctdGVtcGxhdGU+XG4gICAgICAgICAgICAgICAgICAgIDxidXR0b25cbiAgICAgICAgICAgICAgICAgICAgICAgICpuZ0lmPVwidG9nZ2xlYWJsZVwiXG4gICAgICAgICAgICAgICAgICAgICAgICB0eXBlPVwiYnV0dG9uXCJcbiAgICAgICAgICAgICAgICAgICAgICAgIFthdHRyLmFyaWEtbGFiZWxdPVwiJ2NvbGxhcHNlIGJ1dHRvbidcIlxuICAgICAgICAgICAgICAgICAgICAgICAgW2F0dHIuaWRdPVwiaWQgKyAnLWxhYmVsJ1wiXG4gICAgICAgICAgICAgICAgICAgICAgICBjbGFzcz1cInAtcGFuZWwtaGVhZGVyLWljb24gcC1wYW5lbC10b2dnbGVyIHAtbGlua1wiXG4gICAgICAgICAgICAgICAgICAgICAgICBwUmlwcGxlXG4gICAgICAgICAgICAgICAgICAgICAgICAoY2xpY2spPVwib25JY29uQ2xpY2soJGV2ZW50KVwiXG4gICAgICAgICAgICAgICAgICAgICAgICAoa2V5ZG93bi5lbnRlcik9XCJvbkljb25DbGljaygkZXZlbnQpXCJcbiAgICAgICAgICAgICAgICAgICAgICAgIFthdHRyLmFyaWEtY29udHJvbHNdPVwiaWQgKyAnLWNvbnRlbnQnXCJcbiAgICAgICAgICAgICAgICAgICAgICAgIHJvbGU9XCJ0YWJcIlxuICAgICAgICAgICAgICAgICAgICAgICAgW2F0dHIuYXJpYS1leHBhbmRlZF09XCIhY29sbGFwc2VkXCJcbiAgICAgICAgICAgICAgICAgICAgPlxuICAgICAgICAgICAgICAgICAgICAgICAgPHNwYW4gW2NsYXNzXT1cImNvbGxhcHNlZCA/IGV4cGFuZEljb24gOiBjb2xsYXBzZUljb25cIj48L3NwYW4+XG4gICAgICAgICAgICAgICAgICAgIDwvYnV0dG9uPlxuICAgICAgICAgICAgICAgIDwvZGl2PlxuICAgICAgICAgICAgPC9kaXY+XG4gICAgICAgICAgICA8ZGl2XG4gICAgICAgICAgICAgICAgW2F0dHIuaWRdPVwiaWQgKyAnLWNvbnRlbnQnXCJcbiAgICAgICAgICAgICAgICBjbGFzcz1cInAtdG9nZ2xlYWJsZS1jb250ZW50XCJcbiAgICAgICAgICAgICAgICBbQHBhbmVsQ29udGVudF09XCJcbiAgICAgICAgICAgICAgICAgICAgY29sbGFwc2VkXG4gICAgICAgICAgICAgICAgICAgICAgICA/IHsgdmFsdWU6ICdoaWRkZW4nLCBwYXJhbXM6IHsgdHJhbnNpdGlvblBhcmFtczogYW5pbWF0aW5nID8gdHJhbnNpdGlvbk9wdGlvbnMgOiAnMG1zJywgaGVpZ2h0OiAnMCcsIG9wYWNpdHk6ICcwJyB9IH1cbiAgICAgICAgICAgICAgICAgICAgICAgIDogeyB2YWx1ZTogJ3Zpc2libGUnLCBwYXJhbXM6IHsgdHJhbnNpdGlvblBhcmFtczogYW5pbWF0aW5nID8gdHJhbnNpdGlvbk9wdGlvbnMgOiAnMG1zJywgaGVpZ2h0OiAnKicsIG9wYWNpdHk6ICcxJyB9IH1cbiAgICAgICAgICAgICAgICBcIlxuICAgICAgICAgICAgICAgIChAcGFuZWxDb250ZW50LmRvbmUpPVwib25Ub2dnbGVEb25lKCRldmVudClcIlxuICAgICAgICAgICAgICAgIHJvbGU9XCJyZWdpb25cIlxuICAgICAgICAgICAgICAgIFthdHRyLmFyaWEtaGlkZGVuXT1cImNvbGxhcHNlZFwiXG4gICAgICAgICAgICAgICAgW2F0dHIuYXJpYS1sYWJlbGxlZGJ5XT1cImlkICsgJy10aXRsZWJhcidcIlxuICAgICAgICAgICAgPlxuICAgICAgICAgICAgICAgIDxkaXYgY2xhc3M9XCJwLXBhbmVsLWNvbnRlbnRcIj5cbiAgICAgICAgICAgICAgICAgICAgPG5nLWNvbnRlbnQ+PC9uZy1jb250ZW50PlxuICAgICAgICAgICAgICAgICAgICA8bmctY29udGFpbmVyICpuZ1RlbXBsYXRlT3V0bGV0PVwiY29udGVudFRlbXBsYXRlXCI+PC9uZy1jb250YWluZXI+XG4gICAgICAgICAgICAgICAgPC9kaXY+XG5cbiAgICAgICAgICAgICAgICA8ZGl2IGNsYXNzPVwicC1wYW5lbC1mb290ZXJcIiAqbmdJZj1cImZvb3RlckZhY2V0IHx8IGZvb3RlclRlbXBsYXRlXCI+XG4gICAgICAgICAgICAgICAgICAgIDxuZy1jb250ZW50IHNlbGVjdD1cInAtZm9vdGVyXCI+PC9uZy1jb250ZW50PlxuICAgICAgICAgICAgICAgICAgICA8bmctY29udGFpbmVyICpuZ1RlbXBsYXRlT3V0bGV0PVwiZm9vdGVyVGVtcGxhdGVcIj48L25nLWNvbnRhaW5lcj5cbiAgICAgICAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgICAgIDwvZGl2PlxuICAgICAgICA8L2Rpdj5cbiAgICBgLFxuICAgIGFuaW1hdGlvbnM6IFtcbiAgICAgICAgdHJpZ2dlcigncGFuZWxDb250ZW50JywgW1xuICAgICAgICAgICAgc3RhdGUoXG4gICAgICAgICAgICAgICAgJ2hpZGRlbicsXG4gICAgICAgICAgICAgICAgc3R5bGUoe1xuICAgICAgICAgICAgICAgICAgICBoZWlnaHQ6ICcwJ1xuICAgICAgICAgICAgICAgIH0pXG4gICAgICAgICAgICApLFxuICAgICAgICAgICAgc3RhdGUoXG4gICAgICAgICAgICAgICAgJ3ZvaWQnLFxuICAgICAgICAgICAgICAgIHN0eWxlKHtcbiAgICAgICAgICAgICAgICAgICAgaGVpZ2h0OiAne3toZWlnaHR9fSdcbiAgICAgICAgICAgICAgICB9KSxcbiAgICAgICAgICAgICAgICB7IHBhcmFtczogeyBoZWlnaHQ6ICcwJyB9IH1cbiAgICAgICAgICAgICksXG4gICAgICAgICAgICBzdGF0ZShcbiAgICAgICAgICAgICAgICAndmlzaWJsZScsXG4gICAgICAgICAgICAgICAgc3R5bGUoe1xuICAgICAgICAgICAgICAgICAgICBoZWlnaHQ6ICcqJ1xuICAgICAgICAgICAgICAgIH0pXG4gICAgICAgICAgICApLFxuICAgICAgICAgICAgdHJhbnNpdGlvbigndmlzaWJsZSA8PT4gaGlkZGVuJywgW2FuaW1hdGUoJ3t7dHJhbnNpdGlvblBhcmFtc319JyldKSxcbiAgICAgICAgICAgIHRyYW5zaXRpb24oJ3ZvaWQgPT4gaGlkZGVuJywgYW5pbWF0ZSgne3t0cmFuc2l0aW9uUGFyYW1zfX0nKSksXG4gICAgICAgICAgICB0cmFuc2l0aW9uKCd2b2lkID0+IHZpc2libGUnLCBhbmltYXRlKCd7e3RyYW5zaXRpb25QYXJhbXN9fScpKVxuICAgICAgICBdKVxuICAgIF0sXG4gICAgY2hhbmdlRGV0ZWN0aW9uOiBDaGFuZ2VEZXRlY3Rpb25TdHJhdGVneS5PblB1c2gsXG4gICAgZW5jYXBzdWxhdGlvbjogVmlld0VuY2Fwc3VsYXRpb24uTm9uZSxcbiAgICBzdHlsZVVybHM6IFsnLi9wYW5lbC5jc3MnXSxcbiAgICBob3N0OiB7XG4gICAgICAgIGNsYXNzOiAncC1lbGVtZW50J1xuICAgIH1cbn0pXG5leHBvcnQgY2xhc3MgUGFuZWwgaW1wbGVtZW50cyBBZnRlckNvbnRlbnRJbml0LCBCbG9ja2FibGVVSSB7XG4gICAgQElucHV0KCkgdG9nZ2xlYWJsZTogYm9vbGVhbjtcblxuICAgIEBJbnB1dCgpIGhlYWRlcjogc3RyaW5nO1xuXG4gICAgQElucHV0KCkgY29sbGFwc2VkOiBib29sZWFuID0gZmFsc2U7XG5cbiAgICBASW5wdXQoKSBzdHlsZTogYW55O1xuXG4gICAgQElucHV0KCkgc3R5bGVDbGFzczogc3RyaW5nO1xuXG4gICAgQElucHV0KCkgaWNvblBvczogUGFuZWxJY29uUG9zaXRpb24gPSAnZW5kJztcblxuICAgIEBJbnB1dCgpIGV4cGFuZEljb246IHN0cmluZyA9ICdwaSBwaS1wbHVzJztcblxuICAgIEBJbnB1dCgpIGNvbGxhcHNlSWNvbjogc3RyaW5nID0gJ3BpIHBpLW1pbnVzJztcblxuICAgIEBJbnB1dCgpIHNob3dIZWFkZXI6IGJvb2xlYW4gPSB0cnVlO1xuXG4gICAgQElucHV0KCkgdG9nZ2xlcjogc3RyaW5nID0gJ2ljb24nO1xuXG4gICAgQE91dHB1dCgpIGNvbGxhcHNlZENoYW5nZTogRXZlbnRFbWl0dGVyPGFueT4gPSBuZXcgRXZlbnRFbWl0dGVyKCk7XG5cbiAgICBAT3V0cHV0KCkgb25CZWZvcmVUb2dnbGU6IEV2ZW50RW1pdHRlcjxhbnk+ID0gbmV3IEV2ZW50RW1pdHRlcigpO1xuXG4gICAgQE91dHB1dCgpIG9uQWZ0ZXJUb2dnbGU6IEV2ZW50RW1pdHRlcjxhbnk+ID0gbmV3IEV2ZW50RW1pdHRlcigpO1xuXG4gICAgQElucHV0KCkgdHJhbnNpdGlvbk9wdGlvbnM6IHN0cmluZyA9ICc0MDBtcyBjdWJpYy1iZXppZXIoMC44NiwgMCwgMC4wNywgMSknO1xuXG4gICAgQENvbnRlbnRDaGlsZChGb290ZXIpIGZvb3RlckZhY2V0O1xuXG4gICAgQENvbnRlbnRDaGlsZHJlbihQcmltZVRlbXBsYXRlKSB0ZW1wbGF0ZXM6IFF1ZXJ5TGlzdDxhbnk+O1xuXG4gICAgcHVibGljIGljb25UZW1wbGF0ZTogVGVtcGxhdGVSZWY8YW55PjtcblxuICAgIGFuaW1hdGluZzogYm9vbGVhbjtcblxuICAgIGhlYWRlclRlbXBsYXRlOiBUZW1wbGF0ZVJlZjxhbnk+O1xuXG4gICAgY29udGVudFRlbXBsYXRlOiBUZW1wbGF0ZVJlZjxhbnk+O1xuXG4gICAgZm9vdGVyVGVtcGxhdGU6IFRlbXBsYXRlUmVmPGFueT47XG5cbiAgICBpZDogc3RyaW5nID0gYHAtcGFuZWwtJHtpZHgrK31gO1xuXG4gICAgY29uc3RydWN0b3IocHJpdmF0ZSBlbDogRWxlbWVudFJlZikge31cblxuICAgIG5nQWZ0ZXJDb250ZW50SW5pdCgpIHtcbiAgICAgICAgdGhpcy50ZW1wbGF0ZXMuZm9yRWFjaCgoaXRlbSkgPT4ge1xuICAgICAgICAgICAgc3dpdGNoIChpdGVtLmdldFR5cGUoKSkge1xuICAgICAgICAgICAgICAgIGNhc2UgJ2hlYWRlcic6XG4gICAgICAgICAgICAgICAgICAgIHRoaXMuaGVhZGVyVGVtcGxhdGUgPSBpdGVtLnRlbXBsYXRlO1xuICAgICAgICAgICAgICAgICAgICBicmVhaztcblxuICAgICAgICAgICAgICAgIGNhc2UgJ2NvbnRlbnQnOlxuICAgICAgICAgICAgICAgICAgICB0aGlzLmNvbnRlbnRUZW1wbGF0ZSA9IGl0ZW0udGVtcGxhdGU7XG4gICAgICAgICAgICAgICAgICAgIGJyZWFrO1xuXG4gICAgICAgICAgICAgICAgY2FzZSAnZm9vdGVyJzpcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5mb290ZXJUZW1wbGF0ZSA9IGl0ZW0udGVtcGxhdGU7XG4gICAgICAgICAgICAgICAgICAgIGJyZWFrO1xuXG4gICAgICAgICAgICAgICAgY2FzZSAnaWNvbnMnOlxuICAgICAgICAgICAgICAgICAgICB0aGlzLmljb25UZW1wbGF0ZSA9IGl0ZW0udGVtcGxhdGU7XG4gICAgICAgICAgICAgICAgICAgIGJyZWFrO1xuXG4gICAgICAgICAgICAgICAgZGVmYXVsdDpcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5jb250ZW50VGVtcGxhdGUgPSBpdGVtLnRlbXBsYXRlO1xuICAgICAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgIH1cbiAgICAgICAgfSk7XG4gICAgfVxuXG4gICAgb25IZWFkZXJDbGljayhldmVudDogRXZlbnQpIHtcbiAgICAgICAgaWYgKHRoaXMudG9nZ2xlciA9PT0gJ2hlYWRlcicpIHtcbiAgICAgICAgICAgIHRoaXMudG9nZ2xlKGV2ZW50KTtcbiAgICAgICAgfVxuICAgIH1cblxuICAgIG9uSWNvbkNsaWNrKGV2ZW50OiBFdmVudCkge1xuICAgICAgICBpZiAodGhpcy50b2dnbGVyID09PSAnaWNvbicpIHtcbiAgICAgICAgICAgIHRoaXMudG9nZ2xlKGV2ZW50KTtcbiAgICAgICAgfVxuICAgIH1cblxuICAgIHRvZ2dsZShldmVudDogRXZlbnQpIHtcbiAgICAgICAgaWYgKHRoaXMuYW5pbWF0aW5nKSB7XG4gICAgICAgICAgICByZXR1cm4gZmFsc2U7XG4gICAgICAgIH1cblxuICAgICAgICB0aGlzLmFuaW1hdGluZyA9IHRydWU7XG4gICAgICAgIHRoaXMub25CZWZvcmVUb2dnbGUuZW1pdCh7IG9yaWdpbmFsRXZlbnQ6IGV2ZW50LCBjb2xsYXBzZWQ6IHRoaXMuY29sbGFwc2VkIH0pO1xuXG4gICAgICAgIGlmICh0aGlzLnRvZ2dsZWFibGUpIHtcbiAgICAgICAgICAgIGlmICh0aGlzLmNvbGxhcHNlZCkgdGhpcy5leHBhbmQoZXZlbnQpO1xuICAgICAgICAgICAgZWxzZSB0aGlzLmNvbGxhcHNlKGV2ZW50KTtcbiAgICAgICAgfVxuXG4gICAgICAgIGV2ZW50LnByZXZlbnREZWZhdWx0KCk7XG4gICAgfVxuXG4gICAgZXhwYW5kKGV2ZW50KSB7XG4gICAgICAgIHRoaXMuY29sbGFwc2VkID0gZmFsc2U7XG4gICAgICAgIHRoaXMuY29sbGFwc2VkQ2hhbmdlLmVtaXQodGhpcy5jb2xsYXBzZWQpO1xuICAgIH1cblxuICAgIGNvbGxhcHNlKGV2ZW50KSB7XG4gICAgICAgIHRoaXMuY29sbGFwc2VkID0gdHJ1ZTtcbiAgICAgICAgdGhpcy5jb2xsYXBzZWRDaGFuZ2UuZW1pdCh0aGlzLmNvbGxhcHNlZCk7XG4gICAgfVxuXG4gICAgZ2V0QmxvY2thYmxlRWxlbWVudCgpOiBIVE1MRWxlbWVudCB7XG4gICAgICAgIHJldHVybiB0aGlzLmVsLm5hdGl2ZUVsZW1lbnQuY2hpbGRyZW5bMF07XG4gICAgfVxuXG4gICAgb25Ub2dnbGVEb25lKGV2ZW50OiBFdmVudCkge1xuICAgICAgICB0aGlzLmFuaW1hdGluZyA9IGZhbHNlO1xuICAgICAgICB0aGlzLm9uQWZ0ZXJUb2dnbGUuZW1pdCh7IG9yaWdpbmFsRXZlbnQ6IGV2ZW50LCBjb2xsYXBzZWQ6IHRoaXMuY29sbGFwc2VkIH0pO1xuICAgIH1cbn1cblxuQE5nTW9kdWxlKHtcbiAgICBpbXBvcnRzOiBbQ29tbW9uTW9kdWxlLCBTaGFyZWRNb2R1bGUsIFJpcHBsZU1vZHVsZV0sXG4gICAgZXhwb3J0czogW1BhbmVsLCBTaGFyZWRNb2R1bGVdLFxuICAgIGRlY2xhcmF0aW9uczogW1BhbmVsXVxufSlcbmV4cG9ydCBjbGFzcyBQYW5lbE1vZHVsZSB7fVxuIl19
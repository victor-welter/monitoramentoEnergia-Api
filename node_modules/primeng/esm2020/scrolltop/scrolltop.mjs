import { NgModule, Component, ChangeDetectionStrategy, ViewEncapsulation, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { animate, state, style, transition, trigger } from '@angular/animations';
import { DomHandler } from 'primeng/dom';
import { ZIndexUtils } from 'primeng/utils';
import * as i0 from "@angular/core";
import * as i1 from "primeng/api";
import * as i2 from "@angular/common";
export class ScrollTop {
    constructor(el, cd, config) {
        this.el = el;
        this.cd = cd;
        this.config = config;
        this.target = 'window';
        this.threshold = 400;
        this.icon = 'pi pi-chevron-up';
        this.behavior = 'smooth';
        this.showTransitionOptions = '.15s';
        this.hideTransitionOptions = '.15s';
        this.visible = false;
    }
    ngOnInit() {
        if (this.target === 'window')
            this.bindDocumentScrollListener();
        else if (this.target === 'parent')
            this.bindParentScrollListener();
    }
    onClick() {
        let scrollElement = this.target === 'window' ? window : this.el.nativeElement.parentElement;
        scrollElement.scroll({
            top: 0,
            behavior: this.behavior
        });
    }
    onEnter(event) {
        switch (event.toState) {
            case 'open':
                this.overlay = event.element;
                ZIndexUtils.set('overlay', this.overlay, this.config.zIndex.overlay);
                break;
            case 'void':
                this.overlay = null;
                break;
        }
    }
    onLeave(event) {
        switch (event.toState) {
            case 'void':
                ZIndexUtils.clear(event.element);
                break;
        }
    }
    checkVisibility(scrollY) {
        if (scrollY > this.threshold)
            this.visible = true;
        else
            this.visible = false;
        this.cd.markForCheck();
    }
    bindParentScrollListener() {
        this.scrollListener = () => {
            this.checkVisibility(this.el.nativeElement.parentElement.scrollTop);
        };
        this.el.nativeElement.parentElement.addEventListener('scroll', this.scrollListener);
    }
    bindDocumentScrollListener() {
        this.scrollListener = () => {
            this.checkVisibility(DomHandler.getWindowScrollTop());
        };
        window.addEventListener('scroll', this.scrollListener);
    }
    unbindParentScrollListener() {
        if (this.scrollListener) {
            this.el.nativeElement.parentElement.removeEventListener('scroll', this.scrollListener);
            this.scrollListener = null;
        }
    }
    unbindDocumentScrollListener() {
        if (this.scrollListener) {
            window.removeEventListener('scroll', this.scrollListener);
            this.scrollListener = null;
        }
    }
    containerClass() {
        return {
            'p-scrolltop p-link p-component': true,
            'p-scrolltop-sticky': this.target !== 'window'
        };
    }
    ngOnDestroy() {
        if (this.target === 'window')
            this.unbindDocumentScrollListener();
        else if (this.target === 'parent')
            this.unbindParentScrollListener();
        if (this.overlay) {
            ZIndexUtils.clear(this.overlay);
            this.overlay = null;
        }
    }
}
ScrollTop.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "14.0.7", ngImport: i0, type: ScrollTop, deps: [{ token: i0.ElementRef }, { token: i0.ChangeDetectorRef }, { token: i1.PrimeNGConfig }], target: i0.ɵɵFactoryTarget.Component });
ScrollTop.ɵcmp = i0.ɵɵngDeclareComponent({ minVersion: "14.0.0", version: "14.0.7", type: ScrollTop, selector: "p-scrollTop", inputs: { styleClass: "styleClass", style: "style", target: "target", threshold: "threshold", icon: "icon", behavior: "behavior", showTransitionOptions: "showTransitionOptions", hideTransitionOptions: "hideTransitionOptions" }, host: { classAttribute: "p-element" }, ngImport: i0, template: `
        <button
            *ngIf="visible"
            [@animation]="{ value: 'open', params: { showTransitionParams: showTransitionOptions, hideTransitionParams: hideTransitionOptions } }"
            (@animation.start)="onEnter($event)"
            (@animation.done)="onLeave($event)"
            [ngClass]="containerClass()"
            (click)="onClick()"
            [class]="styleClass"
            [ngStyle]="style"
            type="button"
        >
            <span [class]="icon" [ngClass]="'p-scrolltop-icon'"></span>
        </button>
    `, isInline: true, styles: [".p-scrolltop{position:fixed;bottom:20px;right:20px;display:flex;align-items:center;justify-content:center}.p-scrolltop-sticky{position:sticky}.p-scrolltop-sticky.p-link{margin-left:auto}\n"], dependencies: [{ kind: "directive", type: i2.NgClass, selector: "[ngClass]", inputs: ["class", "ngClass"] }, { kind: "directive", type: i2.NgIf, selector: "[ngIf]", inputs: ["ngIf", "ngIfThen", "ngIfElse"] }, { kind: "directive", type: i2.NgStyle, selector: "[ngStyle]", inputs: ["ngStyle"] }], animations: [
        trigger('animation', [
            state('void', style({
                opacity: 0
            })),
            state('open', style({
                opacity: 1
            })),
            transition('void => open', animate('{{showTransitionParams}}')),
            transition('open => void', animate('{{hideTransitionParams}}'))
        ])
    ], changeDetection: i0.ChangeDetectionStrategy.OnPush, encapsulation: i0.ViewEncapsulation.None });
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "14.0.7", ngImport: i0, type: ScrollTop, decorators: [{
            type: Component,
            args: [{ selector: 'p-scrollTop', template: `
        <button
            *ngIf="visible"
            [@animation]="{ value: 'open', params: { showTransitionParams: showTransitionOptions, hideTransitionParams: hideTransitionOptions } }"
            (@animation.start)="onEnter($event)"
            (@animation.done)="onLeave($event)"
            [ngClass]="containerClass()"
            (click)="onClick()"
            [class]="styleClass"
            [ngStyle]="style"
            type="button"
        >
            <span [class]="icon" [ngClass]="'p-scrolltop-icon'"></span>
        </button>
    `, changeDetection: ChangeDetectionStrategy.OnPush, encapsulation: ViewEncapsulation.None, animations: [
                        trigger('animation', [
                            state('void', style({
                                opacity: 0
                            })),
                            state('open', style({
                                opacity: 1
                            })),
                            transition('void => open', animate('{{showTransitionParams}}')),
                            transition('open => void', animate('{{hideTransitionParams}}'))
                        ])
                    ], host: {
                        class: 'p-element'
                    }, styles: [".p-scrolltop{position:fixed;bottom:20px;right:20px;display:flex;align-items:center;justify-content:center}.p-scrolltop-sticky{position:sticky}.p-scrolltop-sticky.p-link{margin-left:auto}\n"] }]
        }], ctorParameters: function () { return [{ type: i0.ElementRef }, { type: i0.ChangeDetectorRef }, { type: i1.PrimeNGConfig }]; }, propDecorators: { styleClass: [{
                type: Input
            }], style: [{
                type: Input
            }], target: [{
                type: Input
            }], threshold: [{
                type: Input
            }], icon: [{
                type: Input
            }], behavior: [{
                type: Input
            }], showTransitionOptions: [{
                type: Input
            }], hideTransitionOptions: [{
                type: Input
            }] } });
export class ScrollTopModule {
}
ScrollTopModule.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "14.0.7", ngImport: i0, type: ScrollTopModule, deps: [], target: i0.ɵɵFactoryTarget.NgModule });
ScrollTopModule.ɵmod = i0.ɵɵngDeclareNgModule({ minVersion: "14.0.0", version: "14.0.7", ngImport: i0, type: ScrollTopModule, declarations: [ScrollTop], imports: [CommonModule], exports: [ScrollTop] });
ScrollTopModule.ɵinj = i0.ɵɵngDeclareInjector({ minVersion: "12.0.0", version: "14.0.7", ngImport: i0, type: ScrollTopModule, imports: [CommonModule] });
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "14.0.7", ngImport: i0, type: ScrollTopModule, decorators: [{
            type: NgModule,
            args: [{
                    imports: [CommonModule],
                    exports: [ScrollTop],
                    declarations: [ScrollTop]
                }]
        }] });
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoic2Nyb2xsdG9wLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vc3JjL2FwcC9jb21wb25lbnRzL3Njcm9sbHRvcC9zY3JvbGx0b3AudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUEsT0FBTyxFQUFFLFFBQVEsRUFBRSxTQUFTLEVBQUUsdUJBQXVCLEVBQUUsaUJBQWlCLEVBQUUsS0FBSyxFQUFvRCxNQUFNLGVBQWUsQ0FBQztBQUN6SixPQUFPLEVBQUUsWUFBWSxFQUFFLE1BQU0saUJBQWlCLENBQUM7QUFDL0MsT0FBTyxFQUFFLE9BQU8sRUFBRSxLQUFLLEVBQUUsS0FBSyxFQUFFLFVBQVUsRUFBRSxPQUFPLEVBQWtCLE1BQU0scUJBQXFCLENBQUM7QUFDakcsT0FBTyxFQUFFLFVBQVUsRUFBRSxNQUFNLGFBQWEsQ0FBQztBQUN6QyxPQUFPLEVBQUUsV0FBVyxFQUFFLE1BQU0sZUFBZSxDQUFDOzs7O0FBNkM1QyxNQUFNLE9BQU8sU0FBUztJQXVCbEIsWUFBbUIsRUFBYyxFQUFVLEVBQXFCLEVBQVMsTUFBcUI7UUFBM0UsT0FBRSxHQUFGLEVBQUUsQ0FBWTtRQUFVLE9BQUUsR0FBRixFQUFFLENBQW1CO1FBQVMsV0FBTSxHQUFOLE1BQU0sQ0FBZTtRQWxCckYsV0FBTSxHQUFXLFFBQVEsQ0FBQztRQUUxQixjQUFTLEdBQVcsR0FBRyxDQUFDO1FBRXhCLFNBQUksR0FBVyxrQkFBa0IsQ0FBQztRQUVsQyxhQUFRLEdBQVcsUUFBUSxDQUFDO1FBRTVCLDBCQUFxQixHQUFXLE1BQU0sQ0FBQztRQUV2QywwQkFBcUIsR0FBVyxNQUFNLENBQUM7UUFJaEQsWUFBTyxHQUFZLEtBQUssQ0FBQztJQUl3RSxDQUFDO0lBRWxHLFFBQVE7UUFDSixJQUFJLElBQUksQ0FBQyxNQUFNLEtBQUssUUFBUTtZQUFFLElBQUksQ0FBQywwQkFBMEIsRUFBRSxDQUFDO2FBQzNELElBQUksSUFBSSxDQUFDLE1BQU0sS0FBSyxRQUFRO1lBQUUsSUFBSSxD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NEJBQ0QsVUFBVSxDQUFDLGNBQWMsRUFBRSxPQUFPLENBQUMsMEJBQTBCLENBQUMsQ0FBQzs0QkFDL0QsVUFBVSxDQUFDLGNBQWMsRUFBRSxPQUFPLENBQUMsMEJBQTBCLENBQUMsQ0FBQzt5QkFDbEUsQ0FBQztxQkFDTCxRQUNLO3dCQUNGLEtBQUssRUFBRSxXQUFXO3FCQUNyQjs2SkFHUSxVQUFVO3NCQUFsQixLQUFLO2dCQUVHLEtBQUs7c0JBQWIsS0FBSztnQkFFRyxNQUFNO3NCQUFkLEtBQUs7Z0JBRUcsU0FBUztzQkFBakIsS0FBSztnQkFFRyxJQUFJO3NCQUFaLEtBQUs7Z0JBRUcsUUFBUTtzQkFBaEIsS0FBSztnQkFFRyxxQkFBcUI7c0JBQTdCLEtBQUs7Z0JBRUcscUJBQXFCO3NCQUE3QixLQUFLOztBQXVHVixNQUFNLE9BQU8sZUFBZTs7NEdBQWYsZUFBZTs2R0FBZixlQUFlLGlCQXRIZixTQUFTLGFBa0hSLFlBQVksYUFsSGIsU0FBUzs2R0FzSFQsZUFBZSxZQUpkLFlBQVk7MkZBSWIsZUFBZTtrQkFMM0IsUUFBUTttQkFBQztvQkFDTixPQUFPLEVBQUUsQ0FBQyxZQUFZLENBQUM7b0JBQ3ZCLE9BQU8sRUFBRSxDQUFDLFNBQVMsQ0FBQztvQkFDcEIsWUFBWSxFQUFFLENBQUMsU0FBUyxDQUFDO2lCQUM1QiIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7IE5nTW9kdWxlLCBDb21wb25lbnQsIENoYW5nZURldGVjdGlvblN0cmF0ZWd5LCBWaWV3RW5jYXBzdWxhdGlvbiwgSW5wdXQsIE9uSW5pdCwgT25EZXN0cm95LCBFbGVtZW50UmVmLCBDaGFuZ2VEZXRlY3RvclJlZiB9IGZyb20gJ0Bhbmd1bGFyL2NvcmUnO1xuaW1wb3J0IHsgQ29tbW9uTW9kdWxlIH0gZnJvbSAnQGFuZ3VsYXIvY29tbW9uJztcbmltcG9ydCB7IGFuaW1hdGUsIHN0YXRlLCBzdHlsZSwgdHJhbnNpdGlvbiwgdHJpZ2dlciwgQW5pbWF0aW9uRXZlbnQgfSBmcm9tICdAYW5ndWxhci9hbmltYXRpb25zJztcbmltcG9ydCB7IERvbUhhbmRsZXIgfSBmcm9tICdwcmltZW5nL2RvbSc7XG5pbXBvcnQgeyBaSW5kZXhVdGlscyB9IGZyb20gJ3ByaW1lbmcvdXRpbHMnO1xuaW1wb3J0IHsgUHJpbWVOR0NvbmZpZyB9IGZyb20gJ3ByaW1lbmcvYXBpJztcblxuQENvbXBvbmVudCh7XG4gICAgc2VsZWN0b3I6ICdwLXNjcm9sbFRvcCcsXG4gICAgdGVtcGxhdGU6IGBcbiAgICAgICAgPGJ1dHRvblxuICAgICAgICAgICAgKm5nSWY9XCJ2aXNpYmxlXCJcbiAgICAgICAgICAgIFtAYW5pbWF0aW9uXT1cInsgdmFsdWU6ICdvcGVuJywgcGFyYW1zOiB7IHNob3dUcmFuc2l0aW9uUGFyYW1zOiBzaG93VHJhbnNpdGlvbk9wdGlvbnMsIGhpZGVUcmFuc2l0aW9uUGFyYW1zOiBoaWRlVHJhbnNpdGlvbk9wdGlvbnMgfSB9XCJcbiAgICAgICAgICAgIChAYW5pbWF0aW9uLnN0YXJ0KT1cIm9uRW50ZXIoJGV2ZW50KVwiXG4gICAgICAgICAgICAoQGFuaW1hdGlvbi5kb25lKT1cIm9uTGVhdmUoJGV2ZW50KVwiXG4gICAgICAgICAgICBbbmdDbGFzc109XCJjb250YWluZXJDbGFzcygpXCJcbiAgICAgICAgICAgIChjbGljayk9XCJvbkNsaWNrKClcIlxuICAgICAgICAgICAgW2NsYXNzXT1cInN0eWxlQ2xhc3NcIlxuICAgICAgICAgICAgW25nU3R5bGVdPVwic3R5bGVcIlxuICAgICAgICAgICAgdHlwZT1cImJ1dHRvblwiXG4gICAgICAgID5cbiAgICAgICAgICAgIDxzcGFuIFtjbGFzc109XCJpY29uXCIgW25nQ2xhc3NdPVwiJ3Atc2Nyb2xsdG9wLWljb24nXCI+PC9zcGFuPlxuICAgICAgICA8L2J1dHRvbj5cbiAgICBgLFxuICAgIGNoYW5nZURldGVjdGlvbjogQ2hhbmdlRGV0ZWN0aW9uU3RyYXRlZ3kuT25QdXNoLFxuICAgIGVuY2Fwc3VsYXRpb246IFZpZXdFbmNhcHN1bGF0aW9uLk5vbmUsXG4gICAgc3R5bGVVcmxzOiBbJy4vc2Nyb2xsdG9wLmNzcyddLFxuICAgIGFuaW1hdGlvbnM6IFtcbiAgICAgICAgdHJpZ2dlcignYW5pbWF0aW9uJywgW1xuICAgICAgICAgICAgc3RhdGUoXG4gICAgICAgICAgICAgICAgJ3ZvaWQnLFxuICAgICAgICAgICAgICAgIHN0eWxlKHtcbiAgICAgICAgICAgICAgICAgICAgb3BhY2l0eTogMFxuICAgICAgICAgICAgICAgIH0pXG4gICAgICAgICAgICApLFxuICAgICAgICAgICAgc3RhdGUoXG4gICAgICAgICAgICAgICAgJ29wZW4nLFxuICAgICAgICAgICAgICAgIHN0eWxlKHtcbiAgICAgICAgICAgICAgICAgICAgb3BhY2l0eTogMVxuICAgICAgICAgICAgICAgIH0pXG4gICAgICAgICAgICApLFxuICAgICAgICAgICAgdHJhbnNpdGlvbigndm9pZCA9PiBvcGVuJywgYW5pbWF0ZSgne3tzaG93VHJhbnNpdGlvblBhcmFtc319JykpLFxuICAgICAgICAgICAgdHJhbnNpdGlvbignb3BlbiA9PiB2b2lkJywgYW5pbWF0ZSgne3toaWRlVHJhbnNpdGlvblBhcmFtc319JykpXG4gICAgICAgIF0pXG4gICAgXSxcbiAgICBob3N0OiB7XG4gICAgICAgIGNsYXNzOiAncC1lbGVtZW50J1xuICAgIH1cbn0pXG5leHBvcnQgY2xhc3MgU2Nyb2xsVG9wIGltcGxlbWVudHMgT25Jbml0LCBPbkRlc3Ryb3kge1xuICAgIEBJbnB1dCgpIHN0eWxlQ2xhc3M6IHN0cmluZztcblxuICAgIEBJbnB1dCgpIHN0eWxlOiBhbnk7XG5cbiAgICBASW5wdXQoKSB0YXJnZXQ6IHN0cmluZyA9ICd3aW5kb3cnO1xuXG4gICAgQElucHV0KCkgdGhyZXNob2xkOiBudW1iZXIgPSA0MDA7XG5cbiAgICBASW5wdXQoKSBpY29uOiBzdHJpbmcgPSAncGkgcGktY2hldnJvbi11cCc7XG5cbiAgICBASW5wdXQoKSBiZWhhdmlvcjogc3RyaW5nID0gJ3Ntb290aCc7XG5cbiAgICBASW5wdXQoKSBzaG93VHJhbnNpdGlvbk9wdGlvbnM6IHN0cmluZyA9ICcuMTVzJztcblxuICAgIEBJbnB1dCgpIGhpZGVUcmFuc2l0aW9uT3B0aW9uczogc3RyaW5nID0gJy4xNXMnO1xuXG4gICAgc2Nyb2xsTGlzdGVuZXI6IGFueTtcblxuICAgIHZpc2libGU6IGJvb2xlYW4gPSBmYWxzZTtcblxuICAgIG92ZXJsYXk6IGFueTtcblxuICAgIGNvbnN0cnVjdG9yKHB1YmxpYyBlbDogRWxlbWVudFJlZiwgcHJpdmF0ZSBjZDogQ2hhbmdlRGV0ZWN0b3JSZWYsIHB1YmxpYyBjb25maWc6IFByaW1lTkdDb25maWcpIHt9XG5cbiAgICBuZ09uSW5pdCgpIHtcbiAgICAgICAgaWYgKHRoaXMudGFyZ2V0ID09PSAnd2luZG93JykgdGhpcy5iaW5kRG9jdW1lbnRTY3JvbGxMaXN0ZW5lcigpO1xuICAgICAgICBlbHNlIGlmICh0aGlzLnRhcmdldCA9PT0gJ3BhcmVudCcpIHRoaXMuYmluZFBhcmVudFNjcm9sbExpc3RlbmVyKCk7XG4gICAgfVxuXG4gICAgb25DbGljaygpIHtcbiAgICAgICAgbGV0IHNjcm9sbEVsZW1lbnQgPSB0aGlzLnRhcmdldCA9PT0gJ3dpbmRvdycgPyB3aW5kb3cgOiB0aGlzLmVsLm5hdGl2ZUVsZW1lbnQucGFyZW50RWxlbWVudDtcbiAgICAgICAgc2Nyb2xsRWxlbWVudC5zY3JvbGwoe1xuICAgICAgICAgICAgdG9wOiAwLFxuICAgICAgICAgICAgYmVoYXZpb3I6IHRoaXMuYmVoYXZpb3JcbiAgICAgICAgfSk7XG4gICAgfVxuXG4gICAgb25FbnRlcihldmVudDogQW5pbWF0aW9uRXZlbnQpIHtcbiAgICAgICAgc3dpdGNoIChldmVudC50b1N0YXRlKSB7XG4gICAgICAgICAgICBjYXNlICdvcGVuJzpcbiAgICAgICAgICAgICAgICB0aGlzLm92ZXJsYXkgPSBldmVudC5lbGVtZW50O1xuICAgICAgICAgICAgICAgIFpJbmRleFV0aWxzLnNldCgnb3ZlcmxheScsIHRoaXMub3ZlcmxheSwgdGhpcy5jb25maWcuekluZGV4Lm92ZXJsYXkpO1xuICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgY2FzZSAndm9pZCc6XG4gICAgICAgICAgICAgICAgdGhpcy5vdmVybGF5ID0gbnVsbDtcbiAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgfVxuICAgIH1cblxuICAgIG9uTGVhdmUoZXZlbnQ6IEFuaW1hdGlvbkV2ZW50KSB7XG4gICAgICAgIHN3aXRjaCAoZXZlbnQudG9TdGF0ZSkge1xuICAgICAgICAgICAgY2FzZSAndm9pZCc6XG4gICAgICAgICAgICAgICAgWkluZGV4VXRpbHMuY2xlYXIoZXZlbnQuZWxlbWVudCk7XG4gICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICBjaGVja1Zpc2liaWxpdHkoc2Nyb2xsWSkge1xuICAgICAgICBpZiAoc2Nyb2xsWSA+IHRoaXMudGhyZXNob2xkKSB0aGlzLnZpc2libGUgPSB0cnVlO1xuICAgICAgICBlbHNlIHRoaXMudmlzaWJsZSA9IGZhbHNlO1xuXG4gICAgICAgIHRoaXMuY2QubWFya0ZvckNoZWNrKCk7XG4gICAgfVxuXG4gICAgYmluZFBhcmVudFNjcm9sbExpc3RlbmVyKCkge1xuICAgICAgICB0aGlzLnNjcm9sbExpc3RlbmVyID0gKCkgPT4ge1xuICAgICAgICAgICAgdGhpcy5jaGVja1Zpc2liaWxpdHkodGhpcy5lbC5uYXRpdmVFbGVtZW50LnBhcmVudEVsZW1lbnQuc2Nyb2xsVG9wKTtcbiAgICAgICAgfTtcblxuICAgICAgICB0aGlzLmVsLm5hdGl2ZUVsZW1lbnQucGFyZW50RWxlbWVudC5hZGRFdmVudExpc3RlbmVyKCdzY3JvbGwnLCB0aGlzLnNjcm9sbExpc3RlbmVyKTtcbiAgICB9XG5cbiAgICBiaW5kRG9jdW1lbnRTY3JvbGxMaXN0ZW5lcigpIHtcbiAgICAgICAgdGhpcy5zY3JvbGxMaXN0ZW5lciA9ICgpID0+IHtcbiAgICAgICAgICAgIHRoaXMuY2hlY2tWaXNpYmlsaXR5KERvbUhhbmRsZXIuZ2V0V2luZG93U2Nyb2xsVG9wKCkpO1xuICAgICAgICB9O1xuXG4gICAgICAgIHdpbmRvdy5hZGRFdmVudExpc3RlbmVyKCdzY3JvbGwnLCB0aGlzLnNjcm9sbExpc3RlbmVyKTtcbiAgICB9XG5cbiAgICB1bmJpbmRQYXJlbnRTY3JvbGxMaXN0ZW5lcigpIHtcbiAgICAgICAgaWYgKHRoaXMuc2Nyb2xsTGlzdGVuZXIpIHtcbiAgICAgICAgICAgIHRoaXMuZWwubmF0aXZlRWxlbWVudC5wYXJlbnRFbGVtZW50LnJlbW92ZUV2ZW50TGlzdGVuZXIoJ3Njcm9sbCcsIHRoaXMuc2Nyb2xsTGlzdGVuZXIpO1xuICAgICAgICAgICAgdGhpcy5zY3JvbGxMaXN0ZW5lciA9IG51bGw7XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICB1bmJpbmREb2N1bWVudFNjcm9sbExpc3RlbmVyKCkge1xuICAgICAgICBpZiAodGhpcy5zY3JvbGxMaXN0ZW5lcikge1xuICAgICAgICAgICAgd2luZG93LnJlbW92ZUV2ZW50TGlzdGVuZXIoJ3Njcm9sbCcsIHRoaXMuc2Nyb2xsTGlzdGVuZXIpO1xuICAgICAgICAgICAgdGhpcy5zY3JvbGxMaXN0ZW5lciA9IG51bGw7XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICBjb250YWluZXJDbGFzcygpIHtcbiAgICAgICAgcmV0dXJuIHtcbiAgICAgICAgICAgICdwLXNjcm9sbHRvcCBwLWxpbmsgcC1jb21wb25lbnQnOiB0cnVlLFxuICAgICAgICAgICAgJ3Atc2Nyb2xsdG9wLXN0aWNreSc6IHRoaXMudGFyZ2V0ICE9PSAnd2luZG93J1xuICAgICAgICB9O1xuICAgIH1cblxuICAgIG5nT25EZXN0cm95KCkge1xuICAgICAgICBpZiAodGhpcy50YXJnZXQgPT09ICd3aW5kb3cnKSB0aGlzLnVuYmluZERvY3VtZW50U2Nyb2xsTGlzdGVuZXIoKTtcbiAgICAgICAgZWxzZSBpZiAodGhpcy50YXJnZXQgPT09ICdwYXJlbnQnKSB0aGlzLnVuYmluZFBhcmVudFNjcm9sbExpc3RlbmVyKCk7XG5cbiAgICAgICAgaWYgKHRoaXMub3ZlcmxheSkge1xuICAgICAgICAgICAgWkluZGV4VXRpbHMuY2xlYXIodGhpcy5vdmVybGF5KTtcbiAgICAgICAgICAgIHRoaXMub3ZlcmxheSA9IG51bGw7XG4gICAgICAgIH1cbiAgICB9XG59XG5cbkBOZ01vZHVsZSh7XG4gICAgaW1wb3J0czogW0NvbW1vbk1vZHVsZV0sXG4gICAgZXhwb3J0czogW1Njcm9sbFRvcF0sXG4gICAgZGVjbGFyYXRpb25zOiBbU2Nyb2xsVG9wXVxufSlcbmV4cG9ydCBjbGFzcyBTY3JvbGxUb3BNb2R1bGUge31cbiJdfQ==
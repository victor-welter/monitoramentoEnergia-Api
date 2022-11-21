import { animate, animation, style, transition, trigger, useAnimation } from '@angular/animations';
import { CommonModule, DOCUMENT } from '@angular/common';
import { ChangeDetectionStrategy, Component, ContentChildren, EventEmitter, forwardRef, Inject, Input, NgModule, Output, ViewChild, ViewEncapsulation } from '@angular/core';
import { NG_VALUE_ACCESSOR } from '@angular/forms';
import { PrimeTemplate, SharedModule } from 'primeng/api';
import { ConnectedOverlayScrollHandler, DomHandler } from 'primeng/dom';
import { ObjectUtils, ZIndexUtils } from 'primeng/utils';
import * as i0 from "@angular/core";
import * as i1 from "primeng/api";
import * as i2 from "@angular/common";
export const OVERLAY_VALUE_ACCESSOR = {
    provide: NG_VALUE_ACCESSOR,
    useExisting: forwardRef(() => Overlay),
    multi: true
};
const showOverlayContentAnimation = animation([style({ transform: '{{transform}}', opacity: 0 }), animate('{{showTransitionParams}}')]);
const hideOverlayContentAnimation = animation([animate('{{hideTransitionParams}}', style({ transform: '{{transform}}', opacity: 0 }))]);
export class Overlay {
    constructor(document, el, renderer, config, overlayService, cd) {
        this.document = document;
        this.el = el;
        this.renderer = renderer;
        this.config = config;
        this.overlayService = overlayService;
        this.cd = cd;
        this.visibleChange = new EventEmitter();
        this.onBeforeShow = new EventEmitter();
        this.onShow = new EventEmitter();
        this.onBeforeHide = new EventEmitter();
        this.onHide = new EventEmitter();
        this.onAnimationStart = new EventEmitter();
        this.onAnimationDone = new EventEmitter();
        this._visible = false;
        this.modalVisible = false;
        this.isOverlayClicked = false;
        this.isOverlayContentClicked = false;
        this.transformOptions = {
            default: 'scaleY(0.8)',
            center: 'scale(0.7)',
            top: 'translate3d(0px, -100%, 0px)',
            'top-start': 'translate3d(0px, -100%, 0px)',
            'top-end': 'translate3d(0px, -100%, 0px)',
            bottom: 'translate3d(0px, 100%, 0px)',
            'bottom-start': 'translate3d(0px, 100%, 0px)',
            'bottom-end': 'translate3d(0px, 100%, 0px)',
            left: 'translate3d(-100%, 0px, 0px)',
            'left-start': 'translate3d(-100%, 0px, 0px)',
            'left-end': 'translate3d(-100%, 0px, 0px)',
            right: 'translate3d(100%, 0px, 0px)',
            'right-start': 'translate3d(100%, 0px, 0px)',
            'right-end': 'translate3d(100%, 0px, 0px)'
        };
        this.window = this.document.defaultView;
    }
    get visible() {
        return this._visible;
    }
    set visible(value) {
        this._visible = value;
        if (this._visible && !this.modalVisible) {
            this.modalVisible = true;
        }
    }
    get mode() {
        return this._mode || this.overlayOptions?.mode;
    }
    set mode(value) {
        this._mode = value;
    }
    get style() {
        return ObjectUtils.merge(this._style, this.modal ? this.overlayResponsiveOptions?.style : this.overlayOptions?.style);
    }
    set style(value) {
        this._style = value;
    }
    get styleClass() {
        return ObjectUtils.merge(this._styleClass, this.modal ? this.overlayResponsiveOptions?.styleClass : this.overlayOptions?.styleClass);
    }
    set styleClass(value) {
        this._styleClass = value;
    }
    get contentStyle() {
        return ObjectUtils.merge(this._contentStyle, this.modal ? this.overlayResponsiveOptions?.contentStyle : this.overlayOptions?.contentStyle);
    }
    set contentStyle(value) {
        this._contentStyle = value;
    }
    get contentStyleClass() {
        return ObjectUtils.merge(this._contentStyleClass, this.modal ? this.overlayResponsiveOptions?.contentStyleClass : this.overlayOptions?.contentStyleClass);
    }
    set contentStyleClass(value) {
        this._contentStyleClass = value;
    }
    get target() {
        const value = this._target || this.overlayOptions?.target;
        return value === undefined ? '@prev' : value;
    }
    set target(value) {
        this._target = value;
    }
    get appendTo() {
        return this._appendTo || this.overlayOptions?.appendTo;
    }
    set appendTo(value) {
        this._appendTo = value;
    }
    get autoZIndex() {
        const value = this._autoZIndex || this.overlayOptions?.autoZIndex;
        return value === undefined ? true : value;
    }
    set autoZIndex(value) {
        this._autoZIndex = value;
    }
    get baseZIndex() {
        const value = this._baseZIndex || this.overlayOptions?.baseZIndex;
        return value === undefined ? 0 : value;
    }
    set baseZIndex(value) {
        this._baseZIndex = value;
    }
    get showTransitionOptions() {
        const value = this._showTransitionOptions || this.overlayOptions?.showTransitionOptions;
        return value === undefined ? '.12s cubic-bezier(0, 0, 0.2, 1)' : value;
    }
    set showTransitionOptions(value) {
        this._showTransitionOptions = value;
    }
    get hideTransitionOptions() {
        const value = this._hideTransitionOptions || this.overlayOptions?.hideTransitionOptions;
        return value === undefined ? '.1s linear' : value;
    }
    set hideTransitionOptions(value) {
        this._hideTransitionOptions = value;
    }
    get listener() {
        return this._listener || this.overlayOptions?.listener;
    }
    set listener(value) {
        this._listener = value;
    }
    get responsive() {
        return this._responsive || this.overlayOptions?.responsive;
    }
    set responsive(val) {
        this._responsive = val;
    }
    get options() {
        return this._options;
    }
    set options(val) {
        this._options = val;
    }
    get modal() {
        return this.mode === 'modal' || (this.overlayResponsiveOptions && this.window?.matchMedia(this.overlayResponsiveOptions.media?.replace('@media', '') || `(max-width: ${this.overlayResponsiveOptions.breakpoint})`).matches);
    }
    get overlayMode() {
        return this.mode || (this.modal ? 'modal' : 'overlay');
    }
    get overlayOptions() {
        return { ...this.config?.overlayOptions, ...this.options }; // TODO: Improve performance
    }
    get overlayResponsiveOptions() {
        return { ...this.overlayOptions?.responsive, ...this.responsive }; // TODO: Improve performance
    }
    get overlayResponsiveDirection() {
        return this.overlayResponsiveOptions?.direction || 'center';
    }
    get overlayEl() {
        return this.overlayViewChild?.nativeElement;
    }
    get contentEl() {
        return this.contentViewChild?.nativeElement;
    }
    get targetEl() {
        return DomHandler.getTargetElement(this.target, this.el?.nativeElement);
    }
    ngAfterContentInit() {
        this.templates?.forEach((item) => {
            switch (item.getType()) {
                case 'content':
                    this.contentTemplate = item.template;
                    break;
                // TODO: new template types may be added.
                default:
                    this.contentTemplate = item.template;
                    break;
            }
        });
    }
    show(overlay, isFocus = false) {
        this.onVisibleChange(true);
        this.handleEvents('onShow', { overlay: overlay || this.overlayEl, target: this.targetEl, mode: this.overlayMode });
        isFocus && DomHandler.focus(this.targetEl);
        this.modal && DomHandler.addClass(this.document?.body, 'p-overflow-hidden');
    }
    hide(overlay, isFocus = false) {
        this.onVisibleChange(false);
        this.handleEvents('onHide', { overlay: overlay || this.overlayEl, target: this.targetEl, mode: this.overlayMode });
        isFocus && DomHandler.focus(this.targetEl);
        this.modal && DomHandler.removeClass(this.document?.body, 'p-overflow-hidden');
    }
    alignOverlay() {
        !this.modal && DomHandler.alignOverlay(this.overlayEl, this.targetEl, this.appendTo);
    }
    onVisibleChange(visible) {
        this._visible = visible;
        this.visibleChange.emit(visible);
    }
    onOverlayClick() {
        this.isOverlayClicked = true;
    }
    onOverlayContentClick(event) {
        this.overlayService.add({
            originalEvent: event,
            target: this.targetEl
        });
        this.isOverlayContentClicked = true;
    }
    onOverlayContentAnimationStart(event) {
        switch (event.toState) {
            case 'visible':
                this.handleEvents('onBeforeShow', { overlay: this.overlayEl, target: this.targetEl, mode: this.overlayMode });
                if (this.autoZIndex) {
                    ZIndexUtils.set(this.overlayMode, this.overlayEl, this.baseZIndex + this.config?.zIndex[this.overlayMode]);
                }
                DomHandler.appendOverlay(this.overlayEl, this.appendTo === 'body' ? this.document.body : this.appendTo, this.appendTo);
                this.alignOverlay();
                break;
            case 'void':
                this.handleEvents('onBeforeHide', { overlay: this.overlayEl, target: this.targetEl, mode: this.overlayMode });
                DomHandler.appendOverlay(this.overlayEl, this.targetEl, this.appendTo);
                this.modal && DomHandler.addClass(this.overlayEl, 'p-component-overlay-leave');
                break;
        }
        this.handleEvents('onAnimationStart', event);
    }
    onOverlayContentAnimationDone(event) {
        const container = this.overlayEl || event.element.parentElement;
        switch (event.toState) {
            case 'visible':
                this.show(container, true);
                this.bindListeners();
                break;
            case 'void':
                this.hide(container, true);
                this.unbindListeners();
                ZIndexUtils.clear(container);
                this.modalVisible = false;
                break;
        }
        this.handleEvents('onAnimationDone', event);
    }
    handleEvents(name, params) {
        this[name].emit(params);
        this.options && this.options[name] && this.options[name](params);
        this.config?.overlayOptions && this.config?.overlayOptions[name] && this.config?.overlayOptions[name](params);
    }
    bindListeners() {
        this.bindScrollListener();
        this.bindDocumentClickListener();
        this.bindDocumentResizeListener();
    }
    unbindListeners() {
        this.unbindScrollListener();
        this.unbindDocumentClickListener();
        this.unbindDocumentResizeListener();
    }
    bindScrollListener() {
        if (!this.scrollHandler) {
            this.scrollHandler = new ConnectedOverlayScrollHandler(this.targetEl, (event) => {
                const valid = this.listener ? this.listener(event, { type: 'scroll', mode: this.overlayMode, valid: true }) : true;
                valid && this.hide(event, true);
            });
        }
        this.scrollHandler.bindScrollListener();
    }
    unbindScrollListener() {
        if (this.scrollHandler) {
            this.scrollHandler.unbindScrollListener();
        }
    }
    bindDocumentClickListener() {
        if (!this.documentClickListener) {
            this.documentClickListener = this.renderer.listen(this.document, 'click', (event) => {
                const isTargetClicked = this.targetEl && (this.targetEl.isSameNode(event.target) || (!this.isOverlayClicked && this.targetEl.contains(event.target)));
                const isOutsideClicked = !isTargetClicked && !this.isOverlayContentClicked;
                const valid = this.listener ? this.listener(event, { type: 'outside', mode: this.overlayMode, valid: event.which !== 3 && isOutsideClicked }) : isOutsideClicked;
                valid && this.hide(event);
                this.isOverlayClicked = this.isOverlayContentClicked = false;
            });
        }
    }
    unbindDocumentClickListener() {
        if (this.documentClickListener) {
            this.documentClickListener();
            this.documentClickListener = null;
        }
    }
    bindDocumentResizeListener() {
        if (!this.documentResizeListener) {
            this.documentResizeListener = this.renderer.listen('window', 'resize', (event) => {
                const valid = this.listener ? this.listener(event, { type: 'resize', mode: this.overlayMode, valid: !DomHandler.isTouchDevice() }) : !DomHandler.isTouchDevice();
                valid && this.hide(event, true);
            });
        }
    }
    unbindDocumentResizeListener() {
        if (this.documentResizeListener) {
            this.documentResizeListener();
            this.documentResizeListener = null;
        }
    }
    ngOnDestroy() {
        this.hide(this.overlayEl, true);
        if (this.overlayEl) {
            DomHandler.appendOverlay(this.overlayEl, this.targetEl, this.appendTo);
            ZIndexUtils.clear(this.overlayEl);
        }
        if (this.scrollHandler) {
            this.scrollHandler.destroy();
            this.scrollHandler = null;
        }
        this.unbindListeners();
    }
}
Overlay.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "14.0.7", ngImport: i0, type: Overlay, deps: [{ token: DOCUMENT }, { token: i0.ElementRef }, { token: i0.Renderer2 }, { token: i1.PrimeNGConfig }, { token: i1.OverlayService }, { token: i0.ChangeDetectorRef }], target: i0.ɵɵFactoryTarget.Component });
Overlay.ɵcmp = i0.ɵɵngDeclareComponent({ minVersion: "14.0.0", version: "14.0.7", type: Overlay, selector: "p-overlay", inputs: { visible: "visible", mode: "mode", style: "style", styleClass: "styleClass", contentStyle: "contentStyle", contentStyleClass: "contentStyleClass", target: "target", appendTo: "appendTo", autoZIndex: "autoZIndex", baseZIndex: "baseZIndex", showTransitionOptions: "showTransitionOptions", hideTransitionOptions: "hideTransitionOptions", listener: "listener", responsive: "responsive", options: "options" }, outputs: { visibleChange: "visibleChange", onBeforeShow: "onBeforeShow", onShow: "onShow", onBeforeHide: "onBeforeHide", onHide: "onHide", onAnimationStart: "onAnimationStart", onAnimationDone: "onAnimationDone" }, host: { classAttribute: "p-element" }, providers: [OVERLAY_VALUE_ACCESSOR], queries: [{ propertyName: "templates", predicate: PrimeTemplate }], viewQueries: [{ propertyName: "overlayViewChild", first: true, predicate: ["overlay"], descendants: true }, { propertyName: "contentViewChild", first: true, predicate: ["content"], descendants: true }], ngImport: i0, template: `
        <div
            *ngIf="modalVisible"
            #overlay
            [ngStyle]="style"
            [class]="styleClass"
            [ngClass]="{
                'p-overlay p-component': true,
                'p-overlay-modal p-component-overlay p-component-overlay-enter': modal,
                'p-overlay-center': modal && overlayResponsiveDirection === 'center',
                'p-overlay-top': modal && overlayResponsiveDirection === 'top',
                'p-overlay-top-start': modal && overlayResponsiveDirection === 'top-start',
                'p-overlay-top-end': modal && overlayResponsiveDirection === 'top-end',
                'p-overlay-bottom': modal && overlayResponsiveDirection === 'bottom',
                'p-overlay-bottom-start': modal && overlayResponsiveDirection === 'bottom-start',
                'p-overlay-bottom-end': modal && overlayResponsiveDirection === 'bottom-end',
                'p-overlay-left': modal && overlayResponsiveDirection === 'left',
                'p-overlay-left-start': modal && overlayResponsiveDirection === 'left-start',
                'p-overlay-left-end': modal && overlayResponsiveDirection === 'left-end',
                'p-overlay-right': modal && overlayResponsiveDirection === 'right',
                'p-overlay-right-start': modal && overlayResponsiveDirection === 'right-start',
                'p-overlay-right-end': modal && overlayResponsiveDirection === 'right-end'
            }"
            (click)="onOverlayClick($event)"
        >
            <div
                *ngIf="visible"
                #content
                [ngStyle]="contentStyle"
                [class]="contentStyleClass"
                [ngClass]="'p-overlay-content'"
                (click)="onOverlayContentClick($event)"
                [@overlayContentAnimation]="{ value: 'visible', params: { showTransitionParams: showTransitionOptions, hideTransitionParams: hideTransitionOptions, transform: transformOptions[modal ? overlayResponsiveDirection : 'default'] } }"
                (@overlayContentAnimation.start)="onOverlayContentAnimationStart($event)"
                (@overlayContentAnimation.done)="onOverlayContentAnimationDone($event)"
            >
                <ng-content></ng-content>
                <ng-container *ngTemplateOutlet="contentTemplate; context: { $implicit: { mode: overlayMode } }"></ng-container>
            </div>
        </div>
    `, isInline: true, styles: [".p-overlay{position:absolute;top:0;left:0}.p-overlay-modal{display:flex;align-items:center;justify-content:center;position:fixed;top:0;left:0;width:100%;height:100%}.p-overlay-content{transform-origin:inherit}.p-overlay-modal>.p-overlay-content{z-index:1;width:90%}.p-overlay-top{align-items:flex-start}.p-overlay-top-start{align-items:flex-start;justify-content:flex-start}.p-overlay-top-end{align-items:flex-start;justify-content:flex-end}.p-overlay-bottom{align-items:flex-end}.p-overlay-bottom-start{align-items:flex-end;justify-content:flex-start}.p-overlay-bottom-end{align-items:flex-end;justify-content:flex-end}.p-overlay-left{justify-content:flex-start}.p-overlay-left-start{justify-content:flex-start;align-items:flex-start}.p-overlay-left-end{justify-content:flex-start;align-items:flex-end}.p-overlay-right{justify-content:flex-end}.p-overlay-right-start{justify-content:flex-end;align-items:flex-start}.p-overlay-right-end{justify-content:flex-end;align-items:flex-end}\n"], dependencies: [{ kind: "directive", type: i2.NgClass, selector: "[ngClass]", inputs: ["class", "ngClass"] }, { kind: "directive", type: i2.NgIf, selector: "[ngIf]", inputs: ["ngIf", "ngIfThen", "ngIfElse"] }, { kind: "directive", type: i2.NgTemplateOutlet, selector: "[ngTemplateOutlet]", inputs: ["ngTemplateOutletContext", "ngTemplateOutlet", "ngTemplateOutletInjector"] }, { kind: "directive", type: i2.NgStyle, selector: "[ngStyle]", inputs: ["ngStyle"] }], animations: [trigger('overlayContentAnimation', [transition(':enter', [useAnimation(showOverlayContentAnimation)]), transition(':leave', [useAnimation(hideOverlayContentAnimation)])])], changeDetection: i0.ChangeDetectionStrategy.OnPush, encapsulation: i0.ViewEncapsulation.None });
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "14.0.7", ngImport: i0, type: Overlay, decorators: [{
            type: Component,
            args: [{ selector: 'p-overlay', template: `
        <div
            *ngIf="modalVisible"
            #overlay
            [ngStyle]="style"
            [class]="styleClass"
            [ngClass]="{
                'p-overlay p-component': true,
                'p-overlay-modal p-component-overlay p-component-overlay-enter': modal,
                'p-overlay-center': modal && overlayResponsiveDirection === 'center',
                'p-overlay-top': modal && overlayResponsiveDirection === 'top',
                'p-overlay-top-start': modal && overlayResponsiveDirection === 'top-start',
                'p-overlay-top-end': modal && overlayResponsiveDirection === 'top-end',
                'p-overlay-bottom': modal && overlayResponsiveDirection === 'bottom',
                'p-overlay-bottom-start': modal && overlayResponsiveDirection === 'bottom-start',
                'p-overlay-bottom-end': modal && overlayResponsiveDirection === 'bottom-end',
                'p-overlay-left': modal && overlayResponsiveDirection === 'left',
                'p-overlay-left-start': modal && overlayResponsiveDirection === 'left-start',
                'p-overlay-left-end': modal && overlayResponsiveDirection === 'left-end',
                'p-overlay-right': modal && overlayResponsiveDirection === 'right',
                'p-overlay-right-start': modal && overlayResponsiveDirection === 'right-start',
                'p-overlay-right-end': modal && overlayResponsiveDirection === 'right-end'
            }"
            (click)="onOverlayClick($event)"
        >
            <div
                *ngIf="visible"
                #content
                [ngStyle]="contentStyle"
                [class]="contentStyleClass"
                [ngClass]="'p-overlay-content'"
                (click)="onOverlayContentClick($event)"
                [@overlayContentAnimation]="{ value: 'visible', params: { showTransitionParams: showTransitionOptions, hideTransitionParams: hideTransitionOptions, transform: transformOptions[modal ? overlayResponsiveDirection : 'default'] } }"
                (@overlayContentAnimation.start)="onOverlayContentAnimationStart($event)"
                (@overlayContentAnimation.done)="onOverlayContentAnimationDone($event)"
            >
                <ng-content></ng-content>
                <ng-container *ngTemplateOutlet="contentTemplate; context: { $implicit: { mode: overlayMode } }"></ng-container>
            </div>
        </div>
    `, animations: [trigger('overlayContentAnimation', [transition(':enter', [useAnimation(showOverlayContentAnimation)]), transition(':leave', [useAnimation(hideOverlayContentAnimation)])])], changeDetection: ChangeDetectionStrategy.OnPush, encapsulation: ViewEncapsulation.None, providers: [OVERLAY_VALUE_ACCESSOR], host: {
                        class: 'p-element'
                    }, styles: [".p-overlay{position:absolute;top:0;left:0}.p-overlay-modal{display:flex;align-items:center;justify-content:center;position:fixed;top:0;left:0;width:100%;height:100%}.p-overlay-content{transform-origin:inherit}.p-overlay-modal>.p-overlay-content{z-index:1;width:90%}.p-overlay-top{align-items:flex-start}.p-overlay-top-start{align-items:flex-start;justify-content:flex-start}.p-overlay-top-end{align-items:flex-start;justify-content:flex-end}.p-overlay-bottom{align-items:flex-end}.p-overlay-bottom-start{align-items:flex-end;justify-content:flex-start}.p-overlay-bottom-end{align-items:flex-end;justify-content:flex-end}.p-overlay-left{justify-content:flex-start}.p-overlay-left-start{justify-content:flex-start;align-items:flex-start}.p-overlay-left-end{justify-content:flex-start;align-items:flex-end}.p-overlay-right{justify-content:flex-end}.p-overlay-right-start{justify-content:flex-end;align-items:flex-start}.p-overlay-right-end{justify-content:flex-end;align-items:flex-end}\n"] }]
        }], ctorParameters: function () { return [{ type: Document, decorators: [{
                    type: Inject,
                    args: [DOCUMENT]
                }] }, { type: i0.ElementRef }, { type: i0.Renderer2 }, { type: i1.PrimeNGConfig }, { type: i1.OverlayService }, { type: i0.ChangeDetectorRef }]; }, propDecorators: { visible: [{
                type: Input
            }], mode: [{
                type: Input
            }], style: [{
                type: Input
            }], styleClass: [{
                type: Input
            }], contentStyle: [{
                type: Input
            }], contentStyleClass: [{
                type: Input
            }], target: [{
                type: Input
            }], appendTo: [{
                type: Input
            }], autoZIndex: [{
                type: Input
            }], baseZIndex: [{
                type: Input
            }], showTransitionOptions: [{
                type: Input
            }], hideTransitionOptions: [{
                type: Input
            }], listener: [{
                type: Input
            }], responsive: [{
                type: Input
            }], options: [{
                type: Input
            }], visibleChange: [{
                type: Output
            }], onBeforeShow: [{
                type: Output
            }], onShow: [{
                type: Output
            }], onBeforeHide: [{
                type: Output
            }], onHide: [{
                type: Output
            }], onAnimationStart: [{
                type: Output
            }], onAnimationDone: [{
                type: Output
            }], templates: [{
                type: ContentChildren,
                args: [PrimeTemplate]
            }], overlayViewChild: [{
                type: ViewChild,
                args: ['overlay']
            }], contentViewChild: [{
                type: ViewChild,
                args: ['content']
            }] } });
export class OverlayModule {
}
OverlayModule.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "14.0.7", ngImport: i0, type: OverlayModule, deps: [], target: i0.ɵɵFactoryTarget.NgModule });
OverlayModule.ɵmod = i0.ɵɵngDeclareNgModule({ minVersion: "14.0.0", version: "14.0.7", ngImport: i0, type: OverlayModule, declarations: [Overlay], imports: [CommonModule, SharedModule], exports: [Overlay, SharedModule] });
OverlayModule.ɵinj = i0.ɵɵngDeclareInjector({ minVersion: "12.0.0", version: "14.0.7", ngImport: i0, type: OverlayModule, imports: [CommonModule, SharedModule, SharedModule] });
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "14.0.7", ngImport: i0, type: OverlayModule, decorators: [{
            type: NgModule,
            args: [{
                    imports: [CommonModule, SharedModule],
                    exports: [Overlay, SharedModule],
                    declarations: [Overlay]
                }]
        }] });
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoib3ZlcmxheS5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uL3NyYy9hcHAvY29tcG9uZW50cy9vdmVybGF5L292ZXJsYXkudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUEsT0FBTyxFQUFFLE9BQU8sRUFBRSxTQUFTLEVBQWtCLEtBQUssRUFBRSxVQUFVLEVBQUUsT0FBTyxFQUFFLFlBQVksRUFBRSxNQUFNLHFCQUFxQixDQUFDO0FBQ25ILE9BQU8sRUFBRSxZQUFZLEVBQUUsUUFBUSxFQUFFLE1BQU0saUJBQWlCLENBQUM7QUFDekQsT0FBTyxFQUVILHVCQUF1QixFQUV2QixTQUFTLEVBQ1QsZUFBZSxFQUVmLFlBQVksRUFDWixVQUFVLEVBQ1YsTUFBTSxFQUNOLEtBQUssRUFDTCxRQUFRLEVBRVIsTUFBTSxFQUlOLFNBQVMsRUFDVCxpQkFBaUIsRUFDcEIsTUFBTSxlQUFlLENBQUM7QUFDdkIsT0FBTyxFQUFFLGlCQUFpQixFQUFFLE1BQU0sZ0JBQWdCLENBQUM7QUFDbkQsT0FBTyxFQUFrRSxhQUFhLEVBQTRCLFlBQVksRUFBRSxNQUFNLGFBQWEsQ0FBQztBQUNwSixPQUFPLEVBQUUsNkJBQTZCLEVBQUUsVUFBVSxFQUFFLE1BQU0sYUFBYSxDQUFDO0FBQ3hFLE9BQU8sRUFBRSxXQUFXLEVBQUUsV0FBVyxFQUFFLE1BQU0sZUFBZSxDQUFDOzs7O0FBRXpELE1BQU0sQ0FBQyxNQUFNLHNCQUFzQixHQUFRO0lBQ3ZDLE9BQU8sRUFBRSxpQkFBaUI7SUFDMUIsV0FBVyxFQUFFLFVBQVUsQ0FBQyxHQUFHLEVBQUUsQ0FBQyxPQUFPLENBQUM7SUFDdEMsS0FBSyxFQUFFLElBQUk7Q0FDZCxDQUFDO0FBRUYsTUFBTSwyQkFBMkIsR0FBRyxTQUFTLENBQUMsQ0FBQyxLQUFLLENBQUMsRUFBRSxTQUFTLEVBQUUsZUFBZSxFQUFFLE9BQU8sRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLE9BQU8sQ0FBQywwQkFBMEIsQ0FBQyxDQUFDLENB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SztnQkFPSSxhQUFhO3NCQUF0QixNQUFNO2dCQUVHLFlBQVk7c0JBQXJCLE1BQU07Z0JBRUcsTUFBTTtzQkFBZixNQUFNO2dCQUVHLFlBQVk7c0JBQXJCLE1BQU07Z0JBRUcsTUFBTTtzQkFBZixNQUFNO2dCQUVHLGdCQUFnQjtzQkFBekIsTUFBTTtnQkFFRyxlQUFlO3NCQUF4QixNQUFNO2dCQUV5QixTQUFTO3NCQUF4QyxlQUFlO3VCQUFDLGFBQWE7Z0JBRVIsZ0JBQWdCO3NCQUFyQyxTQUFTO3VCQUFDLFNBQVM7Z0JBRUUsZ0JBQWdCO3NCQUFyQyxTQUFTO3VCQUFDLFNBQVM7O0FBd1N4QixNQUFNLE9BQU8sYUFBYTs7MEdBQWIsYUFBYTsyR0FBYixhQUFhLGlCQTdhYixPQUFPLGFBeWFOLFlBQVksRUFBRSxZQUFZLGFBemEzQixPQUFPLEVBMGFHLFlBQVk7MkdBR3RCLGFBQWEsWUFKWixZQUFZLEVBQUUsWUFBWSxFQUNqQixZQUFZOzJGQUd0QixhQUFhO2tCQUx6QixRQUFRO21CQUFDO29CQUNOLE9BQU8sRUFBRSxDQUFDLFlBQVksRUFBRSxZQUFZLENBQUM7b0JBQ3JDLE9BQU8sRUFBRSxDQUFDLE9BQU8sRUFBRSxZQUFZLENBQUM7b0JBQ2hDLFlBQVksRUFBRSxDQUFDLE9BQU8sQ0FBQztpQkFDMUIiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgeyBhbmltYXRlLCBhbmltYXRpb24sIEFuaW1hdGlvbkV2ZW50LCBzdHlsZSwgdHJhbnNpdGlvbiwgdHJpZ2dlciwgdXNlQW5pbWF0aW9uIH0gZnJvbSAnQGFuZ3VsYXIvYW5pbWF0aW9ucyc7XG5pbXBvcnQgeyBDb21tb25Nb2R1bGUsIERPQ1VNRU5UIH0gZnJvbSAnQGFuZ3VsYXIvY29tbW9uJztcbmltcG9ydCB7XG4gICAgQWZ0ZXJDb250ZW50SW5pdCxcbiAgICBDaGFuZ2VEZXRlY3Rpb25TdHJhdGVneSxcbiAgICBDaGFuZ2VEZXRlY3RvclJlZixcbiAgICBDb21wb25lbnQsXG4gICAgQ29udGVudENoaWxkcmVuLFxuICAgIEVsZW1lbnRSZWYsXG4gICAgRXZlbnRFbWl0dGVyLFxuICAgIGZvcndhcmRSZWYsXG4gICAgSW5qZWN0LFxuICAgIElucHV0LFxuICAgIE5nTW9kdWxlLFxuICAgIE9uRGVzdHJveSxcbiAgICBPdXRwdXQsXG4gICAgUXVlcnlMaXN0LFxuICAgIFJlbmRlcmVyMixcbiAgICBUZW1wbGF0ZVJlZixcbiAgICBWaWV3Q2hpbGQsXG4gICAgVmlld0VuY2Fwc3VsYXRpb25cbn0gZnJvbSAnQGFuZ3VsYXIvY29yZSc7XG5pbXBvcnQgeyBOR19WQUxVRV9BQ0NFU1NPUiB9IGZyb20gJ0Bhbmd1bGFyL2Zvcm1zJztcbmltcG9ydCB7IE92ZXJsYXlNb2RlVHlwZSwgT3ZlcmxheU9wdGlvbnMsIE92ZXJsYXlTZXJ2aWNlLCBQcmltZU5HQ29uZmlnLCBQcmltZVRlbXBsYXRlLCBSZXNwb25zaXZlT3ZlcmxheU9wdGlvbnMsIFNoYXJlZE1vZHVsZSB9IGZyb20gJ3ByaW1lbmcvYXBpJztcbmltcG9ydCB7IENvbm5lY3RlZE92ZXJsYXlTY3JvbGxIYW5kbGVyLCBEb21IYW5kbGVyIH0gZnJvbSAncHJpbWVuZy9kb20nO1xuaW1wb3J0IHsgT2JqZWN0VXRpbHMsIFpJbmRleFV0aWxzIH0gZnJvbSAncHJpbWVuZy91dGlscyc7XG5cbmV4cG9ydCBjb25zdCBPVkVSTEFZX1ZBTFVFX0FDQ0VTU09SOiBhbnkgPSB7XG4gICAgcHJvdmlkZTogTkdfVkFMVUVfQUNDRVNTT1IsXG4gICAgdXNlRXhpc3Rpbmc6IGZvcndhcmRSZWYoKCkgPT4gT3ZlcmxheSksXG4gICAgbXVsdGk6IHRydWVcbn07XG5cbmNvbnN0IHNob3dPdmVybGF5Q29udGVudEFuaW1hdGlvbiA9IGFuaW1hdGlvbihbc3R5bGUoeyB0cmFuc2Zvcm06ICd7e3RyYW5zZm9ybX19Jywgb3BhY2l0eTogMCB9KSwgYW5pbWF0ZSgne3tzaG93VHJhbnNpdGlvblBhcmFtc319JyldKTtcblxuY29uc3QgaGlkZU92ZXJsYXlDb250ZW50QW5pbWF0aW9uID0gYW5pbWF0aW9uKFthbmltYXRlKCd7e2hpZGVUcmFuc2l0aW9uUGFyYW1zfX0nLCBzdHlsZSh7IHRyYW5zZm9ybTogJ3t7dHJhbnNmb3JtfX0nLCBvcGFjaXR5OiAwIH0pKV0pO1xuXG5AQ29tcG9uZW50KHtcbiAgICBzZWxlY3RvcjogJ3Atb3ZlcmxheScsXG4gICAgdGVtcGxhdGU6IGBcbiAgICAgICAgPGRpdlxuICAgICAgICAgICAgKm5nSWY9XCJtb2RhbFZpc2libGVcIlxuICAgICAgICAgICAgI292ZXJsYXlcbiAgICAgICAgICAgIFtuZ1N0eWxlXT1cInN0eWxlXCJcbiAgICAgICAgICAgIFtjbGFzc109XCJzdHlsZUNsYXNzXCJcbiAgICAgICAgICAgIFtuZ0NsYXNzXT1cIntcbiAgICAgICAgICAgICAgICAncC1vdmVybGF5IHAtY29tcG9uZW50JzogdHJ1ZSxcbiAgICAgICAgICAgICAgICAncC1vdmVybGF5LW1vZGFsIHAtY29tcG9uZW50LW92ZXJsYXkgcC1jb21wb25lbnQtb3ZlcmxheS1lbnRlcic6IG1vZGFsLFxuICAgICAgICAgICAgICAgICdwLW92ZXJsYXktY2VudGVyJzogbW9kYWwgJiYgb3ZlcmxheVJlc3BvbnNpdmVEaXJlY3Rpb24gPT09ICdjZW50ZXInLFxuICAgICAgICAgICAgICAgICdwLW92ZXJsYXktdG9wJzogbW9kYWwgJiYgb3ZlcmxheVJlc3BvbnNpdmVEaXJlY3Rpb24gPT09ICd0b3AnLFxuICAgICAgICAgICAgICAgICdwLW92ZXJsYXktdG9wLXN0YXJ0JzogbW9kYWwgJiYgb3ZlcmxheVJlc3BvbnNpdmVEaXJlY3Rpb24gPT09ICd0b3Atc3RhcnQnLFxuICAgICAgICAgICAgICAgICdwLW92ZXJsYXktdG9wLWVuZCc6IG1vZGFsICYmIG92ZXJsYXlSZXNwb25zaXZlRGlyZWN0aW9uID09PSAndG9wLWVuZCcsXG4gICAgICAgICAgICAgICAgJ3Atb3ZlcmxheS1ib3R0b20nOiBtb2RhbCAmJiBvdmVybGF5UmVzcG9uc2l2ZURpcmVjdGlvbiA9PT0gJ2JvdHRvbScsXG4gICAgICAgICAgICAgICAgJ3Atb3ZlcmxheS1ib3R0b20tc3RhcnQnOiBtb2RhbCAmJiBvdmVybGF5UmVzcG9uc2l2ZURpcmVjdGlvbiA9PT0gJ2JvdHRvbS1zdGFydCcsXG4gICAgICAgICAgICAgICAgJ3Atb3ZlcmxheS1ib3R0b20tZW5kJzogbW9kYWwgJiYgb3ZlcmxheVJlc3BvbnNpdmVEaXJlY3Rpb24gPT09ICdib3R0b20tZW5kJyxcbiAgICAgICAgICAgICAgICAncC1vdmVybGF5LWxlZnQnOiBtb2RhbCAmJiBvdmVybGF5UmVzcG9uc2l2ZURpcmVjdGlvbiA9PT0gJ2xlZnQnLFxuICAgICAgICAgICAgICAgICdwLW92ZXJsYXktbGVmdC1zdGFydCc6IG1vZGFsICYmIG92ZXJsYXlSZXNwb25zaXZlRGlyZWN0aW9uID09PSAnbGVmdC1zdGFydCcsXG4gICAgICAgICAgICAgICAgJ3Atb3ZlcmxheS1sZWZ0LWVuZCc6IG1vZGFsICYmIG92ZXJsYXlSZXNwb25zaXZlRGlyZWN0aW9uID09PSAnbGVmdC1lbmQnLFxuICAgICAgICAgICAgICAgICdwLW92ZXJsYXktcmlnaHQnOiBtb2RhbCAmJiBvdmVybGF5UmVzcG9uc2l2ZURpcmVjdGlvbiA9PT0gJ3JpZ2h0JyxcbiAgICAgICAgICAgICAgICAncC1vdmVybGF5LXJpZ2h0LXN0YXJ0JzogbW9kYWwgJiYgb3ZlcmxheVJlc3BvbnNpdmVEaXJlY3Rpb24gPT09ICdyaWdodC1zdGFydCcsXG4gICAgICAgICAgICAgICAgJ3Atb3ZlcmxheS1yaWdodC1lbmQnOiBtb2RhbCAmJiBvdmVybGF5UmVzcG9uc2l2ZURpcmVjdGlvbiA9PT0gJ3JpZ2h0LWVuZCdcbiAgICAgICAgICAgIH1cIlxuICAgICAgICAgICAgKGNsaWNrKT1cIm9uT3ZlcmxheUNsaWNrKCRldmVudClcIlxuICAgICAgICA+XG4gICAgICAgICAgICA8ZGl2XG4gICAgICAgICAgICAgICAgKm5nSWY9XCJ2aXNpYmxlXCJcbiAgICAgICAgICAgICAgICAjY29udGVudFxuICAgICAgICAgICAgICAgIFtuZ1N0eWxlXT1cImNvbnRlbnRTdHlsZVwiXG4gICAgICAgICAgICAgICAgW2NsYXNzXT1cImNvbnRlbnRTdHlsZUNsYXNzXCJcbiAgICAgICAgICAgICAgICBbbmdDbGFzc109XCIncC1vdmVybGF5LWNvbnRlbnQnXCJcbiAgICAgICAgICAgICAgICAoY2xpY2spPVwib25PdmVybGF5Q29udGVudENsaWNrKCRldmVudClcIlxuICAgICAgICAgICAgICAgIFtAb3ZlcmxheUNvbnRlbnRBbmltYXRpb25dPVwieyB2YWx1ZTogJ3Zpc2libGUnLCBwYXJhbXM6IHsgc2hvd1RyYW5zaXRpb25QYXJhbXM6IHNob3dUcmFuc2l0aW9uT3B0aW9ucywgaGlkZVRyYW5zaXRpb25QYXJhbXM6IGhpZGVUcmFuc2l0aW9uT3B0aW9ucywgdHJhbnNmb3JtOiB0cmFuc2Zvcm1PcHRpb25zW21vZGFsID8gb3ZlcmxheVJlc3BvbnNpdmVEaXJlY3Rpb24gOiAnZGVmYXVsdCddIH0gfVwiXG4gICAgICAgICAgICAgICAgKEBvdmVybGF5Q29udGVudEFuaW1hdGlvbi5zdGFydCk9XCJvbk92ZXJsYXlDb250ZW50QW5pbWF0aW9uU3RhcnQoJGV2ZW50KVwiXG4gICAgICAgICAgICAgICAgKEBvdmVybGF5Q29udGVudEFuaW1hdGlvbi5kb25lKT1cIm9uT3ZlcmxheUNvbnRlbnRBbmltYXRpb25Eb25lKCRldmVudClcIlxuICAgICAgICAgICAgPlxuICAgICAgICAgICAgICAgIDxuZy1jb250ZW50PjwvbmctY29udGVudD5cbiAgICAgICAgICAgICAgICA8bmctY29udGFpbmVyICpuZ1RlbXBsYXRlT3V0bGV0PVwiY29udGVudFRlbXBsYXRlOyBjb250ZXh0OiB7ICRpbXBsaWNpdDogeyBtb2RlOiBvdmVybGF5TW9kZSB9IH1cIj48L25nLWNvbnRhaW5lcj5cbiAgICAgICAgICAgIDwvZGl2PlxuICAgICAgICA8L2Rpdj5cbiAgICBgLFxuICAgIGFuaW1hdGlvbnM6IFt0cmlnZ2VyKCdvdmVybGF5Q29udGVudEFuaW1hdGlvbicsIFt0cmFuc2l0aW9uKCc6ZW50ZXInLCBbdXNlQW5pbWF0aW9uKHNob3dPdmVybGF5Q29udGVudEFuaW1hdGlvbildKSwgdHJhbnNpdGlvbignOmxlYXZlJywgW3VzZUFuaW1hdGlvbihoaWRlT3ZlcmxheUNvbnRlbnRBbmltYXRpb24pXSldKV0sXG4gICAgY2hhbmdlRGV0ZWN0aW9uOiBDaGFuZ2VEZXRlY3Rpb25TdHJhdGVneS5PblB1c2gsXG4gICAgZW5jYXBzdWxhdGlvbjogVmlld0VuY2Fwc3VsYXRpb24uTm9uZSxcbiAgICBwcm92aWRlcnM6IFtPVkVSTEFZX1ZBTFVFX0FDQ0VTU09SXSxcbiAgICBzdHlsZVVybHM6IFsnLi9vdmVybGF5LmNzcyddLFxuICAgIGhvc3Q6IHtcbiAgICAgICAgY2xhc3M6ICdwLWVsZW1lbnQnXG4gICAgfVxufSlcbmV4cG9ydCBjbGFzcyBPdmVybGF5IGltcGxlbWVudHMgQWZ0ZXJDb250ZW50SW5pdCwgT25EZXN0cm95IHtcbiAgICBASW5wdXQoKSBnZXQgdmlzaWJsZSgpOiBib29sZWFuIHtcbiAgICAgICAgcmV0dXJuIHRoaXMuX3Zpc2libGU7XG4gICAgfVxuICAgIHNldCB2aXNpYmxlKHZhbHVlOiBib29sZWFuKSB7XG4gICAgICAgIHRoaXMuX3Zpc2libGUgPSB2YWx1ZTtcblxuICAgICAgICBpZiAodGhpcy5fdmlzaWJsZSAmJiAhdGhpcy5tb2RhbFZpc2libGUpIHtcbiAgICAgICAgICAgIHRoaXMubW9kYWxWaXNpYmxlID0gdHJ1ZTtcbiAgICAgICAgfVxuICAgIH1cblxuICAgIEBJbnB1dCgpIGdldCBtb2RlKCk6IE92ZXJsYXlNb2RlVHlwZSB8IHN0cmluZyB7XG4gICAgICAgIHJldHVybiB0aGlzLl9tb2RlIHx8IHRoaXMub3ZlcmxheU9wdGlvbnM/Lm1vZGU7XG4gICAgfVxuICAgIHNldCBtb2RlKHZhbHVlOiBPdmVybGF5TW9kZVR5cGUgfCBzdHJpbmcpIHtcbiAgICAgICAgdGhpcy5fbW9kZSA9IHZhbHVlO1xuICAgIH1cblxuICAgIEBJbnB1dCgpIGdldCBzdHlsZSgpOiBhbnkge1xuICAgICAgICByZXR1cm4gT2JqZWN0VXRpbHMubWVyZ2UodGhpcy5fc3R5bGUsIHRoaXMubW9kYWwgPyB0aGlzLm92ZXJsYXlSZXNwb25zaXZlT3B0aW9ucz8uc3R5bGUgOiB0aGlzLm92ZXJsYXlPcHRpb25zPy5zdHlsZSk7XG4gICAgfVxuICAgIHNldCBzdHlsZSh2YWx1ZTogYW55KSB7XG4gICAgICAgIHRoaXMuX3N0eWxlID0gdmFsdWU7XG4gICAgfVxuXG4gICAgQElucHV0KCkgZ2V0IHN0eWxlQ2xhc3MoKTogc3RyaW5nIHtcbiAgICAgICAgcmV0dXJuIE9iamVjdFV0aWxzLm1lcmdlKHRoaXMuX3N0eWxlQ2xhc3MsIHRoaXMubW9kYWwgPyB0aGlzLm92ZXJsYXlSZXNwb25zaXZlT3B0aW9ucz8uc3R5bGVDbGFzcyA6IHRoaXMub3ZlcmxheU9wdGlvbnM/LnN0eWxlQ2xhc3MpO1xuICAgIH1cbiAgICBzZXQgc3R5bGVDbGFzcyh2YWx1ZTogc3RyaW5nKSB7XG4gICAgICAgIHRoaXMuX3N0eWxlQ2xhc3MgPSB2YWx1ZTtcbiAgICB9XG5cbiAgICBASW5wdXQoKSBnZXQgY29udGVudFN0eWxlKCk6IGFueSB7XG4gICAgICAgIHJldHVybiBPYmplY3RVdGlscy5tZXJnZSh0aGlzLl9jb250ZW50U3R5bGUsIHRoaXMubW9kYWwgPyB0aGlzLm92ZXJsYXlSZXNwb25zaXZlT3B0aW9ucz8uY29udGVudFN0eWxlIDogdGhpcy5vdmVybGF5T3B0aW9ucz8uY29udGVudFN0eWxlKTtcbiAgICB9XG4gICAgc2V0IGNvbnRlbnRTdHlsZSh2YWx1ZTogYW55KSB7XG4gICAgICAgIHRoaXMuX2NvbnRlbnRTdHlsZSA9IHZhbHVlO1xuICAgIH1cblxuICAgIEBJbnB1dCgpIGdldCBjb250ZW50U3R5bGVDbGFzcygpOiBzdHJpbmcge1xuICAgICAgICByZXR1cm4gT2JqZWN0VXRpbHMubWVyZ2UodGhpcy5fY29udGVudFN0eWxlQ2xhc3MsIHRoaXMubW9kYWwgPyB0aGlzLm92ZXJsYXlSZXNwb25zaXZlT3B0aW9ucz8uY29udGVudFN0eWxlQ2xhc3MgOiB0aGlzLm92ZXJsYXlPcHRpb25zPy5jb250ZW50U3R5bGVDbGFzcyk7XG4gICAgfVxuICAgIHNldCBjb250ZW50U3R5bGVDbGFzcyh2YWx1ZTogc3RyaW5nKSB7XG4gICAgICAgIHRoaXMuX2NvbnRlbnRTdHlsZUNsYXNzID0gdmFsdWU7XG4gICAgfVxuXG4gICAgQElucHV0KCkgZ2V0IHRhcmdldCgpOiBhbnkge1xuICAgICAgICBjb25zdCB2YWx1ZSA9IHRoaXMuX3RhcmdldCB8fCB0aGlzLm92ZXJsYXlPcHRpb25zPy50YXJnZXQ7XG4gICAgICAgIHJldHVybiB2YWx1ZSA9PT0gdW5kZWZpbmVkID8gJ0BwcmV2JyA6IHZhbHVlO1xuICAgIH1cbiAgICBzZXQgdGFyZ2V0KHZhbHVlOiBhbnkpIHtcbiAgICAgICAgdGhpcy5fdGFyZ2V0ID0gdmFsdWU7XG4gICAgfVxuXG4gICAgQElucHV0KCkgZ2V0IGFwcGVuZFRvKCk6IGFueSB7XG4gICAgICAgIHJldHVybiB0aGlzLl9hcHBlbmRUbyB8fCB0aGlzLm92ZXJsYXlPcHRpb25zPy5hcHBlbmRUbztcbiAgICB9XG4gICAgc2V0IGFwcGVuZFRvKHZhbHVlOiBhbnkpIHtcbiAgICAgICAgdGhpcy5fYXBwZW5kVG8gPSB2YWx1ZTtcbiAgICB9XG5cbiAgICBASW5wdXQoKSBnZXQgYXV0b1pJbmRleCgpOiBib29sZWFuIHtcbiAgICAgICAgY29uc3QgdmFsdWUgPSB0aGlzLl9hdXRvWkluZGV4IHx8IHRoaXMub3ZlcmxheU9wdGlvbnM/LmF1dG9aSW5kZXg7XG4gICAgICAgIHJldHVybiB2YWx1ZSA9PT0gdW5kZWZpbmVkID8gdHJ1ZSA6IHZhbHVlO1xuICAgIH1cbiAgICBzZXQgYXV0b1pJbmRleCh2YWx1ZTogYm9vbGVhbikge1xuICAgICAgICB0aGlzLl9hdXRvWkluZGV4ID0gdmFsdWU7XG4gICAgfVxuXG4gICAgQElucHV0KCkgZ2V0IGJhc2VaSW5kZXgoKTogbnVtYmVyIHtcbiAgICAgICAgY29uc3QgdmFsdWUgPSB0aGlzLl9iYXNlWkluZGV4IHx8IHRoaXMub3ZlcmxheU9wdGlvbnM/LmJhc2VaSW5kZXg7XG4gICAgICAgIHJldHVybiB2YWx1ZSA9PT0gdW5kZWZpbmVkID8gMCA6IHZhbHVlO1xuICAgIH1cbiAgICBzZXQgYmFzZVpJbmRleCh2YWx1ZTogbnVtYmVyKSB7XG4gICAgICAgIHRoaXMuX2Jhc2VaSW5kZXggPSB2YWx1ZTtcbiAgICB9XG5cbiAgICBASW5wdXQoKSBnZXQgc2hvd1RyYW5zaXRpb25PcHRpb25zKCk6IHN0cmluZyB7XG4gICAgICAgIGNvbnN0IHZhbHVlID0gdGhpcy5fc2hvd1RyYW5zaXRpb25PcHRpb25zIHx8IHRoaXMub3ZlcmxheU9wdGlvbnM/LnNob3dUcmFuc2l0aW9uT3B0aW9ucztcbiAgICAgICAgcmV0dXJuIHZhbHVlID09PSB1bmRlZmluZWQgPyAnLjEycyBjdWJpYy1iZXppZXIoMCwgMCwgMC4yLCAxKScgOiB2YWx1ZTtcbiAgICB9XG4gICAgc2V0IHNob3dUcmFuc2l0aW9uT3B0aW9ucyh2YWx1ZTogc3RyaW5nKSB7XG4gICAgICAgIHRoaXMuX3Nob3dUcmFuc2l0aW9uT3B0aW9ucyA9IHZhbHVlO1xuICAgIH1cblxuICAgIEBJbnB1dCgpIGdldCBoaWRlVHJhbnNpdGlvbk9wdGlvbnMoKTogc3RyaW5nIHtcbiAgICAgICAgY29uc3QgdmFsdWUgPSB0aGlzLl9oaWRlVHJhbnNpdGlvbk9wdGlvbnMgfHwgdGhpcy5vdmVybGF5T3B0aW9ucz8uaGlkZVRyYW5zaXRpb25PcHRpb25zO1xuICAgICAgICByZXR1cm4gdmFsdWUgPT09IHVuZGVmaW5lZCA/ICcuMXMgbGluZWFyJyA6IHZhbHVlO1xuICAgIH1cbiAgICBzZXQgaGlkZVRyYW5zaXRpb25PcHRpb25zKHZhbHVlOiBzdHJpbmcpIHtcbiAgICAgICAgdGhpcy5faGlkZVRyYW5zaXRpb25PcHRpb25zID0gdmFsdWU7XG4gICAgfVxuXG4gICAgQElucHV0KCkgZ2V0IGxpc3RlbmVyKCk6IGFueSB7XG4gICAgICAgIHJldHVybiB0aGlzLl9saXN0ZW5lciB8fCB0aGlzLm92ZXJsYXlPcHRpb25zPy5saXN0ZW5lcjtcbiAgICB9XG4gICAgc2V0IGxpc3RlbmVyKHZhbHVlOiBhbnkpIHtcbiAgICAgICAgdGhpcy5fbGlzdGVuZXIgPSB2YWx1ZTtcbiAgICB9XG5cbiAgICBASW5wdXQoKSBnZXQgcmVzcG9uc2l2ZSgpOiBSZXNwb25zaXZlT3ZlcmxheU9wdGlvbnMgfCB1bmRlZmluZWQge1xuICAgICAgICByZXR1cm4gdGhpcy5fcmVzcG9uc2l2ZSB8fCB0aGlzLm92ZXJsYXlPcHRpb25zPy5yZXNwb25zaXZlO1xuICAgIH1cbiAgICBzZXQgcmVzcG9uc2l2ZSh2YWw6IFJlc3BvbnNpdmVPdmVybGF5T3B0aW9ucyB8IHVuZGVmaW5lZCkge1xuICAgICAgICB0aGlzLl9yZXNwb25zaXZlID0gdmFsO1xuICAgIH1cblxuICAgIEBJbnB1dCgpIGdldCBvcHRpb25zKCk6IE92ZXJsYXlPcHRpb25zIHwgdW5kZWZpbmVkIHtcbiAgICAgICAgcmV0dXJuIHRoaXMuX29wdGlvbnM7XG4gICAgfVxuICAgIHNldCBvcHRpb25zKHZhbDogT3ZlcmxheU9wdGlvbnMgfCB1bmRlZmluZWQpIHtcbiAgICAgICAgdGhpcy5fb3B0aW9ucyA9IHZhbDtcbiAgICB9XG5cbiAgICBAT3V0cHV0KCkgdmlzaWJsZUNoYW5nZTogRXZlbnRFbWl0dGVyPGFueT4gPSBuZXcgRXZlbnRFbWl0dGVyKCk7XG5cbiAgICBAT3V0cHV0KCkgb25CZWZvcmVTaG93OiBFdmVudEVtaXR0ZXI8YW55PiA9IG5ldyBFdmVudEVtaXR0ZXIoKTtcblxuICAgIEBPdXRwdXQoKSBvblNob3c6IEV2ZW50RW1pdHRlcjxhbnk+ID0gbmV3IEV2ZW50RW1pdHRlcigpO1xuXG4gICAgQE91dHB1dCgpIG9uQmVmb3JlSGlkZTogRXZlbnRFbWl0dGVyPGFueT4gPSBuZXcgRXZlbnRFbWl0dGVyKCk7XG5cbiAgICBAT3V0cHV0KCkgb25IaWRlOiBFdmVudEVtaXR0ZXI8YW55PiA9IG5ldyBFdmVudEVtaXR0ZXIoKTtcblxuICAgIEBPdXRwdXQoKSBvbkFuaW1hdGlvblN0YXJ0OiBFdmVudEVtaXR0ZXI8YW55PiA9IG5ldyBFdmVudEVtaXR0ZXIoKTtcblxuICAgIEBPdXRwdXQoKSBvbkFuaW1hdGlvbkRvbmU6IEV2ZW50RW1pdHRlcjxhbnk+ID0gbmV3IEV2ZW50RW1pdHRlcigpO1xuXG4gICAgQENvbnRlbnRDaGlsZHJlbihQcmltZVRlbXBsYXRlKSB0ZW1wbGF0ZXM6IFF1ZXJ5TGlzdDxhbnk+IHwgdW5kZWZpbmVkO1xuXG4gICAgQFZpZXdDaGlsZCgnb3ZlcmxheScpIG92ZXJsYXlWaWV3Q2hpbGQ6IEVsZW1lbnRSZWYgfCB1bmRlZmluZWQ7XG5cbiAgICBAVmlld0NoaWxkKCdjb250ZW50JykgY29udGVudFZpZXdDaGlsZDogRWxlbWVudFJlZiB8IHVuZGVmaW5lZDtcblxuICAgIGNvbnRlbnRUZW1wbGF0ZTogVGVtcGxhdGVSZWY8YW55PiB8IHVuZGVmaW5lZDtcblxuICAgIF92aXNpYmxlOiBib29sZWFuID0gZmFsc2U7XG5cbiAgICBfbW9kZTogT3ZlcmxheU1vZGVUeXBlIHwgc3RyaW5nO1xuXG4gICAgX3N0eWxlOiBhbnk7XG5cbiAgICBfc3R5bGVDbGFzczogc3RyaW5nIHwgdW5kZWZpbmVkO1xuXG4gICAgX2NvbnRlbnRTdHlsZTogYW55O1xuXG4gICAgX2NvbnRlbnRTdHlsZUNsYXNzOiBzdHJpbmcgfCB1bmRlZmluZWQ7XG5cbiAgICBfdGFyZ2V0OiBhbnk7XG5cbiAgICBfYXBwZW5kVG86ICdib2R5JyB8IEhUTUxFbGVtZW50IHwgdW5kZWZpbmVkO1xuXG4gICAgX2F1dG9aSW5kZXg6IGJvb2xlYW4gfCB1bmRlZmluZWQ7XG5cbiAgICBfYmFzZVpJbmRleDogbnVtYmVyIHwgdW5kZWZpbmVkO1xuXG4gICAgX3Nob3dUcmFuc2l0aW9uT3B0aW9uczogc3RyaW5nIHwgdW5kZWZpbmVkO1xuXG4gICAgX2hpZGVUcmFuc2l0aW9uT3B0aW9uczogc3RyaW5nIHwgdW5kZWZpbmVkO1xuXG4gICAgX2xpc3RlbmVyOiBhbnk7XG5cbiAgICBfcmVzcG9uc2l2ZTogUmVzcG9uc2l2ZU92ZXJsYXlPcHRpb25zIHwgdW5kZWZpbmVkO1xuXG4gICAgX29wdGlvbnM6IE92ZXJsYXlPcHRpb25zIHwgdW5kZWZpbmVkO1xuXG4gICAgbW9kYWxWaXNpYmxlOiBib29sZWFuID0gZmFsc2U7XG5cbiAgICBpc092ZXJsYXlDbGlja2VkOiBib29sZWFuID0gZmFsc2U7XG5cbiAgICBpc092ZXJsYXlDb250ZW50Q2xpY2tlZDogYm9vbGVhbiA9IGZhbHNlO1xuXG4gICAgc2Nyb2xsSGFuZGxlcjogYW55O1xuXG4gICAgZG9jdW1lbnRDbGlja0xpc3RlbmVyOiBhbnk7XG5cbiAgICBkb2N1bWVudFJlc2l6ZUxpc3RlbmVyOiBhbnk7XG5cbiAgICBwcml2YXRlIHdpbmRvdzogV2luZG93IHwgbnVsbDtcblxuICAgIHByb3RlY3RlZCB0cmFuc2Zvcm1PcHRpb25zOiBhbnkgPSB7XG4gICAgICAgIGRlZmF1bHQ6ICdzY2FsZVkoMC44KScsXG4gICAgICAgIGNlbnRlcjogJ3NjYWxlKDAuNyknLFxuICAgICAgICB0b3A6ICd0cmFuc2xhdGUzZCgwcHgsIC0xMDAlLCAwcHgpJyxcbiAgICAgICAgJ3RvcC1zdGFydCc6ICd0cmFuc2xhdGUzZCgwcHgsIC0xMDAlLCAwcHgpJyxcbiAgICAgICAgJ3RvcC1lbmQnOiAndHJhbnNsYXRlM2QoMHB4LCAtMTAwJSwgMHB4KScsXG4gICAgICAgIGJvdHRvbTogJ3RyYW5zbGF0ZTNkKDBweCwgMTAwJSwgMHB4KScsXG4gICAgICAgICdib3R0b20tc3RhcnQnOiAndHJhbnNsYXRlM2QoMHB4LCAxMDAlLCAwcHgpJyxcbiAgICAgICAgJ2JvdHRvbS1lbmQnOiAndHJhbnNsYXRlM2QoMHB4LCAxMDAlLCAwcHgpJyxcbiAgICAgICAgbGVmdDogJ3RyYW5zbGF0ZTNkKC0xMDAlLCAwcHgsIDBweCknLFxuICAgICAgICAnbGVmdC1zdGFydCc6ICd0cmFuc2xhdGUzZCgtMTAwJSwgMHB4LCAwcHgpJyxcbiAgICAgICAgJ2xlZnQtZW5kJzogJ3RyYW5zbGF0ZTNkKC0xMDAlLCAwcHgsIDBweCknLFxuICAgICAgICByaWdodDogJ3RyYW5zbGF0ZTNkKDEwMCUsIDBweCwgMHB4KScsXG4gICAgICAgICdyaWdodC1zdGFydCc6ICd0cmFuc2xhdGUzZCgxMDAlLCAwcHgsIDBweCknLFxuICAgICAgICAncmlnaHQtZW5kJzogJ3RyYW5zbGF0ZTNkKDEwMCUsIDBweCwgMHB4KSdcbiAgICB9O1xuXG4gICAgZ2V0IG1vZGFsKCkge1xuICAgICAgICByZXR1cm4gdGhpcy5tb2RlID09PSAnbW9kYWwnIHx8ICh0aGlzLm92ZXJsYXlSZXNwb25zaXZlT3B0aW9ucyAmJiB0aGlzLndpbmRvdz8ubWF0Y2hNZWRpYSh0aGlzLm92ZXJsYXlSZXNwb25zaXZlT3B0aW9ucy5tZWRpYT8ucmVwbGFjZSgnQG1lZGlhJywgJycpIHx8IGAobWF4LXdpZHRoOiAke3RoaXMub3ZlcmxheVJlc3BvbnNpdmVPcHRpb25zLmJyZWFrcG9pbnR9KWApLm1hdGNoZXMpO1xuICAgIH1cblxuICAgIGdldCBvdmVybGF5TW9kZSgpIHtcbiAgICAgICAgcmV0dXJuIHRoaXMubW9kZSB8fCAodGhpcy5tb2RhbCA/ICdtb2RhbCcgOiAnb3ZlcmxheScpO1xuICAgIH1cblxuICAgIGdldCBvdmVybGF5T3B0aW9ucygpIHtcbiAgICAgICAgcmV0dXJuIHsgLi4udGhpcy5jb25maWc/Lm92ZXJsYXlPcHRpb25zLCAuLi50aGlzLm9wdGlvbnMgfTsgLy8gVE9ETzogSW1wcm92ZSBwZXJmb3JtYW5jZVxuICAgIH1cblxuICAgIGdldCBvdmVybGF5UmVzcG9uc2l2ZU9wdGlvbnMoKSB7XG4gICAgICAgIHJldHVybiB7IC4uLnRoaXMub3ZlcmxheU9wdGlvbnM/LnJlc3BvbnNpdmUsIC4uLnRoaXMucmVzcG9uc2l2ZSB9OyAvLyBUT0RPOiBJbXByb3ZlIHBlcmZvcm1hbmNlXG4gICAgfVxuXG4gICAgZ2V0IG92ZXJsYXlSZXNwb25zaXZlRGlyZWN0aW9uKCkge1xuICAgICAgICByZXR1cm4gdGhpcy5vdmVybGF5UmVzcG9uc2l2ZU9wdGlvbnM/LmRpcmVjdGlvbiB8fCAnY2VudGVyJztcbiAgICB9XG5cbiAgICBnZXQgb3ZlcmxheUVsKCkge1xuICAgICAgICByZXR1cm4gdGhpcy5vdmVybGF5Vmlld0NoaWxkPy5uYXRpdmVFbGVtZW50O1xuICAgIH1cblxuICAgIGdldCBjb250ZW50RWwoKSB7XG4gICAgICAgIHJldHVybiB0aGlzLmNvbnRlbnRWaWV3Q2hpbGQ/Lm5hdGl2ZUVsZW1lbnQ7XG4gICAgfVxuXG4gICAgZ2V0IHRhcmdldEVsKCkge1xuICAgICAgICByZXR1cm4gRG9tSGFuZGxlci5nZXRUYXJnZXRFbGVtZW50KHRoaXMudGFyZ2V0LCB0aGlzLmVsPy5uYXRpdmVFbGVtZW50KTtcbiAgICB9XG5cbiAgICBjb25zdHJ1Y3RvcihASW5qZWN0KERPQ1VNRU5UKSBwcml2YXRlIGRvY3VtZW50OiBEb2N1bWVudCwgcHVibGljIGVsOiBFbGVtZW50UmVmLCBwdWJsaWMgcmVuZGVyZXI6IFJlbmRlcmVyMiwgcHJpdmF0ZSBjb25maWc6IFByaW1lTkdDb25maWcsIHB1YmxpYyBvdmVybGF5U2VydmljZTogT3ZlcmxheVNlcnZpY2UsIHByaXZhdGUgY2Q6IENoYW5nZURldGVjdG9yUmVmKSB7XG4gICAgICAgIHRoaXMud2luZG93ID0gdGhpcy5kb2N1bWVudC5kZWZhdWx0VmlldztcbiAgICB9XG5cbiAgICBuZ0FmdGVyQ29udGVudEluaXQoKSB7XG4gICAgICAgIHRoaXMudGVtcGxhdGVzPy5mb3JFYWNoKChpdGVtKSA9PiB7XG4gICAgICAgICAgICBzd2l0Y2ggKGl0ZW0uZ2V0VHlwZSgpKSB7XG4gICAgICAgICAgICAgICAgY2FzZSAnY29udGVudCc6XG4gICAgICAgICAgICAgICAgICAgIHRoaXMuY29udGVudFRlbXBsYXRlID0gaXRlbS50ZW1wbGF0ZTtcbiAgICAgICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICAgICAgLy8gVE9ETzogbmV3IHRlbXBsYXRlIHR5cGVzIG1heSBiZSBhZGRlZC5cbiAgICAgICAgICAgICAgICBkZWZhdWx0OlxuICAgICAgICAgICAgICAgICAgICB0aGlzLmNvbnRlbnRUZW1wbGF0ZSA9IGl0ZW0udGVtcGxhdGU7XG4gICAgICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgfVxuICAgICAgICB9KTtcbiAgICB9XG5cbiAgICBzaG93KG92ZXJsYXk/OiBIVE1MRWxlbWVudCwgaXNGb2N1czogYm9vbGVhbiA9IGZhbHNlKSB7XG4gICAgICAgIHRoaXMub25WaXNpYmxlQ2hhbmdlKHRydWUpO1xuICAgICAgICB0aGlzLmhhbmRsZUV2ZW50cygnb25TaG93JywgeyBvdmVybGF5OiBvdmVybGF5IHx8IHRoaXMub3ZlcmxheUVsLCB0YXJnZXQ6IHRoaXMudGFyZ2V0RWwsIG1vZGU6IHRoaXMub3ZlcmxheU1vZGUgfSk7XG5cbiAgICAgICAgaXNGb2N1cyAmJiBEb21IYW5kbGVyLmZvY3VzKHRoaXMudGFyZ2V0RWwpO1xuICAgICAgICB0aGlzLm1vZGFsICYmIERvbUhhbmRsZXIuYWRkQ2xhc3ModGhpcy5kb2N1bWVudD8uYm9keSwgJ3Atb3ZlcmZsb3ctaGlkZGVuJyk7XG4gICAgfVxuXG4gICAgaGlkZShvdmVybGF5PzogSFRNTEVsZW1lbnQsIGlzRm9jdXM6IGJvb2xlYW4gPSBmYWxzZSkge1xuICAgICAgICB0aGlzLm9uVmlzaWJsZUNoYW5nZShmYWxzZSk7XG4gICAgICAgIHRoaXMuaGFuZGxlRXZlbnRzKCdvbkhpZGUnLCB7IG92ZXJsYXk6IG92ZXJsYXkgfHwgdGhpcy5vdmVybGF5RWwsIHRhcmdldDogdGhpcy50YXJnZXRFbCwgbW9kZTogdGhpcy5vdmVybGF5TW9kZSB9KTtcblxuICAgICAgICBpc0ZvY3VzICYmIERvbUhhbmRsZXIuZm9jdXModGhpcy50YXJnZXRFbCk7XG4gICAgICAgIHRoaXMubW9kYWwgJiYgRG9tSGFuZGxlci5yZW1vdmVDbGFzcyh0aGlzLmRvY3VtZW50Py5ib2R5LCAncC1vdmVyZmxvdy1oaWRkZW4nKTtcbiAgICB9XG5cbiAgICBhbGlnbk92ZXJsYXkoKSB7XG4gICAgICAgICF0aGlzLm1vZGFsICYmIERvbUhhbmRsZXIuYWxpZ25PdmVybGF5KHRoaXMub3ZlcmxheUVsLCB0aGlzLnRhcmdldEVsLCB0aGlzLmFwcGVuZFRvKTtcbiAgICB9XG5cbiAgICBvblZpc2libGVDaGFuZ2UodmlzaWJsZTogYm9vbGVhbikge1xuICAgICAgICB0aGlzLl92aXNpYmxlID0gdmlzaWJsZTtcbiAgICAgICAgdGhpcy52aXNpYmxlQ2hhbmdlLmVtaXQodmlzaWJsZSk7XG4gICAgfVxuXG4gICAgb25PdmVybGF5Q2xpY2soKSB7XG4gICAgICAgIHRoaXMuaXNPdmVybGF5Q2xpY2tlZCA9IHRydWU7XG4gICAgfVxuXG4gICAgb25PdmVybGF5Q29udGVudENsaWNrKGV2ZW50OiBNb3VzZUV2ZW50KSB7XG4gICAgICAgIHRoaXMub3ZlcmxheVNlcnZpY2UuYWRkKHtcbiAgICAgICAgICAgIG9yaWdpbmFsRXZlbnQ6IGV2ZW50LFxuICAgICAgICAgICAgdGFyZ2V0OiB0aGlzLnRhcmdldEVsXG4gICAgICAgIH0pO1xuXG4gICAgICAgIHRoaXMuaXNPdmVybGF5Q29udGVudENsaWNrZWQgPSB0cnVlO1xuICAgIH1cblxuICAgIG9uT3ZlcmxheUNvbnRlbnRBbmltYXRpb25TdGFydChldmVudDogQW5pbWF0aW9uRXZlbnQpIHtcbiAgICAgICAgc3dpdGNoIChldmVudC50b1N0YXRlKSB7XG4gICAgICAgICAgICBjYXNlICd2aXNpYmxlJzpcbiAgICAgICAgICAgICAgICB0aGlzLmhhbmRsZUV2ZW50cygnb25CZWZvcmVTaG93JywgeyBvdmVybGF5OiB0aGlzLm92ZXJsYXlFbCwgdGFyZ2V0OiB0aGlzLnRhcmdldEVsLCBtb2RlOiB0aGlzLm92ZXJsYXlNb2RlIH0pO1xuXG4gICAgICAgICAgICAgICAgaWYgKHRoaXMuYXV0b1pJbmRleCkge1xuICAgICAgICAgICAgICAgICAgICBaSW5kZXhVdGlscy5zZXQodGhpcy5vdmVybGF5TW9kZSwgdGhpcy5vdmVybGF5RWwsIHRoaXMuYmFzZVpJbmRleCArIHRoaXMuY29uZmlnPy56SW5kZXhbdGhpcy5vdmVybGF5TW9kZV0pO1xuICAgICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgICAgIERvbUhhbmRsZXIuYXBwZW5kT3ZlcmxheSh0aGlzLm92ZXJsYXlFbCwgdGhpcy5hcHBlbmRUbyA9PT0gJ2JvZHknID8gdGhpcy5kb2N1bWVudC5ib2R5IDogdGhpcy5hcHBlbmRUbywgdGhpcy5hcHBlbmRUbyk7XG4gICAgICAgICAgICAgICAgdGhpcy5hbGlnbk92ZXJsYXkoKTtcblxuICAgICAgICAgICAgICAgIGJyZWFrO1xuXG4gICAgICAgICAgICBjYXNlICd2b2lkJzpcbiAgICAgICAgICAgICAgICB0aGlzLmhhbmRsZUV2ZW50cygnb25CZWZvcmVIaWRlJywgeyBvdmVybGF5OiB0aGlzLm92ZXJsYXlFbCwgdGFyZ2V0OiB0aGlzLnRhcmdldEVsLCBtb2RlOiB0aGlzLm92ZXJsYXlNb2RlIH0pO1xuXG4gICAgICAgICAgICAgICAgRG9tSGFuZGxlci5hcHBlbmRPdmVybGF5KHRoaXMub3ZlcmxheUVsLCB0aGlzLnRhcmdldEVsLCB0aGlzLmFwcGVuZFRvKTtcbiAgICAgICAgICAgICAgICB0aGlzLm1vZGFsICYmIERvbUhhbmRsZXIuYWRkQ2xhc3ModGhpcy5vdmVybGF5RWwsICdwLWNvbXBvbmVudC1vdmVybGF5LWxlYXZlJyk7XG5cbiAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgfVxuXG4gICAgICAgIHRoaXMuaGFuZGxlRXZlbnRzKCdvbkFuaW1hdGlvblN0YXJ0JywgZXZlbnQpO1xuICAgIH1cblxuICAgIG9uT3ZlcmxheUNvbnRlbnRBbmltYXRpb25Eb25lKGV2ZW50OiBBbmltYXRpb25FdmVudCkge1xuICAgICAgICBjb25zdCBjb250YWluZXIgPSB0aGlzLm92ZXJsYXlFbCB8fCBldmVudC5lbGVtZW50LnBhcmVudEVsZW1lbnQ7XG5cbiAgICAgICAgc3dpdGNoIChldmVudC50b1N0YXRlKSB7XG4gICAgICAgICAgICBjYXNlICd2aXNpYmxlJzpcbiAgICAgICAgICAgICAgICB0aGlzLnNob3coY29udGFpbmVyLCB0cnVlKTtcbiAgICAgICAgICAgICAgICB0aGlzLmJpbmRMaXN0ZW5lcnMoKTtcblxuICAgICAgICAgICAgICAgIGJyZWFrO1xuXG4gICAgICAgICAgICBjYXNlICd2b2lkJzpcbiAgICAgICAgICAgICAgICB0aGlzLmhpZGUoY29udGFpbmVyLCB0cnVlKTtcbiAgICAgICAgICAgICAgICB0aGlzLnVuYmluZExpc3RlbmVycygpO1xuXG4gICAgICAgICAgICAgICAgWkluZGV4VXRpbHMuY2xlYXIoY29udGFpbmVyKTtcbiAgICAgICAgICAgICAgICB0aGlzLm1vZGFsVmlzaWJsZSA9IGZhbHNlO1xuICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICB9XG5cbiAgICAgICAgdGhpcy5oYW5kbGVFdmVudHMoJ29uQW5pbWF0aW9uRG9uZScsIGV2ZW50KTtcbiAgICB9XG5cbiAgICBoYW5kbGVFdmVudHMobmFtZTogc3RyaW5nLCBwYXJhbXM6IGFueSkge1xuICAgICAgICAodGhpcyBhcyBhbnkpW25hbWVdLmVtaXQocGFyYW1zKTtcbiAgICAgICAgdGhpcy5vcHRpb25zICYmICh0aGlzLm9wdGlvbnMgYXMgYW55KVtuYW1lXSAmJiAodGhpcy5vcHRpb25zIGFzIGFueSlbbmFtZV0ocGFyYW1zKTtcbiAgICAgICAgdGhpcy5jb25maWc/Lm92ZXJsYXlPcHRpb25zICYmICh0aGlzLmNvbmZpZz8ub3ZlcmxheU9wdGlvbnMgYXMgYW55KVtuYW1lXSAmJiAodGhpcy5jb25maWc/Lm92ZXJsYXlPcHRpb25zIGFzIGFueSlbbmFtZV0ocGFyYW1zKTtcbiAgICB9XG5cbiAgICBiaW5kTGlzdGVuZXJzKCkge1xuICAgICAgICB0aGlzLmJpbmRTY3JvbGxMaXN0ZW5lcigpO1xuICAgICAgICB0aGlzLmJpbmREb2N1bWVudENsaWNrTGlzdGVuZXIoKTtcbiAgICAgICAgdGhpcy5iaW5kRG9jdW1lbnRSZXNpemVMaXN0ZW5lcigpO1xuICAgIH1cblxuICAgIHVuYmluZExpc3RlbmVycygpIHtcbiAgICAgICAgdGhpcy51bmJpbmRTY3JvbGxMaXN0ZW5lcigpO1xuICAgICAgICB0aGlzLnVuYmluZERvY3VtZW50Q2xpY2tMaXN0ZW5lcigpO1xuICAgICAgICB0aGlzLnVuYmluZERvY3VtZW50UmVzaXplTGlzdGVuZXIoKTtcbiAgICB9XG5cbiAgICBiaW5kU2Nyb2xsTGlzdGVuZXIoKSB7XG4gICAgICAgIGlmICghdGhpcy5zY3JvbGxIYW5kbGVyKSB7XG4gICAgICAgICAgICB0aGlzLnNjcm9sbEhhbmRsZXIgPSBuZXcgQ29ubmVjdGVkT3ZlcmxheVNjcm9sbEhhbmRsZXIodGhpcy50YXJnZXRFbCwgKGV2ZW50OiBhbnkpID0+IHtcbiAgICAgICAgICAgICAgICBjb25zdCB2YWxpZCA9IHRoaXMubGlzdGVuZXIgPyB0aGlzLmxpc3RlbmVyKGV2ZW50LCB7IHR5cGU6ICdzY3JvbGwnLCBtb2RlOiB0aGlzLm92ZXJsYXlNb2RlLCB2YWxpZDogdHJ1ZSB9KSA6IHRydWU7XG5cbiAgICAgICAgICAgICAgICB2YWxpZCAmJiB0aGlzLmhpZGUoZXZlbnQsIHRydWUpO1xuICAgICAgICAgICAgfSk7XG4gICAgICAgIH1cblxuICAgICAgICB0aGlzLnNjcm9sbEhhbmRsZXIuYmluZFNjcm9sbExpc3RlbmVyKCk7XG4gICAgfVxuXG4gICAgdW5iaW5kU2Nyb2xsTGlzdGVuZXIoKSB7XG4gICAgICAgIGlmICh0aGlzLnNjcm9sbEhhbmRsZXIpIHtcbiAgICAgICAgICAgIHRoaXMuc2Nyb2xsSGFuZGxlci51bmJpbmRTY3JvbGxMaXN0ZW5lcigpO1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgYmluZERvY3VtZW50Q2xpY2tMaXN0ZW5lcigpIHtcbiAgICAgICAgaWYgKCF0aGlzLmRvY3VtZW50Q2xpY2tMaXN0ZW5lcikge1xuICAgICAgICAgICAgdGhpcy5kb2N1bWVudENsaWNrTGlzdGVuZXIgPSB0aGlzLnJlbmRlcmVyLmxpc3Rlbih0aGlzLmRvY3VtZW50LCAnY2xpY2snLCAoZXZlbnQpID0+IHtcbiAgICAgICAgICAgICAgICBjb25zdCBpc1RhcmdldENsaWNrZWQgPSB0aGlzLnRhcmdldEVsICYmICh0aGlzLnRhcmdldEVsLmlzU2FtZU5vZGUoZXZlbnQudGFyZ2V0KSB8fCAoIXRoaXMuaXNPdmVybGF5Q2xpY2tlZCAmJiB0aGlzLnRhcmdldEVsLmNvbnRhaW5zKGV2ZW50LnRhcmdldCkpKTtcbiAgICAgICAgICAgICAgICBjb25zdCBpc091dHNpZGVDbGlja2VkID0gIWlzVGFyZ2V0Q2xpY2tlZCAmJiAhdGhpcy5pc092ZXJsYXlDb250ZW50Q2xpY2tlZDtcbiAgICAgICAgICAgICAgICBjb25zdCB2YWxpZCA9IHRoaXMubGlzdGVuZXIgPyB0aGlzLmxpc3RlbmVyKGV2ZW50LCB7IHR5cGU6ICdvdXRzaWRlJywgbW9kZTogdGhpcy5vdmVybGF5TW9kZSwgdmFsaWQ6IGV2ZW50LndoaWNoICE9PSAzICYmIGlzT3V0c2lkZUNsaWNrZWQgfSkgOiBpc091dHNpZGVDbGlja2VkO1xuXG4gICAgICAgICAgICAgICAgdmFsaWQgJiYgdGhpcy5oaWRlKGV2ZW50KTtcbiAgICAgICAgICAgICAgICB0aGlzLmlzT3ZlcmxheUNsaWNrZWQgPSB0aGlzLmlzT3ZlcmxheUNvbnRlbnRDbGlja2VkID0gZmFsc2U7XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgfVxuICAgIH1cblxuICAgIHVuYmluZERvY3VtZW50Q2xpY2tMaXN0ZW5lcigpIHtcbiAgICAgICAgaWYgKHRoaXMuZG9jdW1lbnRDbGlja0xpc3RlbmVyKSB7XG4gICAgICAgICAgICB0aGlzLmRvY3VtZW50Q2xpY2tMaXN0ZW5lcigpO1xuICAgICAgICAgICAgdGhpcy5kb2N1bWVudENsaWNrTGlzdGVuZXIgPSBudWxsO1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgYmluZERvY3VtZW50UmVzaXplTGlzdGVuZXIoKSB7XG4gICAgICAgIGlmICghdGhpcy5kb2N1bWVudFJlc2l6ZUxpc3RlbmVyKSB7XG4gICAgICAgICAgICB0aGlzLmRvY3VtZW50UmVzaXplTGlzdGVuZXIgPSB0aGlzLnJlbmRlcmVyLmxpc3Rlbignd2luZG93JywgJ3Jlc2l6ZScsIChldmVudCkgPT4ge1xuICAgICAgICAgICAgICAgIGNvbnN0IHZhbGlkID0gdGhpcy5saXN0ZW5lciA/IHRoaXMubGlzdGVuZXIoZXZlbnQsIHsgdHlwZTogJ3Jlc2l6ZScsIG1vZGU6IHRoaXMub3ZlcmxheU1vZGUsIHZhbGlkOiAhRG9tSGFuZGxlci5pc1RvdWNoRGV2aWNlKCkgfSkgOiAhRG9tSGFuZGxlci5pc1RvdWNoRGV2aWNlKCk7XG5cbiAgICAgICAgICAgICAgICB2YWxpZCAmJiB0aGlzLmhpZGUoZXZlbnQsIHRydWUpO1xuICAgICAgICAgICAgfSk7XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICB1bmJpbmREb2N1bWVudFJlc2l6ZUxpc3RlbmVyKCkge1xuICAgICAgICBpZiAodGhpcy5kb2N1bWVudFJlc2l6ZUxpc3RlbmVyKSB7XG4gICAgICAgICAgICB0aGlzLmRvY3VtZW50UmVzaXplTGlzdGVuZXIoKTtcbiAgICAgICAgICAgIHRoaXMuZG9jdW1lbnRSZXNpemVMaXN0ZW5lciA9IG51bGw7XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICBuZ09uRGVzdHJveSgpIHtcbiAgICAgICAgdGhpcy5oaWRlKHRoaXMub3ZlcmxheUVsLCB0cnVlKTtcblxuICAgICAgICBpZiAodGhpcy5vdmVybGF5RWwpIHtcbiAgICAgICAgICAgIERvbUhhbmRsZXIuYXBwZW5kT3ZlcmxheSh0aGlzLm92ZXJsYXlFbCwgdGhpcy50YXJnZXRFbCwgdGhpcy5hcHBlbmRUbyk7XG4gICAgICAgICAgICBaSW5kZXhVdGlscy5jbGVhcih0aGlzLm92ZXJsYXlFbCk7XG4gICAgICAgIH1cblxuICAgICAgICBpZiAodGhpcy5zY3JvbGxIYW5kbGVyKSB7XG4gICAgICAgICAgICB0aGlzLnNjcm9sbEhhbmRsZXIuZGVzdHJveSgpO1xuICAgICAgICAgICAgdGhpcy5zY3JvbGxIYW5kbGVyID0gbnVsbDtcbiAgICAgICAgfVxuXG4gICAgICAgIHRoaXMudW5iaW5kTGlzdGVuZXJzKCk7XG4gICAgfVxufVxuXG5ATmdNb2R1bGUoe1xuICAgIGltcG9ydHM6IFtDb21tb25Nb2R1bGUsIFNoYXJlZE1vZHVsZV0sXG4gICAgZXhwb3J0czogW092ZXJsYXksIFNoYXJlZE1vZHVsZV0sXG4gICAgZGVjbGFyYXRpb25zOiBbT3ZlcmxheV1cbn0pXG5leHBvcnQgY2xhc3MgT3ZlcmxheU1vZHVsZSB7fVxuIl19
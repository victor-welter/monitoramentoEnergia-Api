import { CommonModule } from '@angular/common';
import * as i0 from '@angular/core';
import { Directive, Input, NgModule } from '@angular/core';
import { DomHandler } from 'primeng/dom';

class Animate {
    constructor(host, el, renderer) {
        this.host = host;
        this.el = el;
        this.renderer = renderer;
    }
    ngAfterViewInit() {
        this.bindIntersectionObserver();
    }
    bindIntersectionObserver() {
        const options = {
            root: null,
            rootMargin: '0px',
            threshold: 1.0
        };
        this.observer = new IntersectionObserver((el) => this.isVisible(el), options);
        this.observer.observe(this.host.nativeElement);
    }
    isVisible(element) {
        const [intersectionObserverEntry] = element;
        intersectionObserverEntry.isIntersecting ? this.enter() : this.leave();
    }
    enter() {
        this.host.nativeElement.style.visibility = 'visible';
        DomHandler.addClass(this.host.nativeElement, this.enterClass);
    }
    leave() {
        DomHandler.removeClass(this.host.nativeElement, this.enterClass);
        this.host.nativeElement.style.visibility = 'hidden';
    }
    unbindIntersectionObserver() {
        if (this.observer) {
            this.observer.unobserve(this.host.nativeElement);
        }
    }
    ngOnDestroy() {
        this.unbindIntersectionObserver();
    }
}
Animate.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "14.0.7", ngImport: i0, type: Animate, deps: [{ token: i0.ElementRef }, { token: i0.ElementRef }, { token: i0.Renderer2 }], target: i0.ɵɵFactoryTarget.Directive });
Animate.ɵdir = i0.ɵɵngDeclareDirective({ minVersion: "14.0.0", version: "14.0.7", type: Animate, selector: "[pAnimate]", inputs: { enterClass: "enterClass" }, host: { properties: { "class.p-animate": "true" } }, ngImport: i0 });
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "14.0.7", ngImport: i0, type: Animate, decorators: [{
            type: Directive,
            args: [{
                    selector: '[pAnimate]',
                    host: {
                        '[class.p-animate]': 'true'
                    }
                }]
        }], ctorParameters: function () { return [{ type: i0.ElementRef }, { type: i0.ElementRef }, { type: i0.Renderer2 }]; }, propDecorators: { enterClass: [{
                type: Input
            }] } });
class AnimateModule {
}
AnimateModule.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "14.0.7", ngImport: i0, type: AnimateModule, deps: [], target: i0.ɵɵFactoryTarget.NgModule });
AnimateModule.ɵmod = i0.ɵɵngDeclareNgModule({ minVersion: "14.0.0", version: "14.0.7", ngImport: i0, type: AnimateModule, declarations: [Animate], imports: [CommonModule], exports: [Animate] });
AnimateModule.ɵinj = i0.ɵɵngDeclareInjector({ minVersion: "12.0.0", version: "14.0.7", ngImport: i0, type: AnimateModule, imports: [CommonModule] });
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "14.0.7", ngImport: i0, type: AnimateModule, decorators: [{
            type: NgModule,
            args: [{
                    imports: [CommonModule],
                    exports: [Animate],
                    declarations: [Animate]
                }]
        }] });

/**
 * Generated bundle index. Do not edit.
 */

export { Animate, AnimateModule };
//# sourceMappingURL=primeng-animate.mjs.map

import { AfterViewInit, ElementRef, Renderer2 } from '@angular/core';
import * as i0 from "@angular/core";
import * as i1 from "@angular/common";
export declare class Animate implements AfterViewInit {
    private host;
    el: ElementRef;
    renderer: Renderer2;
    enterClass: string;
    observer: IntersectionObserver;
    constructor(host: ElementRef, el: ElementRef, renderer: Renderer2);
    ngAfterViewInit(): void;
    bindIntersectionObserver(): void;
    isVisible(element: IntersectionObserverEntry[]): void;
    enter(): void;
    leave(): void;
    unbindIntersectionObserver(): void;
    ngOnDestroy(): void;
    static ɵfac: i0.ɵɵFactoryDeclaration<Animate, never>;
    static ɵdir: i0.ɵɵDirectiveDeclaration<Animate, "[pAnimate]", never, { "enterClass": "enterClass"; }, {}, never, never, false>;
}
export declare class AnimateModule {
    static ɵfac: i0.ɵɵFactoryDeclaration<AnimateModule, never>;
    static ɵmod: i0.ɵɵNgModuleDeclaration<AnimateModule, [typeof Animate], [typeof i1.CommonModule], [typeof Animate]>;
    static ɵinj: i0.ɵɵInjectorDeclaration<AnimateModule>;
}

import { Component, Input, ViewChild, ContentChildren, NgModule, EventEmitter, Output, ContentChild, ChangeDetectionStrategy, ViewEncapsulation, Inject } from '@angular/core';
import { PrimeTemplate, SharedModule, Header, Footer } from 'primeng/api';
import { RippleModule } from 'primeng/ripple';
import { CommonModule, DOCUMENT } from '@angular/common';
import { UniqueComponentId } from 'primeng/utils';
import * as i0 from "@angular/core";
import * as i1 from "@angular/common";
import * as i2 from "primeng/ripple";
export class Carousel {
    constructor(el, zone, cd, renderer, document) {
        this.el = el;
        this.zone = zone;
        this.cd = cd;
        this.renderer = renderer;
        this.document = document;
        this.orientation = 'horizontal';
        this.verticalViewPortHeight = '300px';
        this.contentClass = '';
        this.indicatorsContentClass = '';
        this.indicatorStyleClass = '';
        this.circular = false;
        this.showIndicators = true;
        this.showNavigators = true;
        this.autoplayInterval = 0;
        this.onPage = new EventEmitter();
        this._numVisible = 1;
        this._numScroll = 1;
        this._oldNumScroll = 0;
        this.prevState = {
            numScroll: 0,
            numVisible: 0,
            value: []
        };
        this.defaultNumScroll = 1;
        this.defaultNumVisible = 1;
        this._page = 0;
        this.isRemainingItemsAdded = false;
        this.remainingItems = 0;
        this.swipeThreshold = 20;
        this.totalShiftedItems = this.page * this.numScroll * -1;
    }
    get page() {
        return this._page;
    }
    set page(val) {
        if (this.isCreated && val !== this._page) {
            if (this.autoplayInterval) {
                this.stopAutoplay();
                this.allowAutoplay = false;
            }
            if (val > this._page && val <= this.totalDots() - 1) {
                this.step(-1, val);
            }
            else if (val < this._page) {
                this.step(1, val);
            }
        }
        this._page = val;
    }
    get numVisible() {
        return this._numVisible;
    }
    set numVisible(val) {
        this._numVisible = val;
    }
    get numScroll() {
        return this._numVisible;
    }
    set numScroll(val) {
        this._numScroll = val;
    }
    get value() {
        return this._value;
    }
    set value(val) {
        this._value = val;
    }
    ngOnChanges(simpleChange) {
        if (simpleChange.value) {
            if (this.circular && this._value) {
                this.setCloneItems();
            }
        }
        if (this.isCreated) {
            if (simpleChange.numVisible) {
                if (this.responsiveOptions) {
                    this.defaultNumVisible = this.numVisible;
                }
                if (this.isCircular()) {
                    this.setCloneItems();
                }
                this.createStyle();
                this.calculatePosition();
            }
            if (simpleChange.numScroll) {
                if (this.responsiveOptions) {
                    this.defaultNumScroll = this.numScroll;
                }
            }
        }
    }
    ngAfterContentInit() {
        this.id = UniqueComponentId();
        this.allowAutoplay = !!this.autoplayInterval;
        if (this.circular) {
            this.setCloneItems();
        }
        if (this.responsiveOptions) {
            this.defaultNumScroll = this._numScroll;
            this.defaultNumVisible = this._numVisible;
        }
        this.createStyle();
        this.calculatePosition();
        if (this.responsiveOptions) {
            this.bindDocumentListeners();
        }
        this.templates.forEach((item) => {
            switch (item.getType()) {
                case 'item':
                    this.itemTemplate = item.template;
                    break;
                case 'header':
                    this.headerTemplate = item.template;
                    break;
                case 'footer':
                    this.footerTemplate = item.template;
                    break;
                default:
                    this.itemTemplate = item.template;
                    break;
            }
        });
    }
    ngAfterContentChecked() {
        const isCircular = this.isCircular();
        let totalShiftedItems = this.totalShiftedItems;
        if (this.value && this.itemsContainer && (this.prevState.numScroll !== this._numScroll || this.prevState.numVisible !== this._numVisible || this.prevState.value.length !== this.value.length)) {
            if (this.autoplayInterval) {
                this.stopAutoplay();
            }
            this.remainingItems = (this.value.length - this._numVisible) % this._numScroll;
            let page = this._page;
            if (this.totalDots() !== 0 && page >= this.totalDots()) {
                page = this.totalDots() - 1;
                this._page = page;
                this.onPage.emit({
                    page: this.page
                });
            }
            totalShiftedItems = page * this._numScroll * -1;
            if (isCircular) {
                totalShiftedItems -= this._numVisible;
            }
            if (page === this.totalDots() - 1 && this.remainingItems > 0) {
                totalShiftedItems += -1 * this.remainingItems + this._numScroll;
                this.isRemainingItemsAdded = true;
            }
            else {
                this.isRemainingItemsAdded = false;
            }
            if (totalShiftedItems !== this.totalShiftedItems) {
                this.totalShiftedItems = totalShiftedItems;
            }
            this._oldNumScroll = this._numScroll;
            this.prevState.numScroll = this._numScroll;
            this.prevState.numVisible = this._numVisible;
            this.prevState.value = [...this._value];
            if (this.totalDots() > 0 && this.itemsContainer.nativeElement) {
                this.itemsContainer.nativeElement.style.transform = this.isVertical() ? `translate3d(0, ${totalShiftedItems * (100 / this._numVisible)}%, 0)` : `translate3d(${totalShiftedItems * (100 / this._numVisible)}%, 0, 0)`;
            }
            this.isCreated = true;
            if (this.autoplayInterval && this.isAutoplay()) {
                this.startAutoplay();
            }
        }
        if (isCircular) {
            if (this.page === 0) {
                totalShiftedItems = -1 * this._numVisible;
            }
            else if (totalShiftedItems === 0) {
                totalShiftedItems = -1 * this.value.length;
                if (this.remainingItems > 0) {
                    this.isRemainingItemsAdded = true;
                }
            }
            if (totalShiftedItems !== this.totalShiftedItems) {
                this.totalShiftedItems = totalShiftedItems;
            }
        }
    }
    createStyle() {
        if (!this.carouselStyle) {
            this.carouselStyle = this.renderer.createElement('style');
            this.carouselStyle.type = 'text/css';
            this.renderer.appendChild(this.document.head, this.carouselStyle);
        }
        let innerHTML = `
            #${this.id} .p-carousel-item {
				flex: 1 0 ${100 / this.numVisible}%
			}
        `;
        if (this.responsiveOptions) {
            this.responsiveOptions.sort((data1, data2) => {
                const value1 = data1.breakpoint;
                const value2 = data2.breakpoint;
                let result = null;
                if (value1 == null && value2 != null)
                    result = -1;
                else if (value1 != null && value2 == null)
                    result = 1;
                else if (value1 == null && value2 == null)
                    result = 0;
                else if (typeof value1 === 'string' && typeof value2 === 'string')
                    result = value1.localeCompare(value2, undefined, { numeric: true });
                else
                    result = value1 < value2 ? -1 : value1 > value2 ? 1 : 0;
                return -1 * result;
            });
            for (let i = 0; i < this.responsiveOptions.length; i++) {
                let res = this.responsiveOptions[i];
                innerHTML += `
                    @media screen and (max-width: ${res.breakpoint}) {
                        #${this.id} .p-carousel-item {
                            flex: 1 0 ${100 / res.numVisible}%
                        }
                    }
                `;
            }
        }
        this.carouselStyle.innerHTML = innerHTML;
    }
    calculatePosition() {
        if (this.responsiveOptions) {
            let matchedResponsiveData = {
                numVisible: this.defaultNumVisible,
                numScroll: this.defaultNumScroll
            };
            if (typeof window !== 'undefined') {
                let windowWidth = window.innerWidth;
                for (let i = 0; i < this.responsiveOptions.length; i++) {
                    let res = this.responsiveOptions[i];
                    if (parseInt(res.breakpoint, 10) >= windowWidth) {
                        matchedResponsiveData = res;
                    }
                }
            }
            if (this._numScroll !== matchedResponsiveData.numScroll) {
                let page = this._page;
                page = Math.floor((page * this._numScroll) / matchedResponsiveData.numScroll);
                let totalShiftedItems = matchedResponsiveData.numScroll * this.page * -1;
                if (this.isCircular()) {
                    totalShiftedItems -= matchedResponsiveData.numVisible;
                }
                this.totalShiftedItems = totalShiftedItems;
                this._numScroll = matchedResponsiveData.numScroll;
                this._page = page;
                this.onPage.emit({
                    page: this.page
                });
            }
            if (this._numVisible !== matchedResponsiveData.numVisible) {
                this._numVisible = matchedResponsiveData.numVisible;
                this.setCloneItems();
            }
            this.cd.markForCheck();
        }
    }
    setCloneItems() {
        this.clonedItemsForStarting = [];
        this.clonedItemsForFinishing = [];
        if (this.isCircular()) {
            this.clonedItemsForStarting.push(...this.value.slice(-1 * this._numVisible));
            this.clonedItemsForFinishing.push(...this.value.slice(0, this._numVisible));
        }
    }
    firstIndex() {
        return this.isCircular() ? -1 * (this.totalShiftedItems + this.numVisible) : this.totalShiftedItems * -1;
    }
    lastIndex() {
        return this.firstIndex() + this.numVisible - 1;
    }
    totalDots() {
        return this.value ? Math.ceil((this.value.length - this._numVisible) / this._numScroll) + 1 : 0;
    }
    totalDotsArray() {
        const totalDots = this.totalDots();
        return totalDots <= 0 ? [] : Array(totalDots).fill(0);
    }
    isVertical() {
        return this.orientation === 'vertical';
    }
    isCircular() {
        return this.circular && this.value && this.value.length >= this.numVisible;
    }
    isAutoplay() {
        return this.autoplayInterval && this.allowAutoplay;
    }
    isForwardNavDisabled() {
        return this.isEmpty() || (this._page >= this.totalDots() - 1 && !this.isCircular());
    }
    isBackwardNavDisabled() {
        return this.isEmpty() || (this._page <= 0 && !this.isCircular());
    }
    isEmpty() {
        return !this.value || this.value.length === 0;
    }
    navForward(e, index) {
        if (this.isCircular() || this._page < this.totalDots() - 1) {
            this.step(-1, index);
        }
        if (this.autoplayInterval) {
            this.stopAutoplay();
            this.allowAutoplay = false;
        }
        if (e && e.cancelable) {
            e.preventDefault();
        }
    }
    navBackward(e, index) {
        if (this.isCircular() || this._page !== 0) {
            this.step(1, index);
        }
        if (this.autoplayInterval) {
            this.stopAutoplay();
            this.allowAutoplay = false;
        }
        if (e && e.cancelable) {
            e.preventDefault();
        }
    }
    onDotClick(e, index) {
        let page = this._page;
        if (this.autoplayInterval) {
            this.stopAutoplay();
            this.allowAutoplay = false;
        }
        if (index > page) {
            this.navForward(e, index);
        }
        else if (index < page) {
            this.navBackward(e, index);
        }
    }
    step(dir, page) {
        let totalShiftedItems = this.totalShiftedItems;
        const isCircular = this.isCircular();
        if (page != null) {
            totalShiftedItems = this._numScroll * page * -1;
            if (isCircular) {
                totalShiftedItems -= this._numVisible;
            }
            this.isRemainingItemsAdded = false;
        }
        else {
            totalShiftedItems += this._numScroll * dir;
            if (this.isRemainingItemsAdded) {
                totalShiftedItems += this.remainingItems - this._numScroll * dir;
                this.isRemainingItemsAdded = false;
            }
            let originalShiftedItems = isCircular ? totalShiftedItems + this._numVisible : totalShiftedItems;
            page = Math.abs(Math.floor(originalShiftedItems / this._numScroll));
        }
        if (isCircular && this.page === this.totalDots() - 1 && dir === -1) {
            totalShiftedItems = -1 * (this.value.length + this._numVisible);
            page = 0;
        }
        else if (isCircular && this.page === 0 && dir === 1) {
            totalShiftedItems = 0;
            page = this.totalDots() - 1;
        }
        else if (page === this.totalDots() - 1 && this.remainingItems > 0) {
            totalShiftedItems += this.remainingItems * -1 - this._numScroll * dir;
            this.isRemainingItemsAdded = true;
        }
        if (this.itemsContainer) {
            this.itemsContainer.nativeElement.style.transform = this.isVertical() ? `translate3d(0, ${totalShiftedItems * (100 / this._numVisible)}%, 0)` : `translate3d(${totalShiftedItems * (100 / this._numVisible)}%, 0, 0)`;
            this.itemsContainer.nativeElement.style.transition = 'transform 500ms ease 0s';
        }
        this.totalShiftedItems = totalShiftedItems;
        this._page = page;
        this.onPage.emit({
            page: this.page
        });
    }
    startAutoplay() {
        this.interval = setInterval(() => {
            if (this.totalDots() > 0) {
                if (this.page === this.totalDots() - 1) {
                    this.step(-1, 0);
                }
                else {
                    this.step(-1, this.page + 1);
                }
            }
        }, this.autoplayInterval);
    }
    stopAutoplay() {
        if (this.interval) {
            clearInterval(this.interval);
        }
    }
    onTransitionEnd() {
        if (this.itemsContainer) {
            this.itemsContainer.nativeElement.style.transition = '';
            if ((this.page === 0 || this.page === this.totalDots() - 1) && this.isCircular()) {
                this.itemsContainer.nativeElement.style.transform = this.isVertical() ? `translate3d(0, ${this.totalShiftedItems * (100 / this._numVisible)}%, 0)` : `translate3d(${this.totalShiftedItems * (100 / this._numVisible)}%, 0, 0)`;
            }
        }
    }
    onTouchStart(e) {
        let touchobj = e.changedTouches[0];
        this.startPos = {
            x: touchobj.pageX,
            y: touchobj.pageY
        };
    }
    onTouchMove(e) {
        if (e.cancelable) {
            e.preventDefault();
        }
    }
    onTouchEnd(e) {
        let touchobj = e.changedTouches[0];
        if (this.isVertical()) {
            this.changePageOnTouch(e, touchobj.pageY - this.startPos.y);
        }
        else {
            this.changePageOnTouch(e, touchobj.pageX - this.startPos.x);
        }
    }
    changePageOnTouch(e, diff) {
        if (Math.abs(diff) > this.swipeThreshold) {
            if (diff < 0) {
                this.navForward(e);
            }
            else {
                this.navBackward(e);
            }
        }
    }
    bindDocumentListeners() {
        if (!this.documentResizeListener && typeof window !== 'undefined') {
            this.documentResizeListener = (e) => {
                this.calculatePosition();
            };
            window.addEventListener('resize', this.documentResizeListener);
        }
    }
    unbindDocumentListeners() {
        if (this.documentResizeListener && typeof window !== 'undefined') {
            window.removeEventListener('resize', this.documentResizeListener);
            this.documentResizeListener = null;
        }
    }
    ngOnDestroy() {
        if (this.responsiveOptions) {
            this.unbindDocumentListeners();
        }
        if (this.autoplayInterval) {
            this.stopAutoplay();
        }
    }
}
Carousel.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "14.0.7", ngImport: i0, type: Carousel, deps: [{ token: i0.ElementRef }, { token: i0.NgZone }, { token: i0.ChangeDetectorRef }, { token: i0.Renderer2 }, { token: DOCUMENT }], target: i0.ɵɵFactoryTarget.Component });
Carousel.ɵcmp = i0.ɵɵngDeclareComponent({ minVersion: "14.0.0", version: "14.0.7", type: Carousel, selector: "p-carousel", inputs: { page: "page", numVisible: "numVisible", numScroll: "numScroll", responsiveOptions: "responsiveOptions", orientation: "orientation", verticalViewPortHeight: "verticalViewPortHeight", contentClass: "contentClass", indicatorsContentClass: "indicatorsContentClass", indicatorsContentStyle: "indicatorsContentStyle", indicatorStyleClass: "indicatorStyleClass", indicatorStyle: "indicatorStyle", value: "value", circular: "circular", showIndicators: "showIndicators", showNavigators: "showNavigators", autoplayInterval: "autoplayInterval", style: "style", styleClass: "styleClass" }, outputs: { onPage: "onPage" }, host: { classAttribute: "p-element" }, queries: [{ propertyName: "headerFacet", first: true, predicate: Header, descendants: true }, { propertyName: "footerFacet", first: true, predicate: Footer, descendants: true }, { propertyName: "templates", predicate: PrimeTemplate }], viewQueries: [{ propertyName: "itemsContainer", first: true, predicate: ["itemsContainer"], descendants: true }], usesOnChanges: true, ngImport: i0, template: `
        <div [attr.id]="id" [ngClass]="{ 'p-carousel p-component': true, 'p-carousel-vertical': isVertical(), 'p-carousel-horizontal': !isVertical() }" [ngStyle]="style" [class]="styleClass">
            <div class="p-carousel-header" *ngIf="headerFacet || headerTemplate">
                <ng-content select="p-header"></ng-content>
                <ng-container *ngTemplateOutlet="headerTemplate"></ng-container>
            </div>
            <div [class]="contentClass" [ngClass]="'p-carousel-content'">
                <div class="p-carousel-container">
                    <button type="button" *ngIf="showNavigators" [ngClass]="{ 'p-carousel-prev p-link': true, 'p-disabled': isBackwardNavDisabled() }" [disabled]="isBackwardNavDisabled()" (click)="navBackward($event)" pRipple>
                        <span [ngClass]="{ 'p-carousel-prev-icon pi': true, 'pi-chevron-left': !isVertical(), 'pi-chevron-up': isVertical() }"></span>
                    </button>
                    <div class="p-carousel-items-content" [ngStyle]="{ height: isVertical() ? verticalViewPortHeight : 'auto' }">
                        <div #itemsContainer class="p-carousel-items-container" (transitionend)="onTransitionEnd()" (touchend)="onTouchEnd($event)" (touchstart)="onTouchStart($event)" (touchmove)="onTouchMove($event)">
                            <div
                                *ngFor="let item of clonedItemsForStarting; let index = index"
                                [ngClass]="{
                                    'p-carousel-item p-carousel-item-cloned': true,
                                    'p-carousel-item-active': totalShiftedItems * -1 === value.length,
                                    'p-carousel-item-start': 0 === index,
                                    'p-carousel-item-end': clonedItemsForStarting.length - 1 === index
                                }"
                            >
                                <ng-container *ngTemplateOutlet="itemTemplate; context: { $implicit: item }"></ng-container>
                            </div>
                            <div
                                *ngFor="let item of value; let index = index"
                                [ngClass]="{ 'p-carousel-item': true, 'p-carousel-item-active': firstIndex() <= index && lastIndex() >= index, 'p-carousel-item-start': firstIndex() === index, 'p-carousel-item-end': lastIndex() === index }"
                            >
                                <ng-container *ngTemplateOutlet="itemTemplate; context: { $implicit: item }"></ng-container>
                            </div>
                            <div
                                *ngFor="let item of clonedItemsForFinishing; let index = index"
                                [ngClass]="{
                                    'p-carousel-item p-carousel-item-cloned': true,
                                    'p-carousel-item-active': totalShiftedItems * -1 === numVisible,
                                    'p-carousel-item-start': 0 === index,
                                    'p-carousel-item-end': clonedItemsForFinishing.length - 1 === index
                                }"
                            >
                                <ng-container *ngTemplateOutlet="itemTemplate; context: { $implicit: item }"></ng-container>
                            </div>
                        </div>
                    </div>
                    <button type="button" *ngIf="showNavigators" [ngClass]="{ 'p-carousel-next p-link': true, 'p-disabled': isForwardNavDisabled() }" [disabled]="isForwardNavDisabled()" (click)="navForward($event)" pRipple>
                        <span [ngClass]="{ 'p-carousel-prev-icon pi': true, 'pi-chevron-right': !isVertical(), 'pi-chevron-down': isVertical() }"></span>
                    </button>
                </div>
                <ul [ngClass]="'p-carousel-indicators p-reset'" [class]="indicatorsContentClass" [ngStyle]="indicatorsContentStyle" *ngIf="showIndicators">
                    <li *ngFor="let totalDot of totalDotsArray(); let i = index" [ngClass]="{ 'p-carousel-indicator': true, 'p-highlight': _page === i }">
                        <button type="button" [ngClass]="'p-link'" (click)="onDotClick($event, i)" [class]="indicatorStyleClass" [ngStyle]="indicatorStyle"></button>
                    </li>
                </ul>
            </div>
            <div class="p-carousel-footer" *ngIf="footerFacet || footerTemplate">
                <ng-content select="p-footer"></ng-content>
                <ng-container *ngTemplateOutlet="footerTemplate"></ng-container>
            </div>
        </div>
    `, isInline: true, styles: [".p-carousel{display:flex;flex-direction:column}.p-carousel-content{display:flex;flex-direction:column;overflow:auto}.p-carousel-prev,.p-carousel-next{align-self:center;flex-grow:0;flex-shrink:0;display:flex;justify-content:center;align-items:center;overflow:hidden;position:relative}.p-carousel-container{display:flex;flex-direction:row}.p-carousel-items-content{overflow:hidden;width:100%}.p-carousel-items-container{display:flex;flex-direction:row}.p-carousel-indicators{display:flex;flex-direction:row;justify-content:center;flex-wrap:wrap}.p-carousel-indicator>button{display:flex;align-items:center;justify-content:center}.p-carousel-vertical .p-carousel-container{flex-direction:column}.p-carousel-vertical .p-carousel-items-container{flex-direction:column;height:100%}.p-items-hidden .p-carousel-item{visibility:hidden}.p-items-hidden .p-carousel-item.p-carousel-item-active{visibility:visible}\n"], dependencies: [{ kind: "directive", type: i1.NgClass, selector: "[ngClass]", inputs: ["class", "ngClass"] }, { kind: "directive", type: i1.NgForOf, selector: "[ngFor][ngForOf]", inputs: ["ngForOf", "ngForTrackBy", "ngForTemplate"] }, { kind: "directive", type: i1.NgIf, selector: "[ngIf]", inputs: ["ngIf", "ngIfThen", "ngIfElse"] }, { kind: "directive", type: i1.NgTemplateOutlet, selector: "[ngTemplateOutlet]", inputs: ["ngTemplateOutletContext", "ngTemplateOutlet", "ngTemplateOutletInjector"] }, { kind: "directive", type: i1.NgStyle, selector: "[ngStyle]", inputs: ["ngStyle"] }, { kind: "directive", type: i2.Ripple, selector: "[pRipple]" }], changeDetection: i0.ChangeDetectionStrategy.OnPush, encapsulation: i0.ViewEncapsulation.None });
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "14.0.7", ngImport: i0, type: Carousel, decorators: [{
            type: Component,
            args: [{ selector: 'p-carousel', template: `
        <div [attr.id]="id" [ngClass]="{ 'p-carousel p-component': true, 'p-carousel-vertical': isVertical(), 'p-carousel-horizontal': !isVertical() }" [ngStyle]="style" [class]="styleClass">
            <div class="p-carousel-header" *ngIf="headerFacet || headerTemplate">
                <ng-content select="p-header"></ng-content>
                <ng-container *ngTemplateOutlet="headerTemplate"></ng-container>
            </div>
            <div [class]="contentClass" [ngClass]="'p-carousel-content'">
                <div class="p-carousel-container">
                    <button type="button" *ngIf="showNavigators" [ngClass]="{ 'p-carousel-prev p-link': true, 'p-disabled': isBackwardNavDisabled() }" [disabled]="isBackwardNavDisabled()" (click)="navBackward($event)" pRipple>
                        <span [ngClass]="{ 'p-carousel-prev-icon pi': true, 'pi-chevron-left': !isVertical(), 'pi-chevron-up': isVertical() }"></span>
                    </button>
                    <div class="p-carousel-items-content" [ngStyle]="{ height: isVertical() ? verticalViewPortHeight : 'auto' }">
                        <div #itemsContainer class="p-carousel-items-container" (transitionend)="onTransitionEnd()" (touchend)="onTouchEnd($event)" (touchstart)="onTouchStart($event)" (touchmove)="onTouchMove($event)">
                            <div
                                *ngFor="let item of clonedItemsForStarting; let index = index"
                                [ngClass]="{
                                    'p-carousel-item p-carousel-item-cloned': true,
                                    'p-carousel-item-active': totalShiftedItems * -1 === value.length,
                                    'p-carousel-item-start': 0 === index,
                                    'p-carousel-item-end': clonedItemsForStarting.length - 1 === index
                                }"
                            >
                                <ng-container *ngTemplateOutlet="itemTemplate; context: { $implicit: item }"></ng-container>
                            </div>
                            <div
                                *ngFor="let item of value; let index = index"
                                [ngClass]="{ 'p-carousel-item': true, 'p-carousel-item-active': firstIndex() <= index && lastIndex() >= index, 'p-carousel-item-start': firstIndex() === index, 'p-carousel-item-end': lastIndex() === index }"
                            >
                                <ng-container *ngTemplateOutlet="itemTemplate; context: { $implicit: item }"></ng-container>
                            </div>
                            <div
                                *ngFor="let item of clonedItemsForFinishing; let index = index"
                                [ngClass]="{
                                    'p-carousel-item p-carousel-item-cloned': true,
                                    'p-carousel-item-active': totalShiftedItems * -1 === numVisible,
                                    'p-carousel-item-start': 0 === index,
                                    'p-carousel-item-end': clonedItemsForFinishing.length - 1 === index
                                }"
                            >
                                <ng-container *ngTemplateOutlet="itemTemplate; context: { $implicit: item }"></ng-container>
                            </div>
                        </div>
                    </div>
                    <button type="button" *ngIf="showNavigators" [ngClass]="{ 'p-carousel-next p-link': true, 'p-disabled': isForwardNavDisabled() }" [disabled]="isForwardNavDisabled()" (click)="navForward($event)" pRipple>
                        <span [ngClass]="{ 'p-carousel-prev-icon pi': true, 'pi-chevron-right': !isVertical(), 'pi-chevron-down': isVertical() }"></span>
                    </button>
                </div>
                <ul [ngClass]="'p-carousel-indicators p-reset'" [class]="indicatorsContentClass" [ngStyle]="indicatorsContentStyle" *ngIf="showIndicators">
                    <li *ngFor="let totalDot of totalDotsArray(); let i = index" [ngClass]="{ 'p-carousel-indicator': true, 'p-highlight': _page === i }">
                        <button type="button" [ngClass]="'p-link'" (click)="onDotClick($event, i)" [class]="indicatorStyleClass" [ngStyle]="indicatorStyle"></button>
                    </li>
                </ul>
            </div>
            <div class="p-carousel-footer" *ngIf="footerFacet || footerTemplate">
                <ng-content select="p-footer"></ng-content>
                <ng-container *ngTemplateOutlet="footerTemplate"></ng-container>
            </div>
        </div>
    `, changeDetection: ChangeDetectionStrategy.OnPush, encapsulation: ViewEncapsulation.None, host: {
                        class: 'p-element'
                    }, styles: [".p-carousel{display:flex;flex-direction:column}.p-carousel-content{display:flex;flex-direction:column;overflow:auto}.p-carousel-prev,.p-carousel-next{align-self:center;flex-grow:0;flex-shrink:0;display:flex;justify-content:center;align-items:center;overflow:hidden;position:relative}.p-carousel-container{display:flex;flex-direction:row}.p-carousel-items-content{overflow:hidden;width:100%}.p-carousel-items-container{display:flex;flex-direction:row}.p-carousel-indicators{display:flex;flex-direction:row;justify-content:center;flex-wrap:wrap}.p-carousel-indicator>button{display:flex;align-items:center;justify-content:center}.p-carousel-vertical .p-carousel-container{flex-direction:column}.p-carousel-vertical .p-carousel-items-container{flex-direction:column;height:100%}.p-items-hidden .p-carousel-item{visibility:hidden}.p-items-hidden .p-carousel-item.p-carousel-item-active{visibility:visible}\n"] }]
        }], ctorParameters: function () { return [{ type: i0.ElementRef }, { type: i0.NgZone }, { type: i0.ChangeDetectorRef }, { type: i0.Renderer2 }, { type: Document, decorators: [{
                    type: Inject,
                    args: [DOCUMENT]
                }] }]; }, propDecorators: { page: [{
                type: Input
            }], numVisible: [{
                type: Input
            }], numScroll: [{
                type: Input
            }], responsiveOptions: [{
                type: Input
            }], orientation: [{
                type: Input
            }], verticalViewPortHeight: [{
                type: Input
            }], contentClass: [{
                type: Input
            }], indicatorsContentClass: [{
                type: Input
            }], indicatorsContentStyle: [{
                type: Input
            }], indicatorStyleClass: [{
                type: Input
            }], indicatorStyle: [{
                type: Input
            }], value: [{
                type: Input
            }], circular: [{
                type: Input
            }], showIndicators: [{
                type: Input
            }], showNavigators: [{
                type: Input
            }], autoplayInterval: [{
                type: Input
            }], style: [{
                type: Input
            }], styleClass: [{
                type: Input
            }], onPage: [{
                type: Output
            }], itemsContainer: [{
                type: ViewChild,
                args: ['itemsContainer']
            }], headerFacet: [{
                type: ContentChild,
                args: [Header]
            }], footerFacet: [{
                type: ContentChild,
                args: [Footer]
            }], templates: [{
                type: ContentChildren,
                args: [PrimeTemplate]
            }] } });
export class CarouselModule {
}
CarouselModule.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "14.0.7", ngImport: i0, type: CarouselModule, deps: [], target: i0.ɵɵFactoryTarget.NgModule });
CarouselModule.ɵmod = i0.ɵɵngDeclareNgModule({ minVersion: "14.0.0", version: "14.0.7", ngImport: i0, type: CarouselModule, declarations: [Carousel], imports: [CommonModule, SharedModule, RippleModule], exports: [CommonModule, Carousel, SharedModule] });
CarouselModule.ɵinj = i0.ɵɵngDeclareInjector({ minVersion: "12.0.0", version: "14.0.7", ngImport: i0, type: CarouselModule, imports: [CommonModule, SharedModule, RippleModule, CommonModule, SharedModule] });
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "14.0.7", ngImport: i0, type: CarouselModule, decorators: [{
            type: NgModule,
            args: [{
                    imports: [CommonModule, SharedModule, RippleModule],
                    exports: [CommonModule, Carousel, SharedModule],
                    declarations: [Carousel]
                }]
        }] });
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiY2Fyb3VzZWwuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi9zcmMvYXBwL2NvbXBvbmVudHMvY2Fyb3VzZWwvY2Fyb3VzZWwudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUEsT0FBTyxFQUNILFNBQVMsRUFDVCxLQUFLLEVBRUwsU0FBUyxFQUdULGVBQWUsRUFFZixRQUFRLEVBRVIsWUFBWSxFQUNaLE1BQU0sRUFDTixZQUFZLEVBQ1osdUJBQXVCLEVBQ3ZCLGlCQUFpQixFQUlqQixNQUFNLEVBQ1QsTUFBTSxlQUFlLENBQUM7QUFDdkIsT0FBTyxFQUFFLGFBQWEsRUFBRSxZQUFZLEVBQUUsTUFBTSxFQUFFLE1BQU0sRUFBRSxNQUFNLGFBQWEsQ0FBQztBQUMxRSxPQUFPLEVBQUUsWUFBWSxFQUFFLE1BQU0sZ0JBQWdCLENBQUM7QUFDOUMsT0FBTyxFQUFFLFlBQVksRUFBRSxRQUFRLEVBQUUsTUFBTSxpQkFBaUIsQ0FBQztBQUN6RCxPQUFPLEVBQUUsaUJBQWlCLEVBQUUsTUFBTSxlQUFlLENBQUM7Ozs7QUFzRWxELE1BQU0sT0FBTyxRQUFRO0lBMElqQixZQUFtQixFQUFjLEVBQVMsSUFBWSxFQUFTLEVBQXFCLEVBQVUsUUFBbUIsRUFBNEIsUUFBa0I7UUFBNUksT0FBRSxHQUFGLEVBQUUsQ0FBWTtRQUFTLFNBQUksR0FBSixJQUFJLENBQVE7UUFBUyxPQUFFLEdBQUYsRUFBRSxDQUFtQjtRQUFVLGFBQVEsR0FBUixRQUFRLENBQVc7UUFBNEIsYUFBUSxHQUFSLFFBQVEsQ0FBVTtRQXJHdEosZ0JBQVcsR0FBRyxZQUFZLENBQUM7UUFFM0IsMkJBQXNCLEdBQUcsT0FBTyxDQUFDO1FBRWpDLGlCQUFZLEdBQVcsRUFBRSxDQUFDO1FBRTFCLDJCQUFzQixHQUFXLEVBQUUsQ0FBQztRQUlwQyx3QkFBbUIsR0FBVyxFQUFFLENBQUM7UUFXakMsYUFBUSxHQUFZLEtBQUssQ0FBQztRQUUxQixtQkFBYyxHQUFZLElBQUksQ0FBQztR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RUFBRSxZQUFZLENBQUM7b0JBQy9DLFlBQVksRUFBRSxDQUFDLFFBQVEsQ0FBQztpQkFDM0IiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQge1xuICAgIENvbXBvbmVudCxcbiAgICBJbnB1dCxcbiAgICBFbGVtZW50UmVmLFxuICAgIFZpZXdDaGlsZCxcbiAgICBBZnRlckNvbnRlbnRJbml0LFxuICAgIFRlbXBsYXRlUmVmLFxuICAgIENvbnRlbnRDaGlsZHJlbixcbiAgICBRdWVyeUxpc3QsXG4gICAgTmdNb2R1bGUsXG4gICAgTmdab25lLFxuICAgIEV2ZW50RW1pdHRlcixcbiAgICBPdXRwdXQsXG4gICAgQ29udGVudENoaWxkLFxuICAgIENoYW5nZURldGVjdGlvblN0cmF0ZWd5LFxuICAgIFZpZXdFbmNhcHN1bGF0aW9uLFxuICAgIENoYW5nZURldGVjdG9yUmVmLFxuICAgIFNpbXBsZUNoYW5nZXMsXG4gICAgUmVuZGVyZXIyLFxuICAgIEluamVjdFxufSBmcm9tICdAYW5ndWxhci9jb3JlJztcbmltcG9ydCB7IFByaW1lVGVtcGxhdGUsIFNoYXJlZE1vZHVsZSwgSGVhZGVyLCBGb290ZXIgfSBmcm9tICdwcmltZW5nL2FwaSc7XG5pbXBvcnQgeyBSaXBwbGVNb2R1bGUgfSBmcm9tICdwcmltZW5nL3JpcHBsZSc7XG5pbXBvcnQgeyBDb21tb25Nb2R1bGUsIERPQ1VNRU5UIH0gZnJvbSAnQGFuZ3VsYXIvY29tbW9uJztcbmltcG9ydCB7IFVuaXF1ZUNvbXBvbmVudElkIH0gZnJvbSAncHJpbWVuZy91dGlscyc7XG5cbkBDb21wb25lbnQoe1xuICAgIHNlbGVjdG9yOiAncC1jYXJvdXNlbCcsXG4gICAgdGVtcGxhdGU6IGBcbiAgICAgICAgPGRpdiBbYXR0ci5pZF09XCJpZFwiIFtuZ0NsYXNzXT1cInsgJ3AtY2Fyb3VzZWwgcC1jb21wb25lbnQnOiB0cnVlLCAncC1jYXJvdXNlbC12ZXJ0aWNhbCc6IGlzVmVydGljYWwoKSwgJ3AtY2Fyb3VzZWwtaG9yaXpvbnRhbCc6ICFpc1ZlcnRpY2FsKCkgfVwiIFtuZ1N0eWxlXT1cInN0eWxlXCIgW2NsYXNzXT1cInN0eWxlQ2xhc3NcIj5cbiAgICAgICAgICAgIDxkaXYgY2xhc3M9XCJwLWNhcm91c2VsLWhlYWRlclwiICpuZ0lmPVwiaGVhZGVyRmFjZXQgfHwgaGVhZGVyVGVtcGxhdGVcIj5cbiAgICAgICAgICAgICAgICA8bmctY29udGVudCBzZWxlY3Q9XCJwLWhlYWRlclwiPjwvbmctY29udGVudD5cbiAgICAgICAgICAgICAgICA8bmctY29udGFpbmVyICpuZ1RlbXBsYXRlT3V0bGV0PVwiaGVhZGVyVGVtcGxhdGVcIj48L25nLWNvbnRhaW5lcj5cbiAgICAgICAgICAgIDwvZGl2PlxuICAgICAgICAgICAgPGRpdiBbY2xhc3NdPVwiY29udGVudENsYXNzXCIgW25nQ2xhc3NdPVwiJ3AtY2Fyb3VzZWwtY29udGVudCdcIj5cbiAgICAgICAgICAgICAgICA8ZGl2IGNsYXNzPVwicC1jYXJvdXNlbC1jb250YWluZXJcIj5cbiAgICAgICAgICAgICAgICAgICAgPGJ1dHRvbiB0eXBlPVwiYnV0dG9uXCIgKm5nSWY9XCJzaG93TmF2aWdhdG9yc1wiIFtuZ0NsYXNzXT1cInsgJ3AtY2Fyb3VzZWwtcHJldiBwLWxpbmsnOiB0cnVlLCAncC1kaXNhYmxlZCc6IGlzQmFja3dhcmROYXZEaXNhYmxlZCgpIH1cIiBbZGlzYWJsZWRdPVwiaXNCYWNrd2FyZE5hdkRpc2FibGVkKClcIiAoY2xpY2spPVwibmF2QmFja3dhcmQoJGV2ZW50KVwiIHBSaXBwbGU+XG4gICAgICAgICAgICAgICAgICAgICAgICA8c3BhbiBbbmdDbGFzc109XCJ7ICdwLWNhcm91c2VsLXByZXYtaWNvbiBwaSc6IHRydWUsICdwaS1jaGV2cm9uLWxlZnQnOiAhaXNWZXJ0aWNhbCgpLCAncGktY2hldnJvbi11cCc6IGlzVmVydGljYWwoKSB9XCI+PC9zcGFuPlxuICAgICAgICAgICAgICAgICAgICA8L2J1dHRvbj5cbiAgICAgICAgICAgICAgICAgICAgPGRpdiBjbGFzcz1cInAtY2Fyb3VzZWwtaXRlbXMtY29udGVudFwiIFtuZ1N0eWxlXT1cInsgaGVpZ2h0OiBpc1ZlcnRpY2FsKCkgPyB2ZXJ0aWNhbFZpZXdQb3J0SGVpZ2h0IDogJ2F1dG8nIH1cIj5cbiAgICAgICAgICAgICAgICAgICAgICAgIDxkaXYgI2l0ZW1zQ29udGFpbmVyIGNsYXNzPVwicC1jYXJvdXNlbC1pdGVtcy1jb250YWluZXJcIiAodHJhbnNpdGlvbmVuZCk9XCJvblRyYW5zaXRpb25FbmQoKVwiICh0b3VjaGVuZCk9XCJvblRvdWNoRW5kKCRldmVudClcIiAodG91Y2hzdGFydCk9XCJvblRvdWNoU3RhcnQoJGV2ZW50KVwiICh0b3VjaG1vdmUpPVwib25Ub3VjaE1vdmUoJGV2ZW50KVwiPlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIDxkaXZcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgKm5nRm9yPVwibGV0IGl0ZW0gb2YgY2xvbmVkSXRlbXNGb3JTdGFydGluZzsgbGV0IGluZGV4ID0gaW5kZXhcIlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBbbmdDbGFzc109XCJ7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAncC1jYXJvdXNlbC1pdGVtIHAtY2Fyb3VzZWwtaXRlbS1jbG9uZWQnOiB0cnVlLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgJ3AtY2Fyb3VzZWwtaXRlbS1hY3RpdmUnOiB0b3RhbFNoaWZ0ZWRJdGVtcyAqIC0xID09PSB2YWx1ZS5sZW5ndGgsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAncC1jYXJvdXNlbC1pdGVtLXN0YXJ0JzogMCA9PT0gaW5kZXgsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAncC1jYXJvdXNlbC1pdGVtLWVuZCc6IGNsb25lZEl0ZW1zRm9yU3RhcnRpbmcubGVuZ3RoIC0gMSA9PT0gaW5kZXhcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfVwiXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgPlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8bmctY29udGFpbmVyICpuZ1RlbXBsYXRlT3V0bGV0PVwiaXRlbVRlbXBsYXRlOyBjb250ZXh0OiB7ICRpbXBsaWNpdDogaXRlbSB9XCI+PC9uZy1jb250YWluZXI+XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgPC9kaXY+XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgPGRpdlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAqbmdGb3I9XCJsZXQgaXRlbSBvZiB2YWx1ZTsgbGV0IGluZGV4ID0gaW5kZXhcIlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBbbmdDbGFzc109XCJ7ICdwLWNhcm91c2VsLWl0ZW0nOiB0cnVlLCAncC1jYXJvdXNlbC1pdGVtLWFjdGl2ZSc6IGZpcnN0SW5kZXgoKSA8PSBpbmRleCAmJiBsYXN0SW5kZXgoKSA+PSBpbmRleCwgJ3AtY2Fyb3VzZWwtaXRlbS1zdGFydCc6IGZpcnN0SW5kZXgoKSA9PT0gaW5kZXgsICdwLWNhcm91c2VsLWl0ZW0tZW5kJzogbGFzdEluZGV4KCkgPT09IGluZGV4IH1cIlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgID5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPG5nLWNvbnRhaW5lciAqbmdUZW1wbGF0ZU91dGxldD1cIml0ZW1UZW1wbGF0ZTsgY29udGV4dDogeyAkaW1wbGljaXQ6IGl0ZW0gfVwiPjwvbmctY29udGFpbmVyPlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIDwvZGl2PlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIDxkaXZcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgKm5nRm9yPVwibGV0IGl0ZW0gb2YgY2xvbmVkSXRlbXNGb3JGaW5pc2hpbmc7IGxldCBpbmRleCA9IGluZGV4XCJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgW25nQ2xhc3NdPVwie1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgJ3AtY2Fyb3VzZWwtaXRlbSBwLWNhcm91c2VsLWl0ZW0tY2xvbmVkJzogdHJ1ZSxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICdwLWNhcm91c2VsLWl0ZW0tYWN0aXZlJzogdG90YWxTaGlmdGVkSXRlbXMgKiAtMSA9PT0gbnVtVmlzaWJsZSxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICdwLWNhcm91c2VsLWl0ZW0tc3RhcnQnOiAwID09PSBpbmRleCxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICdwLWNhcm91c2VsLWl0ZW0tZW5kJzogY2xvbmVkSXRlbXNGb3JGaW5pc2hpbmcubGVuZ3RoIC0gMSA9PT0gaW5kZXhcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfVwiXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgPlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8bmctY29udGFpbmVyICpuZ1RlbXBsYXRlT3V0bGV0PVwiaXRlbVRlbXBsYXRlOyBjb250ZXh0OiB7ICRpbXBsaWNpdDogaXRlbSB9XCI+PC9uZy1jb250YWluZXI+XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgPC9kaXY+XG4gICAgICAgICAgICAgICAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgICAgICAgICAgICAgPC9kaXY+XG4gICAgICAgICAgICAgICAgICAgIDxidXR0b24gdHlwZT1cImJ1dHRvblwiICpuZ0lmPVwic2hvd05hdmlnYXRvcnNcIiBbbmdDbGFzc109XCJ7ICdwLWNhcm91c2VsLW5leHQgcC1saW5rJzogdHJ1ZSwgJ3AtZGlzYWJsZWQnOiBpc0ZvcndhcmROYXZEaXNhYmxlZCgpIH1cIiBbZGlzYWJsZWRdPVwiaXNGb3J3YXJkTmF2RGlzYWJsZWQoKVwiIChjbGljayk9XCJuYXZGb3J3YXJkKCRldmVudClcIiBwUmlwcGxlPlxuICAgICAgICAgICAgICAgICAgICAgICAgPHNwYW4gW25nQ2xhc3NdPVwieyAncC1jYXJvdXNlbC1wcmV2LWljb24gcGknOiB0cnVlLCAncGktY2hldnJvbi1yaWdodCc6ICFpc1ZlcnRpY2FsKCksICdwaS1jaGV2cm9uLWRvd24nOiBpc1ZlcnRpY2FsKCkgfVwiPjwvc3Bhbj5cbiAgICAgICAgICAgICAgICAgICAgPC9idXR0b24+XG4gICAgICAgICAgICAgICAgPC9kaXY+XG4gICAgICAgICAgICAgICAgPHVsIFtuZ0NsYXNzXT1cIidwLWNhcm91c2VsLWluZGljYXRvcnMgcC1yZXNldCdcIiBbY2xhc3NdPVwiaW5kaWNhdG9yc0NvbnRlbnRDbGFzc1wiIFtuZ1N0eWxlXT1cImluZGljYXRvcnNDb250ZW50U3R5bGVcIiAqbmdJZj1cInNob3dJbmRpY2F0b3JzXCI+XG4gICAgICAgICAgICAgICAgICAgIDxsaSAqbmdGb3I9XCJsZXQgdG90YWxEb3Qgb2YgdG90YWxEb3RzQXJyYXkoKTsgbGV0IGkgPSBpbmRleFwiIFtuZ0NsYXNzXT1cInsgJ3AtY2Fyb3VzZWwtaW5kaWNhdG9yJzogdHJ1ZSwgJ3AtaGlnaGxpZ2h0JzogX3BhZ2UgPT09IGkgfVwiPlxuICAgICAgICAgICAgICAgICAgICAgICAgPGJ1dHRvbiB0eXBlPVwiYnV0dG9uXCIgW25nQ2xhc3NdPVwiJ3AtbGluaydcIiAoY2xpY2spPVwib25Eb3RDbGljaygkZXZlbnQsIGkpXCIgW2NsYXNzXT1cImluZGljYXRvclN0eWxlQ2xhc3NcIiBbbmdTdHlsZV09XCJpbmRpY2F0b3JTdHlsZVwiPjwvYnV0dG9uPlxuICAgICAgICAgICAgICAgICAgICA8L2xpPlxuICAgICAgICAgICAgICAgIDwvdWw+XG4gICAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgICAgIDxkaXYgY2xhc3M9XCJwLWNhcm91c2VsLWZvb3RlclwiICpuZ0lmPVwiZm9vdGVyRmFjZXQgfHwgZm9vdGVyVGVtcGxhdGVcIj5cbiAgICAgICAgICAgICAgICA8bmctY29udGVudCBzZWxlY3Q9XCJwLWZvb3RlclwiPjwvbmctY29udGVudD5cbiAgICAgICAgICAgICAgICA8bmctY29udGFpbmVyICpuZ1RlbXBsYXRlT3V0bGV0PVwiZm9vdGVyVGVtcGxhdGVcIj48L25nLWNvbnRhaW5lcj5cbiAgICAgICAgICAgIDwvZGl2PlxuICAgICAgICA8L2Rpdj5cbiAgICBgLFxuICAgIGNoYW5nZURldGVjdGlvbjogQ2hhbmdlRGV0ZWN0aW9uU3RyYXRlZ3kuT25QdXNoLFxuICAgIGVuY2Fwc3VsYXRpb246IFZpZXdFbmNhcHN1bGF0aW9uLk5vbmUsXG4gICAgc3R5bGVVcmxzOiBbJy4vY2Fyb3VzZWwuY3NzJ10sXG4gICAgaG9zdDoge1xuICAgICAgICBjbGFzczogJ3AtZWxlbWVudCdcbiAgICB9XG59KVxuZXhwb3J0IGNsYXNzIENhcm91c2VsIGltcGxlbWVudHMgQWZ0ZXJDb250ZW50SW5pdCB7XG4gICAgQElucHV0KCkgZ2V0IHBhZ2UoKTogbnVtYmVyIHtcbiAgICAgICAgcmV0dXJuIHRoaXMuX3BhZ2U7XG4gICAgfVxuICAgIHNldCBwYWdlKHZhbDogbnVtYmVyKSB7XG4gICAgICAgIGlmICh0aGlzLmlzQ3JlYXRlZCAmJiB2YWwgIT09IHRoaXMuX3BhZ2UpIHtcbiAgICAgICAgICAgIGlmICh0aGlzLmF1dG9wbGF5SW50ZXJ2YWwpIHtcbiAgICAgICAgICAgICAgICB0aGlzLnN0b3BBdXRvcGxheSgpO1xuICAgICAgICAgICAgICAgIHRoaXMuYWxsb3dBdXRvcGxheSA9IGZhbHNlO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICBpZiAodmFsID4gdGhpcy5fcGFnZSAmJiB2YWwgPD0gdGhpcy50b3RhbERvdHMoKSAtIDEpIHtcbiAgICAgICAgICAgICAgICB0aGlzLnN0ZXAoLTEsIHZhbCk7XG4gICAgICAgICAgICB9IGVsc2UgaWYgKHZhbCA8IHRoaXMuX3BhZ2UpIHtcbiAgICAgICAgICAgICAgICB0aGlzLnN0ZXAoMSwgdmFsKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuXG4gICAgICAgIHRoaXMuX3BhZ2UgPSB2YWw7XG4gICAgfVxuXG4gICAgQElucHV0KCkgZ2V0IG51bVZpc2libGUoKTogbnVtYmVyIHtcbiAgICAgICAgcmV0dXJuIHRoaXMuX251bVZpc2libGU7XG4gICAgfVxuICAgIHNldCBudW1WaXNpYmxlKHZhbDogbnVtYmVyKSB7XG4gICAgICAgIHRoaXMuX251bVZpc2libGUgPSB2YWw7XG4gICAgfVxuXG4gICAgQElucHV0KCkgZ2V0IG51bVNjcm9sbCgpOiBudW1iZXIge1xuICAgICAgICByZXR1cm4gdGhpcy5fbnVtVmlzaWJsZTtcbiAgICB9XG4gICAgc2V0IG51bVNjcm9sbCh2YWw6IG51bWJlcikge1xuICAgICAgICB0aGlzLl9udW1TY3JvbGwgPSB2YWw7XG4gICAgfVxuXG4gICAgQElucHV0KCkgcmVzcG9uc2l2ZU9wdGlvbnM6IGFueVtdO1xuXG4gICAgQElucHV0KCkgb3JpZW50YXRpb24gPSAnaG9yaXpvbnRhbCc7XG5cbiAgICBASW5wdXQoKSB2ZXJ0aWNhbFZpZXdQb3J0SGVpZ2h0ID0gJzMwMHB4JztcblxuICAgIEBJbnB1dCgpIGNvbnRlbnRDbGFzczogc3RyaW5nID0gJyc7XG5cbiAgICBASW5wdXQoKSBpbmRpY2F0b3JzQ29udGVudENsYXNzOiBzdHJpbmcgPSAnJztcblxuICAgIEBJbnB1dCgpIGluZGljYXRvcnNDb250ZW50U3R5bGU6IGFueTtcblxuICAgIEBJbnB1dCgpIGluZGljYXRvclN0eWxlQ2xhc3M6IHN0cmluZyA9ICcnO1xuXG4gICAgQElucHV0KCkgaW5kaWNhdG9yU3R5bGU6IGFueTtcblxuICAgIEBJbnB1dCgpIGdldCB2YWx1ZSgpOiBhbnlbXSB7XG4gICAgICAgIHJldHVybiB0aGlzLl92YWx1ZTtcbiAgICB9XG4gICAgc2V0IHZhbHVlKHZhbCkge1xuICAgICAgICB0aGlzLl92YWx1ZSA9IHZhbDtcbiAgICB9XG5cbiAgICBASW5wdXQoKSBjaXJjdWxhcjogYm9vbGVhbiA9IGZhbHNlO1xuXG4gICAgQElucHV0KCkgc2hvd0luZGljYXRvcnM6IGJvb2xlYW4gPSB0cnVlO1xuXG4gICAgQElucHV0KCkgc2hvd05hdmlnYXRvcnM6IGJvb2xlYW4gPSB0cnVlO1xuXG4gICAgQElucHV0KCkgYXV0b3BsYXlJbnRlcnZhbDogbnVtYmVyID0gMDtcblxuICAgIEBJbnB1dCgpIHN0eWxlOiBhbnk7XG5cbiAgICBASW5wdXQoKSBzdHlsZUNsYXNzOiBzdHJpbmc7XG5cbiAgICBAT3V0cHV0KCkgb25QYWdlOiBFdmVudEVtaXR0ZXI8YW55PiA9IG5ldyBFdmVudEVtaXR0ZXIoKTtcblxuICAgIEBWaWV3Q2hpbGQoJ2l0ZW1zQ29udGFpbmVyJykgaXRlbXNDb250YWluZXI6IEVsZW1lbnRSZWY7XG5cbiAgICBAQ29udGVudENoaWxkKEhlYWRlcikgaGVhZGVyRmFjZXQ7XG5cbiAgICBAQ29udGVudENoaWxkKEZvb3RlcikgZm9vdGVyRmFjZXQ7XG5cbiAgICBAQ29udGVudENoaWxkcmVuKFByaW1lVGVtcGxhdGUpIHRlbXBsYXRlczogUXVlcnlMaXN0PGFueT47XG5cbiAgICBfbnVtVmlzaWJsZTogbnVtYmVyID0gMTtcblxuICAgIF9udW1TY3JvbGw6IG51bWJlciA9IDE7XG5cbiAgICBfb2xkTnVtU2Nyb2xsOiBudW1iZXIgPSAwO1xuXG4gICAgcHJldlN0YXRlOiBhbnkgPSB7XG4gICAgICAgIG51bVNjcm9sbDogMCxcbiAgICAgICAgbnVtVmlzaWJsZTogMCxcbiAgICAgICAgdmFsdWU6IFtdXG4gICAgfTtcblxuICAgIGRlZmF1bHROdW1TY3JvbGw6IG51bWJlciA9IDE7XG5cbiAgICBkZWZhdWx0TnVtVmlzaWJsZTogbnVtYmVyID0gMTtcblxuICAgIF9wYWdlOiBudW1iZXIgPSAwO1xuXG4gICAgX3ZhbHVlOiBhbnlbXTtcblxuICAgIGNhcm91c2VsU3R5bGU6IGFueTtcblxuICAgIGlkOiBzdHJpbmc7XG5cbiAgICB0b3RhbFNoaWZ0ZWRJdGVtcztcblxuICAgIGlzUmVtYWluaW5nSXRlbXNBZGRlZDogYm9vbGVhbiA9IGZhbHNlO1xuXG4gICAgYW5pbWF0aW9uVGltZW91dDogYW55O1xuXG4gICAgdHJhbnNsYXRlVGltZW91dDogYW55O1xuXG4gICAgcmVtYWluaW5nSXRlbXM6IG51bWJlciA9IDA7XG5cbiAgICBfaXRlbXM6IGFueVtdO1xuXG4gICAgc3RhcnRQb3M6IGFueTtcblxuICAgIGRvY3VtZW50UmVzaXplTGlzdGVuZXI6IGFueTtcblxuICAgIGNsb25lZEl0ZW1zRm9yU3RhcnRpbmc6IGFueVtdO1xuXG4gICAgY2xvbmVkSXRlbXNGb3JGaW5pc2hpbmc6IGFueVtdO1xuXG4gICAgYWxsb3dBdXRvcGxheTogYm9vbGVhbjtcblxuICAgIGludGVydmFsOiBhbnk7XG5cbiAgICBpc0NyZWF0ZWQ6IGJvb2xlYW47XG5cbiAgICBzd2lwZVRocmVzaG9sZDogbnVtYmVyID0gMjA7XG5cbiAgICBpdGVtVGVtcGxhdGU6IFRlbXBsYXRlUmVmPGFueT47XG5cbiAgICBoZWFkZXJUZW1wbGF0ZTogVGVtcGxhdGVSZWY8YW55PjtcblxuICAgIGZvb3RlclRlbXBsYXRlOiBUZW1wbGF0ZVJlZjxhbnk+O1xuXG4gICAgY29uc3RydWN0b3IocHVibGljIGVsOiBFbGVtZW50UmVmLCBwdWJsaWMgem9uZTogTmdab25lLCBwdWJsaWMgY2Q6IENoYW5nZURldGVjdG9yUmVmLCBwcml2YXRlIHJlbmRlcmVyOiBSZW5kZXJlcjIsIEBJbmplY3QoRE9DVU1FTlQpIHByaXZhdGUgZG9jdW1lbnQ6IERvY3VtZW50KSB7XG4gICAgICAgIHRoaXMudG90YWxTaGlmdGVkSXRlbXMgPSB0aGlzLnBhZ2UgKiB0aGlzLm51bVNjcm9sbCAqIC0xO1xuICAgIH1cblxuICAgIG5nT25DaGFuZ2VzKHNpbXBsZUNoYW5nZTogU2ltcGxlQ2hhbmdlcykge1xuICAgICAgICBpZiAoc2ltcGxlQ2hhbmdlLnZhbHVlKSB7XG4gICAgICAgICAgICBpZiAodGhpcy5jaXJjdWxhciAmJiB0aGlzLl92YWx1ZSkge1xuICAgICAgICAgICAgICAgIHRoaXMuc2V0Q2xvbmVJdGVtcygpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG5cbiAgICAgICAgaWYgKHRoaXMuaXNDcmVhdGVkKSB7XG4gICAgICAgICAgICBpZiAoc2ltcGxlQ2hhbmdlLm51bVZpc2libGUpIHtcbiAgICAgICAgICAgICAgICBpZiAodGhpcy5yZXNwb25zaXZlT3B0aW9ucykge1xuICAgICAgICAgICAgICAgICAgICB0aGlzLmRlZmF1bHROdW1WaXNpYmxlID0gdGhpcy5udW1WaXNpYmxlO1xuICAgICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgICAgIGlmICh0aGlzLmlzQ2lyY3VsYXIoKSkge1xuICAgICAgICAgICAgICAgICAgICB0aGlzLnNldENsb25lSXRlbXMoKTtcbiAgICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgICAgICB0aGlzLmNyZWF0ZVN0eWxlKCk7XG4gICAgICAgICAgICAgICAgdGhpcy5jYWxjdWxhdGVQb3NpdGlvbigpO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICBpZiAoc2ltcGxlQ2hhbmdlLm51bVNjcm9sbCkge1xuICAgICAgICAgICAgICAgIGlmICh0aGlzLnJlc3BvbnNpdmVPcHRpb25zKSB7XG4gICAgICAgICAgICAgICAgICAgIHRoaXMuZGVmYXVsdE51bVNjcm9sbCA9IHRoaXMubnVtU2Nyb2xsO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgIH1cblxuICAgIG5nQWZ0ZXJDb250ZW50SW5pdCgpIHtcbiAgICAgICAgdGhpcy5pZCA9IFVuaXF1ZUNvbXBvbmVudElkKCk7XG4gICAgICAgIHRoaXMuYWxsb3dBdXRvcGxheSA9ICEhdGhpcy5hdXRvcGxheUludGVydmFsO1xuXG4gICAgICAgIGlmICh0aGlzLmNpcmN1bGFyKSB7XG4gICAgICAgICAgICB0aGlzLnNldENsb25lSXRlbXMoKTtcbiAgICAgICAgfVxuXG4gICAgICAgIGlmICh0aGlzLnJlc3BvbnNpdmVPcHRpb25zKSB7XG4gICAgICAgICAgICB0aGlzLmRlZmF1bHROdW1TY3JvbGwgPSB0aGlzLl9udW1TY3JvbGw7XG4gICAgICAgICAgICB0aGlzLmRlZmF1bHROdW1WaXNpYmxlID0gdGhpcy5fbnVtVmlzaWJsZTtcbiAgICAgICAgfVxuXG4gICAgICAgIHRoaXMuY3JlYXRlU3R5bGUoKTtcbiAgICAgICAgdGhpcy5jYWxjdWxhdGVQb3NpdGlvbigpO1xuXG4gICAgICAgIGlmICh0aGlzLnJlc3BvbnNpdmVPcHRpb25zKSB7XG4gICAgICAgICAgICB0aGlzLmJpbmREb2N1bWVudExpc3RlbmVycygpO1xuICAgICAgICB9XG5cbiAgICAgICAgdGhpcy50ZW1wbGF0ZXMuZm9yRWFjaCgoaXRlbSkgPT4ge1xuICAgICAgICAgICAgc3dpdGNoIChpdGVtLmdldFR5cGUoKSkge1xuICAgICAgICAgICAgICAgIGNhc2UgJ2l0ZW0nOlxuICAgICAgICAgICAgICAgICAgICB0aGlzLml0ZW1UZW1wbGF0ZSA9IGl0ZW0udGVtcGxhdGU7XG4gICAgICAgICAgICAgICAgICAgIGJyZWFrO1xuXG4gICAgICAgICAgICAgICAgY2FzZSAnaGVhZGVyJzpcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5oZWFkZXJUZW1wbGF0ZSA9IGl0ZW0udGVtcGxhdGU7XG4gICAgICAgICAgICAgICAgICAgIGJyZWFrO1xuXG4gICAgICAgICAgICAgICAgY2FzZSAnZm9vdGVyJzpcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5mb290ZXJUZW1wbGF0ZSA9IGl0ZW0udGVtcGxhdGU7XG4gICAgICAgICAgICAgICAgICAgIGJyZWFrO1xuXG4gICAgICAgICAgICAgICAgZGVmYXVsdDpcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5pdGVtVGVtcGxhdGUgPSBpdGVtLnRlbXBsYXRlO1xuICAgICAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgIH1cbiAgICAgICAgfSk7XG4gICAgfVxuXG4gICAgbmdBZnRlckNvbnRlbnRDaGVja2VkKCkge1xuICAgICAgICBjb25zdCBpc0NpcmN1bGFyID0gdGhpcy5pc0NpcmN1bGFyKCk7XG4gICAgICAgIGxldCB0b3RhbFNoaWZ0ZWRJdGVtcyA9IHRoaXMudG90YWxTaGlmdGVkSXRlbXM7XG5cbiAgICAgICAgaWYgKHRoaXMudmFsdWUgJiYgdGhpcy5pdGVtc0NvbnRhaW5lciAmJiAodGhpcy5wcmV2U3RhdGUubnVtU2Nyb2xsICE9PSB0aGlzLl9udW1TY3JvbGwgfHwgdGhpcy5wcmV2U3RhdGUubnVtVmlzaWJsZSAhPT0gdGhpcy5fbnVtVmlzaWJsZSB8fCB0aGlzLnByZXZTdGF0ZS52YWx1ZS5sZW5ndGggIT09IHRoaXMudmFsdWUubGVuZ3RoKSkge1xuICAgICAgICAgICAgaWYgKHRoaXMuYXV0b3BsYXlJbnRlcnZhbCkge1xuICAgICAgICAgICAgICAgIHRoaXMuc3RvcEF1dG9wbGF5KCk7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIHRoaXMucmVtYWluaW5nSXRlbXMgPSAodGhpcy52YWx1ZS5sZW5ndGggLSB0aGlzLl9udW1WaXNpYmxlKSAlIHRoaXMuX251bVNjcm9sbDtcblxuICAgICAgICAgICAgbGV0IHBhZ2UgPSB0aGlzLl9wYWdlO1xuICAgICAgICAgICAgaWYgKHRoaXMudG90YWxEb3RzKCkgIT09IDAgJiYgcGFnZSA+PSB0aGlzLnRvdGFsRG90cygpKSB7XG4gICAgICAgICAgICAgICAgcGFnZSA9IHRoaXMudG90YWxEb3RzKCkgLSAxO1xuICAgICAgICAgICAgICAgIHRoaXMuX3BhZ2UgPSBwYWdlO1xuICAgICAgICAgICAgICAgIHRoaXMub25QYWdlLmVtaXQoe1xuICAgICAgICAgICAgICAgICAgICBwYWdlOiB0aGlzLnBhZ2VcbiAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgdG90YWxTaGlmdGVkSXRlbXMgPSBwYWdlICogdGhpcy5fbnVtU2Nyb2xsICogLTE7XG4gICAgICAgICAgICBpZiAoaXNDaXJjdWxhcikge1xuICAgICAgICAgICAgICAgIHRvdGFsU2hpZnRlZEl0ZW1zIC09IHRoaXMuX251bVZpc2libGU7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIGlmIChwYWdlID09PSB0aGlzLnRvdGFsRG90cygpIC0gMSAmJiB0aGlzLnJlbWFpbmluZ0l0ZW1zID4gMCkge1xuICAgICAgICAgICAgICAgIHRvdGFsU2hpZnRlZEl0ZW1zICs9IC0xICogdGhpcy5yZW1haW5pbmdJdGVtcyArIHRoaXMuX251bVNjcm9sbDtcbiAgICAgICAgICAgICAgICB0aGlzLmlzUmVtYWluaW5nSXRlbXNBZGRlZCA9IHRydWU7XG4gICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgIHRoaXMuaXNSZW1haW5pbmdJdGVtc0FkZGVkID0gZmFsc2U7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIGlmICh0b3RhbFNoaWZ0ZWRJdGVtcyAhPT0gdGhpcy50b3RhbFNoaWZ0ZWRJdGVtcykge1xuICAgICAgICAgICAgICAgIHRoaXMudG90YWxTaGlmdGVkSXRlbXMgPSB0b3RhbFNoaWZ0ZWRJdGVtcztcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgdGhpcy5fb2xkTnVtU2Nyb2xsID0gdGhpcy5fbnVtU2Nyb2xsO1xuICAgICAgICAgICAgdGhpcy5wcmV2U3RhdGUubnVtU2Nyb2xsID0gdGhpcy5fbnVtU2Nyb2xsO1xuICAgICAgICAgICAgdGhpcy5wcmV2U3RhdGUubnVtVmlzaWJsZSA9IHRoaXMuX251bVZpc2libGU7XG4gICAgICAgICAgICB0aGlzLnByZXZTdGF0ZS52YWx1ZSA9IFsuLi50aGlzLl92YWx1ZV07XG5cbiAgICAgICAgICAgIGlmICh0aGlzLnRvdGFsRG90cygpID4gMCAmJiB0aGlzLml0ZW1zQ29udGFpbmVyLm5hdGl2ZUVsZW1lbnQpIHtcbiAgICAgICAgICAgICAgICB0aGlzLml0ZW1zQ29udGFpbmVyLm5hdGl2ZUVsZW1lbnQuc3R5bGUudHJhbnNmb3JtID0gdGhpcy5pc1ZlcnRpY2FsKCkgPyBgdHJhbnNsYXRlM2QoMCwgJHt0b3RhbFNoaWZ0ZWRJdGVtcyAqICgxMDAgLyB0aGlzLl9udW1WaXNpYmxlKX0lLCAwKWAgOiBgdHJhbnNsYXRlM2QoJHt0b3RhbFNoaWZ0ZWRJdGVtcyAqICgxMDAgLyB0aGlzLl9udW1WaXNpYmxlKX0lLCAwLCAwKWA7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIHRoaXMuaXNDcmVhdGVkID0gdHJ1ZTtcblxuICAgICAgICAgICAgaWYgKHRoaXMuYXV0b3BsYXlJbnRlcnZhbCAmJiB0aGlzLmlzQXV0b3BsYXkoKSkge1xuICAgICAgICAgICAgICAgIHRoaXMuc3RhcnRBdXRvcGxheSgpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG5cbiAgICAgICAgaWYgKGlzQ2lyY3VsYXIpIHtcbiAgICAgICAgICAgIGlmICh0aGlzLnBhZ2UgPT09IDApIHtcbiAgICAgICAgICAgICAgICB0b3RhbFNoaWZ0ZWRJdGVtcyA9IC0xICogdGhpcy5fbnVtVmlzaWJsZTtcbiAgICAgICAgICAgIH0gZWxzZSBpZiAodG90YWxTaGlmdGVkSXRlbXMgPT09IDApIHtcbiAgICAgICAgICAgICAgICB0b3RhbFNoaWZ0ZWRJdGVtcyA9IC0xICogdGhpcy52YWx1ZS5sZW5ndGg7XG4gICAgICAgICAgICAgICAgaWYgKHRoaXMucmVtYWluaW5nSXRlbXMgPiAwKSB7XG4gICAgICAgICAgICAgICAgICAgIHRoaXMuaXNSZW1haW5pbmdJdGVtc0FkZGVkID0gdHJ1ZTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIGlmICh0b3RhbFNoaWZ0ZWRJdGVtcyAhPT0gdGhpcy50b3RhbFNoaWZ0ZWRJdGVtcykge1xuICAgICAgICAgICAgICAgIHRoaXMudG90YWxTaGlmdGVkSXRlbXMgPSB0b3RhbFNoaWZ0ZWRJdGVtcztcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgIH1cblxuICAgIGNyZWF0ZVN0eWxlKCkge1xuICAgICAgICBpZiAoIXRoaXMuY2Fyb3VzZWxTdHlsZSkge1xuICAgICAgICAgICAgdGhpcy5jYXJvdXNlbFN0eWxlID0gdGhpcy5yZW5kZXJlci5jcmVhdGVFbGVtZW50KCdzdHlsZScpO1xuICAgICAgICAgICAgdGhpcy5jYXJvdXNlbFN0eWxlLnR5cGUgPSAndGV4dC9jc3MnO1xuICAgICAgICAgICAgdGhpcy5yZW5kZXJlci5hcHBlbmRDaGlsZCh0aGlzLmRvY3VtZW50LmhlYWQsIHRoaXMuY2Fyb3VzZWxTdHlsZSk7XG4gICAgICAgIH1cblxuICAgICAgICBsZXQgaW5uZXJIVE1MID0gYFxuICAgICAgICAgICAgIyR7dGhpcy5pZH0gLnAtY2Fyb3VzZWwtaXRlbSB7XG5cdFx0XHRcdGZsZXg6IDEgMCAkezEwMCAvIHRoaXMubnVtVmlzaWJsZX0lXG5cdFx0XHR9XG4gICAgICAgIGA7XG5cbiAgICAgICAgaWYgKHRoaXMucmVzcG9uc2l2ZU9wdGlvbnMpIHtcbiAgICAgICAgICAgIHRoaXMucmVzcG9uc2l2ZU9wdGlvbnMuc29ydCgoZGF0YTEsIGRhdGEyKSA9PiB7XG4gICAgICAgICAgICAgICAgY29uc3QgdmFsdWUxID0gZGF0YTEuYnJlYWtwb2ludDtcbiAgICAgICAgICAgICAgICBjb25zdCB2YWx1ZTIgPSBkYXRhMi5icmVha3BvaW50O1xuICAgICAgICAgICAgICAgIGxldCByZXN1bHQgPSBudWxsO1xuXG4gICAgICAgICAgICAgICAgaWYgKHZhbHVlMSA9PSBudWxsICYmIHZhbHVlMiAhPSBudWxsKSByZXN1bHQgPSAtMTtcbiAgICAgICAgICAgICAgICBlbHNlIGlmICh2YWx1ZTEgIT0gbnVsbCAmJiB2YWx1ZTIgPT0gbnVsbCkgcmVzdWx0ID0gMTtcbiAgICAgICAgICAgICAgICBlbHNlIGlmICh2YWx1ZTEgPT0gbnVsbCAmJiB2YWx1ZTIgPT0gbnVsbCkgcmVzdWx0ID0gMDtcbiAgICAgICAgICAgICAgICBlbHNlIGlmICh0eXBlb2YgdmFsdWUxID09PSAnc3RyaW5nJyAmJiB0eXBlb2YgdmFsdWUyID09PSAnc3RyaW5nJykgcmVzdWx0ID0gdmFsdWUxLmxvY2FsZUNvbXBhcmUodmFsdWUyLCB1bmRlZmluZWQsIHsgbnVtZXJpYzogdHJ1ZSB9KTtcbiAgICAgICAgICAgICAgICBlbHNlIHJlc3VsdCA9IHZhbHVlMSA8IHZhbHVlMiA/IC0xIDogdmFsdWUxID4gdmFsdWUyID8gMSA6IDA7XG5cbiAgICAgICAgICAgICAgICByZXR1cm4gLTEgKiByZXN1bHQ7XG4gICAgICAgICAgICB9KTtcblxuICAgICAgICAgICAgZm9yIChsZXQgaSA9IDA7IGkgPCB0aGlzLnJlc3BvbnNpdmVPcHRpb25zLmxlbmd0aDsgaSsrKSB7XG4gICAgICAgICAgICAgICAgbGV0IHJlcyA9IHRoaXMucmVzcG9uc2l2ZU9wdGlvbnNbaV07XG5cbiAgICAgICAgICAgICAgICBpbm5lckhUTUwgKz0gYFxuICAgICAgICAgICAgICAgICAgICBAbWVkaWEgc2NyZWVuIGFuZCAobWF4LXdpZHRoOiAke3Jlcy5icmVha3BvaW50fSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgIyR7dGhpcy5pZH0gLnAtY2Fyb3VzZWwtaXRlbSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgZmxleDogMSAwICR7MTAwIC8gcmVzLm51bVZpc2libGV9JVxuICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgYDtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuXG4gICAgICAgIHRoaXMuY2Fyb3VzZWxTdHlsZS5pbm5lckhUTUwgPSBpbm5lckhUTUw7XG4gICAgfVxuXG4gICAgY2FsY3VsYXRlUG9zaXRpb24oKSB7XG4gICAgICAgIGlmICh0aGlzLnJlc3BvbnNpdmVPcHRpb25zKSB7XG4gICAgICAgICAgICBsZXQgbWF0Y2hlZFJlc3BvbnNpdmVEYXRhID0ge1xuICAgICAgICAgICAgICAgIG51bVZpc2libGU6IHRoaXMuZGVmYXVsdE51bVZpc2libGUsXG4gICAgICAgICAgICAgICAgbnVtU2Nyb2xsOiB0aGlzLmRlZmF1bHROdW1TY3JvbGxcbiAgICAgICAgICAgIH07XG5cbiAgICAgICAgICAgIGlmICh0eXBlb2Ygd2luZG93ICE9PSAndW5kZWZpbmVkJykge1xuICAgICAgICAgICAgICAgIGxldCB3aW5kb3dXaWR0aCA9IHdpbmRvdy5pbm5lcldpZHRoO1xuICAgICAgICAgICAgICAgIGZvciAobGV0IGkgPSAwOyBpIDwgdGhpcy5yZXNwb25zaXZlT3B0aW9ucy5sZW5ndGg7IGkrKykge1xuICAgICAgICAgICAgICAgICAgICBsZXQgcmVzID0gdGhpcy5yZXNwb25zaXZlT3B0aW9uc1tpXTtcblxuICAgICAgICAgICAgICAgICAgICBpZiAocGFyc2VJbnQocmVzLmJyZWFrcG9pbnQsIDEwKSA+PSB3aW5kb3dXaWR0aCkge1xuICAgICAgICAgICAgICAgICAgICAgICAgbWF0Y2hlZFJlc3BvbnNpdmVEYXRhID0gcmVzO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICBpZiAodGhpcy5fbnVtU2Nyb2xsICE9PSBtYXRjaGVkUmVzcG9uc2l2ZURhdGEubnVtU2Nyb2xsKSB7XG4gICAgICAgICAgICAgICAgbGV0IHBhZ2UgPSB0aGlzLl9wYWdlO1xuICAgICAgICAgICAgICAgIHBhZ2UgPSBNYXRoLmZsb29yKChwYWdlICogdGhpcy5fbnVtU2Nyb2xsKSAvIG1hdGNoZWRSZXNwb25zaXZlRGF0YS5udW1TY3JvbGwpO1xuXG4gICAgICAgICAgICAgICAgbGV0IHRvdGFsU2hpZnRlZEl0ZW1zID0gbWF0Y2hlZFJlc3BvbnNpdmVEYXRhLm51bVNjcm9sbCAqIHRoaXMucGFnZSAqIC0xO1xuXG4gICAgICAgICAgICAgICAgaWYgKHRoaXMuaXNDaXJjdWxhcigpKSB7XG4gICAgICAgICAgICAgICAgICAgIHRvdGFsU2hpZnRlZEl0ZW1zIC09IG1hdGNoZWRSZXNwb25zaXZlRGF0YS5udW1WaXNpYmxlO1xuICAgICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgICAgIHRoaXMudG90YWxTaGlmdGVkSXRlbXMgPSB0b3RhbFNoaWZ0ZWRJdGVtcztcbiAgICAgICAgICAgICAgICB0aGlzLl9udW1TY3JvbGwgPSBtYXRjaGVkUmVzcG9uc2l2ZURhdGEubnVtU2Nyb2xsO1xuXG4gICAgICAgICAgICAgICAgdGhpcy5fcGFnZSA9IHBhZ2U7XG4gICAgICAgICAgICAgICAgdGhpcy5vblBhZ2UuZW1pdCh7XG4gICAgICAgICAgICAgICAgICAgIHBhZ2U6IHRoaXMucGFnZVxuICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICBpZiAodGhpcy5fbnVtVmlzaWJsZSAhPT0gbWF0Y2hlZFJlc3BvbnNpdmVEYXRhLm51bVZpc2libGUpIHtcbiAgICAgICAgICAgICAgICB0aGlzLl9udW1WaXNpYmxlID0gbWF0Y2hlZFJlc3BvbnNpdmVEYXRhLm51bVZpc2libGU7XG4gICAgICAgICAgICAgICAgdGhpcy5zZXRDbG9uZUl0ZW1zKCk7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIHRoaXMuY2QubWFya0ZvckNoZWNrKCk7XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICBzZXRDbG9uZUl0ZW1zKCkge1xuICAgICAgICB0aGlzLmNsb25lZEl0ZW1zRm9yU3RhcnRpbmcgPSBbXTtcbiAgICAgICAgdGhpcy5jbG9uZWRJdGVtc0ZvckZpbmlzaGluZyA9IFtdO1xuICAgICAgICBpZiAodGhpcy5pc0NpcmN1bGFyKCkpIHtcbiAgICAgICAgICAgIHRoaXMuY2xvbmVkSXRlbXNGb3JTdGFydGluZy5wdXNoKC4uLnRoaXMudmFsdWUuc2xpY2UoLTEgKiB0aGlzLl9udW1WaXNpYmxlKSk7XG4gICAgICAgICAgICB0aGlzLmNsb25lZEl0ZW1zRm9yRmluaXNoaW5nLnB1c2goLi4udGhpcy52YWx1ZS5zbGljZSgwLCB0aGlzLl9udW1WaXNpYmxlKSk7XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICBmaXJzdEluZGV4KCkge1xuICAgICAgICByZXR1cm4gdGhpcy5pc0NpcmN1bGFyKCkgPyAtMSAqICh0aGlzLnRvdGFsU2hpZnRlZEl0ZW1zICsgdGhpcy5udW1WaXNpYmxlKSA6IHRoaXMudG90YWxTaGlmdGVkSXRlbXMgKiAtMTtcbiAgICB9XG5cbiAgICBsYXN0SW5kZXgoKSB7XG4gICAgICAgIHJldHVybiB0aGlzLmZpcnN0SW5kZXgoKSArIHRoaXMubnVtVmlzaWJsZSAtIDE7XG4gICAgfVxuXG4gICAgdG90YWxEb3RzKCkge1xuICAgICAgICByZXR1cm4gdGhpcy52YWx1ZSA/IE1hdGguY2VpbCgodGhpcy52YWx1ZS5sZW5ndGggLSB0aGlzLl9udW1WaXNpYmxlKSAvIHRoaXMuX251bVNjcm9sbCkgKyAxIDogMDtcbiAgICB9XG5cbiAgICB0b3RhbERvdHNBcnJheSgpIHtcbiAgICAgICAgY29uc3QgdG90YWxEb3RzID0gdGhpcy50b3RhbERvdHMoKTtcbiAgICAgICAgcmV0dXJuIHRvdGFsRG90cyA8PSAwID8gW10gOiBBcnJheSh0b3RhbERvdHMpLmZpbGwoMCk7XG4gICAgfVxuXG4gICAgaXNWZXJ0aWNhbCgpIHtcbiAgICAgICAgcmV0dXJuIHRoaXMub3JpZW50YXRpb24gPT09ICd2ZXJ0aWNhbCc7XG4gICAgfVxuXG4gICAgaXNDaXJjdWxhcigpIHtcbiAgICAgICAgcmV0dXJuIHRoaXMuY2lyY3VsYXIgJiYgdGhpcy52YWx1ZSAmJiB0aGlzLnZhbHVlLmxlbmd0aCA+PSB0aGlzLm51bVZpc2libGU7XG4gICAgfVxuXG4gICAgaXNBdXRvcGxheSgpIHtcbiAgICAgICAgcmV0dXJuIHRoaXMuYXV0b3BsYXlJbnRlcnZhbCAmJiB0aGlzLmFsbG93QXV0b3BsYXk7XG4gICAgfVxuXG4gICAgaXNGb3J3YXJkTmF2RGlzYWJsZWQoKSB7XG4gICAgICAgIHJldHVybiB0aGlzLmlzRW1wdHkoKSB8fCAodGhpcy5fcGFnZSA+PSB0aGlzLnRvdGFsRG90cygpIC0gMSAmJiAhdGhpcy5pc0NpcmN1bGFyKCkpO1xuICAgIH1cblxuICAgIGlzQmFja3dhcmROYXZEaXNhYmxlZCgpIHtcbiAgICAgICAgcmV0dXJuIHRoaXMuaXNFbXB0eSgpIHx8ICh0aGlzLl9wYWdlIDw9IDAgJiYgIXRoaXMuaXNDaXJjdWxhcigpKTtcbiAgICB9XG5cbiAgICBpc0VtcHR5KCkge1xuICAgICAgICByZXR1cm4gIXRoaXMudmFsdWUgfHwgdGhpcy52YWx1ZS5sZW5ndGggPT09IDA7XG4gICAgfVxuXG4gICAgbmF2Rm9yd2FyZChlLCBpbmRleD8pIHtcbiAgICAgICAgaWYgKHRoaXMuaXNDaXJjdWxhcigpIHx8IHRoaXMuX3BhZ2UgPCB0aGlzLnRvdGFsRG90cygpIC0gMSkge1xuICAgICAgICAgICAgdGhpcy5zdGVwKC0xLCBpbmRleCk7XG4gICAgICAgIH1cblxuICAgICAgICBpZiAodGhpcy5hdXRvcGxheUludGVydmFsKSB7XG4gICAgICAgICAgICB0aGlzLnN0b3BBdXRvcGxheSgpO1xuICAgICAgICAgICAgdGhpcy5hbGxvd0F1dG9wbGF5ID0gZmFsc2U7XG4gICAgICAgIH1cblxuICAgICAgICBpZiAoZSAmJiBlLmNhbmNlbGFibGUpIHtcbiAgICAgICAgICAgIGUucHJldmVudERlZmF1bHQoKTtcbiAgICAgICAgfVxuICAgIH1cblxuICAgIG5hdkJhY2t3YXJkKGUsIGluZGV4Pykge1xuICAgICAgICBpZiAodGhpcy5pc0NpcmN1bGFyKCkgfHwgdGhpcy5fcGFnZSAhPT0gMCkge1xuICAgICAgICAgICAgdGhpcy5zdGVwKDEsIGluZGV4KTtcbiAgICAgICAgfVxuXG4gICAgICAgIGlmICh0aGlzLmF1dG9wbGF5SW50ZXJ2YWwpIHtcbiAgICAgICAgICAgIHRoaXMuc3RvcEF1dG9wbGF5KCk7XG4gICAgICAgICAgICB0aGlzLmFsbG93QXV0b3BsYXkgPSBmYWxzZTtcbiAgICAgICAgfVxuXG4gICAgICAgIGlmIChlICYmIGUuY2FuY2VsYWJsZSkge1xuICAgICAgICAgICAgZS5wcmV2ZW50RGVmYXVsdCgpO1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgb25Eb3RDbGljayhlLCBpbmRleCkge1xuICAgICAgICBsZXQgcGFnZSA9IHRoaXMuX3BhZ2U7XG5cbiAgICAgICAgaWYgKHRoaXMuYXV0b3BsYXlJbnRlcnZhbCkge1xuICAgICAgICAgICAgdGhpcy5zdG9wQXV0b3BsYXkoKTtcbiAgICAgICAgICAgIHRoaXMuYWxsb3dBdXRvcGxheSA9IGZhbHNlO1xuICAgICAgICB9XG5cbiAgICAgICAgaWYgKGluZGV4ID4gcGFnZSkge1xuICAgICAgICAgICAgdGhpcy5uYXZGb3J3YXJkKGUsIGluZGV4KTtcbiAgICAgICAgfSBlbHNlIGlmIChpbmRleCA8IHBhZ2UpIHtcbiAgICAgICAgICAgIHRoaXMubmF2QmFja3dhcmQoZSwgaW5kZXgpO1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgc3RlcChkaXIsIHBhZ2UpIHtcbiAgICAgICAgbGV0IHRvdGFsU2hpZnRlZEl0ZW1zID0gdGhpcy50b3RhbFNoaWZ0ZWRJdGVtcztcbiAgICAgICAgY29uc3QgaXNDaXJjdWxhciA9IHRoaXMuaXNDaXJjdWxhcigpO1xuXG4gICAgICAgIGlmIChwYWdlICE9IG51bGwpIHtcbiAgICAgICAgICAgIHRvdGFsU2hpZnRlZEl0ZW1zID0gdGhpcy5fbnVtU2Nyb2xsICogcGFnZSAqIC0xO1xuXG4gICAgICAgICAgICBpZiAoaXNDaXJjdWxhcikge1xuICAgICAgICAgICAgICAgIHRvdGFsU2hpZnRlZEl0ZW1zIC09IHRoaXMuX251bVZpc2libGU7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIHRoaXMuaXNSZW1haW5pbmdJdGVtc0FkZGVkID0gZmFsc2U7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICB0b3RhbFNoaWZ0ZWRJdGVtcyArPSB0aGlzLl9udW1TY3JvbGwgKiBkaXI7XG4gICAgICAgICAgICBpZiAodGhpcy5pc1JlbWFpbmluZ0l0ZW1zQWRkZWQpIHtcbiAgICAgICAgICAgICAgICB0b3RhbFNoaWZ0ZWRJdGVtcyArPSB0aGlzLnJlbWFpbmluZ0l0ZW1zIC0gdGhpcy5fbnVtU2Nyb2xsICogZGlyO1xuICAgICAgICAgICAgICAgIHRoaXMuaXNSZW1haW5pbmdJdGVtc0FkZGVkID0gZmFsc2U7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIGxldCBvcmlnaW5hbFNoaWZ0ZWRJdGVtcyA9IGlzQ2lyY3VsYXIgPyB0b3RhbFNoaWZ0ZWRJdGVtcyArIHRoaXMuX251bVZpc2libGUgOiB0b3RhbFNoaWZ0ZWRJdGVtcztcbiAgICAgICAgICAgIHBhZ2UgPSBNYXRoLmFicyhNYXRoLmZsb29yKG9yaWdpbmFsU2hpZnRlZEl0ZW1zIC8gdGhpcy5fbnVtU2Nyb2xsKSk7XG4gICAgICAgIH1cblxuICAgICAgICBpZiAoaXNDaXJjdWxhciAmJiB0aGlzLnBhZ2UgPT09IHRoaXMudG90YWxEb3RzKCkgLSAxICYmIGRpciA9PT0gLTEpIHtcbiAgICAgICAgICAgIHRvdGFsU2hpZnRlZEl0ZW1zID0gLTEgKiAodGhpcy52YWx1ZS5sZW5ndGggKyB0aGlzLl9udW1WaXNpYmxlKTtcbiAgICAgICAgICAgIHBhZ2UgPSAwO1xuICAgICAgICB9IGVsc2UgaWYgKGlzQ2lyY3VsYXIgJiYgdGhpcy5wYWdlID09PSAwICYmIGRpciA9PT0gMSkge1xuICAgICAgICAgICAgdG90YWxTaGlmdGVkSXRlbXMgPSAwO1xuICAgICAgICAgICAgcGFnZSA9IHRoaXMudG90YWxEb3RzKCkgLSAxO1xuICAgICAgICB9IGVsc2UgaWYgKHBhZ2UgPT09IHRoaXMudG90YWxEb3RzKCkgLSAxICYmIHRoaXMucmVtYWluaW5nSXRlbXMgPiAwKSB7XG4gICAgICAgICAgICB0b3RhbFNoaWZ0ZWRJdGVtcyArPSB0aGlzLnJlbWFpbmluZ0l0ZW1zICogLTEgLSB0aGlzLl9udW1TY3JvbGwgKiBkaXI7XG4gICAgICAgICAgICB0aGlzLmlzUmVtYWluaW5nSXRlbXNBZGRlZCA9IHRydWU7XG4gICAgICAgIH1cblxuICAgICAgICBpZiAodGhpcy5pdGVtc0NvbnRhaW5lcikge1xuICAgICAgICAgICAgdGhpcy5pdGVtc0NvbnRhaW5lci5uYXRpdmVFbGVtZW50LnN0eWxlLnRyYW5zZm9ybSA9IHRoaXMuaXNWZXJ0aWNhbCgpID8gYHRyYW5zbGF0ZTNkKDAsICR7dG90YWxTaGlmdGVkSXRlbXMgKiAoMTAwIC8gdGhpcy5fbnVtVmlzaWJsZSl9JSwgMClgIDogYHRyYW5zbGF0ZTNkKCR7dG90YWxTaGlmdGVkSXRlbXMgKiAoMTAwIC8gdGhpcy5fbnVtVmlzaWJsZSl9JSwgMCwgMClgO1xuICAgICAgICAgICAgdGhpcy5pdGVtc0NvbnRhaW5lci5uYXRpdmVFbGVtZW50LnN0eWxlLnRyYW5zaXRpb24gPSAndHJhbnNmb3JtIDUwMG1zIGVhc2UgMHMnO1xuICAgICAgICB9XG5cbiAgICAgICAgdGhpcy50b3RhbFNoaWZ0ZWRJdGVtcyA9IHRvdGFsU2hpZnRlZEl0ZW1zO1xuICAgICAgICB0aGlzLl9wYWdlID0gcGFnZTtcbiAgICAgICAgdGhpcy5vblBhZ2UuZW1pdCh7XG4gICAgICAgICAgICBwYWdlOiB0aGlzLnBhZ2VcbiAgICAgICAgfSk7XG4gICAgfVxuXG4gICAgc3RhcnRBdXRvcGxheSgpIHtcbiAgICAgICAgdGhpcy5pbnRlcnZhbCA9IHNldEludGVydmFsKCgpID0+IHtcbiAgICAgICAgICAgIGlmICh0aGlzLnRvdGFsRG90cygpID4gMCkge1xuICAgICAgICAgICAgICAgIGlmICh0aGlzLnBhZ2UgPT09IHRoaXMudG90YWxEb3RzKCkgLSAxKSB7XG4gICAgICAgICAgICAgICAgICAgIHRoaXMuc3RlcCgtMSwgMCk7XG4gICAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5zdGVwKC0xLCB0aGlzLnBhZ2UgKyAxKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgIH0sIHRoaXMuYXV0b3BsYXlJbnRlcnZhbCk7XG4gICAgfVxuXG4gICAgc3RvcEF1dG9wbGF5KCkge1xuICAgICAgICBpZiAodGhpcy5pbnRlcnZhbCkge1xuICAgICAgICAgICAgY2xlYXJJbnRlcnZhbCh0aGlzLmludGVydmFsKTtcbiAgICAgICAgfVxuICAgIH1cblxuICAgIG9uVHJhbnNpdGlvbkVuZCgpIHtcbiAgICAgICAgaWYgKHRoaXMuaXRlbXNDb250YWluZXIpIHtcbiAgICAgICAgICAgIHRoaXMuaXRlbXNDb250YWluZXIubmF0aXZlRWxlbWVudC5zdHlsZS50cmFuc2l0aW9uID0gJyc7XG5cbiAgICAgICAgICAgIGlmICgodGhpcy5wYWdlID09PSAwIHx8IHRoaXMucGFnZSA9PT0gdGhpcy50b3RhbERvdHMoKSAtIDEpICYmIHRoaXMuaXNDaXJjdWxhcigpKSB7XG4gICAgICAgICAgICAgICAgdGhpcy5pdGVtc0NvbnRhaW5lci5uYXRpdmVFbGVtZW50LnN0eWxlLnRyYW5zZm9ybSA9IHRoaXMuaXNWZXJ0aWNhbCgpID8gYHRyYW5zbGF0ZTNkKDAsICR7dGhpcy50b3RhbFNoaWZ0ZWRJdGVtcyAqICgxMDAgLyB0aGlzLl9udW1WaXNpYmxlKX0lLCAwKWAgOiBgdHJhbnNsYXRlM2QoJHt0aGlzLnRvdGFsU2hpZnRlZEl0ZW1zICogKDEwMCAvIHRoaXMuX251bVZpc2libGUpfSUsIDAsIDApYDtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgIH1cblxuICAgIG9uVG91Y2hTdGFydChlKSB7XG4gICAgICAgIGxldCB0b3VjaG9iaiA9IGUuY2hhbmdlZFRvdWNoZXNbMF07XG5cbiAgICAgICAgdGhpcy5zdGFydFBvcyA9IHtcbiAgICAgICAgICAgIHg6IHRvdWNob2JqLnBhZ2VYLFxuICAgICAgICAgICAgeTogdG91Y2hvYmoucGFnZVlcbiAgICAgICAgfTtcbiAgICB9XG5cbiAgICBvblRvdWNoTW92ZShlKSB7XG4gICAgICAgIGlmIChlLmNhbmNlbGFibGUpIHtcbiAgICAgICAgICAgIGUucHJldmVudERlZmF1bHQoKTtcbiAgICAgICAgfVxuICAgIH1cbiAgICBvblRvdWNoRW5kKGUpIHtcbiAgICAgICAgbGV0IHRvdWNob2JqID0gZS5jaGFuZ2VkVG91Y2hlc1swXTtcblxuICAgICAgICBpZiAodGhpcy5pc1ZlcnRpY2FsKCkpIHtcbiAgICAgICAgICAgIHRoaXMuY2hhbmdlUGFnZU9uVG91Y2goZSwgdG91Y2hvYmoucGFnZVkgLSB0aGlzLnN0YXJ0UG9zLnkpO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgdGhpcy5jaGFuZ2VQYWdlT25Ub3VjaChlLCB0b3VjaG9iai5wYWdlWCAtIHRoaXMuc3RhcnRQb3MueCk7XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICBjaGFuZ2VQYWdlT25Ub3VjaChlLCBkaWZmKSB7XG4gICAgICAgIGlmIChNYXRoLmFicyhkaWZmKSA+IHRoaXMuc3dpcGVUaHJlc2hvbGQpIHtcbiAgICAgICAgICAgIGlmIChkaWZmIDwgMCkge1xuICAgICAgICAgICAgICAgIHRoaXMubmF2Rm9yd2FyZChlKTtcbiAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgdGhpcy5uYXZCYWNrd2FyZChlKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgIH1cblxuICAgIGJpbmREb2N1bWVudExpc3RlbmVycygpIHtcbiAgICAgICAgaWYgKCF0aGlzLmRvY3VtZW50UmVzaXplTGlzdGVuZXIgJiYgdHlwZW9mIHdpbmRvdyAhPT0gJ3VuZGVmaW5lZCcpIHtcbiAgICAgICAgICAgIHRoaXMuZG9jdW1lbnRSZXNpemVMaXN0ZW5lciA9IChlKSA9PiB7XG4gICAgICAgICAgICAgICAgdGhpcy5jYWxjdWxhdGVQb3NpdGlvbigpO1xuICAgICAgICAgICAgfTtcblxuICAgICAgICAgICAgd2luZG93LmFkZEV2ZW50TGlzdGVuZXIoJ3Jlc2l6ZScsIHRoaXMuZG9jdW1lbnRSZXNpemVMaXN0ZW5lcik7XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICB1bmJpbmREb2N1bWVudExpc3RlbmVycygpIHtcbiAgICAgICAgaWYgKHRoaXMuZG9jdW1lbnRSZXNpemVMaXN0ZW5lciAmJiB0eXBlb2Ygd2luZG93ICE9PSAndW5kZWZpbmVkJykge1xuICAgICAgICAgICAgd2luZG93LnJlbW92ZUV2ZW50TGlzdGVuZXIoJ3Jlc2l6ZScsIHRoaXMuZG9jdW1lbnRSZXNpemVMaXN0ZW5lcik7XG4gICAgICAgICAgICB0aGlzLmRvY3VtZW50UmVzaXplTGlzdGVuZXIgPSBudWxsO1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgbmdPbkRlc3Ryb3koKSB7XG4gICAgICAgIGlmICh0aGlzLnJlc3BvbnNpdmVPcHRpb25zKSB7XG4gICAgICAgICAgICB0aGlzLnVuYmluZERvY3VtZW50TGlzdGVuZXJzKCk7XG4gICAgICAgIH1cbiAgICAgICAgaWYgKHRoaXMuYXV0b3BsYXlJbnRlcnZhbCkge1xuICAgICAgICAgICAgdGhpcy5zdG9wQXV0b3BsYXkoKTtcbiAgICAgICAgfVxuICAgIH1cbn1cblxuQE5nTW9kdWxlKHtcbiAgICBpbXBvcnRzOiBbQ29tbW9uTW9kdWxlLCBTaGFyZWRNb2R1bGUsIFJpcHBsZU1vZHVsZV0sXG4gICAgZXhwb3J0czogW0NvbW1vbk1vZHVsZSwgQ2Fyb3VzZWwsIFNoYXJlZE1vZHVsZV0sXG4gICAgZGVjbGFyYXRpb25zOiBbQ2Fyb3VzZWxdXG59KVxuZXhwb3J0IGNsYXNzIENhcm91c2VsTW9kdWxlIHt9XG4iXX0=
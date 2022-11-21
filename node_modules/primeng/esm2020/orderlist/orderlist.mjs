import { NgModule, Component, Input, Output, ContentChildren, EventEmitter, ViewChild, ChangeDetectionStrategy, ViewEncapsulation } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ButtonModule } from 'primeng/button';
import { SharedModule, PrimeTemplate } from 'primeng/api';
import { DomHandler } from 'primeng/dom';
import { ObjectUtils, UniqueComponentId } from 'primeng/utils';
import { RippleModule } from 'primeng/ripple';
import { DragDropModule, moveItemInArray } from '@angular/cdk/drag-drop';
import * as i0 from "@angular/core";
import * as i1 from "primeng/api";
import * as i2 from "@angular/common";
import * as i3 from "primeng/button";
import * as i4 from "primeng/ripple";
import * as i5 from "@angular/cdk/drag-drop";
export class OrderList {
    constructor(el, cd, filterService) {
        this.el = el;
        this.cd = cd;
        this.filterService = filterService;
        this.metaKeySelection = true;
        this.dragdrop = false;
        this.controlsPosition = 'left';
        this.filterMatchMode = 'contains';
        this.breakpoint = '960px';
        this.disabled = false;
        this.selectionChange = new EventEmitter();
        this.trackBy = (index, item) => item;
        this.onReorder = new EventEmitter();
        this.onSelectionChange = new EventEmitter();
        this.onFilterEvent = new EventEmitter();
        this._selection = [];
        this.id = UniqueComponentId();
    }
    get selection() {
        return this._selection;
    }
    set selection(val) {
        this._selection = val;
    }
    ngOnInit() {
        if (this.responsive) {
            this.createStyle();
        }
        if (this.filterBy) {
            this.filterOptions = {
                filter: (value) => this.onFilterKeyup(value),
                reset: () => this.resetFilter()
            };
        }
    }
    ngAfterContentInit() {
        this.templates.forEach((item) => {
            switch (item.getType()) {
                case 'item':
                    this.itemTemplate = item.template;
                    break;
                case 'empty':
                    this.emptyMessageTemplate = item.template;
                    break;
                case 'emptyfilter':
                    this.emptyFilterMessageTemplate = item.template;
                    break;
                case 'filter':
                    this.filterTemplate = item.template;
                    break;
                case 'header':
                    this.headerTemplate = item.template;
                    break;
                default:
                    this.itemTemplate = item.template;
                    break;
            }
        });
    }
    ngAfterViewChecked() {
        if (this.movedUp || this.movedDown) {
            let listItems = DomHandler.find(this.listViewChild.nativeElement, 'li.p-highlight');
            let listItem;
            if (listItems.length > 0) {
                if (this.movedUp)
                    listItem = listItems[0];
                else
                    listItem = listItems[listItems.length - 1];
                DomHandler.scrollInView(this.listViewChild.nativeElement, listItem);
            }
            this.movedUp = false;
            this.movedDown = false;
        }
    }
    get value() {
        return this._value;
    }
    set value(val) {
        this._value = val;
        if (this.filterValue) {
            this.filter();
        }
    }
    onItemClick(event, item, index) {
        this.itemTouched = false;
        let selectedIndex = ObjectUtils.findIndexInList(item, this.selection);
        let selected = selectedIndex != -1;
        let metaSelection = this.itemTouched ? false : this.metaKeySelection;
        if (metaSelection) {
            let metaKey = event.metaKey || event.ctrlKey || event.shiftKey;
            if (selected && metaKey) {
                this._selection = this._selection.filter((val, index) => index !== selectedIndex);
            }
            else {
                this._selection = metaKey ? (this._selection ? [...this._selection] : []) : [];
                ObjectUtils.insertIntoOrderedArray(item, index, this._selection, this.value);
            }
        }
        else {
            if (selected) {
                this._selection = this._selection.filter((val, index) => index !== selectedIndex);
            }
            else {
                this._selection = this._selection ? [...this._selection] : [];
                ObjectUtils.insertIntoOrderedArray(item, index, this._selection, this.value);
            }
        }
        //binding
        this.selectionChange.emit(this._selection);
        //event
        this.onSelectionChange.emit({ originalEvent: event, value: this._selection });
    }
    onFilterKeyup(event) {
        this.filterValue = event.target.value.trim().toLocaleLowerCase(this.filterLocale);
        this.filter();
        this.onFilterEvent.emit({
            originalEvent: event,
            value: this.visibleOptions
        });
    }
    filter() {
        let searchFields = this.filterBy.split(',');
        this.visibleOptions = this.filterService.filter(this.value, searchFields, this.filterValue, this.filterMatchMode, this.filterLocale);
    }
    resetFilter() {
        this.filterValue = null;
        this.filterViewChild && (this.filterViewChild.nativeElement.value = '');
    }
    isItemVisible(item) {
        if (this.filterValue && this.filterValue.trim().length) {
            for (let i = 0; i < this.visibleOptions.length; i++) {
                if (item == this.visibleOptions[i]) {
                    return true;
                }
            }
        }
        else {
            return true;
        }
    }
    onItemTouchEnd() {
        this.itemTouched = true;
    }
    isSelected(item) {
        return ObjectUtils.findIndexInList(item, this.selection) != -1;
    }
    isEmpty() {
        return this.filterValue ? !this.visibleOptions || this.visibleOptions.length === 0 : !this.value || this.value.length === 0;
    }
    moveUp() {
        if (this.selection) {
            for (let i = 0; i < this.selection.length; i++) {
                let selectedItem = this.selection[i];
                let selectedItemIndex = ObjectUtils.findIndexInList(selectedItem, this.value);
                if (selectedItemIndex != 0) {
                    let movedItem = this.value[selectedItemIndex];
                    let temp = this.value[selectedItemIndex - 1];
                    this.value[selectedItemIndex - 1] = movedItem;
                    this.value[selectedItemIndex] = temp;
                }
                else {
                    break;
                }
            }
            if (this.dragdrop && this.filterValue)
                this.filter();
            this.movedUp = true;
            this.onReorder.emit(this.selection);
        }
    }
    moveTop() {
        if (this.selection) {
            for (let i = this.selection.length - 1; i >= 0; i--) {
                let selectedItem = this.selection[i];
                let selectedItemIndex = ObjectUtils.findIndexInList(selectedItem, this.value);
                if (selectedItemIndex != 0) {
                    let movedItem = this.value.splice(selectedItemIndex, 1)[0];
                    this.value.unshift(movedItem);
                }
                else {
                    break;
                }
            }
            if (this.dragdrop && this.filterValue)
                this.filter();
            this.onReorder.emit(this.selection);
            this.listViewChild.nativeElement.scrollTop = 0;
        }
    }
    moveDown() {
        if (this.selection) {
            for (let i = this.selection.length - 1; i >= 0; i--) {
                let selectedItem = this.selection[i];
                let selectedItemIndex = ObjectUtils.findIndexInList(selectedItem, this.value);
                if (selectedItemIndex != this.value.length - 1) {
                    let movedItem = this.value[selectedItemIndex];
                    let temp = this.value[selectedItemIndex + 1];
                    this.value[selectedItemIndex + 1] = movedItem;
                    this.value[selectedItemIndex] = temp;
                }
                else {
                    break;
                }
            }
            if (this.dragdrop && this.filterValue)
                this.filter();
            this.movedDown = true;
            this.onReorder.emit(this.selection);
        }
    }
    moveBottom() {
        if (this.selection) {
            for (let i = 0; i < this.selection.length; i++) {
                let selectedItem = this.selection[i];
                let selectedItemIndex = ObjectUtils.findIndexInList(selectedItem, this.value);
                if (selectedItemIndex != this.value.length - 1) {
                    let movedItem = this.value.splice(selectedItemIndex, 1)[0];
                    this.value.push(movedItem);
                }
                else {
                    break;
                }
            }
            if (this.dragdrop && this.filterValue)
                this.filter();
            this.onReorder.emit(this.selection);
            this.listViewChild.nativeElement.scrollTop = this.listViewChild.nativeElement.scrollHeight;
        }
    }
    onDrop(event) {
        let previousIndex = event.previousIndex;
        let currentIndex = event.currentIndex;
        if (previousIndex !== currentIndex) {
            if (this.visibleOptions) {
                if (this.filterValue) {
                    previousIndex = ObjectUtils.findIndexInList(event.item.data, this.value);
                    currentIndex = ObjectUtils.findIndexInList(this.visibleOptions[currentIndex], this.value);
                }
                moveItemInArray(this.visibleOptions, event.previousIndex, event.currentIndex);
            }
            moveItemInArray(this.value, previousIndex, currentIndex);
            this.onReorder.emit([event.item.data]);
        }
    }
    onItemKeydown(event, item, index) {
        let listItem = event.currentTarget;
        switch (event.which) {
            //down
            case 40:
                var nextItem = this.findNextItem(listItem);
                if (nextItem) {
                    nextItem.focus();
                }
                event.preventDefault();
                break;
            //up
            case 38:
                var prevItem = this.findPrevItem(listItem);
                if (prevItem) {
                    prevItem.focus();
                }
                event.preventDefault();
                break;
            //enter
            case 13:
                this.onItemClick(event, item, index);
                event.preventDefault();
                break;
        }
    }
    findNextItem(item) {
        let nextItem = item.nextElementSibling;
        if (nextItem)
            return !DomHandler.hasClass(nextItem, 'p-orderlist-item') || DomHandler.isHidden(nextItem) ? this.findNextItem(nextItem) : nextItem;
        else
            return null;
    }
    findPrevItem(item) {
        let prevItem = item.previousElementSibling;
        if (prevItem)
            return !DomHandler.hasClass(prevItem, 'p-orderlist-item') || DomHandler.isHidden(prevItem) ? this.findPrevItem(prevItem) : prevItem;
        else
            return null;
    }
    moveDisabled() {
        if (this.disabled || !this.selection.length) {
            return true;
        }
    }
    createStyle() {
        if (!this.styleElement) {
            this.el.nativeElement.children[0].setAttribute(this.id, '');
            this.styleElement = document.createElement('style');
            this.styleElement.type = 'text/css';
            document.head.appendChild(this.styleElement);
            let innerHTML = `
                @media screen and (max-width: ${this.breakpoint}) {
                    .p-orderlist[${this.id}] {
                        flex-direction: column;
                    }

                    .p-orderlist[${this.id}] .p-orderlist-controls {
                        padding: var(--content-padding);
                        flex-direction: row;
                    }

                    .p-orderlist[${this.id}] .p-orderlist-controls .p-button {
                        margin-right: var(--inline-spacing);
                        margin-bottom: 0;
                    }

                    .p-orderlist[${this.id}] .p-orderlist-controls .p-button:last-child {
                        margin-right: 0;
                    }
                }
            `;
            this.styleElement.innerHTML = innerHTML;
        }
    }
    destroyStyle() {
        if (this.styleElement) {
            document.head.removeChild(this.styleElement);
            this.styleElement = null;
            ``;
        }
    }
    ngOnDestroy() {
        this.destroyStyle();
    }
}
OrderList.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "14.0.7", ngImport: i0, type: OrderList, deps: [{ token: i0.ElementRef }, { token: i0.ChangeDetectorRef }, { token: i1.FilterService }], target: i0.ɵɵFactoryTarget.Component });
OrderList.ɵcmp = i0.ɵɵngDeclareComponent({ minVersion: "14.0.0", version: "14.0.7", type: OrderList, selector: "p-orderList", inputs: { header: "header", style: "style", styleClass: "styleClass", listStyle: "listStyle", responsive: "responsive", filterBy: "filterBy", filterPlaceholder: "filterPlaceholder", filterLocale: "filterLocale", metaKeySelection: "metaKeySelection", dragdrop: "dragdrop", controlsPosition: "controlsPosition", ariaFilterLabel: "ariaFilterLabel", filterMatchMode: "filterMatchMode", breakpoint: "breakpoint", stripedRows: "stripedRows", disabled: "disabled", trackBy: "trackBy", selection: "selection", value: "value" }, outputs: { selectionChange: "selectionChange", onReorder: "onReorder", onSelectionChange: "onSelectionChange", onFilterEvent: "onFilterEvent" }, host: { classAttribute: "p-element" }, queries: [{ propertyName: "templates", predicate: PrimeTemplate }], viewQueries: [{ propertyName: "listViewChild", first: true, predicate: ["listelement"], descendants: true }, { propertyName: "filterViewChild", first: true, predicate: ["filter"], descendants: true }], ngImport: i0, template: `
        <div
            [ngClass]="{ 'p-orderlist p-component': true, 'p-orderlist-striped': stripedRows, 'p-orderlist-controls-left': controlsPosition === 'left', 'p-orderlist-controls-right': controlsPosition === 'right' }"
            [ngStyle]="style"
            [class]="styleClass"
        >
            <div class="p-orderlist-controls">
                <button type="button" [disabled]="moveDisabled()" pButton pRipple icon="pi pi-angle-up" (click)="moveUp()"></button>
                <button type="button" [disabled]="moveDisabled()" pButton pRipple icon="pi pi-angle-double-up" (click)="moveTop()"></button>
                <button type="button" [disabled]="moveDisabled()" pButton pRipple icon="pi pi-angle-down" (click)="moveDown()"></button>
                <button type="button" [disabled]="moveDisabled()" pButton pRipple icon="pi pi-angle-double-down" (click)="moveBottom()"></button>
            </div>
            <div class="p-orderlist-list-container">
                <div class="p-orderlist-header" *ngIf="header || headerTemplate">
                    <div class="p-orderlist-title" *ngIf="!headerTemplate">{{ header }}</div>
                    <ng-container *ngTemplateOutlet="headerTemplate"></ng-container>
                </div>
                <div class="p-orderlist-filter-container" *ngIf="filterBy">
                    <ng-container *ngIf="filterTemplate; else builtInFilterElement">
                        <ng-container *ngTemplateOutlet="filterTemplate; context: { options: filterOptions }"></ng-container>
                    </ng-container>
                    <ng-template #builtInFilterElement>
                        <div class="p-orderlist-filter">
                            <input
                                #filter
                                type="text"
                                role="textbox"
                                (keyup)="onFilterKeyup($event)"
                                [disabled]="disabled"
                                class="p-orderlist-filter-input p-inputtext p-component"
                                [attr.placeholder]="filterPlaceholder"
                                [attr.aria-label]="ariaFilterLabel"
                            />
                            <span class="p-orderlist-filter-icon pi pi-search"></span>
                        </div>
                    </ng-template>
                </div>
                <ul #listelement cdkDropList (cdkDropListDropped)="onDrop($event)" class="p-orderlist-list" [ngStyle]="listStyle">
                    <ng-template ngFor [ngForTrackBy]="trackBy" let-item [ngForOf]="value" let-i="index" let-l="last">
                        <li
                            class="p-orderlist-item"
                            tabindex="0"
                            [ngClass]="{ 'p-highlight': isSelected(item), 'p-disabled': disabled }"
                            cdkDrag
                            pRipple
                            [cdkDragData]="item"
                            [cdkDragDisabled]="!dragdrop"
                            (click)="onItemClick($event, item, i)"
                            (touchend)="onItemTouchEnd()"
                            (keydown)="onItemKeydown($event, item, i)"
                            *ngIf="isItemVisible(item)"
                            role="option"
                            [attr.aria-selected]="isSelected(item)"
                        >
                            <ng-container *ngTemplateOutlet="itemTemplate; context: { $implicit: item, index: i }"></ng-container>
                        </li>
                    </ng-template>
                    <ng-container *ngIf="isEmpty() && (emptyMessageTemplate || emptyFilterMessageTemplate)">
                        <li *ngIf="!filterValue || !emptyFilterMessageTemplate" class="p-orderlist-empty-message">
                            <ng-container *ngTemplateOutlet="emptyMessageTemplate"></ng-container>
                        </li>
                        <li *ngIf="filterValue" class="p-orderlist-empty-message">
                            <ng-container *ngTemplateOutlet="emptyFilterMessageTemplate"></ng-container>
                        </li>
                    </ng-container>
                </ul>
            </div>
        </div>
    `, isInline: true, styles: [".p-orderlist{display:flex}.p-orderlist-controls{display:flex;flex-direction:column;justify-content:center}.p-orderlist-list-container{flex:1 1 auto}.p-orderlist-list{list-style-type:none;margin:0;padding:0;overflow:auto;min-height:12rem}.p-orderlist-item{display:block;cursor:pointer;overflow:hidden;position:relative}.p-orderlist-item:not(.cdk-drag-disabled){cursor:move}.p-orderlist-item.cdk-drag-placeholder{opacity:0}.p-orderlist-item.cdk-drag-animating{transition:transform .25s cubic-bezier(0,0,.2,1)}.p-orderlist.p-state-disabled .p-orderlist-item,.p-orderlist.p-state-disabled .p-button{cursor:default}.p-orderlist.p-state-disabled .p-orderlist-list{overflow:hidden}.p-orderlist-filter{position:relative}.p-orderlist-filter-icon{position:absolute;top:50%;margin-top:-.5rem;cursor:pointer}.p-orderlist-filter-input{width:100%}.p-orderlist-controls-right .p-orderlist-controls{order:2}.p-orderlist-controls-right .p-orderlist-list-container{order:1}.p-orderlist-list.cdk-drop-list-dragging .p-orderlist-item:not(.cdk-drag-placeholder){transition:transform .25s cubic-bezier(0,0,.2,1)}\n"], dependencies: [{ kind: "directive", type: i2.NgClass, selector: "[ngClass]", inputs: ["class", "ngClass"] }, { kind: "directive", type: i2.NgForOf, selector: "[ngFor][ngForOf]", inputs: ["ngForOf", "ngForTrackBy", "ngForTemplate"] }, { kind: "directive", type: i2.NgIf, selector: "[ngIf]", inputs: ["ngIf", "ngIfThen", "ngIfElse"] }, { kind: "directive", type: i2.NgTemplateOutlet, selector: "[ngTemplateOutlet]", inputs: ["ngTemplateOutletContext", "ngTemplateOutlet", "ngTemplateOutletInjector"] }, { kind: "directive", type: i2.NgStyle, selector: "[ngStyle]", inputs: ["ngStyle"] }, { kind: "directive", type: i3.ButtonDirective, selector: "[pButton]", inputs: ["iconPos", "loadingIcon", "label", "icon", "loading"] }, { kind: "directive", type: i4.Ripple, selector: "[pRipple]" }, { kind: "directive", type: i5.CdkDropList, selector: "[cdkDropList], cdk-drop-list", inputs: ["cdkDropListConnectedTo", "cdkDropListData", "cdkDropListOrientation", "id", "cdkDropListLockAxis", "cdkDropListDisabled", "cdkDropListSortingDisabled", "cdkDropListEnterPredicate", "cdkDropListSortPredicate", "cdkDropListAutoScrollDisabled", "cdkDropListAutoScrollStep"], outputs: ["cdkDropListDropped", "cdkDropListEntered", "cdkDropListExited", "cdkDropListSorted"], exportAs: ["cdkDropList"] }, { kind: "directive", type: i5.CdkDrag, selector: "[cdkDrag]", inputs: ["cdkDragData", "cdkDragLockAxis", "cdkDragRootElement", "cdkDragBoundary", "cdkDragStartDelay", "cdkDragFreeDragPosition", "cdkDragDisabled", "cdkDragConstrainPosition", "cdkDragPreviewClass", "cdkDragPreviewContainer"], outputs: ["cdkDragStarted", "cdkDragReleased", "cdkDragEnded", "cdkDragEntered", "cdkDragExited", "cdkDragDropped", "cdkDragMoved"], exportAs: ["cdkDrag"] }], changeDetection: i0.ChangeDetectionStrategy.OnPush, encapsulation: i0.ViewEncapsulation.None });
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "14.0.7", ngImport: i0, type: OrderList, decorators: [{
            type: Component,
            args: [{ selector: 'p-orderList', template: `
        <div
            [ngClass]="{ 'p-orderlist p-component': true, 'p-orderlist-striped': stripedRows, 'p-orderlist-controls-left': controlsPosition === 'left', 'p-orderlist-controls-right': controlsPosition === 'right' }"
            [ngStyle]="style"
            [class]="styleClass"
        >
            <div class="p-orderlist-controls">
                <button type="button" [disabled]="moveDisabled()" pButton pRipple icon="pi pi-angle-up" (click)="moveUp()"></button>
                <button type="button" [disabled]="moveDisabled()" pButton pRipple icon="pi pi-angle-double-up" (click)="moveTop()"></button>
                <button type="button" [disabled]="moveDisabled()" pButton pRipple icon="pi pi-angle-down" (click)="moveDown()"></button>
                <button type="button" [disabled]="moveDisabled()" pButton pRipple icon="pi pi-angle-double-down" (click)="moveBottom()"></button>
            </div>
            <div class="p-orderlist-list-container">
                <div class="p-orderlist-header" *ngIf="header || headerTemplate">
                    <div class="p-orderlist-title" *ngIf="!headerTemplate">{{ header }}</div>
                    <ng-container *ngTemplateOutlet="headerTemplate"></ng-container>
                </div>
                <div class="p-orderlist-filter-container" *ngIf="filterBy">
                    <ng-container *ngIf="filterTemplate; else builtInFilterElement">
                        <ng-container *ngTemplateOutlet="filterTemplate; context: { options: filterOptions }"></ng-container>
                    </ng-container>
                    <ng-template #builtInFilterElement>
                        <div class="p-orderlist-filter">
                            <input
                                #filter
                                type="text"
                                role="textbox"
                                (keyup)="onFilterKeyup($event)"
                                [disabled]="disabled"
                                class="p-orderlist-filter-input p-inputtext p-component"
                                [attr.placeholder]="filterPlaceholder"
                                [attr.aria-label]="ariaFilterLabel"
                            />
                            <span class="p-orderlist-filter-icon pi pi-search"></span>
                        </div>
                    </ng-template>
                </div>
                <ul #listelement cdkDropList (cdkDropListDropped)="onDrop($event)" class="p-orderlist-list" [ngStyle]="listStyle">
                    <ng-template ngFor [ngForTrackBy]="trackBy" let-item [ngForOf]="value" let-i="index" let-l="last">
                        <li
                            class="p-orderlist-item"
                            tabindex="0"
                            [ngClass]="{ 'p-highlight': isSelected(item), 'p-disabled': disabled }"
                            cdkDrag
                            pRipple
                            [cdkDragData]="item"
                            [cdkDragDisabled]="!dragdrop"
                            (click)="onItemClick($event, item, i)"
                            (touchend)="onItemTouchEnd()"
                            (keydown)="onItemKeydown($event, item, i)"
                            *ngIf="isItemVisible(item)"
                            role="option"
                            [attr.aria-selected]="isSelected(item)"
                        >
                            <ng-container *ngTemplateOutlet="itemTemplate; context: { $implicit: item, index: i }"></ng-container>
                        </li>
                    </ng-template>
                    <ng-container *ngIf="isEmpty() && (emptyMessageTemplate || emptyFilterMessageTemplate)">
                        <li *ngIf="!filterValue || !emptyFilterMessageTemplate" class="p-orderlist-empty-message">
                            <ng-container *ngTemplateOutlet="emptyMessageTemplate"></ng-container>
                        </li>
                        <li *ngIf="filterValue" class="p-orderlist-empty-message">
                            <ng-container *ngTemplateOutlet="emptyFilterMessageTemplate"></ng-container>
                        </li>
                    </ng-container>
                </ul>
            </div>
        </div>
    `, changeDetection: ChangeDetectionStrategy.OnPush, encapsulation: ViewEncapsulation.None, host: {
                        class: 'p-element'
                    }, styles: [".p-orderlist{display:flex}.p-orderlist-controls{display:flex;flex-direction:column;justify-content:center}.p-orderlist-list-container{flex:1 1 auto}.p-orderlist-list{list-style-type:none;margin:0;padding:0;overflow:auto;min-height:12rem}.p-orderlist-item{display:block;cursor:pointer;overflow:hidden;position:relative}.p-orderlist-item:not(.cdk-drag-disabled){cursor:move}.p-orderlist-item.cdk-drag-placeholder{opacity:0}.p-orderlist-item.cdk-drag-animating{transition:transform .25s cubic-bezier(0,0,.2,1)}.p-orderlist.p-state-disabled .p-orderlist-item,.p-orderlist.p-state-disabled .p-button{cursor:default}.p-orderlist.p-state-disabled .p-orderlist-list{overflow:hidden}.p-orderlist-filter{position:relative}.p-orderlist-filter-icon{position:absolute;top:50%;margin-top:-.5rem;cursor:pointer}.p-orderlist-filter-input{width:100%}.p-orderlist-controls-right .p-orderlist-controls{order:2}.p-orderlist-controls-right .p-orderlist-list-container{order:1}.p-orderlist-list.cdk-drop-list-dragging .p-orderlist-item:not(.cdk-drag-placeholder){transition:transform .25s cubic-bezier(0,0,.2,1)}\n"] }]
        }], ctorParameters: function () { return [{ type: i0.ElementRef }, { type: i0.ChangeDetectorRef }, { type: i1.FilterService }]; }, propDecorators: { header: [{
                type: Input
            }], style: [{
                type: Input
            }], styleClass: [{
                type: Input
            }], listStyle: [{
                type: Input
            }], responsive: [{
                type: Input
            }], filterBy: [{
                type: Input
            }], filterPlaceholder: [{
                type: Input
            }], filterLocale: [{
                type: Input
            }], metaKeySelection: [{
                type: Input
            }], dragdrop: [{
                type: Input
            }], controlsPosition: [{
                type: Input
            }], ariaFilterLabel: [{
                type: Input
            }], filterMatchMode: [{
                type: Input
            }], breakpoint: [{
                type: Input
            }], stripedRows: [{
                type: Input
            }], disabled: [{
                type: Input
            }], selectionChange: [{
                type: Output
            }], trackBy: [{
                type: Input
            }], onReorder: [{
                type: Output
            }], onSelectionChange: [{
                type: Output
            }], onFilterEvent: [{
                type: Output
            }], listViewChild: [{
                type: ViewChild,
                args: ['listelement']
            }], filterViewChild: [{
                type: ViewChild,
                args: ['filter']
            }], templates: [{
                type: ContentChildren,
                args: [PrimeTemplate]
            }], selection: [{
                type: Input
            }], value: [{
                type: Input
            }] } });
export class OrderListModule {
}
OrderListModule.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "14.0.7", ngImport: i0, type: OrderListModule, deps: [], target: i0.ɵɵFactoryTarget.NgModule });
OrderListModule.ɵmod = i0.ɵɵngDeclareNgModule({ minVersion: "14.0.0", version: "14.0.7", ngImport: i0, type: OrderListModule, declarations: [OrderList], imports: [CommonModule, ButtonModule, SharedModule, RippleModule, DragDropModule], exports: [OrderList, SharedModule, DragDropModule] });
OrderListModule.ɵinj = i0.ɵɵngDeclareInjector({ minVersion: "12.0.0", version: "14.0.7", ngImport: i0, type: OrderListModule, imports: [CommonModule, ButtonModule, SharedModule, RippleModule, DragDropModule, SharedModule, DragDropModule] });
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "14.0.7", ngImport: i0, type: OrderListModule, decorators: [{
            type: NgModule,
            args: [{
                    imports: [CommonModule, ButtonModule, SharedModule, RippleModule, DragDropModule],
                    exports: [OrderList, SharedModule, DragDropModule],
                    declarations: [OrderList]
                }]
        }] });
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoib3JkZXJsaXN0LmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vc3JjL2FwcC9jb21wb25lbnRzL29yZGVybGlzdC9vcmRlcmxpc3QudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUEsT0FBTyxFQUFFLFFBQVEsRUFBRSxTQUFTLEVBQWtELEtBQUssRUFBRSxNQUFNLEVBQUUsZUFBZSxFQUEwQixZQUFZLEVBQUUsU0FBUyxFQUFFLHVCQUF1QixFQUFFLGlCQUFpQixFQUFxQixNQUFNLGVBQWUsQ0FBQztBQUNwUCxPQUFPLEVBQUUsWUFBWSxFQUFFLE1BQU0saUJBQWlCLENBQUM7QUFDL0MsT0FBTyxFQUFFLFlBQVksRUFBRSxNQUFNLGdCQUFnQixDQUFDO0FBQzlDLE9BQU8sRUFBRSxZQUFZLEVBQUUsYUFBYSxFQUFpQixNQUFNLGFBQWEsQ0FBQztBQUN6RSxPQUFPLEVBQUUsVUFBVSxFQUFFLE1BQU0sYUFBYSxDQUFDO0FBQ3pDLE9BQU8sRUFBRSxXQUFXLEVBQUUsaUJBQWlCLEVBQUUsTUFBTSxlQUFlLENBQUM7QUFDL0QsT0FBTyxFQUFFLFlBQVksRUFBRSxNQUFNLGdCQUFnQixDQUFDO0FBQzlDLE9BQU8sRUFBZSxjQUFjLEVBQUUsZUFBZSxFQUFFLE1BQU0sd0JBQXdCLENBQUM7Ozs7Ozs7QUFvRnRGLE1BQU0sT0FBTyxTQUFTO0lBK0VsQixZQUFtQixFQUFjLEVBQVMsRUFBcUIsRUFBUyxhQUE0QjtRQUFqRixPQUFFLEdBQUYsRUFBRSxDQUFZO1FBQVMsT0FBRSxHQUFGLEVBQUUsQ0FBbUI7UUFBUyxrQkFBYSxHQUFiLGFBQWEsQ0FBZTtRQTlEM0YscUJBQWdCLEdBQVksSUFBSSxDQUFDO1FBRWpDLGFBQVEsR0FBWSxLQUFLLENBQUM7UUFFMUIscUJBQWdCLEdBQVcsTUFBTSxDQUFDO1FBSWxDLG9CQUFlLEdBQVcsVUFBVSxDQUFDO1FBRXJDLGVBQVUsR0FBVyxPQUFPLENBQUM7UUFJN0IsYUFBUSxHQUFZLEtBQUssQ0FB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QUUsQ0FBQyxTQUFTLEVBQUUsWUFBWSxFQUFFLGNBQWMsQ0FBQztvQkFDbEQsWUFBWSxFQUFFLENBQUMsU0FBUyxDQUFDO2lCQUM1QiIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7IE5nTW9kdWxlLCBDb21wb25lbnQsIEVsZW1lbnRSZWYsIEFmdGVyVmlld0NoZWNrZWQsIEFmdGVyQ29udGVudEluaXQsIElucHV0LCBPdXRwdXQsIENvbnRlbnRDaGlsZHJlbiwgUXVlcnlMaXN0LCBUZW1wbGF0ZVJlZiwgRXZlbnRFbWl0dGVyLCBWaWV3Q2hpbGQsIENoYW5nZURldGVjdGlvblN0cmF0ZWd5LCBWaWV3RW5jYXBzdWxhdGlvbiwgQ2hhbmdlRGV0ZWN0b3JSZWYgfSBmcm9tICdAYW5ndWxhci9jb3JlJztcbmltcG9ydCB7IENvbW1vbk1vZHVsZSB9IGZyb20gJ0Bhbmd1bGFyL2NvbW1vbic7XG5pbXBvcnQgeyBCdXR0b25Nb2R1bGUgfSBmcm9tICdwcmltZW5nL2J1dHRvbic7XG5pbXBvcnQgeyBTaGFyZWRNb2R1bGUsIFByaW1lVGVtcGxhdGUsIEZpbHRlclNlcnZpY2UgfSBmcm9tICdwcmltZW5nL2FwaSc7XG5pbXBvcnQgeyBEb21IYW5kbGVyIH0gZnJvbSAncHJpbWVuZy9kb20nO1xuaW1wb3J0IHsgT2JqZWN0VXRpbHMsIFVuaXF1ZUNvbXBvbmVudElkIH0gZnJvbSAncHJpbWVuZy91dGlscyc7XG5pbXBvcnQgeyBSaXBwbGVNb2R1bGUgfSBmcm9tICdwcmltZW5nL3JpcHBsZSc7XG5pbXBvcnQgeyBDZGtEcmFnRHJvcCwgRHJhZ0Ryb3BNb2R1bGUsIG1vdmVJdGVtSW5BcnJheSB9IGZyb20gJ0Bhbmd1bGFyL2Nkay9kcmFnLWRyb3AnO1xuXG5leHBvcnQgaW50ZXJmYWNlIE9yZGVyTGlzdEZpbHRlck9wdGlvbnMge1xuICAgIGZpbHRlcj86ICh2YWx1ZT86IGFueSkgPT4gdm9pZDtcbiAgICByZXNldD86ICgpID0+IHZvaWQ7XG59XG5AQ29tcG9uZW50KHtcbiAgICBzZWxlY3RvcjogJ3Atb3JkZXJMaXN0JyxcbiAgICB0ZW1wbGF0ZTogYFxuICAgICAgICA8ZGl2XG4gICAgICAgICAgICBbbmdDbGFzc109XCJ7ICdwLW9yZGVybGlzdCBwLWNvbXBvbmVudCc6IHRydWUsICdwLW9yZGVybGlzdC1zdHJpcGVkJzogc3RyaXBlZFJvd3MsICdwLW9yZGVybGlzdC1jb250cm9scy1sZWZ0JzogY29udHJvbHNQb3NpdGlvbiA9PT0gJ2xlZnQnLCAncC1vcmRlcmxpc3QtY29udHJvbHMtcmlnaHQnOiBjb250cm9sc1Bvc2l0aW9uID09PSAncmlnaHQnIH1cIlxuICAgICAgICAgICAgW25nU3R5bGVdPVwic3R5bGVcIlxuICAgICAgICAgICAgW2NsYXNzXT1cInN0eWxlQ2xhc3NcIlxuICAgICAgICA+XG4gICAgICAgICAgICA8ZGl2IGNsYXNzPVwicC1vcmRlcmxpc3QtY29udHJvbHNcIj5cbiAgICAgICAgICAgICAgICA8YnV0dG9uIHR5cGU9XCJidXR0b25cIiBbZGlzYWJsZWRdPVwibW92ZURpc2FibGVkKClcIiBwQnV0dG9uIHBSaXBwbGUgaWNvbj1cInBpIHBpLWFuZ2xlLXVwXCIgKGNsaWNrKT1cIm1vdmVVcCgpXCI+PC9idXR0b24+XG4gICAgICAgICAgICAgICAgPGJ1dHRvbiB0eXBlPVwiYnV0dG9uXCIgW2Rpc2FibGVkXT1cIm1vdmVEaXNhYmxlZCgpXCIgcEJ1dHRvbiBwUmlwcGxlIGljb249XCJwaSBwaS1hbmdsZS1kb3VibGUtdXBcIiAoY2xpY2spPVwibW92ZVRvcCgpXCI+PC9idXR0b24+XG4gICAgICAgICAgICAgICAgPGJ1dHRvbiB0eXBlPVwiYnV0dG9uXCIgW2Rpc2FibGVkXT1cIm1vdmVEaXNhYmxlZCgpXCIgcEJ1dHRvbiBwUmlwcGxlIGljb249XCJwaSBwaS1hbmdsZS1kb3duXCIgKGNsaWNrKT1cIm1vdmVEb3duKClcIj48L2J1dHRvbj5cbiAgICAgICAgICAgICAgICA8YnV0dG9uIHR5cGU9XCJidXR0b25cIiBbZGlzYWJsZWRdPVwibW92ZURpc2FibGVkKClcIiBwQnV0dG9uIHBSaXBwbGUgaWNvbj1cInBpIHBpLWFuZ2xlLWRvdWJsZS1kb3duXCIgKGNsaWNrKT1cIm1vdmVCb3R0b20oKVwiPjwvYnV0dG9uPlxuICAgICAgICAgICAgPC9kaXY+XG4gICAgICAgICAgICA8ZGl2IGNsYXNzPVwicC1vcmRlcmxpc3QtbGlzdC1jb250YWluZXJcIj5cbiAgICAgICAgICAgICAgICA8ZGl2IGNsYXNzPVwicC1vcmRlcmxpc3QtaGVhZGVyXCIgKm5nSWY9XCJoZWFkZXIgfHwgaGVhZGVyVGVtcGxhdGVcIj5cbiAgICAgICAgICAgICAgICAgICAgPGRpdiBjbGFzcz1cInAtb3JkZXJsaXN0LXRpdGxlXCIgKm5nSWY9XCIhaGVhZGVyVGVtcGxhdGVcIj57eyBoZWFkZXIgfX08L2Rpdj5cbiAgICAgICAgICAgICAgICAgICAgPG5nLWNvbnRhaW5lciAqbmdUZW1wbGF0ZU91dGxldD1cImhlYWRlclRlbXBsYXRlXCI+PC9uZy1jb250YWluZXI+XG4gICAgICAgICAgICAgICAgPC9kaXY+XG4gICAgICAgICAgICAgICAgPGRpdiBjbGFzcz1cInAtb3JkZXJsaXN0LWZpbHRlci1jb250YWluZXJcIiAqbmdJZj1cImZpbHRlckJ5XCI+XG4gICAgICAgICAgICAgICAgICAgIDxuZy1jb250YWluZXIgKm5nSWY9XCJmaWx0ZXJUZW1wbGF0ZTsgZWxzZSBidWlsdEluRmlsdGVyRWxlbWVudFwiPlxuICAgICAgICAgICAgICAgICAgICAgICAgPG5nLWNvbnRhaW5lciAqbmdUZW1wbGF0ZU91dGxldD1cImZpbHRlclRlbXBsYXRlOyBjb250ZXh0OiB7IG9wdGlvbnM6IGZpbHRlck9wdGlvbnMgfVwiPjwvbmctY29udGFpbmVyPlxuICAgICAgICAgICAgICAgICAgICA8L25nLWNvbnRhaW5lcj5cbiAgICAgICAgICAgICAgICAgICAgPG5nLXRlbXBsYXRlICNidWlsdEluRmlsdGVyRWxlbWVudD5cbiAgICAgICAgICAgICAgICAgICAgICAgIDxkaXYgY2xhc3M9XCJwLW9yZGVybGlzdC1maWx0ZXJcIj5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICA8aW5wdXRcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgI2ZpbHRlclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB0eXBlPVwidGV4dFwiXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHJvbGU9XCJ0ZXh0Ym94XCJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgKGtleXVwKT1cIm9uRmlsdGVyS2V5dXAoJGV2ZW50KVwiXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIFtkaXNhYmxlZF09XCJkaXNhYmxlZFwiXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNsYXNzPVwicC1vcmRlcmxpc3QtZmlsdGVyLWlucHV0IHAtaW5wdXR0ZXh0IHAtY29tcG9uZW50XCJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgW2F0dHIucGxhY2Vob2xkZXJdPVwiZmlsdGVyUGxhY2Vob2xkZXJcIlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBbYXR0ci5hcmlhLWxhYmVsXT1cImFyaWFGaWx0ZXJMYWJlbFwiXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgLz5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICA8c3BhbiBjbGFzcz1cInAtb3JkZXJsaXN0LWZpbHRlci1pY29uIHBpIHBpLXNlYXJjaFwiPjwvc3Bhbj5cbiAgICAgICAgICAgICAgICAgICAgICAgIDwvZGl2PlxuICAgICAgICAgICAgICAgICAgICA8L25nLXRlbXBsYXRlPlxuICAgICAgICAgICAgICAgIDwvZGl2PlxuICAgICAgICAgICAgICAgIDx1bCAjbGlzdGVsZW1lbnQgY2RrRHJvcExpc3QgKGNka0Ryb3BMaXN0RHJvcHBlZCk9XCJvbkRyb3AoJGV2ZW50KVwiIGNsYXNzPVwicC1vcmRlcmxpc3QtbGlzdFwiIFtuZ1N0eWxlXT1cImxpc3RTdHlsZVwiPlxuICAgICAgICAgICAgICAgICAgICA8bmctdGVtcGxhdGUgbmdGb3IgW25nRm9yVHJhY2tCeV09XCJ0cmFja0J5XCIgbGV0LWl0ZW0gW25nRm9yT2ZdPVwidmFsdWVcIiBsZXQtaT1cImluZGV4XCIgbGV0LWw9XCJsYXN0XCI+XG4gICAgICAgICAgICAgICAgICAgICAgICA8bGlcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBjbGFzcz1cInAtb3JkZXJsaXN0LWl0ZW1cIlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRhYmluZGV4PVwiMFwiXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgW25nQ2xhc3NdPVwieyAncC1oaWdobGlnaHQnOiBpc1NlbGVjdGVkKGl0ZW0pLCAncC1kaXNhYmxlZCc6IGRpc2FibGVkIH1cIlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNka0RyYWdcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBwUmlwcGxlXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgW2Nka0RyYWdEYXRhXT1cIml0ZW1cIlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIFtjZGtEcmFnRGlzYWJsZWRdPVwiIWRyYWdkcm9wXCJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAoY2xpY2spPVwib25JdGVtQ2xpY2soJGV2ZW50LCBpdGVtLCBpKVwiXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgKHRvdWNoZW5kKT1cIm9uSXRlbVRvdWNoRW5kKClcIlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIChrZXlkb3duKT1cIm9uSXRlbUtleWRvd24oJGV2ZW50LCBpdGVtLCBpKVwiXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgKm5nSWY9XCJpc0l0ZW1WaXNpYmxlKGl0ZW0pXCJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICByb2xlPVwib3B0aW9uXCJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBbYXR0ci5hcmlhLXNlbGVjdGVkXT1cImlzU2VsZWN0ZWQoaXRlbSlcIlxuICAgICAgICAgICAgICAgICAgICAgICAgPlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIDxuZy1jb250YWluZXIgKm5nVGVtcGxhdGVPdXRsZXQ9XCJpdGVtVGVtcGxhdGU7IGNvbnRleHQ6IHsgJGltcGxpY2l0OiBpdGVtLCBpbmRleDogaSB9XCI+PC9uZy1jb250YWluZXI+XG4gICAgICAgICAgICAgICAgICAgICAgICA8L2xpPlxuICAgICAgICAgICAgICAgICAgICA8L25nLXRlbXBsYXRlPlxuICAgICAgICAgICAgICAgICAgICA8bmctY29udGFpbmVyICpuZ0lmPVwiaXNFbXB0eSgpICYmIChlbXB0eU1lc3NhZ2VUZW1wbGF0ZSB8fCBlbXB0eUZpbHRlck1lc3NhZ2VUZW1wbGF0ZSlcIj5cbiAgICAgICAgICAgICAgICAgICAgICAgIDxsaSAqbmdJZj1cIiFmaWx0ZXJWYWx1ZSB8fCAhZW1wdHlGaWx0ZXJNZXNzYWdlVGVtcGxhdGVcIiBjbGFzcz1cInAtb3JkZXJsaXN0LWVtcHR5LW1lc3NhZ2VcIj5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICA8bmctY29udGFpbmVyICpuZ1RlbXBsYXRlT3V0bGV0PVwiZW1wdHlNZXNzYWdlVGVtcGxhdGVcIj48L25nLWNvbnRhaW5lcj5cbiAgICAgICAgICAgICAgICAgICAgICAgIDwvbGk+XG4gICAgICAgICAgICAgICAgICAgICAgICA8bGkgKm5nSWY9XCJmaWx0ZXJWYWx1ZVwiIGNsYXNzPVwicC1vcmRlcmxpc3QtZW1wdHktbWVzc2FnZVwiPlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIDxuZy1jb250YWluZXIgKm5nVGVtcGxhdGVPdXRsZXQ9XCJlbXB0eUZpbHRlck1lc3NhZ2VUZW1wbGF0ZVwiPjwvbmctY29udGFpbmVyPlxuICAgICAgICAgICAgICAgICAgICAgICAgPC9saT5cbiAgICAgICAgICAgICAgICAgICAgPC9uZy1jb250YWluZXI+XG4gICAgICAgICAgICAgICAgPC91bD5cbiAgICAgICAgICAgIDwvZGl2PlxuICAgICAgICA8L2Rpdj5cbiAgICBgLFxuICAgIGNoYW5nZURldGVjdGlvbjogQ2hhbmdlRGV0ZWN0aW9uU3RyYXRlZ3kuT25QdXNoLFxuICAgIGVuY2Fwc3VsYXRpb246IFZpZXdFbmNhcHN1bGF0aW9uLk5vbmUsXG4gICAgc3R5bGVVcmxzOiBbJy4vb3JkZXJsaXN0LmNzcyddLFxuICAgIGhvc3Q6IHtcbiAgICAgICAgY2xhc3M6ICdwLWVsZW1lbnQnXG4gICAgfVxufSlcbmV4cG9ydCBjbGFzcyBPcmRlckxpc3QgaW1wbGVtZW50cyBBZnRlclZpZXdDaGVja2VkLCBBZnRlckNvbnRlbnRJbml0IHtcbiAgICBASW5wdXQoKSBoZWFkZXI6IHN0cmluZztcblxuICAgIEBJbnB1dCgpIHN0eWxlOiBhbnk7XG5cbiAgICBASW5wdXQoKSBzdHlsZUNsYXNzOiBzdHJpbmc7XG5cbiAgICBASW5wdXQoKSBsaXN0U3R5bGU6IGFueTtcblxuICAgIEBJbnB1dCgpIHJlc3BvbnNpdmU6IGJvb2xlYW47XG5cbiAgICBASW5wdXQoKSBmaWx0ZXJCeTogc3RyaW5nO1xuXG4gICAgQElucHV0KCkgZmlsdGVyUGxhY2Vob2xkZXI6IHN0cmluZztcblxuICAgIEBJbnB1dCgpIGZpbHRlckxvY2FsZTogc3RyaW5nO1xuXG4gICAgQElucHV0KCkgbWV0YUtleVNlbGVjdGlvbjogYm9vbGVhbiA9IHRydWU7XG5cbiAgICBASW5wdXQoKSBkcmFnZHJvcDogYm9vbGVhbiA9IGZhbHNlO1xuXG4gICAgQElucHV0KCkgY29udHJvbHNQb3NpdGlvbjogc3RyaW5nID0gJ2xlZnQnO1xuXG4gICAgQElucHV0KCkgYXJpYUZpbHRlckxhYmVsOiBzdHJpbmc7XG5cbiAgICBASW5wdXQoKSBmaWx0ZXJNYXRjaE1vZGU6IHN0cmluZyA9ICdjb250YWlucyc7XG5cbiAgICBASW5wdXQoKSBicmVha3BvaW50OiBzdHJpbmcgPSAnOTYwcHgnO1xuXG4gICAgQElucHV0KCkgc3RyaXBlZFJvd3M6IGJvb2xlYW47XG5cbiAgICBASW5wdXQoKSBkaXNhYmxlZDogYm9vbGVhbiA9IGZhbHNlO1xuXG4gICAgQE91dHB1dCgpIHNlbGVjdGlvbkNoYW5nZTogRXZlbnRFbWl0dGVyPGFueT4gPSBuZXcgRXZlbnRFbWl0dGVyKCk7XG5cbiAgICBASW5wdXQoKSB0cmFja0J5OiBGdW5jdGlvbiA9IChpbmRleDogbnVtYmVyLCBpdGVtOiBhbnkpID0+IGl0ZW07XG5cbiAgICBAT3V0cHV0KCkgb25SZW9yZGVyOiBFdmVudEVtaXR0ZXI8YW55PiA9IG5ldyBFdmVudEVtaXR0ZXIoKTtcblxuICAgIEBPdXRwdXQoKSBvblNlbGVjdGlvbkNoYW5nZTogRXZlbnRFbWl0dGVyPGFueT4gPSBuZXcgRXZlbnRFbWl0dGVyKCk7XG5cbiAgICBAT3V0cHV0KCkgb25GaWx0ZXJFdmVudDogRXZlbnRFbWl0dGVyPGFueT4gPSBuZXcgRXZlbnRFbWl0dGVyKCk7XG5cbiAgICBAVmlld0NoaWxkKCdsaXN0ZWxlbWVudCcpIGxpc3RWaWV3Q2hpbGQ6IEVsZW1lbnRSZWY7XG5cbiAgICBAVmlld0NoaWxkKCdmaWx0ZXInKSBmaWx0ZXJWaWV3Q2hpbGQ6IEVsZW1lbnRSZWY7XG5cbiAgICBAQ29udGVudENoaWxkcmVuKFByaW1lVGVtcGxhdGUpIHRlbXBsYXRlczogUXVlcnlMaXN0PGFueT47XG5cbiAgICBwdWJsaWMgaXRlbVRlbXBsYXRlOiBUZW1wbGF0ZVJlZjxhbnk+O1xuXG4gICAgcHVibGljIGhlYWRlclRlbXBsYXRlOiBUZW1wbGF0ZVJlZjxhbnk+O1xuXG4gICAgcHVibGljIGVtcHR5TWVzc2FnZVRlbXBsYXRlOiBUZW1wbGF0ZVJlZjxhbnk+O1xuXG4gICAgcHVibGljIGVtcHR5RmlsdGVyTWVzc2FnZVRlbXBsYXRlOiBUZW1wbGF0ZVJlZjxhbnk+O1xuXG4gICAgcHVibGljIGZpbHRlclRlbXBsYXRlOiBUZW1wbGF0ZVJlZjxhbnk+O1xuXG4gICAgZmlsdGVyT3B0aW9uczogT3JkZXJMaXN0RmlsdGVyT3B0aW9ucztcblxuICAgIF9zZWxlY3Rpb246IGFueVtdID0gW107XG5cbiAgICBtb3ZlZFVwOiBib29sZWFuO1xuXG4gICAgbW92ZWREb3duOiBib29sZWFuO1xuXG4gICAgaXRlbVRvdWNoZWQ6IGJvb2xlYW47XG5cbiAgICBzdHlsZUVsZW1lbnQ6IGFueTtcblxuICAgIGlkOiBzdHJpbmcgPSBVbmlxdWVDb21wb25lbnRJZCgpO1xuXG4gICAgcHVibGljIGZpbHRlclZhbHVlOiBzdHJpbmc7XG5cbiAgICBwdWJsaWMgdmlzaWJsZU9wdGlvbnM6IGFueVtdO1xuXG4gICAgcHVibGljIF92YWx1ZTogYW55W107XG5cbiAgICBjb25zdHJ1Y3RvcihwdWJsaWMgZWw6IEVsZW1lbnRSZWYsIHB1YmxpYyBjZDogQ2hhbmdlRGV0ZWN0b3JSZWYsIHB1YmxpYyBmaWx0ZXJTZXJ2aWNlOiBGaWx0ZXJTZXJ2aWNlKSB7fVxuXG4gICAgZ2V0IHNlbGVjdGlvbigpOiBhbnlbXSB7XG4gICAgICAgIHJldHVybiB0aGlzLl9zZWxlY3Rpb247XG4gICAgfVxuXG4gICAgQElucHV0KCkgc2V0IHNlbGVjdGlvbih2YWw6IGFueVtdKSB7XG4gICAgICAgIHRoaXMuX3NlbGVjdGlvbiA9IHZhbDtcbiAgICB9XG5cbiAgICBuZ09uSW5pdCgpIHtcbiAgICAgICAgaWYgKHRoaXMucmVzcG9uc2l2ZSkge1xuICAgICAgICAgICAgdGhpcy5jcmVhdGVTdHlsZSgpO1xuICAgICAgICB9XG5cbiAgICAgICAgaWYgKHRoaXMuZmlsdGVyQnkpIHtcbiAgICAgICAgICAgIHRoaXMuZmlsdGVyT3B0aW9ucyA9IHtcbiAgICAgICAgICAgICAgICBmaWx0ZXI6ICh2YWx1ZSkgPT4gdGhpcy5vbkZpbHRlcktleXVwKHZhbHVlKSxcbiAgICAgICAgICAgICAgICByZXNldDogKCkgPT4gdGhpcy5yZXNldEZpbHRlcigpXG4gICAgICAgICAgICB9O1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgbmdBZnRlckNvbnRlbnRJbml0KCkge1xuICAgICAgICB0aGlzLnRlbXBsYXRlcy5mb3JFYWNoKChpdGVtKSA9PiB7XG4gICAgICAgICAgICBzd2l0Y2ggKGl0ZW0uZ2V0VHlwZSgpKSB7XG4gICAgICAgICAgICAgICAgY2FzZSAnaXRlbSc6XG4gICAgICAgICAgICAgICAgICAgIHRoaXMuaXRlbVRlbXBsYXRlID0gaXRlbS50ZW1wbGF0ZTtcbiAgICAgICAgICAgICAgICAgICAgYnJlYWs7XG5cbiAgICAgICAgICAgICAgICBjYXNlICdlbXB0eSc6XG4gICAgICAgICAgICAgICAgICAgIHRoaXMuZW1wdHlNZXNzYWdlVGVtcGxhdGUgPSBpdGVtLnRlbXBsYXRlO1xuICAgICAgICAgICAgICAgICAgICBicmVhaztcblxuICAgICAgICAgICAgICAgIGNhc2UgJ2VtcHR5ZmlsdGVyJzpcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5lbXB0eUZpbHRlck1lc3NhZ2VUZW1wbGF0ZSA9IGl0ZW0udGVtcGxhdGU7XG4gICAgICAgICAgICAgICAgICAgIGJyZWFrO1xuXG4gICAgICAgICAgICAgICAgY2FzZSAnZmlsdGVyJzpcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5maWx0ZXJUZW1wbGF0ZSA9IGl0ZW0udGVtcGxhdGU7XG4gICAgICAgICAgICAgICAgICAgIGJyZWFrO1xuXG4gICAgICAgICAgICAgICAgY2FzZSAnaGVhZGVyJzpcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5oZWFkZXJUZW1wbGF0ZSA9IGl0ZW0udGVtcGxhdGU7XG4gICAgICAgICAgICAgICAgICAgIGJyZWFrO1xuXG4gICAgICAgICAgICAgICAgZGVmYXVsdDpcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5pdGVtVGVtcGxhdGUgPSBpdGVtLnRlbXBsYXRlO1xuICAgICAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgIH1cbiAgICAgICAgfSk7XG4gICAgfVxuXG4gICAgbmdBZnRlclZpZXdDaGVja2VkKCkge1xuICAgICAgICBpZiAodGhpcy5tb3ZlZFVwIHx8IHRoaXMubW92ZWREb3duKSB7XG4gICAgICAgICAgICBsZXQgbGlzdEl0ZW1zID0gRG9tSGFuZGxlci5maW5kKHRoaXMubGlzdFZpZXdDaGlsZC5uYXRpdmVFbGVtZW50LCAnbGkucC1oaWdobGlnaHQnKTtcbiAgICAgICAgICAgIGxldCBsaXN0SXRlbTtcblxuICAgICAgICAgICAgaWYgKGxpc3RJdGVtcy5sZW5ndGggPiAwKSB7XG4gICAgICAgICAgICAgICAgaWYgKHRoaXMubW92ZWRVcCkgbGlzdEl0ZW0gPSBsaXN0SXRlbXNbMF07XG4gICAgICAgICAgICAgICAgZWxzZSBsaXN0SXRlbSA9IGxpc3RJdGVtc1tsaXN0SXRlbXMubGVuZ3RoIC0gMV07XG5cbiAgICAgICAgICAgICAgICBEb21IYW5kbGVyLnNjcm9sbEluVmlldyh0aGlzLmxpc3RWaWV3Q2hpbGQubmF0aXZlRWxlbWVudCwgbGlzdEl0ZW0pO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgdGhpcy5tb3ZlZFVwID0gZmFsc2U7XG4gICAgICAgICAgICB0aGlzLm1vdmVkRG93biA9IGZhbHNlO1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgZ2V0IHZhbHVlKCk6IGFueVtdIHtcbiAgICAgICAgcmV0dXJuIHRoaXMuX3ZhbHVlO1xuICAgIH1cblxuICAgIEBJbnB1dCgpIHNldCB2YWx1ZSh2YWw6IGFueVtdKSB7XG4gICAgICAgIHRoaXMuX3ZhbHVlID0gdmFsO1xuICAgICAgICBpZiAodGhpcy5maWx0ZXJWYWx1ZSkge1xuICAgICAgICAgICAgdGhpcy5maWx0ZXIoKTtcbiAgICAgICAgfVxuICAgIH1cblxuICAgIG9uSXRlbUNsaWNrKGV2ZW50LCBpdGVtLCBpbmRleCkge1xuICAgICAgICB0aGlzLml0ZW1Ub3VjaGVkID0gZmFsc2U7XG4gICAgICAgIGxldCBzZWxlY3RlZEluZGV4ID0gT2JqZWN0VXRpbHMuZmluZEluZGV4SW5MaXN0KGl0ZW0sIHRoaXMuc2VsZWN0aW9uKTtcbiAgICAgICAgbGV0IHNlbGVjdGVkID0gc2VsZWN0ZWRJbmRleCAhPSAtMTtcbiAgICAgICAgbGV0IG1ldGFTZWxlY3Rpb24gPSB0aGlzLml0ZW1Ub3VjaGVkID8gZmFsc2UgOiB0aGlzLm1ldGFLZXlTZWxlY3Rpb247XG5cbiAgICAgICAgaWYgKG1ldGFTZWxlY3Rpb24pIHtcbiAgICAgICAgICAgIGxldCBtZXRhS2V5ID0gZXZlbnQubWV0YUtleSB8fCBldmVudC5jdHJsS2V5IHx8IGV2ZW50LnNoaWZ0S2V5O1xuXG4gICAgICAgICAgICBpZiAoc2VsZWN0ZWQgJiYgbWV0YUtleSkge1xuICAgICAgICAgICAgICAgIHRoaXMuX3NlbGVjdGlvbiA9IHRoaXMuX3NlbGVjdGlvbi5maWx0ZXIoKHZhbCwgaW5kZXgpID0+IGluZGV4ICE9PSBzZWxlY3RlZEluZGV4KTtcbiAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgdGhpcy5fc2VsZWN0aW9uID0gbWV0YUtleSA/ICh0aGlzLl9zZWxlY3Rpb24gPyBbLi4udGhpcy5fc2VsZWN0aW9uXSA6IFtdKSA6IFtdO1xuICAgICAgICAgICAgICAgIE9iamVjdFV0aWxzLmluc2VydEludG9PcmRlcmVkQXJyYXkoaXRlbSwgaW5kZXgsIHRoaXMuX3NlbGVjdGlvbiwgdGhpcy52YWx1ZSk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICBpZiAoc2VsZWN0ZWQpIHtcbiAgICAgICAgICAgICAgICB0aGlzLl9zZWxlY3Rpb24gPSB0aGlzLl9zZWxlY3Rpb24uZmlsdGVyKCh2YWwsIGluZGV4KSA9PiBpbmRleCAhPT0gc2VsZWN0ZWRJbmRleCk7XG4gICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgIHRoaXMuX3NlbGVjdGlvbiA9IHRoaXMuX3NlbGVjdGlvbiA/IFsuLi50aGlzLl9zZWxlY3Rpb25dIDogW107XG4gICAgICAgICAgICAgICAgT2JqZWN0VXRpbHMuaW5zZXJ0SW50b09yZGVyZWRBcnJheShpdGVtLCBpbmRleCwgdGhpcy5fc2VsZWN0aW9uLCB0aGlzLnZhbHVlKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuXG4gICAgICAgIC8vYmluZGluZ1xuICAgICAgICB0aGlzLnNlbGVjdGlvbkNoYW5nZS5lbWl0KHRoaXMuX3NlbGVjdGlvbik7XG5cbiAgICAgICAgLy9ldmVudFxuICAgICAgICB0aGlzLm9uU2VsZWN0aW9uQ2hhbmdlLmVtaXQoeyBvcmlnaW5hbEV2ZW50OiBldmVudCwgdmFsdWU6IHRoaXMuX3NlbGVjdGlvbiB9KTtcbiAgICB9XG5cbiAgICBvbkZpbHRlcktleXVwKGV2ZW50KSB7XG4gICAgICAgIHRoaXMuZmlsdGVyVmFsdWUgPSAoKDxIVE1MSW5wdXRFbGVtZW50PmV2ZW50LnRhcmdldCkudmFsdWUudHJpbSgpIGFzIGFueSkudG9Mb2NhbGVMb3dlckNhc2UodGhpcy5maWx0ZXJMb2NhbGUpO1xuICAgICAgICB0aGlzLmZpbHRlcigpO1xuXG4gICAgICAgIHRoaXMub25GaWx0ZXJFdmVudC5lbWl0KHtcbiAgICAgICAgICAgIG9yaWdpbmFsRXZlbnQ6IGV2ZW50LFxuICAgICAgICAgICAgdmFsdWU6IHRoaXMudmlzaWJsZU9wdGlvbnNcbiAgICAgICAgfSk7XG4gICAgfVxuXG4gICAgZmlsdGVyKCkge1xuICAgICAgICBsZXQgc2VhcmNoRmllbGRzOiBzdHJpbmdbXSA9IHRoaXMuZmlsdGVyQnkuc3BsaXQoJywnKTtcbiAgICAgICAgdGhpcy52aXNpYmxlT3B0aW9ucyA9IHRoaXMuZmlsdGVyU2VydmljZS5maWx0ZXIodGhpcy52YWx1ZSwgc2VhcmNoRmllbGRzLCB0aGlzLmZpbHRlclZhbHVlLCB0aGlzLmZpbHRlck1hdGNoTW9kZSwgdGhpcy5maWx0ZXJMb2NhbGUpO1xuICAgIH1cblxuICAgIHJlc2V0RmlsdGVyKCkge1xuICAgICAgICB0aGlzLmZpbHRlclZhbHVlID0gbnVsbDtcbiAgICAgICAgdGhpcy5maWx0ZXJWaWV3Q2hpbGQgJiYgKCg8SFRNTElucHV0RWxlbWVudD50aGlzLmZpbHRlclZpZXdDaGlsZC5uYXRpdmVFbGVtZW50KS52YWx1ZSA9ICcnKTtcbiAgICB9XG5cbiAgICBpc0l0ZW1WaXNpYmxlKGl0ZW06IGFueSk6IGJvb2xlYW4ge1xuICAgICAgICBpZiAodGhpcy5maWx0ZXJWYWx1ZSAmJiB0aGlzLmZpbHRlclZhbHVlLnRyaW0oKS5sZW5ndGgpIHtcbiAgICAgICAgICAgIGZvciAobGV0IGkgPSAwOyBpIDwgdGhpcy52aXNpYmxlT3B0aW9ucy5sZW5ndGg7IGkrKykge1xuICAgICAgICAgICAgICAgIGlmIChpdGVtID09IHRoaXMudmlzaWJsZU9wdGlvbnNbaV0pIHtcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIHRydWU7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgcmV0dXJuIHRydWU7XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICBvbkl0ZW1Ub3VjaEVuZCgpIHtcbiAgICAgICAgdGhpcy5pdGVtVG91Y2hlZCA9IHRydWU7XG4gICAgfVxuXG4gICAgaXNTZWxlY3RlZChpdGVtOiBhbnkpIHtcbiAgICAgICAgcmV0dXJuIE9iamVjdFV0aWxzLmZpbmRJbmRleEluTGlzdChpdGVtLCB0aGlzLnNlbGVjdGlvbikgIT0gLTE7XG4gICAgfVxuXG4gICAgaXNFbXB0eSgpIHtcbiAgICAgICAgcmV0dXJuIHRoaXMuZmlsdGVyVmFsdWUgPyAhdGhpcy52aXNpYmxlT3B0aW9ucyB8fCB0aGlzLnZpc2libGVPcHRpb25zLmxlbmd0aCA9PT0gMCA6ICF0aGlzLnZhbHVlIHx8IHRoaXMudmFsdWUubGVuZ3RoID09PSAwO1xuICAgIH1cblxuICAgIG1vdmVVcCgpIHtcbiAgICAgICAgaWYgKHRoaXMuc2VsZWN0aW9uKSB7XG4gICAgICAgICAgICBmb3IgKGxldCBpID0gMDsgaSA8IHRoaXMuc2VsZWN0aW9uLmxlbmd0aDsgaSsrKSB7XG4gICAgICAgICAgICAgICAgbGV0IHNlbGVjdGVkSXRlbSA9IHRoaXMuc2VsZWN0aW9uW2ldO1xuICAgICAgICAgICAgICAgIGxldCBzZWxlY3RlZEl0ZW1JbmRleDogbnVtYmVyID0gT2JqZWN0VXRpbHMuZmluZEluZGV4SW5MaXN0KHNlbGVjdGVkSXRlbSwgdGhpcy52YWx1ZSk7XG5cbiAgICAgICAgICAgICAgICBpZiAoc2VsZWN0ZWRJdGVtSW5kZXggIT0gMCkge1xuICAgICAgICAgICAgICAgICAgICBsZXQgbW92ZWRJdGVtID0gdGhpcy52YWx1ZVtzZWxlY3RlZEl0ZW1JbmRleF07XG4gICAgICAgICAgICAgICAgICAgIGxldCB0ZW1wID0gdGhpcy52YWx1ZVtzZWxlY3RlZEl0ZW1JbmRleCAtIDFdO1xuICAgICAgICAgICAgICAgICAgICB0aGlzLnZhbHVlW3NlbGVjdGVkSXRlbUluZGV4IC0gMV0gPSBtb3ZlZEl0ZW07XG4gICAgICAgICAgICAgICAgICAgIHRoaXMudmFsdWVbc2VsZWN0ZWRJdGVtSW5kZXhdID0gdGVtcDtcbiAgICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIGlmICh0aGlzLmRyYWdkcm9wICYmIHRoaXMuZmlsdGVyVmFsdWUpIHRoaXMuZmlsdGVyKCk7XG5cbiAgICAgICAgICAgIHRoaXMubW92ZWRVcCA9IHRydWU7XG4gICAgICAgICAgICB0aGlzLm9uUmVvcmRlci5lbWl0KHRoaXMuc2VsZWN0aW9uKTtcbiAgICAgICAgfVxuICAgIH1cblxuICAgIG1vdmVUb3AoKSB7XG4gICAgICAgIGlmICh0aGlzLnNlbGVjdGlvbikge1xuICAgICAgICAgICAgZm9yIChsZXQgaSA9IHRoaXMuc2VsZWN0aW9uLmxlbmd0aCAtIDE7IGkgPj0gMDsgaS0tKSB7XG4gICAgICAgICAgICAgICAgbGV0IHNlbGVjdGVkSXRlbSA9IHRoaXMuc2VsZWN0aW9uW2ldO1xuICAgICAgICAgICAgICAgIGxldCBzZWxlY3RlZEl0ZW1JbmRleDogbnVtYmVyID0gT2JqZWN0VXRpbHMuZmluZEluZGV4SW5MaXN0KHNlbGVjdGVkSXRlbSwgdGhpcy52YWx1ZSk7XG5cbiAgICAgICAgICAgICAgICBpZiAoc2VsZWN0ZWRJdGVtSW5kZXggIT0gMCkge1xuICAgICAgICAgICAgICAgICAgICBsZXQgbW92ZWRJdGVtID0gdGhpcy52YWx1ZS5zcGxpY2Uoc2VsZWN0ZWRJdGVtSW5kZXgsIDEpWzBdO1xuICAgICAgICAgICAgICAgICAgICB0aGlzLnZhbHVlLnVuc2hpZnQobW92ZWRJdGVtKTtcbiAgICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIGlmICh0aGlzLmRyYWdkcm9wICYmIHRoaXMuZmlsdGVyVmFsdWUpIHRoaXMuZmlsdGVyKCk7XG5cbiAgICAgICAgICAgIHRoaXMub25SZW9yZGVyLmVtaXQodGhpcy5zZWxlY3Rpb24pO1xuICAgICAgICAgICAgdGhpcy5saXN0Vmlld0NoaWxkLm5hdGl2ZUVsZW1lbnQuc2Nyb2xsVG9wID0gMDtcbiAgICAgICAgfVxuICAgIH1cblxuICAgIG1vdmVEb3duKCkge1xuICAgICAgICBpZiAodGhpcy5zZWxlY3Rpb24pIHtcbiAgICAgICAgICAgIGZvciAobGV0IGkgPSB0aGlzLnNlbGVjdGlvbi5sZW5ndGggLSAxOyBpID49IDA7IGktLSkge1xuICAgICAgICAgICAgICAgIGxldCBzZWxlY3RlZEl0ZW0gPSB0aGlzLnNlbGVjdGlvbltpXTtcbiAgICAgICAgICAgICAgICBsZXQgc2VsZWN0ZWRJdGVtSW5kZXg6IG51bWJlciA9IE9iamVjdFV0aWxzLmZpbmRJbmRleEluTGlzdChzZWxlY3RlZEl0ZW0sIHRoaXMudmFsdWUpO1xuXG4gICAgICAgICAgICAgICAgaWYgKHNlbGVjdGVkSXRlbUluZGV4ICE9IHRoaXMudmFsdWUubGVuZ3RoIC0gMSkge1xuICAgICAgICAgICAgICAgICAgICBsZXQgbW92ZWRJdGVtID0gdGhpcy52YWx1ZVtzZWxlY3RlZEl0ZW1JbmRleF07XG4gICAgICAgICAgICAgICAgICAgIGxldCB0ZW1wID0gdGhpcy52YWx1ZVtzZWxlY3RlZEl0ZW1JbmRleCArIDFdO1xuICAgICAgICAgICAgICAgICAgICB0aGlzLnZhbHVlW3NlbGVjdGVkSXRlbUluZGV4ICsgMV0gPSBtb3ZlZEl0ZW07XG4gICAgICAgICAgICAgICAgICAgIHRoaXMudmFsdWVbc2VsZWN0ZWRJdGVtSW5kZXhdID0gdGVtcDtcbiAgICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIGlmICh0aGlzLmRyYWdkcm9wICYmIHRoaXMuZmlsdGVyVmFsdWUpIHRoaXMuZmlsdGVyKCk7XG5cbiAgICAgICAgICAgIHRoaXMubW92ZWREb3duID0gdHJ1ZTtcbiAgICAgICAgICAgIHRoaXMub25SZW9yZGVyLmVtaXQodGhpcy5zZWxlY3Rpb24pO1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgbW92ZUJvdHRvbSgpIHtcbiAgICAgICAgaWYgKHRoaXMuc2VsZWN0aW9uKSB7XG4gICAgICAgICAgICBmb3IgKGxldCBpID0gMDsgaSA8IHRoaXMuc2VsZWN0aW9uLmxlbmd0aDsgaSsrKSB7XG4gICAgICAgICAgICAgICAgbGV0IHNlbGVjdGVkSXRlbSA9IHRoaXMuc2VsZWN0aW9uW2ldO1xuICAgICAgICAgICAgICAgIGxldCBzZWxlY3RlZEl0ZW1JbmRleDogbnVtYmVyID0gT2JqZWN0VXRpbHMuZmluZEluZGV4SW5MaXN0KHNlbGVjdGVkSXRlbSwgdGhpcy52YWx1ZSk7XG5cbiAgICAgICAgICAgICAgICBpZiAoc2VsZWN0ZWRJdGVtSW5kZXggIT0gdGhpcy52YWx1ZS5sZW5ndGggLSAxKSB7XG4gICAgICAgICAgICAgICAgICAgIGxldCBtb3ZlZEl0ZW0gPSB0aGlzLnZhbHVlLnNwbGljZShzZWxlY3RlZEl0ZW1JbmRleCwgMSlbMF07XG4gICAgICAgICAgICAgICAgICAgIHRoaXMudmFsdWUucHVzaChtb3ZlZEl0ZW0pO1xuICAgICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgaWYgKHRoaXMuZHJhZ2Ryb3AgJiYgdGhpcy5maWx0ZXJWYWx1ZSkgdGhpcy5maWx0ZXIoKTtcblxuICAgICAgICAgICAgdGhpcy5vblJlb3JkZXIuZW1pdCh0aGlzLnNlbGVjdGlvbik7XG4gICAgICAgICAgICB0aGlzLmxpc3RWaWV3Q2hpbGQubmF0aXZlRWxlbWVudC5zY3JvbGxUb3AgPSB0aGlzLmxpc3RWaWV3Q2hpbGQubmF0aXZlRWxlbWVudC5zY3JvbGxIZWlnaHQ7XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICBvbkRyb3AoZXZlbnQ6IENka0RyYWdEcm9wPHN0cmluZ1tdPikge1xuICAgICAgICBsZXQgcHJldmlvdXNJbmRleCA9IGV2ZW50LnByZXZpb3VzSW5kZXg7XG4gICAgICAgIGxldCBjdXJyZW50SW5kZXggPSBldmVudC5jdXJyZW50SW5kZXg7XG5cbiAgICAgICAgaWYgKHByZXZpb3VzSW5kZXggIT09IGN1cnJlbnRJbmRleCkge1xuICAgICAgICAgICAgaWYgKHRoaXMudmlzaWJsZU9wdGlvbnMpIHtcbiAgICAgICAgICAgICAgICBpZiAodGhpcy5maWx0ZXJWYWx1ZSkge1xuICAgICAgICAgICAgICAgICAgICBwcmV2aW91c0luZGV4ID0gT2JqZWN0VXRpbHMuZmluZEluZGV4SW5MaXN0KGV2ZW50Lml0ZW0uZGF0YSwgdGhpcy52YWx1ZSk7XG4gICAgICAgICAgICAgICAgICAgIGN1cnJlbnRJbmRleCA9IE9iamVjdFV0aWxzLmZpbmRJbmRleEluTGlzdCh0aGlzLnZpc2libGVPcHRpb25zW2N1cnJlbnRJbmRleF0sIHRoaXMudmFsdWUpO1xuICAgICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgICAgIG1vdmVJdGVtSW5BcnJheSh0aGlzLnZpc2libGVPcHRpb25zLCBldmVudC5wcmV2aW91c0luZGV4LCBldmVudC5jdXJyZW50SW5kZXgpO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICBtb3ZlSXRlbUluQXJyYXkodGhpcy52YWx1ZSwgcHJldmlvdXNJbmRleCwgY3VycmVudEluZGV4KTtcbiAgICAgICAgICAgIHRoaXMub25SZW9yZGVyLmVtaXQoW2V2ZW50Lml0ZW0uZGF0YV0pO1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgb25JdGVtS2V5ZG93bihldmVudDogS2V5Ym9hcmRFdmVudCwgaXRlbSwgaW5kZXg6IE51bWJlcikge1xuICAgICAgICBsZXQgbGlzdEl0ZW0gPSA8SFRNTExJRWxlbWVudD5ldmVudC5jdXJyZW50VGFyZ2V0O1xuXG4gICAgICAgIHN3aXRjaCAoZXZlbnQud2hpY2gpIHtcbiAgICAgICAgICAgIC8vZG93blxuICAgICAgICAgICAgY2FzZSA0MDpcbiAgICAgICAgICAgICAgICB2YXIgbmV4dEl0ZW0gPSB0aGlzLmZpbmROZXh0SXRlbShsaXN0SXRlbSk7XG4gICAgICAgICAgICAgICAgaWYgKG5leHRJdGVtKSB7XG4gICAgICAgICAgICAgICAgICAgIG5leHRJdGVtLmZvY3VzKCk7XG4gICAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAgICAgZXZlbnQucHJldmVudERlZmF1bHQoKTtcbiAgICAgICAgICAgICAgICBicmVhaztcblxuICAgICAgICAgICAgLy91cFxuICAgICAgICAgICAgY2FzZSAzODpcbiAgICAgICAgICAgICAgICB2YXIgcHJldkl0ZW0gPSB0aGlzLmZpbmRQcmV2SXRlbShsaXN0SXRlbSk7XG4gICAgICAgICAgICAgICAgaWYgKHByZXZJdGVtKSB7XG4gICAgICAgICAgICAgICAgICAgIHByZXZJdGVtLmZvY3VzKCk7XG4gICAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAgICAgZXZlbnQucHJldmVudERlZmF1bHQoKTtcbiAgICAgICAgICAgICAgICBicmVhaztcblxuICAgICAgICAgICAgLy9lbnRlclxuICAgICAgICAgICAgY2FzZSAxMzpcbiAgICAgICAgICAgICAgICB0aGlzLm9uSXRlbUNsaWNrKGV2ZW50LCBpdGVtLCBpbmRleCk7XG4gICAgICAgICAgICAgICAgZXZlbnQucHJldmVudERlZmF1bHQoKTtcbiAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgfVxuICAgIH1cblxuICAgIGZpbmROZXh0SXRlbShpdGVtKSB7XG4gICAgICAgIGxldCBuZXh0SXRlbSA9IGl0ZW0ubmV4dEVsZW1lbnRTaWJsaW5nO1xuXG4gICAgICAgIGlmIChuZXh0SXRlbSkgcmV0dXJuICFEb21IYW5kbGVyLmhhc0NsYXNzKG5leHRJdGVtLCAncC1vcmRlcmxpc3QtaXRlbScpIHx8IERvbUhhbmRsZXIuaXNIaWRkZW4obmV4dEl0ZW0pID8gdGhpcy5maW5kTmV4dEl0ZW0obmV4dEl0ZW0pIDogbmV4dEl0ZW07XG4gICAgICAgIGVsc2UgcmV0dXJuIG51bGw7XG4gICAgfVxuXG4gICAgZmluZFByZXZJdGVtKGl0ZW0pIHtcbiAgICAgICAgbGV0IHByZXZJdGVtID0gaXRlbS5wcmV2aW91c0VsZW1lbnRTaWJsaW5nO1xuXG4gICAgICAgIGlmIChwcmV2SXRlbSkgcmV0dXJuICFEb21IYW5kbGVyLmhhc0NsYXNzKHByZXZJdGVtLCAncC1vcmRlcmxpc3QtaXRlbScpIHx8IERvbUhhbmRsZXIuaXNIaWRkZW4ocHJldkl0ZW0pID8gdGhpcy5maW5kUHJldkl0ZW0ocHJldkl0ZW0pIDogcHJldkl0ZW07XG4gICAgICAgIGVsc2UgcmV0dXJuIG51bGw7XG4gICAgfVxuXG4gICAgbW92ZURpc2FibGVkKCkge1xuICAgICAgICBpZiAodGhpcy5kaXNhYmxlZCB8fCAhdGhpcy5zZWxlY3Rpb24ubGVuZ3RoKSB7XG4gICAgICAgICAgICByZXR1cm4gdHJ1ZTtcbiAgICAgICAgfVxuICAgIH1cblxuICAgIGNyZWF0ZVN0eWxlKCkge1xuICAgICAgICBpZiAoIXRoaXMuc3R5bGVFbGVtZW50KSB7XG4gICAgICAgICAgICB0aGlzLmVsLm5hdGl2ZUVsZW1lbnQuY2hpbGRyZW5bMF0uc2V0QXR0cmlidXRlKHRoaXMuaWQsICcnKTtcbiAgICAgICAgICAgIHRoaXMuc3R5bGVFbGVtZW50ID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnc3R5bGUnKTtcbiAgICAgICAgICAgIHRoaXMuc3R5bGVFbGVtZW50LnR5cGUgPSAndGV4dC9jc3MnO1xuICAgICAgICAgICAgZG9jdW1lbnQuaGVhZC5hcHBlbmRDaGlsZCh0aGlzLnN0eWxlRWxlbWVudCk7XG5cbiAgICAgICAgICAgIGxldCBpbm5lckhUTUwgPSBgXG4gICAgICAgICAgICAgICAgQG1lZGlhIHNjcmVlbiBhbmQgKG1heC13aWR0aDogJHt0aGlzLmJyZWFrcG9pbnR9KSB7XG4gICAgICAgICAgICAgICAgICAgIC5wLW9yZGVybGlzdFske3RoaXMuaWR9XSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBmbGV4LWRpcmVjdGlvbjogY29sdW1uO1xuICAgICAgICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgICAgICAgICAgLnAtb3JkZXJsaXN0WyR7dGhpcy5pZH1dIC5wLW9yZGVybGlzdC1jb250cm9scyB7XG4gICAgICAgICAgICAgICAgICAgICAgICBwYWRkaW5nOiB2YXIoLS1jb250ZW50LXBhZGRpbmcpO1xuICAgICAgICAgICAgICAgICAgICAgICAgZmxleC1kaXJlY3Rpb246IHJvdztcbiAgICAgICAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAgICAgICAgIC5wLW9yZGVybGlzdFske3RoaXMuaWR9XSAucC1vcmRlcmxpc3QtY29udHJvbHMgLnAtYnV0dG9uIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIG1hcmdpbi1yaWdodDogdmFyKC0taW5saW5lLXNwYWNpbmcpO1xuICAgICAgICAgICAgICAgICAgICAgICAgbWFyZ2luLWJvdHRvbTogMDtcbiAgICAgICAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAgICAgICAgIC5wLW9yZGVybGlzdFske3RoaXMuaWR9XSAucC1vcmRlcmxpc3QtY29udHJvbHMgLnAtYnV0dG9uOmxhc3QtY2hpbGQge1xuICAgICAgICAgICAgICAgICAgICAgICAgbWFyZ2luLXJpZ2h0OiAwO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgYDtcblxuICAgICAgICAgICAgdGhpcy5zdHlsZUVsZW1lbnQuaW5uZXJIVE1MID0gaW5uZXJIVE1MO1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgZGVzdHJveVN0eWxlKCkge1xuICAgICAgICBpZiAodGhpcy5zdHlsZUVsZW1lbnQpIHtcbiAgICAgICAgICAgIGRvY3VtZW50LmhlYWQucmVtb3ZlQ2hpbGQodGhpcy5zdHlsZUVsZW1lbnQpO1xuICAgICAgICAgICAgdGhpcy5zdHlsZUVsZW1lbnQgPSBudWxsO1xuICAgICAgICAgICAgYGA7XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICBuZ09uRGVzdHJveSgpIHtcbiAgICAgICAgdGhpcy5kZXN0cm95U3R5bGUoKTtcbiAgICB9XG59XG5cbkBOZ01vZHVsZSh7XG4gICAgaW1wb3J0czogW0NvbW1vbk1vZHVsZSwgQnV0dG9uTW9kdWxlLCBTaGFyZWRNb2R1bGUsIFJpcHBsZU1vZHVsZSwgRHJhZ0Ryb3BNb2R1bGVdLFxuICAgIGV4cG9ydHM6IFtPcmRlckxpc3QsIFNoYXJlZE1vZHVsZSwgRHJhZ0Ryb3BNb2R1bGVdLFxuICAgIGRlY2xhcmF0aW9uczogW09yZGVyTGlzdF1cbn0pXG5leHBvcnQgY2xhc3MgT3JkZXJMaXN0TW9kdWxlIHt9XG4iXX0=
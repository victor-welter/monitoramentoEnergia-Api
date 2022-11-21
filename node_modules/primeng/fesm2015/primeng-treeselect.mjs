import * as i2 from '@angular/common';
import { CommonModule } from '@angular/common';
import * as i0 from '@angular/core';
import { forwardRef, EventEmitter, Component, ChangeDetectionStrategy, ViewEncapsulation, Input, ContentChildren, ViewChild, Output, NgModule } from '@angular/core';
import { NG_VALUE_ACCESSOR } from '@angular/forms';
import * as i1 from 'primeng/api';
import { PrimeTemplate, SharedModule } from 'primeng/api';
import { DomHandler } from 'primeng/dom';
import * as i3 from 'primeng/overlay';
import { OverlayModule } from 'primeng/overlay';
import { RippleModule } from 'primeng/ripple';
import * as i4 from 'primeng/tree';
import { TreeModule } from 'primeng/tree';
import { ObjectUtils } from 'primeng/utils';

const TREESELECT_VALUE_ACCESSOR = {
    provide: NG_VALUE_ACCESSOR,
    useExisting: forwardRef(() => TreeSelect),
    multi: true
};
class TreeSelect {
    constructor(config, cd, el, overlayService) {
        this.config = config;
        this.cd = cd;
        this.el = el;
        this.overlayService = overlayService;
        this.type = 'button';
        this.scrollHeight = '400px';
        this.metaKeySelection = true;
        this.display = 'comma';
        this.selectionMode = 'single';
        this.emptyMessage = '';
        this.filter = false;
        this.filterBy = 'label';
        this.filterMode = 'lenient';
        this.filterInputAutoFocus = true;
        this.propagateSelectionDown = true;
        this.propagateSelectionUp = true;
        this.showClear = false;
        this.resetFilterOnHide = true;
        this.onNodeExpand = new EventEmitter();
        this.onNodeCollapse = new EventEmitter();
        this.onShow = new EventEmitter();
        this.onHide = new EventEmitter();
        this.onClear = new EventEmitter();
        this.onFilter = new EventEmitter();
        this.onNodeUnselect = new EventEmitter();
        this.onNodeSelect = new EventEmitter();
        this.filterValue = null;
        this.expandedNodes = [];
        this.onModelChange = () => { };
        this.onModelTouched = () => { };
    }
    get options() {
        return this._options;
    }
    set options(options) {
        this._options = options;
        this.updateTreeState();
    }
    get showTransitionOptions() {
        return this._showTransitionOptions;
    }
    set showTransitionOptions(val) {
        this._showTransitionOptions = val;
        console.warn('The showTransitionOptions property is deprecated since v14.2.0, use overlayOptions property instead.');
    }
    get hideTransitionOptions() {
        return this._hideTransitionOptions;
    }
    set hideTransitionOptions(val) {
        this._hideTransitionOptions = val;
        console.warn('The hideTransitionOptions property is deprecated since v14.2.0, use overlayOptions property instead.');
    }
    ngOnInit() {
        this.updateTreeState();
    }
    ngAfterContentInit() {
        if (this.templates.length) {
            this.templateMap = {};
        }
        this.templates.forEach((item) => {
            switch (item.getType()) {
                case 'value':
                    this.valueTemplate = item.template;
                    break;
                case 'header':
                    this.headerTemplate = item.template;
                    break;
                case 'empty':
                    this.emptyTemplate = item.template;
                    break;
                case 'footer':
                    this.footerTemplate = item.template;
                    break;
                default: //TODO: @deprecated Used "value" template instead
                    if (item.name)
                        this.templateMap[item.name] = item.template;
                    else
                        this.valueTemplate = item.template;
                    break;
            }
        });
    }
    onOverlayAnimationStart(event) {
        var _a;
        switch (event.toState) {
            case 'visible':
                if (this.filter) {
                    ObjectUtils.isNotEmpty(this.filterValue) && ((_a = this.treeViewChild) === null || _a === void 0 ? void 0 : _a._filter(this.filterValue));
                    this.filterInputAutoFocus && this.filterViewChild.nativeElement.focus();
                }
                break;
        }
    }
    onSelectionChange(event) {
        this.value = event;
        this.onModelChange(this.value);
        this.cd.markForCheck();
    }
    onClick(event) {
        var _a, _b, _c;
        if (this.disabled) {
            return;
        }
        if (!((_c = (_b = (_a = this.overlayViewChild) === null || _a === void 0 ? void 0 : _a.el) === null || _b === void 0 ? void 0 : _b.nativeElement) === null || _c === void 0 ? void 0 : _c.contains(event.target)) && !DomHandler.hasClass(event.target, 'p-treeselect-close')) {
            if (this.overlayVisible) {
                this.hide();
            }
            else {
                this.show();
            }
            this.focusInput.nativeElement.focus();
        }
    }
    onKeyDown(event) {
        var _a;
        switch (event.which) {
            //down
            case 40:
                if (!this.overlayVisible && event.altKey) {
                    this.show();
                    event.preventDefault();
                }
                else if (this.overlayVisible && ((_a = this.panelEl) === null || _a === void 0 ? void 0 : _a.nativeElement)) {
                    let focusableElements = DomHandler.getFocusableElements(this.panelEl.nativeElement);
                    if (focusableElements && focusableElements.length > 0) {
                        focusableElements[0].focus();
                    }
                    event.preventDefault();
                }
                break;
            //space
            case 32:
                if (!this.overlayVisible) {
                    this.show();
                    event.preventDefault();
                }
                break;
            //enter and escape
            case 13:
            case 27:
                if (this.overlayVisible) {
                    this.hide();
                    event.preventDefault();
                }
                break;
            //tab
            case 9:
                this.hide();
                break;
            default:
                break;
        }
    }
    onFilterInput(event) {
        var _a, _b;
        this.filterValue = event.target.value;
        (_a = this.treeViewChild) === null || _a === void 0 ? void 0 : _a._filter(this.filterValue);
        this.onFilter.emit({
            originalEvent: event,
            filteredValue: (_b = this.treeViewChild) === null || _b === void 0 ? void 0 : _b.filteredNodes
        });
    }
    show() {
        this.overlayVisible = true;
    }
    hide(event) {
        this.overlayVisible = false;
        this.resetFilter();
        this.onHide.emit(event);
        this.cd.markForCheck();
    }
    clear(event) {
        this.value = null;
        this.resetExpandedNodes();
        this.resetPartialSelected();
        this.onModelChange(this.value);
        this.onClear.emit();
        event.stopPropagation();
    }
    checkValue() {
        return this.value !== null && ObjectUtils.isNotEmpty(this.value);
    }
    resetFilter() {
        var _a, _b;
        if (this.filter && !this.resetFilterOnHide) {
            this.filteredNodes = (_a = this.treeViewChild) === null || _a === void 0 ? void 0 : _a.filteredNodes;
            (_b = this.treeViewChild) === null || _b === void 0 ? void 0 : _b.resetFilter();
        }
        else {
            this.filterValue = null;
        }
    }
    updateTreeState() {
        if (this.value) {
            let selectedNodes = this.selectionMode === 'single' ? [this.value] : [...this.value];
            this.resetExpandedNodes();
            this.resetPartialSelected();
            if (selectedNodes && this.options) {
                this.updateTreeBranchState(null, null, selectedNodes);
            }
        }
    }
    updateTreeBranchState(node, path, selectedNodes) {
        if (node) {
            if (this.isSelected(node)) {
                this.expandPath(path);
                selectedNodes.splice(selectedNodes.indexOf(node), 1);
            }
            if (selectedNodes.length > 0 && node.children) {
                for (let childNode of node.children) {
                    this.updateTreeBranchState(childNode, [...path, node], selectedNodes);
                }
            }
        }
        else {
            for (let childNode of this.options) {
                this.updateTreeBranchState(childNode, [], selectedNodes);
            }
        }
    }
    expandPath(expandedNodes) {
        for (let node of expandedNodes) {
            node.expanded = true;
        }
        this.expandedNodes = [...expandedNodes];
    }
    nodeExpand(event) {
        this.onNodeExpand.emit(event);
        this.expandedNodes.push(event.node);
    }
    nodeCollapse(event) {
        this.onNodeCollapse.emit(event);
        this.expandedNodes.splice(this.expandedNodes.indexOf(event.node), 1);
    }
    resetExpandedNodes() {
        for (let node of this.expandedNodes) {
            node.expanded = false;
        }
        this.expandedNodes = [];
    }
    resetPartialSelected(nodes = this.options) {
        var _a;
        if (!nodes) {
            return;
        }
        for (let node of nodes) {
            node.partialSelected = false;
            if (node.children && ((_a = node.children) === null || _a === void 0 ? void 0 : _a.length) > 0) {
                this.resetPartialSelected(node.children);
            }
        }
    }
    findSelectedNodes(node, keys, selectedNodes) {
        if (node) {
            if (this.isSelected(node)) {
                selectedNodes.push(node);
                delete keys[node.key];
            }
            if (Object.keys(keys).length && node.children) {
                for (let childNode of node.children) {
                    this.findSelectedNodes(childNode, keys, selectedNodes);
                }
            }
        }
        else {
            for (let childNode of this.options) {
                this.findSelectedNodes(childNode, keys, selectedNodes);
            }
        }
    }
    isSelected(node) {
        return this.findIndexInSelection(node) != -1;
    }
    findIndexInSelection(node) {
        let index = -1;
        if (this.value) {
            if (this.selectionMode === 'single') {
                let areNodesEqual = (this.value.key && this.value.key === node.key) || this.value == node;
                index = areNodesEqual ? 0 : -1;
            }
            else {
                for (let i = 0; i < this.value.length; i++) {
                    let selectedNode = this.value[i];
                    let areNodesEqual = (selectedNode.key && selectedNode.key === node.key) || selectedNode == node;
                    if (areNodesEqual) {
                        index = i;
                        break;
                    }
                }
            }
        }
        return index;
    }
    onSelect(node) {
        this.onNodeSelect.emit(node);
        if (this.selectionMode === 'single') {
            this.hide();
        }
    }
    onUnselect(node) {
        this.onNodeUnselect.emit(node);
    }
    onFocus() {
        this.focused = true;
    }
    onBlur() {
        this.focused = false;
    }
    writeValue(value) {
        this.value = value;
        this.updateTreeState();
        this.cd.markForCheck();
    }
    registerOnChange(fn) {
        this.onModelChange = fn;
    }
    registerOnTouched(fn) {
        this.onModelTouched = fn;
    }
    setDisabledState(val) {
        this.disabled = val;
        this.cd.markForCheck();
    }
    containerClass() {
        return {
            'p-treeselect p-component p-inputwrapper': true,
            'p-treeselect-chip': this.display === 'chip',
            'p-disabled': this.disabled,
            'p-focus': this.focused
        };
    }
    labelClass() {
        return {
            'p-treeselect-label': true,
            'p-placeholder': this.label === this.placeholder,
            'p-treeselect-label-empty': !this.placeholder && this.emptyValue
        };
    }
    get emptyValue() {
        return !this.value || Object.keys(this.value).length === 0;
    }
    get emptyOptions() {
        return !this.options || this.options.length === 0;
    }
    get label() {
        let value = this.value || [];
        return value.length ? value.map((node) => node.label).join(', ') : this.selectionMode === 'single' && this.value ? value.label : this.placeholder;
    }
}
TreeSelect.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "14.0.7", ngImport: i0, type: TreeSelect, deps: [{ token: i1.PrimeNGConfig }, { token: i0.ChangeDetectorRef }, { token: i0.ElementRef }, { token: i1.OverlayService }], target: i0.ɵɵFactoryTarget.Component });
TreeSelect.ɵcmp = i0.ɵɵngDeclareComponent({ minVersion: "14.0.0", version: "14.0.7", type: TreeSelect, selector: "p-treeSelect", inputs: { type: "type", inputId: "inputId", scrollHeight: "scrollHeight", disabled: "disabled", metaKeySelection: "metaKeySelection", display: "display", selectionMode: "selectionMode", tabindex: "tabindex", ariaLabelledBy: "ariaLabelledBy", placeholder: "placeholder", panelClass: "panelClass", panelStyle: "panelStyle", panelStyleClass: "panelStyleClass", containerStyle: "containerStyle", containerStyleClass: "containerStyleClass", labelStyle: "labelStyle", labelStyleClass: "labelStyleClass", overlayOptions: "overlayOptions", emptyMessage: "emptyMessage", appendTo: "appendTo", filter: "filter", filterBy: "filterBy", filterMode: "filterMode", filterPlaceholder: "filterPlaceholder", filterLocale: "filterLocale", filterInputAutoFocus: "filterInputAutoFocus", propagateSelectionDown: "propagateSelectionDown", propagateSelectionUp: "propagateSelectionUp", showClear: "showClear", resetFilterOnHide: "resetFilterOnHide", options: "options", showTransitionOptions: "showTransitionOptions", hideTransitionOptions: "hideTransitionOptions" }, outputs: { onNodeExpand: "onNodeExpand", onNodeCollapse: "onNodeCollapse", onShow: "onShow", onHide: "onHide", onClear: "onClear", onFilter: "onFilter", onNodeUnselect: "onNodeUnselect", onNodeSelect: "onNodeSelect" }, host: { properties: { "class.p-inputwrapper-filled": "!emptyValue", "class.p-inputwrapper-focus": "focused || overlayVisible", "class.p-treeselect-clearable": "showClear && !disabled" }, classAttribute: "p-element p-inputwrapper" }, providers: [TREESELECT_VALUE_ACCESSOR], queries: [{ propertyName: "templates", predicate: PrimeTemplate }], viewQueries: [{ propertyName: "containerEl", first: true, predicate: ["container"], descendants: true }, { propertyName: "focusInput", first: true, predicate: ["focusInput"], descendants: true }, { propertyName: "filterViewChild", first: true, predicate: ["filter"], descendants: true }, { propertyName: "treeViewChild", first: true, predicate: ["tree"], descendants: true }, { propertyName: "panelEl", first: true, predicate: ["panel"], descendants: true }, { propertyName: "overlayViewChild", first: true, predicate: ["overlay"], descendants: true }], ngImport: i0, template: `
        <div #container [ngClass]="containerClass()" [class]="containerStyleClass" [ngStyle]="containerStyle" (click)="onClick($event)">
            <div class="p-hidden-accessible">
                <input
                    #focusInput
                    type="text"
                    role="listbox"
                    [attr.id]="inputId"
                    readonly
                    [disabled]="disabled"
                    (focus)="onFocus()"
                    (blur)="onBlur()"
                    (keydown)="onKeyDown($event)"
                    [attr.tabindex]="tabindex"
                    aria-haspopup="true"
                    [attr.aria-expanded]="overlayVisible"
                    [attr.aria-labelledby]="ariaLabelledBy"
                />
            </div>
            <div class="p-treeselect-label-container">
                <div [ngClass]="labelClass()" [class]="labelStyleClass" [ngStyle]="labelStyle">
                    <ng-container *ngIf="valueTemplate; else defaultValueTemplate">
                        <ng-container *ngTemplateOutlet="valueTemplate; context: { $implicit: value, placeholder: placeholder }"></ng-container>
                    </ng-container>
                    <ng-template #defaultValueTemplate>
                        <ng-container *ngIf="display === 'comma'; else chipsValueTemplate">
                            {{ label || 'empty' }}
                        </ng-container>
                        <ng-template #chipsValueTemplate>
                            <div *ngFor="let node of value" class="p-treeselect-token">
                                <span class="p-treeselect-token-label">{{ node.label }}</span>
                            </div>
                            <ng-container *ngIf="emptyValue">{{ placeholder || 'empty' }}</ng-container>
                        </ng-template>
                    </ng-template>
                </div>
                <i *ngIf="checkValue() && !disabled && showClear" class="p-treeselect-clear-icon pi pi-times" (click)="clear($event)"></i>
            </div>
            <div class="p-treeselect-trigger">
                <span class="p-treeselect-trigger-icon pi pi-chevron-down"></span>
            </div>
            <p-overlay
                #overlay
                [(visible)]="overlayVisible"
                [options]="overlayOptions"
                [target]="'@parent'"
                [appendTo]="appendTo"
                [showTransitionOptions]="showTransitionOptions"
                [hideTransitionOptions]="hideTransitionOptions"
                (onAnimationStart)="onOverlayAnimationStart($event)"
                (onShow)="onShow.emit($event)"
                (onHide)="hide($event)"
            >
                <ng-template pTemplate="content">
                    <div #panel class="p-treeselect-panel p-component" [ngStyle]="panelStyle" [class]="panelStyleClass">
                        <ng-container *ngTemplateOutlet="headerTemplate; context: { $implicit: value, options: options }"></ng-container>
                        <div class="p-treeselect-header" *ngIf="filter">
                            <div class="p-treeselect-filter-container">
                                <input
                                    #filter
                                    type="text"
                                    autocomplete="off"
                                    class="p-treeselect-filter p-inputtext p-component"
                                    [attr.placeholder]="filterPlaceholder"
                                    (keydown.enter)="$event.preventDefault()"
                                    (input)="onFilterInput($event)"
                                    [value]="filterValue"
                                />
                                <span class="p-treeselect-filter-icon pi pi-search"></span>
                            </div>
                            <button class="p-treeselect-close p-link" (click)="hide()">
                                <span class="p-treeselect-filter-icon pi pi-times"></span>
                            </button>
                        </div>
                        <div class="p-treeselect-items-wrapper" [ngStyle]="{ 'max-height': scrollHeight }">
                            <p-tree
                                #tree
                                [value]="options"
                                [propagateSelectionDown]="propagateSelectionDown"
                                [propagateSelectionUp]="propagateSelectionUp"
                                [selectionMode]="selectionMode"
                                (selectionChange)="onSelectionChange($event)"
                                [selection]="value"
                                [metaKeySelection]="metaKeySelection"
                                (onNodeExpand)="nodeExpand($event)"
                                (onNodeCollapse)="nodeCollapse($event)"
                                (onNodeSelect)="onSelect($event)"
                                [emptyMessage]="emptyMessage"
                                (onNodeUnselect)="onUnselect($event)"
                                [filterBy]="filterBy"
                                [filterMode]="filterMode"
                                [filterPlaceholder]="filterPlaceholder"
                                [filterLocale]="filterLocale"
                                [filteredNodes]="filteredNodes"
                                [_templateMap]="templateMap"
                            >
                                <ng-container *ngIf="emptyTemplate">
                                    <ng-template pTemplate="empty">
                                        <ng-container *ngTemplateOutlet="emptyTemplate"></ng-container>
                                    </ng-template>
                                </ng-container>
                            </p-tree>
                        </div>
                        <ng-container *ngTemplateOutlet="footerTemplate; context: { $implicit: value, options: options }"></ng-container>
                    </div>
                </ng-template>
            </p-overlay>
        </div>
    `, isInline: true, styles: [".p-treeselect{display:inline-flex;cursor:pointer;position:relative;-webkit-user-select:none;user-select:none}.p-treeselect-trigger{display:flex;align-items:center;justify-content:center;flex-shrink:0}.p-treeselect-label-container{overflow:hidden;flex:1 1 auto;cursor:pointer}.p-treeselect-label{display:block;white-space:nowrap;cursor:pointer;overflow:hidden;text-overflow:ellipsis}.p-treeselect-label-empty{overflow:hidden;visibility:hidden}.p-treeselect-token{cursor:default;display:inline-flex;align-items:center;flex:0 0 auto}.p-treeselect-items-wrapper{overflow:auto}.p-treeselect-header{display:flex;align-items:center;justify-content:space-between}.p-treeselect-filter-container{position:relative;flex:1 1 auto}.p-treeselect-filter-icon{position:absolute;top:50%;margin-top:-.5rem}.p-treeselect-filter-container .p-inputtext{width:100%}.p-treeselect-close{display:flex;align-items:center;justify-content:center;flex-shrink:0;overflow:hidden;position:relative;margin-left:auto}.p-treeselect-clear-icon{position:absolute;top:50%;margin-top:-.5rem}.p-fluid .p-treeselect{display:flex}.p-treeselect-clear-icon{position:absolute;top:50%;margin-top:-.5rem;cursor:pointer}.p-treeselect-clearable{position:relative}\n"], dependencies: [{ kind: "directive", type: i2.NgClass, selector: "[ngClass]", inputs: ["class", "ngClass"] }, { kind: "directive", type: i2.NgForOf, selector: "[ngFor][ngForOf]", inputs: ["ngForOf", "ngForTrackBy", "ngForTemplate"] }, { kind: "directive", type: i2.NgIf, selector: "[ngIf]", inputs: ["ngIf", "ngIfThen", "ngIfElse"] }, { kind: "directive", type: i2.NgTemplateOutlet, selector: "[ngTemplateOutlet]", inputs: ["ngTemplateOutletContext", "ngTemplateOutlet", "ngTemplateOutletInjector"] }, { kind: "directive", type: i2.NgStyle, selector: "[ngStyle]", inputs: ["ngStyle"] }, { kind: "component", type: i3.Overlay, selector: "p-overlay", inputs: ["visible", "mode", "style", "styleClass", "contentStyle", "contentStyleClass", "target", "appendTo", "autoZIndex", "baseZIndex", "showTransitionOptions", "hideTransitionOptions", "listener", "responsive", "options"], outputs: ["visibleChange", "onBeforeShow", "onShow", "onBeforeHide", "onHide", "onAnimationStart", "onAnimationDone"] }, { kind: "directive", type: i1.PrimeTemplate, selector: "[pTemplate]", inputs: ["type", "pTemplate"] }, { kind: "component", type: i4.Tree, selector: "p-tree", inputs: ["value", "selectionMode", "selection", "style", "styleClass", "contextMenu", "layout", "draggableScope", "droppableScope", "draggableNodes", "droppableNodes", "metaKeySelection", "propagateSelectionUp", "propagateSelectionDown", "loading", "loadingIcon", "emptyMessage", "ariaLabel", "togglerAriaLabel", "ariaLabelledBy", "validateDrop", "filter", "filterBy", "filterMode", "filterPlaceholder", "filteredNodes", "filterLocale", "scrollHeight", "lazy", "virtualScroll", "virtualScrollItemSize", "virtualScrollOptions", "indentation", "_templateMap", "trackBy", "virtualNodeHeight"], outputs: ["selectionChange", "onNodeSelect", "onNodeUnselect", "onNodeExpand", "onNodeCollapse", "onNodeContextMenuSelect", "onNodeDrop", "onLazyLoad", "onScroll", "onScrollIndexChange", "onFilter"] }], changeDetection: i0.ChangeDetectionStrategy.OnPush, encapsulation: i0.ViewEncapsulation.None });
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "14.0.7", ngImport: i0, type: TreeSelect, decorators: [{
            type: Component,
            args: [{ selector: 'p-treeSelect', template: `
        <div #container [ngClass]="containerClass()" [class]="containerStyleClass" [ngStyle]="containerStyle" (click)="onClick($event)">
            <div class="p-hidden-accessible">
                <input
                    #focusInput
                    type="text"
                    role="listbox"
                    [attr.id]="inputId"
                    readonly
                    [disabled]="disabled"
                    (focus)="onFocus()"
                    (blur)="onBlur()"
                    (keydown)="onKeyDown($event)"
                    [attr.tabindex]="tabindex"
                    aria-haspopup="true"
                    [attr.aria-expanded]="overlayVisible"
                    [attr.aria-labelledby]="ariaLabelledBy"
                />
            </div>
            <div class="p-treeselect-label-container">
                <div [ngClass]="labelClass()" [class]="labelStyleClass" [ngStyle]="labelStyle">
                    <ng-container *ngIf="valueTemplate; else defaultValueTemplate">
                        <ng-container *ngTemplateOutlet="valueTemplate; context: { $implicit: value, placeholder: placeholder }"></ng-container>
                    </ng-container>
                    <ng-template #defaultValueTemplate>
                        <ng-container *ngIf="display === 'comma'; else chipsValueTemplate">
                            {{ label || 'empty' }}
                        </ng-container>
                        <ng-template #chipsValueTemplate>
                            <div *ngFor="let node of value" class="p-treeselect-token">
                                <span class="p-treeselect-token-label">{{ node.label }}</span>
                            </div>
                            <ng-container *ngIf="emptyValue">{{ placeholder || 'empty' }}</ng-container>
                        </ng-template>
                    </ng-template>
                </div>
                <i *ngIf="checkValue() && !disabled && showClear" class="p-treeselect-clear-icon pi pi-times" (click)="clear($event)"></i>
            </div>
            <div class="p-treeselect-trigger">
                <span class="p-treeselect-trigger-icon pi pi-chevron-down"></span>
            </div>
            <p-overlay
                #overlay
                [(visible)]="overlayVisible"
                [options]="overlayOptions"
                [target]="'@parent'"
                [appendTo]="appendTo"
                [showTransitionOptions]="showTransitionOptions"
                [hideTransitionOptions]="hideTransitionOptions"
                (onAnimationStart)="onOverlayAnimationStart($event)"
                (onShow)="onShow.emit($event)"
                (onHide)="hide($event)"
            >
                <ng-template pTemplate="content">
                    <div #panel class="p-treeselect-panel p-component" [ngStyle]="panelStyle" [class]="panelStyleClass">
                        <ng-container *ngTemplateOutlet="headerTemplate; context: { $implicit: value, options: options }"></ng-container>
                        <div class="p-treeselect-header" *ngIf="filter">
                            <div class="p-treeselect-filter-container">
                                <input
                                    #filter
                                    type="text"
                                    autocomplete="off"
                                    class="p-treeselect-filter p-inputtext p-component"
                                    [attr.placeholder]="filterPlaceholder"
                                    (keydown.enter)="$event.preventDefault()"
                                    (input)="onFilterInput($event)"
                                    [value]="filterValue"
                                />
                                <span class="p-treeselect-filter-icon pi pi-search"></span>
                            </div>
                            <button class="p-treeselect-close p-link" (click)="hide()">
                                <span class="p-treeselect-filter-icon pi pi-times"></span>
                            </button>
                        </div>
                        <div class="p-treeselect-items-wrapper" [ngStyle]="{ 'max-height': scrollHeight }">
                            <p-tree
                                #tree
                                [value]="options"
                                [propagateSelectionDown]="propagateSelectionDown"
                                [propagateSelectionUp]="propagateSelectionUp"
                                [selectionMode]="selectionMode"
                                (selectionChange)="onSelectionChange($event)"
                                [selection]="value"
                                [metaKeySelection]="metaKeySelection"
                                (onNodeExpand)="nodeExpand($event)"
                                (onNodeCollapse)="nodeCollapse($event)"
                                (onNodeSelect)="onSelect($event)"
                                [emptyMessage]="emptyMessage"
                                (onNodeUnselect)="onUnselect($event)"
                                [filterBy]="filterBy"
                                [filterMode]="filterMode"
                                [filterPlaceholder]="filterPlaceholder"
                                [filterLocale]="filterLocale"
                                [filteredNodes]="filteredNodes"
                                [_templateMap]="templateMap"
                            >
                                <ng-container *ngIf="emptyTemplate">
                                    <ng-template pTemplate="empty">
                                        <ng-container *ngTemplateOutlet="emptyTemplate"></ng-container>
                                    </ng-template>
                                </ng-container>
                            </p-tree>
                        </div>
                        <ng-container *ngTemplateOutlet="footerTemplate; context: { $implicit: value, options: options }"></ng-container>
                    </div>
                </ng-template>
            </p-overlay>
        </div>
    `, host: {
                        class: 'p-element p-inputwrapper',
                        '[class.p-inputwrapper-filled]': '!emptyValue',
                        '[class.p-inputwrapper-focus]': 'focused || overlayVisible',
                        '[class.p-treeselect-clearable]': 'showClear && !disabled'
                    }, changeDetection: ChangeDetectionStrategy.OnPush, providers: [TREESELECT_VALUE_ACCESSOR], encapsulation: ViewEncapsulation.None, styles: [".p-treeselect{display:inline-flex;cursor:pointer;position:relative;-webkit-user-select:none;user-select:none}.p-treeselect-trigger{display:flex;align-items:center;justify-content:center;flex-shrink:0}.p-treeselect-label-container{overflow:hidden;flex:1 1 auto;cursor:pointer}.p-treeselect-label{display:block;white-space:nowrap;cursor:pointer;overflow:hidden;text-overflow:ellipsis}.p-treeselect-label-empty{overflow:hidden;visibility:hidden}.p-treeselect-token{cursor:default;display:inline-flex;align-items:center;flex:0 0 auto}.p-treeselect-items-wrapper{overflow:auto}.p-treeselect-header{display:flex;align-items:center;justify-content:space-between}.p-treeselect-filter-container{position:relative;flex:1 1 auto}.p-treeselect-filter-icon{position:absolute;top:50%;margin-top:-.5rem}.p-treeselect-filter-container .p-inputtext{width:100%}.p-treeselect-close{display:flex;align-items:center;justify-content:center;flex-shrink:0;overflow:hidden;position:relative;margin-left:auto}.p-treeselect-clear-icon{position:absolute;top:50%;margin-top:-.5rem}.p-fluid .p-treeselect{display:flex}.p-treeselect-clear-icon{position:absolute;top:50%;margin-top:-.5rem;cursor:pointer}.p-treeselect-clearable{position:relative}\n"] }]
        }], ctorParameters: function () { return [{ type: i1.PrimeNGConfig }, { type: i0.ChangeDetectorRef }, { type: i0.ElementRef }, { type: i1.OverlayService }]; }, propDecorators: { type: [{
                type: Input
            }], inputId: [{
                type: Input
            }], scrollHeight: [{
                type: Input
            }], disabled: [{
                type: Input
            }], metaKeySelection: [{
                type: Input
            }], display: [{
                type: Input
            }], selectionMode: [{
                type: Input
            }], tabindex: [{
                type: Input
            }], ariaLabelledBy: [{
                type: Input
            }], placeholder: [{
                type: Input
            }], panelClass: [{
                type: Input
            }], panelStyle: [{
                type: Input
            }], panelStyleClass: [{
                type: Input
            }], containerStyle: [{
                type: Input
            }], containerStyleClass: [{
                type: Input
            }], labelStyle: [{
                type: Input
            }], labelStyleClass: [{
                type: Input
            }], overlayOptions: [{
                type: Input
            }], emptyMessage: [{
                type: Input
            }], appendTo: [{
                type: Input
            }], filter: [{
                type: Input
            }], filterBy: [{
                type: Input
            }], filterMode: [{
                type: Input
            }], filterPlaceholder: [{
                type: Input
            }], filterLocale: [{
                type: Input
            }], filterInputAutoFocus: [{
                type: Input
            }], propagateSelectionDown: [{
                type: Input
            }], propagateSelectionUp: [{
                type: Input
            }], showClear: [{
                type: Input
            }], resetFilterOnHide: [{
                type: Input
            }], options: [{
                type: Input
            }], templates: [{
                type: ContentChildren,
                args: [PrimeTemplate]
            }], containerEl: [{
                type: ViewChild,
                args: ['container']
            }], focusInput: [{
                type: ViewChild,
                args: ['focusInput']
            }], filterViewChild: [{
                type: ViewChild,
                args: ['filter']
            }], treeViewChild: [{
                type: ViewChild,
                args: ['tree']
            }], panelEl: [{
                type: ViewChild,
                args: ['panel']
            }], overlayViewChild: [{
                type: ViewChild,
                args: ['overlay']
            }], onNodeExpand: [{
                type: Output
            }], onNodeCollapse: [{
                type: Output
            }], onShow: [{
                type: Output
            }], onHide: [{
                type: Output
            }], onClear: [{
                type: Output
            }], onFilter: [{
                type: Output
            }], onNodeUnselect: [{
                type: Output
            }], onNodeSelect: [{
                type: Output
            }], showTransitionOptions: [{
                type: Input
            }], hideTransitionOptions: [{
                type: Input
            }] } });
class TreeSelectModule {
}
TreeSelectModule.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "14.0.7", ngImport: i0, type: TreeSelectModule, deps: [], target: i0.ɵɵFactoryTarget.NgModule });
TreeSelectModule.ɵmod = i0.ɵɵngDeclareNgModule({ minVersion: "14.0.0", version: "14.0.7", ngImport: i0, type: TreeSelectModule, declarations: [TreeSelect], imports: [CommonModule, OverlayModule, RippleModule, SharedModule, TreeModule], exports: [TreeSelect, OverlayModule, SharedModule, TreeModule] });
TreeSelectModule.ɵinj = i0.ɵɵngDeclareInjector({ minVersion: "12.0.0", version: "14.0.7", ngImport: i0, type: TreeSelectModule, imports: [CommonModule, OverlayModule, RippleModule, SharedModule, TreeModule, OverlayModule, SharedModule, TreeModule] });
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "14.0.7", ngImport: i0, type: TreeSelectModule, decorators: [{
            type: NgModule,
            args: [{
                    imports: [CommonModule, OverlayModule, RippleModule, SharedModule, TreeModule],
                    exports: [TreeSelect, OverlayModule, SharedModule, TreeModule],
                    declarations: [TreeSelect]
                }]
        }] });

/**
 * Generated bundle index. Do not edit.
 */

export { TREESELECT_VALUE_ACCESSOR, TreeSelect, TreeSelectModule };
//# sourceMappingURL=primeng-treeselect.mjs.map

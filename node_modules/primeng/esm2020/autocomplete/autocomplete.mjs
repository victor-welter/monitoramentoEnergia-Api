import { NgModule, Component, ViewChild, Input, Output, EventEmitter, ContentChildren, forwardRef, ChangeDetectionStrategy, ViewEncapsulation } from '@angular/core';
import { CommonModule } from '@angular/common';
import { trigger, style, transition, animate } from '@angular/animations';
import { InputTextModule } from 'primeng/inputtext';
import { ButtonModule } from 'primeng/button';
import { RippleModule } from 'primeng/ripple';
import { SharedModule, PrimeTemplate, TranslationKeys } from 'primeng/api';
import { DomHandler, ConnectedOverlayScrollHandler } from 'primeng/dom';
import { ObjectUtils, UniqueComponentId, ZIndexUtils } from 'primeng/utils';
import { NG_VALUE_ACCESSOR } from '@angular/forms';
import { ScrollerModule } from 'primeng/scroller';
import { AutoFocusModule } from 'primeng/autofocus';
import * as i0 from "@angular/core";
import * as i1 from "primeng/api";
import * as i2 from "@angular/common";
import * as i3 from "primeng/button";
import * as i4 from "primeng/ripple";
import * as i5 from "primeng/scroller";
import * as i6 from "primeng/autofocus";
export const AUTOCOMPLETE_VALUE_ACCESSOR = {
    provide: NG_VALUE_ACCESSOR,
    useExisting: forwardRef(() => AutoComplete),
    multi: true
};
export class AutoComplete {
    constructor(el, renderer, cd, differs, config, overlayService) {
        this.el = el;
        this.renderer = renderer;
        this.cd = cd;
        this.differs = differs;
        this.config = config;
        this.overlayService = overlayService;
        this.minLength = 1;
        this.delay = 300;
        this.scrollHeight = '200px';
        this.lazy = false;
        this.type = 'text';
        this.autoZIndex = true;
        this.baseZIndex = 0;
        this.dropdownIcon = 'pi pi-chevron-down';
        this.unique = true;
        this.completeOnFocus = false;
        this.showClear = false;
        this.dropdownMode = 'blank';
        this.showTransitionOptions = '.12s cubic-bezier(0, 0, 0.2, 1)';
        this.hideTransitionOptions = '.1s linear';
        this.autocomplete = 'off';
        this.completeMethod = new EventEmitter();
        this.onSelect = new EventEmitter();
        this.onUnselect = new EventEmitter();
        this.onFocus = new EventEmitter();
        this.onBlur = new EventEmitter();
        this.onDropdownClick = new EventEmitter();
        this.onClear = new EventEmitter();
        this.onKeyUp = new EventEmitter();
        this.onShow = new EventEmitter();
        this.onHide = new EventEmitter();
        this.onLazyLoad = new EventEmitter();
        this.onModelChange = () => { };
        this.onModelTouched = () => { };
        this.overlayVisible = false;
        this.focus = false;
        this.inputFieldValue = null;
        this.inputValue = null;
        this.differ = differs.find([]).create(null);
        this.listId = UniqueComponentId() + '_list';
    }
    get itemSize() {
        return this._itemSize;
    }
    set itemSize(val) {
        this._itemSize = val;
        console.warn('The itemSize property is deprecated, use virtualScrollItemSize property instead.');
    }
    get suggestions() {
        return this._suggestions;
    }
    set suggestions(val) {
        this._suggestions = val;
        this.handleSuggestionsChange();
    }
    ngAfterViewChecked() {
        //Use timeouts as since Angular 4.2, AfterViewChecked is broken and not called after panel is updated
        if (this.suggestionsUpdated && this.overlay && this.overlay.offsetParent) {
            setTimeout(() => {
                if (this.overlay) {
                    this.alignOverlay();
                }
            }, 1);
            this.suggestionsUpdated = false;
        }
        if (this.highlightOptionChanged) {
            setTimeout(() => {
                if (this.overlay && this.itemsWrapper) {
                    let listItem = DomHandler.findSingle(this.overlay, 'li.p-highlight');
                    if (listItem) {
                        DomHandler.scrollInView(this.itemsWrapper, listItem);
                    }
                }
            }, 1);
            this.highlightOptionChanged = false;
        }
    }
    handleSuggestionsChange() {
        if (this._suggestions != null && this.loading) {
            this.highlightOption = null;
            if (this._suggestions.length) {
                this.noResults = false;
                this.show();
                this.suggestionsUpdated = true;
                if (this.autoHighlight) {
                    this.highlightOption = this._suggestions[0];
                }
            }
            else {
                this.noResults = true;
                if (this.showEmptyMessage) {
                    this.show();
                    this.suggestionsUpdated = true;
                }
                else {
                    this.hide();
                }
            }
            this.loading = false;
        }
    }
    ngAfterContentInit() {
        this.templates.forEach((item) => {
            switch (item.getType()) {
                case 'item':
                    this.itemTemplate = item.template;
                    break;
                case 'group':
                    this.groupTemplate = item.template;
                    break;
                case 'selectedItem':
                    this.selectedItemTemplate = item.template;
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
                case 'loader':
                    this.loaderTemplate = item.template;
                    break;
                default:
                    this.itemTemplate = item.template;
                    break;
            }
        });
    }
    writeValue(value) {
        this.value = value;
        this.filled = this.value && this.value != '';
        this.updateInputField();
        this.cd.markForCheck();
    }
    getOptionGroupChildren(optionGroup) {
        return this.optionGroupChildren ? ObjectUtils.resolveFieldData(optionGroup, this.optionGroupChildren) : optionGroup.items;
    }
    getOptionGroupLabel(optionGroup) {
        return this.optionGroupLabel ? ObjectUtils.resolveFieldData(optionGroup, this.optionGroupLabel) : optionGroup.label != undefined ? optionGroup.label : optionGroup;
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
    onInput(event) {
        // When an input element with a placeholder is clicked, the onInput event is invoked in IE.
        if (!this.inputKeyDown && DomHandler.isIE()) {
            return;
        }
        if (this.timeout) {
            clearTimeout(this.timeout);
        }
        let value = event.target.value;
        this.inputValue = value;
        if (!this.multiple && !this.forceSelection) {
            this.onModelChange(value);
        }
        if (value.length === 0 && !this.multiple) {
            this.value = null;
            this.hide();
            this.onClear.emit(event);
            this.onModelChange(value);
        }
        if (value.length >= this.minLength) {
            this.timeout = setTimeout(() => {
                this.search(event, value);
            }, this.delay);
        }
        else {
            this.hide();
        }
        this.updateFilledState();
        this.inputKeyDown = false;
    }
    onInputClick(event) {
        if (this.documentClickListener) {
            this.inputClick = true;
        }
    }
    search(event, query) {
        //allow empty string but not undefined or null
        if (query === undefined || query === null) {
            return;
        }
        this.loading = true;
        this.completeMethod.emit({
            originalEvent: event,
            query: query
        });
    }
    selectItem(option, focus = true) {
        if (this.forceSelectionUpdateModelTimeout) {
            clearTimeout(this.forceSelectionUpdateModelTimeout);
            this.forceSelectionUpdateModelTimeout = null;
        }
        if (this.multiple) {
            this.multiInputEL.nativeElement.value = '';
            this.value = this.value || [];
            if (!this.isSelected(option) || !this.unique) {
                this.value = [...this.value, option];
                this.onModelChange(this.value);
            }
        }
        else {
            this.inputEL.nativeElement.value = this.resolveFieldData(option);
            this.value = option;
            this.onModelChange(this.value);
        }
        this.onSelect.emit(option);
        this.updateFilledState();
        if (focus) {
            this.itemClicked = true;
            this.focusInput();
        }
    }
    show() {
        if (this.multiInputEL || this.inputEL) {
            let hasFocus = this.multiple ? this.multiInputEL.nativeElement.ownerDocument.activeElement == this.multiInputEL.nativeElement : this.inputEL.nativeElement.ownerDocument.activeElement == this.inputEL.nativeElement;
            if (!this.overlayVisible && hasFocus) {
                this.overlayVisible = true;
            }
        }
    }
    clear() {
        if (this.multiple) {
            this.value = null;
        }
        else {
            this.inputValue = null;
            this.inputEL.nativeElement.value = '';
        }
        this.updateFilledState();
        this.onModelChange(this.value);
        this.onClear.emit();
    }
    onOverlayAnimationStart(event) {
        switch (event.toState) {
            case 'visible':
                this.overlay = event.element;
                this.itemsWrapper = this.virtualScroll ? DomHandler.findSingle(this.overlay, '.p-scroller') : this.overlay;
                this.virtualScroll && this.scroller?.setContentEl(this.itemsViewChild.nativeElement);
                this.appendOverlay();
                if (this.autoZIndex) {
                    ZIndexUtils.set('overlay', this.overlay, this.baseZIndex + this.config.zIndex.overlay);
                }
                this.alignOverlay();
                this.bindDocumentClickListener();
                this.bindDocumentResizeListener();
                this.bindScrollListener();
                this.onShow.emit(event);
                break;
            case 'void':
                this.onOverlayHide();
                break;
        }
    }
    onOverlayAnimationEnd(event) {
        switch (event.toState) {
            case 'void':
                if (this.autoZIndex) {
                    ZIndexUtils.clear(event.element);
                }
                break;
        }
    }
    onOverlayClick(event) {
        this.overlayService.add({
            originalEvent: event,
            target: this.el.nativeElement
        });
    }
    appendOverlay() {
        if (this.appendTo) {
            if (this.appendTo === 'body')
                document.body.appendChild(this.overlay);
            else
                DomHandler.appendChild(this.overlay, this.appendTo);
            if (!this.overlay.style.minWidth) {
                this.overlay.style.minWidth = DomHandler.getWidth(this.el.nativeElement.children[0]) + 'px';
            }
        }
    }
    resolveFieldData(value) {
        let data = this.field ? ObjectUtils.resolveFieldData(value, this.field) : value;
        return data !== (null || undefined) ? data : '';
    }
    restoreOverlayAppend() {
        if (this.overlay && this.appendTo) {
            this.el.nativeElement.appendChild(this.overlay);
        }
    }
    alignOverlay() {
        if (this.appendTo)
            DomHandler.absolutePosition(this.overlay, this.multiple ? this.multiContainerEL.nativeElement : this.inputEL.nativeElement);
        else
            DomHandler.relativePosition(this.overlay, this.multiple ? this.multiContainerEL.nativeElement : this.inputEL.nativeElement);
    }
    hide() {
        this.overlayVisible = false;
        this.cd.markForCheck();
    }
    handleDropdownClick(event) {
        if (!this.overlayVisible) {
            this.focusInput();
            let queryValue = this.multiple ? this.multiInputEL.nativeElement.value : this.inputEL.nativeElement.value;
            if (this.dropdownMode === 'blank')
                this.search(event, '');
            else if (this.dropdownMode === 'current')
                this.search(event, queryValue);
            this.onDropdownClick.emit({
                originalEvent: event,
                query: queryValue
            });
        }
        else {
            this.hide();
        }
    }
    focusInput() {
        if (this.multiple)
            this.multiInputEL.nativeElement.focus();
        else
            this.inputEL.nativeElement.focus();
    }
    get emptyMessageLabel() {
        return this.emptyMessage || this.config.getTranslation(TranslationKeys.EMPTY_MESSAGE);
    }
    removeItem(item) {
        let itemIndex = DomHandler.index(item);
        let removedValue = this.value[itemIndex];
        this.value = this.value.filter((val, i) => i != itemIndex);
        this.onModelChange(this.value);
        this.updateFilledState();
        this.onUnselect.emit(removedValue);
    }
    onKeydown(event) {
        if (this.overlayVisible) {
            switch (event.which) {
                //down
                case 40:
                    if (this.group) {
                        let highlightItemIndex = this.findOptionGroupIndex(this.highlightOption, this.suggestions);
                        if (highlightItemIndex !== -1) {
                            let nextItemIndex = highlightItemIndex.itemIndex + 1;
                            if (nextItemIndex < this.getOptionGroupChildren(this.suggestions[highlightItemIndex.groupIndex]).length) {
                                this.highlightOption = this.getOptionGroupChildren(this.suggestions[highlightItemIndex.groupIndex])[nextItemIndex];
                                this.highlightOptionChanged = true;
                            }
                            else if (this.suggestions[highlightItemIndex.groupIndex + 1]) {
                                this.highlightOption = this.getOptionGroupChildren(this.suggestions[highlightItemIndex.groupIndex + 1])[0];
                                this.highlightOptionChanged = true;
                            }
                        }
                        else {
                            this.highlightOption = this.getOptionGroupChildren(this.suggestions[0])[0];
                        }
                    }
                    else {
                        let highlightItemIndex = this.findOptionIndex(this.highlightOption, this.suggestions);
                        if (highlightItemIndex != -1) {
                            var nextItemIndex = highlightItemIndex + 1;
                            if (nextItemIndex != this.suggestions.length) {
                                this.highlightOption = this.suggestions[nextItemIndex];
                                this.highlightOptionChanged = true;
                            }
                        }
                        else {
                            this.highlightOption = this.suggestions[0];
                        }
                    }
                    event.preventDefault();
                    break;
                //up
                case 38:
                    if (this.group) {
                        let highlightItemIndex = this.findOptionGroupIndex(this.highlightOption, this.suggestions);
                        if (highlightItemIndex !== -1) {
                            let prevItemIndex = highlightItemIndex.itemIndex - 1;
                            if (prevItemIndex >= 0) {
                                this.highlightOption = this.getOptionGroupChildren(this.suggestions[highlightItemIndex.groupIndex])[prevItemIndex];
                                this.highlightOptionChanged = true;
                            }
                            else if (prevItemIndex < 0) {
                                let prevGroup = this.suggestions[highlightItemIndex.groupIndex - 1];
                                if (prevGroup) {
                                    this.highlightOption = this.getOptionGroupChildren(prevGroup)[this.getOptionGroupChildren(prevGroup).length - 1];
                                    this.highlightOptionChanged = true;
                                }
                            }
                        }
                    }
                    else {
                        let highlightItemIndex = this.findOptionIndex(this.highlightOption, this.suggestions);
                        if (highlightItemIndex > 0) {
                            let prevItemIndex = highlightItemIndex - 1;
                            this.highlightOption = this.suggestions[prevItemIndex];
                            this.highlightOptionChanged = true;
                        }
                    }
                    event.preventDefault();
                    break;
                //enter
                case 13:
                    if (this.highlightOption) {
                        this.selectItem(this.highlightOption);
                        this.hide();
                    }
                    event.preventDefault();
                    break;
                //escape
                case 27:
                    this.hide();
                    event.preventDefault();
                    break;
                //tab
                case 9:
                    if (this.highlightOption) {
                        this.selectItem(this.highlightOption);
                    }
                    this.hide();
                    break;
            }
        }
        else {
            if (event.which === 40 && this.suggestions) {
                this.search(event, event.target.value);
            }
            else if (event.ctrlKey && event.key === 'z' && !this.multiple) {
                this.inputEL.nativeElement.value = this.resolveFieldData(null);
                this.value = '';
                this.onModelChange(this.value);
            }
            else if (event.ctrlKey && event.key === 'z' && this.multiple) {
                this.value.pop();
                this.onModelChange(this.value);
                this.updateFilledState();
            }
        }
        if (this.multiple) {
            switch (event.which) {
                //backspace
                case 8:
                    if (this.value && this.value.length && !this.multiInputEL.nativeElement.value) {
                        this.value = [...this.value];
                        const removedValue = this.value.pop();
                        this.onModelChange(this.value);
                        this.updateFilledState();
                        this.onUnselect.emit(removedValue);
                    }
                    break;
            }
        }
        this.inputKeyDown = true;
    }
    onKeyup(event) {
        this.onKeyUp.emit(event);
    }
    onInputFocus(event) {
        if (!this.itemClicked && this.completeOnFocus) {
            let queryValue = this.multiple ? this.multiInputEL.nativeElement.value : this.inputEL.nativeElement.value;
            this.search(event, queryValue);
        }
        this.focus = true;
        this.onFocus.emit(event);
        this.itemClicked = false;
    }
    onInputBlur(event) {
        this.focus = false;
        this.onModelTouched();
        this.onBlur.emit(event);
    }
    onInputChange(event) {
        if (this.forceSelection) {
            let valid = false;
            let inputValue = event.target.value.trim();
            if (this.suggestions) {
                for (let suggestion of this.suggestions) {
                    let itemValue = this.field ? ObjectUtils.resolveFieldData(suggestion, this.field) : suggestion;
                    if (itemValue && inputValue === itemValue.trim()) {
                        valid = true;
                        this.forceSelectionUpdateModelTimeout = setTimeout(() => {
                            this.selectItem(suggestion, false);
                        }, 250);
                        break;
                    }
                }
            }
            if (!valid) {
                if (this.multiple) {
                    this.multiInputEL.nativeElement.value = '';
                }
                else {
                    this.value = null;
                    this.inputEL.nativeElement.value = '';
                }
                this.onClear.emit(event);
                this.onModelChange(this.value);
                this.updateFilledState();
            }
        }
    }
    onInputPaste(event) {
        this.onKeydown(event);
    }
    isSelected(val) {
        let selected = false;
        if (this.value && this.value.length) {
            for (let i = 0; i < this.value.length; i++) {
                if (ObjectUtils.equals(this.value[i], val, this.dataKey)) {
                    selected = true;
                    break;
                }
            }
        }
        return selected;
    }
    findOptionIndex(option, suggestions) {
        let index = -1;
        if (suggestions) {
            for (let i = 0; i < suggestions.length; i++) {
                if (ObjectUtils.equals(option, suggestions[i])) {
                    index = i;
                    break;
                }
            }
        }
        return index;
    }
    findOptionGroupIndex(val, opts) {
        let groupIndex, itemIndex;
        if (opts) {
            for (let i = 0; i < opts.length; i++) {
                groupIndex = i;
                itemIndex = this.findOptionIndex(val, this.getOptionGroupChildren(opts[i]));
                if (itemIndex !== -1) {
                    break;
                }
            }
        }
        if (itemIndex !== -1) {
            return { groupIndex: groupIndex, itemIndex: itemIndex };
        }
        else {
            return -1;
        }
    }
    updateFilledState() {
        if (this.multiple)
            this.filled = (this.value && this.value.length) || (this.multiInputEL && this.multiInputEL.nativeElement && this.multiInputEL.nativeElement.value != '');
        else
            this.filled = (this.inputFieldValue && this.inputFieldValue != '') || (this.inputEL && this.inputEL.nativeElement && this.inputEL.nativeElement.value != '');
    }
    updateInputField() {
        let formattedValue = this.resolveFieldData(this.value);
        this.inputFieldValue = formattedValue;
        if (this.inputEL && this.inputEL.nativeElement) {
            this.inputEL.nativeElement.value = formattedValue;
        }
        this.updateFilledState();
    }
    bindDocumentClickListener() {
        if (!this.documentClickListener) {
            const documentTarget = this.el ? this.el.nativeElement.ownerDocument : 'document';
            this.documentClickListener = this.renderer.listen(documentTarget, 'click', (event) => {
                if (event.which === 3) {
                    return;
                }
                if (!this.inputClick && !this.isDropdownClick(event)) {
                    this.hide();
                }
                this.inputClick = false;
                this.cd.markForCheck();
            });
        }
    }
    isDropdownClick(event) {
        if (this.dropdown) {
            let target = event.target;
            return target === this.dropdownButton.nativeElement || target.parentNode === this.dropdownButton.nativeElement;
        }
        else {
            return false;
        }
    }
    unbindDocumentClickListener() {
        if (this.documentClickListener) {
            this.documentClickListener();
            this.documentClickListener = null;
        }
    }
    bindDocumentResizeListener() {
        this.documentResizeListener = this.onWindowResize.bind(this);
        window.addEventListener('resize', this.documentResizeListener);
    }
    unbindDocumentResizeListener() {
        if (this.documentResizeListener) {
            window.removeEventListener('resize', this.documentResizeListener);
            this.documentResizeListener = null;
        }
    }
    onWindowResize() {
        if (this.overlayVisible && !DomHandler.isTouchDevice()) {
            this.hide();
        }
    }
    bindScrollListener() {
        if (!this.scrollHandler) {
            this.scrollHandler = new ConnectedOverlayScrollHandler(this.containerEL.nativeElement, () => {
                if (this.overlayVisible) {
                    this.hide();
                }
            });
        }
        this.scrollHandler.bindScrollListener();
    }
    unbindScrollListener() {
        if (this.scrollHandler) {
            this.scrollHandler.unbindScrollListener();
        }
    }
    onOverlayHide() {
        this.unbindDocumentClickListener();
        this.unbindDocumentResizeListener();
        this.unbindScrollListener();
        if (this.overlay) {
            this.overlay = null;
            this.onHide.emit();
        }
    }
    ngOnDestroy() {
        if (this.forceSelectionUpdateModelTimeout) {
            clearTimeout(this.forceSelectionUpdateModelTimeout);
            this.forceSelectionUpdateModelTimeout = null;
        }
        if (this.scrollHandler) {
            this.scrollHandler.destroy();
            this.scrollHandler = null;
        }
        if (this.overlay) {
            ZIndexUtils.clear(this.overlay);
        }
        this.restoreOverlayAppend();
        this.onOverlayHide();
    }
}
AutoComplete.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "14.0.7", ngImport: i0, type: AutoComplete, deps: [{ token: i0.ElementRef }, { token: i0.Renderer2 }, { token: i0.ChangeDetectorRef }, { token: i0.IterableDiffers }, { token: i1.PrimeNGConfig }, { token: i1.OverlayService }], target: i0.ɵɵFactoryTarget.Component });
AutoComplete.ɵcmp = i0.ɵɵngDeclareComponent({ minVersion: "14.0.0", version: "14.0.7", type: AutoComplete, selector: "p-autoComplete", inputs: { minLength: "minLength", delay: "delay", style: "style", panelStyle: "panelStyle", styleClass: "styleClass", panelStyleClass: "panelStyleClass", inputStyle: "inputStyle", inputId: "inputId", inputStyleClass: "inputStyleClass", placeholder: "placeholder", readonly: "readonly", disabled: "disabled", scrollHeight: "scrollHeight", lazy: "lazy", virtualScroll: "virtualScroll", virtualScrollItemSize: "virtualScrollItemSize", virtualScrollOptions: "virtualScrollOptions", maxlength: "maxlength", name: "name", required: "required", size: "size", appendTo: "appendTo", autoHighlight: "autoHighlight", forceSelection: "forceSelection", type: "type", autoZIndex: "autoZIndex", baseZIndex: "baseZIndex", ariaLabel: "ariaLabel", dropdownAriaLabel: "dropdownAriaLabel", ariaLabelledBy: "ariaLabelledBy", dropdownIcon: "dropdownIcon", unique: "unique", group: "group", completeOnFocus: "completeOnFocus", showClear: "showClear", field: "field", dropdown: "dropdown", showEmptyMessage: "showEmptyMessage", dropdownMode: "dropdownMode", multiple: "multiple", tabindex: "tabindex", dataKey: "dataKey", emptyMessage: "emptyMessage", showTransitionOptions: "showTransitionOptions", hideTransitionOptions: "hideTransitionOptions", autofocus: "autofocus", autocomplete: "autocomplete", optionGroupChildren: "optionGroupChildren", optionGroupLabel: "optionGroupLabel", itemSize: "itemSize", suggestions: "suggestions" }, outputs: { completeMethod: "completeMethod", onSelect: "onSelect", onUnselect: "onUnselect", onFocus: "onFocus", onBlur: "onBlur", onDropdownClick: "onDropdownClick", onClear: "onClear", onKeyUp: "onKeyUp", onShow: "onShow", onHide: "onHide", onLazyLoad: "onLazyLoad" }, host: { properties: { "class.p-inputwrapper-filled": "filled", "class.p-inputwrapper-focus": "((focus && !disabled) || autofocus) || overlayVisible", "class.p-autocomplete-clearable": "showClear && !disabled" }, classAttribute: "p-element p-inputwrapper" }, providers: [AUTOCOMPLETE_VALUE_ACCESSOR], queries: [{ propertyName: "templates", predicate: PrimeTemplate }], viewQueries: [{ propertyName: "containerEL", first: true, predicate: ["container"], descendants: true }, { propertyName: "inputEL", first: true, predicate: ["in"], descendants: true }, { propertyName: "multiInputEL", first: true, predicate: ["multiIn"], descendants: true }, { propertyName: "multiContainerEL", first: true, predicate: ["multiContainer"], descendants: true }, { propertyName: "dropdownButton", first: true, predicate: ["ddBtn"], descendants: true }, { propertyName: "itemsViewChild", first: true, predicate: ["items"], descendants: true }, { propertyName: "scroller", first: true, predicate: ["scroller"], descendants: true }], ngImport: i0, template: `
        <span #container [ngClass]="{ 'p-autocomplete p-component': true, 'p-autocomplete-dd': dropdown, 'p-autocomplete-multiple': multiple }" [ngStyle]="style" [class]="styleClass">
            <input
                pAutoFocus
                [autofocus]="autofocus"
                *ngIf="!multiple"
                #in
                [attr.type]="type"
                [attr.id]="inputId"
                [ngStyle]="inputStyle"
                [class]="inputStyleClass"
                [autocomplete]="autocomplete"
                [attr.required]="required"
                [attr.name]="name"
                class="p-autocomplete-input p-inputtext p-component"
                [ngClass]="{ 'p-autocomplete-dd-input': dropdown, 'p-disabled': disabled }"
                [value]="inputFieldValue"
                aria-autocomplete="list"
                role="searchbox"
                (click)="onInputClick($event)"
                (input)="onInput($event)"
                (keydown)="onKeydown($event)"
                (keyup)="onKeyup($event)"
                (focus)="onInputFocus($event)"
                (blur)="onInputBlur($event)"
                (change)="onInputChange($event)"
                (paste)="onInputPaste($event)"
                [attr.placeholder]="placeholder"
                [attr.size]="size"
                [attr.maxlength]="maxlength"
                [attr.tabindex]="tabindex"
                [readonly]="readonly"
                [disabled]="disabled"
                [attr.aria-label]="ariaLabel"
                [attr.aria-labelledby]="ariaLabelledBy"
                [attr.aria-required]="required"
            />
            <i *ngIf="!multiple && filled && !disabled && showClear" class="p-autocomplete-clear-icon pi pi-times" (click)="clear()"></i>
            <i *ngIf="multiple && filled && !disabled && showClear" class="p-autocomplete-clear-icon pi pi-times" (click)="clear()"></i>
            <ul *ngIf="multiple" #multiContainer class="p-autocomplete-multiple-container p-component p-inputtext" [ngClass]="{ 'p-disabled': disabled, 'p-focus': focus }" (click)="multiIn.focus()">
                <li #token *ngFor="let val of value" class="p-autocomplete-token">
                    <ng-container *ngTemplateOutlet="selectedItemTemplate; context: { $implicit: val }"></ng-container>
                    <span *ngIf="!selectedItemTemplate" class="p-autocomplete-token-label">{{ resolveFieldData(val) }}</span>
                    <span class="p-autocomplete-token-icon pi pi-times-circle" (click)="removeItem(token)" *ngIf="!disabled && !readonly"></span>
                </li>
                <li class="p-autocomplete-input-token">
                    <input
                        pAutoFocus
                        [autofocus]="autofocus"
                        #multiIn
                        [attr.type]="type"
                        [attr.id]="inputId"
                        [disabled]="disabled"
                        [attr.placeholder]="value && value.length ? null : placeholder"
                        [attr.tabindex]="tabindex"
                        [attr.maxlength]="maxlength"
                        (input)="onInput($event)"
                        (click)="onInputClick($event)"
                        (keydown)="onKeydown($event)"
                        [readonly]="readonly"
                        (keyup)="onKeyup($event)"
                        (focus)="onInputFocus($event)"
                        (blur)="onInputBlur($event)"
                        (change)="onInputChange($event)"
                        (paste)="onInputPaste($event)"
                        [autocomplete]="autocomplete"
                        [ngStyle]="inputStyle"
                        [class]="inputStyleClass"
                        [attr.aria-label]="ariaLabel"
                        [attr.aria-labelledby]="ariaLabelledBy"
                        [attr.aria-required]="required"
                        aria-autocomplete="list"
                        [attr.aria-controls]="listId"
                        role="searchbox"
                        [attr.aria-expanded]="overlayVisible"
                        aria-haspopup="true"
                        [attr.aria-activedescendant]="'p-highlighted-option'"
                    />
                </li>
            </ul>
            <i *ngIf="loading" class="p-autocomplete-loader pi pi-spinner pi-spin"></i
            ><button
                #ddBtn
                type="button"
                pButton
                [icon]="dropdownIcon"
                [attr.aria-label]="dropdownAriaLabel"
                class="p-autocomplete-dropdown"
                [disabled]="disabled"
                pRipple
                (click)="handleDropdownClick($event)"
                *ngIf="dropdown"
                [attr.tabindex]="tabindex"
            ></button>
            <div
                #panel
                *ngIf="overlayVisible"
                (click)="onOverlayClick($event)"
                [ngClass]="['p-autocomplete-panel p-component']"
                [style.max-height]="virtualScroll ? 'auto' : scrollHeight"
                [ngStyle]="panelStyle"
                [class]="panelStyleClass"
                [@overlayAnimation]="{ value: 'visible', params: { showTransitionParams: showTransitionOptions, hideTransitionParams: hideTransitionOptions } }"
                (@overlayAnimation.start)="onOverlayAnimationStart($event)"
                (@overlayAnimation.done)="onOverlayAnimationEnd($event)"
            >
                <ng-container *ngTemplateOutlet="headerTemplate"></ng-container>
                <p-scroller
                    *ngIf="virtualScroll"
                    #scroller
                    [items]="suggestions"
                    [style]="{ height: scrollHeight }"
                    [itemSize]="virtualScrollItemSize || _itemSize"
                    [autoSize]="true"
                    [lazy]="lazy"
                    (onLazyLoad)="onLazyLoad.emit($event)"
                    [options]="virtualScrollOptions"
                >
                    <ng-template pTemplate="content" let-items let-scrollerOptions="options">
                        <ng-container *ngTemplateOutlet="buildInItems; context: { $implicit: items, options: scrollerOptions }"></ng-container>
                    </ng-template>
                    <ng-container *ngIf="loaderTemplate">
                        <ng-template pTemplate="loader" let-scrollerOptions="options">
                            <ng-container *ngTemplateOutlet="loaderTemplate; context: { options: scrollerOptions }"></ng-container>
                        </ng-template>
                    </ng-container>
                </p-scroller>
                <ng-container *ngIf="!virtualScroll">
                    <ng-container *ngTemplateOutlet="buildInItems; context: { $implicit: suggestions, options: {} }"></ng-container>
                </ng-container>

                <ng-template #buildInItems let-items let-scrollerOptions="options">
                    <ul #items role="listbox" [attr.id]="listId" class="p-autocomplete-items" [ngClass]="scrollerOptions.contentStyleClass" [style]="scrollerOptions.contentStyle">
                        <ng-container *ngIf="group">
                            <ng-template ngFor let-optgroup [ngForOf]="items">
                                <li class="p-autocomplete-item-group" [ngStyle]="{ height: scrollerOptions.itemSize + 'px' }">
                                    <span *ngIf="!groupTemplate">{{ getOptionGroupLabel(optgroup) || 'empty' }}</span>
                                    <ng-container *ngTemplateOutlet="groupTemplate; context: { $implicit: optgroup }"></ng-container>
                                </li>
                                <ng-container *ngTemplateOutlet="itemslist; context: { $implicit: getOptionGroupChildren(optgroup) }"></ng-container>
                            </ng-template>
                        </ng-container>
                        <ng-container *ngIf="!group">
                            <ng-container *ngTemplateOutlet="itemslist; context: { $implicit: items }"></ng-container>
                        </ng-container>
                        <ng-template #itemslist let-suggestionsToDisplay>
                            <li
                                role="option"
                                *ngFor="let option of suggestionsToDisplay; let idx = index"
                                class="p-autocomplete-item"
                                pRipple
                                [ngStyle]="{ height: scrollerOptions.itemSize + 'px' }"
                                [ngClass]="{ 'p-highlight': option === highlightOption }"
                                [id]="highlightOption == option ? 'p-highlighted-option' : ''"
                                (click)="selectItem(option)"
                            >
                                <span *ngIf="!itemTemplate">{{ resolveFieldData(option) }}</span>
                                <ng-container *ngTemplateOutlet="itemTemplate; context: { $implicit: option, index: scrollerOptions.getOptions ? scrollerOptions.getOptions(idx) : idx }"></ng-container>
                            </li>
                        </ng-template>
                        <li *ngIf="noResults && showEmptyMessage" class="p-autocomplete-empty-message" [ngStyle]="{ height: scrollerOptions.itemSize + 'px' }">
                            <ng-container *ngIf="!emptyTemplate; else empty">
                                {{ emptyMessageLabel }}
                            </ng-container>
                            <ng-container #empty *ngTemplateOutlet="emptyTemplate"></ng-container>
                        </li>
                    </ul>
                </ng-template>
                <ng-container *ngTemplateOutlet="footerTemplate"></ng-container>
            </div>
        </span>
    `, isInline: true, styles: [".p-autocomplete{display:inline-flex;position:relative}.p-autocomplete-loader{position:absolute;top:50%;margin-top:-.5rem}.p-autocomplete-dd .p-autocomplete-input{flex:1 1 auto;width:1%}.p-autocomplete-dd .p-autocomplete-input,.p-autocomplete-dd .p-autocomplete-multiple-container{border-top-right-radius:0;border-bottom-right-radius:0}.p-autocomplete-dd .p-autocomplete-dropdown{border-top-left-radius:0;border-bottom-left-radius:0}.p-autocomplete .p-autocomplete-panel{min-width:100%;top:0;left:0}.p-autocomplete-panel{position:absolute;overflow:auto}.p-autocomplete-items{margin:0;padding:0;list-style-type:none}.p-autocomplete-item{cursor:pointer;white-space:nowrap;position:relative;overflow:hidden}.p-autocomplete-multiple-container{margin:0;padding:0;list-style-type:none;cursor:text;overflow:hidden;display:flex;align-items:center;flex-wrap:wrap}.p-autocomplete-token{cursor:default;display:inline-flex;align-items:center;flex:0 0 auto}.p-autocomplete-token-icon{cursor:pointer}.p-autocomplete-input-token{flex:1 1 auto;display:inline-flex}.p-autocomplete-input-token input{border:0 none;outline:0 none;background-color:transparent;margin:0;padding:0;box-shadow:none;border-radius:0;width:100%}.p-fluid .p-autocomplete{display:flex}.p-fluid .p-autocomplete-dd .p-autocomplete-input{width:1%}.p-autocomplete-clear-icon{position:absolute;top:50%;margin-top:-.5rem;cursor:pointer}.p-autocomplete-clearable{position:relative}\n"], dependencies: [{ kind: "directive", type: i2.NgClass, selector: "[ngClass]", inputs: ["class", "ngClass"] }, { kind: "directive", type: i2.NgForOf, selector: "[ngFor][ngForOf]", inputs: ["ngForOf", "ngForTrackBy", "ngForTemplate"] }, { kind: "directive", type: i2.NgIf, selector: "[ngIf]", inputs: ["ngIf", "ngIfThen", "ngIfElse"] }, { kind: "directive", type: i2.NgTemplateOutlet, selector: "[ngTemplateOutlet]", inputs: ["ngTemplateOutletContext", "ngTemplateOutlet", "ngTemplateOutletInjector"] }, { kind: "directive", type: i2.NgStyle, selector: "[ngStyle]", inputs: ["ngStyle"] }, { kind: "directive", type: i3.ButtonDirective, selector: "[pButton]", inputs: ["iconPos", "loadingIcon", "label", "icon", "loading"] }, { kind: "directive", type: i1.PrimeTemplate, selector: "[pTemplate]", inputs: ["type", "pTemplate"] }, { kind: "directive", type: i4.Ripple, selector: "[pRipple]" }, { kind: "component", type: i5.Scroller, selector: "p-scroller", inputs: ["id", "style", "styleClass", "tabindex", "items", "itemSize", "scrollHeight", "scrollWidth", "orientation", "step", "delay", "resizeDelay", "appendOnly", "inline", "lazy", "disabled", "loaderDisabled", "columns", "showSpacer", "showLoader", "numToleratedItems", "loading", "autoSize", "trackBy", "options"], outputs: ["onLazyLoad", "onScroll", "onScrollIndexChange"] }, { kind: "directive", type: i6.AutoFocus, selector: "[pAutoFocus]", inputs: ["autofocus"] }], animations: [trigger('overlayAnimation', [transition(':enter', [style({ opacity: 0, transform: 'scaleY(0.8)' }), animate('{{showTransitionParams}}')]), transition(':leave', [animate('{{hideTransitionParams}}', style({ opacity: 0 }))])])], changeDetection: i0.ChangeDetectionStrategy.OnPush, encapsulation: i0.ViewEncapsulation.None });
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "14.0.7", ngImport: i0, type: AutoComplete, decorators: [{
            type: Component,
            args: [{ selector: 'p-autoComplete', template: `
        <span #container [ngClass]="{ 'p-autocomplete p-component': true, 'p-autocomplete-dd': dropdown, 'p-autocomplete-multiple': multiple }" [ngStyle]="style" [class]="styleClass">
            <input
                pAutoFocus
                [autofocus]="autofocus"
                *ngIf="!multiple"
                #in
                [attr.type]="type"
                [attr.id]="inputId"
                [ngStyle]="inputStyle"
                [class]="inputStyleClass"
                [autocomplete]="autocomplete"
                [attr.required]="required"
                [attr.name]="name"
                class="p-autocomplete-input p-inputtext p-component"
                [ngClass]="{ 'p-autocomplete-dd-input': dropdown, 'p-disabled': disabled }"
                [value]="inputFieldValue"
                aria-autocomplete="list"
                role="searchbox"
                (click)="onInputClick($event)"
                (input)="onInput($event)"
                (keydown)="onKeydown($event)"
                (keyup)="onKeyup($event)"
                (focus)="onInputFocus($event)"
                (blur)="onInputBlur($event)"
                (change)="onInputChange($event)"
                (paste)="onInputPaste($event)"
                [attr.placeholder]="placeholder"
                [attr.size]="size"
                [attr.maxlength]="maxlength"
                [attr.tabindex]="tabindex"
                [readonly]="readonly"
                [disabled]="disabled"
                [attr.aria-label]="ariaLabel"
                [attr.aria-labelledby]="ariaLabelledBy"
                [attr.aria-required]="required"
            />
            <i *ngIf="!multiple && filled && !disabled && showClear" class="p-autocomplete-clear-icon pi pi-times" (click)="clear()"></i>
            <i *ngIf="multiple && filled && !disabled && showClear" class="p-autocomplete-clear-icon pi pi-times" (click)="clear()"></i>
            <ul *ngIf="multiple" #multiContainer class="p-autocomplete-multiple-container p-component p-inputtext" [ngClass]="{ 'p-disabled': disabled, 'p-focus': focus }" (click)="multiIn.focus()">
                <li #token *ngFor="let val of value" class="p-autocomplete-token">
                    <ng-container *ngTemplateOutlet="selectedItemTemplate; context: { $implicit: val }"></ng-container>
                    <span *ngIf="!selectedItemTemplate" class="p-autocomplete-token-label">{{ resolveFieldData(val) }}</span>
                    <span class="p-autocomplete-token-icon pi pi-times-circle" (click)="removeItem(token)" *ngIf="!disabled && !readonly"></span>
                </li>
                <li class="p-autocomplete-input-token">
                    <input
                        pAutoFocus
                        [autofocus]="autofocus"
                        #multiIn
                        [attr.type]="type"
                        [attr.id]="inputId"
                        [disabled]="disabled"
                        [attr.placeholder]="value && value.length ? null : placeholder"
                        [attr.tabindex]="tabindex"
                        [attr.maxlength]="maxlength"
                        (input)="onInput($event)"
                        (click)="onInputClick($event)"
                        (keydown)="onKeydown($event)"
                        [readonly]="readonly"
                        (keyup)="onKeyup($event)"
                        (focus)="onInputFocus($event)"
                        (blur)="onInputBlur($event)"
                        (change)="onInputChange($event)"
                        (paste)="onInputPaste($event)"
                        [autocomplete]="autocomplete"
                        [ngStyle]="inputStyle"
                        [class]="inputStyleClass"
                        [attr.aria-label]="ariaLabel"
                        [attr.aria-labelledby]="ariaLabelledBy"
                        [attr.aria-required]="required"
                        aria-autocomplete="list"
                        [attr.aria-controls]="listId"
                        role="searchbox"
                        [attr.aria-expanded]="overlayVisible"
                        aria-haspopup="true"
                        [attr.aria-activedescendant]="'p-highlighted-option'"
                    />
                </li>
            </ul>
            <i *ngIf="loading" class="p-autocomplete-loader pi pi-spinner pi-spin"></i
            ><button
                #ddBtn
                type="button"
                pButton
                [icon]="dropdownIcon"
                [attr.aria-label]="dropdownAriaLabel"
                class="p-autocomplete-dropdown"
                [disabled]="disabled"
                pRipple
                (click)="handleDropdownClick($event)"
                *ngIf="dropdown"
                [attr.tabindex]="tabindex"
            ></button>
            <div
                #panel
                *ngIf="overlayVisible"
                (click)="onOverlayClick($event)"
                [ngClass]="['p-autocomplete-panel p-component']"
                [style.max-height]="virtualScroll ? 'auto' : scrollHeight"
                [ngStyle]="panelStyle"
                [class]="panelStyleClass"
                [@overlayAnimation]="{ value: 'visible', params: { showTransitionParams: showTransitionOptions, hideTransitionParams: hideTransitionOptions } }"
                (@overlayAnimation.start)="onOverlayAnimationStart($event)"
                (@overlayAnimation.done)="onOverlayAnimationEnd($event)"
            >
                <ng-container *ngTemplateOutlet="headerTemplate"></ng-container>
                <p-scroller
                    *ngIf="virtualScroll"
                    #scroller
                    [items]="suggestions"
                    [style]="{ height: scrollHeight }"
                    [itemSize]="virtualScrollItemSize || _itemSize"
                    [autoSize]="true"
                    [lazy]="lazy"
                    (onLazyLoad)="onLazyLoad.emit($event)"
                    [options]="virtualScrollOptions"
                >
                    <ng-template pTemplate="content" let-items let-scrollerOptions="options">
                        <ng-container *ngTemplateOutlet="buildInItems; context: { $implicit: items, options: scrollerOptions }"></ng-container>
                    </ng-template>
                    <ng-container *ngIf="loaderTemplate">
                        <ng-template pTemplate="loader" let-scrollerOptions="options">
                            <ng-container *ngTemplateOutlet="loaderTemplate; context: { options: scrollerOptions }"></ng-container>
                        </ng-template>
                    </ng-container>
                </p-scroller>
                <ng-container *ngIf="!virtualScroll">
                    <ng-container *ngTemplateOutlet="buildInItems; context: { $implicit: suggestions, options: {} }"></ng-container>
                </ng-container>

                <ng-template #buildInItems let-items let-scrollerOptions="options">
                    <ul #items role="listbox" [attr.id]="listId" class="p-autocomplete-items" [ngClass]="scrollerOptions.contentStyleClass" [style]="scrollerOptions.contentStyle">
                        <ng-container *ngIf="group">
                            <ng-template ngFor let-optgroup [ngForOf]="items">
                                <li class="p-autocomplete-item-group" [ngStyle]="{ height: scrollerOptions.itemSize + 'px' }">
                                    <span *ngIf="!groupTemplate">{{ getOptionGroupLabel(optgroup) || 'empty' }}</span>
                                    <ng-container *ngTemplateOutlet="groupTemplate; context: { $implicit: optgroup }"></ng-container>
                                </li>
                                <ng-container *ngTemplateOutlet="itemslist; context: { $implicit: getOptionGroupChildren(optgroup) }"></ng-container>
                            </ng-template>
                        </ng-container>
                        <ng-container *ngIf="!group">
                            <ng-container *ngTemplateOutlet="itemslist; context: { $implicit: items }"></ng-container>
                        </ng-container>
                        <ng-template #itemslist let-suggestionsToDisplay>
                            <li
                                role="option"
                                *ngFor="let option of suggestionsToDisplay; let idx = index"
                                class="p-autocomplete-item"
                                pRipple
                                [ngStyle]="{ height: scrollerOptions.itemSize + 'px' }"
                                [ngClass]="{ 'p-highlight': option === highlightOption }"
                                [id]="highlightOption == option ? 'p-highlighted-option' : ''"
                                (click)="selectItem(option)"
                            >
                                <span *ngIf="!itemTemplate">{{ resolveFieldData(option) }}</span>
                                <ng-container *ngTemplateOutlet="itemTemplate; context: { $implicit: option, index: scrollerOptions.getOptions ? scrollerOptions.getOptions(idx) : idx }"></ng-container>
                            </li>
                        </ng-template>
                        <li *ngIf="noResults && showEmptyMessage" class="p-autocomplete-empty-message" [ngStyle]="{ height: scrollerOptions.itemSize + 'px' }">
                            <ng-container *ngIf="!emptyTemplate; else empty">
                                {{ emptyMessageLabel }}
                            </ng-container>
                            <ng-container #empty *ngTemplateOutlet="emptyTemplate"></ng-container>
                        </li>
                    </ul>
                </ng-template>
                <ng-container *ngTemplateOutlet="footerTemplate"></ng-container>
            </div>
        </span>
    `, animations: [trigger('overlayAnimation', [transition(':enter', [style({ opacity: 0, transform: 'scaleY(0.8)' }), animate('{{showTransitionParams}}')]), transition(':leave', [animate('{{hideTransitionParams}}', style({ opacity: 0 }))])])], host: {
                        class: 'p-element p-inputwrapper',
                        '[class.p-inputwrapper-filled]': 'filled',
                        '[class.p-inputwrapper-focus]': '((focus && !disabled) || autofocus) || overlayVisible',
                        '[class.p-autocomplete-clearable]': 'showClear && !disabled'
                    }, providers: [AUTOCOMPLETE_VALUE_ACCESSOR], changeDetection: ChangeDetectionStrategy.OnPush, encapsulation: ViewEncapsulation.None, styles: [".p-autocomplete{display:inline-flex;position:relative}.p-autocomplete-loader{position:absolute;top:50%;margin-top:-.5rem}.p-autocomplete-dd .p-autocomplete-input{flex:1 1 auto;width:1%}.p-autocomplete-dd .p-autocomplete-input,.p-autocomplete-dd .p-autocomplete-multiple-container{border-top-right-radius:0;border-bottom-right-radius:0}.p-autocomplete-dd .p-autocomplete-dropdown{border-top-left-radius:0;border-bottom-left-radius:0}.p-autocomplete .p-autocomplete-panel{min-width:100%;top:0;left:0}.p-autocomplete-panel{position:absolute;overflow:auto}.p-autocomplete-items{margin:0;padding:0;list-style-type:none}.p-autocomplete-item{cursor:pointer;white-space:nowrap;position:relative;overflow:hidden}.p-autocomplete-multiple-container{margin:0;padding:0;list-style-type:none;cursor:text;overflow:hidden;display:flex;align-items:center;flex-wrap:wrap}.p-autocomplete-token{cursor:default;display:inline-flex;align-items:center;flex:0 0 auto}.p-autocomplete-token-icon{cursor:pointer}.p-autocomplete-input-token{flex:1 1 auto;display:inline-flex}.p-autocomplete-input-token input{border:0 none;outline:0 none;background-color:transparent;margin:0;padding:0;box-shadow:none;border-radius:0;width:100%}.p-fluid .p-autocomplete{display:flex}.p-fluid .p-autocomplete-dd .p-autocomplete-input{width:1%}.p-autocomplete-clear-icon{position:absolute;top:50%;margin-top:-.5rem;cursor:pointer}.p-autocomplete-clearable{position:relative}\n"] }]
        }], ctorParameters: function () { return [{ type: i0.ElementRef }, { type: i0.Renderer2 }, { type: i0.ChangeDetectorRef }, { type: i0.IterableDiffers }, { type: i1.PrimeNGConfig }, { type: i1.OverlayService }]; }, propDecorators: { minLength: [{
                type: Input
            }], delay: [{
                type: Input
            }], style: [{
                type: Input
            }], panelStyle: [{
                type: Input
            }], styleClass: [{
                type: Input
            }], panelStyleClass: [{
                type: Input
            }], inputStyle: [{
                type: Input
            }], inputId: [{
                type: Input
            }], inputStyleClass: [{
                type: Input
            }], placeholder: [{
                type: Input
            }], readonly: [{
                type: Input
            }], disabled: [{
                type: Input
            }], scrollHeight: [{
                type: Input
            }], lazy: [{
                type: Input
            }], virtualScroll: [{
                type: Input
            }], virtualScrollItemSize: [{
                type: Input
            }], virtualScrollOptions: [{
                type: Input
            }], maxlength: [{
                type: Input
            }], name: [{
                type: Input
            }], required: [{
                type: Input
            }], size: [{
                type: Input
            }], appendTo: [{
                type: Input
            }], autoHighlight: [{
                type: Input
            }], forceSelection: [{
                type: Input
            }], type: [{
                type: Input
            }], autoZIndex: [{
                type: Input
            }], baseZIndex: [{
                type: Input
            }], ariaLabel: [{
                type: Input
            }], dropdownAriaLabel: [{
                type: Input
            }], ariaLabelledBy: [{
                type: Input
            }], dropdownIcon: [{
                type: Input
            }], unique: [{
                type: Input
            }], group: [{
                type: Input
            }], completeOnFocus: [{
                type: Input
            }], showClear: [{
                type: Input
            }], field: [{
                type: Input
            }], dropdown: [{
                type: Input
            }], showEmptyMessage: [{
                type: Input
            }], dropdownMode: [{
                type: Input
            }], multiple: [{
                type: Input
            }], tabindex: [{
                type: Input
            }], dataKey: [{
                type: Input
            }], emptyMessage: [{
                type: Input
            }], showTransitionOptions: [{
                type: Input
            }], hideTransitionOptions: [{
                type: Input
            }], autofocus: [{
                type: Input
            }], autocomplete: [{
                type: Input
            }], optionGroupChildren: [{
                type: Input
            }], optionGroupLabel: [{
                type: Input
            }], containerEL: [{
                type: ViewChild,
                args: ['container']
            }], inputEL: [{
                type: ViewChild,
                args: ['in']
            }], multiInputEL: [{
                type: ViewChild,
                args: ['multiIn']
            }], multiContainerEL: [{
                type: ViewChild,
                args: ['multiContainer']
            }], dropdownButton: [{
                type: ViewChild,
                args: ['ddBtn']
            }], itemsViewChild: [{
                type: ViewChild,
                args: ['items']
            }], scroller: [{
                type: ViewChild,
                args: ['scroller']
            }], templates: [{
                type: ContentChildren,
                args: [PrimeTemplate]
            }], completeMethod: [{
                type: Output
            }], onSelect: [{
                type: Output
            }], onUnselect: [{
                type: Output
            }], onFocus: [{
                type: Output
            }], onBlur: [{
                type: Output
            }], onDropdownClick: [{
                type: Output
            }], onClear: [{
                type: Output
            }], onKeyUp: [{
                type: Output
            }], onShow: [{
                type: Output
            }], onHide: [{
                type: Output
            }], onLazyLoad: [{
                type: Output
            }], itemSize: [{
                type: Input
            }], suggestions: [{
                type: Input
            }] } });
export class AutoCompleteModule {
}
AutoCompleteModule.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "14.0.7", ngImport: i0, type: AutoCompleteModule, deps: [], target: i0.ɵɵFactoryTarget.NgModule });
AutoCompleteModule.ɵmod = i0.ɵɵngDeclareNgModule({ minVersion: "14.0.0", version: "14.0.7", ngImport: i0, type: AutoCompleteModule, declarations: [AutoComplete], imports: [CommonModule, InputTextModule, ButtonModule, SharedModule, RippleModule, ScrollerModule, AutoFocusModule], exports: [AutoComplete, SharedModule, ScrollerModule, AutoFocusModule] });
AutoCompleteModule.ɵinj = i0.ɵɵngDeclareInjector({ minVersion: "12.0.0", version: "14.0.7", ngImport: i0, type: AutoCompleteModule, imports: [CommonModule, InputTextModule, ButtonModule, SharedModule, RippleModule, ScrollerModule, AutoFocusModule, SharedModule, ScrollerModule, AutoFocusModule] });
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "14.0.7", ngImport: i0, type: AutoCompleteModule, decorators: [{
            type: NgModule,
            args: [{
                    imports: [CommonModule, InputTextModule, ButtonModule, SharedModule, RippleModule, ScrollerModule, AutoFocusModule],
                    exports: [AutoComplete, SharedModule, ScrollerModule, AutoFocusModule],
                    declarations: [AutoComplete]
                }]
        }] });
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiYXV0b2NvbXBsZXRlLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vc3JjL2FwcC9jb21wb25lbnRzL2F1dG9jb21wbGV0ZS9hdXRvY29tcGxldGUudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUEsT0FBTyxFQUNILFFBQVEsRUFDUixTQUFTLEVBQ1QsU0FBUyxFQUtULEtBQUssRUFDTCxNQUFNLEVBQ04sWUFBWSxFQUNaLGVBQWUsRUFJZixVQUFVLEVBR1YsdUJBQXVCLEVBQ3ZCLGlCQUFpQixFQUNwQixNQUFNLGVBQWUsQ0FBQztBQUN2QixPQUFPLEVBQUUsWUFBWSxFQUFFLE1BQU0saUJBQWlCLENBQUM7QUFDL0MsT0FBTyxFQUFFLE9BQU8sRUFBRSxLQUFLLEVBQUUsVUFBVSxFQUFFLE9BQU8sRUFBa0IsTUFBTSxxQkFBcUIsQ0FBQztBQUMxRixPQUFPLEVBQUUsZUFBZSxFQUFFLE1BQU0sbUJBQW1CLENBQUM7QUFDcEQsT0FBTyxFQUFFLFlBQVksRUFBRSxNQUFNLGdCQUFnQixDQUFDO0FBQzlDLE9BQU8sRUFBRSxZQUFZLEVBQUUsTUFBTSxnQkFBZ0IsQ0FBQztBQUM5QyxPQUFPLEVBQUUsWUFBWSxFQUFFLGFBQWEsRUFBRSxlQUFlLEVBQWlDLE1BQU0sYUFBYSxDQUFDO0FBQzFHLE9BQU8sRUFBRSxVQUFVLEVBQUUsNkJBQTZCLEVBQUUsTUFBTSxhQUFhLENBQUM7QUFDeEUsT0FBTyxFQUFFLFdBQVcsRUFBRSxpQkFBaUIsRUFBRSxXQUFXLEVBQUUsTUFBTSxlQUFlLENBQUM7QUFDNUUsT0FBTyxFQUFFLGlCQUFpQixFQUF3QixNQUFNLGdCQUFnQixDQUFDO0FBQ3pFLE9BQU8sRUFBWSxjQUFjLEVBQW1CLE1BQU0sa0JBQWtCLENBQUM7QUFDN0UsT0FBTyxFQUFFLGVBQWUsRUFBRSxNQUFNLG1CQUFtQixDQUFDOzs7Ozs7OztBQUVwRCxNQUFNLENBQUMsTUFBTSwyQkFBMkIsR0FBUTtJQUM1QyxPQUFPLEVBQUUsaUJBQWlCO0lBQzFCLFdBQVcsRUFBRSxVQUFVLENBQUMsR0FBRyxFQUFFLENBQUMsWUFBWSxDQUFDO0lBQzNDLEtBQUssRUFBRSxJQUFJO0NBQ2QsQ0FBQztBQTRMRixNQUFNLE9BQU8sWUFBWTtJQXFOckIsWUFBbUIsRUFBYyxFQUFTLFFBQW1CLEVBQVMsRUFBcUIsRUFBUyxPQUF3QixFQUFTLE1BQXFCLEVBQVMsY0FBOEI7UUFBOUssT0FBRSxHQUFGLEVBQUUsQ0FBWTtRQUFTLGFBQVEsR0FBUixRQUFRLENBQVc7UUFBUyxPQUFFLEdBQUYsRUFBRSxDQUFtQjtRQUFTLFlBQU8sR0FBUCxPQUFPLENBQWlCO1FBQVMsV0FBTSxHQUFOLE1BQU0sQ0FBZTtRQUFTLG1CQUFjLEdBQWQsY0FBYyxDQUFnQjtRQXBOeEwsY0FBUyxHQUFXLENBQUMsQ0FBQztRQUV0QixVQUFLLEdBQVcsR0FBRyxDQUFDO1FBc0JwQixpQkFBWSxHQUFXLE9BQU8sQ0FBQztRQUUvQixTQUFJLEdBQVksS0FBSyxDQUFDO1FBc0J0QixTQUFJLEdBQVcsTUFBTSxDQUFDO1FBRXRCLGVBQVUsR0FBWSxJQUFJLENBQUM7UUFFM0IsZUFBVSxHQUFXLENBQUMsQ0FBQztRQVF2QixpQkFBWSxHQUFXLG9CQUFvQixDQUFDO1FBRTVDLFdBQU0sR0FBWSxJQUFJLENBQUM7UUFJdkIsb0JBQWUsR0FBWSxLQUFLLENBQUM7UUFFakMsY0FBUyxHQUFZLEtBQUssQ0FBQztRQVEzQixpQkFBWSxHQUFXLE9BQU8sQ0FBQztRQVUvQiwwQkFBcUIsR0FBVyxpQ0FBaUMsQ0FBQztRQUVsRSwwQkFBcUIsR0FBVyxZQUFZLENBQUM7UUFJN0MsaUJBQVksR0FBVyxLQUFLLENBQUM7UUFzQjVCLG1CQUFjLEdBQXNCLElBQUksWUFBWSxFQUFFLENBQUM7UUFFdkQsYUFBUSxHQUFzQixJQUFJLFlBQVksRUFBRSxDQUFDO1FBRWpELGVBQVUsR0FBc0IsSUFBSSxZQUFZLEVBQUUsQ0FBQztRQUVuRCxZQUFPLEdBQXNCLElBQUksWUFBWSxFQUFFLENBQUM7UUFFaEQsV0FBTSxHQUFzQixJQUFJLFlBQVksRUFBRSxDQUFDO1FBRS9DLG9CQUFlLEdBQXNCLElBQUksWUFBWSxFQUFFLENBQUM7UUFFeEQsWUFBTyxHQUFzQixJQUFJLFlBQVksRUFBRSxDQUFDO1FBRWhELFlBQU8sR0FBc0IsSUFBSSxZQUFZLEVBQUUsQ0FBQztRQUVoRCxXQUFNLEdBQXNCLElBQUksWUFBWSxFQUFFLENBQUM7UUFFL0MsV0FBTSxHQUFzQixJQUFJLFlBQVksRUFBRSxDQUFDO1FBRS9DLGVBQVUsR0FBc0IsSUFBSSxZQUFZLEVBQUUsQ0FBQztRQWtDN0Qsa0JBQWEsR0FBYSxHQUFHLEVBQUUsR0FBRSxDQUFDLENBQUM7UUFFbkMsbUJBQWMsR0FBYSxHQUFHLEVBQUUsR0FBRSxDQUFDLENBQUM7UUFJcEMsbUJBQWMsR0FBWSxLQUFLLENBQUM7UUFVaEMsVUFBSyxHQUFZLEtBQUssQ0FBQztRQVl2QixvQkFBZSxHQUFXLElBQUksQ0FBQztRQWMvQixlQUFVLEdBQVcsSUFBSSxDQUFDO1FBR3RCLElBQUksQ0FBQyxNQUFNLEdBQUcsT0FBTyxDQUFDLElBQUksQ0FBQyxFQUFFLENBQUMsQ0FBQyxNQUFNLENBQUMsSUFBSSxDQUFDLENBQUM7UUFDNUMsSUFBSSxDQUFDLE1BQU0sR0FBRyxpQkFBaUIsRUFBRSxHQUFHLE9BQU8sQ0FBQztJQUNoRCxDQUFDO0lBN0VELElBQWEsUUFBUTtRQUNqQixPQUFPLElBQUksQ0FBQyxTQUFTLENBQUM7SUFDMUIsQ0FBQztJQUNELElBQUksUUFBUSxDQUFDLEdBQVc7UUFDcEIsSUFBSSxDQUFDLFNBQVMsR0FBRyxHQUFHLENBQUM7UUFDckIsT0FBTyxDQUFDLElBQUksQ0FBQyxrRkFBa0YsQ0FBQyxDQUFDO0lBQ3JHLENBQUM7SUF5RUQsSUFBYSxXQUFXO1FBQ3BCLE9BQU8sSUFBSSxDQUFDLFlBQVksQ0FBQztJQUM3QixDQUFDO0lBRUQsSUFBSSxXQUFXLENBQUMsR0FBVTtRQUN0QixJQUFJLENBQUMsWUFBWSxHQUFHLEdBQUcsQ0FBQztRQUN4QixJQUFJLENBQUMsdUJBQXVCLEVBQUUsQ0FBQztJQUNuQyxDQUFDO0lBRUQsa0JBQWtCO1FBQ2QscUdBQXFHO1FBQ3JHLElBQUksSUFBSSxDQUFDLGtCQUFrQixJQUFJLElBQUksQ0FBQyxPQUFPLElBQUksSUFBSSxDQUFDLE9BQU8sQ0FBQyxZQUFZLEVBQUU7WUFDdEUsVUFBVSxDQUFDLEdBQUcsRUFBRTtnQkFDWixJQUFJLElBQUksQ0FBQyxPQUFPLEVBQUU7b0JBQ2QsSUFBSSxDQUFDLFlBQVksRUFBRSxDQUFDO2lCQUN2QjtZQUNMLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQztZQUNOLElBQUksQ0FBQyxrQkFBa0IsR0FBRyxLQUFLLENBQUM7U0FDbkM7UUFFRCxJQUFJLElBQUksQ0FBQyxzQkFBc0IsRUFBRTtZQUM3QixVQUFVLENBQUMsR0FBRyxFQUFFO2dCQUNaLElBQUksSUFBSSxDQUFDLE9BQU8sSUFBSSxJQUFJLENBQUMsWUFBWSxFQUFFO29CQUNuQyxJQUFJLFFBQVEsR0FBRyxVQUFVLENBQUMsVUFBVSxDQUFDLElBQUksQ0FBQyxPQUFPLEVBQUUsZ0JBQWdCLENBQUMsQ0FBQztvQkFFckUsSUFBSSxRQUFRLEVBQUU7d0JBQ1YsVUFBVSxDQUFDLFlBQVksQ0FBQyxJQUFJLENBQUMsWUFBWSxFQUFFLFFBQVEsQ0FBQyxDQUFDO3FCQUN4RDtpQkFDSjtZQUNMLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQztZQUNOLElBQUksQ0FBQyxzQkFBc0IsR0FBRyxLQUFLLENBQUM7U0FDdkM7SUFDTCxDQUFDO0lBRUQsdUJBQXVCO1FBQ25CLElBQUksSUFBSSxDQUFDLFlBQVksSUFBSSxJQUFJLElBQUksSUFBSSxDQUFDLE9BQU8sRUFBRTtZQUMzQyxJQUFJLENBQUMsZUFBZSxHQUFHLElBQUksQ0FBQztZQUM1QixJQUFJLElBQUksQ0FBQyxZQUFZLENBQUMsTUFBTSxFQUFFO2dCQUMxQixJQUFJLENBQUMsU0FBUyxHQUFHLEtBQUssQ0FBQztnQkFDdkIsSUFBSSxDQUFDLElBQUksRUFBRSxDQUFDO2dCQUNaLElBQUksQ0FBQyxrQkFBa0IsR0FBRyxJQUFJLENBQUM7Z0JBRS9CLElBQUksSUFBSSxDQUFDLGFBQWEsRUFBRTtvQkFDcEIsSUFBSSxDQUFDLGVBQWUsR0FBRyxJQUFJLENBQUMsWUFBWSxDQUFDLENBQUMsQ0FBQyxDQUFDO2lCQUMvQzthQUNKO2lCQUFNO2dCQUNILElBQUksQ0FBQyxTQUFTLEdBQUcsSUFBSSxDQUFDO2dCQUV0QixJQUFJLElBQUksQ0FBQyxnQkFBZ0IsRUFBRTtvQkFDdkIsSUFBSSxDQUFDLElBQUksRUFBRSxDQUFDO29CQUNaLElBQUksQ0FBQyxrQkFBa0IsR0FBRyxJQUFJLENBQUM7aUJBQ2xDO3FCQUFNO29CQUNILElBQUksQ0FBQyxJQUFJLEVBQUUsQ0FBQztpQkFDZjthQUNKO1lBRUQsSUFBSSxDQUFDLE9BQU8sR0FBRyxLQUFLLENBQUM7U0FDeEI7SUFDTCxDQUFDO0lBRUQsa0JBQWtCO1FBQ2QsSUFBSSxDQUFDLFNBQVMsQ0FBQyxPQUFPLENBQUMsQ0FBQyxJQUFJLEVBQUUsRUFBRTtZQUM1QixRQUFRLElBQUksQ0FBQyxPQUFPLEVBQUUsRUFBRTtnQkFDcEIsS0FBSyxNQUFNO29CQUNQLElBQUksQ0FBQyxZQUFZLEdBQUcsSUFBSSxDQUFDLFFBQVEsQ0FBQztvQkFDbEMsTUFBTTtnQkFFVixLQUFLLE9BQU87b0JBQ1IsSUFBSSxDQUFDLGFBQWEsR0FBRyxJQUFJLENBQUMsUUFBUSxDQUFDO29CQUNuQyxNQUFNO2dCQUVWLEtBQUssY0FBYztvQkFDZixJQUFJLENBQUMsb0JBQW9CLEdBQUcsSUFBSSxDQUFDLFFBQVEsQ0FBQztvQkFDMUMsTUFBTTtnQkFFVixLQUFLLFFBQVE7b0JBQ1QsSUFBSSxDQUFDLGNBQWMsR0FBRyxJQUFJLENBQUMsUUFBUSxDQUFDO29CQUNwQyxNQUFNO2dCQUVWLEtBQUssT0FBTztvQkFDUixJQUFJLENBQUMsYUFBYSxHQUFHLElBQUksQ0FBQyxRQUFRLENBQUM7b0JBQ25DLE1BQU07Z0JBRVYsS0FBSyxRQUFRO29CQUNULElBQUksQ0FBQyxjQUFjLEdBQUcsSUFBSSxDQUFDLFFBQVEsQ0FBQztvQkFDcEMsTUFBTTtnQkFFVixLQUFLLFFBQVE7b0JBQ1QsSUFBSSxDQUFDLGNBQWMsR0FBRyxJQUFJLENBQUMsUUFBUSxDQUFDO29CQUNwQyxNQUFNO2dCQUVWO29CQUNJLElBQUksQ0FBQyxZQUFZLEdBQUcsSUFBSSxDQUFDLFFBQVEsQ0FBQztvQkFDbEMsTUFBTTthQUNiO1FBQ0wsQ0FBQyxDQUFDLENBQUM7SUFDUCxDQUFDO0lBRUQsVUFBVSxDQUFDLEtBQVU7UUFDakIsSUFBSSxDQUFDLEtBQUssR0FBRyxLQUFLLENBQUM7UUFDbkIsSUFBSSxDQUFDLE1BQU0sR0FBRyxJQUFJLENBQUMsS0FBSyxJQUFJLElBQUksQ0FBQyxLQUFLLElBQUksRUFBRSxDQUFDO1FBQzdDLElBQUksQ0FBQyxnQkFBZ0IsRUFBRSxDQUFDO1FBQ3hCLElBQUksQ0FBQyxFQUFFLENBQUMsWUFBWSxFQUFFLENBQUM7SUFDM0IsQ0FBQztJQUVELHNCQUFzQixDQUFDLFdBQWdCO1FBQ25DLE9BQU8sSUFBSSxDQUFDLG1CQUFtQixDQUFDLENBQUMsQ0FBQyxXQUFXLENBQUMsZ0JBQWdCLENBQUMsV0FBVyxFQUFFLElBQUksQ0FBQyxtQkFBbUIsQ0FBQyxDQUFDLENBQUMsQ0FBQyxXQUFXLENBQUMsS0FBSyxDQUFDO0lBQzlILENBQUM7SUFFRCxtQkFBbUIsQ0FBQyxXQUFnQjtRQUNoQyxPQUFPLElBQUksQ0FBQyxnQkFBZ0IsQ0FBQyxDQUFDLENBQUMsV0FBVyxDQUFDLGdCQUFnQixDQUFDLFdBQVcsRUFBRSxJQUFJLENBQUMsZ0JBQWdCLENBQUMsQ0FBQyxDQUFDLENBQUMsV0FBVyxDQUFDLEtBQUssSUFBSSxTQUFTLENBQUMsQ0FBQyxDQUFDLFdBQVcsQ0FBQyxLQUFLLENBQUMsQ0FBQyxDQUFDLFdBQVcsQ0FBQztJQUN2SyxDQUFDO0lBRUQsZ0JBQWdCLENBQUMsRUFBWTtRQUN6QixJQUFJLENBQUMsYUFBYSxHQUFHLEVBQUUsQ0FBQztJQUM1QixDQUFDO0lBRUQsaUJBQWlCLENBQUMsRUFBWTtRQUMxQixJQUFJLENBQUMsY0FBYyxHQUFHLEVBQUUsQ0FBQztJQUM3QixDQUFDO0lBRUQsZ0JBQWdCLENBQUMsR0FBWTtRQUN6QixJQUFJLENBQUMsUUFBUSxHQUFHLEdBQUcsQ0FBQztRQUNwQixJQUFJLENBQUMsRUFBRSxDQUFDLFlBQVksRUFBRSxDQUFDO0lBQzNCLENBQUM7SUFFRCxPQUFPLENBQUMsS0FBWTtRQUNoQiwyRkFBMkY7UUFDM0YsSUFBSSxDQUFDLElBQUksQ0FBQyxZQUFZLElBQUksVUFBVSxDQUFDLElBQUksRUFBRSxFQUFFO1lBQ3pDLE9BQU87U0FDVjtRQUVELElBQUksSUFBSSxDQUFDLE9BQU8sRUFBRTtZQUNkLFlBQVksQ0FBQyxJQUFJLENBQUMsT0FBTyxDQUFDLENBQUM7U0FDOUI7UUFFRCxJQUFJLEtBQUssR0FBc0IsS0FBSyxDQUFDLE1BQU8sQ0FBQyxLQUFLLENBQUM7UUFDbkQsSUFBSSxDQUFDLFVBQVUsR0FBRyxLQUFLLENBQUM7UUFDeEIsSUFBSSxDQUFDLElBQUksQ0FBQyxRQUFRLElBQUksQ0FBQyxJQUFJLENBQUMsY0FBYyxFQUFFO1lBQ3hDLElBQUksQ0FBQyxhQUFhLENBQUMsS0FBSyxDQUFDLENBQUM7U0FDN0I7UUFFRCxJQUFJLEtBQUssQ0FBQyxNQUFNLEtBQUssQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLFFBQVEsRUFBRTtZQUN0QyxJQUFJLENBQUMsS0FBSyxHQUFHLElBQUksQ0FBQztZQUNsQixJQUFJLENBQUMsSUFBSSxFQUFFLENBQUM7WUFDWixJQUFJLENBQUMsT0FBTyxDQUFDLElBQUksQ0FBQyxLQUFLLENBQUMsQ0FBQztZQUN6QixJQUFJLENBQUMsYUFBYSxDQUFDLEtBQUssQ0FBQyxDQUFDO1NBQzdCO1FBRUQsSUFBSSxLQUFLLENBQUMsTUFBTSxJQUFJLElBQUksQ0FBQyxTQUFTLEVBQUU7WUFDaEMsSUFBSSxDQUFDLE9BQU8sR0FBRyxVQUFVLENBQUMsR0FBRyxFQUFFO2dCQUMzQixJQUFJLENBQUMsTUFBTSxDQUFDLEtBQUssRUFBRSxLQUFLLENBQUMsQ0FBQztZQUM5QixDQUFDLEVBQUUsSUFBSSxDQUFDLEtBQUssQ0FBQyxDQUFDO1NBQ2xCO2FBQU07WUFDSCxJQUFJLENBQUMsSUFBSSxFQUFFLENBQUM7U0FDZjtRQUNELElBQUksQ0FBQyxpQkFBaUIsRUFBRSxDQUFDO1FBQ3pCLElBQUksQ0FBQyxZQUFZLEdBQUcsS0FBSyxDQUFDO0lBQzlCLENBQUM7SUFFRCxZQUFZLENBQUMsS0FBaUI7UUFDMUIsSUFBSSxJQUFJLENBQUMscUJBQXFCLEVBQUU7WUFDNUIsSUFBSSxDQUFDLFVBQVUsR0FBRyxJQUFJLENBQUM7U0FDMUI7SUFDTCxDQUFDO0lBRUQsTUFBTSxDQUFDLEtBQVUsRUFBRSxLQUFhO1FBQzVCLDhDQUE4QztRQUM5QyxJQUFJLEtBQUssS0FBSyxTQUFTLElBQUksS0FBSyxLQUFLLElBQUksRUFBRTtZQUN2QyxPQUFPO1NBQ1Y7UUFFRCxJQUFJLENBQUMsT0FBTyxHQUFHLElBQUksQ0FBQztRQUVwQixJQUFJLENBQUMsY0FBYyxDQUFDLElBQUksQ0FBQztZQUNyQixhQUFhLEVBQUUsS0FBSztZQUNwQixLQUFLLEVBQUUsS0FBSztTQUNmLENBQUMsQ0FBQztJQUNQLENBQUM7SUFFRCxVQUFVLENBQUMsTUFBVyxFQUFFLFFBQWlCLElBQUk7UUFDekMsSUFBSSxJQUFJLENBQUMsZ0NBQWdDLEVBQUU7WUFDdkMsWUFBWSxDQUFDLElBQUksQ0FBQyxnQ0FBZ0MsQ0FBQyxDQUFDO1lBQ3BELElBQUksQ0FBQyxnQ0FBZ0MsR0FBRyxJQUFJLENBQUM7U0FDaEQ7UUFFRCxJQUFJLElBQUksQ0FBQyxRQUFRLEVBQUU7WUFDZixJQUFJLENBQUMsWUFBWSxDQUFDLGFBQWEsQ0FBQyxLQUFLLEdBQUcsRUFBRSxDQUFDO1lBQzNDLElBQUksQ0FBQyxLQUFLLEdBQUcsSUFBSSxDQUFDLEtBQUssSUFBSSxFQUFFLENBQUM7WUFDOUIsSUFBSSxDQUFDLElBQUksQ0FBQyxVQUFVLENBQUMsTUFBTSxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsTUFBTSxFQUFFO2dCQUMxQyxJQUFJLENBQUMsS0FBSyxHQUFHLENBQUMsR0FBRyxJQUFJLENBQUMsS0FBSyxFQUFFLE1BQU0sQ0FBQyxDQUFDO2dCQUNyQyxJQUFJLENBQUMsYUFBYSxDQUFDLElBQUksQ0FBQyxLQUFLLENBQUMsQ0FBQzthQUNsQztTQUNKO2FBQU07WUFDSCxJQUFJLENBQUMsT0FBTyxDQUFDLGFBQWEsQ0FBQyxLQUFLLEdBQUcsSUFBSSxDQUFDLGdCQUFnQixDQUFDLE1BQU0sQ0FBQyxDQUFDO1lBQ2pFLElBQUksQ0FBQyxLQUFLLEdBQUcsTUFBTSxDQUFDO1lBQ3BCLElBQUksQ0FBQyxhQUFhLENBQUMsSUFBSSxDQUFDLEtBQUssQ0FBQyxDQUFDO1NBQ2xDO1FBRUQsSUFBSSxDQUFDLFFBQVEsQ0FBQyxJQUFJLENBQUMsTUFBTSxDQUFDLENBQUM7UUFDM0IsSUFBSSxDQUFDLGlCQUFpQixFQUFFLENBQUM7UUFFekIsSUFBSSxLQUFLLEVBQUU7WUFDUCxJQUFJLENBQUMsV0FBVyxHQUFHLElBQUksQ0FBQztZQUN4QixJQUFJLENBQUMsVUFBVSxFQUFFLENBQUM7U0FDckI7SUFDTCxDQUFDO0lBRUQsSUFBSTtRQUNBLElBQUksSUFBSSxDQUFDLFlBQVksSUFBSSxJQUFJLENBQUMsT0FBTyxFQUFFO1lBQ25DLElBQUksUUFBUSxHQUFHLElBQUksQ0FBQyxRQUFRLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxZQUFZLENBQUMsYUFBYSxDQUFDLGFBQWEsQ0FBQyxhQUFhLElBQUksSUFBSSxDQUFDLFlBQVksQ0FBQyxhQUFhLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxPQUFPLENBQUMsYUFBYSxDQUFDLGFBQWEsQ0FBQyxhQUFhLElBQUksSUFBSSxDQUFDLE9BQU8sQ0FBQyxhQUFhLENBQUM7WUFFck4sSUFBSSxDQUFDLElBQUksQ0FBQyxjQUFjLElBQUksUUFBUSxFQUFFO2dCQUNsQyxJQUFJLENBQUMsY0FBYyxHQUFHLElBQUksQ0FBQzthQUM5QjtTQUNKO0lBQ0wsQ0FBQztJQUVELEtBQUs7UUFDRCxJQUFJLElBQUksQ0FBQyxRQUFRLEVBQUU7WUFDZixJQUFJLENBQUMsS0FBSyxHQUFHLElBQUksQ0FBQztTQUNyQjthQUFNO1lBQ0gsSUFBSSxDQUFDLFVBQVUsR0FBRyxJQUFJLENBQUM7WUFDdkIsSUFBSSxDQUFDLE9BQU8sQ0FBQyxhQUFhLENBQUMsS0FBSyxHQUFHLEVBQUUsQ0FBQztTQUN6QztRQUVELElBQUksQ0FBQyxpQkFBaUIsRUFBRSxDQUFDO1FBQ3pCLElBQUksQ0FBQyxhQUFhLENBQUMsSUFBSSxDQUFDLEtBQUssQ0FBQyxDQUFDO1FBQy9CLElBQUksQ0FBQyxPQUFPLENBQUMsSUFBSSxFQUFFLENBQUM7SUFDeEIsQ0FBQztJQUVELHVCQUF1QixDQUFDLEtBQXFCO1FBQ3pDLFFBQVEsS0FBSyxDQUFDLE9BQU8sRUFBRTtZQUNuQixLQUFLLFNBQVM7Z0JBQ1YsSUFBSSxDQUFDLE9BQU8sR0FBRyxLQUFLLENBQUMsT0FBTyxDQUFDO2dCQUM3QixJQUFJLENBQUMsWUFBWSxHQUFHLElBQUksQ0FBQyxhQUFhLENBQUMsQ0FBQyxDQUFDLFVBQVUsQ0FBQyxVQUFVLENBQUMsSUFBSSxDQUFDLE9BQU8sRUFBRSxhQUFhLENBQUMsQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLE9BQU8sQ0FBQztnQkFDM0csSUFBSSxDQUFDLGFBQWEsSUFBSSxJQUFJLENBQUMsUUFBUSxFQUFFLFlBQVksQ0FBQyxJQUFJLENBQUMsY0FBYyxDQUFDLGFBQWEsQ0FBQyxDQUFDO2dCQUNyRixJQUFJLENBQUMsYUFBYSxFQUFFLENBQUM7Z0JBRXJCLElBQUksSUFBSSxDQUFDLFVBQVUsRUFBRTtvQkFDakIsV0FBVyxDQUFDLEdBQUcsQ0FBQyxTQUFTLEVBQUUsSUFBSSxDQUFDLE9BQU8sRUFBRSxJQUFJLENBQUMsVUFBVSxHQUFHLElBQUksQ0FBQyxNQUFNLENBQUMsTUFBTSxDQUFDLE9BQU8sQ0FBQyxDQUFDO2lCQUMxRjtnQkFFRCxJQUFJLENBQUMsWUFBWSxFQUFFLENBQUM7Z0JBQ3BCLElBQUksQ0FBQyx5QkFBeUIsRUFBRSxDQUFDO2dCQUNqQyxJQUFJLENBQUMsMEJBQTBCLEVBQUUsQ0FBQztnQkFDbEMsSUFBSSxDQUFDLGtCQUFrQixFQUFFLENBQUM7Z0JBQzFCLElBQUksQ0FBQyxNQUFNLENBQUMsSUFBSSxDQUFDLEtBQUssQ0FBQyxDQUFDO2dCQUN4QixNQUFNO1lBRVYsS0FBSyxNQUFNO2dCQUNQLElBQUksQ0FBQyxhQUFhLEVBQUUsQ0FBQztnQkFDckIsTUFBTTtTQUNiO0lBQ0wsQ0FBQztJQUVELHFCQUFxQixDQUFDLEtBQXFCO1FBQ3ZDLFFBQVEsS0FBSyxDQUFDLE9BQU8sRUFBRTtZQUNuQixLQUFLLE1BQU07Z0JBQ1AsSUFBSSxJQUFJLENBQUMsVUFBVSxFQUFFO29CQUNqQixXQUFXLENBQUMsS0FBSyxDQUFDLEtBQUssQ0FBQyxPQUFPLENBQUMsQ0FBQztpQkFDcEM7Z0JBQ0QsTUFBTTtTQUNiO0lBQ0wsQ0FBQztJQUVELGNBQWMsQ0FBQyxLQUFLO1FBQ2hCLElBQUksQ0FBQyxjQUFjLENBQUMsR0FBRyxDQUFDO1lBQ3BCLGFBQWEsRUFBRSxLQUFLO1lBQ3BCLE1BQU0sRUFBRSxJQUFJLENBQUMsRUFBRSxDQUFDLGFBQWE7U0FDaEMsQ0FBQyxDQUFDO0lBQ1AsQ0FBQztJQUVELGFBQWE7UUFDVCxJQUFJLElBQUksQ0FBQyxRQUFRLEVBQUU7WUFDZixJQUFJLElBQUksQ0FBQyxRQUFRLEtBQUssTUFBTTtnQkFBRSxRQUFRLENBQUMsSUFBSSxDQUFDLFdBQVcsQ0FBQyxJQUFJLENBQUMsT0FBTyxDQUFDLENBQUM7O2dCQUNqRSxVQUFVLENBQUMsV0FBVyxDQUFDLElBQUksQ0FBQyxPQUFPLEVBQUUsSUFBSSxDQUFDLFFBQVEsQ0FBQyxDQUFDO1lBRXpELElBQUksQ0FBQyxJQUFJLENBQUMsT0FBTyxDQUFDLEtBQUssQ0FBQyxRQUFRLEVBQUU7Z0JBQzlCLElBQUksQ0FBQyxPQUFPLENBQUMsS0FBSyxDQUFDLFFBQVEsR0FBRyxVQUFVLENBQUMsUUFBUSxDQUFDLElBQUksQ0FBQyxFQUFFLENBQUMsYUFBYSxDQUFDLFFBQVEsQ0FBQyxDQUFDLENBQUMsQ0FBQyxHQUFHLElBQUksQ0FBQzthQUMvRjtTQUNKO0lBQ0wsQ0FBQztJQUVELGdCQUFnQixDQUFDLEtBQUs7UUFDbEIsSUFBSSxJQUFJLEdBQUcsSUFBSSxDQUFDLEtBQUssQ0FBQyxDQUFDLENBQUMsV0FBVyxDQUFDLGdCQUFnQixDQUFDLEtBQUssRUFBRSxJQUFJLENBQUMsS0FBSyxDQUFDLENBQUMsQ0FBQyxDQUFDLEtBQUssQ0FBQztRQUNoRixPQUFPLElBQUksS0FBSyxDQUFDLElBQUksSUFBSSxTQUFTLENBQUMsQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxFQUFFLENBQUM7SUFDcEQsQ0FBQztJQUVELG9CQUFvQjtRQUNoQixJQUFJLElBQUksQ0FBQyxPQUFPLElBQUksSUFBSSxDQUFDLFFBQVEsRUFBRTtZQUMvQixJQUFJLENBQUMsRUFBRSxDQUFDLGFBQWEsQ0FBQyxXQUFXLENBQUMsSUFBSSxDQUFDLE9BQU8sQ0FBQyxDQUFDO1NBQ25EO0lBQ0wsQ0FBQztJQUVELFlBQVk7UUFDUixJQUFJLElBQUksQ0FBQyxRQUFRO1lBQUUsVUFBVSxDQUFDLGdCQUFnQixDQUFDLElBQUksQ0FBQyxPQUFPLEVBQUUsSUFBSSxDQUFDLFFBQVEsQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLGdCQUFnQixDQUFDLGFBQWEsQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLE9BQU8sQ0FBQyxhQUFhLENBQUMsQ0FBQzs7WUFDMUksVUFBVSxDQUFDLGdCQUFnQixDQUFDLElBQUksQ0FBQyxPQUFPLEVBQUUsSUFBSSxDQUFDLFFBQVEsQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLGdCQUFnQixDQUFDLGFBQWEsQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLE9BQU8sQ0FBQyxhQUFhLENBQUMsQ0FBQztJQUNySSxDQUFDO0lBRUQsSUFBSTtRQUNBLElBQUksQ0FBQyxjQUFjLEdBQUcsS0FBSyxDQUFDO1FBQzVCLElBQUksQ0FBQyxFQUFFLENBQUMsWUFBWSxFQUFFLENBQUM7SUFDM0IsQ0FBQztJQUVELG1CQUFtQixDQUFDLEtBQUs7UUFDckIsSUFBSSxDQUFDLElBQUksQ0FBQyxjQUFjLEVBQUU7WUFDdEIsSUFBSSxDQUFDLFVBQVUsRUFBRSxDQUFDO1lBQ2xCLElBQUksVUFBVSxHQUFHLElBQUksQ0FBQyxRQUFRLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxZQUFZLENBQUMsYUFBYSxDQUFDLEtBQUssQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLE9BQU8sQ0FBQyxhQUFhLENBQUMsS0FBSyxDQUFDO1lBRTFHLElBQUksSUFBSSxDQUFDLFlBQVksS0FBSyxPQUFPO2dCQUFFLElBQUksQ0FBQyxNQUFNLENBQUMsS0FBSyxFQUFFLEVBQUUsQ0FBQyxDQUFDO2lCQUNyRCxJQUFJLElBQUksQ0FBQyxZQUFZLEtBQUssU0FBUztnQkFBRSxJQUFJLENBQUMsTUFBTSxDQUFDLEtBQUssRUFBRSxVQUFVLENBQUMsQ0FBQztZQUV6RSxJQUFJLENBQUMsZUFBZSxDQUFDLElBQUksQ0FBQztnQkFDdEIsYUFBYSxFQUFFLEtBQUs7Z0JBQ3BCLEtBQUssRUFBRSxVQUFVO2FBQ3BCLENBQUMsQ0FBQztTQUNOO2FBQU07WUFDSCxJQUFJLENBQUMsSUFBSSxFQUFFLENBQUM7U0FDZjtJQUNMLENBQUM7SUFFRCxVQUFVO1FBQ04sSUFBSSxJQUFJLENBQUMsUUFBUTtZQUFFLElBQUksQ0FBQyxZQUFZLENBQUMsYUFBYSxDQUFDLEtBQUssRUFBRSxDQUFDOztZQUN0RCxJQUFJLENBQUMsT0FBTyxDQUFDLGFBQWEsQ0FBQyxLQUFLLEVBQUUsQ0FBQztJQUM1QyxDQUFDO0lBRUQsSUFBSSxpQkFBaUI7UUFDakIsT0FBTyxJQUFJLENBQUMsWUFBWSxJQUFJLElBQUksQ0FBQyxNQUFNLENBQUMsY0FBYyxDQUFDLGVBQWUsQ0FBQyxhQUFhLENBQUMsQ0FBQztJQUMxRixDQUFDO0lBRUQsVUFBVSxDQUFDLElBQVM7UUFDaEIsSUFBSSxTQUFTLEdBQUcsVUFBVSxDQUFDLEtBQUssQ0FBQyxJQUFJLENBQUMsQ0FBQztRQUN2QyxJQUFJLFlBQVksR0FBRyxJQUFJLENBQUMsS0FBSyxDQUFDLFNBQVMsQ0FBQyxDQUFDO1FBQ3pDLElBQUksQ0FBQyxLQUFLLEdBQUcsSUFBSSxDQUFDLEtBQUssQ0FBQyxNQUFNLENBQUMsQ0FBQyxHQUFHLEVBQUUsQ0FBQyxFQUFFLEVBQUUsQ0FBQyxDQUFDLElBQUksU0FBUyxDQUFDLENBQUM7UUFDM0QsSUFBSSxDQUFDLGFBQWEsQ0FBQyxJQUFJLENBQUMsS0FBSyxDQUFDLENBQUM7UUFDL0IsSUFBSSxDQUFDLGlCQUFpQixFQUFFLENBQUM7UUFDekIsSUFBSSxDQUFDLFVBQVUsQ0FBQyxJQUFJLENBQUMsWUFBWSxDQUFDLENBQUM7SUFDdkMsQ0FBQztJQUVELFNBQVMsQ0FBQyxLQUFLO1FBQ1gsSUFBSSxJQUFJLENBQUMsY0FBYyxFQUFFO1lBQ3JCLFFBQVEsS0FBSyxDQUFDLEtBQUssRUFBRTtnQkFDakIsTUFBTTtnQkFDTixLQUFLLEVBQUU7b0JBQ0gsSUFBSSxJQUFJLENBQUMsS0FBSyxFQUFFO3dCQUNaLElBQUksa0JBQWtCLEdBQUcsSUFBSSxDQUFDLG9CQUFvQixDQUFDLElBQUksQ0FBQyxlQUFlLEVBQUUsSUFBSSxDQUFDLFdBQVcsQ0FBQyxDQUFDO3dCQUUzRixJQUFJLGtCQUFrQixLQUFLLENBQUMsQ0FBQyxFQUFFOzRCQUMzQixJQUFJLGFBQWEsR0FBRyxrQkFBa0IsQ0FBQyxTQUFTLEdBQUcsQ0FBQyxDQUFDOzRCQUNyRCxJQUFJLGFBQWEsR0FBRyxJQUFJLENBQUMsc0JBQXNCLENBQUMsSUFBSSxDQUFDLFdBQVcsQ0FBQyxrQkFBa0IsQ0FBQyxVQUFVLENBQUMsQ0FBQyxDQUFDLE1BQU0sRUFBRTtnQ0FDckcsSUFBSSxDQUFDLGVBQWUsR0FBRyxJQUFJLENBQUMsc0JBQXNCLENBQUMsSUFBSSxDQUFDLFdBQVcsQ0FBQyxrQkFBa0IsQ0FBQyxVQUFVLENBQUMsQ0FBQyxDQUFDLGFBQWEsQ0FBQyxDQUFDO2dDQUNuSCxJQUFJLENBQUMsc0JBQXNCLEdBQUcsSUFBSSxDQUFDOzZCQUN0QztpQ0FBTSxJQUFJLElBQUksQ0FBQyxXQUFXLENBQUMsa0JBQWtCLENBQUMsVUFBVSxHQUFHLENBQUMsQ0FBQyxFQUFFO2dDQUM1RCxJQUFJLENBQUMsZUFBZSxHQUFHLElBQUksQ0FBQyxzQkFBc0IsQ0FBQyxJQUFJLENBQUMsV0FBVyxDQUFDLGtCQUFrQixDQUFDLFVBQVUsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDO2dDQUMzRyxJQUFJLENBQUMsc0JBQXNCLEdBQUcsSUFBSSxDQUFDOzZCQUN0Qzt5QkFDSjs2QkFBTTs0QkFDSCxJQUFJLENBQUMsZUFBZSxHQUFHLElBQUksQ0FBQyxzQkFBc0IsQ0FBQyxJQUFJLENBQUMsV0FBVyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUM7eUJBQzlFO3FCQUNKO3lCQUFNO3dCQUNILElBQUksa0JBQWtCLEdBQUcsSUFBSSxDQUFDLGVBQWUsQ0FBQyxJQUFJLENBQUMsZUFBZSxFQUFFLElBQUksQ0FBQyxXQUFXLENBQUMsQ0FBQzt3QkFFdEYsSUFBSSxrQkFBa0IsSUFBSSxDQUFDLENBQUMsRUFBRTs0QkFDMUIsSUFBSSxhQUFhLEdBQUcsa0JBQWtCLEdBQUcsQ0FBQyxDQUFDOzRCQUMzQyxJQUFJLGFBQWEsSUFBSSxJQUFJLENBQUMsV0FBVyxDQUFDLE1BQU0sRUFBRTtnQ0FDMUMsSUFBSSxDQUFDLGVBQWUsR0FBRyxJQUFJLENBQUMsV0FBVyxDQUFDLGFBQWEsQ0FBQyxDQUFDO2dDQUN2RCxJQUFJLENBQUMsc0JBQXNCLEdBQUcsSUFBSSxDQUFDOzZCQUN0Qzt5QkFDSjs2QkFBTTs0QkFDSCxJQUFJLENBQUMsZUFBZSxHQUFHLElBQUksQ0FBQyxXQUFXLENBQUMsQ0FBQyxDQUFDLENBQUM7eUJBQzlDO3FCQUNKO29CQUVELEtBQUssQ0FBQyxjQUFjLEVBQUUsQ0FBQztvQkFDdkIsTUFBTTtnQkFFVixJQUFJO2dCQUNKLEtBQUssRUFBRTtvQkFDSCxJQUFJLElBQUksQ0FBQyxLQUFLLEVBQUU7d0JBQ1osSUFBSSxrQkFBa0IsR0FBRyxJQUFJLENBQUMsb0JBQW9CLENBQUMsSUFBSSxDQUFDLGVBQWUsRUFBRSxJQUFJLENBQUMsV0FBVyxDQUFDLENBQUM7d0JBQzNGLElBQUksa0JBQWtCLEtBQUssQ0FBQyxDQUFDLEVBQUU7NEJBQzNCLElBQUksYUFBYSxHQUFHLGtCQUFrQixDQUFDLFNBQVMsR0FBRyxDQUFDLENBQUM7NEJBQ3JELElBQUksYUFBYSxJQUFJLENBQUMsRUFBRTtnQ0FDcEIsSUFBSSxDQUFDLGVBQWUsR0FBRyxJQUFJLENBQUMsc0JBQXNCLENBQUMsSUFBSSxDQUFDLFdBQVcsQ0FBQyxrQkFBa0IsQ0FBQyxVQUFVLENBQUMsQ0FBQyxDQUFDLGFBQWEsQ0FBQyxDQUFDO2dDQUNuSCxJQUFJLENBQUMsc0JBQXNCLEdBQUcsSUFBSSxDQUFDOzZCQUN0QztpQ0FBTSxJQUFJLGFBQWEsR0FBRyxDQUFDLEVBQUU7Z0NBQzFCLElBQUksU0FBUyxHQUFHLElBQUksQ0FBQyxXQUFXLENBQUMsa0JBQWtCLENBQUMsVUFBVSxHQUFHLENBQUMsQ0FBQyxDQUFDO2dDQUNwRSxJQUFJLFNBQVMsRUFBRTtvQ0FDWCxJQUFJLENBQUMsZUFBZSxHQUFHLElBQUksQ0FBQyxzQkFBc0IsQ0FBQyxTQUFTLENBQUMsQ0FBQyxJQUFJLENBQUMsc0JBQXNCLENBQUMsU0FBUyxDQUFDLENBQUMsTUFBTSxHQUFHLENBQUMsQ0FBQyxDQUFDO29DQUNqSCxJQUFJLENBQUMsc0JBQXNCLEdBQUcsSUFBSSxDQUFDO2lDQUN0Qzs2QkFDSjt5QkFDSjtxQkFDSjt5QkFBTTt3QkFDSCxJQUFJLGtCQUFrQixHQUFHLElBQUksQ0FBQyxlQUFlLENBQUMsSUFBSSxDQUFDLGVBQWUsRUFBRSxJQUFJLENBQUMsV0FBVyxDQUFDLENBQUM7d0JBRXRGLElBQUksa0JBQWtCLEdBQUcsQ0FBQyxFQUFFOzRCQUN4QixJQUFJLGFBQWEsR0FBRyxrQkFBa0IsR0FBRyxDQUFDLENBQUM7NEJBQzNDLElBQUksQ0FBQyxlQUFlLEdBQUcsSUFBSSxDQUFDLFdBQVcsQ0FBQyxhQUFhLENBQUMsQ0FBQzs0QkFDdkQsSUFBSSxDQUFDLHNCQUFzQixHQUFHLElBQUksQ0FBQzt5QkFDdEM7cUJBQ0o7b0JBRUQsS0FBSyxDQUFDLGNBQWMsRUFBRSxDQUFDO29CQUN2QixNQUFNO2dCQUVWLE9BQU87Z0JBQ1AsS0FBSyxFQUFFO29CQUNILElBQUksSUFBSSxDQUFDLGVBQWUsRUFBRTt3QkFDdEIsSUFBSSxDQUFDLFVBQVUsQ0FBQyxJQUFJLENBQUMsZUFBZSxDQUFDLENBQUM7d0JBQ3RDLElBQUksQ0FBQyxJQUFJLEVBQUUsQ0FBQztxQkFDZjtvQkFDRCxLQUFLLENBQUMsY0FBYyxFQUFFLENBQUM7b0JBQ3ZCLE1BQU07Z0JBRVYsUUFBUTtnQkFDUixLQUFLLEVBQUU7b0JBQ0gsSUFBSSxDQUFDLElBQUksRUFBRSxDQUFDO29CQUNaLEtBQUssQ0FBQyxjQUFjLEVBQUUsQ0FBQztvQkFDdkIsTUFBTTtnQkFFVixLQUFLO2dCQUNMLEtBQUssQ0FBQztvQkFDRixJQUFJLElBQUksQ0FBQyxlQUFlLEVBQUU7d0JBQ3RCLElBQUksQ0FBQyxVQUFVLENBQUMsSUFBSSxDQUFDLGVBQWUsQ0FBQyxDQUFDO3FCQUN6QztvQkFDRCxJQUFJLENBQUMsSUFBSSxFQUFFLENBQUM7b0JBQ1osTUFBTTthQUNiO1NBQ0o7YUFBTTtZQUNILElBQUksS0FBSyxDQUFDLEtBQUssS0FBSyxFQUFFLElBQUksSUFBSSxDQUFDLFdBQVcsRUFBRTtnQkFDeEMsSUFBSSxDQUFDLE1BQU0sQ0FBQyxLQUFLLEVBQUUsS0FBSyxDQUFDLE1BQU0sQ0FBQyxLQUFLLENBQUMsQ0FBQzthQUMxQztpQkFBTSxJQUFJLEtBQUssQ0FBQyxPQUFPLElBQUksS0FBSyxDQUFDLEdBQUcsS0FBSyxHQUFHLElBQUksQ0FBQyxJQUFJLENBQUMsUUFBUSxFQUFFO2dCQUM3RCxJQUFJLENBQUMsT0FBTyxDQUFDLGFBQWEsQ0FBQyxLQUFLLEdBQUcsSUFBSSxDQUFDLGdCQUFnQixDQUFDLElBQUksQ0FBQyxDQUFDO2dCQUMvRCxJQUFJLENBQUMsS0FBSyxHQUFHLEVBQUUsQ0FBQztnQkFDaEIsSUFBSSxDQUFDLGFBQWEsQ0FBQyxJQUFJLENBQUMsS0FBSyxDQUFDLENBQUM7YUFDbEM7aUJBQU0sSUFBSSxLQUFLLENBQUMsT0FBTyxJQUFJLEtBQUssQ0FBQyxHQUFHLEtBQUssR0FBRyxJQUFJLElBQUksQ0FBQyxRQUFRLEVBQUU7Z0JBQzVELElBQUksQ0FBQyxLQUFLLENBQUMsR0FBRyxFQUFFLENBQUM7Z0JBQ2pCLElBQUksQ0FBQyxhQUFhLENBQUMsSUFBSSxDQUFDLEtBQUssQ0FBQyxDQUFDO2dCQUMvQixJQUFJLENBQUMsaUJBQWlCLEVBQUUsQ0FBQzthQUM1QjtTQUNKO1FBRUQsSUFBSSxJQUFJLENBQUMsUUFBUSxFQUFFO1lBQ2YsUUFBUSxLQUFLLENBQUMsS0FBSyxFQUFFO2dCQUNqQixXQUFXO2dCQUNYLEtBQUssQ0FBQztvQkFDRixJQUFJLElBQUksQ0FBQyxLQUFLLElBQUksSUFBSSxDQUFDLEtBQUssQ0FBQyxNQUFNLElBQUksQ0FBQyxJQUFJLENBQUMsWUFBWSxDQUFDLGFBQWEsQ0FBQyxLQUFLLEVBQUU7d0JBQzNFLElBQUksQ0FBQyxLQUFLLEdBQUcsQ0FBQyxHQUFHLElBQUksQ0FBQyxLQUFLLENBQUMsQ0FBQzt3QkFDN0IsTUFBTSxZQUFZLEdBQUcsSUFBSSxDQUFDLEtBQUssQ0FBQyxHQUFHLEVBQUUsQ0FBQzt3QkFDdEMsSUFBSSxDQUFDLGFBQWEsQ0FBQyxJQUFJLENBQUMsS0FBSyxDQUFDLENBQUM7d0JBQy9CLElBQUksQ0FBQyxpQkFBaUIsRUFBRSxDQUFDO3dCQUN6QixJQUFJLENBQUMsVUFBVSxDQUFDLElBQUksQ0FBQyxZQUFZLENBQUMsQ0FBQztxQkFDdEM7b0JBQ0QsTUFBTTthQUNiO1NBQ0o7UUFFRCxJQUFJLENBQUMsWUFBWSxHQUFHLElBQUksQ0FBQztJQUM3QixDQUFDO0lBRUQsT0FBTyxDQUFDLEtBQUs7UUFDVCxJQUFJLENBQUMsT0FBTyxDQUFDLElBQUksQ0FBQyxLQUFLLENBQUMsQ0FBQztJQUM3QixDQUFDO0lBRUQsWUFBWSxDQUFDLEtBQUs7UUFDZCxJQUFJLENBQUMsSUFBSSxDQUFDLFdBQVcsSUFBSSxJQUFJLENBQUMsZUFBZSxFQUFFO1lBQzNDLElBQUksVUFBVSxHQUFHLElBQUksQ0FBQyxRQUFRLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxZQUFZLENBQUMsYUFBYSxDQUFDLEtBQUssQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLE9BQU8sQ0FBQyxhQUFhLENBQUMsS0FBSyxDQUFDO1lBQzFHLElBQUksQ0FBQyxNQUFNLENBQUMsS0FBSyxFQUFFLFVBQVUsQ0FBQyxDQUFDO1NBQ2xDO1FBRUQsSUFBSSxDQUFDLEtBQUssR0FBRyxJQUFJLENBQUM7UUFDbEIsSUFBSSxDQUFDLE9BQU8sQ0FBQyxJQUFJLENBQUMsS0FBSyxDQUFDLENBQUM7UUFDekIsSUFBSSxDQUFDLFdBQVcsR0FBRyxLQUFLLENBQUM7SUFDN0IsQ0FBQztJQUVELFdBQVcsQ0FBQyxLQUFLO1FBQ2IsSUFBSSxDQUFDLEtBQUssR0FBRyxLQUFLLENBQUM7UUFDbkIsSUFBSSxDQUFDLGNBQWMsRUFBRSxDQUFDO1FBQ3RCLElBQUksQ0FBQyxNQUFNLENBQUMsSUFBSSxDQUFDLEtBQUssQ0FBQyxDQUFDO0lBQzVCLENBQUM7SUFFRCxhQUFhLENBQUMsS0FBSztRQUNmLElBQUksSUFBSSxDQUFDLGNBQWMsRUFBRTtZQUNyQixJQUFJLEtBQUssR0FBRyxLQUFLLENBQUM7WUFDbEIsSUFBSSxVQUFVLEdBQUcsS0FBSyxDQUFDLE1BQU0sQ0FBQyxLQUFLLENBQUMsSUFBSSxFQUFFLENBQUM7WUFFM0MsSUFBSSxJQUFJLENBQUMsV0FBVyxFQUFFO2dCQUNsQixLQUFLLElBQUksVUFBVSxJQUFJLElBQUksQ0FBQyxXQUFXLEVBQUU7b0JBQ3JDLElBQUksU0FBUyxHQUFHLElBQUksQ0FBQyxLQUFLLENBQUMsQ0FBQyxDQUFDLFdBQVcsQ0FBQyxnQkFBZ0IsQ0FBQyxVQUFVLEVBQUUsSUFBSSxDQUFDLEtBQUssQ0FBQyxDQUFDLENBQUMsQ0FBQyxVQUFVLENBQUM7b0JBQy9GLElBQUksU0FBUyxJQUFJLFVBQVUsS0FBSyxTQUFTLENBQUMsSUFBSSxFQUFFLEVBQUU7d0JBQzlDLEtBQUssR0FBRyxJQUFJLENBQUM7d0JBQ2IsSUFBSSxDQUFDLGdDQUFnQyxHQUFHLFVBQVUsQ0FBQyxHQUFHLEVBQUU7NEJBQ3BELElBQUksQ0FBQyxVQUFVLENBQUMsVUFBVSxFQUFFLEtBQUssQ0FBQyxDQUFDO3dCQUN2QyxDQUFDLEVBQUUsR0FBRyxDQUFDLENBQUM7d0JBQ1IsTUFBTTtxQkFDVDtpQkFDSjthQUNKO1lBRUQsSUFBSSxDQUFDLEtBQUssRUFBRTtnQkFDUixJQUFJLElBQUksQ0FBQyxRQUFRLEVBQUU7b0JBQ2YsSUFBSSxDQUFDLFlBQVksQ0FBQyxhQUFhLENBQUMsS0FBSyxHQUFHLEVBQUUsQ0FBQztpQkFDOUM7cUJBQU07b0JBQ0gsSUFBSSxDQUFDLEtBQUssR0FBRyxJQUFJLENBQUM7b0JBQ2xCLElBQUksQ0FBQyxPQUFPLENBQUMsYUFBYSxDQUFDLEtBQUssR0FBRyxFQUFFLENBQUM7aUJBQ3pDO2dCQUVELElBQUksQ0FBQyxPQUFPLENBQUMsSUFBSSxDQUFDLEtBQUssQ0FBQyxDQUFDO2dCQUN6QixJQUFJLENBQUMsYUFBYSxDQUFDLElBQUksQ0FBQyxLQUFLLENBQUMsQ0FBQztnQkFDL0IsSUFBSSxDQUFDLGlCQUFpQixFQUFFLENBQUM7YUFDNUI7U0FDSjtJQUNMLENBQUM7SUFFRCxZQUFZLENBQUMsS0FBcUI7UUFDOUIsSUFBSSxDQUFDLFNBQVMsQ0FBQyxLQUFLLENBQUMsQ0FBQztJQUMxQixDQUFDO0lBRUQsVUFBVSxDQUFDLEdBQVE7UUFDZixJQUFJLFFBQVEsR0FBWSxLQUFLLENBQUM7UUFDOUIsSUFBSSxJQUFJLENBQUMsS0FBSyxJQUFJLElBQUksQ0FBQyxLQUFLLENBQUMsTUFBTSxFQUFFO1lBQ2pDLEtBQUssSUFBSSxDQUFDLEdBQUcsQ0FBQyxFQUFFLENBQUMsR0FBRyxJQUFJLENBQUMsS0FBSyxDQUFDLE1BQU0sRUFBRSxDQUFDLEVBQUUsRUFBRTtnQkFDeEMsSUFBSSxXQUFXLENBQUMsTUFBTSxDQUFDLElBQUksQ0FBQyxLQUFLLENBQUMsQ0FBQyxDQUFDLEVBQUUsR0FBRyxFQUFFLElBQUksQ0FBQyxPQUFPLENBQUMsRUFBRTtvQkFDdEQsUUFBUSxHQUFHLElBQUksQ0FBQztvQkFDaEIsTUFBTTtpQkFDVDthQUNKO1NBQ0o7UUFDRCxPQUFPLFFBQVEsQ0FBQztJQUNwQixDQUFDO0lBRUQsZUFBZSxDQUFDLE1BQU0sRUFBRSxXQUFXO1FBQy9CLElBQUksS0FBSyxHQUFXLENBQUMsQ0FBQyxDQUFDO1FBQ3ZCLElBQUksV0FBVyxFQUFFO1lBQ2IsS0FBSyxJQUFJLENBQUMsR0FBRyxDQUFDLEVBQUUsQ0FBQyxHQUFHLFdBQVcsQ0FBQyxNQUFNLEVBQUUsQ0FBQyxFQUFFLEVBQUU7Z0JBQ3pDLElBQUksV0FBVyxDQUFDLE1BQU0sQ0FBQyxNQUFNLEVBQUUsV0FBVyxDQUFDLENBQUMsQ0FBQyxDQUFDLEVBQUU7b0JBQzVDLEtBQUssR0FBRyxDQUFDLENBQUM7b0JBQ1YsTUFBTTtpQkFDVDthQUNKO1NBQ0o7UUFFRCxPQUFPLEtBQUssQ0FBQztJQUNqQixDQUFDO0lBRUQsb0JBQW9CLENBQUMsR0FBUSxFQUFFLElBQVc7UUFDdEMsSUFBSSxVQUFVLEVBQUUsU0FBUyxDQUFDO1FBRTFCLElBQUksSUFBSSxFQUFFO1lBQ04sS0FBSyxJQUFJLENBQUMsR0FBRyxDQUFDLEVBQUUsQ0FBQyxHQUFHLElBQUksQ0FBQyxNQUFNLEVBQUUsQ0FBQyxFQUFFLEVBQUU7Z0JBQ2xDLFVBQVUsR0FBRyxDQUFDLENBQUM7Z0JBQ2YsU0FBUyxHQUFHLElBQUksQ0FBQyxlQUFlLENBQUMsR0FBRyxFQUFFLElBQUksQ0FBQyxzQkFBc0IsQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDO2dCQUU1RSxJQUFJLFNBQVMsS0FBSyxDQUFDLENBQUMsRUFBRTtvQkFDbEIsTUFBTTtpQkFDVDthQUNKO1NBQ0o7UUFFRCxJQUFJLFNBQVMsS0FBSyxDQUFDLENBQUMsRUFBRTtZQUNsQixPQUFPLEVBQUUsVUFBVSxFQUFFLFVBQVUsRUFBRSxTQUFTLEVBQUUsU0FBUyxFQUFFLENBQUM7U0FDM0Q7YUFBTTtZQUNILE9BQU8sQ0FBQyxDQUFDLENBQUM7U0FDYjtJQUNMLENBQUM7SUFFRCxpQkFBaUI7UUFDYixJQUFJLElBQUksQ0FBQyxRQUFRO1lBQUUsSUFBSSxDQUFDLE1BQU0sR0FBRyxDQUFDLElBQUksQ0FBQyxLQUFLLElBQUksSUFBSSxDQUFDLEtBQUssQ0FBQyxNQUFNLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxZQUFZLElBQUksSUFBSSxDQUFDLFlBQVksQ0FBQyxhQUFhLElBQUksSUFBSSxDQUFDLFlBQVksQ0FBQyxhQUFhLENBQUMsS0FBSyxJQUFJLEVBQUUsQ0FBQyxDQUFDOztZQUN2SyxJQUFJLENBQUMsTUFBTSxHQUFHLENBQUMsSUFBSSxDQUFDLGVBQWUsSUFBSSxJQUFJLENBQUMsZUFBZSxJQUFJLEVBQUUsQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLE9BQU8sSUFBSSxJQUFJLENBQUMsT0FBTyxDQUFDLGFBQWEsSUFBSSxJQUFJLENBQUMsT0FBTyxDQUFDLGFBQWEsQ0FBQyxLQUFLLElBQUksRUFBRSxDQUFDLENBQUM7SUFDdEssQ0FBQztJQUVELGdCQUFnQjtRQUNaLElBQUksY0FBYyxHQUFHLElBQUksQ0FBQyxnQkFBZ0IsQ0FBQyxJQUFJLENBQUMsS0FBSyxDQUFDLENBQUM7UUFDdkQsSUFBSSxDQUFDLGVBQWUsR0FBRyxjQUFjLENBQUM7UUFFdEMsSUFBSSxJQUFJLENBQUMsT0FBTyxJQUFJLElBQUksQ0FBQyxPQUFPLENBQUMsYUFBYSxFQUFFO1lBQzVDLElBQUksQ0FBQyxPQUFPLENBQUMsYUFBYSxDQUFDLEtBQUssR0FBRyxjQUFjLENBQUM7U0FDckQ7UUFFRCxJQUFJLENBQUMsaUJBQWlCLEVBQUUsQ0FBQztJQUM3QixDQUFDO0lBRUQseUJBQXlCO1FBQ3JCLElBQUksQ0FBQyxJQUFJLENBQUMscUJBQXFCLEVBQUU7WUFDN0IsTUFBTSxjQUFjLEdBQVEsSUFBSSxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLEVBQUUsQ0FBQyxhQUFhLENBQUMsYUFBYSxDQUFDLENBQUMsQ0FBQyxVQUFVLENBQUM7WUFFdkYsSUFBSSxDQUFDLHFCQUFxQixHQUFHLElBQUksQ0FBQyxRQUFRLENBQUMsTUFBTSxDQUFDLGNBQWMsRUFBRSxPQUFPLEVBQUUsQ0FBQyxLQUFLLEVBQUUsRUFBRTtnQkFDakYsSUFBSSxLQUFLLENBQUMsS0FBSyxLQUFLLENBQUMsRUFBRTtvQkFDbkIsT0FBTztpQkFDVjtnQkFFRCxJQUFJLENBQUMsSUFBSSxDQUFDLFVBQVUsSUFBSSxDQUFDLElBQUksQ0FBQyxlQUFlLENBQUMsS0FBSyxDQUFDLEVBQUU7b0JBQ2xELElBQUksQ0FBQyxJQUFJLEVBQUUsQ0FBQztpQkFDZjtnQkFFRCxJQUFJLENBQUMsVUFBVSxHQUFHLEtBQUssQ0FBQztnQkFDeEIsSUFBSSxDQUFDLEVBQUUsQ0FBQyxZQUFZLEVBQUUsQ0FBQztZQUMzQixDQUFDLENBQUMsQ0FBQztTQUNOO0lBQ0wsQ0FBQztJQUVELGVBQWUsQ0FBQyxLQUFLO1FBQ2pCLElBQUksSUFBSSxDQUFDLFFBQVEsRUFBRTtZQUNmLElBQUksTUFBTSxHQUFHLEtBQUssQ0FBQyxNQUFNLENBQUM7WUFDMUIsT0FBTyxNQUFNLEtBQUssSUFBSSxDQUFDLGNBQWMsQ0FBQyxhQUFhLElBQUksTUFBTSxDQUFDLFVBQVUsS0FBSyxJQUFJLENBQUMsY0FBYyxDQUFDLGFBQWEsQ0FBQztTQUNsSDthQUFNO1lBQ0gsT0FBTyxLQUFLLENBQUM7U0FDaEI7SUFDTCxDQUFDO0lBRUQsMkJBQTJCO1FBQ3ZCLElBQUksSUFBSSxDQUFDLHFCQUFxQixFQUFFO1lBQzVCLElBQUksQ0FBQyxxQkFBcUIsRUFBRSxDQUFDO1lBQzdCLElBQUksQ0FBQyxxQkFBcUIsR0FBRyxJQUFJLENBQUM7U0FDckM7SUFDTCxDQUFDO0lBRUQsMEJBQTBCO1FBQ3RCLElBQUksQ0FBQyxzQkFBc0IsR0FBRyxJQUFJLENBQUMsY0FBYyxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsQ0FBQztRQUM3RCxNQUFNLENBQUMsZ0JBQWdCLENBQUMsUUFBUSxFQUFFLElBQUksQ0FBQyxzQkFBc0IsQ0FBQyxDQUFDO0lBQ25FLENBQUM7SUFFRCw0QkFBNEI7UUFDeEIsSUFBSSxJQUFJLENBQUMsc0JBQXNCLEVBQUU7WUFDN0IsTUFBTSxDQUFDLG1CQUFtQixDQUFDLFFBQVEsRUFBRSxJQUFJLENBQUMsc0JBQXNCLENBQUMsQ0FBQztZQUNsRSxJQUFJLENBQUMsc0JBQXNCLEdBQUcsSUFBSSxDQUFDO1NBQ3RDO0lBQ0wsQ0FBQztJQUVELGNBQWM7UUFDVixJQUFJLElBQUksQ0FBQyxjQUFjLElBQUksQ0FBQyxVQUFVLENBQUMsYUFBYSxFQUFFLEVBQUU7WUFDcEQsSUFBSSxDQUFDLElBQUksRUFBRSxDQUFDO1NBQ2Y7SUFDTCxDQUFDO0lBRUQsa0JBQWtCO1FBQ2QsSUFBSSxDQUFDLElBQUksQ0FBQyxhQUFhLEVBQUU7WUFDckIsSUFBSSxDQUFDLGFBQWEsR0FBRyxJQUFJLDZCQUE2QixDQUFDLElBQUksQ0FBQyxXQUFXLENBQUMsYUFBYSxFQUFFLEdBQUcsRUFBRTtnQkFDeEYsSUFBSSxJQUFJLENBQUMsY0FBYyxFQUFFO29CQUNyQixJQUFJLENBQUMsSUFBSSxFQUFFLENBQUM7aUJBQ2Y7WUFDTCxDQUFDLENBQUMsQ0FBQztTQUNOO1FBRUQsSUFBSSxDQUFDLGFBQWEsQ0FBQyxrQkFBa0IsRUFBRSxDQUFDO0lBQzVDLENBQUM7SUFFRCxvQkFBb0I7UUFDaEIsSUFBSSxJQUFJLENBQUMsYUFBYSxFQUFFO1lBQ3BCLElBQUksQ0FBQyxhQUFhLENBQUMsb0JBQW9CLEVBQUUsQ0FBQztTQUM3QztJQUNMLENBQUM7SUFFRCxhQUFhO1FBQ1QsSUFBSSxDQUFDLDJCQUEyQixFQUFFLENBQUM7UUFDbkMsSUFBSSxDQUFDLDRCQUE0QixFQUFFLENBQUM7UUFDcEMsSUFBSSxDQUFDLG9CQUFvQixFQUFFLENBQUM7UUFDNUIsSUFBSSxJQUFJLENBQUMsT0FBTyxFQUFFO1lBQ2QsSUFBSSxDQUFDLE9BQU8sR0FBRyxJQUFJLENBQUM7WUFDcEIsSUFBSSxDQUFDLE1BQU0sQ0FBQyxJQUFJLEVBQUUsQ0FBQztTQUN0QjtJQUNMLENBQUM7SUFFRCxXQUFXO1FBQ1AsSUFBSSxJQUFJLENBQUMsZ0NBQWdDLEVBQUU7WUFDdkMsWUFBWSxDQUFDLElBQUksQ0FBQyxnQ0FBZ0MsQ0FBQyxDQUFDO1lBQ3BELElBQUksQ0FBQyxnQ0FBZ0MsR0FBRyxJQUFJLENBQUM7U0FDaEQ7UUFFRCxJQUFJLElBQUksQ0FBQyxhQUFhLEVBQUU7WUFDcEIsSUFBSSxDQUFDLGFBQWEsQ0FBQyxPQUFPLEVBQUUsQ0FBQztZQUM3QixJQUFJLENBQUMsYUFBYSxHQUFHLElBQUksQ0FBQztTQUM3QjtRQUVELElBQUksSUFBSSxDQUFDLE9BQU8sRUFBRTtZQUNkLFdBQVcsQ0FBQyxLQUFLLENBQUMsSUFBSSxDQUFDLE9BQU8sQ0FBQyxDQUFDO1NBQ25DO1FBRUQsSUFBSSxDQUFDLG9CQUFvQixFQUFFLENBQUM7UUFDNUIsSUFBSSxDQUFDLGFBQWEsRUFBRSxDQUFDO0lBQ3pCLENBQUM7O3lHQXA0QlEsWUFBWTs2RkFBWixZQUFZLDg3REFMVixDQUFDLDJCQUEyQixDQUFDLG9EQXNIdkIsYUFBYSxpcUJBelNwQjs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O0tBMktULGsxRkFDVyxDQUFDLE9BQU8sQ0FBQyxrQkFBa0IsRUFBRSxDQUFDLFVBQVUsQ0FBQyxRQUFRLEVBQUUsQ0FBQyxLQUFLLENBQUMsRUFBRSxPQUFPLEVBQUUsQ0FBQyxFQUFFLFNBQVMsRUFBRSxhQUFhLEVBQUUsQ0FBQyxFQUFFLE9BQU8sQ0FBQywwQkFBMEIsQ0FBQyxDQUFDLENBQUMsRUFBRSxVQUFVLENBQUMsUUFBUSxFQUFFLENBQUMsT0FBTyxDQUFDLDBCQUEwQixFQUFFLEtBQUssQ0FBQyxFQUFFLE9BQU8sRUFBRSxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQzsyRkFZcE8sWUFBWTtrQkExTHhCLFNBQVM7K0JBQ0ksZ0JBQWdCLFlBQ2hCOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7S0EyS1QsY0FDVyxDQUFDLE9BQU8sQ0FBQyxrQkFBa0IsRUFBRSxDQUFDLFVBQVUsQ0FBQyxRQUFRLEVBQUUsQ0FBQyxLQUFLLENBQUMsRUFBRSxPQUFPLEVBQUUsQ0FBQyxFQUFFLFNBQVMsRUFBRSxhQUFhLEVBQUUsQ0FBQyxFQUFFLE9BQU8sQ0FBQywwQkFBMEIsQ0FBQyxDQUFDLENBQUMsRUFBRSxVQUFVLENBQUMsUUFBUSxFQUFFLENBQUMsT0FBTyxDQUFDLDBCQUEwQixFQUFFLEtBQUssQ0FBQyxFQUFFLE9BQU8sRUFBRSxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxRQUN2Tzt3QkFDRixLQUFLLEVBQUUsMEJBQTBCO3dCQUNqQywrQkFBK0IsRUFBRSxRQUFRO3dCQUN6Qyw4QkFBOEIsRUFBRSx1REFBdUQ7d0JBQ3ZGLGtDQUFrQyxFQUFFLHdCQUF3QjtxQkFDL0QsYUFDVSxDQUFDLDJCQUEyQixDQUFDLG1CQUN2Qix1QkFBdUIsQ0FBQyxNQUFNLGlCQUNoQyxpQkFBaUIsQ0FBQyxJQUFJO2dQQUk1QixTQUFTO3NCQUFqQixLQUFLO2dCQUVHLEtBQUs7c0JBQWIsS0FBSztnQkFFRyxLQUFLO3NCQUFiLEtBQUs7Z0JBRUcsVUFBVTtzQkFBbEIsS0FBSztnQkFFRyxVQUFVO3NCQUFsQixLQUFLO2dCQUVHLGVBQWU7c0JBQXZCLEtBQUs7Z0JBRUcsVUFBVTtzQkFBbEIsS0FBSztnQkFFRyxPQUFPO3NCQUFmLEtBQUs7Z0JBRUcsZUFBZTtzQkFBdkIsS0FBSztnQkFFRyxXQUFXO3NCQUFuQixLQUFLO2dCQUVHLFFBQVE7c0JBQWhCLEtBQUs7Z0JBRUcsUUFBUTtzQkFBaEIsS0FBSztnQkFFRyxZQUFZO3NCQUFwQixLQUFLO2dCQUVHLElBQUk7c0JBQVosS0FBSztnQkFFRyxhQUFhO3NCQUFyQixLQUFLO2dCQUVHLHFCQUFxQjtzQkFBN0IsS0FBSztnQkFFRyxvQkFBb0I7c0JBQTVCLEtBQUs7Z0JBRUcsU0FBUztzQkFBakIsS0FBSztnQkFFRyxJQUFJO3NCQUFaLEtBQUs7Z0JBRUcsUUFBUTtzQkFBaEIsS0FBSztnQkFFRyxJQUFJO3NCQUFaLEtBQUs7Z0JBRUcsUUFBUTtzQkFBaEIsS0FBSztnQkFFRyxhQUFhO3NCQUFyQixLQUFLO2dCQUVHLGNBQWM7c0JBQXRCLEtBQUs7Z0JBRUcsSUFBSTtzQkFBWixLQUFLO2dCQUVHLFVBQVU7c0JBQWxCLEtBQUs7Z0JBRUcsVUFBVTtzQkFBbEIsS0FBSztnQkFFRyxTQUFTO3NCQUFqQixLQUFLO2dCQUVHLGlCQUFpQjtzQkFBekIsS0FBSztnQkFFRyxjQUFjO3NCQUF0QixLQUFLO2dCQUVHLFlBQVk7c0JBQXBCLEtBQUs7Z0JBRUcsTUFBTTtzQkFBZCxLQUFLO2dCQUVHLEtBQUs7c0JBQWIsS0FBSztnQkFFRyxlQUFlO3NCQUF2QixLQUFLO2dCQUVHLFNBQVM7c0JBQWpCLEtBQUs7Z0JBRUcsS0FBSztzQkFBYixLQUFLO2dCQUVHLFFBQVE7c0JBQWhCLEtBQUs7Z0JBRUcsZ0JBQWdCO3NCQUF4QixLQUFLO2dCQUVHLFlBQVk7c0JBQXBCLEtBQUs7Z0JBRUcsUUFBUTtzQkFBaEIsS0FBSztnQkFFRyxRQUFRO3NCQUFoQixLQUFLO2dCQUVHLE9BQU87c0JBQWYsS0FBSztnQkFFRyxZQUFZO3NCQUFwQixLQUFLO2dCQUVHLHFCQUFxQjtzQkFBN0IsS0FBSztnQkFFRyxxQkFBcUI7c0JBQTdCLEtBQUs7Z0JBRUcsU0FBUztzQkFBakIsS0FBSztnQkFFRyxZQUFZO3NCQUFwQixLQUFLO2dCQUVHLG1CQUFtQjtzQkFBM0IsS0FBSztnQkFFRyxnQkFBZ0I7c0JBQXhCLEtBQUs7Z0JBRWtCLFdBQVc7c0JBQWxDLFNBQVM7dUJBQUMsV0FBVztnQkFFTCxPQUFPO3NCQUF2QixTQUFTO3VCQUFDLElBQUk7Z0JBRU8sWUFBWTtzQkFBakMsU0FBUzt1QkFBQyxTQUFTO2dCQUVTLGdCQUFnQjtzQkFBNUMsU0FBUzt1QkFBQyxnQkFBZ0I7Z0JBRVAsY0FBYztzQkFBakMsU0FBUzt1QkFBQyxPQUFPO2dCQUVFLGNBQWM7c0JBQWpDLFNBQVM7dUJBQUMsT0FBTztnQkFFSyxRQUFRO3NCQUE5QixTQUFTO3VCQUFDLFVBQVU7Z0JBRVcsU0FBUztzQkFBeEMsZUFBZTt1QkFBQyxhQUFhO2dCQUVwQixjQUFjO3NCQUF2QixNQUFNO2dCQUVHLFFBQVE7c0JBQWpCLE1BQU07Z0JBRUcsVUFBVTtzQkFBbkIsTUFBTTtnQkFFRyxPQUFPO3NCQUFoQixNQUFNO2dCQUVHLE1BQU07c0JBQWYsTUFBTTtnQkFFRyxlQUFlO3NCQUF4QixNQUFNO2dCQUVHLE9BQU87c0JBQWhCLE1BQU07Z0JBRUcsT0FBTztzQkFBaEIsTUFBTTtnQkFFRyxNQUFNO3NCQUFmLE1BQU07Z0JBRUcsTUFBTTtzQkFBZixNQUFNO2dCQUVHLFVBQVU7c0JBQW5CLE1BQU07Z0JBSU0sUUFBUTtzQkFBcEIsS0FBSztnQkErRU8sV0FBVztzQkFBdkIsS0FBSzs7QUFrckJWLE1BQU0sT0FBTyxrQkFBa0I7OytHQUFsQixrQkFBa0I7Z0hBQWxCLGtCQUFrQixpQkE1NEJsQixZQUFZLGFBdzRCWCxZQUFZLEVBQUUsZUFBZSxFQUFFLFlBQVksRUFBRSxZQUFZLEVBQUUsWUFBWSxFQUFFLGNBQWMsRUFBRSxlQUFlLGFBeDRCekcsWUFBWSxFQXk0QkcsWUFBWSxFQUFFLGNBQWMsRUFBRSxlQUFlO2dIQUc1RCxrQkFBa0IsWUFKakIsWUFBWSxFQUFFLGVBQWUsRUFBRSxZQUFZLEVBQUUsWUFBWSxFQUFFLFlBQVksRUFBRSxjQUFjLEVBQUUsZUFBZSxFQUMxRixZQUFZLEVBQUUsY0FBYyxFQUFFLGVBQWU7MkZBRzVELGtCQUFrQjtrQkFMOUIsUUFBUTttQkFBQztvQkFDTixPQUFPLEVBQUUsQ0FBQyxZQUFZLEVBQUUsZUFBZSxFQUFFLFlBQVksRUFBRSxZQUFZLEVBQUUsWUFBWSxFQUFFLGNBQWMsRUFBRSxlQUFlLENBQUM7b0JBQ25ILE9BQU8sRUFBRSxDQUFDLFlBQVksRUFBRSxZQUFZLEVBQUUsY0FBYyxFQUFFLGVBQWUsQ0FBQztvQkFDdEUsWUFBWSxFQUFFLENBQUMsWUFBWSxDQUFDO2lCQUMvQiIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7XG4gICAgTmdNb2R1bGUsXG4gICAgQ29tcG9uZW50LFxuICAgIFZpZXdDaGlsZCxcbiAgICBFbGVtZW50UmVmLFxuICAgIEFmdGVyVmlld0NoZWNrZWQsXG4gICAgQWZ0ZXJDb250ZW50SW5pdCxcbiAgICBPbkRlc3Ryb3ksXG4gICAgSW5wdXQsXG4gICAgT3V0cHV0LFxuICAgIEV2ZW50RW1pdHRlcixcbiAgICBDb250ZW50Q2hpbGRyZW4sXG4gICAgUXVlcnlMaXN0LFxuICAgIFRlbXBsYXRlUmVmLFxuICAgIFJlbmRlcmVyMixcbiAgICBmb3J3YXJkUmVmLFxuICAgIENoYW5nZURldGVjdG9yUmVmLFxuICAgIEl0ZXJhYmxlRGlmZmVycyxcbiAgICBDaGFuZ2VEZXRlY3Rpb25TdHJhdGVneSxcbiAgICBWaWV3RW5jYXBzdWxhdGlvblxufSBmcm9tICdAYW5ndWxhci9jb3JlJztcbmltcG9ydCB7IENvbW1vbk1vZHVsZSB9IGZyb20gJ0Bhbmd1bGFyL2NvbW1vbic7XG5pbXBvcnQgeyB0cmlnZ2VyLCBzdHlsZSwgdHJhbnNpdGlvbiwgYW5pbWF0ZSwgQW5pbWF0aW9uRXZlbnQgfSBmcm9tICdAYW5ndWxhci9hbmltYXRpb25zJztcbmltcG9ydCB7IElucHV0VGV4dE1vZHVsZSB9IGZyb20gJ3ByaW1lbmcvaW5wdXR0ZXh0JztcbmltcG9ydCB7IEJ1dHRvbk1vZHVsZSB9IGZyb20gJ3ByaW1lbmcvYnV0dG9uJztcbmltcG9ydCB7IFJpcHBsZU1vZHVsZSB9IGZyb20gJ3ByaW1lbmcvcmlwcGxlJztcbmltcG9ydCB7IFNoYXJlZE1vZHVsZSwgUHJpbWVUZW1wbGF0ZSwgVHJhbnNsYXRpb25LZXlzLCBQcmltZU5HQ29uZmlnLCBPdmVybGF5U2VydmljZSB9IGZyb20gJ3ByaW1lbmcvYXBpJztcbmltcG9ydCB7IERvbUhhbmRsZXIsIENvbm5lY3RlZE92ZXJsYXlTY3JvbGxIYW5kbGVyIH0gZnJvbSAncHJpbWVuZy9kb20nO1xuaW1wb3J0IHsgT2JqZWN0VXRpbHMsIFVuaXF1ZUNvbXBvbmVudElkLCBaSW5kZXhVdGlscyB9IGZyb20gJ3ByaW1lbmcvdXRpbHMnO1xuaW1wb3J0IHsgTkdfVkFMVUVfQUNDRVNTT1IsIENvbnRyb2xWYWx1ZUFjY2Vzc29yIH0gZnJvbSAnQGFuZ3VsYXIvZm9ybXMnO1xuaW1wb3J0IHsgU2Nyb2xsZXIsIFNjcm9sbGVyTW9kdWxlLCBTY3JvbGxlck9wdGlvbnMgfSBmcm9tICdwcmltZW5nL3Njcm9sbGVyJztcbmltcG9ydCB7IEF1dG9Gb2N1c01vZHVsZSB9IGZyb20gJ3ByaW1lbmcvYXV0b2ZvY3VzJztcblxuZXhwb3J0IGNvbnN0IEFVVE9DT01QTEVURV9WQUxVRV9BQ0NFU1NPUjogYW55ID0ge1xuICAgIHByb3ZpZGU6IE5HX1ZBTFVFX0FDQ0VTU09SLFxuICAgIHVzZUV4aXN0aW5nOiBmb3J3YXJkUmVmKCgpID0+IEF1dG9Db21wbGV0ZSksXG4gICAgbXVsdGk6IHRydWVcbn07XG5cbkBDb21wb25lbnQoe1xuICAgIHNlbGVjdG9yOiAncC1hdXRvQ29tcGxldGUnLFxuICAgIHRlbXBsYXRlOiBgXG4gICAgICAgIDxzcGFuICNjb250YWluZXIgW25nQ2xhc3NdPVwieyAncC1hdXRvY29tcGxldGUgcC1jb21wb25lbnQnOiB0cnVlLCAncC1hdXRvY29tcGxldGUtZGQnOiBkcm9wZG93biwgJ3AtYXV0b2NvbXBsZXRlLW11bHRpcGxlJzogbXVsdGlwbGUgfVwiIFtuZ1N0eWxlXT1cInN0eWxlXCIgW2NsYXNzXT1cInN0eWxlQ2xhc3NcIj5cbiAgICAgICAgICAgIDxpbnB1dFxuICAgICAgICAgICAgICAgIHBBdXRvRm9jdXNcbiAgICAgICAgICAgICAgICBbYXV0b2ZvY3VzXT1cImF1dG9mb2N1c1wiXG4gICAgICAgICAgICAgICAgKm5nSWY9XCIhbXVsdGlwbGVcIlxuICAgICAgICAgICAgICAgICNpblxuICAgICAgICAgICAgICAgIFthdHRyLnR5cGVdPVwidHlwZVwiXG4gICAgICAgICAgICAgICAgW2F0dHIuaWRdPVwiaW5wdXRJZFwiXG4gICAgICAgICAgICAgICAgW25nU3R5bGVdPVwiaW5wdXRTdHlsZVwiXG4gICAgICAgICAgICAgICAgW2NsYXNzXT1cImlucHV0U3R5bGVDbGFzc1wiXG4gICAgICAgICAgICAgICAgW2F1dG9jb21wbGV0ZV09XCJhdXRvY29tcGxldGVcIlxuICAgICAgICAgICAgICAgIFthdHRyLnJlcXVpcmVkXT1cInJlcXVpcmVkXCJcbiAgICAgICAgICAgICAgICBbYXR0ci5uYW1lXT1cIm5hbWVcIlxuICAgICAgICAgICAgICAgIGNsYXNzPVwicC1hdXRvY29tcGxldGUtaW5wdXQgcC1pbnB1dHRleHQgcC1jb21wb25lbnRcIlxuICAgICAgICAgICAgICAgIFtuZ0NsYXNzXT1cInsgJ3AtYXV0b2NvbXBsZXRlLWRkLWlucHV0JzogZHJvcGRvd24sICdwLWRpc2FibGVkJzogZGlzYWJsZWQgfVwiXG4gICAgICAgICAgICAgICAgW3ZhbHVlXT1cImlucHV0RmllbGRWYWx1ZVwiXG4gICAgICAgICAgICAgICAgYXJpYS1hdXRvY29tcGxldGU9XCJsaXN0XCJcbiAgICAgICAgICAgICAgICByb2xlPVwic2VhcmNoYm94XCJcbiAgICAgICAgICAgICAgICAoY2xpY2spPVwib25JbnB1dENsaWNrKCRldmVudClcIlxuICAgICAgICAgICAgICAgIChpbnB1dCk9XCJvbklucHV0KCRldmVudClcIlxuICAgICAgICAgICAgICAgIChrZXlkb3duKT1cIm9uS2V5ZG93bigkZXZlbnQpXCJcbiAgICAgICAgICAgICAgICAoa2V5dXApPVwib25LZXl1cCgkZXZlbnQpXCJcbiAgICAgICAgICAgICAgICAoZm9jdXMpPVwib25JbnB1dEZvY3VzKCRldmVudClcIlxuICAgICAgICAgICAgICAgIChibHVyKT1cIm9uSW5wdXRCbHVyKCRldmVudClcIlxuICAgICAgICAgICAgICAgIChjaGFuZ2UpPVwib25JbnB1dENoYW5nZSgkZXZlbnQpXCJcbiAgICAgICAgICAgICAgICAocGFzdGUpPVwib25JbnB1dFBhc3RlKCRldmVudClcIlxuICAgICAgICAgICAgICAgIFthdHRyLnBsYWNlaG9sZGVyXT1cInBsYWNlaG9sZGVyXCJcbiAgICAgICAgICAgICAgICBbYXR0ci5zaXplXT1cInNpemVcIlxuICAgICAgICAgICAgICAgIFthdHRyLm1heGxlbmd0aF09XCJtYXhsZW5ndGhcIlxuICAgICAgICAgICAgICAgIFthdHRyLnRhYmluZGV4XT1cInRhYmluZGV4XCJcbiAgICAgICAgICAgICAgICBbcmVhZG9ubHldPVwicmVhZG9ubHlcIlxuICAgICAgICAgICAgICAgIFtkaXNhYmxlZF09XCJkaXNhYmxlZFwiXG4gICAgICAgICAgICAgICAgW2F0dHIuYXJpYS1sYWJlbF09XCJhcmlhTGFiZWxcIlxuICAgICAgICAgICAgICAgIFthdHRyLmFyaWEtbGFiZWxsZWRieV09XCJhcmlhTGFiZWxsZWRCeVwiXG4gICAgICAgICAgICAgICAgW2F0dHIuYXJpYS1yZXF1aXJlZF09XCJyZXF1aXJlZFwiXG4gICAgICAgICAgICAvPlxuICAgICAgICAgICAgPGkgKm5nSWY9XCIhbXVsdGlwbGUgJiYgZmlsbGVkICYmICFkaXNhYmxlZCAmJiBzaG93Q2xlYXJcIiBjbGFzcz1cInAtYXV0b2NvbXBsZXRlLWNsZWFyLWljb24gcGkgcGktdGltZXNcIiAoY2xpY2spPVwiY2xlYXIoKVwiPjwvaT5cbiAgICAgICAgICAgIDxpICpuZ0lmPVwibXVsdGlwbGUgJiYgZmlsbGVkICYmICFkaXNhYmxlZCAmJiBzaG93Q2xlYXJcIiBjbGFzcz1cInAtYXV0b2NvbXBsZXRlLWNsZWFyLWljb24gcGkgcGktdGltZXNcIiAoY2xpY2spPVwiY2xlYXIoKVwiPjwvaT5cbiAgICAgICAgICAgIDx1bCAqbmdJZj1cIm11bHRpcGxlXCIgI211bHRpQ29udGFpbmVyIGNsYXNzPVwicC1hdXRvY29tcGxldGUtbXVsdGlwbGUtY29udGFpbmVyIHAtY29tcG9uZW50IHAtaW5wdXR0ZXh0XCIgW25nQ2xhc3NdPVwieyAncC1kaXNhYmxlZCc6IGRpc2FibGVkLCAncC1mb2N1cyc6IGZvY3VzIH1cIiAoY2xpY2spPVwibXVsdGlJbi5mb2N1cygpXCI+XG4gICAgICAgICAgICAgICAgPGxpICN0b2tlbiAqbmdGb3I9XCJsZXQgdmFsIG9mIHZhbHVlXCIgY2xhc3M9XCJwLWF1dG9jb21wbGV0ZS10b2tlblwiPlxuICAgICAgICAgICAgICAgICAgICA8bmctY29udGFpbmVyICpuZ1RlbXBsYXRlT3V0bGV0PVwic2VsZWN0ZWRJdGVtVGVtcGxhdGU7IGNvbnRleHQ6IHsgJGltcGxpY2l0OiB2YWwgfVwiPjwvbmctY29udGFpbmVyPlxuICAgICAgICAgICAgICAgICAgICA8c3BhbiAqbmdJZj1cIiFzZWxlY3RlZEl0ZW1UZW1wbGF0ZVwiIGNsYXNzPVwicC1hdXRvY29tcGxldGUtdG9rZW4tbGFiZWxcIj57eyByZXNvbHZlRmllbGREYXRhKHZhbCkgfX08L3NwYW4+XG4gICAgICAgICAgICAgICAgICAgIDxzcGFuIGNsYXNzPVwicC1hdXRvY29tcGxldGUtdG9rZW4taWNvbiBwaSBwaS10aW1lcy1jaXJjbGVcIiAoY2xpY2spPVwicmVtb3ZlSXRlbSh0b2tlbilcIiAqbmdJZj1cIiFkaXNhYmxlZCAmJiAhcmVhZG9ubHlcIj48L3NwYW4+XG4gICAgICAgICAgICAgICAgPC9saT5cbiAgICAgICAgICAgICAgICA8bGkgY2xhc3M9XCJwLWF1dG9jb21wbGV0ZS1pbnB1dC10b2tlblwiPlxuICAgICAgICAgICAgICAgICAgICA8aW5wdXRcbiAgICAgICAgICAgICAgICAgICAgICAgIHBBdXRvRm9jdXNcbiAgICAgICAgICAgICAgICAgICAgICAgIFthdXRvZm9jdXNdPVwiYXV0b2ZvY3VzXCJcbiAgICAgICAgICAgICAgICAgICAgICAgICNtdWx0aUluXG4gICAgICAgICAgICAgICAgICAgICAgICBbYXR0ci50eXBlXT1cInR5cGVcIlxuICAgICAgICAgICAgICAgICAgICAgICAgW2F0dHIuaWRdPVwiaW5wdXRJZFwiXG4gICAgICAgICAgICAgICAgICAgICAgICBbZGlzYWJsZWRdPVwiZGlzYWJsZWRcIlxuICAgICAgICAgICAgICAgICAgICAgICAgW2F0dHIucGxhY2Vob2xkZXJdPVwidmFsdWUgJiYgdmFsdWUubGVuZ3RoID8gbnVsbCA6IHBsYWNlaG9sZGVyXCJcbiAgICAgICAgICAgICAgICAgICAgICAgIFthdHRyLnRhYmluZGV4XT1cInRhYmluZGV4XCJcbiAgICAgICAgICAgICAgICAgICAgICAgIFthdHRyLm1heGxlbmd0aF09XCJtYXhsZW5ndGhcIlxuICAgICAgICAgICAgICAgICAgICAgICAgKGlucHV0KT1cIm9uSW5wdXQoJGV2ZW50KVwiXG4gICAgICAgICAgICAgICAgICAgICAgICAoY2xpY2spPVwib25JbnB1dENsaWNrKCRldmVudClcIlxuICAgICAgICAgICAgICAgICAgICAgICAgKGtleWRvd24pPVwib25LZXlkb3duKCRldmVudClcIlxuICAgICAgICAgICAgICAgICAgICAgICAgW3JlYWRvbmx5XT1cInJlYWRvbmx5XCJcbiAgICAgICAgICAgICAgICAgICAgICAgIChrZXl1cCk9XCJvbktleXVwKCRldmVudClcIlxuICAgICAgICAgICAgICAgICAgICAgICAgKGZvY3VzKT1cIm9uSW5wdXRGb2N1cygkZXZlbnQpXCJcbiAgICAgICAgICAgICAgICAgICAgICAgIChibHVyKT1cIm9uSW5wdXRCbHVyKCRldmVudClcIlxuICAgICAgICAgICAgICAgICAgICAgICAgKGNoYW5nZSk9XCJvbklucHV0Q2hhbmdlKCRldmVudClcIlxuICAgICAgICAgICAgICAgICAgICAgICAgKHBhc3RlKT1cIm9uSW5wdXRQYXN0ZSgkZXZlbnQpXCJcbiAgICAgICAgICAgICAgICAgICAgICAgIFthdXRvY29tcGxldGVdPVwiYXV0b2NvbXBsZXRlXCJcbiAgICAgICAgICAgICAgICAgICAgICAgIFtuZ1N0eWxlXT1cImlucHV0U3R5bGVcIlxuICAgICAgICAgICAgICAgICAgICAgICAgW2NsYXNzXT1cImlucHV0U3R5bGVDbGFzc1wiXG4gICAgICAgICAgICAgICAgICAgICAgICBbYXR0ci5hcmlhLWxhYmVsXT1cImFyaWFMYWJlbFwiXG4gICAgICAgICAgICAgICAgICAgICAgICBbYXR0ci5hcmlhLWxhYmVsbGVkYnldPVwiYXJpYUxhYmVsbGVkQnlcIlxuICAgICAgICAgICAgICAgICAgICAgICAgW2F0dHIuYXJpYS1yZXF1aXJlZF09XCJyZXF1aXJlZFwiXG4gICAgICAgICAgICAgICAgICAgICAgICBhcmlhLWF1dG9jb21wbGV0ZT1cImxpc3RcIlxuICAgICAgICAgICAgICAgICAgICAgICAgW2F0dHIuYXJpYS1jb250cm9sc109XCJsaXN0SWRcIlxuICAgICAgICAgICAgICAgICAgICAgICAgcm9sZT1cInNlYXJjaGJveFwiXG4gICAgICAgICAgICAgICAgICAgICAgICBbYXR0ci5hcmlhLWV4cGFuZGVkXT1cIm92ZXJsYXlWaXNpYmxlXCJcbiAgICAgICAgICAgICAgICAgICAgICAgIGFyaWEtaGFzcG9wdXA9XCJ0cnVlXCJcbiAgICAgICAgICAgICAgICAgICAgICAgIFthdHRyLmFyaWEtYWN0aXZlZGVzY2VuZGFudF09XCIncC1oaWdobGlnaHRlZC1vcHRpb24nXCJcbiAgICAgICAgICAgICAgICAgICAgLz5cbiAgICAgICAgICAgICAgICA8L2xpPlxuICAgICAgICAgICAgPC91bD5cbiAgICAgICAgICAgIDxpICpuZ0lmPVwibG9hZGluZ1wiIGNsYXNzPVwicC1hdXRvY29tcGxldGUtbG9hZGVyIHBpIHBpLXNwaW5uZXIgcGktc3BpblwiPjwvaVxuICAgICAgICAgICAgPjxidXR0b25cbiAgICAgICAgICAgICAgICAjZGRCdG5cbiAgICAgICAgICAgICAgICB0eXBlPVwiYnV0dG9uXCJcbiAgICAgICAgICAgICAgICBwQnV0dG9uXG4gICAgICAgICAgICAgICAgW2ljb25dPVwiZHJvcGRvd25JY29uXCJcbiAgICAgICAgICAgICAgICBbYXR0ci5hcmlhLWxhYmVsXT1cImRyb3Bkb3duQXJpYUxhYmVsXCJcbiAgICAgICAgICAgICAgICBjbGFzcz1cInAtYXV0b2NvbXBsZXRlLWRyb3Bkb3duXCJcbiAgICAgICAgICAgICAgICBbZGlzYWJsZWRdPVwiZGlzYWJsZWRcIlxuICAgICAgICAgICAgICAgIHBSaXBwbGVcbiAgICAgICAgICAgICAgICAoY2xpY2spPVwiaGFuZGxlRHJvcGRvd25DbGljaygkZXZlbnQpXCJcbiAgICAgICAgICAgICAgICAqbmdJZj1cImRyb3Bkb3duXCJcbiAgICAgICAgICAgICAgICBbYXR0ci50YWJpbmRleF09XCJ0YWJpbmRleFwiXG4gICAgICAgICAgICA+PC9idXR0b24+XG4gICAgICAgICAgICA8ZGl2XG4gICAgICAgICAgICAgICAgI3BhbmVsXG4gICAgICAgICAgICAgICAgKm5nSWY9XCJvdmVybGF5VmlzaWJsZVwiXG4gICAgICAgICAgICAgICAgKGNsaWNrKT1cIm9uT3ZlcmxheUNsaWNrKCRldmVudClcIlxuICAgICAgICAgICAgICAgIFtuZ0NsYXNzXT1cIlsncC1hdXRvY29tcGxldGUtcGFuZWwgcC1jb21wb25lbnQnXVwiXG4gICAgICAgICAgICAgICAgW3N0eWxlLm1heC1oZWlnaHRdPVwidmlydHVhbFNjcm9sbCA/ICdhdXRvJyA6IHNjcm9sbEhlaWdodFwiXG4gICAgICAgICAgICAgICAgW25nU3R5bGVdPVwicGFuZWxTdHlsZVwiXG4gICAgICAgICAgICAgICAgW2NsYXNzXT1cInBhbmVsU3R5bGVDbGFzc1wiXG4gICAgICAgICAgICAgICAgW0BvdmVybGF5QW5pbWF0aW9uXT1cInsgdmFsdWU6ICd2aXNpYmxlJywgcGFyYW1zOiB7IHNob3dUcmFuc2l0aW9uUGFyYW1zOiBzaG93VHJhbnNpdGlvbk9wdGlvbnMsIGhpZGVUcmFuc2l0aW9uUGFyYW1zOiBoaWRlVHJhbnNpdGlvbk9wdGlvbnMgfSB9XCJcbiAgICAgICAgICAgICAgICAoQG92ZXJsYXlBbmltYXRpb24uc3RhcnQpPVwib25PdmVybGF5QW5pbWF0aW9uU3RhcnQoJGV2ZW50KVwiXG4gICAgICAgICAgICAgICAgKEBvdmVybGF5QW5pbWF0aW9uLmRvbmUpPVwib25PdmVybGF5QW5pbWF0aW9uRW5kKCRldmVudClcIlxuICAgICAgICAgICAgPlxuICAgICAgICAgICAgICAgIDxuZy1jb250YWluZXIgKm5nVGVtcGxhdGVPdXRsZXQ9XCJoZWFkZXJUZW1wbGF0ZVwiPjwvbmctY29udGFpbmVyPlxuICAgICAgICAgICAgICAgIDxwLXNjcm9sbGVyXG4gICAgICAgICAgICAgICAgICAgICpuZ0lmPVwidmlydHVhbFNjcm9sbFwiXG4gICAgICAgICAgICAgICAgICAgICNzY3JvbGxlclxuICAgICAgICAgICAgICAgICAgICBbaXRlbXNdPVwic3VnZ2VzdGlvbnNcIlxuICAgICAgICAgICAgICAgICAgICBbc3R5bGVdPVwieyBoZWlnaHQ6IHNjcm9sbEhlaWdodCB9XCJcbiAgICAgICAgICAgICAgICAgICAgW2l0ZW1TaXplXT1cInZpcnR1YWxTY3JvbGxJdGVtU2l6ZSB8fCBfaXRlbVNpemVcIlxuICAgICAgICAgICAgICAgICAgICBbYXV0b1NpemVdPVwidHJ1ZVwiXG4gICAgICAgICAgICAgICAgICAgIFtsYXp5XT1cImxhenlcIlxuICAgICAgICAgICAgICAgICAgICAob25MYXp5TG9hZCk9XCJvbkxhenlMb2FkLmVtaXQoJGV2ZW50KVwiXG4gICAgICAgICAgICAgICAgICAgIFtvcHRpb25zXT1cInZpcnR1YWxTY3JvbGxPcHRpb25zXCJcbiAgICAgICAgICAgICAgICA+XG4gICAgICAgICAgICAgICAgICAgIDxuZy10ZW1wbGF0ZSBwVGVtcGxhdGU9XCJjb250ZW50XCIgbGV0LWl0ZW1zIGxldC1zY3JvbGxlck9wdGlvbnM9XCJvcHRpb25zXCI+XG4gICAgICAgICAgICAgICAgICAgICAgICA8bmctY29udGFpbmVyICpuZ1RlbXBsYXRlT3V0bGV0PVwiYnVpbGRJbkl0ZW1zOyBjb250ZXh0OiB7ICRpbXBsaWNpdDogaXRlbXMsIG9wdGlvbnM6IHNjcm9sbGVyT3B0aW9ucyB9XCI+PC9uZy1jb250YWluZXI+XG4gICAgICAgICAgICAgICAgICAgIDwvbmctdGVtcGxhdGU+XG4gICAgICAgICAgICAgICAgICAgIDxuZy1jb250YWluZXIgKm5nSWY9XCJsb2FkZXJUZW1wbGF0ZVwiPlxuICAgICAgICAgICAgICAgICAgICAgICAgPG5nLXRlbXBsYXRlIHBUZW1wbGF0ZT1cImxvYWRlclwiIGxldC1zY3JvbGxlck9wdGlvbnM9XCJvcHRpb25zXCI+XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgPG5nLWNvbnRhaW5lciAqbmdUZW1wbGF0ZU91dGxldD1cImxvYWRlclRlbXBsYXRlOyBjb250ZXh0OiB7IG9wdGlvbnM6IHNjcm9sbGVyT3B0aW9ucyB9XCI+PC9uZy1jb250YWluZXI+XG4gICAgICAgICAgICAgICAgICAgICAgICA8L25nLXRlbXBsYXRlPlxuICAgICAgICAgICAgICAgICAgICA8L25nLWNvbnRhaW5lcj5cbiAgICAgICAgICAgICAgICA8L3Atc2Nyb2xsZXI+XG4gICAgICAgICAgICAgICAgPG5nLWNvbnRhaW5lciAqbmdJZj1cIiF2aXJ0dWFsU2Nyb2xsXCI+XG4gICAgICAgICAgICAgICAgICAgIDxuZy1jb250YWluZXIgKm5nVGVtcGxhdGVPdXRsZXQ9XCJidWlsZEluSXRlbXM7IGNvbnRleHQ6IHsgJGltcGxpY2l0OiBzdWdnZXN0aW9ucywgb3B0aW9uczoge30gfVwiPjwvbmctY29udGFpbmVyPlxuICAgICAgICAgICAgICAgIDwvbmctY29udGFpbmVyPlxuXG4gICAgICAgICAgICAgICAgPG5nLXRlbXBsYXRlICNidWlsZEluSXRlbXMgbGV0LWl0ZW1zIGxldC1zY3JvbGxlck9wdGlvbnM9XCJvcHRpb25zXCI+XG4gICAgICAgICAgICAgICAgICAgIDx1bCAjaXRlbXMgcm9sZT1cImxpc3Rib3hcIiBbYXR0ci5pZF09XCJsaXN0SWRcIiBjbGFzcz1cInAtYXV0b2NvbXBsZXRlLWl0ZW1zXCIgW25nQ2xhc3NdPVwic2Nyb2xsZXJPcHRpb25zLmNvbnRlbnRTdHlsZUNsYXNzXCIgW3N0eWxlXT1cInNjcm9sbGVyT3B0aW9ucy5jb250ZW50U3R5bGVcIj5cbiAgICAgICAgICAgICAgICAgICAgICAgIDxuZy1jb250YWluZXIgKm5nSWY9XCJncm91cFwiPlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIDxuZy10ZW1wbGF0ZSBuZ0ZvciBsZXQtb3B0Z3JvdXAgW25nRm9yT2ZdPVwiaXRlbXNcIj5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPGxpIGNsYXNzPVwicC1hdXRvY29tcGxldGUtaXRlbS1ncm91cFwiIFtuZ1N0eWxlXT1cInsgaGVpZ2h0OiBzY3JvbGxlck9wdGlvbnMuaXRlbVNpemUgKyAncHgnIH1cIj5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDxzcGFuICpuZ0lmPVwiIWdyb3VwVGVtcGxhdGVcIj57eyBnZXRPcHRpb25Hcm91cExhYmVsKG9wdGdyb3VwKSB8fCAnZW1wdHknIH19PC9zcGFuPlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPG5nLWNvbnRhaW5lciAqbmdUZW1wbGF0ZU91dGxldD1cImdyb3VwVGVtcGxhdGU7IGNvbnRleHQ6IHsgJGltcGxpY2l0OiBvcHRncm91cCB9XCI+PC9uZy1jb250YWluZXI+XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDwvbGk+XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDxuZy1jb250YWluZXIgKm5nVGVtcGxhdGVPdXRsZXQ9XCJpdGVtc2xpc3Q7IGNvbnRleHQ6IHsgJGltcGxpY2l0OiBnZXRPcHRpb25Hcm91cENoaWxkcmVuKG9wdGdyb3VwKSB9XCI+PC9uZy1jb250YWluZXI+XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgPC9uZy10ZW1wbGF0ZT5cbiAgICAgICAgICAgICAgICAgICAgICAgIDwvbmctY29udGFpbmVyPlxuICAgICAgICAgICAgICAgICAgICAgICAgPG5nLWNvbnRhaW5lciAqbmdJZj1cIiFncm91cFwiPlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIDxuZy1jb250YWluZXIgKm5nVGVtcGxhdGVPdXRsZXQ9XCJpdGVtc2xpc3Q7IGNvbnRleHQ6IHsgJGltcGxpY2l0OiBpdGVtcyB9XCI+PC9uZy1jb250YWluZXI+XG4gICAgICAgICAgICAgICAgICAgICAgICA8L25nLWNvbnRhaW5lcj5cbiAgICAgICAgICAgICAgICAgICAgICAgIDxuZy10ZW1wbGF0ZSAjaXRlbXNsaXN0IGxldC1zdWdnZXN0aW9uc1RvRGlzcGxheT5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICA8bGlcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgcm9sZT1cIm9wdGlvblwiXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICpuZ0Zvcj1cImxldCBvcHRpb24gb2Ygc3VnZ2VzdGlvbnNUb0Rpc3BsYXk7IGxldCBpZHggPSBpbmRleFwiXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNsYXNzPVwicC1hdXRvY29tcGxldGUtaXRlbVwiXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHBSaXBwbGVcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgW25nU3R5bGVdPVwieyBoZWlnaHQ6IHNjcm9sbGVyT3B0aW9ucy5pdGVtU2l6ZSArICdweCcgfVwiXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIFtuZ0NsYXNzXT1cInsgJ3AtaGlnaGxpZ2h0Jzogb3B0aW9uID09PSBoaWdobGlnaHRPcHRpb24gfVwiXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIFtpZF09XCJoaWdobGlnaHRPcHRpb24gPT0gb3B0aW9uID8gJ3AtaGlnaGxpZ2h0ZWQtb3B0aW9uJyA6ICcnXCJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgKGNsaWNrKT1cInNlbGVjdEl0ZW0ob3B0aW9uKVwiXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgPlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8c3BhbiAqbmdJZj1cIiFpdGVtVGVtcGxhdGVcIj57eyByZXNvbHZlRmllbGREYXRhKG9wdGlvbikgfX08L3NwYW4+XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDxuZy1jb250YWluZXIgKm5nVGVtcGxhdGVPdXRsZXQ9XCJpdGVtVGVtcGxhdGU7IGNvbnRleHQ6IHsgJGltcGxpY2l0OiBvcHRpb24sIGluZGV4OiBzY3JvbGxlck9wdGlvbnMuZ2V0T3B0aW9ucyA/IHNjcm9sbGVyT3B0aW9ucy5nZXRPcHRpb25zKGlkeCkgOiBpZHggfVwiPjwvbmctY29udGFpbmVyPlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIDwvbGk+XG4gICAgICAgICAgICAgICAgICAgICAgICA8L25nLXRlbXBsYXRlPlxuICAgICAgICAgICAgICAgICAgICAgICAgPGxpICpuZ0lmPVwibm9SZXN1bHRzICYmIHNob3dFbXB0eU1lc3NhZ2VcIiBjbGFzcz1cInAtYXV0b2NvbXBsZXRlLWVtcHR5LW1lc3NhZ2VcIiBbbmdTdHlsZV09XCJ7IGhlaWdodDogc2Nyb2xsZXJPcHRpb25zLml0ZW1TaXplICsgJ3B4JyB9XCI+XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgPG5nLWNvbnRhaW5lciAqbmdJZj1cIiFlbXB0eVRlbXBsYXRlOyBlbHNlIGVtcHR5XCI+XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHt7IGVtcHR5TWVzc2FnZUxhYmVsIH19XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgPC9uZy1jb250YWluZXI+XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgPG5nLWNvbnRhaW5lciAjZW1wdHkgKm5nVGVtcGxhdGVPdXRsZXQ9XCJlbXB0eVRlbXBsYXRlXCI+PC9uZy1jb250YWluZXI+XG4gICAgICAgICAgICAgICAgICAgICAgICA8L2xpPlxuICAgICAgICAgICAgICAgICAgICA8L3VsPlxuICAgICAgICAgICAgICAgIDwvbmctdGVtcGxhdGU+XG4gICAgICAgICAgICAgICAgPG5nLWNvbnRhaW5lciAqbmdUZW1wbGF0ZU91dGxldD1cImZvb3RlclRlbXBsYXRlXCI+PC9uZy1jb250YWluZXI+XG4gICAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgPC9zcGFuPlxuICAgIGAsXG4gICAgYW5pbWF0aW9uczogW3RyaWdnZXIoJ292ZXJsYXlBbmltYXRpb24nLCBbdHJhbnNpdGlvbignOmVudGVyJywgW3N0eWxlKHsgb3BhY2l0eTogMCwgdHJhbnNmb3JtOiAnc2NhbGVZKDAuOCknIH0pLCBhbmltYXRlKCd7e3Nob3dUcmFuc2l0aW9uUGFyYW1zfX0nKV0pLCB0cmFuc2l0aW9uKCc6bGVhdmUnLCBbYW5pbWF0ZSgne3toaWRlVHJhbnNpdGlvblBhcmFtc319Jywgc3R5bGUoeyBvcGFjaXR5OiAwIH0pKV0pXSldLFxuICAgIGhvc3Q6IHtcbiAgICAgICAgY2xhc3M6ICdwLWVsZW1lbnQgcC1pbnB1dHdyYXBwZXInLFxuICAgICAgICAnW2NsYXNzLnAtaW5wdXR3cmFwcGVyLWZpbGxlZF0nOiAnZmlsbGVkJyxcbiAgICAgICAgJ1tjbGFzcy5wLWlucHV0d3JhcHBlci1mb2N1c10nOiAnKChmb2N1cyAmJiAhZGlzYWJsZWQpIHx8IGF1dG9mb2N1cykgfHwgb3ZlcmxheVZpc2libGUnLFxuICAgICAgICAnW2NsYXNzLnAtYXV0b2NvbXBsZXRlLWNsZWFyYWJsZV0nOiAnc2hvd0NsZWFyICYmICFkaXNhYmxlZCdcbiAgICB9LFxuICAgIHByb3ZpZGVyczogW0FVVE9DT01QTEVURV9WQUxVRV9BQ0NFU1NPUl0sXG4gICAgY2hhbmdlRGV0ZWN0aW9uOiBDaGFuZ2VEZXRlY3Rpb25TdHJhdGVneS5PblB1c2gsXG4gICAgZW5jYXBzdWxhdGlvbjogVmlld0VuY2Fwc3VsYXRpb24uTm9uZSxcbiAgICBzdHlsZVVybHM6IFsnLi9hdXRvY29tcGxldGUuY3NzJ11cbn0pXG5leHBvcnQgY2xhc3MgQXV0b0NvbXBsZXRlIGltcGxlbWVudHMgQWZ0ZXJWaWV3Q2hlY2tlZCwgQWZ0ZXJDb250ZW50SW5pdCwgT25EZXN0cm95LCBDb250cm9sVmFsdWVBY2Nlc3NvciB7XG4gICAgQElucHV0KCkgbWluTGVuZ3RoOiBudW1iZXIgPSAxO1xuXG4gICAgQElucHV0KCkgZGVsYXk6IG51bWJlciA9IDMwMDtcblxuICAgIEBJbnB1dCgpIHN0eWxlOiBhbnk7XG5cbiAgICBASW5wdXQoKSBwYW5lbFN0eWxlOiBhbnk7XG5cbiAgICBASW5wdXQoKSBzdHlsZUNsYXNzOiBzdHJpbmc7XG5cbiAgICBASW5wdXQoKSBwYW5lbFN0eWxlQ2xhc3M6IHN0cmluZztcblxuICAgIEBJbnB1dCgpIGlucHV0U3R5bGU6IGFueTtcblxuICAgIEBJbnB1dCgpIGlucHV0SWQ6IHN0cmluZztcblxuICAgIEBJbnB1dCgpIGlucHV0U3R5bGVDbGFzczogc3RyaW5nO1xuXG4gICAgQElucHV0KCkgcGxhY2Vob2xkZXI6IHN0cmluZztcblxuICAgIEBJbnB1dCgpIHJlYWRvbmx5OiBib29sZWFuO1xuXG4gICAgQElucHV0KCkgZGlzYWJsZWQ6IGJvb2xlYW47XG5cbiAgICBASW5wdXQoKSBzY3JvbGxIZWlnaHQ6IHN0cmluZyA9ICcyMDBweCc7XG5cbiAgICBASW5wdXQoKSBsYXp5OiBib29sZWFuID0gZmFsc2U7XG5cbiAgICBASW5wdXQoKSB2aXJ0dWFsU2Nyb2xsOiBib29sZWFuO1xuXG4gICAgQElucHV0KCkgdmlydHVhbFNjcm9sbEl0ZW1TaXplOiBudW1iZXI7XG5cbiAgICBASW5wdXQoKSB2aXJ0dWFsU2Nyb2xsT3B0aW9uczogU2Nyb2xsZXJPcHRpb25zO1xuXG4gICAgQElucHV0KCkgbWF4bGVuZ3RoOiBudW1iZXI7XG5cbiAgICBASW5wdXQoKSBuYW1lOiBzdHJpbmc7XG5cbiAgICBASW5wdXQoKSByZXF1aXJlZDogYm9vbGVhbjtcblxuICAgIEBJbnB1dCgpIHNpemU6IG51bWJlcjtcblxuICAgIEBJbnB1dCgpIGFwcGVuZFRvOiBhbnk7XG5cbiAgICBASW5wdXQoKSBhdXRvSGlnaGxpZ2h0OiBib29sZWFuO1xuXG4gICAgQElucHV0KCkgZm9yY2VTZWxlY3Rpb246IGJvb2xlYW47XG5cbiAgICBASW5wdXQoKSB0eXBlOiBzdHJpbmcgPSAndGV4dCc7XG5cbiAgICBASW5wdXQoKSBhdXRvWkluZGV4OiBib29sZWFuID0gdHJ1ZTtcblxuICAgIEBJbnB1dCgpIGJhc2VaSW5kZXg6IG51bWJlciA9IDA7XG5cbiAgICBASW5wdXQoKSBhcmlhTGFiZWw6IHN0cmluZztcblxuICAgIEBJbnB1dCgpIGRyb3Bkb3duQXJpYUxhYmVsOiBzdHJpbmc7XG5cbiAgICBASW5wdXQoKSBhcmlhTGFiZWxsZWRCeTogc3RyaW5nO1xuXG4gICAgQElucHV0KCkgZHJvcGRvd25JY29uOiBzdHJpbmcgPSAncGkgcGktY2hldnJvbi1kb3duJztcblxuICAgIEBJbnB1dCgpIHVuaXF1ZTogYm9vbGVhbiA9IHRydWU7XG5cbiAgICBASW5wdXQoKSBncm91cDogYm9vbGVhbjtcblxuICAgIEBJbnB1dCgpIGNvbXBsZXRlT25Gb2N1czogYm9vbGVhbiA9IGZhbHNlO1xuXG4gICAgQElucHV0KCkgc2hvd0NsZWFyOiBib29sZWFuID0gZmFsc2U7XG5cbiAgICBASW5wdXQoKSBmaWVsZDogc3RyaW5nO1xuXG4gICAgQElucHV0KCkgZHJvcGRvd246IGJvb2xlYW47XG5cbiAgICBASW5wdXQoKSBzaG93RW1wdHlNZXNzYWdlOiBib29sZWFuO1xuXG4gICAgQElucHV0KCkgZHJvcGRvd25Nb2RlOiBzdHJpbmcgPSAnYmxhbmsnO1xuXG4gICAgQElucHV0KCkgbXVsdGlwbGU6IGJvb2xlYW47XG5cbiAgICBASW5wdXQoKSB0YWJpbmRleDogbnVtYmVyO1xuXG4gICAgQElucHV0KCkgZGF0YUtleTogc3RyaW5nO1xuXG4gICAgQElucHV0KCkgZW1wdHlNZXNzYWdlOiBzdHJpbmc7XG5cbiAgICBASW5wdXQoKSBzaG93VHJhbnNpdGlvbk9wdGlvbnM6IHN0cmluZyA9ICcuMTJzIGN1YmljLWJlemllcigwLCAwLCAwLjIsIDEpJztcblxuICAgIEBJbnB1dCgpIGhpZGVUcmFuc2l0aW9uT3B0aW9uczogc3RyaW5nID0gJy4xcyBsaW5lYXInO1xuXG4gICAgQElucHV0KCkgYXV0b2ZvY3VzOiBib29sZWFuO1xuXG4gICAgQElucHV0KCkgYXV0b2NvbXBsZXRlOiBzdHJpbmcgPSAnb2ZmJztcblxuICAgIEBJbnB1dCgpIG9wdGlvbkdyb3VwQ2hpbGRyZW46IHN0cmluZztcblxuICAgIEBJbnB1dCgpIG9wdGlvbkdyb3VwTGFiZWw6IHN0cmluZztcblxuICAgIEBWaWV3Q2hpbGQoJ2NvbnRhaW5lcicpIGNvbnRhaW5lckVMOiBFbGVtZW50UmVmO1xuXG4gICAgQFZpZXdDaGlsZCgnaW4nKSBpbnB1dEVMOiBFbGVtZW50UmVmO1xuXG4gICAgQFZpZXdDaGlsZCgnbXVsdGlJbicpIG11bHRpSW5wdXRFTDogRWxlbWVudFJlZjtcblxuICAgIEBWaWV3Q2hpbGQoJ211bHRpQ29udGFpbmVyJykgbXVsdGlDb250YWluZXJFTDogRWxlbWVudFJlZjtcblxuICAgIEBWaWV3Q2hpbGQoJ2RkQnRuJykgZHJvcGRvd25CdXR0b246IEVsZW1lbnRSZWY7XG5cbiAgICBAVmlld0NoaWxkKCdpdGVtcycpIGl0ZW1zVmlld0NoaWxkOiBFbGVtZW50UmVmO1xuXG4gICAgQFZpZXdDaGlsZCgnc2Nyb2xsZXInKSBzY3JvbGxlcjogU2Nyb2xsZXI7XG5cbiAgICBAQ29udGVudENoaWxkcmVuKFByaW1lVGVtcGxhdGUpIHRlbXBsYXRlczogUXVlcnlMaXN0PGFueT47XG5cbiAgICBAT3V0cHV0KCkgY29tcGxldGVNZXRob2Q6IEV2ZW50RW1pdHRlcjxhbnk+ID0gbmV3IEV2ZW50RW1pdHRlcigpO1xuXG4gICAgQE91dHB1dCgpIG9uU2VsZWN0OiBFdmVudEVtaXR0ZXI8YW55PiA9IG5ldyBFdmVudEVtaXR0ZXIoKTtcblxuICAgIEBPdXRwdXQoKSBvblVuc2VsZWN0OiBFdmVudEVtaXR0ZXI8YW55PiA9IG5ldyBFdmVudEVtaXR0ZXIoKTtcblxuICAgIEBPdXRwdXQoKSBvbkZvY3VzOiBFdmVudEVtaXR0ZXI8YW55PiA9IG5ldyBFdmVudEVtaXR0ZXIoKTtcblxuICAgIEBPdXRwdXQoKSBvbkJsdXI6IEV2ZW50RW1pdHRlcjxhbnk+ID0gbmV3IEV2ZW50RW1pdHRlcigpO1xuXG4gICAgQE91dHB1dCgpIG9uRHJvcGRvd25DbGljazogRXZlbnRFbWl0dGVyPGFueT4gPSBuZXcgRXZlbnRFbWl0dGVyKCk7XG5cbiAgICBAT3V0cHV0KCkgb25DbGVhcjogRXZlbnRFbWl0dGVyPGFueT4gPSBuZXcgRXZlbnRFbWl0dGVyKCk7XG5cbiAgICBAT3V0cHV0KCkgb25LZXlVcDogRXZlbnRFbWl0dGVyPGFueT4gPSBuZXcgRXZlbnRFbWl0dGVyKCk7XG5cbiAgICBAT3V0cHV0KCkgb25TaG93OiBFdmVudEVtaXR0ZXI8YW55PiA9IG5ldyBFdmVudEVtaXR0ZXIoKTtcblxuICAgIEBPdXRwdXQoKSBvbkhpZGU6IEV2ZW50RW1pdHRlcjxhbnk+ID0gbmV3IEV2ZW50RW1pdHRlcigpO1xuXG4gICAgQE91dHB1dCgpIG9uTGF6eUxvYWQ6IEV2ZW50RW1pdHRlcjxhbnk+ID0gbmV3IEV2ZW50RW1pdHRlcigpO1xuXG4gICAgLyogQGRlcHJlY2F0ZWQgKi9cbiAgICBfaXRlbVNpemU6IG51bWJlcjtcbiAgICBASW5wdXQoKSBnZXQgaXRlbVNpemUoKTogbnVtYmVyIHtcbiAgICAgICAgcmV0dXJuIHRoaXMuX2l0ZW1TaXplO1xuICAgIH1cbiAgICBzZXQgaXRlbVNpemUodmFsOiBudW1iZXIpIHtcbiAgICAgICAgdGhpcy5faXRlbVNpemUgPSB2YWw7XG4gICAgICAgIGNvbnNvbGUud2FybignVGhlIGl0ZW1TaXplIHByb3BlcnR5IGlzIGRlcHJlY2F0ZWQsIHVzZSB2aXJ0dWFsU2Nyb2xsSXRlbVNpemUgcHJvcGVydHkgaW5zdGVhZC4nKTtcbiAgICB9XG5cbiAgICBvdmVybGF5OiBIVE1MRGl2RWxlbWVudDtcblxuICAgIGl0ZW1zV3JhcHBlcjogSFRNTERpdkVsZW1lbnQ7XG5cbiAgICBpdGVtVGVtcGxhdGU6IFRlbXBsYXRlUmVmPGFueT47XG5cbiAgICBlbXB0eVRlbXBsYXRlOiBUZW1wbGF0ZVJlZjxhbnk+O1xuXG4gICAgaGVhZGVyVGVtcGxhdGU6IFRlbXBsYXRlUmVmPGFueT47XG5cbiAgICBmb290ZXJUZW1wbGF0ZTogVGVtcGxhdGVSZWY8YW55PjtcblxuICAgIHNlbGVjdGVkSXRlbVRlbXBsYXRlOiBUZW1wbGF0ZVJlZjxhbnk+O1xuXG4gICAgZ3JvdXBUZW1wbGF0ZTogVGVtcGxhdGVSZWY8YW55PjtcblxuICAgIGxvYWRlclRlbXBsYXRlOiBUZW1wbGF0ZVJlZjxhbnk+O1xuXG4gICAgdmFsdWU6IGFueTtcblxuICAgIF9zdWdnZXN0aW9uczogYW55W107XG5cbiAgICBvbk1vZGVsQ2hhbmdlOiBGdW5jdGlvbiA9ICgpID0+IHt9O1xuXG4gICAgb25Nb2RlbFRvdWNoZWQ6IEZ1bmN0aW9uID0gKCkgPT4ge307XG5cbiAgICB0aW1lb3V0OiBhbnk7XG5cbiAgICBvdmVybGF5VmlzaWJsZTogYm9vbGVhbiA9IGZhbHNlO1xuXG4gICAgZG9jdW1lbnRDbGlja0xpc3RlbmVyOiBhbnk7XG5cbiAgICBzdWdnZXN0aW9uc1VwZGF0ZWQ6IGJvb2xlYW47XG5cbiAgICBoaWdobGlnaHRPcHRpb246IGFueTtcblxuICAgIGhpZ2hsaWdodE9wdGlvbkNoYW5nZWQ6IGJvb2xlYW47XG5cbiAgICBmb2N1czogYm9vbGVhbiA9IGZhbHNlO1xuXG4gICAgZmlsbGVkOiBib29sZWFuO1xuXG4gICAgaW5wdXRDbGljazogYm9vbGVhbjtcblxuICAgIGlucHV0S2V5RG93bjogYm9vbGVhbjtcblxuICAgIG5vUmVzdWx0czogYm9vbGVhbjtcblxuICAgIGRpZmZlcjogYW55O1xuXG4gICAgaW5wdXRGaWVsZFZhbHVlOiBzdHJpbmcgPSBudWxsO1xuXG4gICAgbG9hZGluZzogYm9vbGVhbjtcblxuICAgIHNjcm9sbEhhbmRsZXI6IGFueTtcblxuICAgIGRvY3VtZW50UmVzaXplTGlzdGVuZXI6IGFueTtcblxuICAgIGZvcmNlU2VsZWN0aW9uVXBkYXRlTW9kZWxUaW1lb3V0OiBhbnk7XG5cbiAgICBsaXN0SWQ6IHN0cmluZztcblxuICAgIGl0ZW1DbGlja2VkOiBib29sZWFuO1xuXG4gICAgaW5wdXRWYWx1ZTogc3RyaW5nID0gbnVsbDtcblxuICAgIGNvbnN0cnVjdG9yKHB1YmxpYyBlbDogRWxlbWVudFJlZiwgcHVibGljIHJlbmRlcmVyOiBSZW5kZXJlcjIsIHB1YmxpYyBjZDogQ2hhbmdlRGV0ZWN0b3JSZWYsIHB1YmxpYyBkaWZmZXJzOiBJdGVyYWJsZURpZmZlcnMsIHB1YmxpYyBjb25maWc6IFByaW1lTkdDb25maWcsIHB1YmxpYyBvdmVybGF5U2VydmljZTogT3ZlcmxheVNlcnZpY2UpIHtcbiAgICAgICAgdGhpcy5kaWZmZXIgPSBkaWZmZXJzLmZpbmQoW10pLmNyZWF0ZShudWxsKTtcbiAgICAgICAgdGhpcy5saXN0SWQgPSBVbmlxdWVDb21wb25lbnRJZCgpICsgJ19saXN0JztcbiAgICB9XG5cbiAgICBASW5wdXQoKSBnZXQgc3VnZ2VzdGlvbnMoKTogYW55W10ge1xuICAgICAgICByZXR1cm4gdGhpcy5fc3VnZ2VzdGlvbnM7XG4gICAgfVxuXG4gICAgc2V0IHN1Z2dlc3Rpb25zKHZhbDogYW55W10pIHtcbiAgICAgICAgdGhpcy5fc3VnZ2VzdGlvbnMgPSB2YWw7XG4gICAgICAgIHRoaXMuaGFuZGxlU3VnZ2VzdGlvbnNDaGFuZ2UoKTtcbiAgICB9XG5cbiAgICBuZ0FmdGVyVmlld0NoZWNrZWQoKSB7XG4gICAgICAgIC8vVXNlIHRpbWVvdXRzIGFzIHNpbmNlIEFuZ3VsYXIgNC4yLCBBZnRlclZpZXdDaGVja2VkIGlzIGJyb2tlbiBhbmQgbm90IGNhbGxlZCBhZnRlciBwYW5lbCBpcyB1cGRhdGVkXG4gICAgICAgIGlmICh0aGlzLnN1Z2dlc3Rpb25zVXBkYXRlZCAmJiB0aGlzLm92ZXJsYXkgJiYgdGhpcy5vdmVybGF5Lm9mZnNldFBhcmVudCkge1xuICAgICAgICAgICAgc2V0VGltZW91dCgoKSA9PiB7XG4gICAgICAgICAgICAgICAgaWYgKHRoaXMub3ZlcmxheSkge1xuICAgICAgICAgICAgICAgICAgICB0aGlzLmFsaWduT3ZlcmxheSgpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH0sIDEpO1xuICAgICAgICAgICAgdGhpcy5zdWdnZXN0aW9uc1VwZGF0ZWQgPSBmYWxzZTtcbiAgICAgICAgfVxuXG4gICAgICAgIGlmICh0aGlzLmhpZ2hsaWdodE9wdGlvbkNoYW5nZWQpIHtcbiAgICAgICAgICAgIHNldFRpbWVvdXQoKCkgPT4ge1xuICAgICAgICAgICAgICAgIGlmICh0aGlzLm92ZXJsYXkgJiYgdGhpcy5pdGVtc1dyYXBwZXIpIHtcbiAgICAgICAgICAgICAgICAgICAgbGV0IGxpc3RJdGVtID0gRG9tSGFuZGxlci5maW5kU2luZ2xlKHRoaXMub3ZlcmxheSwgJ2xpLnAtaGlnaGxpZ2h0Jyk7XG5cbiAgICAgICAgICAgICAgICAgICAgaWYgKGxpc3RJdGVtKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBEb21IYW5kbGVyLnNjcm9sbEluVmlldyh0aGlzLml0ZW1zV3JhcHBlciwgbGlzdEl0ZW0pO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfSwgMSk7XG4gICAgICAgICAgICB0aGlzLmhpZ2hsaWdodE9wdGlvbkNoYW5nZWQgPSBmYWxzZTtcbiAgICAgICAgfVxuICAgIH1cblxuICAgIGhhbmRsZVN1Z2dlc3Rpb25zQ2hhbmdlKCkge1xuICAgICAgICBpZiAodGhpcy5fc3VnZ2VzdGlvbnMgIT0gbnVsbCAmJiB0aGlzLmxvYWRpbmcpIHtcbiAgICAgICAgICAgIHRoaXMuaGlnaGxpZ2h0T3B0aW9uID0gbnVsbDtcbiAgICAgICAgICAgIGlmICh0aGlzLl9zdWdnZXN0aW9ucy5sZW5ndGgpIHtcbiAgICAgICAgICAgICAgICB0aGlzLm5vUmVzdWx0cyA9IGZhbHNlO1xuICAgICAgICAgICAgICAgIHRoaXMuc2hvdygpO1xuICAgICAgICAgICAgICAgIHRoaXMuc3VnZ2VzdGlvbnNVcGRhdGVkID0gdHJ1ZTtcblxuICAgICAgICAgICAgICAgIGlmICh0aGlzLmF1dG9IaWdobGlnaHQpIHtcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5oaWdobGlnaHRPcHRpb24gPSB0aGlzLl9zdWdnZXN0aW9uc1swXTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgIHRoaXMubm9SZXN1bHRzID0gdHJ1ZTtcblxuICAgICAgICAgICAgICAgIGlmICh0aGlzLnNob3dFbXB0eU1lc3NhZ2UpIHtcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5zaG93KCk7XG4gICAgICAgICAgICAgICAgICAgIHRoaXMuc3VnZ2VzdGlvbnNVcGRhdGVkID0gdHJ1ZTtcbiAgICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICB0aGlzLmhpZGUoKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIHRoaXMubG9hZGluZyA9IGZhbHNlO1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgbmdBZnRlckNvbnRlbnRJbml0KCkge1xuICAgICAgICB0aGlzLnRlbXBsYXRlcy5mb3JFYWNoKChpdGVtKSA9PiB7XG4gICAgICAgICAgICBzd2l0Y2ggKGl0ZW0uZ2V0VHlwZSgpKSB7XG4gICAgICAgICAgICAgICAgY2FzZSAnaXRlbSc6XG4gICAgICAgICAgICAgICAgICAgIHRoaXMuaXRlbVRlbXBsYXRlID0gaXRlbS50ZW1wbGF0ZTtcbiAgICAgICAgICAgICAgICAgICAgYnJlYWs7XG5cbiAgICAgICAgICAgICAgICBjYXNlICdncm91cCc6XG4gICAgICAgICAgICAgICAgICAgIHRoaXMuZ3JvdXBUZW1wbGF0ZSA9IGl0ZW0udGVtcGxhdGU7XG4gICAgICAgICAgICAgICAgICAgIGJyZWFrO1xuXG4gICAgICAgICAgICAgICAgY2FzZSAnc2VsZWN0ZWRJdGVtJzpcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5zZWxlY3RlZEl0ZW1UZW1wbGF0ZSA9IGl0ZW0udGVtcGxhdGU7XG4gICAgICAgICAgICAgICAgICAgIGJyZWFrO1xuXG4gICAgICAgICAgICAgICAgY2FzZSAnaGVhZGVyJzpcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5oZWFkZXJUZW1wbGF0ZSA9IGl0ZW0udGVtcGxhdGU7XG4gICAgICAgICAgICAgICAgICAgIGJyZWFrO1xuXG4gICAgICAgICAgICAgICAgY2FzZSAnZW1wdHknOlxuICAgICAgICAgICAgICAgICAgICB0aGlzLmVtcHR5VGVtcGxhdGUgPSBpdGVtLnRlbXBsYXRlO1xuICAgICAgICAgICAgICAgICAgICBicmVhaztcblxuICAgICAgICAgICAgICAgIGNhc2UgJ2Zvb3Rlcic6XG4gICAgICAgICAgICAgICAgICAgIHRoaXMuZm9vdGVyVGVtcGxhdGUgPSBpdGVtLnRlbXBsYXRlO1xuICAgICAgICAgICAgICAgICAgICBicmVhaztcblxuICAgICAgICAgICAgICAgIGNhc2UgJ2xvYWRlcic6XG4gICAgICAgICAgICAgICAgICAgIHRoaXMubG9hZGVyVGVtcGxhdGUgPSBpdGVtLnRlbXBsYXRlO1xuICAgICAgICAgICAgICAgICAgICBicmVhaztcblxuICAgICAgICAgICAgICAgIGRlZmF1bHQ6XG4gICAgICAgICAgICAgICAgICAgIHRoaXMuaXRlbVRlbXBsYXRlID0gaXRlbS50ZW1wbGF0ZTtcbiAgICAgICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICB9XG4gICAgICAgIH0pO1xuICAgIH1cblxuICAgIHdyaXRlVmFsdWUodmFsdWU6IGFueSk6IHZvaWQge1xuICAgICAgICB0aGlzLnZhbHVlID0gdmFsdWU7XG4gICAgICAgIHRoaXMuZmlsbGVkID0gdGhpcy52YWx1ZSAmJiB0aGlzLnZhbHVlICE9ICcnO1xuICAgICAgICB0aGlzLnVwZGF0ZUlucHV0RmllbGQoKTtcbiAgICAgICAgdGhpcy5jZC5tYXJrRm9yQ2hlY2soKTtcbiAgICB9XG5cbiAgICBnZXRPcHRpb25Hcm91cENoaWxkcmVuKG9wdGlvbkdyb3VwOiBhbnkpIHtcbiAgICAgICAgcmV0dXJuIHRoaXMub3B0aW9uR3JvdXBDaGlsZHJlbiA/IE9iamVjdFV0aWxzLnJlc29sdmVGaWVsZERhdGEob3B0aW9uR3JvdXAsIHRoaXMub3B0aW9uR3JvdXBDaGlsZHJlbikgOiBvcHRpb25Hcm91cC5pdGVtcztcbiAgICB9XG5cbiAgICBnZXRPcHRpb25Hcm91cExhYmVsKG9wdGlvbkdyb3VwOiBhbnkpIHtcbiAgICAgICAgcmV0dXJuIHRoaXMub3B0aW9uR3JvdXBMYWJlbCA/IE9iamVjdFV0aWxzLnJlc29sdmVGaWVsZERhdGEob3B0aW9uR3JvdXAsIHRoaXMub3B0aW9uR3JvdXBMYWJlbCkgOiBvcHRpb25Hcm91cC5sYWJlbCAhPSB1bmRlZmluZWQgPyBvcHRpb25Hcm91cC5sYWJlbCA6IG9wdGlvbkdyb3VwO1xuICAgIH1cblxuICAgIHJlZ2lzdGVyT25DaGFuZ2UoZm46IEZ1bmN0aW9uKTogdm9pZCB7XG4gICAgICAgIHRoaXMub25Nb2RlbENoYW5nZSA9IGZuO1xuICAgIH1cblxuICAgIHJlZ2lzdGVyT25Ub3VjaGVkKGZuOiBGdW5jdGlvbik6IHZvaWQge1xuICAgICAgICB0aGlzLm9uTW9kZWxUb3VjaGVkID0gZm47XG4gICAgfVxuXG4gICAgc2V0RGlzYWJsZWRTdGF0ZSh2YWw6IGJvb2xlYW4pOiB2b2lkIHtcbiAgICAgICAgdGhpcy5kaXNhYmxlZCA9IHZhbDtcbiAgICAgICAgdGhpcy5jZC5tYXJrRm9yQ2hlY2soKTtcbiAgICB9XG5cbiAgICBvbklucHV0KGV2ZW50OiBFdmVudCkge1xuICAgICAgICAvLyBXaGVuIGFuIGlucHV0IGVsZW1lbnQgd2l0aCBhIHBsYWNlaG9sZGVyIGlzIGNsaWNrZWQsIHRoZSBvbklucHV0IGV2ZW50IGlzIGludm9rZWQgaW4gSUUuXG4gICAgICAgIGlmICghdGhpcy5pbnB1dEtleURvd24gJiYgRG9tSGFuZGxlci5pc0lFKCkpIHtcbiAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgfVxuXG4gICAgICAgIGlmICh0aGlzLnRpbWVvdXQpIHtcbiAgICAgICAgICAgIGNsZWFyVGltZW91dCh0aGlzLnRpbWVvdXQpO1xuICAgICAgICB9XG5cbiAgICAgICAgbGV0IHZhbHVlID0gKDxIVE1MSW5wdXRFbGVtZW50PmV2ZW50LnRhcmdldCkudmFsdWU7XG4gICAgICAgIHRoaXMuaW5wdXRWYWx1ZSA9IHZhbHVlO1xuICAgICAgICBpZiAoIXRoaXMubXVsdGlwbGUgJiYgIXRoaXMuZm9yY2VTZWxlY3Rpb24pIHtcbiAgICAgICAgICAgIHRoaXMub25Nb2RlbENoYW5nZSh2YWx1ZSk7XG4gICAgICAgIH1cblxuICAgICAgICBpZiAodmFsdWUubGVuZ3RoID09PSAwICYmICF0aGlzLm11bHRpcGxlKSB7XG4gICAgICAgICAgICB0aGlzLnZhbHVlID0gbnVsbDtcbiAgICAgICAgICAgIHRoaXMuaGlkZSgpO1xuICAgICAgICAgICAgdGhpcy5vbkNsZWFyLmVtaXQoZXZlbnQpO1xuICAgICAgICAgICAgdGhpcy5vbk1vZGVsQ2hhbmdlKHZhbHVlKTtcbiAgICAgICAgfVxuXG4gICAgICAgIGlmICh2YWx1ZS5sZW5ndGggPj0gdGhpcy5taW5MZW5ndGgpIHtcbiAgICAgICAgICAgIHRoaXMudGltZW91dCA9IHNldFRpbWVvdXQoKCkgPT4ge1xuICAgICAgICAgICAgICAgIHRoaXMuc2VhcmNoKGV2ZW50LCB2YWx1ZSk7XG4gICAgICAgICAgICB9LCB0aGlzLmRlbGF5KTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIHRoaXMuaGlkZSgpO1xuICAgICAgICB9XG4gICAgICAgIHRoaXMudXBkYXRlRmlsbGVkU3RhdGUoKTtcbiAgICAgICAgdGhpcy5pbnB1dEtleURvd24gPSBmYWxzZTtcbiAgICB9XG5cbiAgICBvbklucHV0Q2xpY2soZXZlbnQ6IE1vdXNlRXZlbnQpIHtcbiAgICAgICAgaWYgKHRoaXMuZG9jdW1lbnRDbGlja0xpc3RlbmVyKSB7XG4gICAgICAgICAgICB0aGlzLmlucHV0Q2xpY2sgPSB0cnVlO1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgc2VhcmNoKGV2ZW50OiBhbnksIHF1ZXJ5OiBzdHJpbmcpIHtcbiAgICAgICAgLy9hbGxvdyBlbXB0eSBzdHJpbmcgYnV0IG5vdCB1bmRlZmluZWQgb3IgbnVsbFxuICAgICAgICBpZiAocXVlcnkgPT09IHVuZGVmaW5lZCB8fCBxdWVyeSA9PT0gbnVsbCkge1xuICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICB9XG5cbiAgICAgICAgdGhpcy5sb2FkaW5nID0gdHJ1ZTtcblxuICAgICAgICB0aGlzLmNvbXBsZXRlTWV0aG9kLmVtaXQoe1xuICAgICAgICAgICAgb3JpZ2luYWxFdmVudDogZXZlbnQsXG4gICAgICAgICAgICBxdWVyeTogcXVlcnlcbiAgICAgICAgfSk7XG4gICAgfVxuXG4gICAgc2VsZWN0SXRlbShvcHRpb246IGFueSwgZm9jdXM6IGJvb2xlYW4gPSB0cnVlKSB7XG4gICAgICAgIGlmICh0aGlzLmZvcmNlU2VsZWN0aW9uVXBkYXRlTW9kZWxUaW1lb3V0KSB7XG4gICAgICAgICAgICBjbGVhclRpbWVvdXQodGhpcy5mb3JjZVNlbGVjdGlvblVwZGF0ZU1vZGVsVGltZW91dCk7XG4gICAgICAgICAgICB0aGlzLmZvcmNlU2VsZWN0aW9uVXBkYXRlTW9kZWxUaW1lb3V0ID0gbnVsbDtcbiAgICAgICAgfVxuXG4gICAgICAgIGlmICh0aGlzLm11bHRpcGxlKSB7XG4gICAgICAgICAgICB0aGlzLm11bHRpSW5wdXRFTC5uYXRpdmVFbGVtZW50LnZhbHVlID0gJyc7XG4gICAgICAgICAgICB0aGlzLnZhbHVlID0gdGhpcy52YWx1ZSB8fCBbXTtcbiAgICAgICAgICAgIGlmICghdGhpcy5pc1NlbGVjdGVkKG9wdGlvbikgfHwgIXRoaXMudW5pcXVlKSB7XG4gICAgICAgICAgICAgICAgdGhpcy52YWx1ZSA9IFsuLi50aGlzLnZhbHVlLCBvcHRpb25dO1xuICAgICAgICAgICAgICAgIHRoaXMub25Nb2RlbENoYW5nZSh0aGlzLnZhbHVlKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIHRoaXMuaW5wdXRFTC5uYXRpdmVFbGVtZW50LnZhbHVlID0gdGhpcy5yZXNvbHZlRmllbGREYXRhKG9wdGlvbik7XG4gICAgICAgICAgICB0aGlzLnZhbHVlID0gb3B0aW9uO1xuICAgICAgICAgICAgdGhpcy5vbk1vZGVsQ2hhbmdlKHRoaXMudmFsdWUpO1xuICAgICAgICB9XG5cbiAgICAgICAgdGhpcy5vblNlbGVjdC5lbWl0KG9wdGlvbik7XG4gICAgICAgIHRoaXMudXBkYXRlRmlsbGVkU3RhdGUoKTtcblxuICAgICAgICBpZiAoZm9jdXMpIHtcbiAgICAgICAgICAgIHRoaXMuaXRlbUNsaWNrZWQgPSB0cnVlO1xuICAgICAgICAgICAgdGhpcy5mb2N1c0lucHV0KCk7XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICBzaG93KCkge1xuICAgICAgICBpZiAodGhpcy5tdWx0aUlucHV0RUwgfHwgdGhpcy5pbnB1dEVMKSB7XG4gICAgICAgICAgICBsZXQgaGFzRm9jdXMgPSB0aGlzLm11bHRpcGxlID8gdGhpcy5tdWx0aUlucHV0RUwubmF0aXZlRWxlbWVudC5vd25lckRvY3VtZW50LmFjdGl2ZUVsZW1lbnQgPT0gdGhpcy5tdWx0aUlucHV0RUwubmF0aXZlRWxlbWVudCA6IHRoaXMuaW5wdXRFTC5uYXRpdmVFbGVtZW50Lm93bmVyRG9jdW1lbnQuYWN0aXZlRWxlbWVudCA9PSB0aGlzLmlucHV0RUwubmF0aXZlRWxlbWVudDtcblxuICAgICAgICAgICAgaWYgKCF0aGlzLm92ZXJsYXlWaXNpYmxlICYmIGhhc0ZvY3VzKSB7XG4gICAgICAgICAgICAgICAgdGhpcy5vdmVybGF5VmlzaWJsZSA9IHRydWU7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICBjbGVhcigpIHtcbiAgICAgICAgaWYgKHRoaXMubXVsdGlwbGUpIHtcbiAgICAgICAgICAgIHRoaXMudmFsdWUgPSBudWxsO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgdGhpcy5pbnB1dFZhbHVlID0gbnVsbDtcbiAgICAgICAgICAgIHRoaXMuaW5wdXRFTC5uYXRpdmVFbGVtZW50LnZhbHVlID0gJyc7XG4gICAgICAgIH1cblxuICAgICAgICB0aGlzLnVwZGF0ZUZpbGxlZFN0YXRlKCk7XG4gICAgICAgIHRoaXMub25Nb2RlbENoYW5nZSh0aGlzLnZhbHVlKTtcbiAgICAgICAgdGhpcy5vbkNsZWFyLmVtaXQoKTtcbiAgICB9XG5cbiAgICBvbk92ZXJsYXlBbmltYXRpb25TdGFydChldmVudDogQW5pbWF0aW9uRXZlbnQpIHtcbiAgICAgICAgc3dpdGNoIChldmVudC50b1N0YXRlKSB7XG4gICAgICAgICAgICBjYXNlICd2aXNpYmxlJzpcbiAgICAgICAgICAgICAgICB0aGlzLm92ZXJsYXkgPSBldmVudC5lbGVtZW50O1xuICAgICAgICAgICAgICAgIHRoaXMuaXRlbXNXcmFwcGVyID0gdGhpcy52aXJ0dWFsU2Nyb2xsID8gRG9tSGFuZGxlci5maW5kU2luZ2xlKHRoaXMub3ZlcmxheSwgJy5wLXNjcm9sbGVyJykgOiB0aGlzLm92ZXJsYXk7XG4gICAgICAgICAgICAgICAgdGhpcy52aXJ0dWFsU2Nyb2xsICYmIHRoaXMuc2Nyb2xsZXI/LnNldENvbnRlbnRFbCh0aGlzLml0ZW1zVmlld0NoaWxkLm5hdGl2ZUVsZW1lbnQpO1xuICAgICAgICAgICAgICAgIHRoaXMuYXBwZW5kT3ZlcmxheSgpO1xuXG4gICAgICAgICAgICAgICAgaWYgKHRoaXMuYXV0b1pJbmRleCkge1xuICAgICAgICAgICAgICAgICAgICBaSW5kZXhVdGlscy5zZXQoJ292ZXJsYXknLCB0aGlzLm92ZXJsYXksIHRoaXMuYmFzZVpJbmRleCArIHRoaXMuY29uZmlnLnpJbmRleC5vdmVybGF5KTtcbiAgICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgICAgICB0aGlzLmFsaWduT3ZlcmxheSgpO1xuICAgICAgICAgICAgICAgIHRoaXMuYmluZERvY3VtZW50Q2xpY2tMaXN0ZW5lcigpO1xuICAgICAgICAgICAgICAgIHRoaXMuYmluZERvY3VtZW50UmVzaXplTGlzdGVuZXIoKTtcbiAgICAgICAgICAgICAgICB0aGlzLmJpbmRTY3JvbGxMaXN0ZW5lcigpO1xuICAgICAgICAgICAgICAgIHRoaXMub25TaG93LmVtaXQoZXZlbnQpO1xuICAgICAgICAgICAgICAgIGJyZWFrO1xuXG4gICAgICAgICAgICBjYXNlICd2b2lkJzpcbiAgICAgICAgICAgICAgICB0aGlzLm9uT3ZlcmxheUhpZGUoKTtcbiAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgfVxuICAgIH1cblxuICAgIG9uT3ZlcmxheUFuaW1hdGlvbkVuZChldmVudDogQW5pbWF0aW9uRXZlbnQpIHtcbiAgICAgICAgc3dpdGNoIChldmVudC50b1N0YXRlKSB7XG4gICAgICAgICAgICBjYXNlICd2b2lkJzpcbiAgICAgICAgICAgICAgICBpZiAodGhpcy5hdXRvWkluZGV4KSB7XG4gICAgICAgICAgICAgICAgICAgIFpJbmRleFV0aWxzLmNsZWFyKGV2ZW50LmVsZW1lbnQpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgfVxuICAgIH1cblxuICAgIG9uT3ZlcmxheUNsaWNrKGV2ZW50KSB7XG4gICAgICAgIHRoaXMub3ZlcmxheVNlcnZpY2UuYWRkKHtcbiAgICAgICAgICAgIG9yaWdpbmFsRXZlbnQ6IGV2ZW50LFxuICAgICAgICAgICAgdGFyZ2V0OiB0aGlzLmVsLm5hdGl2ZUVsZW1lbnRcbiAgICAgICAgfSk7XG4gICAgfVxuXG4gICAgYXBwZW5kT3ZlcmxheSgpIHtcbiAgICAgICAgaWYgKHRoaXMuYXBwZW5kVG8pIHtcbiAgICAgICAgICAgIGlmICh0aGlzLmFwcGVuZFRvID09PSAnYm9keScpIGRvY3VtZW50LmJvZHkuYXBwZW5kQ2hpbGQodGhpcy5vdmVybGF5KTtcbiAgICAgICAgICAgIGVsc2UgRG9tSGFuZGxlci5hcHBlbmRDaGlsZCh0aGlzLm92ZXJsYXksIHRoaXMuYXBwZW5kVG8pO1xuXG4gICAgICAgICAgICBpZiAoIXRoaXMub3ZlcmxheS5zdHlsZS5taW5XaWR0aCkge1xuICAgICAgICAgICAgICAgIHRoaXMub3ZlcmxheS5zdHlsZS5taW5XaWR0aCA9IERvbUhhbmRsZXIuZ2V0V2lkdGgodGhpcy5lbC5uYXRpdmVFbGVtZW50LmNoaWxkcmVuWzBdKSArICdweCc7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICByZXNvbHZlRmllbGREYXRhKHZhbHVlKSB7XG4gICAgICAgIGxldCBkYXRhID0gdGhpcy5maWVsZCA/IE9iamVjdFV0aWxzLnJlc29sdmVGaWVsZERhdGEodmFsdWUsIHRoaXMuZmllbGQpIDogdmFsdWU7XG4gICAgICAgIHJldHVybiBkYXRhICE9PSAobnVsbCB8fCB1bmRlZmluZWQpID8gZGF0YSA6ICcnO1xuICAgIH1cblxuICAgIHJlc3RvcmVPdmVybGF5QXBwZW5kKCkge1xuICAgICAgICBpZiAodGhpcy5vdmVybGF5ICYmIHRoaXMuYXBwZW5kVG8pIHtcbiAgICAgICAgICAgIHRoaXMuZWwubmF0aXZlRWxlbWVudC5hcHBlbmRDaGlsZCh0aGlzLm92ZXJsYXkpO1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgYWxpZ25PdmVybGF5KCkge1xuICAgICAgICBpZiAodGhpcy5hcHBlbmRUbykgRG9tSGFuZGxlci5hYnNvbHV0ZVBvc2l0aW9uKHRoaXMub3ZlcmxheSwgdGhpcy5tdWx0aXBsZSA/IHRoaXMubXVsdGlDb250YWluZXJFTC5uYXRpdmVFbGVtZW50IDogdGhpcy5pbnB1dEVMLm5hdGl2ZUVsZW1lbnQpO1xuICAgICAgICBlbHNlIERvbUhhbmRsZXIucmVsYXRpdmVQb3NpdGlvbih0aGlzLm92ZXJsYXksIHRoaXMubXVsdGlwbGUgPyB0aGlzLm11bHRpQ29udGFpbmVyRUwubmF0aXZlRWxlbWVudCA6IHRoaXMuaW5wdXRFTC5uYXRpdmVFbGVtZW50KTtcbiAgICB9XG5cbiAgICBoaWRlKCkge1xuICAgICAgICB0aGlzLm92ZXJsYXlWaXNpYmxlID0gZmFsc2U7XG4gICAgICAgIHRoaXMuY2QubWFya0ZvckNoZWNrKCk7XG4gICAgfVxuXG4gICAgaGFuZGxlRHJvcGRvd25DbGljayhldmVudCkge1xuICAgICAgICBpZiAoIXRoaXMub3ZlcmxheVZpc2libGUpIHtcbiAgICAgICAgICAgIHRoaXMuZm9jdXNJbnB1dCgpO1xuICAgICAgICAgICAgbGV0IHF1ZXJ5VmFsdWUgPSB0aGlzLm11bHRpcGxlID8gdGhpcy5tdWx0aUlucHV0RUwubmF0aXZlRWxlbWVudC52YWx1ZSA6IHRoaXMuaW5wdXRFTC5uYXRpdmVFbGVtZW50LnZhbHVlO1xuXG4gICAgICAgICAgICBpZiAodGhpcy5kcm9wZG93bk1vZGUgPT09ICdibGFuaycpIHRoaXMuc2VhcmNoKGV2ZW50LCAnJyk7XG4gICAgICAgICAgICBlbHNlIGlmICh0aGlzLmRyb3Bkb3duTW9kZSA9PT0gJ2N1cnJlbnQnKSB0aGlzLnNlYXJjaChldmVudCwgcXVlcnlWYWx1ZSk7XG5cbiAgICAgICAgICAgIHRoaXMub25Ecm9wZG93bkNsaWNrLmVtaXQoe1xuICAgICAgICAgICAgICAgIG9yaWdpbmFsRXZlbnQ6IGV2ZW50LFxuICAgICAgICAgICAgICAgIHF1ZXJ5OiBxdWVyeVZhbHVlXG4gICAgICAgICAgICB9KTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIHRoaXMuaGlkZSgpO1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgZm9jdXNJbnB1dCgpIHtcbiAgICAgICAgaWYgKHRoaXMubXVsdGlwbGUpIHRoaXMubXVsdGlJbnB1dEVMLm5hdGl2ZUVsZW1lbnQuZm9jdXMoKTtcbiAgICAgICAgZWxzZSB0aGlzLmlucHV0RUwubmF0aXZlRWxlbWVudC5mb2N1cygpO1xuICAgIH1cblxuICAgIGdldCBlbXB0eU1lc3NhZ2VMYWJlbCgpOiBzdHJpbmcge1xuICAgICAgICByZXR1cm4gdGhpcy5lbXB0eU1lc3NhZ2UgfHwgdGhpcy5jb25maWcuZ2V0VHJhbnNsYXRpb24oVHJhbnNsYXRpb25LZXlzLkVNUFRZX01FU1NBR0UpO1xuICAgIH1cblxuICAgIHJlbW92ZUl0ZW0oaXRlbTogYW55KSB7XG4gICAgICAgIGxldCBpdGVtSW5kZXggPSBEb21IYW5kbGVyLmluZGV4KGl0ZW0pO1xuICAgICAgICBsZXQgcmVtb3ZlZFZhbHVlID0gdGhpcy52YWx1ZVtpdGVtSW5kZXhdO1xuICAgICAgICB0aGlzLnZhbHVlID0gdGhpcy52YWx1ZS5maWx0ZXIoKHZhbCwgaSkgPT4gaSAhPSBpdGVtSW5kZXgpO1xuICAgICAgICB0aGlzLm9uTW9kZWxDaGFuZ2UodGhpcy52YWx1ZSk7XG4gICAgICAgIHRoaXMudXBkYXRlRmlsbGVkU3RhdGUoKTtcbiAgICAgICAgdGhpcy5vblVuc2VsZWN0LmVtaXQocmVtb3ZlZFZhbHVlKTtcbiAgICB9XG5cbiAgICBvbktleWRvd24oZXZlbnQpIHtcbiAgICAgICAgaWYgKHRoaXMub3ZlcmxheVZpc2libGUpIHtcbiAgICAgICAgICAgIHN3aXRjaCAoZXZlbnQud2hpY2gpIHtcbiAgICAgICAgICAgICAgICAvL2Rvd25cbiAgICAgICAgICAgICAgICBjYXNlIDQwOlxuICAgICAgICAgICAgICAgICAgICBpZiAodGhpcy5ncm91cCkge1xuICAgICAgICAgICAgICAgICAgICAgICAgbGV0IGhpZ2hsaWdodEl0ZW1JbmRleCA9IHRoaXMuZmluZE9wdGlvbkdyb3VwSW5kZXgodGhpcy5oaWdobGlnaHRPcHRpb24sIHRoaXMuc3VnZ2VzdGlvbnMpO1xuXG4gICAgICAgICAgICAgICAgICAgICAgICBpZiAoaGlnaGxpZ2h0SXRlbUluZGV4ICE9PSAtMSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGxldCBuZXh0SXRlbUluZGV4ID0gaGlnaGxpZ2h0SXRlbUluZGV4Lml0ZW1JbmRleCArIDE7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgaWYgKG5leHRJdGVtSW5kZXggPCB0aGlzLmdldE9wdGlvbkdyb3VwQ2hpbGRyZW4odGhpcy5zdWdnZXN0aW9uc1toaWdobGlnaHRJdGVtSW5kZXguZ3JvdXBJbmRleF0pLmxlbmd0aCkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB0aGlzLmhpZ2hsaWdodE9wdGlvbiA9IHRoaXMuZ2V0T3B0aW9uR3JvdXBDaGlsZHJlbih0aGlzLnN1Z2dlc3Rpb25zW2hpZ2hsaWdodEl0ZW1JbmRleC5ncm91cEluZGV4XSlbbmV4dEl0ZW1JbmRleF07XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMuaGlnaGxpZ2h0T3B0aW9uQ2hhbmdlZCA9IHRydWU7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgfSBlbHNlIGlmICh0aGlzLnN1Z2dlc3Rpb25zW2hpZ2hsaWdodEl0ZW1JbmRleC5ncm91cEluZGV4ICsgMV0pIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5oaWdobGlnaHRPcHRpb24gPSB0aGlzLmdldE9wdGlvbkdyb3VwQ2hpbGRyZW4odGhpcy5zdWdnZXN0aW9uc1toaWdobGlnaHRJdGVtSW5kZXguZ3JvdXBJbmRleCArIDFdKVswXTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5oaWdobGlnaHRPcHRpb25DaGFuZ2VkID0gdHJ1ZTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMuaGlnaGxpZ2h0T3B0aW9uID0gdGhpcy5nZXRPcHRpb25Hcm91cENoaWxkcmVuKHRoaXMuc3VnZ2VzdGlvbnNbMF0pWzBdO1xuICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICAgICAgbGV0IGhpZ2hsaWdodEl0ZW1JbmRleCA9IHRoaXMuZmluZE9wdGlvbkluZGV4KHRoaXMuaGlnaGxpZ2h0T3B0aW9uLCB0aGlzLnN1Z2dlc3Rpb25zKTtcblxuICAgICAgICAgICAgICAgICAgICAgICAgaWYgKGhpZ2hsaWdodEl0ZW1JbmRleCAhPSAtMSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHZhciBuZXh0SXRlbUluZGV4ID0gaGlnaGxpZ2h0SXRlbUluZGV4ICsgMTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBpZiAobmV4dEl0ZW1JbmRleCAhPSB0aGlzLnN1Z2dlc3Rpb25zLmxlbmd0aCkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB0aGlzLmhpZ2hsaWdodE9wdGlvbiA9IHRoaXMuc3VnZ2VzdGlvbnNbbmV4dEl0ZW1JbmRleF07XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMuaGlnaGxpZ2h0T3B0aW9uQ2hhbmdlZCA9IHRydWU7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB0aGlzLmhpZ2hsaWdodE9wdGlvbiA9IHRoaXMuc3VnZ2VzdGlvbnNbMF07XG4gICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgICAgICAgICBldmVudC5wcmV2ZW50RGVmYXVsdCgpO1xuICAgICAgICAgICAgICAgICAgICBicmVhaztcblxuICAgICAgICAgICAgICAgIC8vdXBcbiAgICAgICAgICAgICAgICBjYXNlIDM4OlxuICAgICAgICAgICAgICAgICAgICBpZiAodGhpcy5ncm91cCkge1xuICAgICAgICAgICAgICAgICAgICAgICAgbGV0IGhpZ2hsaWdodEl0ZW1JbmRleCA9IHRoaXMuZmluZE9wdGlvbkdyb3VwSW5kZXgodGhpcy5oaWdobGlnaHRPcHRpb24sIHRoaXMuc3VnZ2VzdGlvbnMpO1xuICAgICAgICAgICAgICAgICAgICAgICAgaWYgKGhpZ2hsaWdodEl0ZW1JbmRleCAhPT0gLTEpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBsZXQgcHJldkl0ZW1JbmRleCA9IGhpZ2hsaWdodEl0ZW1JbmRleC5pdGVtSW5kZXggLSAxO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGlmIChwcmV2SXRlbUluZGV4ID49IDApIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5oaWdobGlnaHRPcHRpb24gPSB0aGlzLmdldE9wdGlvbkdyb3VwQ2hpbGRyZW4odGhpcy5zdWdnZXN0aW9uc1toaWdobGlnaHRJdGVtSW5kZXguZ3JvdXBJbmRleF0pW3ByZXZJdGVtSW5kZXhdO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB0aGlzLmhpZ2hsaWdodE9wdGlvbkNoYW5nZWQgPSB0cnVlO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIH0gZWxzZSBpZiAocHJldkl0ZW1JbmRleCA8IDApIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgbGV0IHByZXZHcm91cCA9IHRoaXMuc3VnZ2VzdGlvbnNbaGlnaGxpZ2h0SXRlbUluZGV4Lmdyb3VwSW5kZXggLSAxXTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgaWYgKHByZXZHcm91cCkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5oaWdobGlnaHRPcHRpb24gPSB0aGlzLmdldE9wdGlvbkdyb3VwQ2hpbGRyZW4ocHJldkdyb3VwKVt0aGlzLmdldE9wdGlvbkdyb3VwQ2hpbGRyZW4ocHJldkdyb3VwKS5sZW5ndGggLSAxXTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMuaGlnaGxpZ2h0T3B0aW9uQ2hhbmdlZCA9IHRydWU7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBsZXQgaGlnaGxpZ2h0SXRlbUluZGV4ID0gdGhpcy5maW5kT3B0aW9uSW5kZXgodGhpcy5oaWdobGlnaHRPcHRpb24sIHRoaXMuc3VnZ2VzdGlvbnMpO1xuXG4gICAgICAgICAgICAgICAgICAgICAgICBpZiAoaGlnaGxpZ2h0SXRlbUluZGV4ID4gMCkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGxldCBwcmV2SXRlbUluZGV4ID0gaGlnaGxpZ2h0SXRlbUluZGV4IC0gMTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB0aGlzLmhpZ2hsaWdodE9wdGlvbiA9IHRoaXMuc3VnZ2VzdGlvbnNbcHJldkl0ZW1JbmRleF07XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5oaWdobGlnaHRPcHRpb25DaGFuZ2VkID0gdHJ1ZTtcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAgICAgICAgIGV2ZW50LnByZXZlbnREZWZhdWx0KCk7XG4gICAgICAgICAgICAgICAgICAgIGJyZWFrO1xuXG4gICAgICAgICAgICAgICAgLy9lbnRlclxuICAgICAgICAgICAgICAgIGNhc2UgMTM6XG4gICAgICAgICAgICAgICAgICAgIGlmICh0aGlzLmhpZ2hsaWdodE9wdGlvbikge1xuICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5zZWxlY3RJdGVtKHRoaXMuaGlnaGxpZ2h0T3B0aW9uKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMuaGlkZSgpO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgIGV2ZW50LnByZXZlbnREZWZhdWx0KCk7XG4gICAgICAgICAgICAgICAgICAgIGJyZWFrO1xuXG4gICAgICAgICAgICAgICAgLy9lc2NhcGVcbiAgICAgICAgICAgICAgICBjYXNlIDI3OlxuICAgICAgICAgICAgICAgICAgICB0aGlzLmhpZGUoKTtcbiAgICAgICAgICAgICAgICAgICAgZXZlbnQucHJldmVudERlZmF1bHQoKTtcbiAgICAgICAgICAgICAgICAgICAgYnJlYWs7XG5cbiAgICAgICAgICAgICAgICAvL3RhYlxuICAgICAgICAgICAgICAgIGNhc2UgOTpcbiAgICAgICAgICAgICAgICAgICAgaWYgKHRoaXMuaGlnaGxpZ2h0T3B0aW9uKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICB0aGlzLnNlbGVjdEl0ZW0odGhpcy5oaWdobGlnaHRPcHRpb24pO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgIHRoaXMuaGlkZSgpO1xuICAgICAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgIH1cbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIGlmIChldmVudC53aGljaCA9PT0gNDAgJiYgdGhpcy5zdWdnZXN0aW9ucykge1xuICAgICAgICAgICAgICAgIHRoaXMuc2VhcmNoKGV2ZW50LCBldmVudC50YXJnZXQudmFsdWUpO1xuICAgICAgICAgICAgfSBlbHNlIGlmIChldmVudC5jdHJsS2V5ICYmIGV2ZW50LmtleSA9PT0gJ3onICYmICF0aGlzLm11bHRpcGxlKSB7XG4gICAgICAgICAgICAgICAgdGhpcy5pbnB1dEVMLm5hdGl2ZUVsZW1lbnQudmFsdWUgPSB0aGlzLnJlc29sdmVGaWVsZERhdGEobnVsbCk7XG4gICAgICAgICAgICAgICAgdGhpcy52YWx1ZSA9ICcnO1xuICAgICAgICAgICAgICAgIHRoaXMub25Nb2RlbENoYW5nZSh0aGlzLnZhbHVlKTtcbiAgICAgICAgICAgIH0gZWxzZSBpZiAoZXZlbnQuY3RybEtleSAmJiBldmVudC5rZXkgPT09ICd6JyAmJiB0aGlzLm11bHRpcGxlKSB7XG4gICAgICAgICAgICAgICAgdGhpcy52YWx1ZS5wb3AoKTtcbiAgICAgICAgICAgICAgICB0aGlzLm9uTW9kZWxDaGFuZ2UodGhpcy52YWx1ZSk7XG4gICAgICAgICAgICAgICAgdGhpcy51cGRhdGVGaWxsZWRTdGF0ZSgpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG5cbiAgICAgICAgaWYgKHRoaXMubXVsdGlwbGUpIHtcbiAgICAgICAgICAgIHN3aXRjaCAoZXZlbnQud2hpY2gpIHtcbiAgICAgICAgICAgICAgICAvL2JhY2tzcGFjZVxuICAgICAgICAgICAgICAgIGNhc2UgODpcbiAgICAgICAgICAgICAgICAgICAgaWYgKHRoaXMudmFsdWUgJiYgdGhpcy52YWx1ZS5sZW5ndGggJiYgIXRoaXMubXVsdGlJbnB1dEVMLm5hdGl2ZUVsZW1lbnQudmFsdWUpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMudmFsdWUgPSBbLi4udGhpcy52YWx1ZV07XG4gICAgICAgICAgICAgICAgICAgICAgICBjb25zdCByZW1vdmVkVmFsdWUgPSB0aGlzLnZhbHVlLnBvcCgpO1xuICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5vbk1vZGVsQ2hhbmdlKHRoaXMudmFsdWUpO1xuICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy51cGRhdGVGaWxsZWRTdGF0ZSgpO1xuICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5vblVuc2VsZWN0LmVtaXQocmVtb3ZlZFZhbHVlKTtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuXG4gICAgICAgIHRoaXMuaW5wdXRLZXlEb3duID0gdHJ1ZTtcbiAgICB9XG5cbiAgICBvbktleXVwKGV2ZW50KSB7XG4gICAgICAgIHRoaXMub25LZXlVcC5lbWl0KGV2ZW50KTtcbiAgICB9XG5cbiAgICBvbklucHV0Rm9jdXMoZXZlbnQpIHtcbiAgICAgICAgaWYgKCF0aGlzLml0ZW1DbGlja2VkICYmIHRoaXMuY29tcGxldGVPbkZvY3VzKSB7XG4gICAgICAgICAgICBsZXQgcXVlcnlWYWx1ZSA9IHRoaXMubXVsdGlwbGUgPyB0aGlzLm11bHRpSW5wdXRFTC5uYXRpdmVFbGVtZW50LnZhbHVlIDogdGhpcy5pbnB1dEVMLm5hdGl2ZUVsZW1lbnQudmFsdWU7XG4gICAgICAgICAgICB0aGlzLnNlYXJjaChldmVudCwgcXVlcnlWYWx1ZSk7XG4gICAgICAgIH1cblxuICAgICAgICB0aGlzLmZvY3VzID0gdHJ1ZTtcbiAgICAgICAgdGhpcy5vbkZvY3VzLmVtaXQoZXZlbnQpO1xuICAgICAgICB0aGlzLml0ZW1DbGlja2VkID0gZmFsc2U7XG4gICAgfVxuXG4gICAgb25JbnB1dEJsdXIoZXZlbnQpIHtcbiAgICAgICAgdGhpcy5mb2N1cyA9IGZhbHNlO1xuICAgICAgICB0aGlzLm9uTW9kZWxUb3VjaGVkKCk7XG4gICAgICAgIHRoaXMub25CbHVyLmVtaXQoZXZlbnQpO1xuICAgIH1cblxuICAgIG9uSW5wdXRDaGFuZ2UoZXZlbnQpIHtcbiAgICAgICAgaWYgKHRoaXMuZm9yY2VTZWxlY3Rpb24pIHtcbiAgICAgICAgICAgIGxldCB2YWxpZCA9IGZhbHNlO1xuICAgICAgICAgICAgbGV0IGlucHV0VmFsdWUgPSBldmVudC50YXJnZXQudmFsdWUudHJpbSgpO1xuXG4gICAgICAgICAgICBpZiAodGhpcy5zdWdnZXN0aW9ucykge1xuICAgICAgICAgICAgICAgIGZvciAobGV0IHN1Z2dlc3Rpb24gb2YgdGhpcy5zdWdnZXN0aW9ucykge1xuICAgICAgICAgICAgICAgICAgICBsZXQgaXRlbVZhbHVlID0gdGhpcy5maWVsZCA/IE9iamVjdFV0aWxzLnJlc29sdmVGaWVsZERhdGEoc3VnZ2VzdGlvbiwgdGhpcy5maWVsZCkgOiBzdWdnZXN0aW9uO1xuICAgICAgICAgICAgICAgICAgICBpZiAoaXRlbVZhbHVlICYmIGlucHV0VmFsdWUgPT09IGl0ZW1WYWx1ZS50cmltKCkpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHZhbGlkID0gdHJ1ZTtcbiAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMuZm9yY2VTZWxlY3Rpb25VcGRhdGVNb2RlbFRpbWVvdXQgPSBzZXRUaW1lb3V0KCgpID0+IHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB0aGlzLnNlbGVjdEl0ZW0oc3VnZ2VzdGlvbiwgZmFsc2UpO1xuICAgICAgICAgICAgICAgICAgICAgICAgfSwgMjUwKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICBpZiAoIXZhbGlkKSB7XG4gICAgICAgICAgICAgICAgaWYgKHRoaXMubXVsdGlwbGUpIHtcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5tdWx0aUlucHV0RUwubmF0aXZlRWxlbWVudC52YWx1ZSA9ICcnO1xuICAgICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgIHRoaXMudmFsdWUgPSBudWxsO1xuICAgICAgICAgICAgICAgICAgICB0aGlzLmlucHV0RUwubmF0aXZlRWxlbWVudC52YWx1ZSA9ICcnO1xuICAgICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgICAgIHRoaXMub25DbGVhci5lbWl0KGV2ZW50KTtcbiAgICAgICAgICAgICAgICB0aGlzLm9uTW9kZWxDaGFuZ2UodGhpcy52YWx1ZSk7XG4gICAgICAgICAgICAgICAgdGhpcy51cGRhdGVGaWxsZWRTdGF0ZSgpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgfVxuXG4gICAgb25JbnB1dFBhc3RlKGV2ZW50OiBDbGlwYm9hcmRFdmVudCkge1xuICAgICAgICB0aGlzLm9uS2V5ZG93bihldmVudCk7XG4gICAgfVxuXG4gICAgaXNTZWxlY3RlZCh2YWw6IGFueSk6IGJvb2xlYW4ge1xuICAgICAgICBsZXQgc2VsZWN0ZWQ6IGJvb2xlYW4gPSBmYWxzZTtcbiAgICAgICAgaWYgKHRoaXMudmFsdWUgJiYgdGhpcy52YWx1ZS5sZW5ndGgpIHtcbiAgICAgICAgICAgIGZvciAobGV0IGkgPSAwOyBpIDwgdGhpcy52YWx1ZS5sZW5ndGg7IGkrKykge1xuICAgICAgICAgICAgICAgIGlmIChPYmplY3RVdGlscy5lcXVhbHModGhpcy52YWx1ZVtpXSwgdmFsLCB0aGlzLmRhdGFLZXkpKSB7XG4gICAgICAgICAgICAgICAgICAgIHNlbGVjdGVkID0gdHJ1ZTtcbiAgICAgICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICAgIHJldHVybiBzZWxlY3RlZDtcbiAgICB9XG5cbiAgICBmaW5kT3B0aW9uSW5kZXgob3B0aW9uLCBzdWdnZXN0aW9ucyk6IG51bWJlciB7XG4gICAgICAgIGxldCBpbmRleDogbnVtYmVyID0gLTE7XG4gICAgICAgIGlmIChzdWdnZXN0aW9ucykge1xuICAgICAgICAgICAgZm9yIChsZXQgaSA9IDA7IGkgPCBzdWdnZXN0aW9ucy5sZW5ndGg7IGkrKykge1xuICAgICAgICAgICAgICAgIGlmIChPYmplY3RVdGlscy5lcXVhbHMob3B0aW9uLCBzdWdnZXN0aW9uc1tpXSkpIHtcbiAgICAgICAgICAgICAgICAgICAgaW5kZXggPSBpO1xuICAgICAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cblxuICAgICAgICByZXR1cm4gaW5kZXg7XG4gICAgfVxuXG4gICAgZmluZE9wdGlvbkdyb3VwSW5kZXgodmFsOiBhbnksIG9wdHM6IGFueVtdKTogYW55IHtcbiAgICAgICAgbGV0IGdyb3VwSW5kZXgsIGl0ZW1JbmRleDtcblxuICAgICAgICBpZiAob3B0cykge1xuICAgICAgICAgICAgZm9yIChsZXQgaSA9IDA7IGkgPCBvcHRzLmxlbmd0aDsgaSsrKSB7XG4gICAgICAgICAgICAgICAgZ3JvdXBJbmRleCA9IGk7XG4gICAgICAgICAgICAgICAgaXRlbUluZGV4ID0gdGhpcy5maW5kT3B0aW9uSW5kZXgodmFsLCB0aGlzLmdldE9wdGlvbkdyb3VwQ2hpbGRyZW4ob3B0c1tpXSkpO1xuXG4gICAgICAgICAgICAgICAgaWYgKGl0ZW1JbmRleCAhPT0gLTEpIHtcbiAgICAgICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICB9XG5cbiAgICAgICAgaWYgKGl0ZW1JbmRleCAhPT0gLTEpIHtcbiAgICAgICAgICAgIHJldHVybiB7IGdyb3VwSW5kZXg6IGdyb3VwSW5kZXgsIGl0ZW1JbmRleDogaXRlbUluZGV4IH07XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICByZXR1cm4gLTE7XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICB1cGRhdGVGaWxsZWRTdGF0ZSgpIHtcbiAgICAgICAgaWYgKHRoaXMubXVsdGlwbGUpIHRoaXMuZmlsbGVkID0gKHRoaXMudmFsdWUgJiYgdGhpcy52YWx1ZS5sZW5ndGgpIHx8ICh0aGlzLm11bHRpSW5wdXRFTCAmJiB0aGlzLm11bHRpSW5wdXRFTC5uYXRpdmVFbGVtZW50ICYmIHRoaXMubXVsdGlJbnB1dEVMLm5hdGl2ZUVsZW1lbnQudmFsdWUgIT0gJycpO1xuICAgICAgICBlbHNlIHRoaXMuZmlsbGVkID0gKHRoaXMuaW5wdXRGaWVsZFZhbHVlICYmIHRoaXMuaW5wdXRGaWVsZFZhbHVlICE9ICcnKSB8fCAodGhpcy5pbnB1dEVMICYmIHRoaXMuaW5wdXRFTC5uYXRpdmVFbGVtZW50ICYmIHRoaXMuaW5wdXRFTC5uYXRpdmVFbGVtZW50LnZhbHVlICE9ICcnKTtcbiAgICB9XG5cbiAgICB1cGRhdGVJbnB1dEZpZWxkKCkge1xuICAgICAgICBsZXQgZm9ybWF0dGVkVmFsdWUgPSB0aGlzLnJlc29sdmVGaWVsZERhdGEodGhpcy52YWx1ZSk7XG4gICAgICAgIHRoaXMuaW5wdXRGaWVsZFZhbHVlID0gZm9ybWF0dGVkVmFsdWU7XG5cbiAgICAgICAgaWYgKHRoaXMuaW5wdXRFTCAmJiB0aGlzLmlucHV0RUwubmF0aXZlRWxlbWVudCkge1xuICAgICAgICAgICAgdGhpcy5pbnB1dEVMLm5hdGl2ZUVsZW1lbnQudmFsdWUgPSBmb3JtYXR0ZWRWYWx1ZTtcbiAgICAgICAgfVxuXG4gICAgICAgIHRoaXMudXBkYXRlRmlsbGVkU3RhdGUoKTtcbiAgICB9XG5cbiAgICBiaW5kRG9jdW1lbnRDbGlja0xpc3RlbmVyKCkge1xuICAgICAgICBpZiAoIXRoaXMuZG9jdW1lbnRDbGlja0xpc3RlbmVyKSB7XG4gICAgICAgICAgICBjb25zdCBkb2N1bWVudFRhcmdldDogYW55ID0gdGhpcy5lbCA/IHRoaXMuZWwubmF0aXZlRWxlbWVudC5vd25lckRvY3VtZW50IDogJ2RvY3VtZW50JztcblxuICAgICAgICAgICAgdGhpcy5kb2N1bWVudENsaWNrTGlzdGVuZXIgPSB0aGlzLnJlbmRlcmVyLmxpc3Rlbihkb2N1bWVudFRhcmdldCwgJ2NsaWNrJywgKGV2ZW50KSA9PiB7XG4gICAgICAgICAgICAgICAgaWYgKGV2ZW50LndoaWNoID09PSAzKSB7XG4gICAgICAgICAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgICAgICBpZiAoIXRoaXMuaW5wdXRDbGljayAmJiAhdGhpcy5pc0Ryb3Bkb3duQ2xpY2soZXZlbnQpKSB7XG4gICAgICAgICAgICAgICAgICAgIHRoaXMuaGlkZSgpO1xuICAgICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgICAgIHRoaXMuaW5wdXRDbGljayA9IGZhbHNlO1xuICAgICAgICAgICAgICAgIHRoaXMuY2QubWFya0ZvckNoZWNrKCk7XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgfVxuICAgIH1cblxuICAgIGlzRHJvcGRvd25DbGljayhldmVudCkge1xuICAgICAgICBpZiAodGhpcy5kcm9wZG93bikge1xuICAgICAgICAgICAgbGV0IHRhcmdldCA9IGV2ZW50LnRhcmdldDtcbiAgICAgICAgICAgIHJldHVybiB0YXJnZXQgPT09IHRoaXMuZHJvcGRvd25CdXR0b24ubmF0aXZlRWxlbWVudCB8fCB0YXJnZXQucGFyZW50Tm9kZSA9PT0gdGhpcy5kcm9wZG93bkJ1dHRvbi5uYXRpdmVFbGVtZW50O1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgcmV0dXJuIGZhbHNlO1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgdW5iaW5kRG9jdW1lbnRDbGlja0xpc3RlbmVyKCkge1xuICAgICAgICBpZiAodGhpcy5kb2N1bWVudENsaWNrTGlzdGVuZXIpIHtcbiAgICAgICAgICAgIHRoaXMuZG9jdW1lbnRDbGlja0xpc3RlbmVyKCk7XG4gICAgICAgICAgICB0aGlzLmRvY3VtZW50Q2xpY2tMaXN0ZW5lciA9IG51bGw7XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICBiaW5kRG9jdW1lbnRSZXNpemVMaXN0ZW5lcigpIHtcbiAgICAgICAgdGhpcy5kb2N1bWVudFJlc2l6ZUxpc3RlbmVyID0gdGhpcy5vbldpbmRvd1Jlc2l6ZS5iaW5kKHRoaXMpO1xuICAgICAgICB3aW5kb3cuYWRkRXZlbnRMaXN0ZW5lcigncmVzaXplJywgdGhpcy5kb2N1bWVudFJlc2l6ZUxpc3RlbmVyKTtcbiAgICB9XG5cbiAgICB1bmJpbmREb2N1bWVudFJlc2l6ZUxpc3RlbmVyKCkge1xuICAgICAgICBpZiAodGhpcy5kb2N1bWVudFJlc2l6ZUxpc3RlbmVyKSB7XG4gICAgICAgICAgICB3aW5kb3cucmVtb3ZlRXZlbnRMaXN0ZW5lcigncmVzaXplJywgdGhpcy5kb2N1bWVudFJlc2l6ZUxpc3RlbmVyKTtcbiAgICAgICAgICAgIHRoaXMuZG9jdW1lbnRSZXNpemVMaXN0ZW5lciA9IG51bGw7XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICBvbldpbmRvd1Jlc2l6ZSgpIHtcbiAgICAgICAgaWYgKHRoaXMub3ZlcmxheVZpc2libGUgJiYgIURvbUhhbmRsZXIuaXNUb3VjaERldmljZSgpKSB7XG4gICAgICAgICAgICB0aGlzLmhpZGUoKTtcbiAgICAgICAgfVxuICAgIH1cblxuICAgIGJpbmRTY3JvbGxMaXN0ZW5lcigpIHtcbiAgICAgICAgaWYgKCF0aGlzLnNjcm9sbEhhbmRsZXIpIHtcbiAgICAgICAgICAgIHRoaXMuc2Nyb2xsSGFuZGxlciA9IG5ldyBDb25uZWN0ZWRPdmVybGF5U2Nyb2xsSGFuZGxlcih0aGlzLmNvbnRhaW5lckVMLm5hdGl2ZUVsZW1lbnQsICgpID0+IHtcbiAgICAgICAgICAgICAgICBpZiAodGhpcy5vdmVybGF5VmlzaWJsZSkge1xuICAgICAgICAgICAgICAgICAgICB0aGlzLmhpZGUoKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgfVxuXG4gICAgICAgIHRoaXMuc2Nyb2xsSGFuZGxlci5iaW5kU2Nyb2xsTGlzdGVuZXIoKTtcbiAgICB9XG5cbiAgICB1bmJpbmRTY3JvbGxMaXN0ZW5lcigpIHtcbiAgICAgICAgaWYgKHRoaXMuc2Nyb2xsSGFuZGxlcikge1xuICAgICAgICAgICAgdGhpcy5zY3JvbGxIYW5kbGVyLnVuYmluZFNjcm9sbExpc3RlbmVyKCk7XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICBvbk92ZXJsYXlIaWRlKCkge1xuICAgICAgICB0aGlzLnVuYmluZERvY3VtZW50Q2xpY2tMaXN0ZW5lcigpO1xuICAgICAgICB0aGlzLnVuYmluZERvY3VtZW50UmVzaXplTGlzdGVuZXIoKTtcbiAgICAgICAgdGhpcy51bmJpbmRTY3JvbGxMaXN0ZW5lcigpO1xuICAgICAgICBpZiAodGhpcy5vdmVybGF5KSB7XG4gICAgICAgICAgICB0aGlzLm92ZXJsYXkgPSBudWxsO1xuICAgICAgICAgICAgdGhpcy5vbkhpZGUuZW1pdCgpO1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgbmdPbkRlc3Ryb3koKSB7XG4gICAgICAgIGlmICh0aGlzLmZvcmNlU2VsZWN0aW9uVXBkYXRlTW9kZWxUaW1lb3V0KSB7XG4gICAgICAgICAgICBjbGVhclRpbWVvdXQodGhpcy5mb3JjZVNlbGVjdGlvblVwZGF0ZU1vZGVsVGltZW91dCk7XG4gICAgICAgICAgICB0aGlzLmZvcmNlU2VsZWN0aW9uVXBkYXRlTW9kZWxUaW1lb3V0ID0gbnVsbDtcbiAgICAgICAgfVxuXG4gICAgICAgIGlmICh0aGlzLnNjcm9sbEhhbmRsZXIpIHtcbiAgICAgICAgICAgIHRoaXMuc2Nyb2xsSGFuZGxlci5kZXN0cm95KCk7XG4gICAgICAgICAgICB0aGlzLnNjcm9sbEhhbmRsZXIgPSBudWxsO1xuICAgICAgICB9XG5cbiAgICAgICAgaWYgKHRoaXMub3ZlcmxheSkge1xuICAgICAgICAgICAgWkluZGV4VXRpbHMuY2xlYXIodGhpcy5vdmVybGF5KTtcbiAgICAgICAgfVxuXG4gICAgICAgIHRoaXMucmVzdG9yZU92ZXJsYXlBcHBlbmQoKTtcbiAgICAgICAgdGhpcy5vbk92ZXJsYXlIaWRlKCk7XG4gICAgfVxufVxuXG5ATmdNb2R1bGUoe1xuICAgIGltcG9ydHM6IFtDb21tb25Nb2R1bGUsIElucHV0VGV4dE1vZHVsZSwgQnV0dG9uTW9kdWxlLCBTaGFyZWRNb2R1bGUsIFJpcHBsZU1vZHVsZSwgU2Nyb2xsZXJNb2R1bGUsIEF1dG9Gb2N1c01vZHVsZV0sXG4gICAgZXhwb3J0czogW0F1dG9Db21wbGV0ZSwgU2hhcmVkTW9kdWxlLCBTY3JvbGxlck1vZHVsZSwgQXV0b0ZvY3VzTW9kdWxlXSxcbiAgICBkZWNsYXJhdGlvbnM6IFtBdXRvQ29tcGxldGVdXG59KVxuZXhwb3J0IGNsYXNzIEF1dG9Db21wbGV0ZU1vZHVsZSB7fVxuIl19
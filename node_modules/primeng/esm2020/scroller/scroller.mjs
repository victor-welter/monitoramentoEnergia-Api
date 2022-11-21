import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, ContentChildren, EventEmitter, Input, NgModule, Output, ViewChild, ViewEncapsulation } from '@angular/core';
import { PrimeTemplate } from 'primeng/api';
import { DomHandler } from 'primeng/dom';
import * as i0 from "@angular/core";
import * as i1 from "@angular/common";
export class Scroller {
    constructor(cd, zone) {
        this.cd = cd;
        this.zone = zone;
        this.onLazyLoad = new EventEmitter();
        this.onScroll = new EventEmitter();
        this.onScrollIndexChange = new EventEmitter();
        this._tabindex = 0;
        this._itemSize = 0;
        this._orientation = 'vertical';
        this._step = 0;
        this._delay = 0;
        this._resizeDelay = 10;
        this._appendOnly = false;
        this._inline = false;
        this._lazy = false;
        this._disabled = false;
        this._loaderDisabled = false;
        this._showSpacer = true;
        this._showLoader = false;
        this._autoSize = false;
        this.d_loading = false;
        this.first = 0;
        this.last = 0;
        this.page = 0;
        this.numItemsInViewport = 0;
        this.lastScrollPos = 0;
        this.lazyLoadState = {};
        this.loaderArr = [];
        this.spacerStyle = {};
        this.contentStyle = {};
        this.initialized = false;
    }
    get id() {
        return this._id;
    }
    set id(val) {
        this._id = val;
    }
    get style() {
        return this._style;
    }
    set style(val) {
        this._style = val;
    }
    get styleClass() {
        return this._styleClass;
    }
    set styleClass(val) {
        this._styleClass = val;
    }
    get tabindex() {
        return this._tabindex;
    }
    set tabindex(val) {
        this._tabindex = val;
    }
    get items() {
        return this._items;
    }
    set items(val) {
        this._items = val;
    }
    get itemSize() {
        return this._itemSize;
    }
    set itemSize(val) {
        this._itemSize = val;
    }
    get scrollHeight() {
        return this._scrollHeight;
    }
    set scrollHeight(val) {
        this._scrollHeight = val;
    }
    get scrollWidth() {
        return this._scrollWidth;
    }
    set scrollWidth(val) {
        this._scrollWidth = val;
    }
    get orientation() {
        return this._orientation;
    }
    set orientation(val) {
        this._orientation = val;
    }
    get step() {
        return this._step;
    }
    set step(val) {
        this._step = val;
    }
    get delay() {
        return this._delay;
    }
    set delay(val) {
        this._delay = val;
    }
    get resizeDelay() {
        return this._resizeDelay;
    }
    set resizeDelay(val) {
        this._resizeDelay = val;
    }
    get appendOnly() {
        return this._appendOnly;
    }
    set appendOnly(val) {
        this._appendOnly = val;
    }
    get inline() {
        return this._inline;
    }
    set inline(val) {
        this._inline = val;
    }
    get lazy() {
        return this._lazy;
    }
    set lazy(val) {
        this._lazy = val;
    }
    get disabled() {
        return this._disabled;
    }
    set disabled(val) {
        this._disabled = val;
    }
    get loaderDisabled() {
        return this._loaderDisabled;
    }
    set loaderDisabled(val) {
        this._loaderDisabled = val;
    }
    get columns() {
        return this._columns;
    }
    set columns(val) {
        this._columns = val;
    }
    get showSpacer() {
        return this._showSpacer;
    }
    set showSpacer(val) {
        this._showSpacer = val;
    }
    get showLoader() {
        return this._showLoader;
    }
    set showLoader(val) {
        this._showLoader = val;
    }
    get numToleratedItems() {
        return this._numToleratedItems;
    }
    set numToleratedItems(val) {
        this._numToleratedItems = val;
    }
    get loading() {
        return this._loading;
    }
    set loading(val) {
        this._loading = val;
    }
    get autoSize() {
        return this._autoSize;
    }
    set autoSize(val) {
        this._autoSize = val;
    }
    get trackBy() {
        return this._trackBy;
    }
    set trackBy(val) {
        this._trackBy = val;
    }
    get options() {
        return this._options;
    }
    set options(val) {
        this._options = val;
        if (val && typeof val === 'object') {
            Object.entries(val).forEach(([k, v]) => this[`_${k}`] !== v && (this[`_${k}`] = v));
        }
    }
    get vertical() {
        return this._orientation === 'vertical';
    }
    get horizontal() {
        return this._orientation === 'horizontal';
    }
    get both() {
        return this._orientation === 'both';
    }
    get loadedItems() {
        if (this._items && !this.d_loading) {
            if (this.both)
                return this._items.slice(this._appendOnly ? 0 : this.first.rows, this.last.rows).map((item) => (this._columns ? item : item.slice(this._appendOnly ? 0 : this.first.cols, this.last.cols)));
            else if (this.horizontal && this._columns)
                return this._items;
            else
                return this._items.slice(this._appendOnly ? 0 : this.first, this.last);
        }
        return [];
    }
    get loadedRows() {
        return this.d_loading ? (this._loaderDisabled ? this.loaderArr : []) : this.loadedItems;
    }
    get loadedColumns() {
        if (this._columns && (this.both || this.horizontal)) {
            return this.d_loading && this._loaderDisabled ? (this.both ? this.loaderArr[0] : this.loaderArr) : this._columns.slice(this.both ? this.first.cols : this.first, this.both ? this.last.cols : this.last);
        }
        return this._columns;
    }
    get isPageChanged() {
        return this._step ? this.page !== this.getPageByFirst() : true;
    }
    ngOnInit() {
        this.setInitialState();
    }
    ngOnChanges(simpleChanges) {
        let isLoadingChanged = false;
        if (simpleChanges.loading) {
            const { previousValue, currentValue } = simpleChanges.loading;
            if (this.lazy && previousValue !== currentValue && currentValue !== this.d_loading) {
                this.d_loading = currentValue;
                isLoadingChanged = true;
            }
        }
        if (simpleChanges.orientation) {
            this.lastScrollPos = this.both ? { top: 0, left: 0 } : 0;
        }
        if (simpleChanges.numToleratedItems) {
            const { previousValue, currentValue } = simpleChanges.numToleratedItems;
            if (previousValue !== currentValue && currentValue !== this.d_numToleratedItems) {
                this.d_numToleratedItems = currentValue;
            }
        }
        if (simpleChanges.options) {
            const { previousValue, currentValue } = simpleChanges.options;
            if (this.lazy && previousValue?.loading !== currentValue?.loading && currentValue?.loading !== this.d_loading) {
                this.d_loading = currentValue.loading;
                isLoadingChanged = true;
            }
            if (previousValue?.numToleratedItems !== currentValue?.numToleratedItems && currentValue?.numToleratedItems !== this.d_numToleratedItems) {
                this.d_numToleratedItems = currentValue.numToleratedItems;
            }
        }
        if (this.initialized) {
            const isChanged = !isLoadingChanged && (simpleChanges.items?.previousValue?.length !== simpleChanges.items?.currentValue?.length || simpleChanges.itemSize || simpleChanges.scrollHeight || simpleChanges.scrollWidth);
            isChanged && this.init();
        }
    }
    ngAfterContentInit() {
        this.templates.forEach((item) => {
            switch (item.getType()) {
                case 'content':
                    this.contentTemplate = item.template;
                    break;
                case 'item':
                    this.itemTemplate = item.template;
                    break;
                case 'loader':
                    this.loaderTemplate = item.template;
                    break;
                case 'loadericon':
                    this.loaderIconTemplate = item.template;
                    break;
                default:
                    this.itemTemplate = item.template;
                    break;
            }
        });
    }
    ngAfterViewInit() {
        this.viewInit();
    }
    ngAfterViewChecked() {
        if (!this.initialized) {
            this.viewInit();
        }
        this.calculateAutoSize();
    }
    ngOnDestroy() {
        this.unbindResizeListener();
        this.contentEl = null;
        this.initialized = false;
    }
    viewInit() {
        if (DomHandler.isVisible(this.elementViewChild?.nativeElement)) {
            this.setInitialState();
            this.setContentEl(this.contentEl);
            this.init();
            this.defaultWidth = DomHandler.getWidth(this.elementViewChild.nativeElement);
            this.defaultHeight = DomHandler.getHeight(this.elementViewChild.nativeElement);
            this.initialized = true;
        }
    }
    init() {
        if (!this._disabled) {
            this.setSize();
            this.calculateOptions();
            this.setSpacerSize();
            this.bindResizeListener();
            this.cd.detectChanges();
        }
    }
    setContentEl(el) {
        this.contentEl = el || this.contentViewChild?.nativeElement || DomHandler.findSingle(this.elementViewChild?.nativeElement, '.p-scroller-content');
    }
    setInitialState() {
        this.first = this.both ? { rows: 0, cols: 0 } : 0;
        this.last = this.both ? { rows: 0, cols: 0 } : 0;
        this.numItemsInViewport = this.both ? { rows: 0, cols: 0 } : 0;
        this.lastScrollPos = this.both ? { top: 0, left: 0 } : 0;
        this.d_loading = this._loading || false;
        this.d_numToleratedItems = this._numToleratedItems;
        this.loaderArr = [];
        this.spacerStyle = {};
        this.contentStyle = {};
    }
    getElementRef() {
        return this.elementViewChild;
    }
    getPageByFirst() {
        return Math.floor((this.first + this.d_numToleratedItems * 4) / (this._step || 1));
    }
    scrollTo(options) {
        this.lastScrollPos = this.both ? { top: 0, left: 0 } : 0;
        this.elementViewChild?.nativeElement?.scrollTo(options);
    }
    scrollToIndex(index, behavior = 'auto') {
        const { numToleratedItems } = this.calculateNumItems();
        const contentPos = this.getContentPosition();
        const calculateFirst = (_index = 0, _numT) => (_index <= _numT ? 0 : _index);
        const calculateCoord = (_first, _size, _cpos) => _first * _size + _cpos;
        const scrollTo = (left = 0, top = 0) => this.scrollTo({ left, top, behavior });
        if (this.both) {
            this.first = { rows: calculateFirst(index[0], numToleratedItems[0]), cols: calculateFirst(index[1], numToleratedItems[1]) };
            scrollTo(calculateCoord(this.first.cols, this._itemSize[1], contentPos.left), calculateCoord(this.first.rows, this._itemSize[0], contentPos.top));
        }
        else {
            this.first = calculateFirst(index, numToleratedItems);
            this.horizontal ? scrollTo(calculateCoord(this.first, this._itemSize, contentPos.left), 0) : scrollTo(0, calculateCoord(this.first, this._itemSize, contentPos.top));
        }
    }
    scrollInView(index, to, behavior = 'auto') {
        if (to) {
            const { first, viewport } = this.getRenderedRange();
            const scrollTo = (left = 0, top = 0) => this.scrollTo({ left, top, behavior });
            const isToStart = to === 'to-start';
            const isToEnd = to === 'to-end';
            if (isToStart) {
                if (this.both) {
                    if (viewport.first.rows - first.rows > index[0]) {
                        scrollTo(viewport.first.cols * this._itemSize[1], (viewport.first.rows - 1) * this._itemSize[0]);
                    }
                    else if (viewport.first.cols - first.cols > index[1]) {
                        scrollTo((viewport.first.cols - 1) * this._itemSize[1], viewport.first.rows * this._itemSize[0]);
                    }
                }
                else {
                    if (viewport.first - first > index) {
                        const pos = (viewport.first - 1) * this._itemSize;
                        this.horizontal ? scrollTo(pos, 0) : scrollTo(0, pos);
                    }
                }
            }
            else if (isToEnd) {
                if (this.both) {
                    if (viewport.last.rows - first.rows <= index[0] + 1) {
                        scrollTo(viewport.first.cols * this._itemSize[1], (viewport.first.rows + 1) * this._itemSize[0]);
                    }
                    else if (viewport.last.cols - first.cols <= index[1] + 1) {
                        scrollTo((viewport.first.cols + 1) * this._itemSize[1], viewport.first.rows * this._itemSize[0]);
                    }
                }
                else {
                    if (viewport.last - first <= index + 1) {
                        const pos = (viewport.first + 1) * this._itemSize;
                        this.horizontal ? scrollTo(pos, 0) : scrollTo(0, pos);
                    }
                }
            }
        }
        else {
            this.scrollToIndex(index, behavior);
        }
    }
    getRenderedRange() {
        const calculateFirstInViewport = (_pos, _size) => Math.floor(_pos / (_size || _pos));
        let firstInViewport = this.first;
        let lastInViewport = 0;
        if (this.elementViewChild?.nativeElement) {
            const { scrollTop, scrollLeft } = this.elementViewChild.nativeElement;
            if (this.both) {
                firstInViewport = { rows: calculateFirstInViewport(scrollTop, this._itemSize[0]), cols: calculateFirstInViewport(scrollLeft, this._itemSize[1]) };
                lastInViewport = { rows: firstInViewport.rows + this.numItemsInViewport.rows, cols: firstInViewport.cols + this.numItemsInViewport.cols };
            }
            else {
                const scrollPos = this.horizontal ? scrollLeft : scrollTop;
                firstInViewport = calculateFirstInViewport(scrollPos, this._itemSize);
                lastInViewport = firstInViewport + this.numItemsInViewport;
            }
        }
        return {
            first: this.first,
            last: this.last,
            viewport: {
                first: firstInViewport,
                last: lastInViewport
            }
        };
    }
    calculateNumItems() {
        const contentPos = this.getContentPosition();
        const contentWidth = this.elementViewChild?.nativeElement ? this.elementViewChild.nativeElement.offsetWidth - contentPos.left : 0;
        const contentHeight = this.elementViewChild?.nativeElement ? this.elementViewChild.nativeElement.offsetHeight - contentPos.top : 0;
        const calculateNumItemsInViewport = (_contentSize, _itemSize) => Math.ceil(_contentSize / (_itemSize || _contentSize));
        const calculateNumToleratedItems = (_numItems) => Math.ceil(_numItems / 2);
        const numItemsInViewport = this.both
            ? { rows: calculateNumItemsInViewport(contentHeight, this._itemSize[0]), cols: calculateNumItemsInViewport(contentWidth, this._itemSize[1]) }
            : calculateNumItemsInViewport(this.horizontal ? contentWidth : contentHeight, this._itemSize);
        const numToleratedItems = this.d_numToleratedItems || (this.both ? [calculateNumToleratedItems(numItemsInViewport.rows), calculateNumToleratedItems(numItemsInViewport.cols)] : calculateNumToleratedItems(numItemsInViewport));
        return { numItemsInViewport, numToleratedItems };
    }
    calculateOptions() {
        const { numItemsInViewport, numToleratedItems } = this.calculateNumItems();
        const calculateLast = (_first, _num, _numT, _isCols = false) => this.getLast(_first + _num + (_first < _numT ? 2 : 3) * _numT, _isCols);
        const first = this.first;
        const last = this.both
            ? { rows: calculateLast(this.first.rows, numItemsInViewport.rows, numToleratedItems[0]), cols: calculateLast(this.first.cols, numItemsInViewport.cols, numToleratedItems[1], true) }
            : calculateLast(this.first, numItemsInViewport, numToleratedItems);
        this.last = last;
        this.numItemsInViewport = numItemsInViewport;
        this.d_numToleratedItems = numToleratedItems;
        if (this.showLoader) {
            this.loaderArr = this.both ? Array.from({ length: numItemsInViewport.rows }).map(() => Array.from({ length: numItemsInViewport.cols })) : Array.from({ length: numItemsInViewport });
        }
        if (this._lazy) {
            Promise.resolve().then(() => {
                this.lazyLoadState = {
                    first: this._step ? (this.both ? { rows: 0, cols: first.cols } : 0) : first,
                    last: Math.min(this._step ? this._step : this.last, this.items.length)
                };
                this.handleEvents('onLazyLoad', this.lazyLoadState);
            });
        }
    }
    calculateAutoSize() {
        if (this._autoSize && !this.d_loading) {
            Promise.resolve().then(() => {
                if (this.contentEl) {
                    this.contentEl.style.minHeight = this.contentEl.style.minWidth = 'auto';
                    const { offsetWidth, offsetHeight } = this.contentEl;
                    (this.both || this.horizontal) && (this.elementViewChild.nativeElement.style.width = (offsetWidth < this.defaultWidth ? offsetWidth : this.defaultWidth) + 'px');
                    (this.both || this.vertical) && (this.elementViewChild.nativeElement.style.height = (offsetHeight < this.defaultHeight ? offsetHeight : this.defaultHeight) + 'px');
                    this.contentEl.style.minHeight = this.contentEl.style.minWidth = '';
                }
            });
        }
    }
    getLast(last = 0, isCols = false) {
        return this._items ? Math.min(isCols ? (this._columns || this._items[0]).length : this._items.length, last) : 0;
    }
    getContentPosition() {
        if (this.contentEl) {
            const style = getComputedStyle(this.contentEl);
            const left = parseFloat(style.paddingLeft) + Math.max(parseFloat(style.left) || 0, 0);
            const right = parseFloat(style.paddingRight) + Math.max(parseFloat(style.right) || 0, 0);
            const top = parseFloat(style.paddingTop) + Math.max(parseFloat(style.top) || 0, 0);
            const bottom = parseFloat(style.paddingBottom) + Math.max(parseFloat(style.bottom) || 0, 0);
            return { left, right, top, bottom, x: left + right, y: top + bottom };
        }
        return { left: 0, right: 0, top: 0, bottom: 0, x: 0, y: 0 };
    }
    setSize() {
        if (this.elementViewChild?.nativeElement) {
            const parentElement = this.elementViewChild.nativeElement.parentElement.parentElement;
            const width = this._scrollWidth || `${this.elementViewChild.nativeElement.offsetWidth || parentElement.offsetWidth}px`;
            const height = this._scrollHeight || `${this.elementViewChild.nativeElement.offsetHeight || parentElement.offsetHeight}px`;
            const setProp = (_name, _value) => (this.elementViewChild.nativeElement.style[_name] = _value);
            if (this.both || this.horizontal) {
                setProp('height', height);
                setProp('width', width);
            }
            else {
                setProp('height', height);
            }
        }
    }
    setSpacerSize() {
        if (this._items) {
            const contentPos = this.getContentPosition();
            const setProp = (_name, _value, _size, _cpos = 0) => (this.spacerStyle = { ...this.spacerStyle, ...{ [`${_name}`]: (_value || []).length * _size + _cpos + 'px' } });
            if (this.both) {
                setProp('height', this._items, this._itemSize[0], contentPos.y);
                setProp('width', this._columns || this._items[1], this._itemSize[1], contentPos.x);
            }
            else {
                this.horizontal ? setProp('width', this._columns || this._items, this._itemSize, contentPos.x) : setProp('height', this._items, this._itemSize, contentPos.y);
            }
        }
    }
    setContentPosition(pos) {
        if (this.contentEl && !this._appendOnly) {
            const first = pos ? pos.first : this.first;
            const calculateTranslateVal = (_first, _size) => _first * _size;
            const setTransform = (_x = 0, _y = 0) => (this.contentStyle = { ...this.contentStyle, ...{ transform: `translate3d(${_x}px, ${_y}px, 0)` } });
            if (this.both) {
                setTransform(calculateTranslateVal(first.cols, this._itemSize[1]), calculateTranslateVal(first.rows, this._itemSize[0]));
            }
            else {
                const translateVal = calculateTranslateVal(first, this._itemSize);
                this.horizontal ? setTransform(translateVal, 0) : setTransform(0, translateVal);
            }
        }
    }
    onScrollPositionChange(event) {
        const target = event.target;
        const contentPos = this.getContentPosition();
        const calculateScrollPos = (_pos, _cpos) => (_pos ? (_pos > _cpos ? _pos - _cpos : _pos) : 0);
        const calculateCurrentIndex = (_pos, _size) => Math.floor(_pos / (_size || _pos));
        const calculateTriggerIndex = (_currentIndex, _first, _last, _num, _numT, _isScrollDownOrRight) => {
            return _currentIndex <= _numT ? _numT : _isScrollDownOrRight ? _last - _num - _numT : _first + _numT - 1;
        };
        const calculateFirst = (_currentIndex, _triggerIndex, _first, _last, _num, _numT, _isScrollDownOrRight) => {
            if (_currentIndex <= _numT)
                return 0;
            else
                return Math.max(0, _isScrollDownOrRight ? (_currentIndex < _triggerIndex ? _first : _currentIndex - _numT) : _currentIndex > _triggerIndex ? _first : _currentIndex - 2 * _numT);
        };
        const calculateLast = (_currentIndex, _first, _last, _num, _numT, _isCols = false) => {
            let lastValue = _first + _num + 2 * _numT;
            if (_currentIndex >= _numT) {
                lastValue += _numT + 1;
            }
            return this.getLast(lastValue, _isCols);
        };
        const scrollTop = calculateScrollPos(target.scrollTop, contentPos.top);
        const scrollLeft = calculateScrollPos(target.scrollLeft, contentPos.left);
        let newFirst = this.both ? { rows: 0, cols: 0 } : 0;
        let newLast = this.last;
        let isRangeChanged = false;
        let newScrollPos = this.lastScrollPos;
        if (this.both) {
            const isScrollDown = this.lastScrollPos.top <= scrollTop;
            const isScrollRight = this.lastScrollPos.left <= scrollLeft;
            if (!this._appendOnly || (this._appendOnly && (isScrollDown || isScrollRight))) {
                const currentIndex = { rows: calculateCurrentIndex(scrollTop, this._itemSize[0]), cols: calculateCurrentIndex(scrollLeft, this._itemSize[1]) };
                const triggerIndex = {
                    rows: calculateTriggerIndex(currentIndex.rows, this.first.rows, this.last.rows, this.numItemsInViewport.rows, this.d_numToleratedItems[0], isScrollDown),
                    cols: calculateTriggerIndex(currentIndex.cols, this.first.cols, this.last.cols, this.numItemsInViewport.cols, this.d_numToleratedItems[1], isScrollRight)
                };
                newFirst = {
                    rows: calculateFirst(currentIndex.rows, triggerIndex.rows, this.first.rows, this.last.rows, this.numItemsInViewport.rows, this.d_numToleratedItems[0], isScrollDown),
                    cols: calculateFirst(currentIndex.cols, triggerIndex.cols, this.first.cols, this.last.cols, this.numItemsInViewport.cols, this.d_numToleratedItems[1], isScrollRight)
                };
                newLast = {
                    rows: calculateLast(currentIndex.rows, newFirst.rows, this.last.rows, this.numItemsInViewport.rows, this.d_numToleratedItems[0]),
                    cols: calculateLast(currentIndex.cols, newFirst.cols, this.last.cols, this.numItemsInViewport.cols, this.d_numToleratedItems[1], true)
                };
                isRangeChanged = newFirst.rows !== this.first.rows || newLast.rows !== this.last.rows || newFirst.cols !== this.first.cols || newLast.cols !== this.last.cols;
                newScrollPos = { top: scrollTop, left: scrollLeft };
            }
        }
        else {
            const scrollPos = this.horizontal ? scrollLeft : scrollTop;
            const isScrollDownOrRight = this.lastScrollPos <= scrollPos;
            if (!this._appendOnly || (this._appendOnly && isScrollDownOrRight)) {
                const currentIndex = calculateCurrentIndex(scrollPos, this._itemSize);
                const triggerIndex = calculateTriggerIndex(currentIndex, this.first, this.last, this.numItemsInViewport, this.d_numToleratedItems, isScrollDownOrRight);
                newFirst = calculateFirst(currentIndex, triggerIndex, this.first, this.last, this.numItemsInViewport, this.d_numToleratedItems, isScrollDownOrRight);
                newLast = calculateLast(currentIndex, newFirst, this.last, this.numItemsInViewport, this.d_numToleratedItems);
                isRangeChanged = newFirst !== this.first || newLast !== this.last;
                newScrollPos = scrollPos;
            }
        }
        return {
            first: newFirst,
            last: newLast,
            isRangeChanged,
            scrollPos: newScrollPos
        };
    }
    onScrollChange(event) {
        const { first, last, isRangeChanged, scrollPos } = this.onScrollPositionChange(event);
        if (isRangeChanged) {
            const newState = { first, last };
            this.setContentPosition(newState);
            this.first = first;
            this.last = last;
            this.lastScrollPos = scrollPos;
            this.handleEvents('onScrollIndexChange', newState);
            if (this._lazy && this.isPageChanged) {
                const lazyLoadState = {
                    first: this._step ? Math.min(this.getPageByFirst() * this._step, this.items.length - this._step) : first,
                    last: Math.min(this._step ? (this.getPageByFirst() + 1) * this._step : last, this.items.length)
                };
                const isLazyStateChanged = this.lazyLoadState.first !== lazyLoadState.first || this.lazyLoadState.last !== lazyLoadState.last;
                isLazyStateChanged && this.handleEvents('onLazyLoad', lazyLoadState);
                this.lazyLoadState = lazyLoadState;
            }
        }
    }
    onContainerScroll(event) {
        this.handleEvents('onScroll', { originalEvent: event });
        if (this._delay && this.isPageChanged) {
            if (this.scrollTimeout) {
                clearTimeout(this.scrollTimeout);
            }
            if (!this.d_loading && this.showLoader) {
                const { isRangeChanged } = this.onScrollPositionChange(event);
                const changed = isRangeChanged || (this._step ? this.isPageChanged : false);
                if (changed) {
                    this.d_loading = true;
                    this.cd.detectChanges();
                }
            }
            this.scrollTimeout = setTimeout(() => {
                this.onScrollChange(event);
                if (this.d_loading && this.showLoader && (!this._lazy || this._loading === undefined)) {
                    this.d_loading = false;
                    this.page = this.getPageByFirst();
                    this.cd.detectChanges();
                }
            }, this._delay);
        }
        else {
            !this.d_loading && this.onScrollChange(event);
        }
    }
    bindResizeListener() {
        if (!this.windowResizeListener) {
            this.zone.runOutsideAngular(() => {
                this.windowResizeListener = this.onWindowResize.bind(this);
                window.addEventListener('resize', this.windowResizeListener);
                window.addEventListener('orientationchange', this.windowResizeListener);
            });
        }
    }
    unbindResizeListener() {
        if (this.windowResizeListener) {
            window.removeEventListener('resize', this.windowResizeListener);
            window.removeEventListener('orientationchange', this.windowResizeListener);
            this.windowResizeListener = null;
        }
    }
    onWindowResize() {
        if (this.resizeTimeout) {
            clearTimeout(this.resizeTimeout);
        }
        this.resizeTimeout = setTimeout(() => {
            if (DomHandler.isVisible(this.elementViewChild?.nativeElement)) {
                const [width, height] = [DomHandler.getWidth(this.elementViewChild.nativeElement), DomHandler.getHeight(this.elementViewChild.nativeElement)];
                const [isDiffWidth, isDiffHeight] = [width !== this.defaultWidth, height !== this.defaultHeight];
                const reinit = this.both ? isDiffWidth || isDiffHeight : this.horizontal ? isDiffWidth : this.vertical ? isDiffHeight : false;
                reinit &&
                    this.zone.run(() => {
                        this.d_numToleratedItems = this._numToleratedItems;
                        this.defaultWidth = width;
                        this.defaultHeight = height;
                        this.init();
                    });
            }
        }, this._resizeDelay);
    }
    handleEvents(name, params) {
        return this.options && this.options[name] ? this.options[name](params) : this[name].emit(params);
    }
    getContentOptions() {
        return {
            contentStyleClass: `p-scroller-content ${this.d_loading ? 'p-scroller-loading' : ''}`,
            items: this.loadedItems,
            getItemOptions: (index) => this.getOptions(index),
            loading: this.d_loading,
            getLoaderOptions: (index, options) => this.getLoaderOptions(index, options),
            itemSize: this._itemSize,
            rows: this.loadedRows,
            columns: this.loadedColumns,
            spacerStyle: this.spacerStyle,
            contentStyle: this.contentStyle,
            vertical: this.vertical,
            horizontal: this.horizontal,
            both: this.both
        };
    }
    getOptions(renderedIndex) {
        const count = (this._items || []).length;
        const index = this.both ? this.first.rows + renderedIndex : this.first + renderedIndex;
        return {
            index,
            count,
            first: index === 0,
            last: index === count - 1,
            even: index % 2 === 0,
            odd: index % 2 !== 0
        };
    }
    getLoaderOptions(index, extOptions) {
        const count = this.loaderArr.length;
        return {
            index,
            count,
            first: index === 0,
            last: index === count - 1,
            even: index % 2 === 0,
            odd: index % 2 !== 0,
            ...extOptions
        };
    }
}
Scroller.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "14.0.7", ngImport: i0, type: Scroller, deps: [{ token: i0.ChangeDetectorRef }, { token: i0.NgZone }], target: i0.ɵɵFactoryTarget.Component });
Scroller.ɵcmp = i0.ɵɵngDeclareComponent({ minVersion: "14.0.0", version: "14.0.7", type: Scroller, selector: "p-scroller", inputs: { id: "id", style: "style", styleClass: "styleClass", tabindex: "tabindex", items: "items", itemSize: "itemSize", scrollHeight: "scrollHeight", scrollWidth: "scrollWidth", orientation: "orientation", step: "step", delay: "delay", resizeDelay: "resizeDelay", appendOnly: "appendOnly", inline: "inline", lazy: "lazy", disabled: "disabled", loaderDisabled: "loaderDisabled", columns: "columns", showSpacer: "showSpacer", showLoader: "showLoader", numToleratedItems: "numToleratedItems", loading: "loading", autoSize: "autoSize", trackBy: "trackBy", options: "options" }, outputs: { onLazyLoad: "onLazyLoad", onScroll: "onScroll", onScrollIndexChange: "onScrollIndexChange" }, host: { classAttribute: "p-scroller-viewport p-element" }, queries: [{ propertyName: "templates", predicate: PrimeTemplate }], viewQueries: [{ propertyName: "elementViewChild", first: true, predicate: ["element"], descendants: true }, { propertyName: "contentViewChild", first: true, predicate: ["content"], descendants: true }], usesOnChanges: true, ngImport: i0, template: `
        <ng-container *ngIf="!_disabled; else disabledContainer">
            <div
                #element
                [attr.id]="_id"
                [attr.tabindex]="tabindex"
                [ngStyle]="_style"
                [class]="_styleClass"
                [ngClass]="{ 'p-scroller': true, 'p-scroller-inline': inline, 'p-both-scroll': both, 'p-horizontal-scroll': horizontal }"
                (scroll)="onContainerScroll($event)"
            >
                <ng-container *ngIf="contentTemplate; else buildInContent">
                    <ng-container *ngTemplateOutlet="contentTemplate; context: { $implicit: loadedItems, options: getContentOptions() }"></ng-container>
                </ng-container>
                <ng-template #buildInContent>
                    <div #content class="p-scroller-content" [ngClass]="{ 'p-scroller-loading': d_loading }" [ngStyle]="contentStyle">
                        <ng-container *ngFor="let item of loadedItems; let index = index; trackBy: _trackBy || index">
                            <ng-container *ngTemplateOutlet="itemTemplate; context: { $implicit: item, options: getOptions(index) }"></ng-container>
                        </ng-container>
                    </div>
                </ng-template>
                <div *ngIf="_showSpacer" class="p-scroller-spacer" [ngStyle]="spacerStyle"></div>
                <div *ngIf="!loaderDisabled && _showLoader && d_loading" class="p-scroller-loader" [ngClass]="{ 'p-component-overlay': !loaderTemplate }">
                    <ng-container *ngIf="loaderTemplate; else buildInLoader">
                        <ng-container *ngFor="let item of loaderArr; let index = index">
                            <ng-container *ngTemplateOutlet="loaderTemplate; context: { options: getLoaderOptions(index, both && { numCols: _numItemsInViewport.cols }) }"></ng-container>
                        </ng-container>
                    </ng-container>
                    <ng-template #buildInLoader>
                        <ng-container *ngIf="loaderIconTemplate; else buildInLoaderIcon">
                            <ng-container *ngTemplateOutlet="loaderIconTemplate; context: { options: { styleClass: 'p-scroller-loading-icon' } }"></ng-container>
                        </ng-container>
                        <ng-template #buildInLoaderIcon>
                            <i class="p-scroller-loading-icon pi pi-spinner pi-spin"></i>
                        </ng-template>
                    </ng-template>
                </div>
            </div>
        </ng-container>
        <ng-template #disabledContainer>
            <ng-content></ng-content>
            <ng-container *ngIf="contentTemplate">
                <ng-container *ngTemplateOutlet="contentTemplate; context: { $implicit: items, options: { rows: _items, columns: loadedColumns } }"></ng-container>
            </ng-container>
        </ng-template>
    `, isInline: true, styles: ["p-scroller{flex:1;outline:0 none}.p-scroller{position:relative;overflow:auto;contain:strict;transform:translateZ(0);will-change:scroll-position;outline:0 none}.p-scroller-content{position:absolute;top:0;left:0;min-height:100%;min-width:100%;will-change:transform}.p-scroller-spacer{position:absolute;top:0;left:0;height:1px;width:1px;transform-origin:0 0;pointer-events:none}.p-scroller-loader{position:sticky;top:0;left:0;width:100%;height:100%}.p-scroller-loader.p-component-overlay{display:flex;align-items:center;justify-content:center}.p-scroller-loading-icon{font-size:2rem}.p-scroller-inline .p-scroller-content{position:static}\n"], dependencies: [{ kind: "directive", type: i1.NgClass, selector: "[ngClass]", inputs: ["class", "ngClass"] }, { kind: "directive", type: i1.NgForOf, selector: "[ngFor][ngForOf]", inputs: ["ngForOf", "ngForTrackBy", "ngForTemplate"] }, { kind: "directive", type: i1.NgIf, selector: "[ngIf]", inputs: ["ngIf", "ngIfThen", "ngIfElse"] }, { kind: "directive", type: i1.NgTemplateOutlet, selector: "[ngTemplateOutlet]", inputs: ["ngTemplateOutletContext", "ngTemplateOutlet", "ngTemplateOutletInjector"] }, { kind: "directive", type: i1.NgStyle, selector: "[ngStyle]", inputs: ["ngStyle"] }], changeDetection: i0.ChangeDetectionStrategy.Default, encapsulation: i0.ViewEncapsulation.None });
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "14.0.7", ngImport: i0, type: Scroller, decorators: [{
            type: Component,
            args: [{ selector: 'p-scroller', template: `
        <ng-container *ngIf="!_disabled; else disabledContainer">
            <div
                #element
                [attr.id]="_id"
                [attr.tabindex]="tabindex"
                [ngStyle]="_style"
                [class]="_styleClass"
                [ngClass]="{ 'p-scroller': true, 'p-scroller-inline': inline, 'p-both-scroll': both, 'p-horizontal-scroll': horizontal }"
                (scroll)="onContainerScroll($event)"
            >
                <ng-container *ngIf="contentTemplate; else buildInContent">
                    <ng-container *ngTemplateOutlet="contentTemplate; context: { $implicit: loadedItems, options: getContentOptions() }"></ng-container>
                </ng-container>
                <ng-template #buildInContent>
                    <div #content class="p-scroller-content" [ngClass]="{ 'p-scroller-loading': d_loading }" [ngStyle]="contentStyle">
                        <ng-container *ngFor="let item of loadedItems; let index = index; trackBy: _trackBy || index">
                            <ng-container *ngTemplateOutlet="itemTemplate; context: { $implicit: item, options: getOptions(index) }"></ng-container>
                        </ng-container>
                    </div>
                </ng-template>
                <div *ngIf="_showSpacer" class="p-scroller-spacer" [ngStyle]="spacerStyle"></div>
                <div *ngIf="!loaderDisabled && _showLoader && d_loading" class="p-scroller-loader" [ngClass]="{ 'p-component-overlay': !loaderTemplate }">
                    <ng-container *ngIf="loaderTemplate; else buildInLoader">
                        <ng-container *ngFor="let item of loaderArr; let index = index">
                            <ng-container *ngTemplateOutlet="loaderTemplate; context: { options: getLoaderOptions(index, both && { numCols: _numItemsInViewport.cols }) }"></ng-container>
                        </ng-container>
                    </ng-container>
                    <ng-template #buildInLoader>
                        <ng-container *ngIf="loaderIconTemplate; else buildInLoaderIcon">
                            <ng-container *ngTemplateOutlet="loaderIconTemplate; context: { options: { styleClass: 'p-scroller-loading-icon' } }"></ng-container>
                        </ng-container>
                        <ng-template #buildInLoaderIcon>
                            <i class="p-scroller-loading-icon pi pi-spinner pi-spin"></i>
                        </ng-template>
                    </ng-template>
                </div>
            </div>
        </ng-container>
        <ng-template #disabledContainer>
            <ng-content></ng-content>
            <ng-container *ngIf="contentTemplate">
                <ng-container *ngTemplateOutlet="contentTemplate; context: { $implicit: items, options: { rows: _items, columns: loadedColumns } }"></ng-container>
            </ng-container>
        </ng-template>
    `, changeDetection: ChangeDetectionStrategy.Default, encapsulation: ViewEncapsulation.None, host: {
                        class: 'p-scroller-viewport p-element'
                    }, styles: ["p-scroller{flex:1;outline:0 none}.p-scroller{position:relative;overflow:auto;contain:strict;transform:translateZ(0);will-change:scroll-position;outline:0 none}.p-scroller-content{position:absolute;top:0;left:0;min-height:100%;min-width:100%;will-change:transform}.p-scroller-spacer{position:absolute;top:0;left:0;height:1px;width:1px;transform-origin:0 0;pointer-events:none}.p-scroller-loader{position:sticky;top:0;left:0;width:100%;height:100%}.p-scroller-loader.p-component-overlay{display:flex;align-items:center;justify-content:center}.p-scroller-loading-icon{font-size:2rem}.p-scroller-inline .p-scroller-content{position:static}\n"] }]
        }], ctorParameters: function () { return [{ type: i0.ChangeDetectorRef }, { type: i0.NgZone }]; }, propDecorators: { id: [{
                type: Input
            }], style: [{
                type: Input
            }], styleClass: [{
                type: Input
            }], tabindex: [{
                type: Input
            }], items: [{
                type: Input
            }], itemSize: [{
                type: Input
            }], scrollHeight: [{
                type: Input
            }], scrollWidth: [{
                type: Input
            }], orientation: [{
                type: Input
            }], step: [{
                type: Input
            }], delay: [{
                type: Input
            }], resizeDelay: [{
                type: Input
            }], appendOnly: [{
                type: Input
            }], inline: [{
                type: Input
            }], lazy: [{
                type: Input
            }], disabled: [{
                type: Input
            }], loaderDisabled: [{
                type: Input
            }], columns: [{
                type: Input
            }], showSpacer: [{
                type: Input
            }], showLoader: [{
                type: Input
            }], numToleratedItems: [{
                type: Input
            }], loading: [{
                type: Input
            }], autoSize: [{
                type: Input
            }], trackBy: [{
                type: Input
            }], options: [{
                type: Input
            }], elementViewChild: [{
                type: ViewChild,
                args: ['element']
            }], contentViewChild: [{
                type: ViewChild,
                args: ['content']
            }], templates: [{
                type: ContentChildren,
                args: [PrimeTemplate]
            }], onLazyLoad: [{
                type: Output
            }], onScroll: [{
                type: Output
            }], onScrollIndexChange: [{
                type: Output
            }] } });
export class ScrollerModule {
}
ScrollerModule.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "14.0.7", ngImport: i0, type: ScrollerModule, deps: [], target: i0.ɵɵFactoryTarget.NgModule });
ScrollerModule.ɵmod = i0.ɵɵngDeclareNgModule({ minVersion: "14.0.0", version: "14.0.7", ngImport: i0, type: ScrollerModule, declarations: [Scroller], imports: [CommonModule], exports: [Scroller] });
ScrollerModule.ɵinj = i0.ɵɵngDeclareInjector({ minVersion: "12.0.0", version: "14.0.7", ngImport: i0, type: ScrollerModule, imports: [CommonModule] });
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "14.0.7", ngImport: i0, type: ScrollerModule, decorators: [{
            type: NgModule,
            args: [{
                    imports: [CommonModule],
                    exports: [Scroller],
                    declarations: [Scroller]
                }]
        }] });
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoic2Nyb2xsZXIuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi9zcmMvYXBwL2NvbXBvbmVudHMvc2Nyb2xsZXIvc2Nyb2xsZXIudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUEsT0FBTyxFQUFFLFlBQVksRUFBRSxNQUFNLGlCQUFpQixDQUFDO0FBQy9DLE9BQU8sRUFHSCx1QkFBdUIsRUFFdkIsU0FBUyxFQUNULGVBQWUsRUFFZixZQUFZLEVBQ1osS0FBSyxFQUNMLFFBQVEsRUFJUixNQUFNLEVBSU4sU0FBUyxFQUNULGlCQUFpQixFQUNwQixNQUFNLGVBQWUsQ0FBQztBQUN2QixPQUFPLEVBQUUsYUFBYSxFQUFFLE1BQU0sYUFBYSxDQUFDO0FBQzVDLE9BQU8sRUFBRSxVQUFVLEVBQUUsTUFBTSxhQUFhLENBQUM7OztBQTJGekMsTUFBTSxPQUFPLFFBQVE7SUFvVWpCLFlBQW9CLEVBQXFCLEVBQVUsSUFBWTtRQUEzQyxPQUFFLEdBQUYsRUFBRSxDQUFtQjtRQUFVLFNBQUksR0FBSixJQUFJLENBQVE7UUExSXJELGVBQVUsR0FBc0IsSUFBSSxZQUFZLEVBQUUsQ0FBQztRQUVuRCxhQUFRLEdBQXNCLElBQUksWUFBWSxFQUFFLENBQUM7UUFFakQsd0JBQW1CLEdBQXNCLElBQUksWUFBWSxFQUFFLENBQUM7UUFRdEUsY0FBUyxHQUFXLENBQUMsQ0FBQztRQUl0QixjQUFTLEdBQVEsQ0FBQyxDQUFDO1FBTW5CLGlCQUFZLEdBQVcsVUFBVSxDQUFDO1FBRWxDLFVBQUssR0FBVyxDQUFDLENBQUM7UUFFbEIsV0FBTSxHQUFXLENBQUMsQ0FBQztRQUVuQixpQkFBWSxHQUFXLEVBQUUsQ0FBQztRQUUxQixnQkFBVyxHQUFZLEtBQUssQ0FBQztRQUU3QixZQUFPLEdBQVksS0FBSyxDQUFDO1FBRXpCLFVBQUssR0FBWSxLQUFLLENBQUM7UUFFdkIsY0FBUyxHQUFZLEtBQUssQ0FBQztRQUUzQixvQkFBZSxHQUFZLEtBQUssQ0FBQztRQUlq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bkIsS0FBSztnQkFPTyxRQUFRO3NCQUFwQixLQUFLO2dCQU9PLE9BQU87c0JBQW5CLEtBQUs7Z0JBT08sT0FBTztzQkFBbkIsS0FBSztnQkFXZ0IsZ0JBQWdCO3NCQUFyQyxTQUFTO3VCQUFDLFNBQVM7Z0JBRUUsZ0JBQWdCO3NCQUFyQyxTQUFTO3VCQUFDLFNBQVM7Z0JBRVksU0FBUztzQkFBeEMsZUFBZTt1QkFBQyxhQUFhO2dCQUVwQixVQUFVO3NCQUFuQixNQUFNO2dCQUVHLFFBQVE7c0JBQWpCLE1BQU07Z0JBRUcsbUJBQW1CO3NCQUE1QixNQUFNOztBQWd0QlgsTUFBTSxPQUFPLGNBQWM7OzJHQUFkLGNBQWM7NEdBQWQsY0FBYyxpQkE5NEJkLFFBQVEsYUEwNEJQLFlBQVksYUExNEJiLFFBQVE7NEdBODRCUixjQUFjLFlBSmIsWUFBWTsyRkFJYixjQUFjO2tCQUwxQixRQUFRO21CQUFDO29CQUNOLE9BQU8sRUFBRSxDQUFDLFlBQVksQ0FBQztvQkFDdkIsT0FBTyxFQUFFLENBQUMsUUFBUSxDQUFDO29CQUNuQixZQUFZLEVBQUUsQ0FBQyxRQUFRLENBQUM7aUJBQzNCIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHsgQ29tbW9uTW9kdWxlIH0gZnJvbSAnQGFuZ3VsYXIvY29tbW9uJztcbmltcG9ydCB7XG4gICAgQWZ0ZXJDb250ZW50SW5pdCxcbiAgICBBZnRlclZpZXdDaGVja2VkLFxuICAgIENoYW5nZURldGVjdGlvblN0cmF0ZWd5LFxuICAgIENoYW5nZURldGVjdG9yUmVmLFxuICAgIENvbXBvbmVudCxcbiAgICBDb250ZW50Q2hpbGRyZW4sXG4gICAgRWxlbWVudFJlZixcbiAgICBFdmVudEVtaXR0ZXIsXG4gICAgSW5wdXQsXG4gICAgTmdNb2R1bGUsXG4gICAgTmdab25lLFxuICAgIE9uRGVzdHJveSxcbiAgICBPbkluaXQsXG4gICAgT3V0cHV0LFxuICAgIFF1ZXJ5TGlzdCxcbiAgICBTaW1wbGVDaGFuZ2VzLFxuICAgIFRlbXBsYXRlUmVmLFxuICAgIFZpZXdDaGlsZCxcbiAgICBWaWV3RW5jYXBzdWxhdGlvblxufSBmcm9tICdAYW5ndWxhci9jb3JlJztcbmltcG9ydCB7IFByaW1lVGVtcGxhdGUgfSBmcm9tICdwcmltZW5nL2FwaSc7XG5pbXBvcnQgeyBEb21IYW5kbGVyIH0gZnJvbSAncHJpbWVuZy9kb20nO1xuXG5leHBvcnQgdHlwZSBTY3JvbGxlclRvVHlwZSA9ICd0by1zdGFydCcgfCAndG8tZW5kJyB8IHVuZGVmaW5lZDtcblxuZXhwb3J0IHR5cGUgU2Nyb2xsZXJPcmllbnRhdGlvblR5cGUgPSAndmVydGljYWwnIHwgJ2hvcml6b250YWwnIHwgJ2JvdGgnO1xuXG5leHBvcnQgaW50ZXJmYWNlIFNjcm9sbGVyT3B0aW9ucyB7XG4gICAgaWQ/OiBzdHJpbmcgfCB1bmRlZmluZWQ7XG4gICAgc3R5bGU/OiBhbnk7XG4gICAgc3R5bGVDbGFzcz86IHN0cmluZyB8IHVuZGVmaW5lZDtcbiAgICB0YWJpbmRleD86IG51bWJlciB8IHVuZGVmaW5lZDtcbiAgICBpdGVtcz86IGFueVtdO1xuICAgIGl0ZW1TaXplPzogYW55O1xuICAgIHNjcm9sbEhlaWdodD86IHN0cmluZyB8IHVuZGVmaW5lZDtcbiAgICBzY3JvbGxXaWR0aD86IHN0cmluZyB8IHVuZGVmaW5lZDtcbiAgICBvcmllbnRhdGlvbj86IFNjcm9sbGVyT3JpZW50YXRpb25UeXBlO1xuICAgIHN0ZXA/OiBudW1iZXIgfCB1bmRlZmluZWQ7XG4gICAgZGVsYXk/OiBudW1iZXIgfCB1bmRlZmluZWQ7XG4gICAgcmVzaXplRGVsYXk/OiBudW1iZXIgfCB1bmRlZmluZWQ7XG4gICAgYXBwZW5kT25seT86IGJvb2xlYW47XG4gICAgaW5saW5lPzogYm9vbGVhbjtcbiAgICBsYXp5PzogYm9vbGVhbjtcbiAgICBkaXNhYmxlZD86IGJvb2xlYW47XG4gICAgbG9hZGVyRGlzYWJsZWQ/OiBib29sZWFuO1xuICAgIGNvbHVtbnM/OiBhbnlbXSB8IHVuZGVmaW5lZDtcbiAgICBzaG93U3BhY2VyPzogYm9vbGVhbjtcbiAgICBzaG93TG9hZGVyPzogYm9vbGVhbjtcbiAgICBudW1Ub2xlcmF0ZWRJdGVtcz86IGFueTtcbiAgICBsb2FkaW5nPzogYm9vbGVhbjtcbiAgICBhdXRvU2l6ZT86IGJvb2xlYW47XG4gICAgdHJhY2tCeT86IGFueTtcbiAgICBvbkxhenlMb2FkPzogRnVuY3Rpb24gfCB1bmRlZmluZWQ7XG4gICAgb25TY3JvbGw/OiBGdW5jdGlvbiB8IHVuZGVmaW5lZDtcbiAgICBvblNjcm9sbEluZGV4Q2hhbmdlPzogRnVuY3Rpb24gfCB1bmRlZmluZWQ7XG59XG5cbkBDb21wb25lbnQoe1xuICAgIHNlbGVjdG9yOiAncC1zY3JvbGxlcicsXG4gICAgdGVtcGxhdGU6IGBcbiAgICAgICAgPG5nLWNvbnRhaW5lciAqbmdJZj1cIiFfZGlzYWJsZWQ7IGVsc2UgZGlzYWJsZWRDb250YWluZXJcIj5cbiAgICAgICAgICAgIDxkaXZcbiAgICAgICAgICAgICAgICAjZWxlbWVudFxuICAgICAgICAgICAgICAgIFthdHRyLmlkXT1cIl9pZFwiXG4gICAgICAgICAgICAgICAgW2F0dHIudGFiaW5kZXhdPVwidGFiaW5kZXhcIlxuICAgICAgICAgICAgICAgIFtuZ1N0eWxlXT1cIl9zdHlsZVwiXG4gICAgICAgICAgICAgICAgW2NsYXNzXT1cIl9zdHlsZUNsYXNzXCJcbiAgICAgICAgICAgICAgICBbbmdDbGFzc109XCJ7ICdwLXNjcm9sbGVyJzogdHJ1ZSwgJ3Atc2Nyb2xsZXItaW5saW5lJzogaW5saW5lLCAncC1ib3RoLXNjcm9sbCc6IGJvdGgsICdwLWhvcml6b250YWwtc2Nyb2xsJzogaG9yaXpvbnRhbCB9XCJcbiAgICAgICAgICAgICAgICAoc2Nyb2xsKT1cIm9uQ29udGFpbmVyU2Nyb2xsKCRldmVudClcIlxuICAgICAgICAgICAgPlxuICAgICAgICAgICAgICAgIDxuZy1jb250YWluZXIgKm5nSWY9XCJjb250ZW50VGVtcGxhdGU7IGVsc2UgYnVpbGRJbkNvbnRlbnRcIj5cbiAgICAgICAgICAgICAgICAgICAgPG5nLWNvbnRhaW5lciAqbmdUZW1wbGF0ZU91dGxldD1cImNvbnRlbnRUZW1wbGF0ZTsgY29udGV4dDogeyAkaW1wbGljaXQ6IGxvYWRlZEl0ZW1zLCBvcHRpb25zOiBnZXRDb250ZW50T3B0aW9ucygpIH1cIj48L25nLWNvbnRhaW5lcj5cbiAgICAgICAgICAgICAgICA8L25nLWNvbnRhaW5lcj5cbiAgICAgICAgICAgICAgICA8bmctdGVtcGxhdGUgI2J1aWxkSW5Db250ZW50PlxuICAgICAgICAgICAgICAgICAgICA8ZGl2ICNjb250ZW50IGNsYXNzPVwicC1zY3JvbGxlci1jb250ZW50XCIgW25nQ2xhc3NdPVwieyAncC1zY3JvbGxlci1sb2FkaW5nJzogZF9sb2FkaW5nIH1cIiBbbmdTdHlsZV09XCJjb250ZW50U3R5bGVcIj5cbiAgICAgICAgICAgICAgICAgICAgICAgIDxuZy1jb250YWluZXIgKm5nRm9yPVwibGV0IGl0ZW0gb2YgbG9hZGVkSXRlbXM7IGxldCBpbmRleCA9IGluZGV4OyB0cmFja0J5OiBfdHJhY2tCeSB8fCBpbmRleFwiPlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIDxuZy1jb250YWluZXIgKm5nVGVtcGxhdGVPdXRsZXQ9XCJpdGVtVGVtcGxhdGU7IGNvbnRleHQ6IHsgJGltcGxpY2l0OiBpdGVtLCBvcHRpb25zOiBnZXRPcHRpb25zKGluZGV4KSB9XCI+PC9uZy1jb250YWluZXI+XG4gICAgICAgICAgICAgICAgICAgICAgICA8L25nLWNvbnRhaW5lcj5cbiAgICAgICAgICAgICAgICAgICAgPC9kaXY+XG4gICAgICAgICAgICAgICAgPC9uZy10ZW1wbGF0ZT5cbiAgICAgICAgICAgICAgICA8ZGl2ICpuZ0lmPVwiX3Nob3dTcGFjZXJcIiBjbGFzcz1cInAtc2Nyb2xsZXItc3BhY2VyXCIgW25nU3R5bGVdPVwic3BhY2VyU3R5bGVcIj48L2Rpdj5cbiAgICAgICAgICAgICAgICA8ZGl2ICpuZ0lmPVwiIWxvYWRlckRpc2FibGVkICYmIF9zaG93TG9hZGVyICYmIGRfbG9hZGluZ1wiIGNsYXNzPVwicC1zY3JvbGxlci1sb2FkZXJcIiBbbmdDbGFzc109XCJ7ICdwLWNvbXBvbmVudC1vdmVybGF5JzogIWxvYWRlclRlbXBsYXRlIH1cIj5cbiAgICAgICAgICAgICAgICAgICAgPG5nLWNvbnRhaW5lciAqbmdJZj1cImxvYWRlclRlbXBsYXRlOyBlbHNlIGJ1aWxkSW5Mb2FkZXJcIj5cbiAgICAgICAgICAgICAgICAgICAgICAgIDxuZy1jb250YWluZXIgKm5nRm9yPVwibGV0IGl0ZW0gb2YgbG9hZGVyQXJyOyBsZXQgaW5kZXggPSBpbmRleFwiPlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIDxuZy1jb250YWluZXIgKm5nVGVtcGxhdGVPdXRsZXQ9XCJsb2FkZXJUZW1wbGF0ZTsgY29udGV4dDogeyBvcHRpb25zOiBnZXRMb2FkZXJPcHRpb25zKGluZGV4LCBib3RoICYmIHsgbnVtQ29sczogX251bUl0ZW1zSW5WaWV3cG9ydC5jb2xzIH0pIH1cIj48L25nLWNvbnRhaW5lcj5cbiAgICAgICAgICAgICAgICAgICAgICAgIDwvbmctY29udGFpbmVyPlxuICAgICAgICAgICAgICAgICAgICA8L25nLWNvbnRhaW5lcj5cbiAgICAgICAgICAgICAgICAgICAgPG5nLXRlbXBsYXRlICNidWlsZEluTG9hZGVyPlxuICAgICAgICAgICAgICAgICAgICAgICAgPG5nLWNvbnRhaW5lciAqbmdJZj1cImxvYWRlckljb25UZW1wbGF0ZTsgZWxzZSBidWlsZEluTG9hZGVySWNvblwiPlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIDxuZy1jb250YWluZXIgKm5nVGVtcGxhdGVPdXRsZXQ9XCJsb2FkZXJJY29uVGVtcGxhdGU7IGNvbnRleHQ6IHsgb3B0aW9uczogeyBzdHlsZUNsYXNzOiAncC1zY3JvbGxlci1sb2FkaW5nLWljb24nIH0gfVwiPjwvbmctY29udGFpbmVyPlxuICAgICAgICAgICAgICAgICAgICAgICAgPC9uZy1jb250YWluZXI+XG4gICAgICAgICAgICAgICAgICAgICAgICA8bmctdGVtcGxhdGUgI2J1aWxkSW5Mb2FkZXJJY29uPlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIDxpIGNsYXNzPVwicC1zY3JvbGxlci1sb2FkaW5nLWljb24gcGkgcGktc3Bpbm5lciBwaS1zcGluXCI+PC9pPlxuICAgICAgICAgICAgICAgICAgICAgICAgPC9uZy10ZW1wbGF0ZT5cbiAgICAgICAgICAgICAgICAgICAgPC9uZy10ZW1wbGF0ZT5cbiAgICAgICAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgICAgIDwvZGl2PlxuICAgICAgICA8L25nLWNvbnRhaW5lcj5cbiAgICAgICAgPG5nLXRlbXBsYXRlICNkaXNhYmxlZENvbnRhaW5lcj5cbiAgICAgICAgICAgIDxuZy1jb250ZW50PjwvbmctY29udGVudD5cbiAgICAgICAgICAgIDxuZy1jb250YWluZXIgKm5nSWY9XCJjb250ZW50VGVtcGxhdGVcIj5cbiAgICAgICAgICAgICAgICA8bmctY29udGFpbmVyICpuZ1RlbXBsYXRlT3V0bGV0PVwiY29udGVudFRlbXBsYXRlOyBjb250ZXh0OiB7ICRpbXBsaWNpdDogaXRlbXMsIG9wdGlvbnM6IHsgcm93czogX2l0ZW1zLCBjb2x1bW5zOiBsb2FkZWRDb2x1bW5zIH0gfVwiPjwvbmctY29udGFpbmVyPlxuICAgICAgICAgICAgPC9uZy1jb250YWluZXI+XG4gICAgICAgIDwvbmctdGVtcGxhdGU+XG4gICAgYCxcbiAgICBjaGFuZ2VEZXRlY3Rpb246IENoYW5nZURldGVjdGlvblN0cmF0ZWd5LkRlZmF1bHQsXG4gICAgZW5jYXBzdWxhdGlvbjogVmlld0VuY2Fwc3VsYXRpb24uTm9uZSxcbiAgICBzdHlsZVVybHM6IFsnLi9zY3JvbGxlci5jc3MnXSxcbiAgICBob3N0OiB7XG4gICAgICAgIGNsYXNzOiAncC1zY3JvbGxlci12aWV3cG9ydCBwLWVsZW1lbnQnXG4gICAgfVxufSlcbmV4cG9ydCBjbGFzcyBTY3JvbGxlciBpbXBsZW1lbnRzIE9uSW5pdCwgQWZ0ZXJDb250ZW50SW5pdCwgQWZ0ZXJWaWV3Q2hlY2tlZCwgT25EZXN0cm95IHtcbiAgICBASW5wdXQoKSBnZXQgaWQoKSB7XG4gICAgICAgIHJldHVybiB0aGlzLl9pZDtcbiAgICB9XG4gICAgc2V0IGlkKHZhbDogc3RyaW5nKSB7XG4gICAgICAgIHRoaXMuX2lkID0gdmFsO1xuICAgIH1cblxuICAgIEBJbnB1dCgpIGdldCBzdHlsZSgpIHtcbiAgICAgICAgcmV0dXJuIHRoaXMuX3N0eWxlO1xuICAgIH1cbiAgICBzZXQgc3R5bGUodmFsOiBhbnkpIHtcbiAgICAgICAgdGhpcy5fc3R5bGUgPSB2YWw7XG4gICAgfVxuXG4gICAgQElucHV0KCkgZ2V0IHN0eWxlQ2xhc3MoKSB7XG4gICAgICAgIHJldHVybiB0aGlzLl9zdHlsZUNsYXNzO1xuICAgIH1cbiAgICBzZXQgc3R5bGVDbGFzcyh2YWw6IHN0cmluZykge1xuICAgICAgICB0aGlzLl9zdHlsZUNsYXNzID0gdmFsO1xuICAgIH1cblxuICAgIEBJbnB1dCgpIGdldCB0YWJpbmRleCgpIHtcbiAgICAgICAgcmV0dXJuIHRoaXMuX3RhYmluZGV4O1xuICAgIH1cbiAgICBzZXQgdGFiaW5kZXgodmFsOiBudW1iZXIpIHtcbiAgICAgICAgdGhpcy5fdGFiaW5kZXggPSB2YWw7XG4gICAgfVxuXG4gICAgQElucHV0KCkgZ2V0IGl0ZW1zKCkge1xuICAgICAgICByZXR1cm4gdGhpcy5faXRlbXM7XG4gICAgfVxuICAgIHNldCBpdGVtcyh2YWw6IGFueVtdKSB7XG4gICAgICAgIHRoaXMuX2l0ZW1zID0gdmFsO1xuICAgIH1cblxuICAgIEBJbnB1dCgpIGdldCBpdGVtU2l6ZSgpIHtcbiAgICAgICAgcmV0dXJuIHRoaXMuX2l0ZW1TaXplO1xuICAgIH1cbiAgICBzZXQgaXRlbVNpemUodmFsOiBhbnkpIHtcbiAgICAgICAgdGhpcy5faXRlbVNpemUgPSB2YWw7XG4gICAgfVxuXG4gICAgQElucHV0KCkgZ2V0IHNjcm9sbEhlaWdodCgpIHtcbiAgICAgICAgcmV0dXJuIHRoaXMuX3Njcm9sbEhlaWdodDtcbiAgICB9XG4gICAgc2V0IHNjcm9sbEhlaWdodCh2YWw6IHN0cmluZykge1xuICAgICAgICB0aGlzLl9zY3JvbGxIZWlnaHQgPSB2YWw7XG4gICAgfVxuXG4gICAgQElucHV0KCkgZ2V0IHNjcm9sbFdpZHRoKCkge1xuICAgICAgICByZXR1cm4gdGhpcy5fc2Nyb2xsV2lkdGg7XG4gICAgfVxuICAgIHNldCBzY3JvbGxXaWR0aCh2YWw6IHN0cmluZykge1xuICAgICAgICB0aGlzLl9zY3JvbGxXaWR0aCA9IHZhbDtcbiAgICB9XG5cbiAgICBASW5wdXQoKSBnZXQgb3JpZW50YXRpb24oKSB7XG4gICAgICAgIHJldHVybiB0aGlzLl9vcmllbnRhdGlvbjtcbiAgICB9XG4gICAgc2V0IG9yaWVudGF0aW9uKHZhbDogc3RyaW5nKSB7XG4gICAgICAgIHRoaXMuX29yaWVudGF0aW9uID0gdmFsO1xuICAgIH1cblxuICAgIEBJbnB1dCgpIGdldCBzdGVwKCkge1xuICAgICAgICByZXR1cm4gdGhpcy5fc3RlcDtcbiAgICB9XG4gICAgc2V0IHN0ZXAodmFsOiBudW1iZXIpIHtcbiAgICAgICAgdGhpcy5fc3RlcCA9IHZhbDtcbiAgICB9XG5cbiAgICBASW5wdXQoKSBnZXQgZGVsYXkoKSB7XG4gICAgICAgIHJldHVybiB0aGlzLl9kZWxheTtcbiAgICB9XG4gICAgc2V0IGRlbGF5KHZhbDogbnVtYmVyKSB7XG4gICAgICAgIHRoaXMuX2RlbGF5ID0gdmFsO1xuICAgIH1cblxuICAgIEBJbnB1dCgpIGdldCByZXNpemVEZWxheSgpIHtcbiAgICAgICAgcmV0dXJuIHRoaXMuX3Jlc2l6ZURlbGF5O1xuICAgIH1cbiAgICBzZXQgcmVzaXplRGVsYXkodmFsOiBudW1iZXIpIHtcbiAgICAgICAgdGhpcy5fcmVzaXplRGVsYXkgPSB2YWw7XG4gICAgfVxuXG4gICAgQElucHV0KCkgZ2V0IGFwcGVuZE9ubHkoKSB7XG4gICAgICAgIHJldHVybiB0aGlzLl9hcHBlbmRPbmx5O1xuICAgIH1cbiAgICBzZXQgYXBwZW5kT25seSh2YWw6IGJvb2xlYW4pIHtcbiAgICAgICAgdGhpcy5fYXBwZW5kT25seSA9IHZhbDtcbiAgICB9XG5cbiAgICBASW5wdXQoKSBnZXQgaW5saW5lKCkge1xuICAgICAgICByZXR1cm4gdGhpcy5faW5saW5lO1xuICAgIH1cbiAgICBzZXQgaW5saW5lKHZhbDogYm9vbGVhbikge1xuICAgICAgICB0aGlzLl9pbmxpbmUgPSB2YWw7XG4gICAgfVxuXG4gICAgQElucHV0KCkgZ2V0IGxhenkoKSB7XG4gICAgICAgIHJldHVybiB0aGlzLl9sYXp5O1xuICAgIH1cbiAgICBzZXQgbGF6eSh2YWw6IGJvb2xlYW4pIHtcbiAgICAgICAgdGhpcy5fbGF6eSA9IHZhbDtcbiAgICB9XG5cbiAgICBASW5wdXQoKSBnZXQgZGlzYWJsZWQoKSB7XG4gICAgICAgIHJldHVybiB0aGlzLl9kaXNhYmxlZDtcbiAgICB9XG4gICAgc2V0IGRpc2FibGVkKHZhbDogYm9vbGVhbikge1xuICAgICAgICB0aGlzLl9kaXNhYmxlZCA9IHZhbDtcbiAgICB9XG5cbiAgICBASW5wdXQoKSBnZXQgbG9hZGVyRGlzYWJsZWQoKSB7XG4gICAgICAgIHJldHVybiB0aGlzLl9sb2FkZXJEaXNhYmxlZDtcbiAgICB9XG4gICAgc2V0IGxvYWRlckRpc2FibGVkKHZhbDogYm9vbGVhbikge1xuICAgICAgICB0aGlzLl9sb2FkZXJEaXNhYmxlZCA9IHZhbDtcbiAgICB9XG5cbiAgICBASW5wdXQoKSBnZXQgY29sdW1ucygpIHtcbiAgICAgICAgcmV0dXJuIHRoaXMuX2NvbHVtbnM7XG4gICAgfVxuICAgIHNldCBjb2x1bW5zKHZhbDogYW55W10pIHtcbiAgICAgICAgdGhpcy5fY29sdW1ucyA9IHZhbDtcbiAgICB9XG5cbiAgICBASW5wdXQoKSBnZXQgc2hvd1NwYWNlcigpIHtcbiAgICAgICAgcmV0dXJuIHRoaXMuX3Nob3dTcGFjZXI7XG4gICAgfVxuICAgIHNldCBzaG93U3BhY2VyKHZhbDogYm9vbGVhbikge1xuICAgICAgICB0aGlzLl9zaG93U3BhY2VyID0gdmFsO1xuICAgIH1cblxuICAgIEBJbnB1dCgpIGdldCBzaG93TG9hZGVyKCkge1xuICAgICAgICByZXR1cm4gdGhpcy5fc2hvd0xvYWRlcjtcbiAgICB9XG4gICAgc2V0IHNob3dMb2FkZXIodmFsOiBib29sZWFuKSB7XG4gICAgICAgIHRoaXMuX3Nob3dMb2FkZXIgPSB2YWw7XG4gICAgfVxuXG4gICAgQElucHV0KCkgZ2V0IG51bVRvbGVyYXRlZEl0ZW1zKCkge1xuICAgICAgICByZXR1cm4gdGhpcy5fbnVtVG9sZXJhdGVkSXRlbXM7XG4gICAgfVxuICAgIHNldCBudW1Ub2xlcmF0ZWRJdGVtcyh2YWw6IG51bWJlcikge1xuICAgICAgICB0aGlzLl9udW1Ub2xlcmF0ZWRJdGVtcyA9IHZhbDtcbiAgICB9XG5cbiAgICBASW5wdXQoKSBnZXQgbG9hZGluZygpIHtcbiAgICAgICAgcmV0dXJuIHRoaXMuX2xvYWRpbmc7XG4gICAgfVxuICAgIHNldCBsb2FkaW5nKHZhbDogYm9vbGVhbikge1xuICAgICAgICB0aGlzLl9sb2FkaW5nID0gdmFsO1xuICAgIH1cblxuICAgIEBJbnB1dCgpIGdldCBhdXRvU2l6ZSgpIHtcbiAgICAgICAgcmV0dXJuIHRoaXMuX2F1dG9TaXplO1xuICAgIH1cbiAgICBzZXQgYXV0b1NpemUodmFsOiBib29sZWFuKSB7XG4gICAgICAgIHRoaXMuX2F1dG9TaXplID0gdmFsO1xuICAgIH1cblxuICAgIEBJbnB1dCgpIGdldCB0cmFja0J5KCkge1xuICAgICAgICByZXR1cm4gdGhpcy5fdHJhY2tCeTtcbiAgICB9XG4gICAgc2V0IHRyYWNrQnkodmFsOiBhbnkpIHtcbiAgICAgICAgdGhpcy5fdHJhY2tCeSA9IHZhbDtcbiAgICB9XG5cbiAgICBASW5wdXQoKSBnZXQgb3B0aW9ucygpIHtcbiAgICAgICAgcmV0dXJuIHRoaXMuX29wdGlvbnM7XG4gICAgfVxuICAgIHNldCBvcHRpb25zKHZhbDogU2Nyb2xsZXJPcHRpb25zKSB7XG4gICAgICAgIHRoaXMuX29wdGlvbnMgPSB2YWw7XG5cbiAgICAgICAgaWYgKHZhbCAmJiB0eXBlb2YgdmFsID09PSAnb2JqZWN0Jykge1xuICAgICAgICAgICAgT2JqZWN0LmVudHJpZXModmFsKS5mb3JFYWNoKChbaywgdl0pID0+IHRoaXNbYF8ke2t9YF0gIT09IHYgJiYgKHRoaXNbYF8ke2t9YF0gPSB2KSk7XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICBAVmlld0NoaWxkKCdlbGVtZW50JykgZWxlbWVudFZpZXdDaGlsZDogRWxlbWVudFJlZjtcblxuICAgIEBWaWV3Q2hpbGQoJ2NvbnRlbnQnKSBjb250ZW50Vmlld0NoaWxkOiBFbGVtZW50UmVmO1xuXG4gICAgQENvbnRlbnRDaGlsZHJlbihQcmltZVRlbXBsYXRlKSB0ZW1wbGF0ZXM6IFF1ZXJ5TGlzdDxhbnk+O1xuXG4gICAgQE91dHB1dCgpIG9uTGF6eUxvYWQ6IEV2ZW50RW1pdHRlcjxhbnk+ID0gbmV3IEV2ZW50RW1pdHRlcigpO1xuXG4gICAgQE91dHB1dCgpIG9uU2Nyb2xsOiBFdmVudEVtaXR0ZXI8YW55PiA9IG5ldyBFdmVudEVtaXR0ZXIoKTtcblxuICAgIEBPdXRwdXQoKSBvblNjcm9sbEluZGV4Q2hhbmdlOiBFdmVudEVtaXR0ZXI8YW55PiA9IG5ldyBFdmVudEVtaXR0ZXIoKTtcblxuICAgIF9pZDogc3RyaW5nO1xuXG4gICAgX3N0eWxlOiBhbnk7XG5cbiAgICBfc3R5bGVDbGFzczogc3RyaW5nO1xuXG4gICAgX3RhYmluZGV4OiBudW1iZXIgPSAwO1xuXG4gICAgX2l0ZW1zOiBhbnlbXTtcblxuICAgIF9pdGVtU2l6ZTogYW55ID0gMDtcblxuICAgIF9zY3JvbGxIZWlnaHQ6IHN0cmluZztcblxuICAgIF9zY3JvbGxXaWR0aDogc3RyaW5nO1xuXG4gICAgX29yaWVudGF0aW9uOiBzdHJpbmcgPSAndmVydGljYWwnO1xuXG4gICAgX3N0ZXA6IG51bWJlciA9IDA7XG5cbiAgICBfZGVsYXk6IG51bWJlciA9IDA7XG5cbiAgICBfcmVzaXplRGVsYXk6IG51bWJlciA9IDEwO1xuXG4gICAgX2FwcGVuZE9ubHk6IGJvb2xlYW4gPSBmYWxzZTtcblxuICAgIF9pbmxpbmU6IGJvb2xlYW4gPSBmYWxzZTtcblxuICAgIF9sYXp5OiBib29sZWFuID0gZmFsc2U7XG5cbiAgICBfZGlzYWJsZWQ6IGJvb2xlYW4gPSBmYWxzZTtcblxuICAgIF9sb2FkZXJEaXNhYmxlZDogYm9vbGVhbiA9IGZhbHNlO1xuXG4gICAgX2NvbHVtbnM6IGFueVtdO1xuXG4gICAgX3Nob3dTcGFjZXI6IGJvb2xlYW4gPSB0cnVlO1xuXG4gICAgX3Nob3dMb2FkZXI6IGJvb2xlYW4gPSBmYWxzZTtcblxuICAgIF9udW1Ub2xlcmF0ZWRJdGVtczogYW55O1xuXG4gICAgX2xvYWRpbmc6IGJvb2xlYW47XG5cbiAgICBfYXV0b1NpemU6IGJvb2xlYW4gPSBmYWxzZTtcblxuICAgIF90cmFja0J5OiBhbnk7XG5cbiAgICBfb3B0aW9uczogU2Nyb2xsZXJPcHRpb25zO1xuXG4gICAgZF9sb2FkaW5nOiBib29sZWFuID0gZmFsc2U7XG5cbiAgICBkX251bVRvbGVyYXRlZEl0ZW1zOiBhbnk7XG5cbiAgICBjb250ZW50RWw6IGFueTtcblxuICAgIGNvbnRlbnRUZW1wbGF0ZTogVGVtcGxhdGVSZWY8YW55PjtcblxuICAgIGl0ZW1UZW1wbGF0ZTogVGVtcGxhdGVSZWY8YW55PjtcblxuICAgIGxvYWRlclRlbXBsYXRlOiBUZW1wbGF0ZVJlZjxhbnk+O1xuXG4gICAgbG9hZGVySWNvblRlbXBsYXRlOiBUZW1wbGF0ZVJlZjxhbnk+O1xuXG4gICAgZmlyc3Q6IGFueSA9IDA7XG5cbiAgICBsYXN0OiBhbnkgPSAwO1xuXG4gICAgcGFnZTogbnVtYmVyID0gMDtcblxuICAgIG51bUl0ZW1zSW5WaWV3cG9ydDogYW55ID0gMDtcblxuICAgIGxhc3RTY3JvbGxQb3M6IGFueSA9IDA7XG5cbiAgICBsYXp5TG9hZFN0YXRlOiBhbnkgPSB7fTtcblxuICAgIGxvYWRlckFycjogYW55W10gPSBbXTtcblxuICAgIHNwYWNlclN0eWxlOiBhbnkgPSB7fTtcblxuICAgIGNvbnRlbnRTdHlsZTogYW55ID0ge307XG5cbiAgICBzY3JvbGxUaW1lb3V0OiBhbnk7XG5cbiAgICByZXNpemVUaW1lb3V0OiBhbnk7XG5cbiAgICBpbml0aWFsaXplZDogYm9vbGVhbiA9IGZhbHNlO1xuXG4gICAgd2luZG93UmVzaXplTGlzdGVuZXI6IGFueTtcblxuICAgIGRlZmF1bHRXaWR0aDogbnVtYmVyO1xuXG4gICAgZGVmYXVsdEhlaWdodDogbnVtYmVyO1xuXG4gICAgZ2V0IHZlcnRpY2FsKCkge1xuICAgICAgICByZXR1cm4gdGhpcy5fb3JpZW50YXRpb24gPT09ICd2ZXJ0aWNhbCc7XG4gICAgfVxuXG4gICAgZ2V0IGhvcml6b250YWwoKSB7XG4gICAgICAgIHJldHVybiB0aGlzLl9vcmllbnRhdGlvbiA9PT0gJ2hvcml6b250YWwnO1xuICAgIH1cblxuICAgIGdldCBib3RoKCkge1xuICAgICAgICByZXR1cm4gdGhpcy5fb3JpZW50YXRpb24gPT09ICdib3RoJztcbiAgICB9XG5cbiAgICBnZXQgbG9hZGVkSXRlbXMoKSB7XG4gICAgICAgIGlmICh0aGlzLl9pdGVtcyAmJiAhdGhpcy5kX2xvYWRpbmcpIHtcbiAgICAgICAgICAgIGlmICh0aGlzLmJvdGgpIHJldHVybiB0aGlzLl9pdGVtcy5zbGljZSh0aGlzLl9hcHBlbmRPbmx5ID8gMCA6IHRoaXMuZmlyc3Qucm93cywgdGhpcy5sYXN0LnJvd3MpLm1hcCgoaXRlbSkgPT4gKHRoaXMuX2NvbHVtbnMgPyBpdGVtIDogaXRlbS5zbGljZSh0aGlzLl9hcHBlbmRPbmx5ID8gMCA6IHRoaXMuZmlyc3QuY29scywgdGhpcy5sYXN0LmNvbHMpKSk7XG4gICAgICAgICAgICBlbHNlIGlmICh0aGlzLmhvcml6b250YWwgJiYgdGhpcy5fY29sdW1ucykgcmV0dXJuIHRoaXMuX2l0ZW1zO1xuICAgICAgICAgICAgZWxzZSByZXR1cm4gdGhpcy5faXRlbXMuc2xpY2UodGhpcy5fYXBwZW5kT25seSA/IDAgOiB0aGlzLmZpcnN0LCB0aGlzLmxhc3QpO1xuICAgICAgICB9XG5cbiAgICAgICAgcmV0dXJuIFtdO1xuICAgIH1cblxuICAgIGdldCBsb2FkZWRSb3dzKCkge1xuICAgICAgICByZXR1cm4gdGhpcy5kX2xvYWRpbmcgPyAodGhpcy5fbG9hZGVyRGlzYWJsZWQgPyB0aGlzLmxvYWRlckFyciA6IFtdKSA6IHRoaXMubG9hZGVkSXRlbXM7XG4gICAgfVxuXG4gICAgZ2V0IGxvYWRlZENvbHVtbnMoKSB7XG4gICAgICAgIGlmICh0aGlzLl9jb2x1bW5zICYmICh0aGlzLmJvdGggfHwgdGhpcy5ob3Jpem9udGFsKSkge1xuICAgICAgICAgICAgcmV0dXJuIHRoaXMuZF9sb2FkaW5nICYmIHRoaXMuX2xvYWRlckRpc2FibGVkID8gKHRoaXMuYm90aCA/IHRoaXMubG9hZGVyQXJyWzBdIDogdGhpcy5sb2FkZXJBcnIpIDogdGhpcy5fY29sdW1ucy5zbGljZSh0aGlzLmJvdGggPyB0aGlzLmZpcnN0LmNvbHMgOiB0aGlzLmZpcnN0LCB0aGlzLmJvdGggPyB0aGlzLmxhc3QuY29scyA6IHRoaXMubGFzdCk7XG4gICAgICAgIH1cblxuICAgICAgICByZXR1cm4gdGhpcy5fY29sdW1ucztcbiAgICB9XG5cbiAgICBnZXQgaXNQYWdlQ2hhbmdlZCgpIHtcbiAgICAgICAgcmV0dXJuIHRoaXMuX3N0ZXAgPyB0aGlzLnBhZ2UgIT09IHRoaXMuZ2V0UGFnZUJ5Rmlyc3QoKSA6IHRydWU7XG4gICAgfVxuXG4gICAgY29uc3RydWN0b3IocHJpdmF0ZSBjZDogQ2hhbmdlRGV0ZWN0b3JSZWYsIHByaXZhdGUgem9uZTogTmdab25lKSB7fVxuXG4gICAgbmdPbkluaXQoKSB7XG4gICAgICAgIHRoaXMuc2V0SW5pdGlhbFN0YXRlKCk7XG4gICAgfVxuXG4gICAgbmdPbkNoYW5nZXMoc2ltcGxlQ2hhbmdlczogU2ltcGxlQ2hhbmdlcykge1xuICAgICAgICBsZXQgaXNMb2FkaW5nQ2hhbmdlZCA9IGZhbHNlO1xuXG4gICAgICAgIGlmIChzaW1wbGVDaGFuZ2VzLmxvYWRpbmcpIHtcbiAgICAgICAgICAgIGNvbnN0IHsgcHJldmlvdXNWYWx1ZSwgY3VycmVudFZhbHVlIH0gPSBzaW1wbGVDaGFuZ2VzLmxvYWRpbmc7XG5cbiAgICAgICAgICAgIGlmICh0aGlzLmxhenkgJiYgcHJldmlvdXNWYWx1ZSAhPT0gY3VycmVudFZhbHVlICYmIGN1cnJlbnRWYWx1ZSAhPT0gdGhpcy5kX2xvYWRpbmcpIHtcbiAgICAgICAgICAgICAgICB0aGlzLmRfbG9hZGluZyA9IGN1cnJlbnRWYWx1ZTtcbiAgICAgICAgICAgICAgICBpc0xvYWRpbmdDaGFuZ2VkID0gdHJ1ZTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuXG4gICAgICAgIGlmIChzaW1wbGVDaGFuZ2VzLm9yaWVudGF0aW9uKSB7XG4gICAgICAgICAgICB0aGlzLmxhc3RTY3JvbGxQb3MgPSB0aGlzLmJvdGggPyB7IHRvcDogMCwgbGVmdDogMCB9IDogMDtcbiAgICAgICAgfVxuXG4gICAgICAgIGlmIChzaW1wbGVDaGFuZ2VzLm51bVRvbGVyYXRlZEl0ZW1zKSB7XG4gICAgICAgICAgICBjb25zdCB7IHByZXZpb3VzVmFsdWUsIGN1cnJlbnRWYWx1ZSB9ID0gc2ltcGxlQ2hhbmdlcy5udW1Ub2xlcmF0ZWRJdGVtcztcblxuICAgICAgICAgICAgaWYgKHByZXZpb3VzVmFsdWUgIT09IGN1cnJlbnRWYWx1ZSAmJiBjdXJyZW50VmFsdWUgIT09IHRoaXMuZF9udW1Ub2xlcmF0ZWRJdGVtcykge1xuICAgICAgICAgICAgICAgIHRoaXMuZF9udW1Ub2xlcmF0ZWRJdGVtcyA9IGN1cnJlbnRWYWx1ZTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuXG4gICAgICAgIGlmIChzaW1wbGVDaGFuZ2VzLm9wdGlvbnMpIHtcbiAgICAgICAgICAgIGNvbnN0IHsgcHJldmlvdXNWYWx1ZSwgY3VycmVudFZhbHVlIH0gPSBzaW1wbGVDaGFuZ2VzLm9wdGlvbnM7XG5cbiAgICAgICAgICAgIGlmICh0aGlzLmxhenkgJiYgcHJldmlvdXNWYWx1ZT8ubG9hZGluZyAhPT0gY3VycmVudFZhbHVlPy5sb2FkaW5nICYmIGN1cnJlbnRWYWx1ZT8ubG9hZGluZyAhPT0gdGhpcy5kX2xvYWRpbmcpIHtcbiAgICAgICAgICAgICAgICB0aGlzLmRfbG9hZGluZyA9IGN1cnJlbnRWYWx1ZS5sb2FkaW5nO1xuICAgICAgICAgICAgICAgIGlzTG9hZGluZ0NoYW5nZWQgPSB0cnVlO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICBpZiAocHJldmlvdXNWYWx1ZT8ubnVtVG9sZXJhdGVkSXRlbXMgIT09IGN1cnJlbnRWYWx1ZT8ubnVtVG9sZXJhdGVkSXRlbXMgJiYgY3VycmVudFZhbHVlPy5udW1Ub2xlcmF0ZWRJdGVtcyAhPT0gdGhpcy5kX251bVRvbGVyYXRlZEl0ZW1zKSB7XG4gICAgICAgICAgICAgICAgdGhpcy5kX251bVRvbGVyYXRlZEl0ZW1zID0gY3VycmVudFZhbHVlLm51bVRvbGVyYXRlZEl0ZW1zO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG5cbiAgICAgICAgaWYgKHRoaXMuaW5pdGlhbGl6ZWQpIHtcbiAgICAgICAgICAgIGNvbnN0IGlzQ2hhbmdlZCA9ICFpc0xvYWRpbmdDaGFuZ2VkICYmIChzaW1wbGVDaGFuZ2VzLml0ZW1zPy5wcmV2aW91c1ZhbHVlPy5sZW5ndGggIT09IHNpbXBsZUNoYW5nZXMuaXRlbXM/LmN1cnJlbnRWYWx1ZT8ubGVuZ3RoIHx8IHNpbXBsZUNoYW5nZXMuaXRlbVNpemUgfHwgc2ltcGxlQ2hhbmdlcy5zY3JvbGxIZWlnaHQgfHwgc2ltcGxlQ2hhbmdlcy5zY3JvbGxXaWR0aCk7XG4gICAgICAgICAgICBpc0NoYW5nZWQgJiYgdGhpcy5pbml0KCk7XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICBuZ0FmdGVyQ29udGVudEluaXQoKSB7XG4gICAgICAgIHRoaXMudGVtcGxhdGVzLmZvckVhY2goKGl0ZW0pID0+IHtcbiAgICAgICAgICAgIHN3aXRjaCAoaXRlbS5nZXRUeXBlKCkpIHtcbiAgICAgICAgICAgICAgICBjYXNlICdjb250ZW50JzpcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5jb250ZW50VGVtcGxhdGUgPSBpdGVtLnRlbXBsYXRlO1xuICAgICAgICAgICAgICAgICAgICBicmVhaztcblxuICAgICAgICAgICAgICAgIGNhc2UgJ2l0ZW0nOlxuICAgICAgICAgICAgICAgICAgICB0aGlzLml0ZW1UZW1wbGF0ZSA9IGl0ZW0udGVtcGxhdGU7XG4gICAgICAgICAgICAgICAgICAgIGJyZWFrO1xuXG4gICAgICAgICAgICAgICAgY2FzZSAnbG9hZGVyJzpcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5sb2FkZXJUZW1wbGF0ZSA9IGl0ZW0udGVtcGxhdGU7XG4gICAgICAgICAgICAgICAgICAgIGJyZWFrO1xuXG4gICAgICAgICAgICAgICAgY2FzZSAnbG9hZGVyaWNvbic6XG4gICAgICAgICAgICAgICAgICAgIHRoaXMubG9hZGVySWNvblRlbXBsYXRlID0gaXRlbS50ZW1wbGF0ZTtcbiAgICAgICAgICAgICAgICAgICAgYnJlYWs7XG5cbiAgICAgICAgICAgICAgICBkZWZhdWx0OlxuICAgICAgICAgICAgICAgICAgICB0aGlzLml0ZW1UZW1wbGF0ZSA9IGl0ZW0udGVtcGxhdGU7XG4gICAgICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgfVxuICAgICAgICB9KTtcbiAgICB9XG5cbiAgICBuZ0FmdGVyVmlld0luaXQoKSB7XG4gICAgICAgIHRoaXMudmlld0luaXQoKTtcbiAgICB9XG5cbiAgICBuZ0FmdGVyVmlld0NoZWNrZWQoKSB7XG4gICAgICAgIGlmICghdGhpcy5pbml0aWFsaXplZCkge1xuICAgICAgICAgICAgdGhpcy52aWV3SW5pdCgpO1xuICAgICAgICB9XG5cbiAgICAgICAgdGhpcy5jYWxjdWxhdGVBdXRvU2l6ZSgpO1xuICAgIH1cblxuICAgIG5nT25EZXN0cm95KCkge1xuICAgICAgICB0aGlzLnVuYmluZFJlc2l6ZUxpc3RlbmVyKCk7XG5cbiAgICAgICAgdGhpcy5jb250ZW50RWwgPSBudWxsO1xuICAgICAgICB0aGlzLmluaXRpYWxpemVkID0gZmFsc2U7XG4gICAgfVxuXG4gICAgdmlld0luaXQoKSB7XG4gICAgICAgIGlmIChEb21IYW5kbGVyLmlzVmlzaWJsZSh0aGlzLmVsZW1lbnRWaWV3Q2hpbGQ/Lm5hdGl2ZUVsZW1lbnQpKSB7XG4gICAgICAgICAgICB0aGlzLnNldEluaXRpYWxTdGF0ZSgpO1xuICAgICAgICAgICAgdGhpcy5zZXRDb250ZW50RWwodGhpcy5jb250ZW50RWwpO1xuICAgICAgICAgICAgdGhpcy5pbml0KCk7XG5cbiAgICAgICAgICAgIHRoaXMuZGVmYXVsdFdpZHRoID0gRG9tSGFuZGxlci5nZXRXaWR0aCh0aGlzLmVsZW1lbnRWaWV3Q2hpbGQubmF0aXZlRWxlbWVudCk7XG4gICAgICAgICAgICB0aGlzLmRlZmF1bHRIZWlnaHQgPSBEb21IYW5kbGVyLmdldEhlaWdodCh0aGlzLmVsZW1lbnRWaWV3Q2hpbGQubmF0aXZlRWxlbWVudCk7XG4gICAgICAgICAgICB0aGlzLmluaXRpYWxpemVkID0gdHJ1ZTtcbiAgICAgICAgfVxuICAgIH1cblxuICAgIGluaXQoKSB7XG4gICAgICAgIGlmICghdGhpcy5fZGlzYWJsZWQpIHtcbiAgICAgICAgICAgIHRoaXMuc2V0U2l6ZSgpO1xuICAgICAgICAgICAgdGhpcy5jYWxjdWxhdGVPcHRpb25zKCk7XG4gICAgICAgICAgICB0aGlzLnNldFNwYWNlclNpemUoKTtcbiAgICAgICAgICAgIHRoaXMuYmluZFJlc2l6ZUxpc3RlbmVyKCk7XG5cbiAgICAgICAgICAgIHRoaXMuY2QuZGV0ZWN0Q2hhbmdlcygpO1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgc2V0Q29udGVudEVsKGVsPzogSFRNTEVsZW1lbnQpIHtcbiAgICAgICAgdGhpcy5jb250ZW50RWwgPSBlbCB8fCB0aGlzLmNvbnRlbnRWaWV3Q2hpbGQ/Lm5hdGl2ZUVsZW1lbnQgfHwgRG9tSGFuZGxlci5maW5kU2luZ2xlKHRoaXMuZWxlbWVudFZpZXdDaGlsZD8ubmF0aXZlRWxlbWVudCwgJy5wLXNjcm9sbGVyLWNvbnRlbnQnKTtcbiAgICB9XG5cbiAgICBzZXRJbml0aWFsU3RhdGUoKSB7XG4gICAgICAgIHRoaXMuZmlyc3QgPSB0aGlzLmJvdGggPyB7IHJvd3M6IDAsIGNvbHM6IDAgfSA6IDA7XG4gICAgICAgIHRoaXMubGFzdCA9IHRoaXMuYm90aCA/IHsgcm93czogMCwgY29sczogMCB9IDogMDtcbiAgICAgICAgdGhpcy5udW1JdGVtc0luVmlld3BvcnQgPSB0aGlzLmJvdGggPyB7IHJvd3M6IDAsIGNvbHM6IDAgfSA6IDA7XG4gICAgICAgIHRoaXMubGFzdFNjcm9sbFBvcyA9IHRoaXMuYm90aCA/IHsgdG9wOiAwLCBsZWZ0OiAwIH0gOiAwO1xuICAgICAgICB0aGlzLmRfbG9hZGluZyA9IHRoaXMuX2xvYWRpbmcgfHwgZmFsc2U7XG4gICAgICAgIHRoaXMuZF9udW1Ub2xlcmF0ZWRJdGVtcyA9IHRoaXMuX251bVRvbGVyYXRlZEl0ZW1zO1xuICAgICAgICB0aGlzLmxvYWRlckFyciA9IFtdO1xuICAgICAgICB0aGlzLnNwYWNlclN0eWxlID0ge307XG4gICAgICAgIHRoaXMuY29udGVudFN0eWxlID0ge307XG4gICAgfVxuXG4gICAgZ2V0RWxlbWVudFJlZigpIHtcbiAgICAgICAgcmV0dXJuIHRoaXMuZWxlbWVudFZpZXdDaGlsZDtcbiAgICB9XG5cbiAgICBnZXRQYWdlQnlGaXJzdCgpIHtcbiAgICAgICAgcmV0dXJuIE1hdGguZmxvb3IoKHRoaXMuZmlyc3QgKyB0aGlzLmRfbnVtVG9sZXJhdGVkSXRlbXMgKiA0KSAvICh0aGlzLl9zdGVwIHx8IDEpKTtcbiAgICB9XG5cbiAgICBzY3JvbGxUbyhvcHRpb25zOiBTY3JvbGxUb09wdGlvbnMpIHtcbiAgICAgICAgdGhpcy5sYXN0U2Nyb2xsUG9zID0gdGhpcy5ib3RoID8geyB0b3A6IDAsIGxlZnQ6IDAgfSA6IDA7XG4gICAgICAgIHRoaXMuZWxlbWVudFZpZXdDaGlsZD8ubmF0aXZlRWxlbWVudD8uc2Nyb2xsVG8ob3B0aW9ucyk7XG4gICAgfVxuXG4gICAgc2Nyb2xsVG9JbmRleChpbmRleDogbnVtYmVyLCBiZWhhdmlvcjogU2Nyb2xsQmVoYXZpb3IgPSAnYXV0bycpIHtcbiAgICAgICAgY29uc3QgeyBudW1Ub2xlcmF0ZWRJdGVtcyB9ID0gdGhpcy5jYWxjdWxhdGVOdW1JdGVtcygpO1xuICAgICAgICBjb25zdCBjb250ZW50UG9zID0gdGhpcy5nZXRDb250ZW50UG9zaXRpb24oKTtcbiAgICAgICAgY29uc3QgY2FsY3VsYXRlRmlyc3QgPSAoX2luZGV4ID0gMCwgX251bVQpID0+IChfaW5kZXggPD0gX251bVQgPyAwIDogX2luZGV4KTtcbiAgICAgICAgY29uc3QgY2FsY3VsYXRlQ29vcmQgPSAoX2ZpcnN0LCBfc2l6ZSwgX2Nwb3MpID0+IF9maXJzdCAqIF9zaXplICsgX2Nwb3M7XG4gICAgICAgIGNvbnN0IHNjcm9sbFRvID0gKGxlZnQgPSAwLCB0b3AgPSAwKSA9PiB0aGlzLnNjcm9sbFRvKHsgbGVmdCwgdG9wLCBiZWhhdmlvciB9KTtcblxuICAgICAgICBpZiAodGhpcy5ib3RoKSB7XG4gICAgICAgICAgICB0aGlzLmZpcnN0ID0geyByb3dzOiBjYWxjdWxhdGVGaXJzdChpbmRleFswXSwgbnVtVG9sZXJhdGVkSXRlbXNbMF0pLCBjb2xzOiBjYWxjdWxhdGVGaXJzdChpbmRleFsxXSwgbnVtVG9sZXJhdGVkSXRlbXNbMV0pIH07XG4gICAgICAgICAgICBzY3JvbGxUbyhjYWxjdWxhdGVDb29yZCh0aGlzLmZpcnN0LmNvbHMsIHRoaXMuX2l0ZW1TaXplWzFdLCBjb250ZW50UG9zLmxlZnQpLCBjYWxjdWxhdGVDb29yZCh0aGlzLmZpcnN0LnJvd3MsIHRoaXMuX2l0ZW1TaXplWzBdLCBjb250ZW50UG9zLnRvcCkpO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgdGhpcy5maXJzdCA9IGNhbGN1bGF0ZUZpcnN0KGluZGV4LCBudW1Ub2xlcmF0ZWRJdGVtcyk7XG4gICAgICAgICAgICB0aGlzLmhvcml6b250YWwgPyBzY3JvbGxUbyhjYWxjdWxhdGVDb29yZCh0aGlzLmZpcnN0LCB0aGlzLl9pdGVtU2l6ZSwgY29udGVudFBvcy5sZWZ0KSwgMCkgOiBzY3JvbGxUbygwLCBjYWxjdWxhdGVDb29yZCh0aGlzLmZpcnN0LCB0aGlzLl9pdGVtU2l6ZSwgY29udGVudFBvcy50b3ApKTtcbiAgICAgICAgfVxuICAgIH1cblxuICAgIHNjcm9sbEluVmlldyhpbmRleDogbnVtYmVyLCB0bzogU2Nyb2xsZXJUb1R5cGUsIGJlaGF2aW9yOiBTY3JvbGxCZWhhdmlvciA9ICdhdXRvJykge1xuICAgICAgICBpZiAodG8pIHtcbiAgICAgICAgICAgIGNvbnN0IHsgZmlyc3QsIHZpZXdwb3J0IH0gPSB0aGlzLmdldFJlbmRlcmVkUmFuZ2UoKTtcbiAgICAgICAgICAgIGNvbnN0IHNjcm9sbFRvID0gKGxlZnQgPSAwLCB0b3AgPSAwKSA9PiB0aGlzLnNjcm9sbFRvKHsgbGVmdCwgdG9wLCBiZWhhdmlvciB9KTtcbiAgICAgICAgICAgIGNvbnN0IGlzVG9TdGFydCA9IHRvID09PSAndG8tc3RhcnQnO1xuICAgICAgICAgICAgY29uc3QgaXNUb0VuZCA9IHRvID09PSAndG8tZW5kJztcblxuICAgICAgICAgICAgaWYgKGlzVG9TdGFydCkge1xuICAgICAgICAgICAgICAgIGlmICh0aGlzLmJvdGgpIHtcbiAgICAgICAgICAgICAgICAgICAgaWYgKHZpZXdwb3J0LmZpcnN0LnJvd3MgLSBmaXJzdC5yb3dzID4gaW5kZXhbMF0pIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHNjcm9sbFRvKHZpZXdwb3J0LmZpcnN0LmNvbHMgKiB0aGlzLl9pdGVtU2l6ZVsxXSwgKHZpZXdwb3J0LmZpcnN0LnJvd3MgLSAxKSAqIHRoaXMuX2l0ZW1TaXplWzBdKTtcbiAgICAgICAgICAgICAgICAgICAgfSBlbHNlIGlmICh2aWV3cG9ydC5maXJzdC5jb2xzIC0gZmlyc3QuY29scyA+IGluZGV4WzFdKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBzY3JvbGxUbygodmlld3BvcnQuZmlyc3QuY29scyAtIDEpICogdGhpcy5faXRlbVNpemVbMV0sIHZpZXdwb3J0LmZpcnN0LnJvd3MgKiB0aGlzLl9pdGVtU2l6ZVswXSk7XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICBpZiAodmlld3BvcnQuZmlyc3QgLSBmaXJzdCA+IGluZGV4KSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBjb25zdCBwb3MgPSAodmlld3BvcnQuZmlyc3QgLSAxKSAqIHRoaXMuX2l0ZW1TaXplO1xuICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5ob3Jpem9udGFsID8gc2Nyb2xsVG8ocG9zLCAwKSA6IHNjcm9sbFRvKDAsIHBvcyk7XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9IGVsc2UgaWYgKGlzVG9FbmQpIHtcbiAgICAgICAgICAgICAgICBpZiAodGhpcy5ib3RoKSB7XG4gICAgICAgICAgICAgICAgICAgIGlmICh2aWV3cG9ydC5sYXN0LnJvd3MgLSBmaXJzdC5yb3dzIDw9IGluZGV4WzBdICsgMSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgc2Nyb2xsVG8odmlld3BvcnQuZmlyc3QuY29scyAqIHRoaXMuX2l0ZW1TaXplWzFdLCAodmlld3BvcnQuZmlyc3Qucm93cyArIDEpICogdGhpcy5faXRlbVNpemVbMF0pO1xuICAgICAgICAgICAgICAgICAgICB9IGVsc2UgaWYgKHZpZXdwb3J0Lmxhc3QuY29scyAtIGZpcnN0LmNvbHMgPD0gaW5kZXhbMV0gKyAxKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBzY3JvbGxUbygodmlld3BvcnQuZmlyc3QuY29scyArIDEpICogdGhpcy5faXRlbVNpemVbMV0sIHZpZXdwb3J0LmZpcnN0LnJvd3MgKiB0aGlzLl9pdGVtU2l6ZVswXSk7XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICBpZiAodmlld3BvcnQubGFzdCAtIGZpcnN0IDw9IGluZGV4ICsgMSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgY29uc3QgcG9zID0gKHZpZXdwb3J0LmZpcnN0ICsgMSkgKiB0aGlzLl9pdGVtU2l6ZTtcbiAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMuaG9yaXpvbnRhbCA/IHNjcm9sbFRvKHBvcywgMCkgOiBzY3JvbGxUbygwLCBwb3MpO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgdGhpcy5zY3JvbGxUb0luZGV4KGluZGV4LCBiZWhhdmlvcik7XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICBnZXRSZW5kZXJlZFJhbmdlKCkge1xuICAgICAgICBjb25zdCBjYWxjdWxhdGVGaXJzdEluVmlld3BvcnQgPSAoX3BvcywgX3NpemUpID0+IE1hdGguZmxvb3IoX3BvcyAvIChfc2l6ZSB8fCBfcG9zKSk7XG5cbiAgICAgICAgbGV0IGZpcnN0SW5WaWV3cG9ydCA9IHRoaXMuZmlyc3Q7XG4gICAgICAgIGxldCBsYXN0SW5WaWV3cG9ydDogYW55ID0gMDtcblxuICAgICAgICBpZiAodGhpcy5lbGVtZW50Vmlld0NoaWxkPy5uYXRpdmVFbGVtZW50KSB7XG4gICAgICAgICAgICBjb25zdCB7IHNjcm9sbFRvcCwgc2Nyb2xsTGVmdCB9ID0gdGhpcy5lbGVtZW50Vmlld0NoaWxkLm5hdGl2ZUVsZW1lbnQ7XG5cbiAgICAgICAgICAgIGlmICh0aGlzLmJvdGgpIHtcbiAgICAgICAgICAgICAgICBmaXJzdEluVmlld3BvcnQgPSB7IHJvd3M6IGNhbGN1bGF0ZUZpcnN0SW5WaWV3cG9ydChzY3JvbGxUb3AsIHRoaXMuX2l0ZW1TaXplWzBdKSwgY29sczogY2FsY3VsYXRlRmlyc3RJblZpZXdwb3J0KHNjcm9sbExlZnQsIHRoaXMuX2l0ZW1TaXplWzFdKSB9O1xuICAgICAgICAgICAgICAgIGxhc3RJblZpZXdwb3J0ID0geyByb3dzOiBmaXJzdEluVmlld3BvcnQucm93cyArIHRoaXMubnVtSXRlbXNJblZpZXdwb3J0LnJvd3MsIGNvbHM6IGZpcnN0SW5WaWV3cG9ydC5jb2xzICsgdGhpcy5udW1JdGVtc0luVmlld3BvcnQuY29scyB9O1xuICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICBjb25zdCBzY3JvbGxQb3MgPSB0aGlzLmhvcml6b250YWwgPyBzY3JvbGxMZWZ0IDogc2Nyb2xsVG9wO1xuICAgICAgICAgICAgICAgIGZpcnN0SW5WaWV3cG9ydCA9IGNhbGN1bGF0ZUZpcnN0SW5WaWV3cG9ydChzY3JvbGxQb3MsIHRoaXMuX2l0ZW1TaXplKTtcbiAgICAgICAgICAgICAgICBsYXN0SW5WaWV3cG9ydCA9IGZpcnN0SW5WaWV3cG9ydCArIHRoaXMubnVtSXRlbXNJblZpZXdwb3J0O1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG5cbiAgICAgICAgcmV0dXJuIHtcbiAgICAgICAgICAgIGZpcnN0OiB0aGlzLmZpcnN0LFxuICAgICAgICAgICAgbGFzdDogdGhpcy5sYXN0LFxuICAgICAgICAgICAgdmlld3BvcnQ6IHtcbiAgICAgICAgICAgICAgICBmaXJzdDogZmlyc3RJblZpZXdwb3J0LFxuICAgICAgICAgICAgICAgIGxhc3Q6IGxhc3RJblZpZXdwb3J0XG4gICAgICAgICAgICB9XG4gICAgICAgIH07XG4gICAgfVxuXG4gICAgY2FsY3VsYXRlTnVtSXRlbXMoKSB7XG4gICAgICAgIGNvbnN0IGNvbnRlbnRQb3MgPSB0aGlzLmdldENvbnRlbnRQb3NpdGlvbigpO1xuICAgICAgICBjb25zdCBjb250ZW50V2lkdGggPSB0aGlzLmVsZW1lbnRWaWV3Q2hpbGQ/Lm5hdGl2ZUVsZW1lbnQgPyB0aGlzLmVsZW1lbnRWaWV3Q2hpbGQubmF0aXZlRWxlbWVudC5vZmZzZXRXaWR0aCAtIGNvbnRlbnRQb3MubGVmdCA6IDA7XG4gICAgICAgIGNvbnN0IGNvbnRlbnRIZWlnaHQgPSB0aGlzLmVsZW1lbnRWaWV3Q2hpbGQ/Lm5hdGl2ZUVsZW1lbnQgPyB0aGlzLmVsZW1lbnRWaWV3Q2hpbGQubmF0aXZlRWxlbWVudC5vZmZzZXRIZWlnaHQgLSBjb250ZW50UG9zLnRvcCA6IDA7XG4gICAgICAgIGNvbnN0IGNhbGN1bGF0ZU51bUl0ZW1zSW5WaWV3cG9ydCA9IChfY29udGVudFNpemUsIF9pdGVtU2l6ZSkgPT4gTWF0aC5jZWlsKF9jb250ZW50U2l6ZSAvIChfaXRlbVNpemUgfHwgX2NvbnRlbnRTaXplKSk7XG4gICAgICAgIGNvbnN0IGNhbGN1bGF0ZU51bVRvbGVyYXRlZEl0ZW1zID0gKF9udW1JdGVtcykgPT4gTWF0aC5jZWlsKF9udW1JdGVtcyAvIDIpO1xuICAgICAgICBjb25zdCBudW1JdGVtc0luVmlld3BvcnQ6IGFueSA9IHRoaXMuYm90aFxuICAgICAgICAgICAgPyB7IHJvd3M6IGNhbGN1bGF0ZU51bUl0ZW1zSW5WaWV3cG9ydChjb250ZW50SGVpZ2h0LCB0aGlzLl9pdGVtU2l6ZVswXSksIGNvbHM6IGNhbGN1bGF0ZU51bUl0ZW1zSW5WaWV3cG9ydChjb250ZW50V2lkdGgsIHRoaXMuX2l0ZW1TaXplWzFdKSB9XG4gICAgICAgICAgICA6IGNhbGN1bGF0ZU51bUl0ZW1zSW5WaWV3cG9ydCh0aGlzLmhvcml6b250YWwgPyBjb250ZW50V2lkdGggOiBjb250ZW50SGVpZ2h0LCB0aGlzLl9pdGVtU2l6ZSk7XG5cbiAgICAgICAgY29uc3QgbnVtVG9sZXJhdGVkSXRlbXMgPSB0aGlzLmRfbnVtVG9sZXJhdGVkSXRlbXMgfHwgKHRoaXMuYm90aCA/IFtjYWxjdWxhdGVOdW1Ub2xlcmF0ZWRJdGVtcyhudW1JdGVtc0luVmlld3BvcnQucm93cyksIGNhbGN1bGF0ZU51bVRvbGVyYXRlZEl0ZW1zKG51bUl0ZW1zSW5WaWV3cG9ydC5jb2xzKV0gOiBjYWxjdWxhdGVOdW1Ub2xlcmF0ZWRJdGVtcyhudW1JdGVtc0luVmlld3BvcnQpKTtcblxuICAgICAgICByZXR1cm4geyBudW1JdGVtc0luVmlld3BvcnQsIG51bVRvbGVyYXRlZEl0ZW1zIH07XG4gICAgfVxuXG4gICAgY2FsY3VsYXRlT3B0aW9ucygpIHtcbiAgICAgICAgY29uc3QgeyBudW1JdGVtc0luVmlld3BvcnQsIG51bVRvbGVyYXRlZEl0ZW1zIH0gPSB0aGlzLmNhbGN1bGF0ZU51bUl0ZW1zKCk7XG4gICAgICAgIGNvbnN0IGNhbGN1bGF0ZUxhc3QgPSAoX2ZpcnN0LCBfbnVtLCBfbnVtVCwgX2lzQ29scyA9IGZhbHNlKSA9PiB0aGlzLmdldExhc3QoX2ZpcnN0ICsgX251bSArIChfZmlyc3QgPCBfbnVtVCA/IDIgOiAzKSAqIF9udW1ULCBfaXNDb2xzKTtcbiAgICAgICAgY29uc3QgZmlyc3QgPSB0aGlzLmZpcnN0O1xuICAgICAgICBjb25zdCBsYXN0ID0gdGhpcy5ib3RoXG4gICAgICAgICAgICA/IHsgcm93czogY2FsY3VsYXRlTGFzdCh0aGlzLmZpcnN0LnJvd3MsIG51bUl0ZW1zSW5WaWV3cG9ydC5yb3dzLCBudW1Ub2xlcmF0ZWRJdGVtc1swXSksIGNvbHM6IGNhbGN1bGF0ZUxhc3QodGhpcy5maXJzdC5jb2xzLCBudW1JdGVtc0luVmlld3BvcnQuY29scywgbnVtVG9sZXJhdGVkSXRlbXNbMV0sIHRydWUpIH1cbiAgICAgICAgICAgIDogY2FsY3VsYXRlTGFzdCh0aGlzLmZpcnN0LCBudW1JdGVtc0luVmlld3BvcnQsIG51bVRvbGVyYXRlZEl0ZW1zKTtcblxuICAgICAgICB0aGlzLmxhc3QgPSBsYXN0O1xuICAgICAgICB0aGlzLm51bUl0ZW1zSW5WaWV3cG9ydCA9IG51bUl0ZW1zSW5WaWV3cG9ydDtcbiAgICAgICAgdGhpcy5kX251bVRvbGVyYXRlZEl0ZW1zID0gbnVtVG9sZXJhdGVkSXRlbXM7XG5cbiAgICAgICAgaWYgKHRoaXMuc2hvd0xvYWRlcikge1xuICAgICAgICAgICAgdGhpcy5sb2FkZXJBcnIgPSB0aGlzLmJvdGggPyBBcnJheS5mcm9tKHsgbGVuZ3RoOiBudW1JdGVtc0luVmlld3BvcnQucm93cyB9KS5tYXAoKCkgPT4gQXJyYXkuZnJvbSh7IGxlbmd0aDogbnVtSXRlbXNJblZpZXdwb3J0LmNvbHMgfSkpIDogQXJyYXkuZnJvbSh7IGxlbmd0aDogbnVtSXRlbXNJblZpZXdwb3J0IH0pO1xuICAgICAgICB9XG5cbiAgICAgICAgaWYgKHRoaXMuX2xhenkpIHtcbiAgICAgICAgICAgIFByb21pc2UucmVzb2x2ZSgpLnRoZW4oKCkgPT4ge1xuICAgICAgICAgICAgICAgIHRoaXMubGF6eUxvYWRTdGF0ZSA9IHtcbiAgICAgICAgICAgICAgICAgICAgZmlyc3Q6IHRoaXMuX3N0ZXAgPyAodGhpcy5ib3RoID8geyByb3dzOiAwLCBjb2xzOiBmaXJzdC5jb2xzIH0gOiAwKSA6IGZpcnN0LFxuICAgICAgICAgICAgICAgICAgICBsYXN0OiBNYXRoLm1pbih0aGlzLl9zdGVwID8gdGhpcy5fc3RlcCA6IHRoaXMubGFzdCwgdGhpcy5pdGVtcy5sZW5ndGgpXG4gICAgICAgICAgICAgICAgfTtcblxuICAgICAgICAgICAgICAgIHRoaXMuaGFuZGxlRXZlbnRzKCdvbkxhenlMb2FkJywgdGhpcy5sYXp5TG9hZFN0YXRlKTtcbiAgICAgICAgICAgIH0pO1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgY2FsY3VsYXRlQXV0b1NpemUoKSB7XG4gICAgICAgIGlmICh0aGlzLl9hdXRvU2l6ZSAmJiAhdGhpcy5kX2xvYWRpbmcpIHtcbiAgICAgICAgICAgIFByb21pc2UucmVzb2x2ZSgpLnRoZW4oKCkgPT4ge1xuICAgICAgICAgICAgICAgIGlmICh0aGlzLmNvbnRlbnRFbCkge1xuICAgICAgICAgICAgICAgICAgICB0aGlzLmNvbnRlbnRFbC5zdHlsZS5taW5IZWlnaHQgPSB0aGlzLmNvbnRlbnRFbC5zdHlsZS5taW5XaWR0aCA9ICdhdXRvJztcblxuICAgICAgICAgICAgICAgICAgICBjb25zdCB7IG9mZnNldFdpZHRoLCBvZmZzZXRIZWlnaHQgfSA9IHRoaXMuY29udGVudEVsO1xuXG4gICAgICAgICAgICAgICAgICAgICh0aGlzLmJvdGggfHwgdGhpcy5ob3Jpem9udGFsKSAmJiAodGhpcy5lbGVtZW50Vmlld0NoaWxkLm5hdGl2ZUVsZW1lbnQuc3R5bGUud2lkdGggPSAob2Zmc2V0V2lkdGggPCB0aGlzLmRlZmF1bHRXaWR0aCA/IG9mZnNldFdpZHRoIDogdGhpcy5kZWZhdWx0V2lkdGgpICsgJ3B4Jyk7XG4gICAgICAgICAgICAgICAgICAgICh0aGlzLmJvdGggfHwgdGhpcy52ZXJ0aWNhbCkgJiYgKHRoaXMuZWxlbWVudFZpZXdDaGlsZC5uYXRpdmVFbGVtZW50LnN0eWxlLmhlaWdodCA9IChvZmZzZXRIZWlnaHQgPCB0aGlzLmRlZmF1bHRIZWlnaHQgPyBvZmZzZXRIZWlnaHQgOiB0aGlzLmRlZmF1bHRIZWlnaHQpICsgJ3B4Jyk7XG4gICAgICAgICAgICAgICAgICAgIHRoaXMuY29udGVudEVsLnN0eWxlLm1pbkhlaWdodCA9IHRoaXMuY29udGVudEVsLnN0eWxlLm1pbldpZHRoID0gJyc7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfSk7XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICBnZXRMYXN0KGxhc3QgPSAwLCBpc0NvbHMgPSBmYWxzZSkge1xuICAgICAgICByZXR1cm4gdGhpcy5faXRlbXMgPyBNYXRoLm1pbihpc0NvbHMgPyAodGhpcy5fY29sdW1ucyB8fCB0aGlzLl9pdGVtc1swXSkubGVuZ3RoIDogdGhpcy5faXRlbXMubGVuZ3RoLCBsYXN0KSA6IDA7XG4gICAgfVxuXG4gICAgZ2V0Q29udGVudFBvc2l0aW9uKCkge1xuICAgICAgICBpZiAodGhpcy5jb250ZW50RWwpIHtcbiAgICAgICAgICAgIGNvbnN0IHN0eWxlID0gZ2V0Q29tcHV0ZWRTdHlsZSh0aGlzLmNvbnRlbnRFbCk7XG4gICAgICAgICAgICBjb25zdCBsZWZ0ID0gcGFyc2VGbG9hdChzdHlsZS5wYWRkaW5nTGVmdCkgKyBNYXRoLm1heChwYXJzZUZsb2F0KHN0eWxlLmxlZnQpIHx8IDAsIDApO1xuICAgICAgICAgICAgY29uc3QgcmlnaHQgPSBwYXJzZUZsb2F0KHN0eWxlLnBhZGRpbmdSaWdodCkgKyBNYXRoLm1heChwYXJzZUZsb2F0KHN0eWxlLnJpZ2h0KSB8fCAwLCAwKTtcbiAgICAgICAgICAgIGNvbnN0IHRvcCA9IHBhcnNlRmxvYXQoc3R5bGUucGFkZGluZ1RvcCkgKyBNYXRoLm1heChwYXJzZUZsb2F0KHN0eWxlLnRvcCkgfHwgMCwgMCk7XG4gICAgICAgICAgICBjb25zdCBib3R0b20gPSBwYXJzZUZsb2F0KHN0eWxlLnBhZGRpbmdCb3R0b20pICsgTWF0aC5tYXgocGFyc2VGbG9hdChzdHlsZS5ib3R0b20pIHx8IDAsIDApO1xuXG4gICAgICAgICAgICByZXR1cm4geyBsZWZ0LCByaWdodCwgdG9wLCBib3R0b20sIHg6IGxlZnQgKyByaWdodCwgeTogdG9wICsgYm90dG9tIH07XG4gICAgICAgIH1cblxuICAgICAgICByZXR1cm4geyBsZWZ0OiAwLCByaWdodDogMCwgdG9wOiAwLCBib3R0b206IDAsIHg6IDAsIHk6IDAgfTtcbiAgICB9XG5cbiAgICBzZXRTaXplKCkge1xuICAgICAgICBpZiAodGhpcy5lbGVtZW50Vmlld0NoaWxkPy5uYXRpdmVFbGVtZW50KSB7XG4gICAgICAgICAgICBjb25zdCBwYXJlbnRFbGVtZW50ID0gdGhpcy5lbGVtZW50Vmlld0NoaWxkLm5hdGl2ZUVsZW1lbnQucGFyZW50RWxlbWVudC5wYXJlbnRFbGVtZW50O1xuICAgICAgICAgICAgY29uc3Qgd2lkdGggPSB0aGlzLl9zY3JvbGxXaWR0aCB8fCBgJHt0aGlzLmVsZW1lbnRWaWV3Q2hpbGQubmF0aXZlRWxlbWVudC5vZmZzZXRXaWR0aCB8fCBwYXJlbnRFbGVtZW50Lm9mZnNldFdpZHRofXB4YDtcbiAgICAgICAgICAgIGNvbnN0IGhlaWdodCA9IHRoaXMuX3Njcm9sbEhlaWdodCB8fCBgJHt0aGlzLmVsZW1lbnRWaWV3Q2hpbGQubmF0aXZlRWxlbWVudC5vZmZzZXRIZWlnaHQgfHwgcGFyZW50RWxlbWVudC5vZmZzZXRIZWlnaHR9cHhgO1xuICAgICAgICAgICAgY29uc3Qgc2V0UHJvcCA9IChfbmFtZSwgX3ZhbHVlKSA9PiAodGhpcy5lbGVtZW50Vmlld0NoaWxkLm5hdGl2ZUVsZW1lbnQuc3R5bGVbX25hbWVdID0gX3ZhbHVlKTtcblxuICAgICAgICAgICAgaWYgKHRoaXMuYm90aCB8fCB0aGlzLmhvcml6b250YWwpIHtcbiAgICAgICAgICAgICAgICBzZXRQcm9wKCdoZWlnaHQnLCBoZWlnaHQpO1xuICAgICAgICAgICAgICAgIHNldFByb3AoJ3dpZHRoJywgd2lkdGgpO1xuICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICBzZXRQcm9wKCdoZWlnaHQnLCBoZWlnaHQpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgfVxuXG4gICAgc2V0U3BhY2VyU2l6ZSgpIHtcbiAgICAgICAgaWYgKHRoaXMuX2l0ZW1zKSB7XG4gICAgICAgICAgICBjb25zdCBjb250ZW50UG9zID0gdGhpcy5nZXRDb250ZW50UG9zaXRpb24oKTtcbiAgICAgICAgICAgIGNvbnN0IHNldFByb3AgPSAoX25hbWUsIF92YWx1ZSwgX3NpemUsIF9jcG9zID0gMCkgPT4gKHRoaXMuc3BhY2VyU3R5bGUgPSB7IC4uLnRoaXMuc3BhY2VyU3R5bGUsIC4uLnsgW2Ake19uYW1lfWBdOiAoX3ZhbHVlIHx8IFtdKS5sZW5ndGggKiBfc2l6ZSArIF9jcG9zICsgJ3B4JyB9IH0pO1xuXG4gICAgICAgICAgICBpZiAodGhpcy5ib3RoKSB7XG4gICAgICAgICAgICAgICAgc2V0UHJvcCgnaGVpZ2h0JywgdGhpcy5faXRlbXMsIHRoaXMuX2l0ZW1TaXplWzBdLCBjb250ZW50UG9zLnkpO1xuICAgICAgICAgICAgICAgIHNldFByb3AoJ3dpZHRoJywgdGhpcy5fY29sdW1ucyB8fCB0aGlzLl9pdGVtc1sxXSwgdGhpcy5faXRlbVNpemVbMV0sIGNvbnRlbnRQb3MueCk7XG4gICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgIHRoaXMuaG9yaXpvbnRhbCA/IHNldFByb3AoJ3dpZHRoJywgdGhpcy5fY29sdW1ucyB8fCB0aGlzLl9pdGVtcywgdGhpcy5faXRlbVNpemUsIGNvbnRlbnRQb3MueCkgOiBzZXRQcm9wKCdoZWlnaHQnLCB0aGlzLl9pdGVtcywgdGhpcy5faXRlbVNpemUsIGNvbnRlbnRQb3MueSk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICBzZXRDb250ZW50UG9zaXRpb24ocG9zKSB7XG4gICAgICAgIGlmICh0aGlzLmNvbnRlbnRFbCAmJiAhdGhpcy5fYXBwZW5kT25seSkge1xuICAgICAgICAgICAgY29uc3QgZmlyc3QgPSBwb3MgPyBwb3MuZmlyc3QgOiB0aGlzLmZpcnN0O1xuICAgICAgICAgICAgY29uc3QgY2FsY3VsYXRlVHJhbnNsYXRlVmFsID0gKF9maXJzdCwgX3NpemUpID0+IF9maXJzdCAqIF9zaXplO1xuICAgICAgICAgICAgY29uc3Qgc2V0VHJhbnNmb3JtID0gKF94ID0gMCwgX3kgPSAwKSA9PiAodGhpcy5jb250ZW50U3R5bGUgPSB7IC4uLnRoaXMuY29udGVudFN0eWxlLCAuLi57IHRyYW5zZm9ybTogYHRyYW5zbGF0ZTNkKCR7X3h9cHgsICR7X3l9cHgsIDApYCB9IH0pO1xuXG4gICAgICAgICAgICBpZiAodGhpcy5ib3RoKSB7XG4gICAgICAgICAgICAgICAgc2V0VHJhbnNmb3JtKGNhbGN1bGF0ZVRyYW5zbGF0ZVZhbChmaXJzdC5jb2xzLCB0aGlzLl9pdGVtU2l6ZVsxXSksIGNhbGN1bGF0ZVRyYW5zbGF0ZVZhbChmaXJzdC5yb3dzLCB0aGlzLl9pdGVtU2l6ZVswXSkpO1xuICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICBjb25zdCB0cmFuc2xhdGVWYWwgPSBjYWxjdWxhdGVUcmFuc2xhdGVWYWwoZmlyc3QsIHRoaXMuX2l0ZW1TaXplKTtcbiAgICAgICAgICAgICAgICB0aGlzLmhvcml6b250YWwgPyBzZXRUcmFuc2Zvcm0odHJhbnNsYXRlVmFsLCAwKSA6IHNldFRyYW5zZm9ybSgwLCB0cmFuc2xhdGVWYWwpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgfVxuXG4gICAgb25TY3JvbGxQb3NpdGlvbkNoYW5nZShldmVudCkge1xuICAgICAgICBjb25zdCB0YXJnZXQgPSBldmVudC50YXJnZXQ7XG4gICAgICAgIGNvbnN0IGNvbnRlbnRQb3MgPSB0aGlzLmdldENvbnRlbnRQb3NpdGlvbigpO1xuICAgICAgICBjb25zdCBjYWxjdWxhdGVTY3JvbGxQb3MgPSAoX3BvcywgX2Nwb3MpID0+IChfcG9zID8gKF9wb3MgPiBfY3BvcyA/IF9wb3MgLSBfY3BvcyA6IF9wb3MpIDogMCk7XG4gICAgICAgIGNvbnN0IGNhbGN1bGF0ZUN1cnJlbnRJbmRleCA9IChfcG9zLCBfc2l6ZSkgPT4gTWF0aC5mbG9vcihfcG9zIC8gKF9zaXplIHx8IF9wb3MpKTtcbiAgICAgICAgY29uc3QgY2FsY3VsYXRlVHJpZ2dlckluZGV4ID0gKF9jdXJyZW50SW5kZXgsIF9maXJzdCwgX2xhc3QsIF9udW0sIF9udW1ULCBfaXNTY3JvbGxEb3duT3JSaWdodCkgPT4ge1xuICAgICAgICAgICAgcmV0dXJuIF9jdXJyZW50SW5kZXggPD0gX251bVQgPyBfbnVtVCA6IF9pc1Njcm9sbERvd25PclJpZ2h0ID8gX2xhc3QgLSBfbnVtIC0gX251bVQgOiBfZmlyc3QgKyBfbnVtVCAtIDE7XG4gICAgICAgIH07XG4gICAgICAgIGNvbnN0IGNhbGN1bGF0ZUZpcnN0ID0gKF9jdXJyZW50SW5kZXgsIF90cmlnZ2VySW5kZXgsIF9maXJzdCwgX2xhc3QsIF9udW0sIF9udW1ULCBfaXNTY3JvbGxEb3duT3JSaWdodCkgPT4ge1xuICAgICAgICAgICAgaWYgKF9jdXJyZW50SW5kZXggPD0gX251bVQpIHJldHVybiAwO1xuICAgICAgICAgICAgZWxzZSByZXR1cm4gTWF0aC5tYXgoMCwgX2lzU2Nyb2xsRG93bk9yUmlnaHQgPyAoX2N1cnJlbnRJbmRleCA8IF90cmlnZ2VySW5kZXggPyBfZmlyc3QgOiBfY3VycmVudEluZGV4IC0gX251bVQpIDogX2N1cnJlbnRJbmRleCA+IF90cmlnZ2VySW5kZXggPyBfZmlyc3QgOiBfY3VycmVudEluZGV4IC0gMiAqIF9udW1UKTtcbiAgICAgICAgfTtcbiAgICAgICAgY29uc3QgY2FsY3VsYXRlTGFzdCA9IChfY3VycmVudEluZGV4LCBfZmlyc3QsIF9sYXN0LCBfbnVtLCBfbnVtVCwgX2lzQ29scyA9IGZhbHNlKSA9PiB7XG4gICAgICAgICAgICBsZXQgbGFzdFZhbHVlID0gX2ZpcnN0ICsgX251bSArIDIgKiBfbnVtVDtcblxuICAgICAgICAgICAgaWYgKF9jdXJyZW50SW5kZXggPj0gX251bVQpIHtcbiAgICAgICAgICAgICAgICBsYXN0VmFsdWUgKz0gX251bVQgKyAxO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICByZXR1cm4gdGhpcy5nZXRMYXN0KGxhc3RWYWx1ZSwgX2lzQ29scyk7XG4gICAgICAgIH07XG5cbiAgICAgICAgY29uc3Qgc2Nyb2xsVG9wID0gY2FsY3VsYXRlU2Nyb2xsUG9zKHRhcmdldC5zY3JvbGxUb3AsIGNvbnRlbnRQb3MudG9wKTtcbiAgICAgICAgY29uc3Qgc2Nyb2xsTGVmdCA9IGNhbGN1bGF0ZVNjcm9sbFBvcyh0YXJnZXQuc2Nyb2xsTGVmdCwgY29udGVudFBvcy5sZWZ0KTtcblxuICAgICAgICBsZXQgbmV3Rmlyc3QgPSB0aGlzLmJvdGggPyB7IHJvd3M6IDAsIGNvbHM6IDAgfSA6IDA7XG4gICAgICAgIGxldCBuZXdMYXN0ID0gdGhpcy5sYXN0O1xuICAgICAgICBsZXQgaXNSYW5nZUNoYW5nZWQgPSBmYWxzZTtcbiAgICAgICAgbGV0IG5ld1Njcm9sbFBvcyA9IHRoaXMubGFzdFNjcm9sbFBvcztcblxuICAgICAgICBpZiAodGhpcy5ib3RoKSB7XG4gICAgICAgICAgICBjb25zdCBpc1Njcm9sbERvd24gPSB0aGlzLmxhc3RTY3JvbGxQb3MudG9wIDw9IHNjcm9sbFRvcDtcbiAgICAgICAgICAgIGNvbnN0IGlzU2Nyb2xsUmlnaHQgPSB0aGlzLmxhc3RTY3JvbGxQb3MubGVmdCA8PSBzY3JvbGxMZWZ0O1xuXG4gICAgICAgICAgICBpZiAoIXRoaXMuX2FwcGVuZE9ubHkgfHwgKHRoaXMuX2FwcGVuZE9ubHkgJiYgKGlzU2Nyb2xsRG93biB8fCBpc1Njcm9sbFJpZ2h0KSkpIHtcbiAgICAgICAgICAgICAgICBjb25zdCBjdXJyZW50SW5kZXggPSB7IHJvd3M6IGNhbGN1bGF0ZUN1cnJlbnRJbmRleChzY3JvbGxUb3AsIHRoaXMuX2l0ZW1TaXplWzBdKSwgY29sczogY2FsY3VsYXRlQ3VycmVudEluZGV4KHNjcm9sbExlZnQsIHRoaXMuX2l0ZW1TaXplWzFdKSB9O1xuICAgICAgICAgICAgICAgIGNvbnN0IHRyaWdnZXJJbmRleCA9IHtcbiAgICAgICAgICAgICAgICAgICAgcm93czogY2FsY3VsYXRlVHJpZ2dlckluZGV4KGN1cnJlbnRJbmRleC5yb3dzLCB0aGlzLmZpcnN0LnJvd3MsIHRoaXMubGFzdC5yb3dzLCB0aGlzLm51bUl0ZW1zSW5WaWV3cG9ydC5yb3dzLCB0aGlzLmRfbnVtVG9sZXJhdGVkSXRlbXNbMF0sIGlzU2Nyb2xsRG93biksXG4gICAgICAgICAgICAgICAgICAgIGNvbHM6IGNhbGN1bGF0ZVRyaWdnZXJJbmRleChjdXJyZW50SW5kZXguY29scywgdGhpcy5maXJzdC5jb2xzLCB0aGlzLmxhc3QuY29scywgdGhpcy5udW1JdGVtc0luVmlld3BvcnQuY29scywgdGhpcy5kX251bVRvbGVyYXRlZEl0ZW1zWzFdLCBpc1Njcm9sbFJpZ2h0KVxuICAgICAgICAgICAgICAgIH07XG5cbiAgICAgICAgICAgICAgICBuZXdGaXJzdCA9IHtcbiAgICAgICAgICAgICAgICAgICAgcm93czogY2FsY3VsYXRlRmlyc3QoY3VycmVudEluZGV4LnJvd3MsIHRyaWdnZXJJbmRleC5yb3dzLCB0aGlzLmZpcnN0LnJvd3MsIHRoaXMubGFzdC5yb3dzLCB0aGlzLm51bUl0ZW1zSW5WaWV3cG9ydC5yb3dzLCB0aGlzLmRfbnVtVG9sZXJhdGVkSXRlbXNbMF0sIGlzU2Nyb2xsRG93biksXG4gICAgICAgICAgICAgICAgICAgIGNvbHM6IGNhbGN1bGF0ZUZpcnN0KGN1cnJlbnRJbmRleC5jb2xzLCB0cmlnZ2VySW5kZXguY29scywgdGhpcy5maXJzdC5jb2xzLCB0aGlzLmxhc3QuY29scywgdGhpcy5udW1JdGVtc0luVmlld3BvcnQuY29scywgdGhpcy5kX251bVRvbGVyYXRlZEl0ZW1zWzFdLCBpc1Njcm9sbFJpZ2h0KVxuICAgICAgICAgICAgICAgIH07XG4gICAgICAgICAgICAgICAgbmV3TGFzdCA9IHtcbiAgICAgICAgICAgICAgICAgICAgcm93czogY2FsY3VsYXRlTGFzdChjdXJyZW50SW5kZXgucm93cywgbmV3Rmlyc3Qucm93cywgdGhpcy5sYXN0LnJvd3MsIHRoaXMubnVtSXRlbXNJblZpZXdwb3J0LnJvd3MsIHRoaXMuZF9udW1Ub2xlcmF0ZWRJdGVtc1swXSksXG4gICAgICAgICAgICAgICAgICAgIGNvbHM6IGNhbGN1bGF0ZUxhc3QoY3VycmVudEluZGV4LmNvbHMsIG5ld0ZpcnN0LmNvbHMsIHRoaXMubGFzdC5jb2xzLCB0aGlzLm51bUl0ZW1zSW5WaWV3cG9ydC5jb2xzLCB0aGlzLmRfbnVtVG9sZXJhdGVkSXRlbXNbMV0sIHRydWUpXG4gICAgICAgICAgICAgICAgfTtcblxuICAgICAgICAgICAgICAgIGlzUmFuZ2VDaGFuZ2VkID0gbmV3Rmlyc3Qucm93cyAhPT0gdGhpcy5maXJzdC5yb3dzIHx8IG5ld0xhc3Qucm93cyAhPT0gdGhpcy5sYXN0LnJvd3MgfHwgbmV3Rmlyc3QuY29scyAhPT0gdGhpcy5maXJzdC5jb2xzIHx8IG5ld0xhc3QuY29scyAhPT0gdGhpcy5sYXN0LmNvbHM7XG4gICAgICAgICAgICAgICAgbmV3U2Nyb2xsUG9zID0geyB0b3A6IHNjcm9sbFRvcCwgbGVmdDogc2Nyb2xsTGVmdCB9O1xuICAgICAgICAgICAgfVxuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgY29uc3Qgc2Nyb2xsUG9zID0gdGhpcy5ob3Jpem9udGFsID8gc2Nyb2xsTGVmdCA6IHNjcm9sbFRvcDtcbiAgICAgICAgICAgIGNvbnN0IGlzU2Nyb2xsRG93bk9yUmlnaHQgPSB0aGlzLmxhc3RTY3JvbGxQb3MgPD0gc2Nyb2xsUG9zO1xuXG4gICAgICAgICAgICBpZiAoIXRoaXMuX2FwcGVuZE9ubHkgfHwgKHRoaXMuX2FwcGVuZE9ubHkgJiYgaXNTY3JvbGxEb3duT3JSaWdodCkpIHtcbiAgICAgICAgICAgICAgICBjb25zdCBjdXJyZW50SW5kZXggPSBjYWxjdWxhdGVDdXJyZW50SW5kZXgoc2Nyb2xsUG9zLCB0aGlzLl9pdGVtU2l6ZSk7XG4gICAgICAgICAgICAgICAgY29uc3QgdHJpZ2dlckluZGV4ID0gY2FsY3VsYXRlVHJpZ2dlckluZGV4KGN1cnJlbnRJbmRleCwgdGhpcy5maXJzdCwgdGhpcy5sYXN0LCB0aGlzLm51bUl0ZW1zSW5WaWV3cG9ydCwgdGhpcy5kX251bVRvbGVyYXRlZEl0ZW1zLCBpc1Njcm9sbERvd25PclJpZ2h0KTtcblxuICAgICAgICAgICAgICAgIG5ld0ZpcnN0ID0gY2FsY3VsYXRlRmlyc3QoY3VycmVudEluZGV4LCB0cmlnZ2VySW5kZXgsIHRoaXMuZmlyc3QsIHRoaXMubGFzdCwgdGhpcy5udW1JdGVtc0luVmlld3BvcnQsIHRoaXMuZF9udW1Ub2xlcmF0ZWRJdGVtcywgaXNTY3JvbGxEb3duT3JSaWdodCk7XG4gICAgICAgICAgICAgICAgbmV3TGFzdCA9IGNhbGN1bGF0ZUxhc3QoY3VycmVudEluZGV4LCBuZXdGaXJzdCwgdGhpcy5sYXN0LCB0aGlzLm51bUl0ZW1zSW5WaWV3cG9ydCwgdGhpcy5kX251bVRvbGVyYXRlZEl0ZW1zKTtcbiAgICAgICAgICAgICAgICBpc1JhbmdlQ2hhbmdlZCA9IG5ld0ZpcnN0ICE9PSB0aGlzLmZpcnN0IHx8IG5ld0xhc3QgIT09IHRoaXMubGFzdDtcbiAgICAgICAgICAgICAgICBuZXdTY3JvbGxQb3MgPSBzY3JvbGxQb3M7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cblxuICAgICAgICByZXR1cm4ge1xuICAgICAgICAgICAgZmlyc3Q6IG5ld0ZpcnN0LFxuICAgICAgICAgICAgbGFzdDogbmV3TGFzdCxcbiAgICAgICAgICAgIGlzUmFuZ2VDaGFuZ2VkLFxuICAgICAgICAgICAgc2Nyb2xsUG9zOiBuZXdTY3JvbGxQb3NcbiAgICAgICAgfTtcbiAgICB9XG5cbiAgICBvblNjcm9sbENoYW5nZShldmVudCkge1xuICAgICAgICBjb25zdCB7IGZpcnN0LCBsYXN0LCBpc1JhbmdlQ2hhbmdlZCwgc2Nyb2xsUG9zIH0gPSB0aGlzLm9uU2Nyb2xsUG9zaXRpb25DaGFuZ2UoZXZlbnQpO1xuXG4gICAgICAgIGlmIChpc1JhbmdlQ2hhbmdlZCkge1xuICAgICAgICAgICAgY29uc3QgbmV3U3RhdGUgPSB7IGZpcnN0LCBsYXN0IH07XG5cbiAgICAgICAgICAgIHRoaXMuc2V0Q29udGVudFBvc2l0aW9uKG5ld1N0YXRlKTtcblxuICAgICAgICAgICAgdGhpcy5maXJzdCA9IGZpcnN0O1xuICAgICAgICAgICAgdGhpcy5sYXN0ID0gbGFzdDtcbiAgICAgICAgICAgIHRoaXMubGFzdFNjcm9sbFBvcyA9IHNjcm9sbFBvcztcblxuICAgICAgICAgICAgdGhpcy5oYW5kbGVFdmVudHMoJ29uU2Nyb2xsSW5kZXhDaGFuZ2UnLCBuZXdTdGF0ZSk7XG5cbiAgICAgICAgICAgIGlmICh0aGlzLl9sYXp5ICYmIHRoaXMuaXNQYWdlQ2hhbmdlZCkge1xuICAgICAgICAgICAgICAgIGNvbnN0IGxhenlMb2FkU3RhdGUgPSB7XG4gICAgICAgICAgICAgICAgICAgIGZpcnN0OiB0aGlzLl9zdGVwID8gTWF0aC5taW4odGhpcy5nZXRQYWdlQnlGaXJzdCgpICogdGhpcy5fc3RlcCwgdGhpcy5pdGVtcy5sZW5ndGggLSB0aGlzLl9zdGVwKSA6IGZpcnN0LFxuICAgICAgICAgICAgICAgICAgICBsYXN0OiBNYXRoLm1pbih0aGlzLl9zdGVwID8gKHRoaXMuZ2V0UGFnZUJ5Rmlyc3QoKSArIDEpICogdGhpcy5fc3RlcCA6IGxhc3QsIHRoaXMuaXRlbXMubGVuZ3RoKVxuICAgICAgICAgICAgICAgIH07XG4gICAgICAgICAgICAgICAgY29uc3QgaXNMYXp5U3RhdGVDaGFuZ2VkID0gdGhpcy5sYXp5TG9hZFN0YXRlLmZpcnN0ICE9PSBsYXp5TG9hZFN0YXRlLmZpcnN0IHx8IHRoaXMubGF6eUxvYWRTdGF0ZS5sYXN0ICE9PSBsYXp5TG9hZFN0YXRlLmxhc3Q7XG5cbiAgICAgICAgICAgICAgICBpc0xhenlTdGF0ZUNoYW5nZWQgJiYgdGhpcy5oYW5kbGVFdmVudHMoJ29uTGF6eUxvYWQnLCBsYXp5TG9hZFN0YXRlKTtcbiAgICAgICAgICAgICAgICB0aGlzLmxhenlMb2FkU3RhdGUgPSBsYXp5TG9hZFN0YXRlO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgfVxuXG4gICAgb25Db250YWluZXJTY3JvbGwoZXZlbnQpIHtcbiAgICAgICAgdGhpcy5oYW5kbGVFdmVudHMoJ29uU2Nyb2xsJywgeyBvcmlnaW5hbEV2ZW50OiBldmVudCB9KTtcblxuICAgICAgICBpZiAodGhpcy5fZGVsYXkgJiYgdGhpcy5pc1BhZ2VDaGFuZ2VkKSB7XG4gICAgICAgICAgICBpZiAodGhpcy5zY3JvbGxUaW1lb3V0KSB7XG4gICAgICAgICAgICAgICAgY2xlYXJUaW1lb3V0KHRoaXMuc2Nyb2xsVGltZW91dCk7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIGlmICghdGhpcy5kX2xvYWRpbmcgJiYgdGhpcy5zaG93TG9hZGVyKSB7XG4gICAgICAgICAgICAgICAgY29uc3QgeyBpc1JhbmdlQ2hhbmdlZCB9ID0gdGhpcy5vblNjcm9sbFBvc2l0aW9uQ2hhbmdlKGV2ZW50KTtcbiAgICAgICAgICAgICAgICBjb25zdCBjaGFuZ2VkID0gaXNSYW5nZUNoYW5nZWQgfHwgKHRoaXMuX3N0ZXAgPyB0aGlzLmlzUGFnZUNoYW5nZWQgOiBmYWxzZSk7XG5cbiAgICAgICAgICAgICAgICBpZiAoY2hhbmdlZCkge1xuICAgICAgICAgICAgICAgICAgICB0aGlzLmRfbG9hZGluZyA9IHRydWU7XG5cbiAgICAgICAgICAgICAgICAgICAgdGhpcy5jZC5kZXRlY3RDaGFuZ2VzKCk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICB0aGlzLnNjcm9sbFRpbWVvdXQgPSBzZXRUaW1lb3V0KCgpID0+IHtcbiAgICAgICAgICAgICAgICB0aGlzLm9uU2Nyb2xsQ2hhbmdlKGV2ZW50KTtcblxuICAgICAgICAgICAgICAgIGlmICh0aGlzLmRfbG9hZGluZyAmJiB0aGlzLnNob3dMb2FkZXIgJiYgKCF0aGlzLl9sYXp5IHx8IHRoaXMuX2xvYWRpbmcgPT09IHVuZGVmaW5lZCkpIHtcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5kX2xvYWRpbmcgPSBmYWxzZTtcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5wYWdlID0gdGhpcy5nZXRQYWdlQnlGaXJzdCgpO1xuICAgICAgICAgICAgICAgICAgICB0aGlzLmNkLmRldGVjdENoYW5nZXMoKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9LCB0aGlzLl9kZWxheSk7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAhdGhpcy5kX2xvYWRpbmcgJiYgdGhpcy5vblNjcm9sbENoYW5nZShldmVudCk7XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICBiaW5kUmVzaXplTGlzdGVuZXIoKSB7XG4gICAgICAgIGlmICghdGhpcy53aW5kb3dSZXNpemVMaXN0ZW5lcikge1xuICAgICAgICAgICAgdGhpcy56b25lLnJ1bk91dHNpZGVBbmd1bGFyKCgpID0+IHtcbiAgICAgICAgICAgICAgICB0aGlzLndpbmRvd1Jlc2l6ZUxpc3RlbmVyID0gdGhpcy5vbldpbmRvd1Jlc2l6ZS5iaW5kKHRoaXMpO1xuXG4gICAgICAgICAgICAgICAgd2luZG93LmFkZEV2ZW50TGlzdGVuZXIoJ3Jlc2l6ZScsIHRoaXMud2luZG93UmVzaXplTGlzdGVuZXIpO1xuICAgICAgICAgICAgICAgIHdpbmRvdy5hZGRFdmVudExpc3RlbmVyKCdvcmllbnRhdGlvbmNoYW5nZScsIHRoaXMud2luZG93UmVzaXplTGlzdGVuZXIpO1xuICAgICAgICAgICAgfSk7XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICB1bmJpbmRSZXNpemVMaXN0ZW5lcigpIHtcbiAgICAgICAgaWYgKHRoaXMud2luZG93UmVzaXplTGlzdGVuZXIpIHtcbiAgICAgICAgICAgIHdpbmRvdy5yZW1vdmVFdmVudExpc3RlbmVyKCdyZXNpemUnLCB0aGlzLndpbmRvd1Jlc2l6ZUxpc3RlbmVyKTtcbiAgICAgICAgICAgIHdpbmRvdy5yZW1vdmVFdmVudExpc3RlbmVyKCdvcmllbnRhdGlvbmNoYW5nZScsIHRoaXMud2luZG93UmVzaXplTGlzdGVuZXIpO1xuICAgICAgICAgICAgdGhpcy53aW5kb3dSZXNpemVMaXN0ZW5lciA9IG51bGw7XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICBvbldpbmRvd1Jlc2l6ZSgpIHtcbiAgICAgICAgaWYgKHRoaXMucmVzaXplVGltZW91dCkge1xuICAgICAgICAgICAgY2xlYXJUaW1lb3V0KHRoaXMucmVzaXplVGltZW91dCk7XG4gICAgICAgIH1cblxuICAgICAgICB0aGlzLnJlc2l6ZVRpbWVvdXQgPSBzZXRUaW1lb3V0KCgpID0+IHtcbiAgICAgICAgICAgIGlmIChEb21IYW5kbGVyLmlzVmlzaWJsZSh0aGlzLmVsZW1lbnRWaWV3Q2hpbGQ/Lm5hdGl2ZUVsZW1lbnQpKSB7XG4gICAgICAgICAgICAgICAgY29uc3QgW3dpZHRoLCBoZWlnaHRdID0gW0RvbUhhbmRsZXIuZ2V0V2lkdGgodGhpcy5lbGVtZW50Vmlld0NoaWxkLm5hdGl2ZUVsZW1lbnQpLCBEb21IYW5kbGVyLmdldEhlaWdodCh0aGlzLmVsZW1lbnRWaWV3Q2hpbGQubmF0aXZlRWxlbWVudCldO1xuICAgICAgICAgICAgICAgIGNvbnN0IFtpc0RpZmZXaWR0aCwgaXNEaWZmSGVpZ2h0XSA9IFt3aWR0aCAhPT0gdGhpcy5kZWZhdWx0V2lkdGgsIGhlaWdodCAhPT0gdGhpcy5kZWZhdWx0SGVpZ2h0XTtcbiAgICAgICAgICAgICAgICBjb25zdCByZWluaXQgPSB0aGlzLmJvdGggPyBpc0RpZmZXaWR0aCB8fCBpc0RpZmZIZWlnaHQgOiB0aGlzLmhvcml6b250YWwgPyBpc0RpZmZXaWR0aCA6IHRoaXMudmVydGljYWwgPyBpc0RpZmZIZWlnaHQgOiBmYWxzZTtcblxuICAgICAgICAgICAgICAgIHJlaW5pdCAmJlxuICAgICAgICAgICAgICAgICAgICB0aGlzLnpvbmUucnVuKCgpID0+IHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMuZF9udW1Ub2xlcmF0ZWRJdGVtcyA9IHRoaXMuX251bVRvbGVyYXRlZEl0ZW1zO1xuICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5kZWZhdWx0V2lkdGggPSB3aWR0aDtcbiAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMuZGVmYXVsdEhlaWdodCA9IGhlaWdodDtcblxuICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5pbml0KCk7XG4gICAgICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgfVxuICAgICAgICB9LCB0aGlzLl9yZXNpemVEZWxheSk7XG4gICAgfVxuXG4gICAgaGFuZGxlRXZlbnRzKG5hbWUsIHBhcmFtcykge1xuICAgICAgICByZXR1cm4gdGhpcy5vcHRpb25zICYmIHRoaXMub3B0aW9uc1tuYW1lXSA/IHRoaXMub3B0aW9uc1tuYW1lXShwYXJhbXMpIDogdGhpc1tuYW1lXS5lbWl0KHBhcmFtcyk7XG4gICAgfVxuXG4gICAgZ2V0Q29udGVudE9wdGlvbnMoKSB7XG4gICAgICAgIHJldHVybiB7XG4gICAgICAgICAgICBjb250ZW50U3R5bGVDbGFzczogYHAtc2Nyb2xsZXItY29udGVudCAke3RoaXMuZF9sb2FkaW5nID8gJ3Atc2Nyb2xsZXItbG9hZGluZycgOiAnJ31gLFxuICAgICAgICAgICAgaXRlbXM6IHRoaXMubG9hZGVkSXRlbXMsXG4gICAgICAgICAgICBnZXRJdGVtT3B0aW9uczogKGluZGV4KSA9PiB0aGlzLmdldE9wdGlvbnMoaW5kZXgpLFxuICAgICAgICAgICAgbG9hZGluZzogdGhpcy5kX2xvYWRpbmcsXG4gICAgICAgICAgICBnZXRMb2FkZXJPcHRpb25zOiAoaW5kZXgsIG9wdGlvbnM/KSA9PiB0aGlzLmdldExvYWRlck9wdGlvbnMoaW5kZXgsIG9wdGlvbnMpLFxuICAgICAgICAgICAgaXRlbVNpemU6IHRoaXMuX2l0ZW1TaXplLFxuICAgICAgICAgICAgcm93czogdGhpcy5sb2FkZWRSb3dzLFxuICAgICAgICAgICAgY29sdW1uczogdGhpcy5sb2FkZWRDb2x1bW5zLFxuICAgICAgICAgICAgc3BhY2VyU3R5bGU6IHRoaXMuc3BhY2VyU3R5bGUsXG4gICAgICAgICAgICBjb250ZW50U3R5bGU6IHRoaXMuY29udGVudFN0eWxlLFxuICAgICAgICAgICAgdmVydGljYWw6IHRoaXMudmVydGljYWwsXG4gICAgICAgICAgICBob3Jpem9udGFsOiB0aGlzLmhvcml6b250YWwsXG4gICAgICAgICAgICBib3RoOiB0aGlzLmJvdGhcbiAgICAgICAgfTtcbiAgICB9XG5cbiAgICBnZXRPcHRpb25zKHJlbmRlcmVkSW5kZXgpIHtcbiAgICAgICAgY29uc3QgY291bnQgPSAodGhpcy5faXRlbXMgfHwgW10pLmxlbmd0aDtcbiAgICAgICAgY29uc3QgaW5kZXggPSB0aGlzLmJvdGggPyB0aGlzLmZpcnN0LnJvd3MgKyByZW5kZXJlZEluZGV4IDogdGhpcy5maXJzdCArIHJlbmRlcmVkSW5kZXg7XG5cbiAgICAgICAgcmV0dXJuIHtcbiAgICAgICAgICAgIGluZGV4LFxuICAgICAgICAgICAgY291bnQsXG4gICAgICAgICAgICBmaXJzdDogaW5kZXggPT09IDAsXG4gICAgICAgICAgICBsYXN0OiBpbmRleCA9PT0gY291bnQgLSAxLFxuICAgICAgICAgICAgZXZlbjogaW5kZXggJSAyID09PSAwLFxuICAgICAgICAgICAgb2RkOiBpbmRleCAlIDIgIT09IDBcbiAgICAgICAgfTtcbiAgICB9XG5cbiAgICBnZXRMb2FkZXJPcHRpb25zKGluZGV4LCBleHRPcHRpb25zKSB7XG4gICAgICAgIGNvbnN0IGNvdW50ID0gdGhpcy5sb2FkZXJBcnIubGVuZ3RoO1xuXG4gICAgICAgIHJldHVybiB7XG4gICAgICAgICAgICBpbmRleCxcbiAgICAgICAgICAgIGNvdW50LFxuICAgICAgICAgICAgZmlyc3Q6IGluZGV4ID09PSAwLFxuICAgICAgICAgICAgbGFzdDogaW5kZXggPT09IGNvdW50IC0gMSxcbiAgICAgICAgICAgIGV2ZW46IGluZGV4ICUgMiA9PT0gMCxcbiAgICAgICAgICAgIG9kZDogaW5kZXggJSAyICE9PSAwLFxuICAgICAgICAgICAgLi4uZXh0T3B0aW9uc1xuICAgICAgICB9O1xuICAgIH1cbn1cblxuQE5nTW9kdWxlKHtcbiAgICBpbXBvcnRzOiBbQ29tbW9uTW9kdWxlXSxcbiAgICBleHBvcnRzOiBbU2Nyb2xsZXJdLFxuICAgIGRlY2xhcmF0aW9uczogW1Njcm9sbGVyXVxufSlcbmV4cG9ydCBjbGFzcyBTY3JvbGxlck1vZHVsZSB7fVxuIl19
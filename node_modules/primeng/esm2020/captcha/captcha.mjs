import { NgModule, Component, EventEmitter, Input, Output, ChangeDetectionStrategy, ViewEncapsulation } from '@angular/core';
import { CommonModule } from '@angular/common';
import * as i0 from "@angular/core";
export class Captcha {
    constructor(el, _zone, cd) {
        this.el = el;
        this._zone = _zone;
        this.cd = cd;
        this.siteKey = null;
        this.theme = 'light';
        this.type = 'image';
        this.size = 'normal';
        this.tabindex = 0;
        this.initCallback = 'initRecaptcha';
        this.onResponse = new EventEmitter();
        this.onExpire = new EventEmitter();
        this._instance = null;
        this._language = null;
    }
    get language() {
        return this._language;
    }
    set language(language) {
        this._language = language;
        this.init();
    }
    ngAfterViewInit() {
        if (window.grecaptcha) {
            if (!window.grecaptcha.render) {
                setTimeout(() => {
                    this.init();
                }, 100);
            }
            else {
                this.init();
            }
        }
        else {
            window[this.initCallback] = () => {
                this.init();
            };
        }
    }
    init() {
        this._instance = window.grecaptcha.render(this.el.nativeElement.children[0], {
            sitekey: this.siteKey,
            theme: this.theme,
            type: this.type,
            size: this.size,
            tabindex: this.tabindex,
            hl: this.language,
            callback: (response) => {
                this._zone.run(() => this.recaptchaCallback(response));
            },
            'expired-callback': () => {
                this._zone.run(() => this.recaptchaExpiredCallback());
            }
        });
    }
    reset() {
        if (this._instance === null)
            return;
        window.grecaptcha.reset(this._instance);
        this.cd.markForCheck();
    }
    getResponse() {
        if (this._instance === null)
            return null;
        return window.grecaptcha.getResponse(this._instance);
    }
    recaptchaCallback(response) {
        this.onResponse.emit({
            response: response
        });
    }
    recaptchaExpiredCallback() {
        this.onExpire.emit();
    }
    ngOnDestroy() {
        if (this._instance != null) {
            window.grecaptcha.reset(this._instance);
        }
    }
}
Captcha.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "14.0.7", ngImport: i0, type: Captcha, deps: [{ token: i0.ElementRef }, { token: i0.NgZone }, { token: i0.ChangeDetectorRef }], target: i0.ɵɵFactoryTarget.Component });
Captcha.ɵcmp = i0.ɵɵngDeclareComponent({ minVersion: "14.0.0", version: "14.0.7", type: Captcha, selector: "p-captcha", inputs: { siteKey: "siteKey", theme: "theme", type: "type", size: "size", tabindex: "tabindex", initCallback: "initCallback", language: "language" }, outputs: { onResponse: "onResponse", onExpire: "onExpire" }, host: { classAttribute: "p-element" }, ngImport: i0, template: `<div></div>`, isInline: true, changeDetection: i0.ChangeDetectionStrategy.OnPush, encapsulation: i0.ViewEncapsulation.None });
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "14.0.7", ngImport: i0, type: Captcha, decorators: [{
            type: Component,
            args: [{
                    selector: 'p-captcha',
                    template: `<div></div>`,
                    changeDetection: ChangeDetectionStrategy.OnPush,
                    encapsulation: ViewEncapsulation.None,
                    host: {
                        class: 'p-element'
                    }
                }]
        }], ctorParameters: function () { return [{ type: i0.ElementRef }, { type: i0.NgZone }, { type: i0.ChangeDetectorRef }]; }, propDecorators: { siteKey: [{
                type: Input
            }], theme: [{
                type: Input
            }], type: [{
                type: Input
            }], size: [{
                type: Input
            }], tabindex: [{
                type: Input
            }], initCallback: [{
                type: Input
            }], onResponse: [{
                type: Output
            }], onExpire: [{
                type: Output
            }], language: [{
                type: Input
            }] } });
export class CaptchaModule {
}
CaptchaModule.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "14.0.7", ngImport: i0, type: CaptchaModule, deps: [], target: i0.ɵɵFactoryTarget.NgModule });
CaptchaModule.ɵmod = i0.ɵɵngDeclareNgModule({ minVersion: "14.0.0", version: "14.0.7", ngImport: i0, type: CaptchaModule, declarations: [Captcha], imports: [CommonModule], exports: [Captcha] });
CaptchaModule.ɵinj = i0.ɵɵngDeclareInjector({ minVersion: "12.0.0", version: "14.0.7", ngImport: i0, type: CaptchaModule, imports: [CommonModule] });
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "14.0.7", ngImport: i0, type: CaptchaModule, decorators: [{
            type: NgModule,
            args: [{
                    imports: [CommonModule],
                    exports: [Captcha],
                    declarations: [Captcha]
                }]
        }] });
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiY2FwdGNoYS5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uL3NyYy9hcHAvY29tcG9uZW50cy9jYXB0Y2hhL2NhcHRjaGEudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUEsT0FBTyxFQUFFLFFBQVEsRUFBaUIsU0FBUyxFQUFFLFlBQVksRUFBRSxLQUFLLEVBQXFCLE1BQU0sRUFBYyx1QkFBdUIsRUFBRSxpQkFBaUIsRUFBcUIsTUFBTSxlQUFlLENBQUM7QUFDOUwsT0FBTyxFQUFFLFlBQVksRUFBRSxNQUFNLGlCQUFpQixDQUFDOztBQVcvQyxNQUFNLE9BQU8sT0FBTztJQThCaEIsWUFBbUIsRUFBYyxFQUFTLEtBQWEsRUFBUyxFQUFxQjtRQUFsRSxPQUFFLEdBQUYsRUFBRSxDQUFZO1FBQVMsVUFBSyxHQUFMLEtBQUssQ0FBUTtRQUFTLE9BQUUsR0FBRixFQUFFLENBQW1CO1FBN0I1RSxZQUFPLEdBQVcsSUFBSSxDQUFDO1FBRXZCLFVBQUssR0FBRyxPQUFPLENBQUM7UUFFaEIsU0FBSSxHQUFHLE9BQU8sQ0FBQztRQUVmLFNBQUksR0FBRyxRQUFRLENBQUM7UUFFaEIsYUFBUSxHQUFHLENBQUMsQ0FBQztRQUViLGlCQUFZLEdBQUcsZUFBZSxDQUFDO1FBRTlCLGVBQVUsR0FBc0IsSUFBSSxZQUFZLEVBQUUsQ0FBQztRQUVuRCxhQUFRLEdBQXNCLElBQUksWUFBWSxFQUFFLENBQUM7UUFFbkQsY0FBUyxHQUFRLElBQUksQ0FBQztRQUV0QixjQUFTLEdBQVEsSUFBSSxDQUFDO0lBVzBELENBQUM7SUFUekYsSUFBYSxRQUFRO1FBQ2pCLE9BQU8sSUFBSSxDQUFDLFNBQVMsQ0FBQztJQUMxQixDQUFDO0lBRUQsSUFBSSxRQUFRLENBQUMsUUFBZ0I7UUFDekIsSUFBSSxDQUFDLFNBQVMsR0FBRyxRQUFRLENBQUM7UUFDMUIsSUFBSSxDQUFDLElBQUksRUFBRSxDQUFDO0lBQ2hCLENBQUM7SUFJRCxlQUFlO1FBQ1gsSUFBVSxNQUFP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QUk7c0JBQVosS0FBSztnQkFFRyxJQUFJO3NCQUFaLEtBQUs7Z0JBRUcsUUFBUTtzQkFBaEIsS0FBSztnQkFFRyxZQUFZO3NCQUFwQixLQUFLO2dCQUVJLFVBQVU7c0JBQW5CLE1BQU07Z0JBRUcsUUFBUTtzQkFBakIsTUFBTTtnQkFNTSxRQUFRO3NCQUFwQixLQUFLOztBQStFVixNQUFNLE9BQU8sYUFBYTs7MEdBQWIsYUFBYTsyR0FBYixhQUFhLGlCQXBHYixPQUFPLGFBZ0dOLFlBQVksYUFoR2IsT0FBTzsyR0FvR1AsYUFBYSxZQUpaLFlBQVk7MkZBSWIsYUFBYTtrQkFMekIsUUFBUTttQkFBQztvQkFDTixPQUFPLEVBQUUsQ0FBQyxZQUFZLENBQUM7b0JBQ3ZCLE9BQU8sRUFBRSxDQUFDLE9BQU8sQ0FBQztvQkFDbEIsWUFBWSxFQUFFLENBQUMsT0FBTyxDQUFDO2lCQUMxQiIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7IE5nTW9kdWxlLCBBZnRlclZpZXdJbml0LCBDb21wb25lbnQsIEV2ZW50RW1pdHRlciwgSW5wdXQsIE5nWm9uZSwgT25EZXN0cm95LCBPdXRwdXQsIEVsZW1lbnRSZWYsIENoYW5nZURldGVjdGlvblN0cmF0ZWd5LCBWaWV3RW5jYXBzdWxhdGlvbiwgQ2hhbmdlRGV0ZWN0b3JSZWYgfSBmcm9tICdAYW5ndWxhci9jb3JlJztcbmltcG9ydCB7IENvbW1vbk1vZHVsZSB9IGZyb20gJ0Bhbmd1bGFyL2NvbW1vbic7XG5cbkBDb21wb25lbnQoe1xuICAgIHNlbGVjdG9yOiAncC1jYXB0Y2hhJyxcbiAgICB0ZW1wbGF0ZTogYDxkaXY+PC9kaXY+YCxcbiAgICBjaGFuZ2VEZXRlY3Rpb246IENoYW5nZURldGVjdGlvblN0cmF0ZWd5Lk9uUHVzaCxcbiAgICBlbmNhcHN1bGF0aW9uOiBWaWV3RW5jYXBzdWxhdGlvbi5Ob25lLFxuICAgIGhvc3Q6IHtcbiAgICAgICAgY2xhc3M6ICdwLWVsZW1lbnQnXG4gICAgfVxufSlcbmV4cG9ydCBjbGFzcyBDYXB0Y2hhIGltcGxlbWVudHMgQWZ0ZXJWaWV3SW5pdCwgT25EZXN0cm95IHtcbiAgICBASW5wdXQoKSBzaXRlS2V5OiBzdHJpbmcgPSBudWxsO1xuXG4gICAgQElucHV0KCkgdGhlbWUgPSAnbGlnaHQnO1xuXG4gICAgQElucHV0KCkgdHlwZSA9ICdpbWFnZSc7XG5cbiAgICBASW5wdXQoKSBzaXplID0gJ25vcm1hbCc7XG5cbiAgICBASW5wdXQoKSB0YWJpbmRleCA9IDA7XG5cbiAgICBASW5wdXQoKSBpbml0Q2FsbGJhY2sgPSAnaW5pdFJlY2FwdGNoYSc7XG5cbiAgICBAT3V0cHV0KCkgb25SZXNwb25zZTogRXZlbnRFbWl0dGVyPGFueT4gPSBuZXcgRXZlbnRFbWl0dGVyKCk7XG5cbiAgICBAT3V0cHV0KCkgb25FeHBpcmU6IEV2ZW50RW1pdHRlcjxhbnk+ID0gbmV3IEV2ZW50RW1pdHRlcigpO1xuXG4gICAgcHJpdmF0ZSBfaW5zdGFuY2U6IGFueSA9IG51bGw7XG5cbiAgICBwcml2YXRlIF9sYW5ndWFnZTogYW55ID0gbnVsbDtcblxuICAgIEBJbnB1dCgpIGdldCBsYW5ndWFnZSgpOiBzdHJpbmcge1xuICAgICAgICByZXR1cm4gdGhpcy5fbGFuZ3VhZ2U7XG4gICAgfVxuXG4gICAgc2V0IGxhbmd1YWdlKGxhbmd1YWdlOiBzdHJpbmcpIHtcbiAgICAgICAgdGhpcy5fbGFuZ3VhZ2UgPSBsYW5ndWFnZTtcbiAgICAgICAgdGhpcy5pbml0KCk7XG4gICAgfVxuXG4gICAgY29uc3RydWN0b3IocHVibGljIGVsOiBFbGVtZW50UmVmLCBwdWJsaWMgX3pvbmU6IE5nWm9uZSwgcHVibGljIGNkOiBDaGFuZ2VEZXRlY3RvclJlZikge31cblxuICAgIG5nQWZ0ZXJWaWV3SW5pdCgpIHtcbiAgICAgICAgaWYgKCg8YW55PndpbmRvdykuZ3JlY2FwdGNoYSkge1xuICAgICAgICAgICAgaWYgKCEoPGFueT53aW5kb3cpLmdyZWNhcHRjaGEucmVuZGVyKSB7XG4gICAgICAgICAgICAgICAgc2V0VGltZW91dCgoKSA9PiB7XG4gICAgICAgICAgICAgICAgICAgIHRoaXMuaW5pdCgpO1xuICAgICAgICAgICAgICAgIH0sIDEwMCk7XG4gICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgIHRoaXMuaW5pdCgpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgKDxhbnk+d2luZG93KVt0aGlzLmluaXRDYWxsYmFja10gPSAoKSA9PiB7XG4gICAgICAgICAgICAgICAgdGhpcy5pbml0KCk7XG4gICAgICAgICAgICB9O1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgaW5pdCgpIHtcbiAgICAgICAgdGhpcy5faW5zdGFuY2UgPSAoPGFueT53aW5kb3cpLmdyZWNhcHRjaGEucmVuZGVyKHRoaXMuZWwubmF0aXZlRWxlbWVudC5jaGlsZHJlblswXSwge1xuICAgICAgICAgICAgc2l0ZWtleTogdGhpcy5zaXRlS2V5LFxuICAgICAgICAgICAgdGhlbWU6IHRoaXMudGhlbWUsXG4gICAgICAgICAgICB0eXBlOiB0aGlzLnR5cGUsXG4gICAgICAgICAgICBzaXplOiB0aGlzLnNpemUsXG4gICAgICAgICAgICB0YWJpbmRleDogdGhpcy50YWJpbmRleCxcbiAgICAgICAgICAgIGhsOiB0aGlzLmxhbmd1YWdlLFxuICAgICAgICAgICAgY2FsbGJhY2s6IChyZXNwb25zZTogc3RyaW5nKSA9PiB7XG4gICAgICAgICAgICAgICAgdGhpcy5fem9uZS5ydW4oKCkgPT4gdGhpcy5yZWNhcHRjaGFDYWxsYmFjayhyZXNwb25zZSkpO1xuICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICdleHBpcmVkLWNhbGxiYWNrJzogKCkgPT4ge1xuICAgICAgICAgICAgICAgIHRoaXMuX3pvbmUucnVuKCgpID0+IHRoaXMucmVjYXB0Y2hhRXhwaXJlZENhbGxiYWNrKCkpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9KTtcbiAgICB9XG5cbiAgICByZXNldCgpIHtcbiAgICAgICAgaWYgKHRoaXMuX2luc3RhbmNlID09PSBudWxsKSByZXR1cm47XG5cbiAgICAgICAgKDxhbnk+d2luZG93KS5ncmVjYXB0Y2hhLnJlc2V0KHRoaXMuX2luc3RhbmNlKTtcbiAgICAgICAgdGhpcy5jZC5tYXJrRm9yQ2hlY2soKTtcbiAgICB9XG5cbiAgICBnZXRSZXNwb25zZSgpOiBTdHJpbmcge1xuICAgICAgICBpZiAodGhpcy5faW5zdGFuY2UgPT09IG51bGwpIHJldHVybiBudWxsO1xuXG4gICAgICAgIHJldHVybiAoPGFueT53aW5kb3cpLmdyZWNhcHRjaGEuZ2V0UmVzcG9uc2UodGhpcy5faW5zdGFuY2UpO1xuICAgIH1cblxuICAgIHJlY2FwdGNoYUNhbGxiYWNrKHJlc3BvbnNlOiBzdHJpbmcpIHtcbiAgICAgICAgdGhpcy5vblJlc3BvbnNlLmVtaXQoe1xuICAgICAgICAgICAgcmVzcG9uc2U6IHJlc3BvbnNlXG4gICAgICAgIH0pO1xuICAgIH1cblxuICAgIHJlY2FwdGNoYUV4cGlyZWRDYWxsYmFjaygpIHtcbiAgICAgICAgdGhpcy5vbkV4cGlyZS5lbWl0KCk7XG4gICAgfVxuXG4gICAgbmdPbkRlc3Ryb3koKSB7XG4gICAgICAgIGlmICh0aGlzLl9pbnN0YW5jZSAhPSBudWxsKSB7XG4gICAgICAgICAgICAoPGFueT53aW5kb3cpLmdyZWNhcHRjaGEucmVzZXQodGhpcy5faW5zdGFuY2UpO1xuICAgICAgICB9XG4gICAgfVxufVxuXG5ATmdNb2R1bGUoe1xuICAgIGltcG9ydHM6IFtDb21tb25Nb2R1bGVdLFxuICAgIGV4cG9ydHM6IFtDYXB0Y2hhXSxcbiAgICBkZWNsYXJhdGlvbnM6IFtDYXB0Y2hhXVxufSlcbmV4cG9ydCBjbGFzcyBDYXB0Y2hhTW9kdWxlIHt9XG4iXX0=
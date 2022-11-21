import { CommonModule } from '@angular/common';
import { NgModule, Directive, Input } from '@angular/core';
import { DomHandler } from 'primeng/dom';
import * as i0 from "@angular/core";
export class StyleClass {
    constructor(el, renderer) {
        this.el = el;
        this.renderer = renderer;
    }
    ngAfterViewInit() {
        this.eventListener = this.renderer.listen(this.el.nativeElement, 'click', () => {
            this.target = this.resolveTarget();
            if (this.toggleClass) {
                if (DomHandler.hasClass(this.target, this.toggleClass))
                    DomHandler.removeClass(this.target, this.toggleClass);
                else
                    DomHandler.addClass(this.target, this.toggleClass);
            }
            else {
                if (this.target.offsetParent === null)
                    this.enter();
                else
                    this.leave();
            }
        });
    }
    enter() {
        if (this.enterActiveClass) {
            if (!this.animating) {
                this.animating = true;
                if (this.enterActiveClass === 'slidedown') {
                    this.target.style.height = '0px';
                    DomHandler.removeClass(this.target, 'hidden');
                    this.target.style.maxHeight = this.target.scrollHeight + 'px';
                    DomHandler.addClass(this.target, 'hidden');
                    this.target.style.height = '';
                }
                DomHandler.addClass(this.target, this.enterActiveClass);
                if (this.enterClass) {
                    DomHandler.removeClass(this.target, this.enterClass);
                }
                this.enterListener = this.renderer.listen(this.target, 'animationend', () => {
                    DomHandler.removeClass(this.target, this.enterActiveClass);
                    if (this.enterToClass) {
                        DomHandler.addClass(this.target, this.enterToClass);
                    }
                    this.enterListener();
                    if (this.enterActiveClass === 'slidedown') {
                        this.target.style.maxHeight = '';
                    }
                    this.animating = false;
                });
            }
        }
        else {
            if (this.enterClass) {
                DomHandler.removeClass(this.target, this.enterClass);
            }
            if (this.enterToClass) {
                DomHandler.addClass(this.target, this.enterToClass);
            }
        }
        if (this.hideOnOutsideClick) {
            this.bindDocumentListener();
        }
    }
    leave() {
        if (this.leaveActiveClass) {
            if (!this.animating) {
                this.animating = true;
                DomHandler.addClass(this.target, this.leaveActiveClass);
                if (this.leaveClass) {
                    DomHandler.removeClass(this.target, this.leaveClass);
                }
                this.leaveListener = this.renderer.listen(this.target, 'animationend', () => {
                    DomHandler.removeClass(this.target, this.leaveActiveClass);
                    if (this.leaveToClass) {
                        DomHandler.addClass(this.target, this.leaveToClass);
                    }
                    this.leaveListener();
                    this.animating = false;
                });
            }
        }
        else {
            if (this.leaveClass) {
                DomHandler.removeClass(this.target, this.leaveClass);
            }
            if (this.leaveToClass) {
                DomHandler.addClass(this.target, this.leaveToClass);
            }
        }
        if (this.hideOnOutsideClick) {
            this.unbindDocumentListener();
        }
    }
    resolveTarget() {
        if (this.target) {
            return this.target;
        }
        switch (this.selector) {
            case '@next':
                return this.el.nativeElement.nextElementSibling;
            case '@prev':
                return this.el.nativeElement.previousElementSibling;
            case '@parent':
                return this.el.nativeElement.parentElement;
            case '@grandparent':
                return this.el.nativeElement.parentElement.parentElement;
            default:
                return document.querySelector(this.selector);
        }
    }
    bindDocumentListener() {
        if (!this.documentListener) {
            this.documentListener = this.renderer.listen(this.el.nativeElement.ownerDocument, 'click', (event) => {
                if (!this.isVisible() || getComputedStyle(this.target).getPropertyValue('position') === 'static')
                    this.unbindDocumentListener();
                else if (this.isOutsideClick(event))
                    this.leave();
            });
        }
    }
    isVisible() {
        return this.target.offsetParent !== null;
    }
    isOutsideClick(event) {
        return !this.el.nativeElement.isSameNode(event.target) && !this.el.nativeElement.contains(event.target) && !this.target.contains(event.target);
    }
    unbindDocumentListener() {
        if (this.documentListener) {
            this.documentListener();
            this.documentListener = null;
        }
    }
    ngOnDestroy() {
        this.target = null;
        if (this.eventListener) {
            this.eventListener();
        }
        this.unbindDocumentListener();
    }
}
StyleClass.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "14.0.7", ngImport: i0, type: StyleClass, deps: [{ token: i0.ElementRef }, { token: i0.Renderer2 }], target: i0.ɵɵFactoryTarget.Directive });
StyleClass.ɵdir = i0.ɵɵngDeclareDirective({ minVersion: "14.0.0", version: "14.0.7", type: StyleClass, selector: "[pStyleClass]", inputs: { selector: ["pStyleClass", "selector"], enterClass: "enterClass", enterActiveClass: "enterActiveClass", enterToClass: "enterToClass", leaveClass: "leaveClass", leaveActiveClass: "leaveActiveClass", leaveToClass: "leaveToClass", hideOnOutsideClick: "hideOnOutsideClick", toggleClass: "toggleClass" }, host: { classAttribute: "p-element" }, ngImport: i0 });
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "14.0.7", ngImport: i0, type: StyleClass, decorators: [{
            type: Directive,
            args: [{
                    selector: '[pStyleClass]',
                    host: {
                        class: 'p-element'
                    }
                }]
        }], ctorParameters: function () { return [{ type: i0.ElementRef }, { type: i0.Renderer2 }]; }, propDecorators: { selector: [{
                type: Input,
                args: ['pStyleClass']
            }], enterClass: [{
                type: Input
            }], enterActiveClass: [{
                type: Input
            }], enterToClass: [{
                type: Input
            }], leaveClass: [{
                type: Input
            }], leaveActiveClass: [{
                type: Input
            }], leaveToClass: [{
                type: Input
            }], hideOnOutsideClick: [{
                type: Input
            }], toggleClass: [{
                type: Input
            }] } });
export class StyleClassModule {
}
StyleClassModule.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "14.0.7", ngImport: i0, type: StyleClassModule, deps: [], target: i0.ɵɵFactoryTarget.NgModule });
StyleClassModule.ɵmod = i0.ɵɵngDeclareNgModule({ minVersion: "14.0.0", version: "14.0.7", ngImport: i0, type: StyleClassModule, declarations: [StyleClass], imports: [CommonModule], exports: [StyleClass] });
StyleClassModule.ɵinj = i0.ɵɵngDeclareInjector({ minVersion: "12.0.0", version: "14.0.7", ngImport: i0, type: StyleClassModule, imports: [CommonModule] });
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "14.0.7", ngImport: i0, type: StyleClassModule, decorators: [{
            type: NgModule,
            args: [{
                    imports: [CommonModule],
                    exports: [StyleClass],
                    declarations: [StyleClass]
                }]
        }] });
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoic3R5bGVjbGFzcy5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uL3NyYy9hcHAvY29tcG9uZW50cy9zdHlsZWNsYXNzL3N0eWxlY2xhc3MudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUEsT0FBTyxFQUFFLFlBQVksRUFBRSxNQUFNLGlCQUFpQixDQUFDO0FBQy9DLE9BQU8sRUFBRSxRQUFRLEVBQUUsU0FBUyxFQUFjLEtBQUssRUFBdUMsTUFBTSxlQUFlLENBQUM7QUFDNUcsT0FBTyxFQUFFLFVBQVUsRUFBRSxNQUFNLGFBQWEsQ0FBQzs7QUFRekMsTUFBTSxPQUFPLFVBQVU7SUFDbkIsWUFBbUIsRUFBYyxFQUFTLFFBQW1CO1FBQTFDLE9BQUUsR0FBRixFQUFFLENBQVk7UUFBUyxhQUFRLEdBQVIsUUFBUSxDQUFXO0lBQUcsQ0FBQztJQWdDakUsZUFBZTtRQUNYLElBQUksQ0FBQyxhQUFhLEdBQUcsSUFBSSxDQUFDLFFBQVEsQ0FBQyxNQUFNLENBQUMsSUFBSSxDQUFDLEVBQUUsQ0FBQyxhQUFhLEVBQUUsT0FBTyxFQUFFLEdBQUcsRUFBRTtZQUMzRSxJQUFJLENBQUMsTUFBTSxHQUFHLElBQUksQ0FBQyxhQUFhLEVBQUUsQ0FBQztZQUVuQyxJQUFJLElBQUksQ0FBQyxXQUFXLEVBQUU7Z0JBQ2xCLElBQUksVUFBVSxDQUFDLFFBQVEsQ0FBQyxJQUFJLENBQUMsTUFBTSxFQUFFLElBQUksQ0FBQyxXQUFXLENBQUM7b0JBQUUsVUFBVSxDQUFDLFdBQVcsQ0FBQyxJQUFJLENBQUMsTUFBTSxFQUFFLElBQUksQ0FBQyxXQUFXLENBQUMsQ0FBQzs7b0JBQ3pHLFVBQVUsQ0FBQyxRQUFRLENBQUMsSUFBSSxDQUFDLE1BQU0sRUFBRSxJQUFJLENBQUMsV0FBVyxDQUFDLENBQUM7YUFDM0Q7aUJBQU07Z0JBQ0gsSUFBSSxJQUFJLENBQUMsTUFBTSxDQUFDLFlBQVksS0FBSyxJQUFJO29CQUFFLElBQUksQ0FBQyxLQUFLLEVBQUUsQ0FB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Z0I7a0JBTDVCLFFBQVE7bUJBQUM7b0JBQ04sT0FBTyxFQUFFLENBQUMsWUFBWSxDQUFDO29CQUN2QixPQUFPLEVBQUUsQ0FBQyxVQUFVLENBQUM7b0JBQ3JCLFlBQVksRUFBRSxDQUFDLFVBQVUsQ0FBQztpQkFDN0IiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgeyBDb21tb25Nb2R1bGUgfSBmcm9tICdAYW5ndWxhci9jb21tb24nO1xuaW1wb3J0IHsgTmdNb2R1bGUsIERpcmVjdGl2ZSwgRWxlbWVudFJlZiwgSW5wdXQsIFJlbmRlcmVyMiwgT25EZXN0cm95LCBBZnRlclZpZXdJbml0IH0gZnJvbSAnQGFuZ3VsYXIvY29yZSc7XG5pbXBvcnQgeyBEb21IYW5kbGVyIH0gZnJvbSAncHJpbWVuZy9kb20nO1xuXG5ARGlyZWN0aXZlKHtcbiAgICBzZWxlY3RvcjogJ1twU3R5bGVDbGFzc10nLFxuICAgIGhvc3Q6IHtcbiAgICAgICAgY2xhc3M6ICdwLWVsZW1lbnQnXG4gICAgfVxufSlcbmV4cG9ydCBjbGFzcyBTdHlsZUNsYXNzIGltcGxlbWVudHMgQWZ0ZXJWaWV3SW5pdCwgT25EZXN0cm95IHtcbiAgICBjb25zdHJ1Y3RvcihwdWJsaWMgZWw6IEVsZW1lbnRSZWYsIHB1YmxpYyByZW5kZXJlcjogUmVuZGVyZXIyKSB7fVxuXG4gICAgQElucHV0KCdwU3R5bGVDbGFzcycpIHNlbGVjdG9yOiBzdHJpbmc7XG5cbiAgICBASW5wdXQoKSBlbnRlckNsYXNzOiBzdHJpbmc7XG5cbiAgICBASW5wdXQoKSBlbnRlckFjdGl2ZUNsYXNzOiBzdHJpbmc7XG5cbiAgICBASW5wdXQoKSBlbnRlclRvQ2xhc3M6IHN0cmluZztcblxuICAgIEBJbnB1dCgpIGxlYXZlQ2xhc3M6IHN0cmluZztcblxuICAgIEBJbnB1dCgpIGxlYXZlQWN0aXZlQ2xhc3M6IHN0cmluZztcblxuICAgIEBJbnB1dCgpIGxlYXZlVG9DbGFzczogc3RyaW5nO1xuXG4gICAgQElucHV0KCkgaGlkZU9uT3V0c2lkZUNsaWNrOiBib29sZWFuO1xuXG4gICAgQElucHV0KCkgdG9nZ2xlQ2xhc3M6IHN0cmluZztcblxuICAgIGV2ZW50TGlzdGVuZXI6IEZ1bmN0aW9uO1xuXG4gICAgZG9jdW1lbnRMaXN0ZW5lcjogRnVuY3Rpb247XG5cbiAgICB0YXJnZXQ6IEhUTUxFbGVtZW50O1xuXG4gICAgZW50ZXJMaXN0ZW5lcjogRnVuY3Rpb247XG5cbiAgICBsZWF2ZUxpc3RlbmVyOiBGdW5jdGlvbjtcblxuICAgIGFuaW1hdGluZzogYm9vbGVhbjtcblxuICAgIG5nQWZ0ZXJWaWV3SW5pdCgpIHtcbiAgICAgICAgdGhpcy5ldmVudExpc3RlbmVyID0gdGhpcy5yZW5kZXJlci5saXN0ZW4odGhpcy5lbC5uYXRpdmVFbGVtZW50LCAnY2xpY2snLCAoKSA9PiB7XG4gICAgICAgICAgICB0aGlzLnRhcmdldCA9IHRoaXMucmVzb2x2ZVRhcmdldCgpO1xuXG4gICAgICAgICAgICBpZiAodGhpcy50b2dnbGVDbGFzcykge1xuICAgICAgICAgICAgICAgIGlmIChEb21IYW5kbGVyLmhhc0NsYXNzKHRoaXMudGFyZ2V0LCB0aGlzLnRvZ2dsZUNsYXNzKSkgRG9tSGFuZGxlci5yZW1vdmVDbGFzcyh0aGlzLnRhcmdldCwgdGhpcy50b2dnbGVDbGFzcyk7XG4gICAgICAgICAgICAgICAgZWxzZSBEb21IYW5kbGVyLmFkZENsYXNzKHRoaXMudGFyZ2V0LCB0aGlzLnRvZ2dsZUNsYXNzKTtcbiAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgaWYgKHRoaXMudGFyZ2V0Lm9mZnNldFBhcmVudCA9PT0gbnVsbCkgdGhpcy5lbnRlcigpO1xuICAgICAgICAgICAgICAgIGVsc2UgdGhpcy5sZWF2ZSgpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9KTtcbiAgICB9XG5cbiAgICBlbnRlcigpIHtcbiAgICAgICAgaWYgKHRoaXMuZW50ZXJBY3RpdmVDbGFzcykge1xuICAgICAgICAgICAgaWYgKCF0aGlzLmFuaW1hdGluZykge1xuICAgICAgICAgICAgICAgIHRoaXMuYW5pbWF0aW5nID0gdHJ1ZTtcblxuICAgICAgICAgICAgICAgIGlmICh0aGlzLmVudGVyQWN0aXZlQ2xhc3MgPT09ICdzbGlkZWRvd24nKSB7XG4gICAgICAgICAgICAgICAgICAgIHRoaXMudGFyZ2V0LnN0eWxlLmhlaWdodCA9ICcwcHgnO1xuICAgICAgICAgICAgICAgICAgICBEb21IYW5kbGVyLnJlbW92ZUNsYXNzKHRoaXMudGFyZ2V0LCAnaGlkZGVuJyk7XG4gICAgICAgICAgICAgICAgICAgIHRoaXMudGFyZ2V0LnN0eWxlLm1heEhlaWdodCA9IHRoaXMudGFyZ2V0LnNjcm9sbEhlaWdodCArICdweCc7XG4gICAgICAgICAgICAgICAgICAgIERvbUhhbmRsZXIuYWRkQ2xhc3ModGhpcy50YXJnZXQsICdoaWRkZW4nKTtcbiAgICAgICAgICAgICAgICAgICAgdGhpcy50YXJnZXQuc3R5bGUuaGVpZ2h0ID0gJyc7XG4gICAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAgICAgRG9tSGFuZGxlci5hZGRDbGFzcyh0aGlzLnRhcmdldCwgdGhpcy5lbnRlckFjdGl2ZUNsYXNzKTtcbiAgICAgICAgICAgICAgICBpZiAodGhpcy5lbnRlckNsYXNzKSB7XG4gICAgICAgICAgICAgICAgICAgIERvbUhhbmRsZXIucmVtb3ZlQ2xhc3ModGhpcy50YXJnZXQsIHRoaXMuZW50ZXJDbGFzcyk7XG4gICAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAgICAgdGhpcy5lbnRlckxpc3RlbmVyID0gdGhpcy5yZW5kZXJlci5saXN0ZW4odGhpcy50YXJnZXQsICdhbmltYXRpb25lbmQnLCAoKSA9PiB7XG4gICAgICAgICAgICAgICAgICAgIERvbUhhbmRsZXIucmVtb3ZlQ2xhc3ModGhpcy50YXJnZXQsIHRoaXMuZW50ZXJBY3RpdmVDbGFzcyk7XG4gICAgICAgICAgICAgICAgICAgIGlmICh0aGlzLmVudGVyVG9DbGFzcykge1xuICAgICAgICAgICAgICAgICAgICAgICAgRG9tSGFuZGxlci5hZGRDbGFzcyh0aGlzLnRhcmdldCwgdGhpcy5lbnRlclRvQ2xhc3MpO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgIHRoaXMuZW50ZXJMaXN0ZW5lcigpO1xuXG4gICAgICAgICAgICAgICAgICAgIGlmICh0aGlzLmVudGVyQWN0aXZlQ2xhc3MgPT09ICdzbGlkZWRvd24nKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICB0aGlzLnRhcmdldC5zdHlsZS5tYXhIZWlnaHQgPSAnJztcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICB0aGlzLmFuaW1hdGluZyA9IGZhbHNlO1xuICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgfVxuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgaWYgKHRoaXMuZW50ZXJDbGFzcykge1xuICAgICAgICAgICAgICAgIERvbUhhbmRsZXIucmVtb3ZlQ2xhc3ModGhpcy50YXJnZXQsIHRoaXMuZW50ZXJDbGFzcyk7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIGlmICh0aGlzLmVudGVyVG9DbGFzcykge1xuICAgICAgICAgICAgICAgIERvbUhhbmRsZXIuYWRkQ2xhc3ModGhpcy50YXJnZXQsIHRoaXMuZW50ZXJUb0NsYXNzKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuXG4gICAgICAgIGlmICh0aGlzLmhpZGVPbk91dHNpZGVDbGljaykge1xuICAgICAgICAgICAgdGhpcy5iaW5kRG9jdW1lbnRMaXN0ZW5lcigpO1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgbGVhdmUoKSB7XG4gICAgICAgIGlmICh0aGlzLmxlYXZlQWN0aXZlQ2xhc3MpIHtcbiAgICAgICAgICAgIGlmICghdGhpcy5hbmltYXRpbmcpIHtcbiAgICAgICAgICAgICAgICB0aGlzLmFuaW1hdGluZyA9IHRydWU7XG4gICAgICAgICAgICAgICAgRG9tSGFuZGxlci5hZGRDbGFzcyh0aGlzLnRhcmdldCwgdGhpcy5sZWF2ZUFjdGl2ZUNsYXNzKTtcbiAgICAgICAgICAgICAgICBpZiAodGhpcy5sZWF2ZUNsYXNzKSB7XG4gICAgICAgICAgICAgICAgICAgIERvbUhhbmRsZXIucmVtb3ZlQ2xhc3ModGhpcy50YXJnZXQsIHRoaXMubGVhdmVDbGFzcyk7XG4gICAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAgICAgdGhpcy5sZWF2ZUxpc3RlbmVyID0gdGhpcy5yZW5kZXJlci5saXN0ZW4odGhpcy50YXJnZXQsICdhbmltYXRpb25lbmQnLCAoKSA9PiB7XG4gICAgICAgICAgICAgICAgICAgIERvbUhhbmRsZXIucmVtb3ZlQ2xhc3ModGhpcy50YXJnZXQsIHRoaXMubGVhdmVBY3RpdmVDbGFzcyk7XG4gICAgICAgICAgICAgICAgICAgIGlmICh0aGlzLmxlYXZlVG9DbGFzcykge1xuICAgICAgICAgICAgICAgICAgICAgICAgRG9tSGFuZGxlci5hZGRDbGFzcyh0aGlzLnRhcmdldCwgdGhpcy5sZWF2ZVRvQ2xhc3MpO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgIHRoaXMubGVhdmVMaXN0ZW5lcigpO1xuICAgICAgICAgICAgICAgICAgICB0aGlzLmFuaW1hdGluZyA9IGZhbHNlO1xuICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgfVxuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgaWYgKHRoaXMubGVhdmVDbGFzcykge1xuICAgICAgICAgICAgICAgIERvbUhhbmRsZXIucmVtb3ZlQ2xhc3ModGhpcy50YXJnZXQsIHRoaXMubGVhdmVDbGFzcyk7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIGlmICh0aGlzLmxlYXZlVG9DbGFzcykge1xuICAgICAgICAgICAgICAgIERvbUhhbmRsZXIuYWRkQ2xhc3ModGhpcy50YXJnZXQsIHRoaXMubGVhdmVUb0NsYXNzKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuXG4gICAgICAgIGlmICh0aGlzLmhpZGVPbk91dHNpZGVDbGljaykge1xuICAgICAgICAgICAgdGhpcy51bmJpbmREb2N1bWVudExpc3RlbmVyKCk7XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICByZXNvbHZlVGFyZ2V0KCkge1xuICAgICAgICBpZiAodGhpcy50YXJnZXQpIHtcbiAgICAgICAgICAgIHJldHVybiB0aGlzLnRhcmdldDtcbiAgICAgICAgfVxuXG4gICAgICAgIHN3aXRjaCAodGhpcy5zZWxlY3Rvcikge1xuICAgICAgICAgICAgY2FzZSAnQG5leHQnOlxuICAgICAgICAgICAgICAgIHJldHVybiB0aGlzLmVsLm5hdGl2ZUVsZW1lbnQubmV4dEVsZW1lbnRTaWJsaW5nO1xuXG4gICAgICAgICAgICBjYXNlICdAcHJldic6XG4gICAgICAgICAgICAgICAgcmV0dXJuIHRoaXMuZWwubmF0aXZlRWxlbWVudC5wcmV2aW91c0VsZW1lbnRTaWJsaW5nO1xuXG4gICAgICAgICAgICBjYXNlICdAcGFyZW50JzpcbiAgICAgICAgICAgICAgICByZXR1cm4gdGhpcy5lbC5uYXRpdmVFbGVtZW50LnBhcmVudEVsZW1lbnQ7XG5cbiAgICAgICAgICAgIGNhc2UgJ0BncmFuZHBhcmVudCc6XG4gICAgICAgICAgICAgICAgcmV0dXJuIHRoaXMuZWwubmF0aXZlRWxlbWVudC5wYXJlbnRFbGVtZW50LnBhcmVudEVsZW1lbnQ7XG5cbiAgICAgICAgICAgIGRlZmF1bHQ6XG4gICAgICAgICAgICAgICAgcmV0dXJuIGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IodGhpcy5zZWxlY3Rvcik7XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICBiaW5kRG9jdW1lbnRMaXN0ZW5lcigpIHtcbiAgICAgICAgaWYgKCF0aGlzLmRvY3VtZW50TGlzdGVuZXIpIHtcbiAgICAgICAgICAgIHRoaXMuZG9jdW1lbnRMaXN0ZW5lciA9IHRoaXMucmVuZGVyZXIubGlzdGVuKHRoaXMuZWwubmF0aXZlRWxlbWVudC5vd25lckRvY3VtZW50LCAnY2xpY2snLCAoZXZlbnQpID0+IHtcbiAgICAgICAgICAgICAgICBpZiAoIXRoaXMuaXNWaXNpYmxlKCkgfHwgZ2V0Q29tcHV0ZWRTdHlsZSh0aGlzLnRhcmdldCkuZ2V0UHJvcGVydHlWYWx1ZSgncG9zaXRpb24nKSA9PT0gJ3N0YXRpYycpIHRoaXMudW5iaW5kRG9jdW1lbnRMaXN0ZW5lcigpO1xuICAgICAgICAgICAgICAgIGVsc2UgaWYgKHRoaXMuaXNPdXRzaWRlQ2xpY2soZXZlbnQpKSB0aGlzLmxlYXZlKCk7XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgfVxuICAgIH1cblxuICAgIGlzVmlzaWJsZSgpIHtcbiAgICAgICAgcmV0dXJuIHRoaXMudGFyZ2V0Lm9mZnNldFBhcmVudCAhPT0gbnVsbDtcbiAgICB9XG5cbiAgICBpc091dHNpZGVDbGljayhldmVudDogTW91c2VFdmVudCkge1xuICAgICAgICByZXR1cm4gIXRoaXMuZWwubmF0aXZlRWxlbWVudC5pc1NhbWVOb2RlKGV2ZW50LnRhcmdldCkgJiYgIXRoaXMuZWwubmF0aXZlRWxlbWVudC5jb250YWlucyhldmVudC50YXJnZXQpICYmICF0aGlzLnRhcmdldC5jb250YWlucyg8SFRNTEVsZW1lbnQ+ZXZlbnQudGFyZ2V0KTtcbiAgICB9XG5cbiAgICB1bmJpbmREb2N1bWVudExpc3RlbmVyKCkge1xuICAgICAgICBpZiAodGhpcy5kb2N1bWVudExpc3RlbmVyKSB7XG4gICAgICAgICAgICB0aGlzLmRvY3VtZW50TGlzdGVuZXIoKTtcbiAgICAgICAgICAgIHRoaXMuZG9jdW1lbnRMaXN0ZW5lciA9IG51bGw7XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICBuZ09uRGVzdHJveSgpIHtcbiAgICAgICAgdGhpcy50YXJnZXQgPSBudWxsO1xuICAgICAgICBpZiAodGhpcy5ldmVudExpc3RlbmVyKSB7XG4gICAgICAgICAgICB0aGlzLmV2ZW50TGlzdGVuZXIoKTtcbiAgICAgICAgfVxuICAgICAgICB0aGlzLnVuYmluZERvY3VtZW50TGlzdGVuZXIoKTtcbiAgICB9XG59XG5cbkBOZ01vZHVsZSh7XG4gICAgaW1wb3J0czogW0NvbW1vbk1vZHVsZV0sXG4gICAgZXhwb3J0czogW1N0eWxlQ2xhc3NdLFxuICAgIGRlY2xhcmF0aW9uczogW1N0eWxlQ2xhc3NdXG59KVxuZXhwb3J0IGNsYXNzIFN0eWxlQ2xhc3NNb2R1bGUge31cbiJdfQ==
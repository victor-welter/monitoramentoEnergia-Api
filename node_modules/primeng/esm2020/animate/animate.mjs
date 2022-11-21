import { CommonModule } from '@angular/common';
import { Directive, Input, NgModule } from '@angular/core';
import { DomHandler } from 'primeng/dom';
import * as i0 from "@angular/core";
export class Animate {
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
export class AnimateModule {
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiYW5pbWF0ZS5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uL3NyYy9hcHAvY29tcG9uZW50cy9hbmltYXRlL2FuaW1hdGUudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUEsT0FBTyxFQUFFLFlBQVksRUFBRSxNQUFNLGlCQUFpQixDQUFDO0FBQy9DLE9BQU8sRUFBaUIsU0FBUyxFQUFjLEtBQUssRUFBRSxRQUFRLEVBQWEsTUFBTSxlQUFlLENBQUM7QUFDakcsT0FBTyxFQUFFLFVBQVUsRUFBRSxNQUFNLGFBQWEsQ0FBQzs7QUFRekMsTUFBTSxPQUFPLE9BQU87SUFLaEIsWUFBb0IsSUFBZ0IsRUFBUyxFQUFjLEVBQVMsUUFBbUI7UUFBbkUsU0FBSSxHQUFKLElBQUksQ0FBWTtRQUFTLE9BQUUsR0FBRixFQUFFLENBQVk7UUFBUyxhQUFRLEdBQVIsUUFBUSxDQUFXO0lBQUcsQ0FBQztJQUUzRixlQUFlO1FBQ1gsSUFBSSxDQUFDLHdCQUF3QixFQUFFLENBQUM7SUFDcEMsQ0FBQztJQUVELHdCQUF3QjtRQUNwQixNQUFNLE9BQU8sR0FBRztZQUNaLElBQUksRUFBRSxJQUFJO1lBQ1YsVUFBVSxFQUFFLEtBQUs7WUFDakIsU0FBUyxFQUFFLEdBQUc7U0FDakIsQ0FBQztRQUVGLElBQUksQ0FBQyxRQUFRLEdBQUcsSUFBSSxvQkFBb0IsQ0FBQyxDQUFDLEVBQUUsRUFBRSxFQUFFLENBQUMsSUFBSSxDQUFDLFNBQVMsQ0FBQyxFQUFFLENBQUMsRUFBRSxPQUFPLENBQUMsQ0FBQztRQUM5RSxJQUFJLENBQUMsUUFBUSxDQUFDLE9BQU8sQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLGFBQWEsQ0FBQyxDQUFDO0lBQ25ELENBQUM7SUFFRCxTQUFTLENBQUMsT0FBb0M7UUFDMUMsTUFBTSxDQUFDLHlCQUF5QixDQUFDLEdBQUcsT0FBTyxDQUFDO1FBQzVDLHlCQUF5QixDQUFDLGNBQWMsQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLEtBQUssRUFBRSxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsS0FBSyxFQUFFLENBQUM7SUFDM0UsQ0FBQztJQUVELEtBQUs7UUFDRCxJQUFJLENBQUMsSUFBSSxDQUFDLGFBQWEsQ0FBQyxLQUFLLENBQUMsVUFBVSxHQUFHLFNBQVMsQ0FBQztRQUNyRCxVQUFVLENBQUMsUUFBUSxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsYUFBYSxFQUFFLElBQUksQ0FBQyxVQUFVLENBQUMsQ0FBQztJQUNsRSxDQUFDO0lBRUQsS0FBSztRQUNELFVBQVUsQ0FBQyxXQUFXLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxhQUFhLEVBQUUsSUFBSSxDQUFDLFVBQVUsQ0FBQyxDQUFDO1FBQ2pFLElBQUksQ0FBQyxJQUFJLENBQUMsYUFBYSxDQUFDLEtBQUssQ0FBQyxVQUFVLEdBQUcsUUFBUSxDQUFDO0lBQ3hELENBQUM7SUFFRCwwQkFBMEI7UUFDdEIsSUFBSSxJQUFJLENBQUMsUUFBUSxFQUFFO1lBQ2YsSUFBSSxDQUFDLFFBQVEsQ0FBQyxTQUFTLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxhQUFhLENBQUMsQ0FBQztTQUNwRDtJQUNMLENBQUM7SUFFRCxXQUFXO1FBQ1AsSUFBSSxDQUFDLDBCQUEwQixFQUFFLENBQUM7SUFDdEMsQ0FBQzs7b0dBN0NRLE9BQU87d0ZBQVAsT0FBTzsyRkFBUCxPQUFPO2tCQU5uQixTQUFTO21CQUFDO29CQUNQLFFBQVEsRUFBRSxZQUFZO29CQUN0QixJQUFJLEVBQUU7d0JBQ0YsbUJBQW1CLEVBQUUsTUFBTTtxQkFDOUI7aUJBQ0o7a0pBRVksVUFBVTtzQkFBbEIsS0FBSzs7QUFvRFYsTUFBTSxPQUFPLGFBQWE7OzBHQUFiLGFBQWE7MkdBQWIsYUFBYSxpQkFyRGIsT0FBTyxhQWlETixZQUFZLGFBakRiLE9BQU87MkdBcURQLGFBQWEsWUFKWixZQUFZOzJGQUliLGFBQWE7a0JBTHpCLFFBQVE7bUJBQUM7b0JBQ04sT0FBTyxFQUFFLENBQUMsWUFBWSxDQUFDO29CQUN2QixPQUFPLEVBQUUsQ0FBQyxPQUFPLENBQUM7b0JBQ2xCLFlBQVksRUFBRSxDQUFDLE9BQU8sQ0FBQztpQkFDMUIiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgeyBDb21tb25Nb2R1bGUgfSBmcm9tICdAYW5ndWxhci9jb21tb24nO1xuaW1wb3J0IHsgQWZ0ZXJWaWV3SW5pdCwgRGlyZWN0aXZlLCBFbGVtZW50UmVmLCBJbnB1dCwgTmdNb2R1bGUsIFJlbmRlcmVyMiB9IGZyb20gJ0Bhbmd1bGFyL2NvcmUnO1xuaW1wb3J0IHsgRG9tSGFuZGxlciB9IGZyb20gJ3ByaW1lbmcvZG9tJztcblxuQERpcmVjdGl2ZSh7XG4gICAgc2VsZWN0b3I6ICdbcEFuaW1hdGVdJyxcbiAgICBob3N0OiB7XG4gICAgICAgICdbY2xhc3MucC1hbmltYXRlXSc6ICd0cnVlJ1xuICAgIH1cbn0pXG5leHBvcnQgY2xhc3MgQW5pbWF0ZSBpbXBsZW1lbnRzIEFmdGVyVmlld0luaXQge1xuICAgIEBJbnB1dCgpIGVudGVyQ2xhc3M6IHN0cmluZztcblxuICAgIG9ic2VydmVyOiBJbnRlcnNlY3Rpb25PYnNlcnZlcjtcblxuICAgIGNvbnN0cnVjdG9yKHByaXZhdGUgaG9zdDogRWxlbWVudFJlZiwgcHVibGljIGVsOiBFbGVtZW50UmVmLCBwdWJsaWMgcmVuZGVyZXI6IFJlbmRlcmVyMikge31cblxuICAgIG5nQWZ0ZXJWaWV3SW5pdCgpIHtcbiAgICAgICAgdGhpcy5iaW5kSW50ZXJzZWN0aW9uT2JzZXJ2ZXIoKTtcbiAgICB9XG5cbiAgICBiaW5kSW50ZXJzZWN0aW9uT2JzZXJ2ZXIoKSB7XG4gICAgICAgIGNvbnN0IG9wdGlvbnMgPSB7XG4gICAgICAgICAgICByb290OiBudWxsLFxuICAgICAgICAgICAgcm9vdE1hcmdpbjogJzBweCcsXG4gICAgICAgICAgICB0aHJlc2hvbGQ6IDEuMFxuICAgICAgICB9O1xuXG4gICAgICAgIHRoaXMub2JzZXJ2ZXIgPSBuZXcgSW50ZXJzZWN0aW9uT2JzZXJ2ZXIoKGVsKSA9PiB0aGlzLmlzVmlzaWJsZShlbCksIG9wdGlvbnMpO1xuICAgICAgICB0aGlzLm9ic2VydmVyLm9ic2VydmUodGhpcy5ob3N0Lm5hdGl2ZUVsZW1lbnQpO1xuICAgIH1cblxuICAgIGlzVmlzaWJsZShlbGVtZW50OiBJbnRlcnNlY3Rpb25PYnNlcnZlckVudHJ5W10pIHtcbiAgICAgICAgY29uc3QgW2ludGVyc2VjdGlvbk9ic2VydmVyRW50cnldID0gZWxlbWVudDtcbiAgICAgICAgaW50ZXJzZWN0aW9uT2JzZXJ2ZXJFbnRyeS5pc0ludGVyc2VjdGluZyA/IHRoaXMuZW50ZXIoKSA6IHRoaXMubGVhdmUoKTtcbiAgICB9XG5cbiAgICBlbnRlcigpIHtcbiAgICAgICAgdGhpcy5ob3N0Lm5hdGl2ZUVsZW1lbnQuc3R5bGUudmlzaWJpbGl0eSA9ICd2aXNpYmxlJztcbiAgICAgICAgRG9tSGFuZGxlci5hZGRDbGFzcyh0aGlzLmhvc3QubmF0aXZlRWxlbWVudCwgdGhpcy5lbnRlckNsYXNzKTtcbiAgICB9XG5cbiAgICBsZWF2ZSgpIHtcbiAgICAgICAgRG9tSGFuZGxlci5yZW1vdmVDbGFzcyh0aGlzLmhvc3QubmF0aXZlRWxlbWVudCwgdGhpcy5lbnRlckNsYXNzKTtcbiAgICAgICAgdGhpcy5ob3N0Lm5hdGl2ZUVsZW1lbnQuc3R5bGUudmlzaWJpbGl0eSA9ICdoaWRkZW4nO1xuICAgIH1cblxuICAgIHVuYmluZEludGVyc2VjdGlvbk9ic2VydmVyKCkge1xuICAgICAgICBpZiAodGhpcy5vYnNlcnZlcikge1xuICAgICAgICAgICAgdGhpcy5vYnNlcnZlci51bm9ic2VydmUodGhpcy5ob3N0Lm5hdGl2ZUVsZW1lbnQpO1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgbmdPbkRlc3Ryb3koKSB7XG4gICAgICAgIHRoaXMudW5iaW5kSW50ZXJzZWN0aW9uT2JzZXJ2ZXIoKTtcbiAgICB9XG59XG5cbkBOZ01vZHVsZSh7XG4gICAgaW1wb3J0czogW0NvbW1vbk1vZHVsZV0sXG4gICAgZXhwb3J0czogW0FuaW1hdGVdLFxuICAgIGRlY2xhcmF0aW9uczogW0FuaW1hdGVdXG59KVxuZXhwb3J0IGNsYXNzIEFuaW1hdGVNb2R1bGUge31cbiJdfQ==
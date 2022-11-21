import { NgModule, Component, ChangeDetectionStrategy, ViewEncapsulation, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import * as i0 from "@angular/core";
import * as i1 from "@angular/common";
export class Skeleton {
    constructor() {
        this.shape = 'rectangle';
        this.animation = 'wave';
        this.borderRadius = null;
        this.size = null;
        this.width = '100%';
        this.height = '1rem';
    }
    containerClass() {
        return {
            'p-skeleton p-component': true,
            'p-skeleton-circle': this.shape === 'circle',
            'p-skeleton-none': this.animation === 'none'
        };
    }
    containerStyle() {
        if (this.size)
            return { ...this.style, width: this.size, height: this.size, borderRadius: this.borderRadius };
        else
            return { ...this.style, width: this.width, height: this.height, borderRadius: this.borderRadius };
    }
}
Skeleton.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "14.0.7", ngImport: i0, type: Skeleton, deps: [], target: i0.ɵɵFactoryTarget.Component });
Skeleton.ɵcmp = i0.ɵɵngDeclareComponent({ minVersion: "14.0.0", version: "14.0.7", type: Skeleton, selector: "p-skeleton", inputs: { styleClass: "styleClass", style: "style", shape: "shape", animation: "animation", borderRadius: "borderRadius", size: "size", width: "width", height: "height" }, host: { classAttribute: "p-element" }, ngImport: i0, template: ` <div [ngClass]="containerClass()" [class]="styleClass" [ngStyle]="containerStyle()"></div> `, isInline: true, styles: [".p-skeleton{position:relative;overflow:hidden}.p-skeleton:after{content:\"\";animation:p-skeleton-animation 1.2s infinite;height:100%;left:0;position:absolute;right:0;top:0;transform:translate(-100%);z-index:1}.p-skeleton.p-skeleton-circle{border-radius:50%}.p-skeleton-none:after{animation:none}@keyframes p-skeleton-animation{0%{transform:translate(-100%)}to{transform:translate(100%)}}\n"], dependencies: [{ kind: "directive", type: i1.NgClass, selector: "[ngClass]", inputs: ["class", "ngClass"] }, { kind: "directive", type: i1.NgStyle, selector: "[ngStyle]", inputs: ["ngStyle"] }], changeDetection: i0.ChangeDetectionStrategy.OnPush, encapsulation: i0.ViewEncapsulation.None });
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "14.0.7", ngImport: i0, type: Skeleton, decorators: [{
            type: Component,
            args: [{ selector: 'p-skeleton', template: ` <div [ngClass]="containerClass()" [class]="styleClass" [ngStyle]="containerStyle()"></div> `, changeDetection: ChangeDetectionStrategy.OnPush, encapsulation: ViewEncapsulation.None, host: {
                        class: 'p-element'
                    }, styles: [".p-skeleton{position:relative;overflow:hidden}.p-skeleton:after{content:\"\";animation:p-skeleton-animation 1.2s infinite;height:100%;left:0;position:absolute;right:0;top:0;transform:translate(-100%);z-index:1}.p-skeleton.p-skeleton-circle{border-radius:50%}.p-skeleton-none:after{animation:none}@keyframes p-skeleton-animation{0%{transform:translate(-100%)}to{transform:translate(100%)}}\n"] }]
        }], propDecorators: { styleClass: [{
                type: Input
            }], style: [{
                type: Input
            }], shape: [{
                type: Input
            }], animation: [{
                type: Input
            }], borderRadius: [{
                type: Input
            }], size: [{
                type: Input
            }], width: [{
                type: Input
            }], height: [{
                type: Input
            }] } });
export class SkeletonModule {
}
SkeletonModule.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "14.0.7", ngImport: i0, type: SkeletonModule, deps: [], target: i0.ɵɵFactoryTarget.NgModule });
SkeletonModule.ɵmod = i0.ɵɵngDeclareNgModule({ minVersion: "14.0.0", version: "14.0.7", ngImport: i0, type: SkeletonModule, declarations: [Skeleton], imports: [CommonModule], exports: [Skeleton] });
SkeletonModule.ɵinj = i0.ɵɵngDeclareInjector({ minVersion: "12.0.0", version: "14.0.7", ngImport: i0, type: SkeletonModule, imports: [CommonModule] });
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "14.0.7", ngImport: i0, type: SkeletonModule, decorators: [{
            type: NgModule,
            args: [{
                    imports: [CommonModule],
                    exports: [Skeleton],
                    declarations: [Skeleton]
                }]
        }] });
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoic2tlbGV0b24uanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi9zcmMvYXBwL2NvbXBvbmVudHMvc2tlbGV0b24vc2tlbGV0b24udHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUEsT0FBTyxFQUFFLFFBQVEsRUFBRSxTQUFTLEVBQUUsdUJBQXVCLEVBQUUsaUJBQWlCLEVBQUUsS0FBSyxFQUFFLE1BQU0sZUFBZSxDQUFDO0FBQ3ZHLE9BQU8sRUFBRSxZQUFZLEVBQUUsTUFBTSxpQkFBaUIsQ0FBQzs7O0FBWS9DLE1BQU0sT0FBTyxRQUFRO0lBVnJCO1FBZWEsVUFBSyxHQUFXLFdBQVcsQ0FBQztRQUU1QixjQUFTLEdBQVcsTUFBTSxDQUFDO1FBRTNCLGlCQUFZLEdBQVcsSUFBSSxDQUFDO1FBRTVCLFNBQUksR0FBVyxJQUFJLENBQUM7UUFFcEIsVUFBSyxHQUFXLE1BQU0sQ0FBQztRQUV2QixXQUFNLEdBQVcsTUFBTSxDQUFDO0tBY3BDO0lBWkcsY0FBYztRQUNWLE9BQU87WUFDSCx3QkFBd0IsRUFBRSxJQUFJO1lBQzlCLG1CQUFtQixFQUFFLElBQUksQ0FBQyxLQUFLLEtBQUssUUFBUTtZQUM1QyxpQkFBaUIsRUFBRSxJQUFJLENBQUMsU0FBUyxLQUFLLE1BQU07U0FDL0MsQ0FBQztJQUNOLENBQUM7SUFFRCxjQUFjO1FBQ1YsSUFBSSxJQUFJLENBQUMsSUFBSTtZQUFFLE9BQU8sRUFBRSxHQUFHLElBQUksQ0FBQyxLQUFLLEVBQUUsS0FBSyxFQUFFLElBQUksQ0FBQyxJQUFJLEVBQUUsTUFBTSxFQUFFLElBQUksQ0FBQyxJQUFJLEVBQUUsWUFBWSxFQUFFLElBQUksQ0FBQyxZQUFZLEVBQUUsQ0FBQzs7WUFDekcsT0FBTyxFQUFFLEdBQUcsSUFBSSxDQUFDLEtBQUssRUFBRSxLQUFLLEVBQUUsSUFBSSxDQUFDLEtBQUssRUFBRSxNQUFNLEVBQUUsSUFBSSxDQUFDLE1BQU0sRUFBRSxZQUFZLEVBQUUsSUFBSSxDQUFDLFlBQVksRUFBRSxDQUFDO0lBQzNHLENBQUM7O3FHQTVCUSxRQUFRO3lGQUFSLFFBQVEscVFBUlAsOEZBQThGOzJGQVEvRixRQUFRO2tCQVZwQixTQUFTOytCQUNJLFlBQVksWUFDWiw4RkFBOEYsbUJBQ3ZGLHVCQUF1QixDQUFDLE1BQU0saUJBQ2hDLGlCQUFpQixDQUFDLElBQUksUUFFL0I7d0JBQ0YsS0FBSyxFQUFFLFdBQVc7cUJBQ3JCOzhCQUdRLFVBQVU7c0JBQWxCLEtBQUs7Z0JBRUcsS0FBSztzQkFBYixLQUFLO2dCQUVHLEtBQUs7c0JBQWIsS0FBSztnQkFFRyxTQUFTO3NCQUFqQixLQUFLO2dCQUVHLFlBQVk7c0JBQXBCLEtBQUs7Z0JBRUcsSUFBSTtzQkFBWixLQUFLO2dCQUVHLEtBQUs7c0JBQWIsS0FBSztnQkFFRyxNQUFNO3NCQUFkLEtBQUs7O0FBcUJWLE1BQU0sT0FBTyxjQUFjOzsyR0FBZCxjQUFjOzRHQUFkLGNBQWMsaUJBcENkLFFBQVEsYUFnQ1AsWUFBWSxhQWhDYixRQUFROzRHQW9DUixjQUFjLFlBSmIsWUFBWTsyRkFJYixjQUFjO2tCQUwxQixRQUFRO21CQUFDO29CQUNOLE9BQU8sRUFBRSxDQUFDLFlBQVksQ0FBQztvQkFDdkIsT0FBTyxFQUFFLENBQUMsUUFBUSxDQUFDO29CQUNuQixZQUFZLEVBQUUsQ0FBQyxRQUFRLENBQUM7aUJBQzNCIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHsgTmdNb2R1bGUsIENvbXBvbmVudCwgQ2hhbmdlRGV0ZWN0aW9uU3RyYXRlZ3ksIFZpZXdFbmNhcHN1bGF0aW9uLCBJbnB1dCB9IGZyb20gJ0Bhbmd1bGFyL2NvcmUnO1xuaW1wb3J0IHsgQ29tbW9uTW9kdWxlIH0gZnJvbSAnQGFuZ3VsYXIvY29tbW9uJztcblxuQENvbXBvbmVudCh7XG4gICAgc2VsZWN0b3I6ICdwLXNrZWxldG9uJyxcbiAgICB0ZW1wbGF0ZTogYCA8ZGl2IFtuZ0NsYXNzXT1cImNvbnRhaW5lckNsYXNzKClcIiBbY2xhc3NdPVwic3R5bGVDbGFzc1wiIFtuZ1N0eWxlXT1cImNvbnRhaW5lclN0eWxlKClcIj48L2Rpdj4gYCxcbiAgICBjaGFuZ2VEZXRlY3Rpb246IENoYW5nZURldGVjdGlvblN0cmF0ZWd5Lk9uUHVzaCxcbiAgICBlbmNhcHN1bGF0aW9uOiBWaWV3RW5jYXBzdWxhdGlvbi5Ob25lLFxuICAgIHN0eWxlVXJsczogWycuL3NrZWxldG9uLmNzcyddLFxuICAgIGhvc3Q6IHtcbiAgICAgICAgY2xhc3M6ICdwLWVsZW1lbnQnXG4gICAgfVxufSlcbmV4cG9ydCBjbGFzcyBTa2VsZXRvbiB7XG4gICAgQElucHV0KCkgc3R5bGVDbGFzczogc3RyaW5nO1xuXG4gICAgQElucHV0KCkgc3R5bGU6IGFueTtcblxuICAgIEBJbnB1dCgpIHNoYXBlOiBzdHJpbmcgPSAncmVjdGFuZ2xlJztcblxuICAgIEBJbnB1dCgpIGFuaW1hdGlvbjogc3RyaW5nID0gJ3dhdmUnO1xuXG4gICAgQElucHV0KCkgYm9yZGVyUmFkaXVzOiBzdHJpbmcgPSBudWxsO1xuXG4gICAgQElucHV0KCkgc2l6ZTogc3RyaW5nID0gbnVsbDtcblxuICAgIEBJbnB1dCgpIHdpZHRoOiBzdHJpbmcgPSAnMTAwJSc7XG5cbiAgICBASW5wdXQoKSBoZWlnaHQ6IHN0cmluZyA9ICcxcmVtJztcblxuICAgIGNvbnRhaW5lckNsYXNzKCkge1xuICAgICAgICByZXR1cm4ge1xuICAgICAgICAgICAgJ3Atc2tlbGV0b24gcC1jb21wb25lbnQnOiB0cnVlLFxuICAgICAgICAgICAgJ3Atc2tlbGV0b24tY2lyY2xlJzogdGhpcy5zaGFwZSA9PT0gJ2NpcmNsZScsXG4gICAgICAgICAgICAncC1za2VsZXRvbi1ub25lJzogdGhpcy5hbmltYXRpb24gPT09ICdub25lJ1xuICAgICAgICB9O1xuICAgIH1cblxuICAgIGNvbnRhaW5lclN0eWxlKCkge1xuICAgICAgICBpZiAodGhpcy5zaXplKSByZXR1cm4geyAuLi50aGlzLnN0eWxlLCB3aWR0aDogdGhpcy5zaXplLCBoZWlnaHQ6IHRoaXMuc2l6ZSwgYm9yZGVyUmFkaXVzOiB0aGlzLmJvcmRlclJhZGl1cyB9O1xuICAgICAgICBlbHNlIHJldHVybiB7IC4uLnRoaXMuc3R5bGUsIHdpZHRoOiB0aGlzLndpZHRoLCBoZWlnaHQ6IHRoaXMuaGVpZ2h0LCBib3JkZXJSYWRpdXM6IHRoaXMuYm9yZGVyUmFkaXVzIH07XG4gICAgfVxufVxuXG5ATmdNb2R1bGUoe1xuICAgIGltcG9ydHM6IFtDb21tb25Nb2R1bGVdLFxuICAgIGV4cG9ydHM6IFtTa2VsZXRvbl0sXG4gICAgZGVjbGFyYXRpb25zOiBbU2tlbGV0b25dXG59KVxuZXhwb3J0IGNsYXNzIFNrZWxldG9uTW9kdWxlIHt9XG4iXX0=
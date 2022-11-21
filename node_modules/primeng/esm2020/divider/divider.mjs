import { NgModule, Component, ChangeDetectionStrategy, ViewEncapsulation, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import * as i0 from "@angular/core";
import * as i1 from "@angular/common";
export class Divider {
    constructor() {
        this.layout = 'horizontal';
        this.type = 'solid';
    }
    containerClass() {
        return {
            'p-divider p-component': true,
            'p-divider-horizontal': this.layout === 'horizontal',
            'p-divider-vertical': this.layout === 'vertical',
            'p-divider-solid': this.type === 'solid',
            'p-divider-dashed': this.type === 'dashed',
            'p-divider-dotted': this.type === 'dotted',
            'p-divider-left': this.layout === 'horizontal' && (!this.align || this.align === 'left'),
            'p-divider-center': (this.layout === 'horizontal' && this.align === 'center') || (this.layout === 'vertical' && (!this.align || this.align === 'center')),
            'p-divider-right': this.layout === 'horizontal' && this.align === 'right',
            'p-divider-top': this.layout === 'vertical' && this.align === 'top',
            'p-divider-bottom': this.layout === 'vertical' && this.align === 'bottom'
        };
    }
}
Divider.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "14.0.7", ngImport: i0, type: Divider, deps: [], target: i0.ɵɵFactoryTarget.Component });
Divider.ɵcmp = i0.ɵɵngDeclareComponent({ minVersion: "14.0.0", version: "14.0.7", type: Divider, selector: "p-divider", inputs: { styleClass: "styleClass", style: "style", layout: "layout", type: "type", align: "align" }, host: { classAttribute: "p-element" }, ngImport: i0, template: `
        <div [ngClass]="containerClass()" [class]="styleClass" [ngStyle]="style" role="separator">
            <div class="p-divider-content">
                <ng-content></ng-content>
            </div>
        </div>
    `, isInline: true, styles: [".p-divider-horizontal{display:flex;width:100%;position:relative;align-items:center}.p-divider-horizontal:before{position:absolute;display:block;top:50%;left:0;width:100%;content:\"\"}.p-divider-horizontal.p-divider-left{justify-content:flex-start}.p-divider-horizontal.p-divider-right{justify-content:flex-end}.p-divider-horizontal.p-divider-center{justify-content:center}.p-divider-content{z-index:1}.p-divider-vertical{min-height:100%;margin:0 1rem;display:flex;position:relative;justify-content:center}.p-divider-vertical:before{position:absolute;display:block;top:0;left:50%;height:100%;content:\"\"}.p-divider-vertical.p-divider-top{align-items:flex-start}.p-divider-vertical.p-divider-center{align-items:center}.p-divider-vertical.p-divider-bottom{align-items:flex-end}.p-divider-solid.p-divider-horizontal:before{border-top-style:solid}.p-divider-solid.p-divider-vertical:before{border-left-style:solid}.p-divider-dashed.p-divider-horizontal:before{border-top-style:dashed}.p-divider-dashed.p-divider-vertical:before{border-left-style:dashed}.p-divider-dotted.p-divider-horizontal:before{border-top-style:dotted}.p-divider-dotted.p-divider-horizontal:before{border-left-style:dotted}\n"], dependencies: [{ kind: "directive", type: i1.NgClass, selector: "[ngClass]", inputs: ["class", "ngClass"] }, { kind: "directive", type: i1.NgStyle, selector: "[ngStyle]", inputs: ["ngStyle"] }], changeDetection: i0.ChangeDetectionStrategy.OnPush, encapsulation: i0.ViewEncapsulation.None });
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "14.0.7", ngImport: i0, type: Divider, decorators: [{
            type: Component,
            args: [{ selector: 'p-divider', template: `
        <div [ngClass]="containerClass()" [class]="styleClass" [ngStyle]="style" role="separator">
            <div class="p-divider-content">
                <ng-content></ng-content>
            </div>
        </div>
    `, changeDetection: ChangeDetectionStrategy.OnPush, encapsulation: ViewEncapsulation.None, host: {
                        class: 'p-element'
                    }, styles: [".p-divider-horizontal{display:flex;width:100%;position:relative;align-items:center}.p-divider-horizontal:before{position:absolute;display:block;top:50%;left:0;width:100%;content:\"\"}.p-divider-horizontal.p-divider-left{justify-content:flex-start}.p-divider-horizontal.p-divider-right{justify-content:flex-end}.p-divider-horizontal.p-divider-center{justify-content:center}.p-divider-content{z-index:1}.p-divider-vertical{min-height:100%;margin:0 1rem;display:flex;position:relative;justify-content:center}.p-divider-vertical:before{position:absolute;display:block;top:0;left:50%;height:100%;content:\"\"}.p-divider-vertical.p-divider-top{align-items:flex-start}.p-divider-vertical.p-divider-center{align-items:center}.p-divider-vertical.p-divider-bottom{align-items:flex-end}.p-divider-solid.p-divider-horizontal:before{border-top-style:solid}.p-divider-solid.p-divider-vertical:before{border-left-style:solid}.p-divider-dashed.p-divider-horizontal:before{border-top-style:dashed}.p-divider-dashed.p-divider-vertical:before{border-left-style:dashed}.p-divider-dotted.p-divider-horizontal:before{border-top-style:dotted}.p-divider-dotted.p-divider-horizontal:before{border-left-style:dotted}\n"] }]
        }], propDecorators: { styleClass: [{
                type: Input
            }], style: [{
                type: Input
            }], layout: [{
                type: Input
            }], type: [{
                type: Input
            }], align: [{
                type: Input
            }] } });
export class DividerModule {
}
DividerModule.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "14.0.7", ngImport: i0, type: DividerModule, deps: [], target: i0.ɵɵFactoryTarget.NgModule });
DividerModule.ɵmod = i0.ɵɵngDeclareNgModule({ minVersion: "14.0.0", version: "14.0.7", ngImport: i0, type: DividerModule, declarations: [Divider], imports: [CommonModule], exports: [Divider] });
DividerModule.ɵinj = i0.ɵɵngDeclareInjector({ minVersion: "12.0.0", version: "14.0.7", ngImport: i0, type: DividerModule, imports: [CommonModule] });
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "14.0.7", ngImport: i0, type: DividerModule, decorators: [{
            type: NgModule,
            args: [{
                    imports: [CommonModule],
                    exports: [Divider],
                    declarations: [Divider]
                }]
        }] });
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZGl2aWRlci5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uL3NyYy9hcHAvY29tcG9uZW50cy9kaXZpZGVyL2RpdmlkZXIudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUEsT0FBTyxFQUFFLFFBQVEsRUFBRSxTQUFTLEVBQUUsdUJBQXVCLEVBQUUsaUJBQWlCLEVBQUUsS0FBSyxFQUFFLE1BQU0sZUFBZSxDQUFDO0FBQ3ZHLE9BQU8sRUFBRSxZQUFZLEVBQUUsTUFBTSxpQkFBaUIsQ0FBQzs7O0FBa0IvQyxNQUFNLE9BQU8sT0FBTztJQWhCcEI7UUFxQmEsV0FBTSxHQUFXLFlBQVksQ0FBQztRQUU5QixTQUFJLEdBQVcsT0FBTyxDQUFDO0tBbUJuQztJQWZHLGNBQWM7UUFDVixPQUFPO1lBQ0gsdUJBQXVCLEVBQUUsSUFBSTtZQUM3QixzQkFBc0IsRUFBRSxJQUFJLENBQUMsTUFBTSxLQUFLLFlBQVk7WUFDcEQsb0JBQW9CLEVBQUUsSUFBSSxDQUFDLE1BQU0sS0FBSyxVQUFVO1lBQ2hELGlCQUFpQixFQUFFLElBQUksQ0FBQyxJQUFJLEtBQUssT0FBTztZQUN4QyxrQkFBa0IsRUFBRSxJQUFJLENBQUMsSUFBSSxLQUFLLFFBQVE7WUFDMUMsa0JBQWtCLEVBQUUsSUFBSSxDQUFDLElBQUksS0FBSyxRQUFRO1lBQzFDLGdCQUFnQixFQUFFLElBQUksQ0FBQyxNQUFNLEtBQUssWUFBWSxJQUFJLENBQUMsQ0FBQyxJQUFJLENBQUMsS0FBSyxJQUFJLElBQUksQ0FBQyxLQUFLLEtBQUssTUFBTSxDQUFDO1lBQ3hGLGtCQUFrQixFQUFFLENBQUMsSUFBSSxDQUFDLE1BQU0sS0FBSyxZQUFZLElBQUksSUFBSSxDQUFDLEtBQUssS0FBSyxRQUFRLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxNQUFNLEtBQUssVUFBVSxJQUFJLENBQUMsQ0FBQyxJQUFJLENBQUMsS0FBSyxJQUFJLElBQUksQ0FBQyxLQUFLLEtBQUssUUFBUSxDQUFDLENBQUM7WUFDekosaUJBQWlCLEVBQUUsSUFBSSxDQUFDLE1BQU0sS0FBSyxZQUFZLElBQUksSUFBSSxDQUFDLEtBQUssS0FBSyxPQUFPO1lBQ3pFLGVBQWUsRUFBRSxJQUFJLENBQUMsTUFBTSxLQUFLLFVBQVUsSUFBSSxJQUFJLENBQUMsS0FBSyxLQUFLLEtBQUs7WUFDbkUsa0JBQWtCLEVBQUUsSUFBSSxDQUFDLE1BQU0sS0FBSyxVQUFVLElBQUksSUFBSSxDQUFDLEtBQUssS0FBSyxRQUFRO1NBQzVFLENBQUM7SUFDTixDQUFDOztvR0F6QlEsT0FBTzt3RkFBUCxPQUFPLDhMQWROOzs7Ozs7S0FNVDsyRkFRUSxPQUFPO2tCQWhCbkIsU0FBUzsrQkFDSSxXQUFXLFlBQ1g7Ozs7OztLQU1ULG1CQUNnQix1QkFBdUIsQ0FBQyxNQUFNLGlCQUNoQyxpQkFBaUIsQ0FBQyxJQUFJLFFBRS9CO3dCQUNGLEtBQUssRUFBRSxXQUFXO3FCQUNyQjs4QkFHUSxVQUFVO3NCQUFsQixLQUFLO2dCQUVHLEtBQUs7c0JBQWIsS0FBSztnQkFFRyxNQUFNO3NCQUFkLEtBQUs7Z0JBRUcsSUFBSTtzQkFBWixLQUFLO2dCQUVHLEtBQUs7c0JBQWIsS0FBSzs7QUF3QlYsTUFBTSxPQUFPLGFBQWE7OzBHQUFiLGFBQWE7MkdBQWIsYUFBYSxpQkFqQ2IsT0FBTyxhQTZCTixZQUFZLGFBN0JiLE9BQU87MkdBaUNQLGFBQWEsWUFKWixZQUFZOzJGQUliLGFBQWE7a0JBTHpCLFFBQVE7bUJBQUM7b0JBQ04sT0FBTyxFQUFFLENBQUMsWUFBWSxDQUFDO29CQUN2QixPQUFPLEVBQUUsQ0FBQyxPQUFPLENBQUM7b0JBQ2xCLFlBQVksRUFBRSxDQUFDLE9BQU8sQ0FBQztpQkFDMUIiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgeyBOZ01vZHVsZSwgQ29tcG9uZW50LCBDaGFuZ2VEZXRlY3Rpb25TdHJhdGVneSwgVmlld0VuY2Fwc3VsYXRpb24sIElucHV0IH0gZnJvbSAnQGFuZ3VsYXIvY29yZSc7XG5pbXBvcnQgeyBDb21tb25Nb2R1bGUgfSBmcm9tICdAYW5ndWxhci9jb21tb24nO1xuXG5AQ29tcG9uZW50KHtcbiAgICBzZWxlY3RvcjogJ3AtZGl2aWRlcicsXG4gICAgdGVtcGxhdGU6IGBcbiAgICAgICAgPGRpdiBbbmdDbGFzc109XCJjb250YWluZXJDbGFzcygpXCIgW2NsYXNzXT1cInN0eWxlQ2xhc3NcIiBbbmdTdHlsZV09XCJzdHlsZVwiIHJvbGU9XCJzZXBhcmF0b3JcIj5cbiAgICAgICAgICAgIDxkaXYgY2xhc3M9XCJwLWRpdmlkZXItY29udGVudFwiPlxuICAgICAgICAgICAgICAgIDxuZy1jb250ZW50PjwvbmctY29udGVudD5cbiAgICAgICAgICAgIDwvZGl2PlxuICAgICAgICA8L2Rpdj5cbiAgICBgLFxuICAgIGNoYW5nZURldGVjdGlvbjogQ2hhbmdlRGV0ZWN0aW9uU3RyYXRlZ3kuT25QdXNoLFxuICAgIGVuY2Fwc3VsYXRpb246IFZpZXdFbmNhcHN1bGF0aW9uLk5vbmUsXG4gICAgc3R5bGVVcmxzOiBbJy4vZGl2aWRlci5jc3MnXSxcbiAgICBob3N0OiB7XG4gICAgICAgIGNsYXNzOiAncC1lbGVtZW50J1xuICAgIH1cbn0pXG5leHBvcnQgY2xhc3MgRGl2aWRlciB7XG4gICAgQElucHV0KCkgc3R5bGVDbGFzczogc3RyaW5nO1xuXG4gICAgQElucHV0KCkgc3R5bGU6IGFueTtcblxuICAgIEBJbnB1dCgpIGxheW91dDogc3RyaW5nID0gJ2hvcml6b250YWwnO1xuXG4gICAgQElucHV0KCkgdHlwZTogc3RyaW5nID0gJ3NvbGlkJztcblxuICAgIEBJbnB1dCgpIGFsaWduOiBzdHJpbmc7XG5cbiAgICBjb250YWluZXJDbGFzcygpIHtcbiAgICAgICAgcmV0dXJuIHtcbiAgICAgICAgICAgICdwLWRpdmlkZXIgcC1jb21wb25lbnQnOiB0cnVlLFxuICAgICAgICAgICAgJ3AtZGl2aWRlci1ob3Jpem9udGFsJzogdGhpcy5sYXlvdXQgPT09ICdob3Jpem9udGFsJyxcbiAgICAgICAgICAgICdwLWRpdmlkZXItdmVydGljYWwnOiB0aGlzLmxheW91dCA9PT0gJ3ZlcnRpY2FsJyxcbiAgICAgICAgICAgICdwLWRpdmlkZXItc29saWQnOiB0aGlzLnR5cGUgPT09ICdzb2xpZCcsXG4gICAgICAgICAgICAncC1kaXZpZGVyLWRhc2hlZCc6IHRoaXMudHlwZSA9PT0gJ2Rhc2hlZCcsXG4gICAgICAgICAgICAncC1kaXZpZGVyLWRvdHRlZCc6IHRoaXMudHlwZSA9PT0gJ2RvdHRlZCcsXG4gICAgICAgICAgICAncC1kaXZpZGVyLWxlZnQnOiB0aGlzLmxheW91dCA9PT0gJ2hvcml6b250YWwnICYmICghdGhpcy5hbGlnbiB8fCB0aGlzLmFsaWduID09PSAnbGVmdCcpLFxuICAgICAgICAgICAgJ3AtZGl2aWRlci1jZW50ZXInOiAodGhpcy5sYXlvdXQgPT09ICdob3Jpem9udGFsJyAmJiB0aGlzLmFsaWduID09PSAnY2VudGVyJykgfHwgKHRoaXMubGF5b3V0ID09PSAndmVydGljYWwnICYmICghdGhpcy5hbGlnbiB8fCB0aGlzLmFsaWduID09PSAnY2VudGVyJykpLFxuICAgICAgICAgICAgJ3AtZGl2aWRlci1yaWdodCc6IHRoaXMubGF5b3V0ID09PSAnaG9yaXpvbnRhbCcgJiYgdGhpcy5hbGlnbiA9PT0gJ3JpZ2h0JyxcbiAgICAgICAgICAgICdwLWRpdmlkZXItdG9wJzogdGhpcy5sYXlvdXQgPT09ICd2ZXJ0aWNhbCcgJiYgdGhpcy5hbGlnbiA9PT0gJ3RvcCcsXG4gICAgICAgICAgICAncC1kaXZpZGVyLWJvdHRvbSc6IHRoaXMubGF5b3V0ID09PSAndmVydGljYWwnICYmIHRoaXMuYWxpZ24gPT09ICdib3R0b20nXG4gICAgICAgIH07XG4gICAgfVxufVxuXG5ATmdNb2R1bGUoe1xuICAgIGltcG9ydHM6IFtDb21tb25Nb2R1bGVdLFxuICAgIGV4cG9ydHM6IFtEaXZpZGVyXSxcbiAgICBkZWNsYXJhdGlvbnM6IFtEaXZpZGVyXVxufSlcbmV4cG9ydCBjbGFzcyBEaXZpZGVyTW9kdWxlIHt9XG4iXX0=
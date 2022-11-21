import { NgModule, Component, ChangeDetectionStrategy, ViewEncapsulation, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import * as i0 from "@angular/core";
import * as i1 from "@angular/common";
export class Tag {
    containerClass() {
        return {
            'p-tag p-component': true,
            'p-tag-info': this.severity === 'info',
            'p-tag-success': this.severity === 'success',
            'p-tag-warning': this.severity === 'warning',
            'p-tag-danger': this.severity === 'danger',
            'p-tag-rounded': this.rounded
        };
    }
}
Tag.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "14.0.7", ngImport: i0, type: Tag, deps: [], target: i0.ɵɵFactoryTarget.Component });
Tag.ɵcmp = i0.ɵɵngDeclareComponent({ minVersion: "14.0.0", version: "14.0.7", type: Tag, selector: "p-tag", inputs: { styleClass: "styleClass", style: "style", severity: "severity", value: "value", icon: "icon", rounded: "rounded" }, host: { classAttribute: "p-element" }, ngImport: i0, template: `
        <span [ngClass]="containerClass()" [class]="styleClass" [ngStyle]="style">
            <ng-content></ng-content>
            <span class="p-tag-icon" [ngClass]="icon" *ngIf="icon"></span>
            <span class="p-tag-value">{{ value }}</span>
        </span>
    `, isInline: true, styles: [".p-tag{display:inline-flex;align-items:center;justify-content:center}.p-tag-icon,.p-tag-value,.p-tag-icon.pi{line-height:1.5}.p-tag.p-tag-rounded{border-radius:10rem}\n"], dependencies: [{ kind: "directive", type: i1.NgClass, selector: "[ngClass]", inputs: ["class", "ngClass"] }, { kind: "directive", type: i1.NgIf, selector: "[ngIf]", inputs: ["ngIf", "ngIfThen", "ngIfElse"] }, { kind: "directive", type: i1.NgStyle, selector: "[ngStyle]", inputs: ["ngStyle"] }], changeDetection: i0.ChangeDetectionStrategy.OnPush, encapsulation: i0.ViewEncapsulation.None });
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "14.0.7", ngImport: i0, type: Tag, decorators: [{
            type: Component,
            args: [{ selector: 'p-tag', template: `
        <span [ngClass]="containerClass()" [class]="styleClass" [ngStyle]="style">
            <ng-content></ng-content>
            <span class="p-tag-icon" [ngClass]="icon" *ngIf="icon"></span>
            <span class="p-tag-value">{{ value }}</span>
        </span>
    `, changeDetection: ChangeDetectionStrategy.OnPush, encapsulation: ViewEncapsulation.None, host: {
                        class: 'p-element'
                    }, styles: [".p-tag{display:inline-flex;align-items:center;justify-content:center}.p-tag-icon,.p-tag-value,.p-tag-icon.pi{line-height:1.5}.p-tag.p-tag-rounded{border-radius:10rem}\n"] }]
        }], propDecorators: { styleClass: [{
                type: Input
            }], style: [{
                type: Input
            }], severity: [{
                type: Input
            }], value: [{
                type: Input
            }], icon: [{
                type: Input
            }], rounded: [{
                type: Input
            }] } });
export class TagModule {
}
TagModule.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "14.0.7", ngImport: i0, type: TagModule, deps: [], target: i0.ɵɵFactoryTarget.NgModule });
TagModule.ɵmod = i0.ɵɵngDeclareNgModule({ minVersion: "14.0.0", version: "14.0.7", ngImport: i0, type: TagModule, declarations: [Tag], imports: [CommonModule], exports: [Tag] });
TagModule.ɵinj = i0.ɵɵngDeclareInjector({ minVersion: "12.0.0", version: "14.0.7", ngImport: i0, type: TagModule, imports: [CommonModule] });
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "14.0.7", ngImport: i0, type: TagModule, decorators: [{
            type: NgModule,
            args: [{
                    imports: [CommonModule],
                    exports: [Tag],
                    declarations: [Tag]
                }]
        }] });
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoidGFnLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vc3JjL2FwcC9jb21wb25lbnRzL3RhZy90YWcudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUEsT0FBTyxFQUFFLFFBQVEsRUFBRSxTQUFTLEVBQUUsdUJBQXVCLEVBQUUsaUJBQWlCLEVBQUUsS0FBSyxFQUFFLE1BQU0sZUFBZSxDQUFDO0FBQ3ZHLE9BQU8sRUFBRSxZQUFZLEVBQUUsTUFBTSxpQkFBaUIsQ0FBQzs7O0FBa0IvQyxNQUFNLE9BQU8sR0FBRztJQWFaLGNBQWM7UUFDVixPQUFPO1lBQ0gsbUJBQW1CLEVBQUUsSUFBSTtZQUN6QixZQUFZLEVBQUUsSUFBSSxDQUFDLFFBQVEsS0FBSyxNQUFNO1lBQ3RDLGVBQWUsRUFBRSxJQUFJLENBQUMsUUFBUSxLQUFLLFNBQVM7WUFDNUMsZUFBZSxFQUFFLElBQUksQ0FBQyxRQUFRLEtBQUssU0FBUztZQUM1QyxjQUFjLEVBQUUsSUFBSSxDQUFDLFFBQVEsS0FBSyxRQUFRO1lBQzFDLGVBQWUsRUFBRSxJQUFJLENBQUMsT0FBTztTQUNoQyxDQUFDO0lBQ04sQ0FBQzs7Z0dBdEJRLEdBQUc7b0ZBQUgsR0FBRyxrTkFkRjs7Ozs7O0tBTVQ7MkZBUVEsR0FBRztrQkFoQmYsU0FBUzsrQkFDSSxPQUFPLFlBQ1A7Ozs7OztLQU1ULG1CQUNnQix1QkFBdUIsQ0FBQyxNQUFNLGlCQUNoQyxpQkFBaUIsQ0FBQyxJQUFJLFFBRS9CO3dCQUNGLEtBQUssRUFBRSxXQUFXO3FCQUNyQjs4QkFHUSxVQUFVO3NCQUFsQixLQUFLO2dCQUVHLEtBQUs7c0JBQWIsS0FBSztnQkFFRyxRQUFRO3NCQUFoQixLQUFLO2dCQUVHLEtBQUs7c0JBQWIsS0FBSztnQkFFRyxJQUFJO3NCQUFaLEtBQUs7Z0JBRUcsT0FBTztzQkFBZixLQUFLOztBQW1CVixNQUFNLE9BQU8sU0FBUzs7c0dBQVQsU0FBUzt1R0FBVCxTQUFTLGlCQTlCVCxHQUFHLGFBMEJGLFlBQVksYUExQmIsR0FBRzt1R0E4QkgsU0FBUyxZQUpSLFlBQVk7MkZBSWIsU0FBUztrQkFMckIsUUFBUTttQkFBQztvQkFDTixPQUFPLEVBQUUsQ0FBQyxZQUFZLENBQUM7b0JBQ3ZCLE9BQU8sRUFBRSxDQUFDLEdBQUcsQ0FBQztvQkFDZCxZQUFZLEVBQUUsQ0FBQyxHQUFHLENBQUM7aUJBQ3RCIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHsgTmdNb2R1bGUsIENvbXBvbmVudCwgQ2hhbmdlRGV0ZWN0aW9uU3RyYXRlZ3ksIFZpZXdFbmNhcHN1bGF0aW9uLCBJbnB1dCB9IGZyb20gJ0Bhbmd1bGFyL2NvcmUnO1xuaW1wb3J0IHsgQ29tbW9uTW9kdWxlIH0gZnJvbSAnQGFuZ3VsYXIvY29tbW9uJztcblxuQENvbXBvbmVudCh7XG4gICAgc2VsZWN0b3I6ICdwLXRhZycsXG4gICAgdGVtcGxhdGU6IGBcbiAgICAgICAgPHNwYW4gW25nQ2xhc3NdPVwiY29udGFpbmVyQ2xhc3MoKVwiIFtjbGFzc109XCJzdHlsZUNsYXNzXCIgW25nU3R5bGVdPVwic3R5bGVcIj5cbiAgICAgICAgICAgIDxuZy1jb250ZW50PjwvbmctY29udGVudD5cbiAgICAgICAgICAgIDxzcGFuIGNsYXNzPVwicC10YWctaWNvblwiIFtuZ0NsYXNzXT1cImljb25cIiAqbmdJZj1cImljb25cIj48L3NwYW4+XG4gICAgICAgICAgICA8c3BhbiBjbGFzcz1cInAtdGFnLXZhbHVlXCI+e3sgdmFsdWUgfX08L3NwYW4+XG4gICAgICAgIDwvc3Bhbj5cbiAgICBgLFxuICAgIGNoYW5nZURldGVjdGlvbjogQ2hhbmdlRGV0ZWN0aW9uU3RyYXRlZ3kuT25QdXNoLFxuICAgIGVuY2Fwc3VsYXRpb246IFZpZXdFbmNhcHN1bGF0aW9uLk5vbmUsXG4gICAgc3R5bGVVcmxzOiBbJy4vdGFnLmNzcyddLFxuICAgIGhvc3Q6IHtcbiAgICAgICAgY2xhc3M6ICdwLWVsZW1lbnQnXG4gICAgfVxufSlcbmV4cG9ydCBjbGFzcyBUYWcge1xuICAgIEBJbnB1dCgpIHN0eWxlQ2xhc3M6IHN0cmluZztcblxuICAgIEBJbnB1dCgpIHN0eWxlOiBhbnk7XG5cbiAgICBASW5wdXQoKSBzZXZlcml0eTogc3RyaW5nO1xuXG4gICAgQElucHV0KCkgdmFsdWU6IHN0cmluZztcblxuICAgIEBJbnB1dCgpIGljb246IHN0cmluZztcblxuICAgIEBJbnB1dCgpIHJvdW5kZWQ6IGJvb2xlYW47XG5cbiAgICBjb250YWluZXJDbGFzcygpIHtcbiAgICAgICAgcmV0dXJuIHtcbiAgICAgICAgICAgICdwLXRhZyBwLWNvbXBvbmVudCc6IHRydWUsXG4gICAgICAgICAgICAncC10YWctaW5mbyc6IHRoaXMuc2V2ZXJpdHkgPT09ICdpbmZvJyxcbiAgICAgICAgICAgICdwLXRhZy1zdWNjZXNzJzogdGhpcy5zZXZlcml0eSA9PT0gJ3N1Y2Nlc3MnLFxuICAgICAgICAgICAgJ3AtdGFnLXdhcm5pbmcnOiB0aGlzLnNldmVyaXR5ID09PSAnd2FybmluZycsXG4gICAgICAgICAgICAncC10YWctZGFuZ2VyJzogdGhpcy5zZXZlcml0eSA9PT0gJ2RhbmdlcicsXG4gICAgICAgICAgICAncC10YWctcm91bmRlZCc6IHRoaXMucm91bmRlZFxuICAgICAgICB9O1xuICAgIH1cbn1cblxuQE5nTW9kdWxlKHtcbiAgICBpbXBvcnRzOiBbQ29tbW9uTW9kdWxlXSxcbiAgICBleHBvcnRzOiBbVGFnXSxcbiAgICBkZWNsYXJhdGlvbnM6IFtUYWddXG59KVxuZXhwb3J0IGNsYXNzIFRhZ01vZHVsZSB7fVxuIl19
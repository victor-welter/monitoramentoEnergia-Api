import { NgModule, Component, Input, ChangeDetectionStrategy, ViewEncapsulation } from '@angular/core';
import { CommonModule } from '@angular/common';
import * as i0 from "@angular/core";
import * as i1 from "@angular/common";
export class ProgressSpinner {
    constructor() {
        this.strokeWidth = '2';
        this.fill = 'none';
        this.animationDuration = '2s';
    }
}
ProgressSpinner.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "14.0.7", ngImport: i0, type: ProgressSpinner, deps: [], target: i0.ɵɵFactoryTarget.Component });
ProgressSpinner.ɵcmp = i0.ɵɵngDeclareComponent({ minVersion: "14.0.0", version: "14.0.7", type: ProgressSpinner, selector: "p-progressSpinner", inputs: { style: "style", styleClass: "styleClass", strokeWidth: "strokeWidth", fill: "fill", animationDuration: "animationDuration" }, host: { classAttribute: "p-element" }, ngImport: i0, template: `
        <div class="p-progress-spinner" [ngStyle]="style" [ngClass]="styleClass" role="alert" aria-busy="true">
            <svg class="p-progress-spinner-svg" viewBox="25 25 50 50" [style.animation-duration]="animationDuration">
                <circle class="p-progress-spinner-circle" cx="50" cy="50" r="20" [attr.fill]="fill" [attr.stroke-width]="strokeWidth" stroke-miterlimit="10" />
            </svg>
        </div>
    `, isInline: true, styles: [".p-progress-spinner{position:relative;margin:0 auto;width:100px;height:100px;display:inline-block}.p-progress-spinner:before{content:\"\";display:block;padding-top:100%}.p-progress-spinner-svg{animation:p-progress-spinner-rotate 2s linear infinite;height:100%;transform-origin:center center;width:100%;position:absolute;inset:0;margin:auto}.p-progress-spinner-circle{stroke-dasharray:89,200;stroke-dashoffset:0;stroke:#d62d20;animation:p-progress-spinner-dash 1.5s ease-in-out infinite,p-progress-spinner-color 6s ease-in-out infinite;stroke-linecap:round}@keyframes p-progress-spinner-rotate{to{transform:rotate(360deg)}}@keyframes p-progress-spinner-dash{0%{stroke-dasharray:1,200;stroke-dashoffset:0}50%{stroke-dasharray:89,200;stroke-dashoffset:-35px}to{stroke-dasharray:89,200;stroke-dashoffset:-124px}}@keyframes p-progress-spinner-color{to,0%{stroke:#d62d20}40%{stroke:#0057e7}66%{stroke:#008744}80%,90%{stroke:#ffa700}}\n"], dependencies: [{ kind: "directive", type: i1.NgClass, selector: "[ngClass]", inputs: ["class", "ngClass"] }, { kind: "directive", type: i1.NgStyle, selector: "[ngStyle]", inputs: ["ngStyle"] }], changeDetection: i0.ChangeDetectionStrategy.OnPush, encapsulation: i0.ViewEncapsulation.None });
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "14.0.7", ngImport: i0, type: ProgressSpinner, decorators: [{
            type: Component,
            args: [{ selector: 'p-progressSpinner', template: `
        <div class="p-progress-spinner" [ngStyle]="style" [ngClass]="styleClass" role="alert" aria-busy="true">
            <svg class="p-progress-spinner-svg" viewBox="25 25 50 50" [style.animation-duration]="animationDuration">
                <circle class="p-progress-spinner-circle" cx="50" cy="50" r="20" [attr.fill]="fill" [attr.stroke-width]="strokeWidth" stroke-miterlimit="10" />
            </svg>
        </div>
    `, changeDetection: ChangeDetectionStrategy.OnPush, encapsulation: ViewEncapsulation.None, host: {
                        class: 'p-element'
                    }, styles: [".p-progress-spinner{position:relative;margin:0 auto;width:100px;height:100px;display:inline-block}.p-progress-spinner:before{content:\"\";display:block;padding-top:100%}.p-progress-spinner-svg{animation:p-progress-spinner-rotate 2s linear infinite;height:100%;transform-origin:center center;width:100%;position:absolute;inset:0;margin:auto}.p-progress-spinner-circle{stroke-dasharray:89,200;stroke-dashoffset:0;stroke:#d62d20;animation:p-progress-spinner-dash 1.5s ease-in-out infinite,p-progress-spinner-color 6s ease-in-out infinite;stroke-linecap:round}@keyframes p-progress-spinner-rotate{to{transform:rotate(360deg)}}@keyframes p-progress-spinner-dash{0%{stroke-dasharray:1,200;stroke-dashoffset:0}50%{stroke-dasharray:89,200;stroke-dashoffset:-35px}to{stroke-dasharray:89,200;stroke-dashoffset:-124px}}@keyframes p-progress-spinner-color{to,0%{stroke:#d62d20}40%{stroke:#0057e7}66%{stroke:#008744}80%,90%{stroke:#ffa700}}\n"] }]
        }], propDecorators: { style: [{
                type: Input
            }], styleClass: [{
                type: Input
            }], strokeWidth: [{
                type: Input
            }], fill: [{
                type: Input
            }], animationDuration: [{
                type: Input
            }] } });
export class ProgressSpinnerModule {
}
ProgressSpinnerModule.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "14.0.7", ngImport: i0, type: ProgressSpinnerModule, deps: [], target: i0.ɵɵFactoryTarget.NgModule });
ProgressSpinnerModule.ɵmod = i0.ɵɵngDeclareNgModule({ minVersion: "14.0.0", version: "14.0.7", ngImport: i0, type: ProgressSpinnerModule, declarations: [ProgressSpinner], imports: [CommonModule], exports: [ProgressSpinner] });
ProgressSpinnerModule.ɵinj = i0.ɵɵngDeclareInjector({ minVersion: "12.0.0", version: "14.0.7", ngImport: i0, type: ProgressSpinnerModule, imports: [CommonModule] });
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "14.0.7", ngImport: i0, type: ProgressSpinnerModule, decorators: [{
            type: NgModule,
            args: [{
                    imports: [CommonModule],
                    exports: [ProgressSpinner],
                    declarations: [ProgressSpinner]
                }]
        }] });
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicHJvZ3Jlc3NzcGlubmVyLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vc3JjL2FwcC9jb21wb25lbnRzL3Byb2dyZXNzc3Bpbm5lci9wcm9ncmVzc3NwaW5uZXIudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUEsT0FBTyxFQUFFLFFBQVEsRUFBRSxTQUFTLEVBQUUsS0FBSyxFQUFFLHVCQUF1QixFQUFFLGlCQUFpQixFQUFFLE1BQU0sZUFBZSxDQUFDO0FBQ3ZHLE9BQU8sRUFBRSxZQUFZLEVBQUUsTUFBTSxpQkFBaUIsQ0FBQzs7O0FBa0IvQyxNQUFNLE9BQU8sZUFBZTtJQWhCNUI7UUFxQmEsZ0JBQVcsR0FBVyxHQUFHLENBQUM7UUFFMUIsU0FBSSxHQUFXLE1BQU0sQ0FBQztRQUV0QixzQkFBaUIsR0FBVyxJQUFJLENBQUM7S0FDN0M7OzRHQVZZLGVBQWU7Z0dBQWYsZUFBZSx3T0FkZDs7Ozs7O0tBTVQ7MkZBUVEsZUFBZTtrQkFoQjNCLFNBQVM7K0JBQ0ksbUJBQW1CLFlBQ25COzs7Ozs7S0FNVCxtQkFDZ0IsdUJBQXVCLENBQUMsTUFBTSxpQkFDaEMsaUJBQWlCLENBQUMsSUFBSSxRQUUvQjt3QkFDRixLQUFLLEVBQUUsV0FBVztxQkFDckI7OEJBR1EsS0FBSztzQkFBYixLQUFLO2dCQUVHLFVBQVU7c0JBQWxCLEtBQUs7Z0JBRUcsV0FBVztzQkFBbkIsS0FBSztnQkFFRyxJQUFJO3NCQUFaLEtBQUs7Z0JBRUcsaUJBQWlCO3NCQUF6QixLQUFLOztBQVFWLE1BQU0sT0FBTyxxQkFBcUI7O2tIQUFyQixxQkFBcUI7bUhBQXJCLHFCQUFxQixpQkFqQnJCLGVBQWUsYUFhZCxZQUFZLGFBYmIsZUFBZTttSEFpQmYscUJBQXFCLFlBSnBCLFlBQVk7MkZBSWIscUJBQXFCO2tCQUxqQyxRQUFRO21CQUFDO29CQUNOLE9BQU8sRUFBRSxDQUFDLFlBQVksQ0FBQztvQkFDdkIsT0FBTyxFQUFFLENBQUMsZUFBZSxDQUFDO29CQUMxQixZQUFZLEVBQUUsQ0FBQyxlQUFlLENBQUM7aUJBQ2xDIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHsgTmdNb2R1bGUsIENvbXBvbmVudCwgSW5wdXQsIENoYW5nZURldGVjdGlvblN0cmF0ZWd5LCBWaWV3RW5jYXBzdWxhdGlvbiB9IGZyb20gJ0Bhbmd1bGFyL2NvcmUnO1xuaW1wb3J0IHsgQ29tbW9uTW9kdWxlIH0gZnJvbSAnQGFuZ3VsYXIvY29tbW9uJztcblxuQENvbXBvbmVudCh7XG4gICAgc2VsZWN0b3I6ICdwLXByb2dyZXNzU3Bpbm5lcicsXG4gICAgdGVtcGxhdGU6IGBcbiAgICAgICAgPGRpdiBjbGFzcz1cInAtcHJvZ3Jlc3Mtc3Bpbm5lclwiIFtuZ1N0eWxlXT1cInN0eWxlXCIgW25nQ2xhc3NdPVwic3R5bGVDbGFzc1wiIHJvbGU9XCJhbGVydFwiIGFyaWEtYnVzeT1cInRydWVcIj5cbiAgICAgICAgICAgIDxzdmcgY2xhc3M9XCJwLXByb2dyZXNzLXNwaW5uZXItc3ZnXCIgdmlld0JveD1cIjI1IDI1IDUwIDUwXCIgW3N0eWxlLmFuaW1hdGlvbi1kdXJhdGlvbl09XCJhbmltYXRpb25EdXJhdGlvblwiPlxuICAgICAgICAgICAgICAgIDxjaXJjbGUgY2xhc3M9XCJwLXByb2dyZXNzLXNwaW5uZXItY2lyY2xlXCIgY3g9XCI1MFwiIGN5PVwiNTBcIiByPVwiMjBcIiBbYXR0ci5maWxsXT1cImZpbGxcIiBbYXR0ci5zdHJva2Utd2lkdGhdPVwic3Ryb2tlV2lkdGhcIiBzdHJva2UtbWl0ZXJsaW1pdD1cIjEwXCIgLz5cbiAgICAgICAgICAgIDwvc3ZnPlxuICAgICAgICA8L2Rpdj5cbiAgICBgLFxuICAgIGNoYW5nZURldGVjdGlvbjogQ2hhbmdlRGV0ZWN0aW9uU3RyYXRlZ3kuT25QdXNoLFxuICAgIGVuY2Fwc3VsYXRpb246IFZpZXdFbmNhcHN1bGF0aW9uLk5vbmUsXG4gICAgc3R5bGVVcmxzOiBbJy4vcHJvZ3Jlc3NzcGlubmVyLmNzcyddLFxuICAgIGhvc3Q6IHtcbiAgICAgICAgY2xhc3M6ICdwLWVsZW1lbnQnXG4gICAgfVxufSlcbmV4cG9ydCBjbGFzcyBQcm9ncmVzc1NwaW5uZXIge1xuICAgIEBJbnB1dCgpIHN0eWxlOiBhbnk7XG5cbiAgICBASW5wdXQoKSBzdHlsZUNsYXNzOiBzdHJpbmc7XG5cbiAgICBASW5wdXQoKSBzdHJva2VXaWR0aDogc3RyaW5nID0gJzInO1xuXG4gICAgQElucHV0KCkgZmlsbDogc3RyaW5nID0gJ25vbmUnO1xuXG4gICAgQElucHV0KCkgYW5pbWF0aW9uRHVyYXRpb246IHN0cmluZyA9ICcycyc7XG59XG5cbkBOZ01vZHVsZSh7XG4gICAgaW1wb3J0czogW0NvbW1vbk1vZHVsZV0sXG4gICAgZXhwb3J0czogW1Byb2dyZXNzU3Bpbm5lcl0sXG4gICAgZGVjbGFyYXRpb25zOiBbUHJvZ3Jlc3NTcGlubmVyXVxufSlcbmV4cG9ydCBjbGFzcyBQcm9ncmVzc1NwaW5uZXJNb2R1bGUge31cbiJdfQ==
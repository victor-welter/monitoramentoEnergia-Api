import { NgModule, Component, Input, ChangeDetectionStrategy, ViewEncapsulation } from '@angular/core';
import { CommonModule } from '@angular/common';
import * as i0 from "@angular/core";
import * as i1 from "@angular/common";
export class UIMessage {
    constructor() {
        this.escape = true;
    }
    get icon() {
        let icon = null;
        if (this.severity) {
            switch (this.severity) {
                case 'success':
                    icon = 'pi pi-check';
                    break;
                case 'info':
                    icon = 'pi pi-info-circle';
                    break;
                case 'error':
                    icon = 'pi pi-times-circle';
                    break;
                case 'warn':
                    icon = 'pi pi-exclamation-triangle';
                    break;
                default:
                    icon = 'pi pi-info-circle';
                    break;
            }
        }
        return icon;
    }
}
UIMessage.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "14.0.7", ngImport: i0, type: UIMessage, deps: [], target: i0.ɵɵFactoryTarget.Component });
UIMessage.ɵcmp = i0.ɵɵngDeclareComponent({ minVersion: "14.0.0", version: "14.0.7", type: UIMessage, selector: "p-message", inputs: { severity: "severity", text: "text", escape: "escape", style: "style", styleClass: "styleClass" }, host: { classAttribute: "p-element" }, ngImport: i0, template: `
        <div
            aria-live="polite"
            class="p-inline-message p-component p-inline-message"
            *ngIf="severity"
            [ngStyle]="style"
            [class]="styleClass"
            [ngClass]="{
                'p-inline-message-info': severity === 'info',
                'p-inline-message-warn': severity === 'warn',
                'p-inline-message-error': severity === 'error',
                'p-inline-message-success': severity === 'success',
                'p-inline-message-icon-only': this.text == null
            }"
        >
            <span class="p-inline-message-icon" [ngClass]="icon"></span>
            <div *ngIf="!escape; else escapeOut">
                <span *ngIf="!escape" class="p-inline-message-text" [innerHTML]="text"></span>
            </div>
            <ng-template #escapeOut>
                <span *ngIf="escape" class="p-inline-message-text">{{ text }}</span>
            </ng-template>
        </div>
    `, isInline: true, styles: [".p-inline-message{display:inline-flex;align-items:center;justify-content:center;vertical-align:top}.p-inline-message-icon-only .p-inline-message-text{visibility:hidden;width:0}.p-fluid .p-inline-message{display:flex}\n"], dependencies: [{ kind: "directive", type: i1.NgClass, selector: "[ngClass]", inputs: ["class", "ngClass"] }, { kind: "directive", type: i1.NgIf, selector: "[ngIf]", inputs: ["ngIf", "ngIfThen", "ngIfElse"] }, { kind: "directive", type: i1.NgStyle, selector: "[ngStyle]", inputs: ["ngStyle"] }], changeDetection: i0.ChangeDetectionStrategy.OnPush, encapsulation: i0.ViewEncapsulation.None });
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "14.0.7", ngImport: i0, type: UIMessage, decorators: [{
            type: Component,
            args: [{ selector: 'p-message', template: `
        <div
            aria-live="polite"
            class="p-inline-message p-component p-inline-message"
            *ngIf="severity"
            [ngStyle]="style"
            [class]="styleClass"
            [ngClass]="{
                'p-inline-message-info': severity === 'info',
                'p-inline-message-warn': severity === 'warn',
                'p-inline-message-error': severity === 'error',
                'p-inline-message-success': severity === 'success',
                'p-inline-message-icon-only': this.text == null
            }"
        >
            <span class="p-inline-message-icon" [ngClass]="icon"></span>
            <div *ngIf="!escape; else escapeOut">
                <span *ngIf="!escape" class="p-inline-message-text" [innerHTML]="text"></span>
            </div>
            <ng-template #escapeOut>
                <span *ngIf="escape" class="p-inline-message-text">{{ text }}</span>
            </ng-template>
        </div>
    `, changeDetection: ChangeDetectionStrategy.OnPush, encapsulation: ViewEncapsulation.None, host: {
                        class: 'p-element'
                    }, styles: [".p-inline-message{display:inline-flex;align-items:center;justify-content:center;vertical-align:top}.p-inline-message-icon-only .p-inline-message-text{visibility:hidden;width:0}.p-fluid .p-inline-message{display:flex}\n"] }]
        }], propDecorators: { severity: [{
                type: Input
            }], text: [{
                type: Input
            }], escape: [{
                type: Input
            }], style: [{
                type: Input
            }], styleClass: [{
                type: Input
            }] } });
export class MessageModule {
}
MessageModule.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "14.0.7", ngImport: i0, type: MessageModule, deps: [], target: i0.ɵɵFactoryTarget.NgModule });
MessageModule.ɵmod = i0.ɵɵngDeclareNgModule({ minVersion: "14.0.0", version: "14.0.7", ngImport: i0, type: MessageModule, declarations: [UIMessage], imports: [CommonModule], exports: [UIMessage] });
MessageModule.ɵinj = i0.ɵɵngDeclareInjector({ minVersion: "12.0.0", version: "14.0.7", ngImport: i0, type: MessageModule, imports: [CommonModule] });
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "14.0.7", ngImport: i0, type: MessageModule, decorators: [{
            type: NgModule,
            args: [{
                    imports: [CommonModule],
                    exports: [UIMessage],
                    declarations: [UIMessage]
                }]
        }] });
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibWVzc2FnZS5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uL3NyYy9hcHAvY29tcG9uZW50cy9tZXNzYWdlL21lc3NhZ2UudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUEsT0FBTyxFQUFFLFFBQVEsRUFBRSxTQUFTLEVBQUUsS0FBSyxFQUFFLHVCQUF1QixFQUFFLGlCQUFpQixFQUFFLE1BQU0sZUFBZSxDQUFDO0FBQ3ZHLE9BQU8sRUFBRSxZQUFZLEVBQUUsTUFBTSxpQkFBaUIsQ0FBQzs7O0FBbUMvQyxNQUFNLE9BQU8sU0FBUztJQWpDdEI7UUFzQ2EsV0FBTSxHQUFZLElBQUksQ0FBQztLQW1DbkM7SUE3QkcsSUFBSSxJQUFJO1FBQ0osSUFBSSxJQUFJLEdBQVcsSUFBSSxDQUFDO1FBRXhCLElBQUksSUFBSSxDQUFDLFFBQVEsRUFBRTtZQUNmLFFBQVEsSUFBSSxDQUFDLFFBQVEsRUFBRTtnQkFDbkIsS0FBSyxTQUFTO29CQUNWLElBQUksR0FBRyxhQUFhLENBQUM7b0JBQ3JCLE1BQU07Z0JBRVYsS0FBSyxNQUFNO29CQUNQLElBQUksR0FBRyxtQkFBbUIsQ0FBQztvQkFDM0IsTUFBTTtnQkFFVixLQUFLLE9BQU87b0JBQ1IsSUFBSSxHQUFHLG9CQUFvQixDQUFDO29CQUM1QixNQUFNO2dCQUVWLEtBQUssTUFBTTtvQkFDUCxJQUFJLEdBQUcsNEJBQTRCLENBQUM7b0JBQ3BDLE1BQU07Z0JBRVY7b0JBQ0ksSUFBSSxHQUFHLG1CQUFtQixDQUFDO29CQUMzQixNQUFNO2FBQ2I7U0FDSjtRQUVELE9BQU8sSUFBSSxDQUFDO0lBQ2hCLENBQUM7O3NHQXZDUSxTQUFTOzBGQUFULFNBQVMsb01BL0JSOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztLQXVCVDsyRkFRUSxTQUFTO2tCQWpDckIsU0FBUzsrQkFDSSxXQUFXLFlBQ1g7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O0tBdUJULG1CQUNnQix1QkFBdUIsQ0FBQyxNQUFNLGlCQUNoQyxpQkFBaUIsQ0FBQyxJQUFJLFFBRS9CO3dCQUNGLEtBQUssRUFBRSxXQUFXO3FCQUNyQjs4QkFHUSxRQUFRO3NCQUFoQixLQUFLO2dCQUVHLElBQUk7c0JBQVosS0FBSztnQkFFRyxNQUFNO3NCQUFkLEtBQUs7Z0JBRUcsS0FBSztzQkFBYixLQUFLO2dCQUVHLFVBQVU7c0JBQWxCLEtBQUs7O0FBc0NWLE1BQU0sT0FBTyxhQUFhOzswR0FBYixhQUFhOzJHQUFiLGFBQWEsaUJBL0NiLFNBQVMsYUEyQ1IsWUFBWSxhQTNDYixTQUFTOzJHQStDVCxhQUFhLFlBSlosWUFBWTsyRkFJYixhQUFhO2tCQUx6QixRQUFRO21CQUFDO29CQUNOLE9BQU8sRUFBRSxDQUFDLFlBQVksQ0FBQztvQkFDdkIsT0FBTyxFQUFFLENBQUMsU0FBUyxDQUFDO29CQUNwQixZQUFZLEVBQUUsQ0FBQyxTQUFTLENBQUM7aUJBQzVCIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHsgTmdNb2R1bGUsIENvbXBvbmVudCwgSW5wdXQsIENoYW5nZURldGVjdGlvblN0cmF0ZWd5LCBWaWV3RW5jYXBzdWxhdGlvbiB9IGZyb20gJ0Bhbmd1bGFyL2NvcmUnO1xuaW1wb3J0IHsgQ29tbW9uTW9kdWxlIH0gZnJvbSAnQGFuZ3VsYXIvY29tbW9uJztcblxuQENvbXBvbmVudCh7XG4gICAgc2VsZWN0b3I6ICdwLW1lc3NhZ2UnLFxuICAgIHRlbXBsYXRlOiBgXG4gICAgICAgIDxkaXZcbiAgICAgICAgICAgIGFyaWEtbGl2ZT1cInBvbGl0ZVwiXG4gICAgICAgICAgICBjbGFzcz1cInAtaW5saW5lLW1lc3NhZ2UgcC1jb21wb25lbnQgcC1pbmxpbmUtbWVzc2FnZVwiXG4gICAgICAgICAgICAqbmdJZj1cInNldmVyaXR5XCJcbiAgICAgICAgICAgIFtuZ1N0eWxlXT1cInN0eWxlXCJcbiAgICAgICAgICAgIFtjbGFzc109XCJzdHlsZUNsYXNzXCJcbiAgICAgICAgICAgIFtuZ0NsYXNzXT1cIntcbiAgICAgICAgICAgICAgICAncC1pbmxpbmUtbWVzc2FnZS1pbmZvJzogc2V2ZXJpdHkgPT09ICdpbmZvJyxcbiAgICAgICAgICAgICAgICAncC1pbmxpbmUtbWVzc2FnZS13YXJuJzogc2V2ZXJpdHkgPT09ICd3YXJuJyxcbiAgICAgICAgICAgICAgICAncC1pbmxpbmUtbWVzc2FnZS1lcnJvcic6IHNldmVyaXR5ID09PSAnZXJyb3InLFxuICAgICAgICAgICAgICAgICdwLWlubGluZS1tZXNzYWdlLXN1Y2Nlc3MnOiBzZXZlcml0eSA9PT0gJ3N1Y2Nlc3MnLFxuICAgICAgICAgICAgICAgICdwLWlubGluZS1tZXNzYWdlLWljb24tb25seSc6IHRoaXMudGV4dCA9PSBudWxsXG4gICAgICAgICAgICB9XCJcbiAgICAgICAgPlxuICAgICAgICAgICAgPHNwYW4gY2xhc3M9XCJwLWlubGluZS1tZXNzYWdlLWljb25cIiBbbmdDbGFzc109XCJpY29uXCI+PC9zcGFuPlxuICAgICAgICAgICAgPGRpdiAqbmdJZj1cIiFlc2NhcGU7IGVsc2UgZXNjYXBlT3V0XCI+XG4gICAgICAgICAgICAgICAgPHNwYW4gKm5nSWY9XCIhZXNjYXBlXCIgY2xhc3M9XCJwLWlubGluZS1tZXNzYWdlLXRleHRcIiBbaW5uZXJIVE1MXT1cInRleHRcIj48L3NwYW4+XG4gICAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgICAgIDxuZy10ZW1wbGF0ZSAjZXNjYXBlT3V0PlxuICAgICAgICAgICAgICAgIDxzcGFuICpuZ0lmPVwiZXNjYXBlXCIgY2xhc3M9XCJwLWlubGluZS1tZXNzYWdlLXRleHRcIj57eyB0ZXh0IH19PC9zcGFuPlxuICAgICAgICAgICAgPC9uZy10ZW1wbGF0ZT5cbiAgICAgICAgPC9kaXY+XG4gICAgYCxcbiAgICBjaGFuZ2VEZXRlY3Rpb246IENoYW5nZURldGVjdGlvblN0cmF0ZWd5Lk9uUHVzaCxcbiAgICBlbmNhcHN1bGF0aW9uOiBWaWV3RW5jYXBzdWxhdGlvbi5Ob25lLFxuICAgIHN0eWxlVXJsczogWycuL21lc3NhZ2UuY3NzJ10sXG4gICAgaG9zdDoge1xuICAgICAgICBjbGFzczogJ3AtZWxlbWVudCdcbiAgICB9XG59KVxuZXhwb3J0IGNsYXNzIFVJTWVzc2FnZSB7XG4gICAgQElucHV0KCkgc2V2ZXJpdHk6IHN0cmluZztcblxuICAgIEBJbnB1dCgpIHRleHQ6IHN0cmluZztcblxuICAgIEBJbnB1dCgpIGVzY2FwZTogYm9vbGVhbiA9IHRydWU7XG5cbiAgICBASW5wdXQoKSBzdHlsZTogYW55O1xuXG4gICAgQElucHV0KCkgc3R5bGVDbGFzczogc3RyaW5nO1xuXG4gICAgZ2V0IGljb24oKTogc3RyaW5nIHtcbiAgICAgICAgbGV0IGljb246IHN0cmluZyA9IG51bGw7XG5cbiAgICAgICAgaWYgKHRoaXMuc2V2ZXJpdHkpIHtcbiAgICAgICAgICAgIHN3aXRjaCAodGhpcy5zZXZlcml0eSkge1xuICAgICAgICAgICAgICAgIGNhc2UgJ3N1Y2Nlc3MnOlxuICAgICAgICAgICAgICAgICAgICBpY29uID0gJ3BpIHBpLWNoZWNrJztcbiAgICAgICAgICAgICAgICAgICAgYnJlYWs7XG5cbiAgICAgICAgICAgICAgICBjYXNlICdpbmZvJzpcbiAgICAgICAgICAgICAgICAgICAgaWNvbiA9ICdwaSBwaS1pbmZvLWNpcmNsZSc7XG4gICAgICAgICAgICAgICAgICAgIGJyZWFrO1xuXG4gICAgICAgICAgICAgICAgY2FzZSAnZXJyb3InOlxuICAgICAgICAgICAgICAgICAgICBpY29uID0gJ3BpIHBpLXRpbWVzLWNpcmNsZSc7XG4gICAgICAgICAgICAgICAgICAgIGJyZWFrO1xuXG4gICAgICAgICAgICAgICAgY2FzZSAnd2Fybic6XG4gICAgICAgICAgICAgICAgICAgIGljb24gPSAncGkgcGktZXhjbGFtYXRpb24tdHJpYW5nbGUnO1xuICAgICAgICAgICAgICAgICAgICBicmVhaztcblxuICAgICAgICAgICAgICAgIGRlZmF1bHQ6XG4gICAgICAgICAgICAgICAgICAgIGljb24gPSAncGkgcGktaW5mby1jaXJjbGUnO1xuICAgICAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuXG4gICAgICAgIHJldHVybiBpY29uO1xuICAgIH1cbn1cblxuQE5nTW9kdWxlKHtcbiAgICBpbXBvcnRzOiBbQ29tbW9uTW9kdWxlXSxcbiAgICBleHBvcnRzOiBbVUlNZXNzYWdlXSxcbiAgICBkZWNsYXJhdGlvbnM6IFtVSU1lc3NhZ2VdXG59KVxuZXhwb3J0IGNsYXNzIE1lc3NhZ2VNb2R1bGUge31cbiJdfQ==
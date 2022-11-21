import { NgModule, Component, Input, ChangeDetectionStrategy, ViewEncapsulation } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { DomHandler } from 'primeng/dom';
import * as i0 from "@angular/core";
import * as i1 from "./terminalservice";
import * as i2 from "@angular/common";
import * as i3 from "@angular/forms";
export class Terminal {
    constructor(el, terminalService, cd) {
        this.el = el;
        this.terminalService = terminalService;
        this.cd = cd;
        this.commands = [];
        this.subscription = terminalService.responseHandler.subscribe((response) => {
            this.commands[this.commands.length - 1].response = response;
            this.commandProcessed = true;
        });
    }
    ngAfterViewInit() {
        this.container = DomHandler.find(this.el.nativeElement, '.p-terminal')[0];
    }
    ngAfterViewChecked() {
        if (this.commandProcessed) {
            this.container.scrollTop = this.container.scrollHeight;
            this.commandProcessed = false;
        }
    }
    set response(value) {
        if (value) {
            this.commands[this.commands.length - 1].response = value;
            this.commandProcessed = true;
        }
    }
    handleCommand(event) {
        if (event.keyCode == 13) {
            this.commands.push({ text: this.command });
            this.terminalService.sendCommand(this.command);
            this.command = '';
        }
    }
    focus(element) {
        element.focus();
    }
    ngOnDestroy() {
        if (this.subscription) {
            this.subscription.unsubscribe();
        }
    }
}
Terminal.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "14.0.7", ngImport: i0, type: Terminal, deps: [{ token: i0.ElementRef }, { token: i1.TerminalService }, { token: i0.ChangeDetectorRef }], target: i0.ɵɵFactoryTarget.Component });
Terminal.ɵcmp = i0.ɵɵngDeclareComponent({ minVersion: "14.0.0", version: "14.0.7", type: Terminal, selector: "p-terminal", inputs: { welcomeMessage: "welcomeMessage", prompt: "prompt", style: "style", styleClass: "styleClass", response: "response" }, host: { classAttribute: "p-element" }, ngImport: i0, template: `
        <div [ngClass]="'p-terminal p-component'" [ngStyle]="style" [class]="styleClass" (click)="focus(in)">
            <div *ngIf="welcomeMessage">{{ welcomeMessage }}</div>
            <div class="p-terminal-content">
                <div *ngFor="let command of commands">
                    <span class="p-terminal-prompt">{{ prompt }}</span>
                    <span class="p-terminal-command">{{ command.text }}</span>
                    <div class="p-terminal-response">{{ command.response }}</div>
                </div>
            </div>
            <div class="p-terminal-prompt-container">
                <span class="p-terminal-content-prompt">{{ prompt }}</span>
                <input #in type="text" [(ngModel)]="command" class="p-terminal-input" autocomplete="off" (keydown)="handleCommand($event)" autofocus />
            </div>
        </div>
    `, isInline: true, styles: [".p-terminal{height:18rem;overflow:auto}.p-terminal-prompt-container{display:flex;align-items:center}.p-terminal-input{flex:1 1 auto;border:0 none;background-color:transparent;color:inherit;padding:0;outline:0 none}.p-terminal-input::-ms-clear{display:none}\n"], dependencies: [{ kind: "directive", type: i2.NgClass, selector: "[ngClass]", inputs: ["class", "ngClass"] }, { kind: "directive", type: i2.NgForOf, selector: "[ngFor][ngForOf]", inputs: ["ngForOf", "ngForTrackBy", "ngForTemplate"] }, { kind: "directive", type: i2.NgIf, selector: "[ngIf]", inputs: ["ngIf", "ngIfThen", "ngIfElse"] }, { kind: "directive", type: i2.NgStyle, selector: "[ngStyle]", inputs: ["ngStyle"] }, { kind: "directive", type: i3.DefaultValueAccessor, selector: "input:not([type=checkbox])[formControlName],textarea[formControlName],input:not([type=checkbox])[formControl],textarea[formControl],input:not([type=checkbox])[ngModel],textarea[ngModel],[ngDefaultControl]" }, { kind: "directive", type: i3.NgControlStatus, selector: "[formControlName],[ngModel],[formControl]" }, { kind: "directive", type: i3.NgModel, selector: "[ngModel]:not([formControlName]):not([formControl])", inputs: ["name", "disabled", "ngModel", "ngModelOptions"], outputs: ["ngModelChange"], exportAs: ["ngModel"] }], changeDetection: i0.ChangeDetectionStrategy.OnPush, encapsulation: i0.ViewEncapsulation.None });
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "14.0.7", ngImport: i0, type: Terminal, decorators: [{
            type: Component,
            args: [{ selector: 'p-terminal', template: `
        <div [ngClass]="'p-terminal p-component'" [ngStyle]="style" [class]="styleClass" (click)="focus(in)">
            <div *ngIf="welcomeMessage">{{ welcomeMessage }}</div>
            <div class="p-terminal-content">
                <div *ngFor="let command of commands">
                    <span class="p-terminal-prompt">{{ prompt }}</span>
                    <span class="p-terminal-command">{{ command.text }}</span>
                    <div class="p-terminal-response">{{ command.response }}</div>
                </div>
            </div>
            <div class="p-terminal-prompt-container">
                <span class="p-terminal-content-prompt">{{ prompt }}</span>
                <input #in type="text" [(ngModel)]="command" class="p-terminal-input" autocomplete="off" (keydown)="handleCommand($event)" autofocus />
            </div>
        </div>
    `, changeDetection: ChangeDetectionStrategy.OnPush, encapsulation: ViewEncapsulation.None, host: {
                        class: 'p-element'
                    }, styles: [".p-terminal{height:18rem;overflow:auto}.p-terminal-prompt-container{display:flex;align-items:center}.p-terminal-input{flex:1 1 auto;border:0 none;background-color:transparent;color:inherit;padding:0;outline:0 none}.p-terminal-input::-ms-clear{display:none}\n"] }]
        }], ctorParameters: function () { return [{ type: i0.ElementRef }, { type: i1.TerminalService }, { type: i0.ChangeDetectorRef }]; }, propDecorators: { welcomeMessage: [{
                type: Input
            }], prompt: [{
                type: Input
            }], style: [{
                type: Input
            }], styleClass: [{
                type: Input
            }], response: [{
                type: Input
            }] } });
export class TerminalModule {
}
TerminalModule.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "14.0.7", ngImport: i0, type: TerminalModule, deps: [], target: i0.ɵɵFactoryTarget.NgModule });
TerminalModule.ɵmod = i0.ɵɵngDeclareNgModule({ minVersion: "14.0.0", version: "14.0.7", ngImport: i0, type: TerminalModule, declarations: [Terminal], imports: [CommonModule, FormsModule], exports: [Terminal] });
TerminalModule.ɵinj = i0.ɵɵngDeclareInjector({ minVersion: "12.0.0", version: "14.0.7", ngImport: i0, type: TerminalModule, imports: [CommonModule, FormsModule] });
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "14.0.7", ngImport: i0, type: TerminalModule, decorators: [{
            type: NgModule,
            args: [{
                    imports: [CommonModule, FormsModule],
                    exports: [Terminal],
                    declarations: [Terminal]
                }]
        }] });
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoidGVybWluYWwuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi9zcmMvYXBwL2NvbXBvbmVudHMvdGVybWluYWwvdGVybWluYWwudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUEsT0FBTyxFQUFFLFFBQVEsRUFBRSxTQUFTLEVBQThDLEtBQUssRUFBYyx1QkFBdUIsRUFBRSxpQkFBaUIsRUFBcUIsTUFBTSxlQUFlLENBQUM7QUFDbEwsT0FBTyxFQUFFLFdBQVcsRUFBRSxNQUFNLGdCQUFnQixDQUFDO0FBQzdDLE9BQU8sRUFBRSxZQUFZLEVBQUUsTUFBTSxpQkFBaUIsQ0FBQztBQUMvQyxPQUFPLEVBQUUsVUFBVSxFQUFFLE1BQU0sYUFBYSxDQUFDOzs7OztBQTZCekMsTUFBTSxPQUFPLFFBQVE7SUFtQmpCLFlBQW1CLEVBQWMsRUFBUyxlQUFnQyxFQUFTLEVBQXFCO1FBQXJGLE9BQUUsR0FBRixFQUFFLENBQVk7UUFBUyxvQkFBZSxHQUFmLGVBQWUsQ0FBaUI7UUFBUyxPQUFFLEdBQUYsRUFBRSxDQUFtQjtRQVZ4RyxhQUFRLEdBQVUsRUFBRSxDQUFDO1FBV2pCLElBQUksQ0FBQyxZQUFZLEdBQUcsZUFBZSxDQUFDLGVBQWUsQ0FBQyxTQUFTLENBQUMsQ0FBQyxRQUFRLEVBQUUsRUFBRTtZQUN2RSxJQUFJLENBQUMsUUFBUSxDQUFDLElBQUksQ0FBQyxRQUFRLENBQUMsTUFBTSxHQUFHLENBQUMsQ0FBQyxDQUFDLFFBQVEsR0FBRyxRQUFRLENBQUM7WUFDNUQsSUFBSSxDQUFDLGdCQUFnQixHQUFHLElBQUksQ0FBQztRQUNqQyxDQUFDLENBQUMsQ0FBQztJQUNQLENBQUM7SUFFRCxlQUFlO1FBQ1gsSUFBSSxDQUFDLFNBQVMsR0FBRyxVQUFVLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxFQUFFLENBQUMsYUFBYSxFQUFFLGFBQWEsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDO0lBQzlFLENBQUM7SUFFRCxrQkFBa0I7UUFDZCxJQUFJLElBQUksQ0FBQyxnQkFBZ0IsRUFBRTtZQUN2QixJQUFJLENBQUMsU0FBUyxDQUFDLFNBQVMsR0FBRyxJQUFJLENBQUMsU0FBUyxDQUFDLFlBQVksQ0FBQztZQUN2RCxJQUFJLENBQUMsZ0JBQWdCLEdBQUcsS0FBSyxDQUFDO1NBQ2pDO0lBQ0wsQ0FBQztJQUVELElBQ0ksUUFBUSxDQUFDLEtBQWE7UUFDdEIsSUFBSSxLQUFLLEVBQUU7WUFDUCxJQUFJLENBQUMsUUFBUSxDQUFDLElBQUksQ0FBQyxRQUFRLENBQUMsTUFBTSxHQUFHLENBQUMsQ0FBQyxDQUFDLFFBQVEsR0FBRyxLQUFLLENBQUM7WUFDekQsSUFBSSxDQUFDLGdCQUFnQixHQUFHLElBQUksQ0FBQztTQUNoQztJQUNMLENBQUM7SUFFRCxhQUFhLENBQUMsS0FBb0I7UUFDOUIsSUFBSSxLQUFLLENBQUMsT0FBTyxJQUFJLEVBQUUsRUFBRTtZQUNyQixJQUFJLENBQUMsUUFBUSxDQUFDLElBQUksQ0FBQyxFQUFFLElBQUksRUFBRSxJQUFJLENBQUMsT0FBTyxFQUFFLENBQUMsQ0FBQztZQUMzQyxJQUFJLENBQUMsZUFBZSxDQUFDLFdBQVcsQ0FBQyxJQUFJLENBQUMsT0FBTyxDQUFDLENBQUM7WUFDL0MsSUFBSSxDQUFDLE9BQU8sR0FBRyxFQUFFLENBQUM7U0FDckI7SUFDTCxDQUFDO0lBRUQsS0FBSyxDQUFDLE9BQW9CO1FBQ3RCLE9BQU8sQ0FBQyxLQUFLLEVBQUUsQ0FBQztJQUNwQixDQUFDO0lBRUQsV0FBVztRQUNQLElBQUksSUFBSSxDQUFDLFlBQVksRUFBRTtZQUNuQixJQUFJLENBQUMsWUFBWSxDQUFDLFdBQVcsRUFBRSxDQUFDO1NBQ25DO0lBQ0wsQ0FBQzs7cUdBN0RRLFFBQVE7eUZBQVIsUUFBUSx5TkF2QlA7Ozs7Ozs7Ozs7Ozs7OztLQWVUOzJGQVFRLFFBQVE7a0JBekJwQixTQUFTOytCQUNJLFlBQVksWUFDWjs7Ozs7Ozs7Ozs7Ozs7O0tBZVQsbUJBQ2dCLHVCQUF1QixDQUFDLE1BQU0saUJBQ2hDLGlCQUFpQixDQUFDLElBQUksUUFFL0I7d0JBQ0YsS0FBSyxFQUFFLFdBQVc7cUJBQ3JCOytKQUdRLGNBQWM7c0JBQXRCLEtBQUs7Z0JBRUcsTUFBTTtzQkFBZCxLQUFLO2dCQUVHLEtBQUs7c0JBQWIsS0FBSztnQkFFRyxVQUFVO3NCQUFsQixLQUFLO2dCQStCRixRQUFRO3NCQURYLEtBQUs7O0FBZ0NWLE1BQU0sT0FBTyxjQUFjOzsyR0FBZCxjQUFjOzRHQUFkLGNBQWMsaUJBckVkLFFBQVEsYUFpRVAsWUFBWSxFQUFFLFdBQVcsYUFqRTFCLFFBQVE7NEdBcUVSLGNBQWMsWUFKYixZQUFZLEVBQUUsV0FBVzsyRkFJMUIsY0FBYztrQkFMMUIsUUFBUTttQkFBQztvQkFDTixPQUFPLEVBQUUsQ0FBQyxZQUFZLEVBQUUsV0FBVyxDQUFDO29CQUNwQyxPQUFPLEVBQUUsQ0FBQyxRQUFRLENBQUM7b0JBQ25CLFlBQVksRUFBRSxDQUFDLFFBQVEsQ0FBQztpQkFDM0IiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgeyBOZ01vZHVsZSwgQ29tcG9uZW50LCBBZnRlclZpZXdJbml0LCBBZnRlclZpZXdDaGVja2VkLCBPbkRlc3Ryb3ksIElucHV0LCBFbGVtZW50UmVmLCBDaGFuZ2VEZXRlY3Rpb25TdHJhdGVneSwgVmlld0VuY2Fwc3VsYXRpb24sIENoYW5nZURldGVjdG9yUmVmIH0gZnJvbSAnQGFuZ3VsYXIvY29yZSc7XG5pbXBvcnQgeyBGb3Jtc01vZHVsZSB9IGZyb20gJ0Bhbmd1bGFyL2Zvcm1zJztcbmltcG9ydCB7IENvbW1vbk1vZHVsZSB9IGZyb20gJ0Bhbmd1bGFyL2NvbW1vbic7XG5pbXBvcnQgeyBEb21IYW5kbGVyIH0gZnJvbSAncHJpbWVuZy9kb20nO1xuaW1wb3J0IHsgVGVybWluYWxTZXJ2aWNlIH0gZnJvbSAnLi90ZXJtaW5hbHNlcnZpY2UnO1xuaW1wb3J0IHsgU3Vic2NyaXB0aW9uIH0gZnJvbSAncnhqcyc7XG5cbkBDb21wb25lbnQoe1xuICAgIHNlbGVjdG9yOiAncC10ZXJtaW5hbCcsXG4gICAgdGVtcGxhdGU6IGBcbiAgICAgICAgPGRpdiBbbmdDbGFzc109XCIncC10ZXJtaW5hbCBwLWNvbXBvbmVudCdcIiBbbmdTdHlsZV09XCJzdHlsZVwiIFtjbGFzc109XCJzdHlsZUNsYXNzXCIgKGNsaWNrKT1cImZvY3VzKGluKVwiPlxuICAgICAgICAgICAgPGRpdiAqbmdJZj1cIndlbGNvbWVNZXNzYWdlXCI+e3sgd2VsY29tZU1lc3NhZ2UgfX08L2Rpdj5cbiAgICAgICAgICAgIDxkaXYgY2xhc3M9XCJwLXRlcm1pbmFsLWNvbnRlbnRcIj5cbiAgICAgICAgICAgICAgICA8ZGl2ICpuZ0Zvcj1cImxldCBjb21tYW5kIG9mIGNvbW1hbmRzXCI+XG4gICAgICAgICAgICAgICAgICAgIDxzcGFuIGNsYXNzPVwicC10ZXJtaW5hbC1wcm9tcHRcIj57eyBwcm9tcHQgfX08L3NwYW4+XG4gICAgICAgICAgICAgICAgICAgIDxzcGFuIGNsYXNzPVwicC10ZXJtaW5hbC1jb21tYW5kXCI+e3sgY29tbWFuZC50ZXh0IH19PC9zcGFuPlxuICAgICAgICAgICAgICAgICAgICA8ZGl2IGNsYXNzPVwicC10ZXJtaW5hbC1yZXNwb25zZVwiPnt7IGNvbW1hbmQucmVzcG9uc2UgfX08L2Rpdj5cbiAgICAgICAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgICAgIDwvZGl2PlxuICAgICAgICAgICAgPGRpdiBjbGFzcz1cInAtdGVybWluYWwtcHJvbXB0LWNvbnRhaW5lclwiPlxuICAgICAgICAgICAgICAgIDxzcGFuIGNsYXNzPVwicC10ZXJtaW5hbC1jb250ZW50LXByb21wdFwiPnt7IHByb21wdCB9fTwvc3Bhbj5cbiAgICAgICAgICAgICAgICA8aW5wdXQgI2luIHR5cGU9XCJ0ZXh0XCIgWyhuZ01vZGVsKV09XCJjb21tYW5kXCIgY2xhc3M9XCJwLXRlcm1pbmFsLWlucHV0XCIgYXV0b2NvbXBsZXRlPVwib2ZmXCIgKGtleWRvd24pPVwiaGFuZGxlQ29tbWFuZCgkZXZlbnQpXCIgYXV0b2ZvY3VzIC8+XG4gICAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgPC9kaXY+XG4gICAgYCxcbiAgICBjaGFuZ2VEZXRlY3Rpb246IENoYW5nZURldGVjdGlvblN0cmF0ZWd5Lk9uUHVzaCxcbiAgICBlbmNhcHN1bGF0aW9uOiBWaWV3RW5jYXBzdWxhdGlvbi5Ob25lLFxuICAgIHN0eWxlVXJsczogWycuL3Rlcm1pbmFsLmNzcyddLFxuICAgIGhvc3Q6IHtcbiAgICAgICAgY2xhc3M6ICdwLWVsZW1lbnQnXG4gICAgfVxufSlcbmV4cG9ydCBjbGFzcyBUZXJtaW5hbCBpbXBsZW1lbnRzIEFmdGVyVmlld0luaXQsIEFmdGVyVmlld0NoZWNrZWQsIE9uRGVzdHJveSB7XG4gICAgQElucHV0KCkgd2VsY29tZU1lc3NhZ2U6IHN0cmluZztcblxuICAgIEBJbnB1dCgpIHByb21wdDogc3RyaW5nO1xuXG4gICAgQElucHV0KCkgc3R5bGU6IGFueTtcblxuICAgIEBJbnB1dCgpIHN0eWxlQ2xhc3M6IHN0cmluZztcblxuICAgIGNvbW1hbmRzOiBhbnlbXSA9IFtdO1xuXG4gICAgY29tbWFuZDogc3RyaW5nO1xuXG4gICAgY29udGFpbmVyOiBFbGVtZW50O1xuXG4gICAgY29tbWFuZFByb2Nlc3NlZDogYm9vbGVhbjtcblxuICAgIHN1YnNjcmlwdGlvbjogU3Vic2NyaXB0aW9uO1xuXG4gICAgY29uc3RydWN0b3IocHVibGljIGVsOiBFbGVtZW50UmVmLCBwdWJsaWMgdGVybWluYWxTZXJ2aWNlOiBUZXJtaW5hbFNlcnZpY2UsIHB1YmxpYyBjZDogQ2hhbmdlRGV0ZWN0b3JSZWYpIHtcbiAgICAgICAgdGhpcy5zdWJzY3JpcHRpb24gPSB0ZXJtaW5hbFNlcnZpY2UucmVzcG9uc2VIYW5kbGVyLnN1YnNjcmliZSgocmVzcG9uc2UpID0+IHtcbiAgICAgICAgICAgIHRoaXMuY29tbWFuZHNbdGhpcy5jb21tYW5kcy5sZW5ndGggLSAxXS5yZXNwb25zZSA9IHJlc3BvbnNlO1xuICAgICAgICAgICAgdGhpcy5jb21tYW5kUHJvY2Vzc2VkID0gdHJ1ZTtcbiAgICAgICAgfSk7XG4gICAgfVxuXG4gICAgbmdBZnRlclZpZXdJbml0KCkge1xuICAgICAgICB0aGlzLmNvbnRhaW5lciA9IERvbUhhbmRsZXIuZmluZCh0aGlzLmVsLm5hdGl2ZUVsZW1lbnQsICcucC10ZXJtaW5hbCcpWzBdO1xuICAgIH1cblxuICAgIG5nQWZ0ZXJWaWV3Q2hlY2tlZCgpIHtcbiAgICAgICAgaWYgKHRoaXMuY29tbWFuZFByb2Nlc3NlZCkge1xuICAgICAgICAgICAgdGhpcy5jb250YWluZXIuc2Nyb2xsVG9wID0gdGhpcy5jb250YWluZXIuc2Nyb2xsSGVpZ2h0O1xuICAgICAgICAgICAgdGhpcy5jb21tYW5kUHJvY2Vzc2VkID0gZmFsc2U7XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICBASW5wdXQoKVxuICAgIHNldCByZXNwb25zZSh2YWx1ZTogc3RyaW5nKSB7XG4gICAgICAgIGlmICh2YWx1ZSkge1xuICAgICAgICAgICAgdGhpcy5jb21tYW5kc1t0aGlzLmNvbW1hbmRzLmxlbmd0aCAtIDFdLnJlc3BvbnNlID0gdmFsdWU7XG4gICAgICAgICAgICB0aGlzLmNvbW1hbmRQcm9jZXNzZWQgPSB0cnVlO1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgaGFuZGxlQ29tbWFuZChldmVudDogS2V5Ym9hcmRFdmVudCkge1xuICAgICAgICBpZiAoZXZlbnQua2V5Q29kZSA9PSAxMykge1xuICAgICAgICAgICAgdGhpcy5jb21tYW5kcy5wdXNoKHsgdGV4dDogdGhpcy5jb21tYW5kIH0pO1xuICAgICAgICAgICAgdGhpcy50ZXJtaW5hbFNlcnZpY2Uuc2VuZENvbW1hbmQodGhpcy5jb21tYW5kKTtcbiAgICAgICAgICAgIHRoaXMuY29tbWFuZCA9ICcnO1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgZm9jdXMoZWxlbWVudDogSFRNTEVsZW1lbnQpIHtcbiAgICAgICAgZWxlbWVudC5mb2N1cygpO1xuICAgIH1cblxuICAgIG5nT25EZXN0cm95KCkge1xuICAgICAgICBpZiAodGhpcy5zdWJzY3JpcHRpb24pIHtcbiAgICAgICAgICAgIHRoaXMuc3Vic2NyaXB0aW9uLnVuc3Vic2NyaWJlKCk7XG4gICAgICAgIH1cbiAgICB9XG59XG5cbkBOZ01vZHVsZSh7XG4gICAgaW1wb3J0czogW0NvbW1vbk1vZHVsZSwgRm9ybXNNb2R1bGVdLFxuICAgIGV4cG9ydHM6IFtUZXJtaW5hbF0sXG4gICAgZGVjbGFyYXRpb25zOiBbVGVybWluYWxdXG59KVxuZXhwb3J0IGNsYXNzIFRlcm1pbmFsTW9kdWxlIHt9XG4iXX0=
import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';
import * as i0 from "@angular/core";
export class TerminalService {
    constructor() {
        this.commandSource = new Subject();
        this.responseSource = new Subject();
        this.commandHandler = this.commandSource.asObservable();
        this.responseHandler = this.responseSource.asObservable();
    }
    sendCommand(command) {
        if (command) {
            this.commandSource.next(command);
        }
    }
    sendResponse(response) {
        if (response) {
            this.responseSource.next(response);
        }
    }
}
TerminalService.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "14.0.7", ngImport: i0, type: TerminalService, deps: [], target: i0.ɵɵFactoryTarget.Injectable });
TerminalService.ɵprov = i0.ɵɵngDeclareInjectable({ minVersion: "12.0.0", version: "14.0.7", ngImport: i0, type: TerminalService });
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "14.0.7", ngImport: i0, type: TerminalService, decorators: [{
            type: Injectable
        }] });
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoidGVybWluYWxzZXJ2aWNlLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vc3JjL2FwcC9jb21wb25lbnRzL3Rlcm1pbmFsL3Rlcm1pbmFsc2VydmljZS50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQSxPQUFPLEVBQUUsVUFBVSxFQUFFLE1BQU0sZUFBZSxDQUFDO0FBQzNDLE9BQU8sRUFBRSxPQUFPLEVBQUUsTUFBTSxNQUFNLENBQUM7O0FBRy9CLE1BQU0sT0FBTyxlQUFlO0lBRDVCO1FBRVksa0JBQWEsR0FBRyxJQUFJLE9BQU8sRUFBVSxDQUFDO1FBQ3RDLG1CQUFjLEdBQUcsSUFBSSxPQUFPLEVBQVUsQ0FBQztRQUUvQyxtQkFBYyxHQUFHLElBQUksQ0FBQyxhQUFhLENBQUMsWUFBWSxFQUFFLENBQUM7UUFDbkQsb0JBQWUsR0FBRyxJQUFJLENBQUMsY0FBYyxDQUFDLFlBQVksRUFBRSxDQUFDO0tBYXhEO0lBWEcsV0FBVyxDQUFDLE9BQWU7UUFDdkIsSUFBSSxPQUFPLEVBQUU7WUFDVCxJQUFJLENBQUMsYUFBYSxDQUFDLElBQUksQ0FBQyxPQUFPLENBQUMsQ0FBQztTQUNwQztJQUNMLENBQUM7SUFFRCxZQUFZLENBQUMsUUFBZ0I7UUFDekIsSUFBSSxRQUFRLEVBQUU7WUFDVixJQUFJLENBQUMsY0FBYyxDQUFDLElBQUksQ0FBQyxRQUFRLENBQUMsQ0FBQztTQUN0QztJQUNMLENBQUM7OzRHQWpCUSxlQUFlO2dIQUFmLGVBQWU7MkZBQWYsZUFBZTtrQkFEM0IsVUFBVSIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7IEluamVjdGFibGUgfSBmcm9tICdAYW5ndWxhci9jb3JlJztcbmltcG9ydCB7IFN1YmplY3QgfSBmcm9tICdyeGpzJztcblxuQEluamVjdGFibGUoKVxuZXhwb3J0IGNsYXNzIFRlcm1pbmFsU2VydmljZSB7XG4gICAgcHJpdmF0ZSBjb21tYW5kU291cmNlID0gbmV3IFN1YmplY3Q8c3RyaW5nPigpO1xuICAgIHByaXZhdGUgcmVzcG9uc2VTb3VyY2UgPSBuZXcgU3ViamVjdDxzdHJpbmc+KCk7XG5cbiAgICBjb21tYW5kSGFuZGxlciA9IHRoaXMuY29tbWFuZFNvdXJjZS5hc09ic2VydmFibGUoKTtcbiAgICByZXNwb25zZUhhbmRsZXIgPSB0aGlzLnJlc3BvbnNlU291cmNlLmFzT2JzZXJ2YWJsZSgpO1xuXG4gICAgc2VuZENvbW1hbmQoY29tbWFuZDogc3RyaW5nKSB7XG4gICAgICAgIGlmIChjb21tYW5kKSB7XG4gICAgICAgICAgICB0aGlzLmNvbW1hbmRTb3VyY2UubmV4dChjb21tYW5kKTtcbiAgICAgICAgfVxuICAgIH1cblxuICAgIHNlbmRSZXNwb25zZShyZXNwb25zZTogc3RyaW5nKSB7XG4gICAgICAgIGlmIChyZXNwb25zZSkge1xuICAgICAgICAgICAgdGhpcy5yZXNwb25zZVNvdXJjZS5uZXh0KHJlc3BvbnNlKTtcbiAgICAgICAgfVxuICAgIH1cbn1cbiJdfQ==
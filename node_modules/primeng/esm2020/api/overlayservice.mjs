import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';
import * as i0 from "@angular/core";
export class OverlayService {
    constructor() {
        this.clickSource = new Subject();
        this.clickObservable = this.clickSource.asObservable();
    }
    add(event) {
        if (event) {
            this.clickSource.next(event);
        }
    }
}
OverlayService.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "14.0.7", ngImport: i0, type: OverlayService, deps: [], target: i0.ɵɵFactoryTarget.Injectable });
OverlayService.ɵprov = i0.ɵɵngDeclareInjectable({ minVersion: "12.0.0", version: "14.0.7", ngImport: i0, type: OverlayService, providedIn: 'root' });
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "14.0.7", ngImport: i0, type: OverlayService, decorators: [{
            type: Injectable,
            args: [{ providedIn: 'root' }]
        }] });
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoib3ZlcmxheXNlcnZpY2UuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi9zcmMvYXBwL2NvbXBvbmVudHMvYXBpL292ZXJsYXlzZXJ2aWNlLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBLE9BQU8sRUFBRSxVQUFVLEVBQUUsTUFBTSxlQUFlLENBQUM7QUFDM0MsT0FBTyxFQUFFLE9BQU8sRUFBRSxNQUFNLE1BQU0sQ0FBQzs7QUFJL0IsTUFBTSxPQUFPLGNBQWM7SUFEM0I7UUFFWSxnQkFBVyxHQUFHLElBQUksT0FBTyxFQUF1QixDQUFDO1FBRXpELG9CQUFlLEdBQUcsSUFBSSxDQUFDLFdBQVcsQ0FBQyxZQUFZLEVBQUUsQ0FBQztLQU9yRDtJQUxHLEdBQUcsQ0FBQyxLQUFLO1FBQ0wsSUFBSSxLQUFLLEVBQUU7WUFDUCxJQUFJLENBQUMsV0FBVyxDQUFDLElBQUksQ0FBQyxLQUFLLENBQUMsQ0FBQztTQUNoQztJQUNMLENBQUM7OzJHQVRRLGNBQWM7K0dBQWQsY0FBYyxjQURELE1BQU07MkZBQ25CLGNBQWM7a0JBRDFCLFVBQVU7bUJBQUMsRUFBRSxVQUFVLEVBQUUsTUFBTSxFQUFFIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHsgSW5qZWN0YWJsZSB9IGZyb20gJ0Bhbmd1bGFyL2NvcmUnO1xuaW1wb3J0IHsgU3ViamVjdCB9IGZyb20gJ3J4anMnO1xuaW1wb3J0IHsgTWVzc2FnZSB9IGZyb20gJy4vbWVzc2FnZSc7XG5cbkBJbmplY3RhYmxlKHsgcHJvdmlkZWRJbjogJ3Jvb3QnIH0pXG5leHBvcnQgY2xhc3MgT3ZlcmxheVNlcnZpY2Uge1xuICAgIHByaXZhdGUgY2xpY2tTb3VyY2UgPSBuZXcgU3ViamVjdDxNZXNzYWdlIHwgTWVzc2FnZVtdPigpO1xuXG4gICAgY2xpY2tPYnNlcnZhYmxlID0gdGhpcy5jbGlja1NvdXJjZS5hc09ic2VydmFibGUoKTtcblxuICAgIGFkZChldmVudCkge1xuICAgICAgICBpZiAoZXZlbnQpIHtcbiAgICAgICAgICAgIHRoaXMuY2xpY2tTb3VyY2UubmV4dChldmVudCk7XG4gICAgICAgIH1cbiAgICB9XG59XG4iXX0=
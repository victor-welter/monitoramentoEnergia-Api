import { Observable } from 'rxjs';
export declare class DynamicDialogRef {
    constructor();
    close(result?: any): void;
    destroy(): void;
    dragStart(event: MouseEvent): void;
    dragEnd(event: MouseEvent): void;
    resizeInit(event: MouseEvent): void;
    resizeEnd(event: MouseEvent): void;
    maximize(value: any): void;
    private readonly _onClose;
    onClose: Observable<any>;
    private readonly _onDestroy;
    onDestroy: Observable<any>;
    private readonly _onDragStart;
    onDragStart: Observable<any>;
    private readonly _onDragEnd;
    onDragEnd: Observable<any>;
    private readonly _onResizeInit;
    onResizeInit: Observable<any>;
    private readonly _onResizeEnd;
    onResizeEnd: Observable<any>;
    private readonly _onMaximize;
    onMaximize: Observable<any>;
}

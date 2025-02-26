import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

export interface SnackbarConfig {
    type: 'success' | 'warning' | 'danger' | 'info';
    title: string;
    message: string;
    duration?: number;
}

@Injectable({
    providedIn: 'root'
})
export class SnackbarService {
    private visibleSubject = new BehaviorSubject<boolean>(false);
    private configSubject = new BehaviorSubject<SnackbarConfig>({
        type: 'info',
        title: '',
        message: ''
    });

    visible$ = this.visibleSubject.asObservable();
    config$ = this.configSubject.asObservable();

    show(config: SnackbarConfig) {
        this.configSubject.next(config);
        this.visibleSubject.next(true);
    }

    showSuccess(title: string, message: string) {
        this.show({ type: 'success', title, message });
    }

    showWarning(title: string, message: string) {
        this.show({ type: 'warning', title, message });
    }

    showError(title: string, message: string) {
        this.show({ type: 'danger', title, message });
    }

    showInfo(title: string, message: string) {
        this.show({ type: 'info', title, message });
    }

    hideSnackbar(): void {
        this.visibleSubject.next(false);
    }
    
}
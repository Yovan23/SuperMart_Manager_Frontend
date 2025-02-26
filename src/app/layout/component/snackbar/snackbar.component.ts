import { Component, Input, Output, EventEmitter, OnInit, OnDestroy, OnChanges, SimpleChanges } from '@angular/core';
import { trigger, style, animate, transition } from '@angular/animations';
import { NgClass } from '@angular/common';
import { CommonModule } from '@angular/common';

export type SnackbarType = 'success' | 'warning' | 'danger' | 'info';

@Component({
    selector: 'app-snackbar',
    templateUrl: './snackbar.component.html',
    styleUrls: ['./snackbar.component.css'],
    animations: [
        trigger('slideInOut', [
            transition(':enter', [
                style({ transform: 'translateX(100%)', opacity: 0 }),
                animate('150ms ease-out', style({ transform: 'translateX(0)', opacity: 1 }))
            ]),
            transition(':leave', [
                animate('150ms ease-in', style({ transform: 'translateX(100%)', opacity: 0 }))
            ])
        ])
    ],
    imports: [NgClass, CommonModule],
    standalone: true,

})
export class SnackbarComponent implements OnInit, OnDestroy, OnChanges {
    @Input() visible: boolean = false;
    @Input() type: SnackbarType = 'info';
    @Input() title: string = '';
    @Input() message: string = '';
    @Input() duration: number = 3000;

    @Output() visibleChange = new EventEmitter<boolean>();

    private timeoutId?: number;

    ngOnInit() {
        if (this.visible) {
            this.startCloseTimer();
        }
    }

    ngOnChanges(changes: SimpleChanges) {
        if (changes['visible']?.currentValue) {
            this.startCloseTimer();
        }
    }

    ngOnDestroy() {
        this.clearCloseTimer();
    }

    close() {
        this.visible = false;
        this.visibleChange.emit(this.visible);
        this.clearCloseTimer();
    }

    private startCloseTimer() {
        this.clearCloseTimer();
        if (this.duration > 0) {
            this.timeoutId = window.setTimeout(() => {
                this.close();
            }, this.duration);
        }
    }

    private clearCloseTimer() {
        if (this.timeoutId) {
            clearTimeout(this.timeoutId);
            this.timeoutId = undefined;
        }
    }

    getBackgroundClass(): string {
        const classes = {
            'success': 'bg-green-100 border-l-4 border-green-500',
            'warning': 'bg-yellow-100 border-l-4 border-yellow-500',
            'danger': 'bg-red-100 border-l-4 border-red-500',
            'info': 'bg-blue-100 border-l-4 border-blue-500'
        };
        return classes[this.type];
    }

    getTextClass(): string {
        const classes = {
            'success': 'text-green-700',
            'warning': 'text-yellow-700',
            'danger': 'text-red-700',
            'info': 'text-blue-700'
        };
        return classes[this.type];
    }

    getIconClass(): string {
        const classes = {
            'success': 'text-green-500',
            'warning': 'text-yellow-500',
            'danger': 'text-red-500',
            'info': 'text-blue-500'
        };
        return classes[this.type];
    }

    getIcon(): string {
        const icons = {
            'success': 'pi pi-check-circle',
            'warning': 'pi pi-exclamation-triangle',
            'danger': 'pi pi-times-circle',
            'info': 'pi pi-info-circle'
        };
        return icons[this.type];
    }
}

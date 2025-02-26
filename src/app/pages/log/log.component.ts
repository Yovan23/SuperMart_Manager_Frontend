import { Component, OnInit, OnDestroy } from '@angular/core';
import { LogService } from '../../services/log.service';
import { SnackbarService, SnackbarConfig } from '../../services/snackbar.service';
import { Log } from '../../models/log.model';
import { Subscription } from 'rxjs';
import { TableModule } from 'primeng/table';
import { FormsModule, ReactiveFormsModule, FormGroup, FormBuilder, Validators } from '@angular/forms';
import { InputTextModule } from 'primeng/inputtext';
import { DatePickerModule } from 'primeng/datepicker';
import { ButtonModule } from 'primeng/button';
import { CommonModule } from '@angular/common';

@Component({
    selector: 'app-log',
    standalone: true,
    imports: [TableModule, CommonModule, InputTextModule, FormsModule, DatePickerModule, ReactiveFormsModule, ButtonModule],
    templateUrl: './log.component.html',
    styleUrls: ['./log.component.css']
})
export class LogComponent implements OnInit, OnDestroy {
    logs: Log[] = [];
    loading: boolean = true;
    fromDate: Date = new Date(new Date().setDate(new Date().getDate() - 1));
    toDate: Date = new Date();
    snackbarVisible: boolean = false;
    snackbarConfig: SnackbarConfig = {
        type: 'success',
        title: '',
        message: '',
        duration: 3000,
    };

    form: FormGroup;
    fromDateError: string = '';
    today: Date = new Date();

    private logSubscription: Subscription | null = null;

    constructor(
        private logService: LogService,
        private snackbarService: SnackbarService,
        private fb: FormBuilder
    ) {
        this.today.setHours(0, 0, 0, 0);
        this.form = this.fb.group({
            fromDate: [this.fromDate, Validators.required],
            toDate: [this.today, Validators.required] // Initialize toDate with today's date
        });
    }

    ngOnInit(): void {
        this.fetchLogs();
    }

    fetchLogs(): void {
        this.loading = true;
        if (this.logSubscription) this.logSubscription.unsubscribe();

        this.logSubscription = this.logService.getAllLogs().subscribe(
            (response) => {
                this.logs = response.data.reverse();
                this.loading = false;
            },
            (error) => {
                console.error("Error fetching logs:", error);
                this.loading = false;
            }
        );
    }

    fetchLogsByDateRange(): void {
        this.fromDateError = '';

        if (this.form.valid) {
            const fromDate: Date = this.form.get('fromDate')?.value;
            const toDate: Date = this.form.get('toDate')?.value;

            if (toDate < fromDate) {
                this.fromDateError = "To Date cannot be before From Date";
                return;
            }

            const formattedFromDate = this.formatDate(fromDate);
            const formattedToDate = this.formatDate(toDate);

            this.loading = true;

            if (this.logSubscription) this.logSubscription.unsubscribe();

            this.logSubscription = this.logService.getLogsByDateRange(formattedFromDate, formattedToDate).subscribe(
                (response) => {
                    this.logs = response.data.reverse();
                    this.loading = false;
                },
                (error) => {
                    console.error('Error fetching logs by date range:', error);
                    this.loading = false;
                }
            );
        } else {
            console.log("Form is invalid:", this.form.errors);
        }
    }

    formatDate(date: Date): string {
        const offset = date.getTimezoneOffset() * 60000;
        return new Date(date.getTime() - offset).toISOString().split('T')[0];
    }

    ngOnDestroy(): void {
        if (this.logSubscription) {
            this.logSubscription.unsubscribe();
        }
    }
}
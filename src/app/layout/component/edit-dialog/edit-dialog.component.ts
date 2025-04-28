import { Component, EventEmitter, Input, Output, OnInit, OnChanges, SimpleChanges } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { FormsModule, ReactiveFormsModule, FormGroup, FormBuilder, Validators, AbstractControl } from '@angular/forms';
import { DialogModule } from 'primeng/dialog';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { FileUploadModule } from 'primeng/fileupload';
import { SelectModule } from 'primeng/select';
import { DatePickerModule } from 'primeng/datepicker';
import { RippleModule } from 'primeng/ripple';
import { AutoCompleteModule } from 'primeng/autocomplete';

export interface Field {
    minDate?: Date|null|undefined;
    maxDate?: Date|null|undefined;
    suggestions?: { label: string; value: any; }[];
    suggestionServiceMethod?: string;
    name: string;
    label: string;
    type: 'text' | 'email' | 'password' | 'file' | 'select' | 'date' | 'tel' | 'number' | 'autocomplete';
    options?: { label: string; value: any }[];
    value?: any;
    required?: boolean;
    pattern?: string;
    selectedSuggestion?: any; 
}

@Component({
    selector: 'app-edit-dialog',
    templateUrl: './edit-dialog.component.html',
    styleUrls: ['./edit-dialog.component.css'],
    standalone: true,
    imports: [
        CommonModule,
        FormsModule,
        ReactiveFormsModule,
        DialogModule,
        ButtonModule,
        InputTextModule,
        FileUploadModule,
        DatePickerModule,
        SelectModule,
        RippleModule,
        InputTextModule,
        AutoCompleteModule,
    ],
    providers: [DatePipe]
})
export class EditDialogComponent implements OnInit, OnChanges {
  @Input() visible: boolean = false;
  @Input() dialogTitle: string = "Edit";
  @Input() fields: Field[] = [];
  @Input() formData: any;  
  @Output() visibleChange = new EventEmitter<boolean>();
  @Output() save = new EventEmitter<any>();

  selectedFile: { [key: string]: File } = {};
  previewUrls: { [key: string]: string } = {};
  fileError: string | null = null;
  dynamicForm: FormGroup = new FormGroup({});


  constructor(private datePipe: DatePipe,private fb: FormBuilder) { }

  ngOnInit(): void {
      this.initializeForm();
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['fields'] || changes['formData']) {
      this.initializeForm();
    }
  }

  initializeForm(): void {
      const formGroupConfig: any = {};

      this.fields.forEach(field => {
          const validators = [];

          if (field.required) {
              validators.push(Validators.required);
          }

          if (field.type === 'email') {
              validators.push(Validators.email);
          }

          if (field.pattern) {
              validators.push(Validators.pattern(field.pattern));
          }

          if (field.type === 'autocomplete') {
            field.suggestions = [];
            field.selectedSuggestion = null;
          }
          formGroupConfig[field.name] = [this.formData?.[field.name] || '', validators];
      });

      this.dynamicForm = this.fb.group(formGroupConfig);

      if (this.formData) {
        this.dynamicForm.patchValue(this.formData);
      }
  }

    dateNotFutureValidator() {
        return (control: any): { [key: string]: any } | null => {
            const selectedDate = new Date(control.value);
            const today = new Date();
            today.setHours(0, 0, 0, 0);

            if (selectedDate > today) {
                return { 'futureDate': true };
            }
            return null;
        };
    }

    formatDate(dateString: any): string {
      if (!dateString) return '';

      try {
          const date = new Date(dateString);
          return this.datePipe.transform(date, 'yyyy-MM-dd') as string;
      } catch (error) {
          console.error('Error formatting date:', error);
          return '';
      }
    }
  onFileSelected(event: any, fieldName: string): void {
      const file = event.target.files[0];
      if (file) {
          if (!file.type.startsWith('image/')) {
              this.fileError = 'Please upload an image file.';
              return;
          }

          this.fileError = null;
          this.selectedFile[fieldName] = file;
          // this.formData[fieldName] = file; //NO need with reactive forms
          this.dynamicForm.get(fieldName)?.setValue(file);

          const reader = new FileReader();
          reader.onload = () => {
              this.previewUrls[fieldName] = reader.result as string;
          };
          reader.readAsDataURL(file);
      }
  }

  closeDialog(): void {
    this.visible = false;
    this.visibleChange.emit(this.visible);
    this.dynamicForm.reset();
    Object.keys(this.dynamicForm.controls).forEach(key => {
      this.dynamicForm.get(key)?.clearValidators();
      this.dynamicForm.get(key)?.updateValueAndValidity();
    });

    this.initializeForm();
  }

  saveData(): void {
    if (this.dynamicForm.valid) {
      const updatedData = this.dynamicForm.value;
      const mergedData = { ...this.formData, ...updatedData };

      if(this.selectedFile){
          Object.keys(this.selectedFile).forEach(key => {
              mergedData[key] = this.selectedFile[key];
          });
      }

      this.save.emit(mergedData);
      this.closeDialog();
    } else {
      Object.keys(this.dynamicForm.controls).forEach(key => {
        this.dynamicForm.get(key)?.markAsTouched();
      });
    }
  }

  filterSuggestions(event: any, field: Field) {
      const query = event.query;
      console.log('Query:', query);
  
      if (!query) {
          field.suggestions = [];
      } else {
          const filtered = (field.options || []).filter(option =>
              option.label.toLowerCase().includes(query.toLowerCase())
          );
          field.suggestions = filtered;
      }
  }
  onSuggestionSelected(event: any, field: any) {
      const selectedValue = event.value.value; 
      this.dynamicForm.get(field.name)?.setValue(selectedValue);
      this.formData[field.name] = selectedValue; 
    }
  

  getFormControl(name: string): AbstractControl | null {
      return this.dynamicForm.get(name);
  }
}
import { Component, EventEmitter, Input, Output, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule, FormGroup, FormBuilder, Validators } from '@angular/forms';
import { DialogModule } from 'primeng/dialog';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { FileUploadModule } from 'primeng/fileupload';
import { SelectModule } from 'primeng/select';
import { DatePickerModule } from 'primeng/datepicker';
import { RippleModule } from 'primeng/ripple';

export interface Field {
    name: string;
    label: string;
    type: 'text' | 'email' | 'password' | 'file' | 'select' | 'date' | 'tel' | 'number';
    options?: { label: string; value: any }[];
    value?: any;
    required?: boolean;
    pattern?: string;
}

@Component({
    selector: 'app-add-dialog',
    templateUrl: './add-dialog.component.html',
    styleUrls: ['./add-dialog.component.css'],
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
    ]
})
export class AddDialogComponent implements OnInit {
  @Input() visible: boolean = false;
  @Input() dialogTitle: string = "Add New";
  @Input() fields: Field[] = [];
  @Input() useFormData: boolean = false;

  @Output() visibleChange = new EventEmitter<boolean>();
  @Output() save = new EventEmitter<any>();

  formData: any = {};
  selectedFile: { [key: string]: File } = {};
  previewUrls: { [key: string]: string } = {};
  fileError: string | null = null;
  dynamicForm: FormGroup = new FormGroup({});

  constructor(private fb: FormBuilder) { }

  ngOnInit(): void {
      this.initializeForm();
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

          if (field.type === 'date') {
            validators.push(this.dateNotFutureValidator());  
          }

          formGroupConfig[field.name] = [field.value || '', validators];
      });

      this.dynamicForm = this.fb.group(formGroupConfig);
      this.resetFormData();
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

  resetFormData(): void {
      this.formData = {};
      this.selectedFile = {};
      this.previewUrls = {};
      this.fileError = null;

      if (this.fields) {
          this.fields.forEach(field => {
              if (field.type === 'select' && field.options && field.options.length > 0) {
                  this.formData[field.name] = field.options[0].value;
                  this.dynamicForm.get(field.name)?.setValue(field.options[0].value);
              } else if (field.type === 'date') {
                  this.formData[field.name] = new Date();
                   this.dynamicForm.get(field.name)?.setValue(new Date());
              } else if (field.type === 'file') {
                  this.formData[field.name] = null;
                   this.dynamicForm.get(field.name)?.setValue(null);
              } else {
                  this.formData[field.name] = field.value;
                  this.dynamicForm.get(field.name)?.setValue(field.value);
              }
          });
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
          this.formData[fieldName] = file;
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
    this.resetFormData();

    this.dynamicForm.reset();
    Object.keys(this.dynamicForm.controls).forEach(key => {
      this.dynamicForm.get(key)?.clearValidators();
      this.dynamicForm.get(key)?.updateValueAndValidity();
    });

    this.initializeForm();
  }

  addData(): void {
    if (this.dynamicForm.valid) {
        if (this.useFormData) {
            const formDataToSend = new FormData();

            Object.keys(this.formData).forEach(key => {
                if (this.selectedFile[key]) {
                    formDataToSend.append(key, this.selectedFile[key]);
                } else {
                    formDataToSend.append(key, this.dynamicForm.get(key)?.value);
                }
            });

            this.save.emit(formDataToSend);
        } else {
            this.save.emit(this.dynamicForm.value);
        }

        this.closeDialog();
    } else {
        Object.keys(this.dynamicForm.controls).forEach(key => {
            this.dynamicForm.get(key)?.markAsTouched();
        });
    }
}

  getFormControl(name: string) {
      return this.dynamicForm.get(name);
  }
}

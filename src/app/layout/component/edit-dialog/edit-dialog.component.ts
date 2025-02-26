// import { Component, EventEmitter, Input, Output } from '@angular/core';
// import { CommonModule, DatePipe } from '@angular/common';
// import { FormsModule } from '@angular/forms';
// import { DialogModule } from 'primeng/dialog';
// import { ButtonModule } from 'primeng/button';
// import { InputTextModule } from 'primeng/inputtext';
// import { FileUploadModule } from 'primeng/fileupload';

// @Component({
//     selector: 'app-edit-dialog',
//     templateUrl: './edit-dialog.component.html',
//     styleUrls: ['./edit-dialog.component.css'],
//     imports: [CommonModule, FormsModule, DialogModule, ButtonModule, InputTextModule, FileUploadModule],
//     providers: [DatePipe]  
// })
// export class EditDialogComponent {
//     @Input() visible: boolean = false;
//     @Input() dialogTitle: string = "Edit Data";
//     @Input() formData: any = {};
//     @Input() fields: any[] = [];
//     @Input() useFormData: boolean = false;

//     @Output() visibleChange = new EventEmitter<boolean>();
//     @Output() save = new EventEmitter<any>();

//     selectedFile: { [key: string]: File } = {};
//     previewUrls: { [key: string]: string } = {};

//     constructor(private datePipe: DatePipe) {}

//     ngOnChanges(): void {
//         this.resetFormData();
//     }

//     resetFormData(): void {
//         if (!this.formData) {
//             this.formData = {}; 
//         }
       
//         if (this.fields) {
//             this.fields.forEach(field => {
//                 if (field.type === 'select' && field.options && field.options.length > 0) {
//                     if (field.name === 'categoryId' && this.formData[field.name]) {
//                         const selectedCategory = field.options.find((option: { value: any; }) => option.value === this.formData[field.name]._id);
//                         this.formData[field.name] = selectedCategory ? selectedCategory.value : null;
//                     } else {
//                         this.formData[field.name] = this.formData[field.name] ?? field.options[0].value;
//                     }
//                 } else if (field.type === 'date') {
//                     if (this.formData[field.name]) {
//                         this.formData[field.name] = this.formatDate(this.formData[field.name]);
//                     } else {
//                         const date = new Date();
//                         this.formData[field.name] = this.datePipe.transform(date, 'yyyy-MM-dd');
//                     }
//                 } else if (field.type === 'file' && field.name === 'userImg') {
//                     if (this.formData[field.name]) {
//                         const fileName = this.formData[field.name].split('/').pop();
//                         this.selectedFile[field.name] = new File([], fileName);
//                     } else {
//                         this.formData[field.name] = null;
//                     }
//                 }
//             });
//         }
//     }

//     formatDate(dateString: string): string {
//         const date = new Date(dateString);
//         return this.datePipe.transform(date, 'yyyy-MM-dd') as string;
//     }

//     onFileSelected(event: any, fieldName: string): void {
//         const file = event.target.files[0];
//         if (file) {
//             if (!file.type.startsWith('image/')) {
//                 alert('Please upload an image file');
//                 return;
//             }

//             this.selectedFile[fieldName] = file;
//             this.formData[fieldName] = file.name;

//             const reader = new FileReader();
//             reader.onload = () => {
//                 this.previewUrls[fieldName] = reader.result as string;
//             };
//             reader.readAsDataURL(file);
//         }
//     }

//     closeDialog(): void {
//         this.visible = false;
//         this.visibleChange.emit(this.visible);
//         this.resetFormData();
//     }
//     saveData(): void {
//         if (this.useFormData) {
//             const formDataToSend = new FormData();
    
//             Object.keys(this.formData).forEach(key => {
//                 if (key === 'profilePicture') {
//                     if (this.selectedFile['userImg']) {
//                         formDataToSend.append(key, this.selectedFile['userImg']);
//                     } else {
//                         formDataToSend.append(key, this.formData['profilePicture']); // Preserve existing URL
//                     }
//                 } else if (this.selectedFile[key]) {
//                     formDataToSend.append(key, this.selectedFile[key]);
//                 } else {
//                     formDataToSend.append(key, this.formData[key]);
//                 }
//             });
    
//             console.log("Final FormData:", formDataToSend);
//             this.save.emit(formDataToSend);
//         } else {
//             if (!this.selectedFile['userImg'] && this.formData['profilePicture']?.startsWith('http://localhost:8080/UserImage/')) {
//                 this.formData['profilePicture'] = this.formData['profilePicture'];
//             } else if (this.selectedFile['userImg']) {
//                 this.formData['profilePicture'] = this.selectedFile['userImg'].name;
//             }
    
//             this.save.emit(this.formData);
//         }
    
//         this.closeDialog();
//     }   
// }


// import { Component, EventEmitter, Input, Output, OnInit, OnChanges, SimpleChanges } from '@angular/core';
// import { CommonModule, DatePipe } from '@angular/common';
// import { FormsModule, ReactiveFormsModule, FormGroup, FormBuilder, Validators } from '@angular/forms';
// import { DialogModule } from 'primeng/dialog';
// import { ButtonModule } from 'primeng/button';
// import { InputTextModule } from 'primeng/inputtext';
// import { FileUploadModule } from 'primeng/fileupload';
// import { SelectModule } from 'primeng/select';
// import { DatePickerModule } from 'primeng/datepicker';
// import { RippleModule } from 'primeng/ripple';

// export interface Field {
//     name: string;
//     label: string;
//     type: 'text' | 'email' | 'password' | 'file' | 'select' | 'date' | 'tel' | 'number';
//     options?: { label: string; value: any }[];
//     value?: any;
//     required?: boolean;
//     pattern?: string;
// }

// @Component({
//     selector: 'app-edit-dialog',
//     templateUrl: './edit-dialog.component.html',
//     styleUrls: ['./edit-dialog.component.css'],
//     imports: [CommonModule, FormsModule, DialogModule, ButtonModule, InputTextModule, FileUploadModule, ReactiveFormsModule, DatePickerModule, RippleModule, SelectModule],
//     providers: [DatePipe]
// })
// export class EditDialogComponent implements OnInit, OnChanges {
//     @Input() visible: boolean = false;
//     @Input() dialogTitle: string = "Edit Data";
//     @Input() formData: any = {};
//     @Input() fields: Field[] = [];
//     @Input() useFormData: boolean = false;

//     @Output() visibleChange = new EventEmitter<boolean>();
//     @Output() save = new EventEmitter<any>();

//     selectedFile: { [key: string]: File } = {};
//     previewUrls: { [key: string]: string } = {};
//     fileError: string | null = null;
//     dynamicForm: FormGroup = new FormGroup({});

//     constructor(private datePipe: DatePipe, private fb: FormBuilder) { }

//     ngOnInit(): void {
//         this.initializeForm();
//     }

//     ngOnChanges(changes: SimpleChanges): void {
//         if (changes['fields'] || changes['formData']) {
//             this.initializeForm();
//         }
//     }

//     initializeForm(): void {
//         const formGroupConfig: any = {};

//         this.fields.forEach(field => {
//             const validators = [];

//             if (field.required) {
//                 validators.push(Validators.required);
//             }

//             if (field.type === 'email') {
//                 validators.push(Validators.email);
//             }

//             if (field.pattern) {
//                 validators.push(Validators.pattern(field.pattern));
//             }

//             if (field.type === 'date') {
//                 validators.push(this.dateNotFutureValidator());
//             }

//             let initialValue: any = this.formData[field.name] || field.value || '';

//             if (field.type === 'select' && field.options) {
//                 // Find the matching value object when editing
//                 const selectedOption = field.options.find(option => option.value === initialValue);
//                 initialValue = selectedOption ? selectedOption.value : null;
//             } else if (field.type === 'date' && initialValue) {
//                 initialValue = this.formatDate(initialValue);
//             } else if (field.type === 'file') {
//                  // Determine the correct initial value for file fields
//                  if (this.formData[field.name]) {
//                     // Assuming formData[field.name] contains the URL or path to the existing file
//                     // You might need to fetch the file if you want to display a preview or perform additional actions
//                     initialValue = this.formData[field.name];  // URL or path to the existing file
//                 } else {
//                     initialValue = null; // No existing file
//                 }
//             }

//             formGroupConfig[field.name] = [initialValue, validators];

//         });

//         this.dynamicForm = this.fb.group(formGroupConfig);
//         this.resetSelectedFilesAndPreviews();  // Initialize files and previews after form creation
//     }

//     resetSelectedFilesAndPreviews(): void {
//         this.selectedFile = {};
//         this.previewUrls = {};

//         this.fields.forEach(field => {
//             if (field.type === 'file' && this.formData[field.name]) {
//                 // If a file URL or path exists in formData, set it as the initial preview
//                 this.previewUrls[field.name] = this.formData[field.name];
//             }
//         });
//     }

//     dateNotFutureValidator() {
//         return (control: any): { [key: string]: any } | null => {
//             const selectedDate = new Date(control.value);
//             const today = new Date();
//             today.setHours(0, 0, 0, 0);

//             if (selectedDate > today) {
//                 return { 'futureDate': true };
//             }
//             return null;
//         };
//     }

//     formatDate(dateString: any): string {
//       if (!dateString) return '';

//       try {
//           const date = new Date(dateString);
//           return this.datePipe.transform(date, 'yyyy-MM-dd') as string;
//       } catch (error) {
//           console.error('Error formatting date:', error);
//           return ''; // Or handle the error appropriately
//       }
//     }

//     onFileSelected(event: any, fieldName: string): void {
//         const file = event.target.files[0];
//         if (file) {
//             if (!file.type.startsWith('image/')) {
//                 this.fileError = 'Please upload an image file.';
//                 return;
//             }

//             this.fileError = null;
//             this.selectedFile[fieldName] = file;
//             //  this.formData[fieldName] = file; //No need to set it here, keep it for formData submission only
//             this.dynamicForm.get(fieldName)?.setValue(file);  // Update the form control

//             const reader = new FileReader();
//             reader.onload = () => {
//                 this.previewUrls[fieldName] = reader.result as string;
//             };
//             reader.readAsDataURL(file);
//         }
//     }

//     closeDialog(): void {
//         this.visible = false;
//         this.visibleChange.emit(this.visible);
//         this.dynamicForm.reset();
//     }

//     updateData(): void {
//         if (this.dynamicForm.valid) {
//             if (this.useFormData) {
//                 const formDataToSend = new FormData();

//                 Object.keys(this.dynamicForm.value).forEach(key => {

//                     if (this.selectedFile[key]) {
//                         formDataToSend.append(key, this.selectedFile[key]);
//                     }
//                     else if (this.fields.find(field => field.name === key)?.type === 'file' && this.formData[key] && !this.selectedFile[key]) {
//                         // Append the existing URL or path if no new file is selected
//                         formDataToSend.append(key, this.formData[key]);
//                     }
//                     else {
//                         formDataToSend.append(key, this.dynamicForm.get(key)?.value);
//                     }

//                 });

//                 this.save.emit(formDataToSend);
//             } else {
//                 this.save.emit(this.dynamicForm.value);
//             }

//             this.closeDialog();
//         } else {
//             Object.keys(this.dynamicForm.controls).forEach(key => {
//                 this.dynamicForm.get(key)?.markAsTouched();
//             });
//         }
//     }

//     getFormControl(name: string) {
//         return this.dynamicForm.get(name);
//     }
// }








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

        if (field.type === 'date') {
            validators.push(this.dateNotFutureValidator());  // Add custom validator
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

  getFormControl(name: string): AbstractControl | null {
      return this.dynamicForm.get(name);
  }
}
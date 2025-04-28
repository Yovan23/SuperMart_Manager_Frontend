
import { NgModule } from '@angular/core';
import { HttpClientModule } from '@angular/common/http';
import { ReactiveFormsModule } from '@angular/forms'; 
import { CommonModule } from '@angular/common';

@NgModule({
  imports: [
    HttpClientModule,
    ReactiveFormsModule,
    CommonModule
  ]
})
export class AppModule { }
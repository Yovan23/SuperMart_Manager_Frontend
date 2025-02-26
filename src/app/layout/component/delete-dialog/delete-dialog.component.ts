import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DialogModule } from 'primeng/dialog';
import { ButtonModule } from 'primeng/button';

@Component({
  selector: 'app-delete-dialog',
  standalone: true,
  imports: [
    CommonModule, DialogModule, ButtonModule
  ],
  templateUrl: './delete-dialog.component.html',
  styleUrl: './delete-dialog.component.css'
})
export class DeleteDialogComponent {
  @Input() visible: boolean = false;
  @Input() dialogTitle: string = "Confirm Delete";
  @Input() message: string = "Are you sure you want to delete this item?";
  @Input() description: string = "This action cannot be undone.";

  @Output() visibleChange = new EventEmitter<boolean>();
  @Output() confirm = new EventEmitter<void>();

  closeDialog() {
      this.visible = false;
      this.visibleChange.emit(this.visible);
  }

  confirmDelete() {
      this.confirm.emit();
      this.closeDialog();
  }
}

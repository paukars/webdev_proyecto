import { Component, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

export interface ConfirmacionEventoModalData {
  title: string;
  message: string;
  confirmText?: string;
  cancelText?: string;
}

@Component({
  selector: 'app-confirmacion-evento-modal',
  templateUrl: './confirmacion-evento-modal.component.html',
  styleUrls: ['./confirmacion-evento-modal.component.scss']
})
export class ConfirmacionEventoModalComponent {

  constructor(
    private dialogRef: MatDialogRef<ConfirmacionEventoModalComponent>,
    @Inject(MAT_DIALOG_DATA) public data: ConfirmacionEventoModalData
  ) { }

  public cancelar(): void {
    this.dialogRef.close(false);
  }

  public confirmar(): void {
    this.dialogRef.close(true);
  }
}

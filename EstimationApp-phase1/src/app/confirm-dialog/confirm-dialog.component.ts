import { Component, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
  selector: 'app-confirm-dialog',
  templateUrl: './confirm-dialog.component.html',
  styleUrls: ['./confirm-dialog.component.scss']
  // template: `
  //   <h1 mat-dialog-title>{{ data.message }}</h1>
  //   <div mat-dialog-content>
  //     <p>Click "{{ data.buttonText.yes }}" to confirm, or "{{ data.buttonText.no }}" to cancel.</p>
  //   </div>
  //   <div mat-dialog-actions>
  //     <button mat-button (click)="onClick(true)">{{ data.buttonText.yes }}</button>
  //     <button mat-button (click)="onClick(false)">{{ data.buttonText.no }}</button>
  //   </div>
  // `,
})
export class ConfirmDialogComponent {
  constructor(
    public dialogRef: MatDialogRef<ConfirmDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {}

  onClick(result: boolean): void {
    this.dialogRef.close(result);
  }
}

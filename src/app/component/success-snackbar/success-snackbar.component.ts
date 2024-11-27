import { Component, Inject } from '@angular/core';
import { MAT_SNACK_BAR_DATA, MatSnackBarRef } from '@angular/material/snack-bar';
import { MatIconModule } from '@angular/material/icon';
import { CommonModule } from '@angular/common';

@Component({
	selector: 'app-success-snackbar',
	template: `
    <div class="snackbar-content">
      <span>{{ data }}</span>
      <button mat-icon-button (click)="onClose()">
        <mat-icon>close</mat-icon>
      </button>
    </div>
  `,
	styles: [`
    .snackbar-content {
      display: flex;
      justify-content: space-between;
      align-items: center;
      color: white;
    }
    mat-icon {
      color: white;
    }
    button {
      background: transparent;
      border: none;
      cursor: pointer;
    }
  `],
	standalone: true,
	imports: [
		MatIconModule, 
		CommonModule
	] 
})
export class SuccessSnackbarComponent {
	constructor(
		@Inject(MAT_SNACK_BAR_DATA) public data: any,
		private readonly snackBarRef: MatSnackBarRef<SuccessSnackbarComponent>
	) { }

	onClose() {
		this.snackBarRef.dismiss();
	}
}

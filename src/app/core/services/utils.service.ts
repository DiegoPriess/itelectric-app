import { Injectable } from '@angular/core';
import { HttpHeaders } from '@angular/common/http';
import { MatSnackBar } from '@angular/material/snack-bar';

import { SuccessSnackbarComponent } from '../../component/success-snackbar/success-snackbar.component';

@Injectable({
	providedIn: 'root',
})
export class UtilsService {
    constructor(private snackbar: MatSnackBar) { }

	getHeader() {
        const token = sessionStorage.getItem('token');
        let headers = new HttpHeaders();
        if (token) {
            return headers = headers.set('Authorization', `Bearer ${token}`);
        }
        return headers
    }

    showSuccessMessage(message: String) {
        this.snackbar.openFromComponent(SuccessSnackbarComponent, {
            data: message,
            duration: 5000,
            panelClass: ['success-snackbar']
        });
    }
}

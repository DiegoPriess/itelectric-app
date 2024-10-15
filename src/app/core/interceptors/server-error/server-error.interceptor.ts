import { HttpErrorResponse, HttpInterceptorFn } from "@angular/common/http";
import { inject } from "@angular/core";
import { MatSnackBar } from "@angular/material/snack-bar";
import { catchError, tap, throwError } from "rxjs";
import { ErrorSnackbarComponent } from '../../../component/error-snackbar/error-snackbar.component';

export const serverErrorInterceptor: HttpInterceptorFn = (req, next) => {
  const snackbar = inject(MatSnackBar);

  return next(req).pipe(
    tap(() => {}),
    catchError((error: HttpErrorResponse) => {
      const errorMessage = error.error?.message || "Erro desconhecido";
      snackbar.openFromComponent(ErrorSnackbarComponent, {
        data: errorMessage,
        duration: 5000,
        panelClass: ['error-snackbar']
      });

      return throwError(() => error);
    })
  );
};

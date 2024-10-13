import { Injectable } from '@angular/core';
import {
    HttpInterceptor, HttpRequest, HttpHandler, HttpEvent, HttpErrorResponse
} from '@angular/common/http';
import { Observable, throwError, EMPTY } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { Router } from '@angular/router';

@Injectable()
export class AuthInterceptor implements HttpInterceptor {
    constructor(private router: Router) {}

    intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
        const token = sessionStorage.getItem("token");

        if (token) {
            const urlWithToken = appendTokenToUrl(request.url, token);
            request = request.clone({ url: urlWithToken });
        }

        return next.handle(request).pipe(
            catchError((error: HttpErrorResponse) => {
                if (error.status === 401) {
                    this.router.navigate(['/login']);
                    return EMPTY;
                }

                return throwError(() => error);
            })
        );
    }
}

function appendTokenToUrl(url: string, token: string): string {
    const urlObj = new URL(url);
    urlObj.searchParams.append('auth', token);
    return urlObj.toString();
}


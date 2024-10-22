import { Injectable } from '@angular/core';
import { HttpHeaders } from '@angular/common/http';

@Injectable({
	providedIn: 'root',
})
export class UtilsService {
    constructor() { }

	getHeader() {
        const token = sessionStorage.getItem('token');
        let headers = new HttpHeaders();
        if (token) {
            return headers = headers.set('Authorization', `Bearer ${token}`);
        }
        return headers
    }
}

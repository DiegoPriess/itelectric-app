import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

import { BASE_URL } from '../../config/utils';
import { ILogin } from '../interfaces/User/login';

@Injectable({
	providedIn: 'root',
})
export class UserService {
	constructor(private http: HttpClient) { }

	login(email: string, password: string): Observable<ILogin> {
		return this.http.post<ILogin>(`${BASE_URL}/user/login`, { email, password });
	}

	register(name: string, email: string, password: string): Observable<any> {
		return this.http.post(`${BASE_URL}/user/create`, {
			name,
			email,
			password,
			role: "ROLE_OWNER"
		});
	}
}

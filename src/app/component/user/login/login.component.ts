import { Component, OnInit, inject } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { Router, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { UserService } from '../../../core/services/user.service';
import { ILogin } from '../../../core/interfaces/User/login';

@Component({
	selector: 'app-login',
	templateUrl: './login.component.html',
	styleUrls: ['./login.component.scss'],
	standalone: true,
	imports: [
		CommonModule,
		ReactiveFormsModule,
		MatFormFieldModule,
		MatInputModule,
		MatButtonModule,
		RouterModule
	]
})
export class LoginComponent implements OnInit {
	constructor(private fb: FormBuilder,
				private userService: UserService,
				private router: Router) { }

	form!: FormGroup

	ngOnInit(): void {
		this.form = this.fb.group({
			email: [null, [Validators.required, Validators.email]],
			password: [null, Validators.required]
		});
	}

	login() {
		this.userService
			.login(this.form.get('email')?.value, this.form.get('password')?.value)
			.subscribe((response: ILogin) => {
				sessionStorage.setItem("token", response.token);
				sessionStorage.setItem("role", response.role);
      			this.router.navigateByUrl("/menu");
			});
	}
}

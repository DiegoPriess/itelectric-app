import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { ActivatedRoute, Router } from '@angular/router';
import { MatCardModule } from '@angular/material/card';

import { IWork } from '../../../core/models/Work';
import { WorkService } from '../../../core/services/work.service';
import { IMaterial } from '../../../core/models/Material';

@Component({
	selector: 'app-work-view',
	standalone: true,
	imports: [
		CommonModule,
		ReactiveFormsModule,
		MatFormFieldModule,
		MatInputModule,
		MatIconModule,
		MatCardModule
	],
	templateUrl: './work-view.component.html',
	styleUrl: './work-view.component.scss'
})
export class WorkViewComponent {
	form!: FormGroup;
	workId!: number;
	selectedMaterialIds: number[] = [];
	selectedMaterials: IMaterial[] = [];

	constructor(private fb: FormBuilder,
		private workService: WorkService,
		private router: Router,
		private route: ActivatedRoute) {
		this.form = this.fb.group({
			id: [''],
			name: ['', Validators.required],
			price: ['', [Validators.required, Validators.pattern('^[0-9]+(.[0-9]{0,2})?$')]]
		});
	}

	ngOnInit() {
		this.workId = this.getIdFromUrl()
		this.loadWorkData()
	}

	loadWorkData() {
		this.workService.get(this.workId).subscribe({
			next: (work: IWork) => {
				this.form.patchValue({
					id: work.id,
					name: work.name,
					price: work.price,
				});
				this.onSelectedMaterialsChange(work.materialList)
			}
		});
	}

	back(): void {
		this.router.navigateByUrl("/menu/trabalhos");
	}

	onSelectedMaterialsChange(materials: IMaterial[]) {
		this.selectedMaterialIds = materials.map(material => material.id);
		this.selectedMaterials = materials
	}

	getIdFromUrl(): number {
		const id = this.route.snapshot.paramMap.get('id');
		return id ? +id : 0;
	}
}

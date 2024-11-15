import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { ActivatedRoute, Router } from '@angular/router';

import { UtilsService } from '../../../core/utils/utils.service';
import { IWork } from '../../../core/models/Work';
import { WorkService } from '../../../core/services/work.service';
import { MaterialCardListComponent } from '../../material/material-card-list/material-card-list.component';
import { IMaterial } from '../../../core/models/Material';
import { MatCardModule } from '@angular/material/card';

@Component({
	selector: 'app-work-edit',
	standalone: true,
	imports: [
		CommonModule,
		ReactiveFormsModule,
		MatFormFieldModule,
		MatInputModule,
		MatButtonModule,
		MatSelectModule,
		MatIconModule,
		MaterialCardListComponent,
		MatCardModule
	],
	templateUrl: './work-edit.component.html',
	styleUrl: './work-edit.component.scss'
})
export class WorkEditComponent {
	form!: FormGroup;
	workId!: number;
	selectedMaterialIds: number[] = [];
	selectedMaterials: IMaterial[] = [];

	constructor(private fb: FormBuilder,
		private workService: WorkService,
		private utilsService: UtilsService,
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

	onSubmit() {
		this.workService.edit(this.form.value, this.selectedMaterialIds).subscribe({
			next: () => {
				this.router.navigateByUrl("/menu/trabalhos");
				this.utilsService.showSuccessMessage("Trabalho alterado com sucesso!")
			}
		});
	}
}

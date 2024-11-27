import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { Router } from '@angular/router';
import { MatCardModule } from '@angular/material/card';

import { UtilsService } from '../../../core/utils/utils.service';
import { WorkService } from '../../../core/services/work.service';
import { MaterialCardListComponent } from "../../material/material-card-list/material-card-list.component";
import { IMaterial } from '../../../core/models/Material';

@Component({
  selector: 'app-work-create',
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
  templateUrl: './work-create.component.html',
  styleUrl: './work-create.component.scss'
})
export class WorkCreateComponent {
  form!: FormGroup;
  selectedMaterialIds: number[] = [];
  selectedMaterials: IMaterial[] = [];

  constructor(
    private readonly fb: FormBuilder,
    private readonly workService: WorkService,
    private readonly utilsService: UtilsService,
    private readonly router: Router
  ) {
    this.form = this.fb.group({
      name: ['', Validators.required],
      price: ['', [Validators.required, Validators.pattern('^[0-9]+(.[0-9]{0,2})?$')]]
    });
  }

  onSelectedMaterialsChange(materials: IMaterial[]) {
    this.selectedMaterialIds = materials.map(material => material.id);
    this.selectedMaterials = materials
  }

  onSubmit() {
    const workData = {
      ...this.form.value,
      materialIdList: this.selectedMaterialIds
    };

    this.workService.add(workData).subscribe({
      next: () => {
        this.router.navigateByUrl("/menu/trabalhos");
        this.utilsService.showSuccessMessage("Trabalho adicionado com sucesso!");
      }
    });
  }

  back(): void {
    this.router.navigateByUrl("/menu/trabalhos");
  }
}

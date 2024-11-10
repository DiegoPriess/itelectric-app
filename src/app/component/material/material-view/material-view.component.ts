import { Component } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { ActivatedRoute, Router } from '@angular/router';

import { IEnum } from '../../../core/interfaces/Enum';
import { IMaterial } from '../../../core/models/Material';
import { EnumService } from '../../../core/services/enum.service';
import { MaterialService } from '../../../core/services/material.service';

@Component({
  selector: 'app-material-view',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatSelectModule,
    MatIconModule
  ],
  templateUrl: './material-view.component.html',
  styleUrl: './material-view.component.scss'
})
export class MaterialViewComponent {
  form!: FormGroup;
  unitOfMeasureList: IEnum[] = [];
  materialId!: number;

  constructor(private fb: FormBuilder,
    private enumService: EnumService,
    private materialService: MaterialService,
    private router: Router,
    private route: ActivatedRoute) {
    this.form = this.fb.group({
      name: [''],
      price: [''],
      quantityUnitMeasure: [''],
      unitMeasure: ['']
    });
  }

  ngOnInit() {
    this.materialId = this.getIdFromUrl()

    this.enumService.listUnitOfMeasure().subscribe((unitOfMeasureList: IEnum[]) => {
      this.unitOfMeasureList = unitOfMeasureList;
    });

    this.materialService.get(this.materialId).subscribe({
      next: (material: IMaterial) => {
        this.form.patchValue({
          name: material.name,
          price: material.price,
          quantityUnitMeasure: material.quantityUnitMeasure,
          unitMeasure: material.unitMeasure.label
        });
      }
    });
  }

  getIdFromUrl(): number {
    const id = this.route.snapshot.paramMap.get('id');
    return id ? +id : 0;
  }

  back(): void {
    this.router.navigateByUrl("/menu/materiais");
  }
}

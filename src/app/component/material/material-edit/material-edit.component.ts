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
import { EnumService } from '../../../core/services/enum.service';
import { MaterialService } from '../../../core/services/material.service';
import { IMaterial } from '../../../core/models/Material';
import { UtilsService } from '../../../core/utils/utils.service';

@Component({
  selector: 'app-material-edit',
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
  templateUrl: './material-edit.component.html',
  styleUrl: './material-edit.component.scss'
})
export class MaterialEditComponent {
  form!: FormGroup;
  unitOfMeasureList: IEnum[] = [];
  materialId!: number;

  constructor(private fb: FormBuilder,
    private enumService: EnumService,
    private materialService: MaterialService,
    private utilsService: UtilsService,
    private router: Router,
    private route: ActivatedRoute) {
    this.form = this.fb.group({
      id: [''],
      name: ['', Validators.required],
      price: ['', [Validators.required, Validators.pattern('^[0-9]+(.[0-9]{0,2})?$')]],
      quantityUnitMeasure: ['', Validators.required],
      unitMeasure: ['', Validators.required]
    });
  }

  ngOnInit() {
    this.materialId = this.getIdFromUrl()

    this.enumService.listUnitOfMeasure().subscribe((unitOfMeasureList: IEnum[]) => {
      this.unitOfMeasureList = unitOfMeasureList;
      this.loadMaterialData();
    });
  }

  loadMaterialData() {
    this.materialService.get(this.materialId).subscribe({
      next: (material: IMaterial) => {
        this.form.patchValue({
          id: material.id,
          name: material.name,
          price: material.price,
          quantityUnitMeasure: material.quantityUnitMeasure,
          unitMeasure: this.unitOfMeasureList.find(u => u.name === material.unitMeasure.name)
        });
      }
    });
  }

  compareUnits(u1: any, u2: any): boolean {
    return u1 && u2 ? u1.name === u2.name : u1 === u2;
  }

  getIdFromUrl(): number {
    const id = this.route.snapshot.paramMap.get('id');
    return id ? +id : 0;
  }

  back(): void {
    this.router.navigateByUrl("/menu/materiais");
  }

  onSubmit() {
    this.materialService.edit(this.form.value).subscribe({
      next: () => {
        this.router.navigateByUrl("/menu/materiais");
        this.utilsService.showSuccessMessage("Material alterado com sucesso!")
      }
    });
  }
}

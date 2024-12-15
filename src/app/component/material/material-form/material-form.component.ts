import { Component, Input, OnInit, Output, EventEmitter } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatButtonModule } from '@angular/material/button';
import { CommonModule } from '@angular/common';
import { IEnum } from '../../../core/interfaces/Enum';
import { IMaterial } from '../../../core/models/Material';
import { EnumService } from '../../../core/services/enum.service';

@Component({
  selector: 'app-material-form',
  standalone: true,
  templateUrl: './material-form.component.html',
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatButtonModule
  ],
})
export class MaterialFormComponent implements OnInit {
  @Input() mode: 'create' | 'edit' | 'view' = 'create';
  @Input() materialData?: IMaterial;
  @Output() formSubmit = new EventEmitter<IMaterial>();
  form!: FormGroup;
  unitOfMeasureList: IEnum[] = [];

  constructor(private fb: FormBuilder, private enumService: EnumService) { }

  ngOnInit(): void {
    this.initializeForm();
    this.loadUnitOfMeasures();

    if (this.materialData) {
      this.populateForm(this.materialData);
    }

    if (this.mode === 'view') {
      this.form.disable();
    }
  }

  initializeForm(): void {
    this.form = this.fb.group({
      name: ['', Validators.required],
      price: ['', [Validators.required, Validators.pattern('^[0-9]+(\\.[0-9]{0,2})?$')]],
      quantityUnitMeasure: ['', Validators.required],
      unitMeasure: ['', Validators.required],
    });
  }  

  loadUnitOfMeasures(): void {
    this.enumService.listUnitOfMeasure().subscribe((unitOfMeasureList: IEnum[]) => {
      this.unitOfMeasureList = unitOfMeasureList;
    });
  }

  populateForm(material: IMaterial): void {
    this.form.patchValue({
      name: material.name,
      price: material.price,
      quantityUnitMeasure: material.quantityUnitMeasure,
      unitMeasure: material.unitMeasure?.name || material.unitMeasure,
    });
  }

  onSubmit(): void {
    if (this.form.valid) {
      this.formSubmit.emit(this.form.value);
    }
  }
}

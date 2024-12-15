import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { CommonModule } from '@angular/common';
import { MaterialSelectListComponent } from '../../material/material-select-list/material-select-list.component';
import { IBulkMaterialRequest } from '../../../core/interfaces/work/BulkMaterialRequest';
import { IWork } from '../../../core/models/Work';

@Component({
  selector: 'app-work-form',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MaterialSelectListComponent,
  ],
  templateUrl: './work-form.component.html',
})
export class WorkFormComponent implements OnInit {
  @Input() mode: 'create' | 'edit' | 'view' = 'create';
  @Input() workData?: IWork;
  @Output() formSubmit = new EventEmitter<any>();

  form!: FormGroup;
  selectedMaterials: IBulkMaterialRequest[] = [];

  constructor(private fb: FormBuilder) {}

  ngOnInit(): void {
    this.initializeForm();
    if (this.workData) {
      this.populateForm(this.workData);
    }
    if (this.mode === 'view') {
      this.form.disable();
    }
  }

  initializeForm(): void {
    this.form = this.fb.group({
      name: ['', Validators.required],
      laborPrice: ['', [Validators.required, Validators.pattern('^[0-9]+(\\.[0-9]{0,2})?$')]],
    });
  }

  populateForm(work: IWork): void {
    this.form.patchValue({
      name: work.name,
      laborPrice: work.laborPrice,
    });
  
    this.selectedMaterials = work.materialList.map((mat) => ({
      id: mat.id,
      bulkQuantity: mat.quantityUnitMeasure || 0,
    }));
  }
  

  onMaterialsChange(materials: IBulkMaterialRequest[]): void {
    this.selectedMaterials = materials;
  }

  onSubmit(): void {
    const workRequest = {
      ...this.form.value,
      materialList: this.selectedMaterials,
    };
    this.formSubmit.emit(workRequest);
  }

  get selectedMaterialIds(): number[] {
    return this.selectedMaterials.map((mat) => mat.id);
  }
}

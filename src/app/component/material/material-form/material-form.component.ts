import { Component, Input, OnInit, EventEmitter, Output } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { BsModalRef } from 'ngx-bootstrap/modal';
import { MaterialService } from '../../../core/services/material.service';
import { EnumService } from '../../../core/services/enum.service';
import { UtilsService } from '../../../core/utils/utils.service';
import { IEnum } from '../../../core/interfaces/Enum';
import { IMaterial } from '../../../core/models/Material';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-material-form',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatIconModule,
  ],
  templateUrl: './material-form.component.html',
  styleUrls: ['./material-form.component.scss'],
})
export class MaterialFormComponent implements OnInit {
  @Input() mode: 'create' | 'edit' | 'view' = 'create';
  @Input() materialData?: IMaterial;
  @Output() closeAction = new EventEmitter<void>();

  form!: FormGroup;
  unitOfMeasureList: IEnum[] = [];

  constructor(
    private readonly fb: FormBuilder,
    private readonly materialService: MaterialService,
    private readonly enumService: EnumService,
    private readonly utilsService: UtilsService,
    private readonly bsModalRef: BsModalRef
  ) {}

  ngOnInit(): void {
    this.initializeForm();
    this.loadUnitOfMeasures();

    if (this.mode !== 'create' && this.materialData) {
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
      unitMeasure: material.unitMeasure,
    });
  }

  onSubmit(): void {
    if (this.mode === 'view') return;

    const materialRequest = this.form.value;

    if (this.mode === 'create') {
      this.materialService.add(materialRequest).subscribe({
        next: () => {
          this.utilsService.showSuccessMessage('Material criado com sucesso!');
          this.closeModal();
        },
      });
    }

    if (this.mode === 'edit' && this.materialData) {
      this.materialService.edit({ ...materialRequest, id: this.materialData.id }).subscribe({
        next: () => {
          this.utilsService.showSuccessMessage('Material atualizado com sucesso!');
          this.closeModal();
        },
      });
    }
  }

  closeModal(): void {
    this.bsModalRef.hide();
    this.closeAction.emit();
  }
}

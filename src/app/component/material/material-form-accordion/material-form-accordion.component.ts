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
import { MatAccordion, MatExpansionModule, MatExpansionPanel } from '@angular/material/expansion';
import { MatListModule } from '@angular/material/list';

@Component({
  selector: 'app-material-form-accordion',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatIconModule,
    MatAccordion,
    MatExpansionModule,
    MatListModule
  ],
  templateUrl: './material-form-accordion.component.html',
  styleUrls: ['./material-form-accordion.component.scss'],
})
export class MaterialFormAccordionComponent implements OnInit {
  @Input() mode: 'create' | 'edit' | 'view' = 'create';
  @Input() materialData?: IMaterial;
  @Output() closeAction = new EventEmitter<void>();
  @Output() materialSaved = new EventEmitter<IMaterial>();

  form!: FormGroup;
  unitOfMeasureList: IEnum[] = [];

  constructor(
    private readonly fb: FormBuilder,
    private readonly materialService: MaterialService,
    private readonly enumService: EnumService,
    private readonly utilsService: UtilsService
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

  onSubmit(panel: MatExpansionPanel): void {
    if (this.mode === 'view' || this.mode === 'edit') return;
  
    const materialRequest = this.form.value;
  
    if (this.mode === 'create') {
      this.materialService.add(materialRequest).subscribe({
        next: (newMaterial: IMaterial) => {
          this.utilsService.showSuccessMessage('Material criado com sucesso!');
          this.form.reset();
          panel.close();
          this.materialSaved.emit(newMaterial);
        },
      });
    }
  }
}

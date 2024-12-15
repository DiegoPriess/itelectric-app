import { Component, Input, EventEmitter, Output, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatIconModule } from '@angular/material/icon';
import { BsModalRef } from 'ngx-bootstrap/modal';
import { WorkService } from '../../../core/services/work.service';
import { UtilsService } from '../../../core/utils/utils.service';
import { IWorkRequest } from '../../../core/interfaces/work/WorkRequest';
import { IWork } from '../../../core/models/Work';
import { MaterialSelectListComponent } from "../../material/material-select-list/material-select-list.component";
import { MatFormFieldModule } from '@angular/material/form-field';
import { CommonModule } from '@angular/common';
import { MatInputModule } from '@angular/material/input';
import { IBulkMaterialRequest } from '../../../core/interfaces/work/BulkMaterialRequest';

@Component({
  selector: 'app-work-form-modal',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatInputModule,
    MatIconModule,
    MatFormFieldModule,
    MaterialSelectListComponent,
  ],
  templateUrl: './work-form-modal.component.html',
})
export class WorkFormModalComponent implements OnInit {
  @Input() mode: 'create' | 'edit' | 'view' = 'create';
  @Input() workData?: IWork;
  @Output() closeAction = new EventEmitter<void>();
  form!: FormGroup;
  selectedMaterials: IBulkMaterialRequest[] = [];

  constructor(
    private readonly fb: FormBuilder,
    private readonly workService: WorkService,
    private readonly utilsService: UtilsService,
    private readonly bsModalRef: BsModalRef
  ) {}

  ngOnInit(): void {
    this.initializeForm();

    if (this.mode !== 'create' && this.workData) {
      this.populateForm(this.workData);
    }

    if (this.mode === 'view') {
      this.form.disable();
    }
  }

  initializeForm(): void {
    this.form = this.fb.group({
      name: ['', Validators.required],
      laborPrice: ['', [Validators.required, Validators.pattern('^[0-9]+(.[0-9]{0,2})?$')]],
    });
  }

  populateForm(work: IWork): void {
    this.form.patchValue({
      name: work.name,
      laborPrice: work.laborPrice,
    });

    this.selectedMaterials = work.materialList.map((mat) => ({
      id: mat.id,
      bulkQuantity: mat.quantityUnitMeasure,
    }));
  }

  onSelectedMaterialsChange(materials: IBulkMaterialRequest[]): void {
    this.selectedMaterials = materials;
  }

  onSubmit(): void {
    if (this.mode === 'view') return;

    const workRequest: IWorkRequest = {
      name: this.form.value.name,
      laborPrice: this.form.value.laborPrice,
      materialList: this.selectedMaterials,
    };

    if (this.mode === 'create') {
      this.workService.add(workRequest).subscribe({
        next: () => {
          this.utilsService.showSuccessMessage('Trabalho criado com sucesso!');
          this.closeModal();
        },
      });
    }

    if (this.mode === 'edit' && this.workData) {
      this.workService.edit({ ...workRequest, id: this.workData.id }).subscribe({
        next: () => {
          this.utilsService.showSuccessMessage('Trabalho atualizado com sucesso!');
          this.closeModal();
        },
      });
    }
  }

  closeModal(): void {
    this.bsModalRef.hide();
  }

  get selectedMaterialIds(): number[] {
    return this.selectedMaterials.map(mat => mat.id);
  }
}

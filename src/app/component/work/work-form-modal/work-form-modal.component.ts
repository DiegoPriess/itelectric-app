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
export class WorkFormComponent implements OnInit {
  @Input() mode: 'create' | 'edit' | 'view' = 'create';
  @Input() workData?: IWork;
  @Output() closeAction = new EventEmitter<void>();
  form!: FormGroup;
  selectedMaterialIds: number[] = [];

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
    this.selectedMaterialIds = work.materialList?.map((mat) => mat.id) || [];
  }

  onSelectedMaterialsChange(materialIds: number[]): void {
    this.selectedMaterialIds = materialIds;
  }

  onSubmit(): void {
    if (this.mode === 'view') return;

    const workRequest: IWorkRequest = {
      name: this.form.value.name,
      laborPrice: this.form.value.laborPrice,
      materialIdList: this.selectedMaterialIds,
    };

    if (this.mode === 'create') {
      this.workService.add(workRequest).subscribe({
        next: () => {
          this.utilsService.showSuccessMessage('Trabalho criado com sucesso!');
          this.closeModal();
        }
      });
    }
  
    if (this.mode === 'edit' && this.workData) {
      this.workService.edit({ ...workRequest, id: this.workData.id }).subscribe({
        next: () => {
          this.utilsService.showSuccessMessage('Trabalho atualizado com sucesso!');
          this.closeModal();
        }
      });
    }
  }  

  closeModal(): void {
    this.bsModalRef.hide();
  }
}

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
import { MatSelectModule } from '@angular/material/select';
import { MatAccordion, MatExpansionModule, MatExpansionPanel } from '@angular/material/expansion';
import { MatListModule } from '@angular/material/list';

@Component({
  selector: 'app-work-form-accordion',
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
    MatListModule,
    MaterialSelectListComponent
  ],
  templateUrl: './work-form-accordion.component.html',
})
export class WorkFormComponent implements OnInit {
  @Input() mode: 'create' | 'edit' | 'view' = 'create';
  @Input() workData?: IWork;
  @Output() closeAction = new EventEmitter<void>();
  @Output() workSaved = new EventEmitter<IWork>();

  form!: FormGroup;
  selectedMaterialIds: number[] = [];

  constructor(
    private readonly fb: FormBuilder,
    private readonly workService: WorkService,
    private readonly utilsService: UtilsService
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
      laborPrice: work.laborPrice
    });
  }

  onSelectedMaterialsChange(materialIds: number[]): void {
    this.selectedMaterialIds = materialIds;
  }

  onSubmit(panel: MatExpansionPanel): void {
    if (this.mode === 'view' || this.mode === 'edit') return;
  
    const workRequest: IWorkRequest = {
      name: this.form.value.name,
      laborPrice: this.form.value.laborPrice,
      materialIdList: this.selectedMaterialIds,
    };
  
    if (this.mode === 'create') {
      this.workService.add(workRequest).subscribe({
        next: (newWork: IWork) => {
          this.utilsService.showSuccessMessage('Trabalho criado com sucesso!');
          this.form.reset();
          panel.close();
          this.workSaved.emit(newWork);
        },
      });
    }
  }
}

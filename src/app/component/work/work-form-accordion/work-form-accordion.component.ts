import { Component, Input, EventEmitter, Output, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatIconModule } from '@angular/material/icon';
import { WorkService } from '../../../core/services/work.service';
import { UtilsService } from '../../../core/utils/utils.service';
import { IWorkRequest } from '../../../core/interfaces/work/WorkRequest';
import { IWork } from '../../../core/models/Work';
import { MaterialSelectListComponent } from "../../material/material-select-list/material-select-list.component";
import { MatFormFieldModule } from '@angular/material/form-field';
import { CommonModule } from '@angular/common';
import { MatInputModule } from '@angular/material/input';
import { MatExpansionModule, MatExpansionPanel } from '@angular/material/expansion';
import { MatListModule } from '@angular/material/list';

interface SelectedMaterial {
  id: number;
  bulkQuantity: number;
}

@Component({
  selector: 'app-work-form-accordion',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatExpansionModule,
    MatIconModule,
    MatListModule,
    MaterialSelectListComponent,
  ],
  templateUrl: './work-form-accordion.component.html',
})
export class WorkFormAccordionComponent implements OnInit {
  @Input() mode: 'create' | 'edit' | 'view' = 'create';
  @Input() workData?: IWork;
  @Output() closeAction = new EventEmitter<void>();
  @Output() workSaved = new EventEmitter<IWork>();

  form!: FormGroup;
  selectedMaterials: SelectedMaterial[] = [];

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
      laborPrice: ['', [Validators.required, Validators.pattern('^[0-9]+(\\.[0-9]{0,2})?$')]],
    });
  }

  populateForm(work: IWork): void {
    this.form.patchValue({
      name: work.name,
      laborPrice: work.laborPrice,
    });

    this.selectedMaterials = work.materialList?.map((mat) => ({
      id: mat.id,
      bulkQuantity: mat.quantityUnitMeasure || 0,
    })) || [];
  }

  onSelectedMaterialsChange(materials: SelectedMaterial[]): void {
    this.selectedMaterials = materials;
  }

  onSubmit(panel: MatExpansionPanel): void {
    if (this.mode === 'view') return;

    const workRequest: IWorkRequest = {
      name: this.form.value.name,
      laborPrice: this.form.value.laborPrice,
      materialList: this.selectedMaterials.map((mat) => ({
        id: mat.id,
        bulkQuantity: mat.bulkQuantity,
      })),
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

    if (this.mode === 'edit' && this.workData) {
      this.workService.edit({ ...workRequest, id: this.workData.id }).subscribe({
        next: (updatedWork: IWork) => {
          this.utilsService.showSuccessMessage('Trabalho atualizado com sucesso!');
          panel.close();
          this.workSaved.emit(updatedWork);
        },
      });
    }
  }

  get selectedMaterialIds(): number[] {
    return this.selectedMaterials.map(mat => mat.id);
  }  
}

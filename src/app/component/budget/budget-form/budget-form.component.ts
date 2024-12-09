import { Component, Input, EventEmitter, Output, OnInit } from '@angular/core';
import {
  AbstractControl,
  AbstractControlOptions,
  FormBuilder,
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  ValidationErrors,
  ValidatorFn,
  Validators,
} from '@angular/forms';
import { MatIconModule } from '@angular/material/icon';
import { BsModalRef } from 'ngx-bootstrap/modal';
import { UtilsService } from '../../../core/utils/utils.service';
import { MatFormFieldModule } from '@angular/material/form-field';
import { CommonModule } from '@angular/common';
import { MatInputModule } from '@angular/material/input';
import { WorkSelectListComponent } from '../../work/work-select-list/work-select-list.component';
import { BudgetService } from '../../../core/services/budget.service';
import { IBudget } from '../../../core/models/Budget';
import { IBudgetRequest } from '../../../core/interfaces/budget/BudgetRequest';
import { MatButtonModule } from '@angular/material/button';
import { MatSelectModule } from '@angular/material/select';
import { MatCardModule } from '@angular/material/card';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { DateAdapter, MAT_DATE_FORMATS, MAT_DATE_LOCALE, MatNativeDateModule } from '@angular/material/core';

@Component({
  selector: 'app-budget-form',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatSelectModule,
    MatIconModule,
    MatCardModule,
    MatDatepickerModule,
    MatNativeDateModule,
    WorkSelectListComponent,
  ],
  templateUrl: './budget-form.component.html'
})
export class BudgetFormComponent implements OnInit {
  @Input() mode: 'create' | 'edit' | 'view' = 'create';
  @Input() budgetData?: IBudget;
  @Output() closeAction = new EventEmitter<void>();
  form!: FormGroup;
  selectedWorkIds: number[] = [];
  minDate: Date = new Date();

  constructor(
    private readonly fb: FormBuilder,
    private readonly budgetService: BudgetService,
    private readonly utilsService: UtilsService,
    private readonly bsModalRef: BsModalRef,
    private dateAdapter: DateAdapter<Date>
  ) {
    this.dateAdapter.setLocale('pt-BR');
  }

  ngOnInit(): void {
    this.initializeForm();

    if (this.mode !== 'create' && this.budgetData) {
      this.populateForm(this.budgetData);
    }

    if (this.mode === 'view') {
      this.form.disable();
    }
  }

  initializeForm(): void {
    const options: AbstractControlOptions = {
      validators: this.emailMatchValidator,
    };

    this.form = this.fb.group(
      {
        deliveryForecast: new FormControl<Date | null>(null, [
          Validators.required,
          this.minDateValidator,
        ]),
        customerEmail: new FormControl<string | null>(null, [
          Validators.required,
          Validators.email,
        ]),
        confirmEmail: new FormControl<string | null>(null, [
          Validators.required,
          Validators.email,
        ]),
      },
      options
    );
  }

  populateForm(budget: IBudget): void {
    this.form.patchValue({
      deliveryForecast: budget.deliveryForecast,
      customerEmail: budget.customer.email,
    });
    this.selectedWorkIds = budget.workList?.map((work) => work.id) || [];
  }

  emailMatchValidator: ValidatorFn = (
    control: AbstractControl
  ): ValidationErrors | null => {
    const email = control.get('customerEmail')?.value;
    const confirmEmail = control.get('confirmEmail')?.value;

    if (email && confirmEmail && email !== confirmEmail) {
      return { emailMismatch: true };
    }

    return null;
  };

  minDateValidator: ValidatorFn = (control: AbstractControl): ValidationErrors | null => {
    const value = control.value ? new Date(control.value) : null;
    return value && value < this.minDate ? { minDate: true } : null;
  };  
  
  onSelectedWorksChange(workIds: number[]): void {
    this.selectedWorkIds = workIds;
  }

  onSubmit(): void {
    if (this.mode === 'view') return;

    const budgetRequest: IBudgetRequest = {
      deliveryForecast: this.form.value.deliveryForecast,
      customerEmail: this.form.value.customerEmail,
      workIdList: this.selectedWorkIds,
    };

    if (this.mode === 'create') {
      this.budgetService.add(budgetRequest).subscribe({
        next: () => {
          this.utilsService.showSuccessMessage(
            'Trabalho criado com sucesso!'
          );
          this.closeModal();
        },
      });
    }

    if (this.mode === 'edit' && this.budgetData) {
      this.budgetService
        .edit({ ...budgetRequest, id: this.budgetData.id })
        .subscribe({
          next: () => {
            this.utilsService.showSuccessMessage(
              'Trabalho atualizado com sucesso!'
            );
            this.closeModal();
          },
        });
    }
  }

  closeModal(): void {
    this.bsModalRef.hide();
  }
}

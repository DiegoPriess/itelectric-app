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

@Component({
  selector: 'app-budget-form',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatIconModule,
    WorkSelectListComponent,
  ],
  templateUrl: './budget-form.component.html',
})
export class BudgetFormComponent implements OnInit {
  @Input() mode: 'create' | 'edit' | 'view' = 'create';
  @Input() budgetData?: IBudget;
  @Output() closeAction = new EventEmitter<void>();
  form!: FormGroup;
  selectedWorkIds: number[] = [];
  minDate: string;

  constructor(
    private readonly fb: FormBuilder,
    private readonly budgetService: BudgetService,
    private readonly utilsService: UtilsService,
    private readonly bsModalRef: BsModalRef
  ) {
    this.minDate = this.formatDate(new Date());
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
    const confirmEmailValidators =
      this.mode === 'create'
        ? [Validators.required, Validators.email]
        : [];

    const options: AbstractControlOptions = {
      validators: this.emailMatchValidator,
    };

    this.form = this.fb.group(
      {
        deliveryForecast: new FormControl<string | null>(null, [
          Validators.required,
          this.minDateValidator,
        ]),
        customerEmail: new FormControl<string | null>(null, [
          Validators.required,
          Validators.email,
        ]),
        confirmEmail: new FormControl<string | null>(null, confirmEmailValidators),
      },
      options
    );
  }

  populateForm(budget: IBudget): void {
    this.form.patchValue({
      deliveryForecast: this.formatDate(budget.deliveryForecast),
      customerEmail: budget.customer.email,
      confirmEmail: budget.customer.email,
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

  minDateValidator: ValidatorFn = (
    control: AbstractControl
  ): ValidationErrors | null => {
    const value = control.value ? new Date(control.value) : null;
    return value && value < new Date(this.minDate) ? { minDate: true } : null;
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
          this.utilsService.showSuccessMessage('Orçamento criado com sucesso!');
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
              'Orçamento atualizado com sucesso!'
            );
            this.closeModal();
          },
        });
    }
  }

  closeModal(): void {
    this.bsModalRef.hide();
  }

  private formatDate(date: Date | string | number[]): string {
    let parsedDate: Date;

    if (Array.isArray(date)) {
      const [year, month, day] = date;
      parsedDate = new Date(year, month - 1, day);
    } else {
      parsedDate = new Date(date);
    }

    const year = parsedDate.getFullYear();
    const month = String(parsedDate.getMonth() + 1).padStart(2, '0');
    const day = String(parsedDate.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  }
}

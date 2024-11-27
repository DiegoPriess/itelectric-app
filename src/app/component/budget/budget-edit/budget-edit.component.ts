import { Component } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { ActivatedRoute, Router } from '@angular/router';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { MatCardModule } from '@angular/material/card';

import { UtilsService } from '../../../core/utils/utils.service';
import { BudgetService } from '../../../core/services/budget.service';
import { IBudget } from '../../../core/models/Budget';
import { IWork } from '../../../core/models/Work';
import { WorkCardListComponent } from '../../work/work-card-list/work-card-list.component';


@Component({
  selector: 'app-budget-edit',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatSelectModule,
    MatIconModule,
    WorkCardListComponent,
    MatCardModule,
    MatDatepickerModule,
    MatNativeDateModule
  ],
  templateUrl: './budget-edit.component.html',
  styleUrl: './budget-edit.component.scss'
})
export class BudgetEditComponent {
  form!: FormGroup;
  selectedWorksIds: number[] = [];
  selectedWorks: IWork[] = [];
  budgetId!: number;

  constructor(private readonly fb: FormBuilder,
    private readonly budgetService: BudgetService,
    private readonly utilsService: UtilsService,
    private readonly router: Router,
    private readonly route: ActivatedRoute) {
    this.form = this.fb.group({
      id: [''],
      deliveryForecast: ['', Validators.required],
      customerEmail: [null, [Validators.required, Validators.email]],
    });
  }

  ngOnInit() {
    this.budgetId = this.getIdFromUrl()
    this.loadBudgetData();
  }

  loadBudgetData() {
    this.budgetService.get(this.budgetId).subscribe({
      next: (budget: IBudget) => {
        const forecastArray = budget.deliveryForecast as number[];
        const deliveryDate = new Date(
          forecastArray[0],
          forecastArray[1] - 1,
          forecastArray[2]
        );

        this.form.patchValue({
          id: budget.id,
          deliveryForecast: deliveryDate,
          customerEmail: budget.customer.email,
          totalValue: budget.totalValue
        });
        this.onSelectedWorksChange(budget.workList)
      }
    });
  }

  onSelectedWorksChange(works: IWork[]) {
    this.selectedWorksIds = works.map(work => work.id);
    this.selectedWorks = works
  }

  getIdFromUrl(): number {
    const id = this.route.snapshot.paramMap.get('id');
    return id ? +id : 0;
  }

  back(): void {
    this.router.navigateByUrl("/menu/orcamentos");
  }

  onSubmit() {
    this.budgetService.edit(this.form.value, this.selectedWorksIds).subscribe({
      next: () => {
        this.router.navigateByUrl("/menu/orcamentos");
        this.utilsService.showSuccessMessage("Orçamento alterado com sucesso!")
      }
    });
  }
}

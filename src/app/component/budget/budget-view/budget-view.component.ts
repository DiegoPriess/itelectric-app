import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { ActivatedRoute, Router } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';

import { IWork } from '../../../core/models/Work';
import { BudgetService } from '../../../core/services/budget.service';
import { IBudget } from '../../../core/models/Budget';

@Component({
  selector: 'app-budget-view',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatIconModule,
    MatCardModule,
    MatDatepickerModule,
    MatNativeDateModule
  ],
  templateUrl: './budget-view.component.html',
  styleUrl: './budget-view.component.scss'
})
export class BudgetViewComponent {
  form!: FormGroup;
  budgetId!: number;
  selectedWorksIds: number[] = [];
  selectedWorks: IWork[] = [];

  constructor(private readonly fb: FormBuilder,
    private readonly budgetService: BudgetService,
    private readonly router: Router,
    private readonly route: ActivatedRoute) {
    this.form = this.fb.group({
      id: [''],
      deliveryForecast: ['', Validators.required],
      customerEmail: [null, [Validators.required, Validators.email]],
      totalValue: ['', [Validators.required, Validators.pattern('^[0-9]+(.[0-9]{0,2})?$')]]
    });
  }

  ngOnInit() {
    this.budgetId = this.getIdFromUrl()
    this.loadBudgetData()
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

  back(): void {
    this.router.navigateByUrl("/menu/orcamentos");
  }

  onSelectedWorksChange(works: IWork[]) {
    this.selectedWorksIds = works.map(work => work.id);
    this.selectedWorks = works
  }

  getIdFromUrl(): number {
    const id = this.route.snapshot.paramMap.get('id');
    return id ? +id : 0;
  }
}

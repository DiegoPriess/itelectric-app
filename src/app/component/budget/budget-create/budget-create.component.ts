import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { Router } from '@angular/router';
import { MatCardModule } from '@angular/material/card';

import { UtilsService } from '../../../core/utils/utils.service';
import { BudgetService } from '../../../core/services/budget.service';
import { WorkCardListComponent } from '../../work/work-card-list/work-card-list.component';
import { IWork } from '../../../core/models/Work';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';

@Component({
  selector: 'app-budget-create',
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
  templateUrl: './budget-create.component.html',
  styleUrl: './budget-create.component.scss'
})
export class BudgetCreateComponent {
  form!: FormGroup;
  selectedWorksIds: number[] = [];
  selectedWorks: IWork[] = [];

  constructor(
    private readonly fb: FormBuilder,
    private readonly budgetService: BudgetService,
    private readonly utilsService: UtilsService,
    private readonly router: Router
  ) {
    this.form = this.fb.group({
      deliveryForecast: ['', Validators.required],
      customerEmail: [null, [Validators.required, Validators.email]],
    });
  }

  onSelectedWorksChange(works: IWork[]) {
    this.selectedWorksIds = works.map(work => work.id);
    this.selectedWorks = works
  }

  onSubmit() {
    const workData = {
      ...this.form.value,
      workIdList: this.selectedWorksIds
    };

    this.budgetService.add(workData).subscribe({
      next: () => {
        this.router.navigateByUrl("/menu/orcamentos");
        this.utilsService.showSuccessMessage("Orçamento adicionado com sucesso!");
      }
    });
  }

  back(): void {
    this.router.navigateByUrl("/menu/orcamentos");
  }
}

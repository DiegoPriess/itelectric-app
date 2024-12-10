import { Component, OnInit } from '@angular/core';
import { BudgetService } from '../../../core/services/budget.service';
import { IBudgetResponse } from '../../../core/interfaces/budget/BudgetResponse';
import { CommonModule } from '@angular/common';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatCardModule } from '@angular/material/card';
import { MatInputModule } from '@angular/material/input';
import { MatAccordion, MatExpansionModule } from '@angular/material/expansion';
import { MatListModule } from '@angular/material/list';
import { MatDivider } from '@angular/material/divider';

@Component({
  selector: 'app-budget-list',
  standalone: true,
  imports: [
    CommonModule,
    MatPaginatorModule,
    MatToolbarModule,
    MatCardModule,
    MatInputModule,
    MatAccordion,
    MatExpansionModule,
    MatListModule,
    MatDivider
  ],
  templateUrl: './budget-customer-card-list.component.html',
  styleUrls: ['./budget-customer-card-list.component.scss']
})
export class BudgetCustomerCardListComponent implements OnInit {
  budgets: IBudgetResponse[] = [];
  groupedBudgets: { [key: string]: IBudgetResponse[] } = {};
  totalElements: number = 0;
  pageSize: number = 10;
  pageIndex: number = 0;

  constructor(private readonly budgetService: BudgetService) {}

  ngOnInit(): void {
    this.fetchBudgets();
  }

  fetchBudgets(): void {
    this.budgetService.customerList(this.pageIndex, this.pageSize).subscribe(response => {
      this.budgets = response.content;
      this.totalElements = response.totalElements;
      this.groupBudgetsByElectrician();
    });
  }

  groupBudgetsByElectrician(): void {
    this.groupedBudgets = this.budgets.reduce((groups: { [key: string]: IBudgetResponse[] }, budget) => {
      const electricianName = budget.owner.name || 'Desconhecido';
      if (!groups[electricianName]) {
        groups[electricianName] = [];
      }
      groups[electricianName].push(budget);
      return groups;
    }, {});
}

  onPageChange(event: any): void {
    this.pageIndex = event.pageIndex;
    this.pageSize = event.pageSize;
    this.fetchBudgets();
  }
}

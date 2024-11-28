import { Component, ViewChild } from '@angular/core';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatInputModule } from '@angular/material/input';
import { Router } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';

import { UtilsService } from '../../../core/utils/utils.service';
import { Page } from '../../../core/interfaces/Page';
import { IBudget } from '../../../core/models/Budget';
import { BudgetService } from '../../../core/services/budget.service';
import { ConfirmationDialogComponent } from '../../confirmation-dialog/confirmation-dialog.component';

@Component({
	selector: 'app-budget-list',
	standalone: true,
	imports: [
		CommonModule,
		MatPaginatorModule,
		MatTableModule,
		MatIconModule,
		MatToolbarModule,
		MatInputModule
	],
	templateUrl: './budget-list.component.html',
	styleUrl: './budget-list.component.scss'
})
export class BudgetListComponent {
	dataSource = new MatTableDataSource<IBudget>();
	totalElements: number = 0;
	pageSize = 10;
	pageIndex = 0;
	searchQuery: string = '';
	displayedColumns: string[] = ['customer', 'deliveryForecast', 'totalValue', 'status', 'actions'];

	@ViewChild(MatPaginator) paginator!: MatPaginator;

	constructor(
		private readonly budgetService: BudgetService,
		private readonly utilsService: UtilsService,
		private readonly router: Router,
		private readonly dialog: MatDialog
	) { }

	ngOnInit(): void {
		this.loadData();
		this.dataSource.paginator = this.paginator;
	}

	loadData(): void {
		this.budgetService.list(this.pageIndex, this.pageSize, this.searchQuery).subscribe({
			next: (page: Page<IBudget>) => {
				this.dataSource.data = page.content;
				this.totalElements = page.totalElements;
			}
		});
	}

	onPageChange(event: any): void {
		this.pageIndex = event.pageIndex;
		this.pageSize = event.pageSize;
		this.loadData();
	}

	onSearchChange(event: Event): void {
		const input = event.target as HTMLInputElement;
		this.searchQuery = input.value;
		this.pageIndex = 0;
		this.loadData();
	}

	delete(id: number): void {
		const dialogRef = this.dialog.open(ConfirmationDialogComponent, {
			data: {
				message: 'Tem certeza que deseja excluir este orçamento?'
			}
		});

		dialogRef.afterClosed().subscribe(result => {
			if (result) {
				this.budgetService.delete(id).subscribe({
					next: () => {
						this.loadData();
						this.utilsService.showSuccessMessage("Orçamento removido com sucesso!");
					}
				});
			}
		});
	}

	onCreate(): void {
		this.router.navigate(['/menu/orcamentos/criar']);
	}

	onEdit(id: number): void {
		this.router.navigate(['/menu/orcamentos/editar', id]);
	}

	onView(id: number): void {
		this.router.navigate(['/menu/orcamentos/visualizar', id]);
	}

	approve(id: number): void {
		this.budgetService.approve(id).subscribe({
			next: () => {
				this.loadData();
				this.utilsService.showSuccessMessage("Orçamento Aprovado");
			}
		});
	}

	deny(id: number): void {
		this.budgetService.deny(id).subscribe({
			next: () => {
				this.loadData();
				this.utilsService.showSuccessMessage("Orçamento Reprovado");
			}
		});
	}
}

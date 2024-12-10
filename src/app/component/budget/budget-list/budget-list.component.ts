import { Component, ViewChild } from '@angular/core';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatInputModule } from '@angular/material/input';

import { UtilsService } from '../../../core/utils/utils.service';
import { Page } from '../../../core/interfaces/Page';
import { IBudget } from '../../../core/models/Budget';
import { BudgetService } from '../../../core/services/budget.service';
import { BudgetFormComponent } from '../budget-form/budget-form.component';
import { ConfirmationModalComponent } from '../../confirmation-modal/confirmation-modal.component';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';

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
	styleUrl: './budget-list.component.scss',
	providers: [BsModalService],
})
export class BudgetListComponent {
	dataSource = new MatTableDataSource<IBudget>();
	totalElements: number = 0;
	pageSize = 10;
	pageIndex = 0;
	searchQuery: string = '';
	displayedColumns: string[] = ['customer', 'deliveryForecast', 'totalValue', 'status', 'actions'];
	modalRef?: BsModalRef;

	@ViewChild(MatPaginator) paginator!: MatPaginator;

	constructor(
		private readonly budgetService: BudgetService,
		private readonly utilsService: UtilsService,
		private readonly modalService: BsModalService
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

	onDelete(id: number): void {
		this.modalRef = this.modalService.show(ConfirmationModalComponent, {
			class: 'modal-dialog-centered',
			initialState: {
				title: 'Excluir Orçamento',
				message: 'Tem certeza de que deseja excluir este orçamento?',
			},
		});

		this.modalRef.content?.confirm.subscribe(() => {
			this.delete(id);
		});
	}

	delete(id: number): void {
		this.budgetService.delete(id).subscribe({
			next: () => {
				this.utilsService.showSuccessMessage('Orçamento removido com sucesso!');
				this.loadData();
			},
		});
	}

	onCreate(): void {
		this.modalRef = this.modalService.show(BudgetFormComponent, {
			class: 'modal-dialog-centered modal-lg',
			backdrop: 'static',
			keyboard: false,
			initialState: { mode: 'create' },
		});

		this.modalRef.onHide?.subscribe(() => {
			this.loadData();
		});
	}

	onEdit(id: number): void {
		this.budgetService.get(id).subscribe((budget) => {
			this.modalRef = this.modalService.show(BudgetFormComponent, {
				class: 'modal-dialog-centered modal-lg',
				initialState: { mode: 'edit', budgetData: budget },
			});

			this.modalRef.onHide?.subscribe(() => {
				this.loadData();
			});
		});
	}

	onView(id: number): void {
		this.budgetService.get(id).subscribe((budget) => {
			this.modalRef = this.modalService.show(BudgetFormComponent, {
				class: 'modal-dialog-centered modal-lg',
				initialState: { mode: 'view', budgetData: budget },
			});
		});
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

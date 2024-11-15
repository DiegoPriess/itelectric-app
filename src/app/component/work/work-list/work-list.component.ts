import { Component, ViewChild } from '@angular/core';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatInputModule } from '@angular/material/input';

import { UtilsService } from '../../../core/utils/utils.service';
import { Page } from '../../../core/interfaces/Page';
import { IWork } from '../../../core/models/Work';
import { WorkService } from '../../../core/services/work.service';
import { Router } from '@angular/router';

@Component({
	selector: 'app-work-list',
	standalone: true,
	imports: [
		CommonModule,
		MatPaginatorModule,
		MatTableModule,
		MatIconModule,
		MatToolbarModule,
		MatInputModule
	],
	templateUrl: './work-list.component.html',
	styleUrl: './work-list.component.scss'
})
export class WorkListComponent {
	dataSource = new MatTableDataSource<IWork>();
	totalElements: number = 0;
	pageSize = 10;
	pageIndex = 0;
	searchQuery: string = '';
	displayedColumns: string[] = ['name', 'price', 'quantityOfMaterials', 'actions'];

	@ViewChild(MatPaginator) paginator!: MatPaginator;

	constructor(
		private workService: WorkService,
		private utilsService: UtilsService,
		private router: Router
	) { }

	ngOnInit(): void {
		this.loadData();
		this.dataSource.paginator = this.paginator;
	}

	loadData(): void {
		this.workService.list(this.pageIndex, this.pageSize, this.searchQuery).subscribe({
			next: (page: Page<IWork>) => {
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
		this.workService.delete(id).subscribe({
			next: () => {
				this.loadData();
				this.utilsService.showSuccessMessage("Trabalho removido com sucesso!");
			}
		});
	}

	onCreate(): void {
		this.router.navigate(['/menu/trabalhos/criar']);
	}

	onEdit(materialId: number): void {
		this.router.navigate(['/menu/trabalhos/editar', materialId]);
	}

	onView(materialId: number): void {
		this.router.navigate(['/menu/trabalhos/visualizar', materialId]);
	}
}

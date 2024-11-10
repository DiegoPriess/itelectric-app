import { Component, OnInit, ViewChild } from '@angular/core';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MatInputModule } from '@angular/material/input';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatIconModule } from '@angular/material/icon';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';

import { IMaterial } from '../../../core/models/Material';
import { MaterialService } from '../../../core/services/material.service';
import { Page } from '../../../core/interfaces/Page';
import { UtilsService } from '../../../core/services/utils.service';

@Component({
	selector: 'app-material-list',
	standalone: true,
	imports: [
		CommonModule,
		MatPaginatorModule,
		MatTableModule,
		MatIconModule,
		MatToolbarModule,
		MatInputModule,
	],
	templateUrl: './material-list.component.html',
	styleUrls: ['./material-list.component.scss']
})
export class MaterialListComponent implements OnInit {
	dataSource = new MatTableDataSource<IMaterial>();
	totalElements: number = 0;
	pageSize = 10;
	pageIndex = 0;
	searchQuery: string = '';
	displayedColumns: string[] = ['name', 'price', 'quantityUnitMeasure', 'actions'];

	@ViewChild(MatPaginator) paginator!: MatPaginator;

	constructor(
		private materialService: MaterialService,
		private utilsService: UtilsService,
		private router: Router
	) { }

	ngOnInit(): void {
		this.loadData();
		this.dataSource.paginator = this.paginator;
	}

	loadData(): void {
		this.materialService.list(this.pageIndex, this.pageSize, this.searchQuery).subscribe({
			next: (page: Page<IMaterial>) => {
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
		this.materialService.delete(id).subscribe({
			next: () => {
				this.loadData();
				this.utilsService.showSuccessMessage("Material removido com sucesso!");
			}
		});
	}

	onCreate(): void {
		this.router.navigate(['/menu/materiais/criar']);
	}

	onEdit(materialId: number): void {
		this.router.navigate(['/menu/materiais/editar', materialId]);
	}

	onView(materialId: number): void {
		this.router.navigate(['/menu/materiais/visualizar', materialId]);
	}
}

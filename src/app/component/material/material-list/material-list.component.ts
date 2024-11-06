import { Component, EventEmitter, OnInit, Output, ViewChild } from '@angular/core';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MatDialog } from '@angular/material/dialog';
import { MatInputModule } from '@angular/material/input';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatIconModule } from '@angular/material/icon';
import { CommonModule } from '@angular/common';

import { IMaterial } from '../../../core/models/Material';
import { MaterialService } from '../../../core/services/material.service';
import { Page } from '../../../core/models/Page';
import { MaterialCreateComponent } from '../material-create/material-create.component';
import { MaterialEditComponent } from '../material-edit/material-edit.component';
import { MaterialViewComponent } from '../material-view/material-view.component';
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

	@Output() add = new EventEmitter<void>();
	@Output() edit = new EventEmitter<void>();

	@ViewChild(MatPaginator) paginator!: MatPaginator;

	constructor(
		private materialService: MaterialService,
		private dialog: MatDialog,
		private utilsService: UtilsService
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

	openAddDialog(): void {
		const dialogRef = this.dialog.open(MaterialCreateComponent, {
			width: '90vw',
			maxWidth: '600px',
			maxHeight: '90vh',
			autoFocus: false
		});

		dialogRef.afterClosed().subscribe(() => {
			this.loadData();
		});
	}

	openViewDialog(material: IMaterial): void {
		const dialogRef = this.dialog.open(MaterialViewComponent, {
			width: '90vw',
			maxWidth: '600px',
			maxHeight: '90vh',
			autoFocus: false,
			data: { material: material }
		});

		dialogRef.afterClosed().subscribe(() => {
			this.loadData();
		});
	}

	openEditDialog(material: IMaterial): void {
		const dialogRef = this.dialog.open(MaterialEditComponent, {
			width: '90vw',
			maxWidth: '600px',
			maxHeight: '90vh',
			autoFocus: false,
			data: { material: material }
		});

		dialogRef.afterClosed().subscribe(() => {
			this.loadData();
		});
	}
}

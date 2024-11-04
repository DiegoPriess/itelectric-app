import { Component, EventEmitter, Input, OnInit, Output, ViewChild } from '@angular/core';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MatTableModule } from '@angular/material/table';
import { Router } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatCard, MatCardActions, MatCardContent } from '@angular/material/card';

import { IMaterial } from '../../../core/models/Material';
import { MaterialService } from '../../../core/services/material.service';
import { Page } from '../../../core/models/Page';
import { MaterialCreateComponent } from '../material-create/material-create.component';
import { MaterialEditComponent } from '../material-edit/material-edit.component';
import { MaterialViewComponent } from '../material-view/material-view.component';
import { UtilsService } from '../../../core/services/utils.service';
import { MatLabel } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';

@Component({
	selector: 'app-material-list',
	standalone: true,
	imports: [
		CommonModule,
		MatPaginatorModule,
		MatTableModule,
		MatIconModule,
		MatToolbarModule,
		MatCard,
		MatCardActions,
		MatCardContent,
		MatInputModule,
		MatLabel
	],
	templateUrl: './material-list.component.html',
	styleUrls: ['./material-list.component.scss']
})
export class MaterialListComponent implements OnInit {
	@Input() selectable: boolean = false;
	dataSource: IMaterial[] = [];
	totalElements: number = 0;
	pageSize = 10;
	pageIndex = 0;
	selectedItems: IMaterial[] = [];
	searchQuery: string = '';

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
	}

	loadData(): void {
		console.log(`Searching for: ${this.searchQuery}`); // Adicione este log
		this.materialService.list(this.pageIndex, this.pageSize, this.searchQuery).subscribe({
			next: (page: Page<IMaterial>) => {
				this.dataSource = page.content;
				this.totalElements = page.totalElements;
			},
			error: (err) => {
				console.error('Erro ao carregar os materiais', err);
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

	toggleSelection(item: IMaterial): void {
		if (this.selectable) {
			const index = this.selectedItems.findIndex(selected => selected.id === item.id);
			if (index === -1) {
				this.selectedItems.push(item);
			} else {
				this.selectedItems.splice(index, 1);
			}
		}
	}

	delete(id: number) {
		this.materialService.delete(id).subscribe({
			next: () => {
				this.loadData();
				this.utilsService.showSuccessMessage("Material removido com sucesso!")
			}
		});
	}

	openAddDialog() {
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
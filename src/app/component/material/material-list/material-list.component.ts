import { Component, ViewChild } from '@angular/core';
import { MatPaginator, MatPaginatorModule, PageEvent } from '@angular/material/paginator';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MatInputModule } from '@angular/material/input';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatIconModule } from '@angular/material/icon';
import { CommonModule } from '@angular/common';
import { BsModalService, BsModalRef } from 'ngx-bootstrap/modal';

import { IMaterial } from '../../../core/models/Material';
import { MaterialService } from '../../../core/services/material.service';
import { Page } from '../../../core/interfaces/Page';
import { UtilsService } from '../../../core/utils/utils.service';
import { MaterialFormComponent } from '../material-form/material-form.component';
import { ConfirmationModalComponent } from '../../confirmation-modal/confirmation-modal.component';

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
	styleUrls: ['./material-list.component.scss'],
	providers: [BsModalService],
})
export class MaterialListComponent {
	dataSource = new MatTableDataSource<IMaterial>();
	totalElements: number = 0;
	pageSize = 10;
	pageIndex = 0;
	searchQuery: string = '';
	displayedColumns: string[] = ['name', 'price', 'quantityUnitMeasure', 'actions'];
	modalRef?: BsModalRef;

	@ViewChild(MatPaginator) paginator!: MatPaginator;

	constructor(
		private readonly materialService: MaterialService,
		private readonly utilsService: UtilsService,
		private readonly modalService: BsModalService
	) { }

	ngOnInit(): void {
		this.loadData();
	}

	loadData(): void {
		this.materialService.list(this.pageIndex, this.pageSize, this.searchQuery).subscribe({
			next: (page: Page<IMaterial>) => {
				this.dataSource.data = page.content;
				this.totalElements = page.totalElements;
			},
		});
	}

	onPageChange(event: PageEvent): void {
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
				title: 'Excluir Material',
				message: 'Tem certeza de que deseja excluir este material?',
			},
		});

		this.modalRef.content?.confirm.subscribe(() => {
			this.delete(id);
		});
	}

	delete(id: number): void {
		this.materialService.delete(id).subscribe({
			next: () => {
				this.utilsService.showSuccessMessage('Material removido com sucesso!');
				this.loadData();
			},
		});
	}

	onCreate(): void {
		this.modalRef = this.modalService.show(MaterialFormComponent, {
			class: 'modal-dialog-centered modal-lg',
			backdrop: 'static',
			keyboard: false,
			initialState: { mode: 'create' },
		});

		this.modalRef.onHide?.subscribe(() => {
			this.loadData();
		});
	}

	onEdit(materialId: number): void {
		this.materialService.get(materialId).subscribe((material) => {
			this.modalRef = this.modalService.show(MaterialFormComponent, {
				class: 'modal-dialog-centered modal-lg',
				initialState: { mode: 'edit', materialData: material },
			});

			this.modalRef.onHide?.subscribe(() => {
				this.loadData();
			});
		});
	}

	onView(materialId: number): void {
		this.materialService.get(materialId).subscribe((material) => {
			this.modalRef = this.modalService.show(MaterialFormComponent, {
				class: 'modal-dialog-centered modal-lg',
				initialState: { mode: 'view', materialData: material },
			});
		});
	}
}

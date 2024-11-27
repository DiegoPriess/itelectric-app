import { Component, EventEmitter, Input, OnInit, Output, ViewChild } from '@angular/core';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { CommonModule } from '@angular/common';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatCardModule } from '@angular/material/card';
import { MatInputModule } from '@angular/material/input';

import { Page } from '../../../core/interfaces/Page';
import { IWork } from '../../../core/models/Work';
import { WorkService } from '../../../core/services/work.service';

@Component({
	selector: 'app-work-card-list',
	standalone: true,
	imports: [
		CommonModule,
		MatPaginatorModule,
		MatToolbarModule,
		MatCardModule,
		MatInputModule,
	],
	templateUrl: './work-card-list.component.html',
	styleUrls: ['./work-card-list.component.scss']
})
export class WorkCardListComponent implements OnInit {
	dataSource: IWork[] = [];
	totalElements: number = 0;
	pageSize = 10;
	pageIndex = 0;
	selectedItems: IWork[] = [];
	searchQuery: string = '';

	@Input() selectedWorks: IWork[] = [];
	@Output() selectedWorksChange = new EventEmitter<IWork[]>();

	@ViewChild(MatPaginator) paginator!: MatPaginator;

	constructor(
		private readonly workService: WorkService
	) { }

	ngOnInit(): void {
		this.loadData();
	}

	loadData(): void {
		this.workService.list(this.pageIndex, this.pageSize, this.searchQuery).subscribe({
			next: (page: Page<IWork>) => {
				this.dataSource = page.content;
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

	toggleWorkSelection(work: IWork) {
		if (this.isSelected(work)) {
			this.selectedWorks = this.selectedWorks.filter(w => w.id !== work.id);
		} else {
			this.selectedWorks.push(work);
		}
		this.selectedWorksChange.emit(this.selectedWorks);
	}

	onCardKeyDown(event: KeyboardEvent, element: any): void {
		if (event.key === 'Enter' || event.key === ' ') {
			this.toggleWorkSelection(element);
			event.preventDefault();
		}
	}

	isSelected(work: IWork): boolean {
		return this.selectedWorks.some(w => w.id === work.id);
	}
}

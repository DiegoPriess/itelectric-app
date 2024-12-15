import { Component, ViewChild } from '@angular/core';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MatPaginator, MatPaginatorModule, PageEvent } from '@angular/material/paginator';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatInputModule } from '@angular/material/input';
import { MatDialog } from '@angular/material/dialog';
import { BsModalService, BsModalRef } from 'ngx-bootstrap/modal';

import { UtilsService } from '../../../core/utils/utils.service';
import { Page } from '../../../core/interfaces/Page';
import { IWork } from '../../../core/models/Work';
import { WorkService } from '../../../core/services/work.service';
import { WorkFormModalComponent } from '../work-form-modal/work-form-modal.component';
import { ConfirmationModalComponent } from '../../confirmation-modal/confirmation-modal.component';

@Component({
  selector: 'app-work-list',
  standalone: true,
  imports: [
    CommonModule,
    MatPaginatorModule,
    MatTableModule,
    MatIconModule,
    MatToolbarModule,
    MatInputModule,
  ],
  templateUrl: './work-list.component.html',
  styleUrls: ['./work-list.component.scss'],
  providers: [BsModalService],
})
export class WorkListComponent {
  dataSource = new MatTableDataSource<IWork>();
  totalElements: number = 0;
  pageSize = 10;
  pageIndex = 0;
  searchQuery: string = '';
  displayedColumns: string[] = [
    'name',
    'laborPrice',
    'materialPrice',
    'quantityOfMaterials',
    'actions',
  ];
  modalRef?: BsModalRef;

  @ViewChild(MatPaginator) paginator!: MatPaginator;
return: string|boolean|undefined;

  constructor(
    private readonly workService: WorkService,
    private readonly utilsService: UtilsService,
    private readonly dialog: MatDialog,
    private readonly modalService: BsModalService
  ) {}

  ngOnInit(): void {
    this.loadData();
  }

  loadData(): void {
    this.workService
      .list(this.pageIndex, this.pageSize, this.searchQuery)
      .subscribe({
        next: (page: Page<IWork>) => {
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
			title: 'Excluir Trabalho',
			message: 'Tem certeza de que deseja excluir este trabalho?',
		},
	});

    this.modalRef.content?.confirm.subscribe(() => {
      this.delete(id);
    });
  }

  delete(id: number): void {
    this.workService.delete(id).subscribe({
      next: () => {
        this.utilsService.showSuccessMessage('Trabalho excluído com sucesso!');
        this.loadData();
      }
    });
  }

  onCreate(): void {
    this.modalRef = this.modalService.show(WorkFormModalComponent, {
      class: 'modal-dialog-centered modal-lg',
      backdrop: 'static',
      keyboard: false,
      initialState: { mode: 'create' },
    });

    this.modalRef.onHide?.subscribe(() => {
      this.loadData();
    });
  }

  onEdit(workId: number): void {
    this.workService.get(workId).subscribe((work) => {
      this.modalRef = this.modalService.show(WorkFormModalComponent, {
        class: 'modal-dialog-centered modal-lg',
        initialState: { mode: 'edit', workData: work },
      });

      this.modalRef.onHide?.subscribe(() => {
        this.loadData();
      });
    });
  }

  onView(workId: number): void {
    this.workService.get(workId).subscribe((work) => {
      this.modalRef = this.modalService.show(WorkFormModalComponent, {
        class: 'modal-dialog-centered modal-lg',
        initialState: { mode: 'view', workData: work },
      });
    });
  }
}

import { Component, OnInit, ViewChild } from '@angular/core';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { CommonModule } from '@angular/common';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatCardContent } from '@angular/material/card';
import { MatInputModule } from '@angular/material/input';

import { IMaterial } from '../../../core/models/Material';
import { MaterialService } from '../../../core/services/material.service';
import { Page } from '../../../core/models/Page';

@Component({
  selector: 'app-material-card-list',
  standalone: true,
  imports: [
    CommonModule,
    MatPaginatorModule,
    MatToolbarModule,
    MatCardContent,
    MatInputModule,
  ],
  templateUrl: './material-card-list.component.html',
  styleUrls: ['./material-card-list.component.scss']
})
export class MaterialCardListComponent implements OnInit {
  dataSource: IMaterial[] = [];
  totalElements: number = 0;
  pageSize = 10;
  pageIndex = 0;
  selectedItems: IMaterial[] = [];
  searchQuery: string = '';

  @ViewChild(MatPaginator) paginator!: MatPaginator;

  constructor(
    private materialService: MaterialService
  ) { }

  ngOnInit(): void {
    this.loadData();
  }

  loadData(): void {
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
    const index = this.selectedItems.findIndex(selected => selected.id === item.id);
    if (index === -1) {
      this.selectedItems.push(item);
    } else {
      this.selectedItems.splice(index, 1);
    }
  }
}

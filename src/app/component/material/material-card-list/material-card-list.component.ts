import { Component, EventEmitter, Input, OnInit, Output, ViewChild } from '@angular/core';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { CommonModule } from '@angular/common';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatCardModule } from '@angular/material/card';
import { MatInputModule } from '@angular/material/input';

import { IMaterial } from '../../../core/models/Material';
import { MaterialService } from '../../../core/services/material.service';
import { Page } from '../../../core/interfaces/Page';

@Component({
  selector: 'app-material-card-list',
  standalone: true,
  imports: [
    CommonModule,
    MatPaginatorModule,
    MatToolbarModule,
    MatCardModule,
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

  @Input() selectedMaterials: IMaterial[] = [];
  @Output() selectedMaterialsChange = new EventEmitter<IMaterial[]>();

  @ViewChild(MatPaginator) paginator!: MatPaginator;

  constructor(
    private readonly materialService: MaterialService
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

  toggleMaterialSelection(material: IMaterial) {
    if (this.isSelected(material)) {
      this.selectedMaterials = this.selectedMaterials.filter(m => m.id !== material.id);
    } else {
      this.selectedMaterials.push(material);
    }
    this.selectedMaterialsChange.emit(this.selectedMaterials);
  }

  isSelected(material: IMaterial): boolean {
    return this.selectedMaterials.some(m => m.id === material.id);
  }
}

import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { IMaterial } from '../../../core/models/Material';
import { MaterialService } from '../../../core/services/material.service';
import { Page } from '../../../core/interfaces/Page';
import { CommonModule } from '@angular/common';
import { MatSelectModule } from '@angular/material/select';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { FormsModule } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MaterialFormAccordionComponent } from "../material-form-accordion/material-form-accordion.component";

@Component({
  selector: 'app-material-select-list',
  standalone: true,
  imports: [
    CommonModule,
    MatCardModule,
    MatSelectModule,
    MatFormFieldModule,
    MatInputModule,
    MatIconModule,
    FormsModule,
    MaterialFormAccordionComponent
],
  templateUrl: './material-select-list.component.html',
  styleUrls: ['./material-select-list.component.scss'],
})
export class MaterialSelectListComponent implements OnInit {
  @Input() mode: 'create' | 'edit' | 'view' = 'create';
  @Input() selectedMaterialIds: number[] = [];
  @Output() selectedMaterialIdsChange = new EventEmitter<number[]>();

  dataSource: IMaterial[] = [];
  searchQuery: string = '';

  constructor(
    private readonly materialService: MaterialService
  ) {}

  ngOnInit(): void {
    this.loadData();
  }

  loadData(): void {
    this.materialService.list(0, 9999, this.searchQuery).subscribe({
      next: (page: Page<IMaterial>) => {
        this.dataSource = page.content;
      },
    });
  }

  updateSelection(selectedIds: number[]): void {
    if (this.mode === 'view') return;
    this.selectedMaterialIds = selectedIds;
    this.selectedMaterialIdsChange.emit(this.selectedMaterialIds);
  }

  onMaterialSaved(): void {
    this.loadData();
  }

  get selectedMaterialObjects(): IMaterial[] {
    return this.selectedMaterialIds
      .map((id) => this.dataSource.find((mat) => mat.id === id))
      .filter((mat): mat is IMaterial => !!mat);
  }
}

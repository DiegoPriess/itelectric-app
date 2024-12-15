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
import { MaterialFormAccordionComponent } from '../material-form-accordion/material-form-accordion.component';

interface SelectedMaterial {
  id: number;
  name: string;
  unitMeasure: string;
  bulkQuantity: number;
}

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
  @Input() selectedMaterialsInput: { id: number; bulkQuantity: number }[] = [];
  @Output() selectedMaterialIdsChange = new EventEmitter<number[]>();
  @Output() selectedMaterialsChange = new EventEmitter<SelectedMaterial[]>();

  dataSource: IMaterial[] = [];
  selectedMaterials: SelectedMaterial[] = [];
  searchQuery: string = '';

  constructor(private readonly materialService: MaterialService) {}

  ngOnInit(): void {
    this.loadData();
  }

  loadData(): void {
    this.materialService.list(0, 9999, this.searchQuery).subscribe({
      next: (page: Page<IMaterial>) => {
        this.dataSource = page.content;
        this.syncSelectedMaterials();
      },
    });
  }

  updateSelection(selectedIds: number[]): void {
    if (this.mode === 'view') return;

    this.selectedMaterialIds = selectedIds;
    this.syncSelectedMaterials();
    this.selectedMaterialIdsChange.emit(this.selectedMaterialIds);
    this.selectedMaterialsChange.emit(this.selectedMaterials);
  }

  syncSelectedMaterials(): void {
    this.selectedMaterials = this.selectedMaterialIds.map((id) => {
      const material = this.dataSource.find((mat) => mat.id === id);
      const existingInput = this.selectedMaterialsInput.find((input) => input.id === id);

      return {
        id: material?.id || id,
        name: material?.name || 'Desconhecido',
        unitMeasure: material?.unitMeasure?.label || 'Desconhecido',
        bulkQuantity: existingInput?.bulkQuantity ?? material?.quantityUnitMeasure ?? 0,
      };
    });
  }

  onBulkQuantityChange(id: number, bulkQuantity: number): void {
    const material = this.selectedMaterials.find((mat) => mat.id === id);
    if (material) {
      material.bulkQuantity = bulkQuantity;
      this.selectedMaterialsChange.emit(this.selectedMaterials);
    }
  }

  onMaterialSaved(): void {
    this.loadData();
  }
}

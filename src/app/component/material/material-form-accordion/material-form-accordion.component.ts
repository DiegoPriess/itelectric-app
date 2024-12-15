import { Component, Input, Output, EventEmitter } from '@angular/core';
import { MatExpansionModule, MatExpansionPanel } from '@angular/material/expansion';
import { CommonModule } from '@angular/common';
import { MaterialFormComponent } from '../material-form/material-form.component';
import { IMaterial } from '../../../core/models/Material';
import { MaterialService } from '../../../core/services/material.service';
import { UtilsService } from '../../../core/utils/utils.service';

@Component({
  selector: 'app-material-form-accordion',
  standalone: true,
  templateUrl: './material-form-accordion.component.html',
  imports: [
    CommonModule,
    MatExpansionModule,
    MaterialFormComponent,
  ],
})
export class MaterialFormAccordionComponent {
  @Input() mode: 'create' | 'edit' | 'view' = 'create';
  @Input() materialData?: IMaterial;
  @Output() materialSaved = new EventEmitter<IMaterial>();

  constructor(
    private materialService: MaterialService,
    private utilsService: UtilsService
  ) {}

  handleFormSubmit(material: IMaterial, panel: MatExpansionPanel): void {
    if (this.mode === 'create') {
      this.materialService.add(material).subscribe({
        next: (newMaterial: IMaterial) => {
          this.utilsService.showSuccessMessage('Material criado com sucesso!');
          this.materialSaved.emit(newMaterial);
          panel.close();
        }
      });
    } else if (this.mode === 'edit' && this.materialData) {
      this.materialService.edit({ ...material, id: this.materialData.id }).subscribe({
        next: (updatedMaterial: IMaterial) => {
          this.utilsService.showSuccessMessage('Material atualizado com sucesso!');
          this.materialSaved.emit(updatedMaterial);
          panel.close();
        }
      });
    }
  }
}

import { Component, Input, Output, EventEmitter } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { CommonModule } from '@angular/common';
import { MaterialFormComponent } from '../material-form/material-form.component';
import { IMaterial } from '../../../core/models/Material';
import { MaterialService } from '../../../core/services/material.service';
import { UtilsService } from '../../../core/utils/utils.service';
import { BsModalRef } from 'ngx-bootstrap/modal';

@Component({
  selector: 'app-material-form-modal',
  standalone: true,
  templateUrl: './material-form-modal.component.html',
  imports: [
    CommonModule,
    MatIconModule,
    MaterialFormComponent,
  ],
})
export class MaterialFormModalComponent {
  @Input() mode: 'create' | 'edit' | 'view' = 'create';
  @Input() materialData?: IMaterial;
  @Output() materialSaved = new EventEmitter<IMaterial>();

  constructor(
    private materialService: MaterialService,
    private utilsService: UtilsService,
    private modalRef: BsModalRef
  ) {}

  handleFormSubmit(material: IMaterial): void {
    if (this.mode === 'create') {
      this.materialService.add(material).subscribe({
        next: (newMaterial: IMaterial) => {
          this.utilsService.showSuccessMessage('Material criado com sucesso!');
          this.materialSaved.emit(newMaterial);
          this.closeModal();
        }
      });
    } else if (this.mode === 'edit' && this.materialData) {
      this.materialService.edit({ ...material, id: this.materialData.id }).subscribe({
        next: (updatedMaterial: IMaterial) => {
          this.utilsService.showSuccessMessage('Material atualizado com sucesso!');
          this.materialSaved.emit(updatedMaterial);
          this.closeModal();
        }
      });
    }
  }

  closeModal(): void {
    this.modalRef.hide();
  }
}

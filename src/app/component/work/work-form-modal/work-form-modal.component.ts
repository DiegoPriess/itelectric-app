import { Component, Input, Output, EventEmitter } from '@angular/core';
import { BsModalRef } from 'ngx-bootstrap/modal';
import { WorkService } from '../../../core/services/work.service';
import { UtilsService } from '../../../core/utils/utils.service';
import { IWork } from '../../../core/models/Work';
import { WorkFormComponent } from '../work-form/work-form.component';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-work-form-modal',
  standalone: true,
  imports: [
    MatIconModule,
    WorkFormComponent
  ],
  templateUrl: './work-form-modal.component.html',
})
export class WorkFormModalComponent {
  @Input() mode: 'create' | 'edit' | 'view' = 'create';
  @Input() workData?: IWork;
  @Output() workSaved = new EventEmitter<IWork>();

  constructor(
    private workService: WorkService,
    private utilsService: UtilsService,
    private modalRef: BsModalRef
  ) {}

  handleFormSubmit(workRequest: any): void {
    if (this.mode === 'create') {
      this.workService.add(workRequest).subscribe(() => {
        this.utilsService.showSuccessMessage('Trabalho criado com sucesso!');
        this.workSaved.emit();
        this.closeModal();
      });
    } else if (this.mode === 'edit' && this.workData) {
      this.workService.edit({ ...workRequest, id: this.workData.id }).subscribe(() => {
        this.utilsService.showSuccessMessage('Trabalho atualizado com sucesso!');
        this.workSaved.emit();
        this.closeModal();
      });
    }
  }

  closeModal(): void {
    this.modalRef.hide();
  }
}

import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatExpansionModule, MatExpansionPanel } from '@angular/material/expansion';
import { WorkFormComponent } from '../work-form/work-form.component';
import { IWork } from '../../../core/models/Work';
import { WorkService } from '../../../core/services/work.service';
import { UtilsService } from '../../../core/utils/utils.service';

@Component({
  selector: 'app-work-form-accordion',
  standalone: true,
  imports: [
    CommonModule, 
    MatExpansionModule, 
    WorkFormComponent
  ],
  templateUrl: './work-form-accordion.component.html',
})
export class WorkFormAccordionComponent {
  @Input() mode: 'create' | 'edit' | 'view' = 'create';
  @Input() workData?: IWork;
  @Output() workSaved = new EventEmitter<IWork>();

  constructor(
    private workService: WorkService,
    private utilsService: UtilsService
  ) {}

  handleFormSubmit(workRequest: any, panel: MatExpansionPanel): void {
    if (this.mode === 'create') {
      this.workService.add(workRequest).subscribe((newWork) => {
        this.utilsService.showSuccessMessage('Trabalho criado com sucesso!');
        this.workSaved.emit(newWork);
        panel.close();
      });
    } else if (this.mode === 'edit' && this.workData) {
      this.workService.edit({ ...workRequest, id: this.workData.id }).subscribe((updatedWork) => {
        this.utilsService.showSuccessMessage('Trabalho atualizado com sucesso!');
        this.workSaved.emit(updatedWork);
        panel.close();
      });
    }
  }
}

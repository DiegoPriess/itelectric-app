import { Component, Input, Output, EventEmitter } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { BsModalRef } from 'ngx-bootstrap/modal';

@Component({
  selector: 'app-confirmation-modal',
  standalone: true,
  imports: [
    MatIconModule,
  ],
  templateUrl: './confirmation-modal.component.html',
  styleUrls: ['./confirmation-modal.component.scss'],
})
export class ConfirmationModalComponent {
  @Input() title: string = 'Confirmação';
  @Input() message: string = '';
  @Output() confirm = new EventEmitter<void>();

  constructor(public bsModalRef: BsModalRef) {}

  onConfirm(): void {
    this.confirm.emit();
    this.bsModalRef.hide();
  }

  onClose(): void {
    this.bsModalRef.hide();
  }
}

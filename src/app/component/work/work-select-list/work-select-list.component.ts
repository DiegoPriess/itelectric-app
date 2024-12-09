import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { IWork } from '../../../core/models/Work';
import { WorkService } from '../../../core/services/work.service';
import { Page } from '../../../core/interfaces/Page';
import { CommonModule } from '@angular/common';
import { MatSelectModule } from '@angular/material/select';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatCardModule } from '@angular/material/card';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-work-select-list',
  standalone: true,
  imports: [
    CommonModule,
    MatCardModule,
    MatSelectModule,
    MatFormFieldModule,
    MatInputModule,
    FormsModule,
  ],
  templateUrl: './work-select-list.component.html',
  styleUrls: ['./work-select-list.component.scss'],
})
export class WorkSelectListComponent implements OnInit {
  @Input() selectedWorkIds: number[] = [];
  @Input() disabled: boolean = false;
  @Output() selectedWorkIdsChange = new EventEmitter<number[]>();

  dataSource: IWork[] = [];
  searchQuery: string = '';

  constructor(private readonly workService: WorkService) { }

  ngOnInit(): void {
    this.loadData();
  }

  loadData(): void {
    this.workService.list(0, 9999, this.searchQuery).subscribe({
      next: (page: Page<IWork>) => {
        this.dataSource = page.content;
      },
    });
  }

  updateSelection(selectedWorks: IWork[]): void {
    if (this.disabled) return;
    this.selectedWorkIds = selectedWorks.map((work) => work.id);
    this.selectedWorkIdsChange.emit(this.selectedWorkIds);
  }

  get selectedWorkObjects(): IWork[] {
    return this.selectedWorkIds
      .map((id) => this.dataSource.find((work) => work.id === id))
      .filter((work): work is IWork => !!work);
  }
}

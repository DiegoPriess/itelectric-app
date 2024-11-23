import { ComponentFixture, TestBed } from '@angular/core/testing';
import { WorkCardListComponent } from './work-card-list.component';
import { WorkService } from '../../../core/services/work.service';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatCardModule } from '@angular/material/card';
import { MatInputModule } from '@angular/material/input';
import { MatToolbarModule } from '@angular/material/toolbar';
import { of } from 'rxjs';
import { IWork } from '../../../core/models/Work';
import { Page } from '../../../core/interfaces/Page';
import { HttpClientTestingModule } from '@angular/common/http/testing';

describe('WorkCardListComponent', () => {
  let component: WorkCardListComponent;
  let fixture: ComponentFixture<WorkCardListComponent>;
  let mockWorkService: any;

  const mockWorks: IWork[] = [
    {
      id: 1,
      name: 'Work A',
      price: 500,
      materialList: [{ id: 1, name: 'Material 1', price: 100, quantityUnitMeasure: 1, unitMeasure: { name: 'KG', label: 'Quilograma' } }],
    },
    {
      id: 2,
      name: 'Work B',
      price: 1000,
      materialList: [{ id: 1, name: 'Material 1', price: 100, quantityUnitMeasure: 1, unitMeasure: { name: 'KG', label: 'Quilograma' } }],
    },
  ];

  const mockPage: Page<IWork> = {
    content: mockWorks,
    totalElements: mockWorks.length,
    totalPages: 0,
    number: 0,
    size: 0
  };

  beforeEach(async () => {
    mockWorkService = {
      list: jasmine.createSpy('list').and.returnValue(of(mockPage)),
    };

    await TestBed.configureTestingModule({
      imports: [
        MatPaginatorModule,
        MatCardModule,
        MatInputModule,
        MatToolbarModule,
        WorkCardListComponent,
        HttpClientTestingModule
      ],
      providers: [
        { provide: WorkService, useValue: mockWorkService },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(WorkCardListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create the component', () => {
    expect(component).toBeTruthy();
  });

  it('should load works on initialization', () => {
    component.ngOnInit();

    expect(mockWorkService.list).toHaveBeenCalledWith(0, 10, '');
    expect(component.dataSource).toEqual(mockWorks);
    expect(component.totalElements).toBe(mockWorks.length);
  });

  it('should update pageIndex and pageSize on page change', () => {
    const pageEvent = { pageIndex: 1, pageSize: 5 };
    component.onPageChange(pageEvent);

    expect(component.pageIndex).toBe(1);
    expect(component.pageSize).toBe(5);
    expect(mockWorkService.list).toHaveBeenCalledWith(1, 5, '');
  });

  it('should filter works based on search query', () => {
    const event = { target: { value: 'Work A' } } as unknown as Event;
    component.onSearchChange(event);

    expect(component.searchQuery).toBe('Work A');
    expect(component.pageIndex).toBe(0);
    expect(mockWorkService.list).toHaveBeenCalledWith(0, 10, 'Work A');
  });

  it('should toggle work selection', () => {
    const work = mockWorks[0];

    component.toggleWorkSelection(work);
    expect(component.selectedWorks).toContain(work);

    component.toggleWorkSelection(work);
    expect(component.selectedWorks).not.toContain(work);
  });

  it('should emit selected works when toggled', () => {
    spyOn(component.selectedWorksChange, 'emit');
    const work = mockWorks[0];

    component.toggleWorkSelection(work);

    expect(component.selectedWorksChange.emit).toHaveBeenCalledWith([work]);
  });

  it('should check if a work is selected', () => {
    const work = mockWorks[0];

    component.toggleWorkSelection(work);
    expect(component.isSelected(work)).toBeTrue();

    component.toggleWorkSelection(work);
    expect(component.isSelected(work)).toBeFalse();
  });

  it('should render the correct number of work cards', () => {
    const cards = fixture.nativeElement.querySelectorAll('.card-item');
    expect(cards.length).toBe(mockWorks.length);
  });

  it('should display work details in cards', () => {
    const firstCard = fixture.nativeElement.querySelectorAll('.card-item')[0];
    expect(firstCard.textContent).toContain('Work A');
    expect(firstCard.textContent).toContain('R$500,00');
    expect(firstCard.textContent).toContain('1');
  });

  it('should handle empty work list gracefully', () => {
    mockWorkService.list.and.returnValue(of({ content: [], totalElements: 0 }));
    component.loadData();

    expect(component.dataSource.length).toBe(0);
    expect(component.totalElements).toBe(0);
  });
});

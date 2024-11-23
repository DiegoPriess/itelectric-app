import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MaterialCardListComponent } from './material-card-list.component';
import { MaterialService } from '../../../core/services/material.service';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatCardModule } from '@angular/material/card';
import { MatInputModule } from '@angular/material/input';
import { IMaterial } from '../../../core/models/Material';
import { Page } from '../../../core/interfaces/Page';
import { of } from 'rxjs';
import { By } from '@angular/platform-browser';
import { HttpClientTestingModule } from '@angular/common/http/testing';

describe('MaterialCardListComponent', () => {
  let component: MaterialCardListComponent;
  let fixture: ComponentFixture<MaterialCardListComponent>;
  let mockMaterialService: any;

  const mockMaterials: IMaterial[] = [
    {
      id: 1,
      name: 'Material A',
      price: 50,
      unitMeasure: { name: 'KG', label: 'Quilogramas' },
      quantityUnitMeasure: 10,
    },
    {
      id: 2,
      name: 'Material B',
      price: 100,
      unitMeasure: { name: 'KG', label: 'Quilogramas' },
      quantityUnitMeasure: 5,
    },
  ];

  beforeEach(async () => {
    mockMaterialService = {
      list: jasmine.createSpy('list').and.returnValue(
        of({
          content: mockMaterials,
          totalElements: mockMaterials.length,
        } as Page<IMaterial>)
      ),
    };

    await TestBed.configureTestingModule({
      imports: [
        MatPaginatorModule,
        MatToolbarModule,
        MatCardModule,
        MatInputModule,
        MaterialCardListComponent,
        HttpClientTestingModule
      ],
      providers: [{ provide: MaterialService, useValue: mockMaterialService }],
    }).compileComponents();

    fixture = TestBed.createComponent(MaterialCardListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create the component', () => {
    expect(component).toBeTruthy();
  });

  it('should load materials on initialization', () => {
    component.ngOnInit();

    expect(mockMaterialService.list).toHaveBeenCalledWith(0, 10, '');
    expect(component.dataSource.length).toBe(2);
    expect(component.totalElements).toBe(2);
  });

  it('should update pageIndex and pageSize on page change', () => {
    const pageEvent = { pageIndex: 1, pageSize: 5 };
    component.onPageChange(pageEvent);

    expect(component.pageIndex).toBe(1);
    expect(component.pageSize).toBe(5);
    expect(mockMaterialService.list).toHaveBeenCalledWith(1, 5, '');
  });

  it('should filter materials based on search query', () => {
    const event = { target: { value: 'Material A' } } as unknown as Event;
    component.onSearchChange(event);

    expect(component.searchQuery).toBe('Material A');
    expect(mockMaterialService.list).toHaveBeenCalledWith(0, 10, 'Material A');
  });

  it('should toggle material selection', () => {
    const material = mockMaterials[0];

    expect(component.isSelected(material)).toBeFalse();

    component.toggleMaterialSelection(material);
    expect(component.isSelected(material)).toBeTrue();
    expect(component.selectedMaterials.length).toBe(1);

    component.toggleMaterialSelection(material);
    expect(component.isSelected(material)).toBeFalse();
    expect(component.selectedMaterials.length).toBe(0);
  });

  it('should emit selected materials on selection change', () => {
    spyOn(component.selectedMaterialsChange, 'emit');

    const material = mockMaterials[0];
    component.toggleMaterialSelection(material);

    expect(component.selectedMaterialsChange.emit).toHaveBeenCalledWith([material]);
  });

  it('should render the correct number of material cards', () => {
    const cards = fixture.debugElement.queryAll(By.css('.card-item'));
    expect(cards.length).toBe(mockMaterials.length);
  });

  it('should highlight selected material cards', () => {
    const material = mockMaterials[0];
    component.toggleMaterialSelection(material);
    fixture.detectChanges();

    const selectedCard = fixture.debugElement.query(By.css('.card-item.selected'));
    expect(selectedCard).toBeTruthy();
    expect(selectedCard.nativeElement.textContent).toContain(material.name);
  });
});

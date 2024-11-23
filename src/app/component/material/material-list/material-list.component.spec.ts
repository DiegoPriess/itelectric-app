import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MaterialListComponent } from './material-list.component';
import { MaterialService } from '../../../core/services/material.service';
import { UtilsService } from '../../../core/utils/utils.service';
import { Router } from '@angular/router';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatTableModule } from '@angular/material/table';
import { MatInputModule } from '@angular/material/input';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatIconModule } from '@angular/material/icon';
import { of } from 'rxjs';
import { IMaterial } from '../../../core/models/Material';
import { Page } from '../../../core/interfaces/Page';
import { HttpClientTestingModule } from '@angular/common/http/testing';

describe('MaterialListComponent', () => {
  let component: MaterialListComponent;
  let fixture: ComponentFixture<MaterialListComponent>;
  let mockMaterialService: any;
  let mockUtilsService: any;
  let mockRouter: any;

  const mockMaterials: IMaterial[] = [
    {
      id: 1,
      name: 'Material A',
      price: 50,
      quantityUnitMeasure: 10,
      unitMeasure: { name: 'KG', label: 'Quilograma' },
    },
    {
      id: 2,
      name: 'Material B',
      price: 100,
      quantityUnitMeasure: 5,
      unitMeasure: { name: 'METER', label: 'Metros' },
    },
  ];

  const mockPage: Page<IMaterial> = {
    content: mockMaterials,
    totalElements: mockMaterials.length,
    totalPages: 0,
    number: 0,
    size: 0
  };

  beforeEach(async () => {
    mockMaterialService = {
      list: jasmine.createSpy('list').and.returnValue(of(mockPage)),
      delete: jasmine.createSpy('delete').and.returnValue(of({})),
    };

    mockUtilsService = {
      showSuccessMessage: jasmine.createSpy('showSuccessMessage'),
    };

    mockRouter = {
      navigate: jasmine.createSpy('navigate'),
    };

    await TestBed.configureTestingModule({
      imports: [
        MatPaginatorModule,
        MatTableModule,
        MatInputModule,
        MatToolbarModule,
        MatIconModule,
        MaterialListComponent,
        HttpClientTestingModule
      ],
      providers: [
        { provide: MaterialService, useValue: mockMaterialService },
        { provide: UtilsService, useValue: mockUtilsService },
        { provide: Router, useValue: mockRouter },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(MaterialListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create the component', () => {
    expect(component).toBeTruthy();
  });

  it('should load materials on initialization', () => {
    component.ngOnInit();

    expect(mockMaterialService.list).toHaveBeenCalledWith(0, 10, '');
    expect(component.dataSource.data).toEqual(mockMaterials);
    expect(component.totalElements).toBe(mockMaterials.length);
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
    expect(component.pageIndex).toBe(0);
    expect(mockMaterialService.list).toHaveBeenCalledWith(0, 10, 'Material A');
  });

  it('should delete a material and reload the list', () => {
    component.delete(1);

    expect(mockMaterialService.delete).toHaveBeenCalledWith(1);
    expect(mockMaterialService.list).toHaveBeenCalledTimes(2);
    expect(mockUtilsService.showSuccessMessage).toHaveBeenCalledWith('Material removido com sucesso!');
  });

  it('should navigate to create material page on add button click', () => {
    component.onCreate();

    expect(mockRouter.navigate).toHaveBeenCalledWith(['/menu/materiais/criar']);
  });

  it('should navigate to edit material page on edit button click', () => {
    component.onEdit(1);

    expect(mockRouter.navigate).toHaveBeenCalledWith(['/menu/materiais/editar', 1]);
  });

  it('should navigate to view material page on view button click', () => {
    component.onView(1);

    expect(mockRouter.navigate).toHaveBeenCalledWith(['/menu/materiais/visualizar', 1]);
  });

  it('should render the correct number of rows', () => {
    const rows = fixture.nativeElement.querySelectorAll('tr.mat-row');
    expect(rows.length).toBe(mockMaterials.length);
  });

  it('should display material details correctly in rows', () => {
    const firstRow = fixture.nativeElement.querySelectorAll('tr.mat-row')[0];
    expect(firstRow.textContent).toContain('Material A');
    expect(firstRow.textContent).toContain('50');
    expect(firstRow.textContent).toContain('10 Kilogram');
  });
});

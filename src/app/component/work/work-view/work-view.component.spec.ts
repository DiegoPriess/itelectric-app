import { ComponentFixture, TestBed } from '@angular/core/testing';
import { WorkViewComponent } from './work-view.component';
import { WorkService } from '../../../core/services/work.service';
import { Router } from '@angular/router';
import { of } from 'rxjs';
import { ReactiveFormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatIconModule } from '@angular/material/icon';
import { MatCardModule } from '@angular/material/card';
import { IMaterial } from '../../../core/models/Material';
import { HttpClientTestingModule } from '@angular/common/http/testing';

describe('WorkViewComponent', () => {
  let component: WorkViewComponent;
  let fixture: ComponentFixture<WorkViewComponent>;
  let mockWorkService: any;
  let mockRouter: any;

  const mockWork = {
    id: 1,
    name: 'Test Work',
    price: 500,
    materialList: [
      { id: 1, name: 'Material 1', price: 50, quantityUnitMeasure: 10, unitMeasure: { name: 'KG', label: 'Quilograma' } },
      { id: 2, name: 'Material 2', price: 75, quantityUnitMeasure: 5, unitMeasure: { name: 'KG', label: 'Quilograma' } },
      { id: 3, name: 'Material 3', price: 100, quantityUnitMeasure: 2, unitMeasure: { name: 'KG', label: 'Quilograma' } },
    ],
  };

  beforeEach(async () => {
    mockWorkService = {
      get: jasmine.createSpy('get').and.returnValue(of(mockWork)),
    };

    mockRouter = {
      navigateByUrl: jasmine.createSpy('navigateByUrl'),
    };

    await TestBed.configureTestingModule({
      imports: [
        WorkViewComponent,
        ReactiveFormsModule,
        MatFormFieldModule,
        MatInputModule,
        MatIconModule,
        MatCardModule,
        HttpClientTestingModule
      ],
      providers: [
        { provide: WorkService, useValue: mockWorkService },
        { provide: Router, useValue: mockRouter },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(WorkViewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create the component', () => {
    expect(component).toBeTruthy();
  });

  it('should load work data on initialization', () => {
    component.ngOnInit();

    expect(mockWorkService.get).toHaveBeenCalledWith(component.workId);
    expect(component.form.value.name).toBe(mockWork.name);
    expect(component.form.value.price).toBe(mockWork.price);
    expect(component.selectedMaterials.length).toBe(3);
    expect(component.selectedMaterials).toEqual(mockWork.materialList);
  });

  it('should patch form and materials on work load', () => {
    component.loadWorkData();

    expect(component.form.value.id).toBe(mockWork.id);
    expect(component.form.value.name).toBe(mockWork.name);
    expect(component.form.value.price).toBe(mockWork.price);
    expect(component.selectedMaterials).toEqual(mockWork.materialList);

    expect(component.selectedMaterials[0].name).toBe('Material 1');
    expect(component.selectedMaterials[0].price).toBe(50);
    expect(component.selectedMaterials[0].quantityUnitMeasure).toBe(10);

    expect(component.selectedMaterials[1].name).toBe('Material 2');
    expect(component.selectedMaterials[1].price).toBe(75);
    expect(component.selectedMaterials[1].quantityUnitMeasure).toBe(5);

    expect(component.selectedMaterials[2].name).toBe('Material 3');
    expect(component.selectedMaterials[2].price).toBe(100);
    expect(component.selectedMaterials[2].quantityUnitMeasure).toBe(2);
  });

  it('should navigate back when back button is clicked', () => {
    component.back();

    expect(mockRouter.navigateByUrl).toHaveBeenCalledWith('/menu/trabalhos');
  });

  it('should handle empty material list gracefully', () => {
    mockWorkService.get.and.returnValue(
      of({ id: 2, name: 'Work with no materials', price: 100, materialList: [] })
    );

    component.loadWorkData();

    expect(component.selectedMaterials.length).toBe(0);
    expect(component.form.value.name).toBe('Work with no materials');
  });

  it('should correctly extract work ID from URL', () => {
    const mockRoute = {
      snapshot: { paramMap: { get: jasmine.createSpy('get').and.returnValue('5') } },
    };

    component = new WorkViewComponent(
      component['fb'],
      component['workService'],
      component['router'],
      mockRoute as any
    );

    const id = component.getIdFromUrl();
    expect(id).toBe(5);
    expect(mockRoute.snapshot.paramMap.get).toHaveBeenCalledWith('id');
  });
});

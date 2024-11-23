import { ComponentFixture, TestBed } from '@angular/core/testing';
import { WorkCreateComponent } from './work-create.component';
import { WorkService } from '../../../core/services/work.service';
import { UtilsService } from '../../../core/utils/utils.service';
import { ReactiveFormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MaterialCardListComponent } from '../../material/material-card-list/material-card-list.component';
import { Router } from '@angular/router';
import { of } from 'rxjs';
import { IMaterial } from '../../../core/models/Material';
import { HttpClientTestingModule } from '@angular/common/http/testing';

describe('WorkCreateComponent', () => {
  let component: WorkCreateComponent;
  let fixture: ComponentFixture<WorkCreateComponent>;
  let mockWorkService: any;
  let mockUtilsService: any;
  let mockRouter: any;

  const mockMaterials: IMaterial[] = [
    { id: 1, name: 'Material A', price: 50, quantityUnitMeasure: 5, unitMeasure: { name: 'KG', label: 'Quilograma' } },
    { id: 2, name: 'Material B', price: 100, quantityUnitMeasure: 10, unitMeasure: { name: 'METER', label: 'Metros' } },
  ];

  beforeEach(async () => {
    mockWorkService = {
      add: jasmine.createSpy('add').and.returnValue(of({})),
    };

    mockUtilsService = {
      showSuccessMessage: jasmine.createSpy('showSuccessMessage'),
    };

    mockRouter = {
      navigateByUrl: jasmine.createSpy('navigateByUrl'),
    };

    await TestBed.configureTestingModule({
      imports: [
        ReactiveFormsModule,
        MatFormFieldModule,
        MatInputModule,
        MatButtonModule,
        MatCardModule,
        MatIconModule,
        MaterialCardListComponent,
        WorkCreateComponent,
        HttpClientTestingModule
      ],
      providers: [
        { provide: WorkService, useValue: mockWorkService },
        { provide: UtilsService, useValue: mockUtilsService },
        { provide: Router, useValue: mockRouter },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(WorkCreateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create the component', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize the form', () => {
    expect(component.form).toBeTruthy();
    expect(component.form.controls['name']).toBeDefined();
    expect(component.form.controls['price']).toBeDefined();
  });

  it('should update selected materials on selection change', () => {
    component.onSelectedMaterialsChange(mockMaterials);

    expect(component.selectedMaterials).toEqual(mockMaterials);
    expect(component.selectedMaterialIds).toEqual([1, 2]);
  });

  it('should submit valid work data', () => {
    component.form.setValue({
      name: 'New Work',
      price: '500',
    });
    component.selectedMaterialIds = [1, 2];

    component.onSubmit();

    expect(mockWorkService.add).toHaveBeenCalledWith({
      name: 'New Work',
      price: '500',
      materialIdList: [1, 2],
    });
    expect(mockRouter.navigateByUrl).toHaveBeenCalledWith('/menu/trabalhos');
    expect(mockUtilsService.showSuccessMessage).toHaveBeenCalledWith('Trabalho adicionado com sucesso!');
  });

  it('should navigate back to the work list on back button click', () => {
    component.back();
    expect(mockRouter.navigateByUrl).toHaveBeenCalledWith('/menu/trabalhos');
  });

  it('should disable submit button for invalid form', () => {
    const button = fixture.nativeElement.querySelector('button[type="submit"]');
    expect(button.disabled).toBeTrue();

    component.form.setValue({
      name: 'Valid Work',
      price: '100',
    });
    fixture.detectChanges();

    expect(button.disabled).toBeFalse();
  });

  it('should render selected materials', () => {
    component.selectedMaterials = mockMaterials;
    fixture.detectChanges();

    const selectedMaterialCards = fixture.nativeElement.querySelectorAll('.selected-materials-box mat-card');
    expect(selectedMaterialCards.length).toBe(2);
    expect(selectedMaterialCards[0].textContent).toContain('Material A');
    expect(selectedMaterialCards[1].textContent).toContain('Material B');
  });
});

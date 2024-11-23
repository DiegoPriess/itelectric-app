import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MaterialEditComponent } from './material-edit.component';
import { EnumService } from '../../../core/services/enum.service';
import { MaterialService } from '../../../core/services/material.service';
import { UtilsService } from '../../../core/utils/utils.service';
import { Router, ActivatedRoute } from '@angular/router';
import { ReactiveFormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { of } from 'rxjs';
import { IEnum } from '../../../core/interfaces/Enum';
import { IMaterial } from '../../../core/models/Material';
import { HttpClientTestingModule } from '@angular/common/http/testing';

describe('MaterialEditComponent', () => {
  let component: MaterialEditComponent;
  let fixture: ComponentFixture<MaterialEditComponent>;
  let mockEnumService: any;
  let mockMaterialService: any;
  let mockUtilsService: any;
  let mockRouter: any;
  let mockActivatedRoute: any;

  const mockUnitOfMeasureList: IEnum[] = [
    { name: 'KG', label: 'Quilograma' },
    { name: 'METER', label: 'Metros' },
  ];

  const mockMaterial: IMaterial = {
    id: 1,
    name: 'Material A',
    price: 50,
    quantityUnitMeasure: 10,
    unitMeasure: { name: 'KG', label: 'Quilograma' },
  };

  beforeEach(async () => {
    mockEnumService = {
      listUnitOfMeasure: jasmine.createSpy('listUnitOfMeasure').and.returnValue(of(mockUnitOfMeasureList)),
    };

    mockMaterialService = {
      get: jasmine.createSpy('get').and.returnValue(of(mockMaterial)),
      edit: jasmine.createSpy('edit').and.returnValue(of({})),
    };

    mockUtilsService = {
      showSuccessMessage: jasmine.createSpy('showSuccessMessage'),
    };

    mockRouter = {
      navigateByUrl: jasmine.createSpy('navigateByUrl'),
    };

    mockActivatedRoute = {
      snapshot: { paramMap: { get: jasmine.createSpy('get').and.returnValue('1') } },
    };

    await TestBed.configureTestingModule({
      imports: [
        ReactiveFormsModule,
        MatFormFieldModule,
        MatInputModule,
        MatSelectModule,
        MatButtonModule,
        MatIconModule,
        MaterialEditComponent,
        HttpClientTestingModule
      ],
      providers: [
        { provide: EnumService, useValue: mockEnumService },
        { provide: MaterialService, useValue: mockMaterialService },
        { provide: UtilsService, useValue: mockUtilsService },
        { provide: Router, useValue: mockRouter },
        { provide: ActivatedRoute, useValue: mockActivatedRoute },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(MaterialEditComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create the component', () => {
    expect(component).toBeTruthy();
  });

  it('should load unit of measure list and material data on initialization', () => {
    component.ngOnInit();

    expect(mockEnumService.listUnitOfMeasure).toHaveBeenCalled();
    expect(component.unitOfMeasureList).toEqual(mockUnitOfMeasureList);
    expect(mockMaterialService.get).toHaveBeenCalledWith(1);

    expect(component.form.value.name).toBe(mockMaterial.name);
    expect(component.form.value.price).toBe(mockMaterial.price);
    expect(component.form.value.quantityUnitMeasure).toBe(mockMaterial.quantityUnitMeasure);
    expect(component.form.value.unitMeasure).toEqual(mockUnitOfMeasureList[0]);
  });

  it('should disable the submit button when the form is invalid', () => {
    component.form.patchValue({
      name: '',
      price: '',
      quantityUnitMeasure: '',
      unitMeasure: '',
    });

    fixture.detectChanges();

    const submitButton = fixture.nativeElement.querySelector('button[type="submit"]');
    expect(submitButton.disabled).toBeTrue();
  });

  it('should enable the submit button when the form is valid', () => {
    component.form.patchValue({
      name: 'Material Test',
      price: '100',
      quantityUnitMeasure: '10',
      unitMeasure: mockUnitOfMeasureList[0],
    });

    fixture.detectChanges();

    const submitButton = fixture.nativeElement.querySelector('button[type="submit"]');
    expect(submitButton.disabled).toBeFalse();
  });

  it('should submit the form and navigate back on success', () => {
    component.form.patchValue({
      id: 1,
      name: 'Updated Material',
      price: '100',
      quantityUnitMeasure: '20',
      unitMeasure: mockUnitOfMeasureList[1],
    });

    component.onSubmit();

    expect(mockMaterialService.edit).toHaveBeenCalledWith({
      id: 1,
      name: 'Updated Material',
      price: '100',
      quantityUnitMeasure: '20',
      unitMeasure: mockUnitOfMeasureList[1],
    });
    expect(mockRouter.navigateByUrl).toHaveBeenCalledWith('/menu/materiais');
    expect(mockUtilsService.showSuccessMessage).toHaveBeenCalledWith('Material alterado com sucesso!');
  });

  it('should navigate back on back button click', () => {
    component.back();

    expect(mockRouter.navigateByUrl).toHaveBeenCalledWith('/menu/materiais');
  });

  it('should compare units correctly', () => {
    const result = component.compareUnits(mockUnitOfMeasureList[0], { name: 'KG', label: 'Quilograma' });
    expect(result).toBeTrue();

    const resultFalse = component.compareUnits(mockUnitOfMeasureList[0], { name: 'M', label: 'Metros' });
    expect(resultFalse).toBeFalse();
  });

  it('should handle missing material data gracefully', () => {
    mockMaterialService.get.and.returnValue(of(null));
    component.loadMaterialData();

    expect(component.form.value.name).toBe('');
    expect(component.form.value.price).toBe('');
    expect(component.form.value.quantityUnitMeasure).toBe('');
    expect(component.form.value.unitMeasure).toBe('');
  });
});

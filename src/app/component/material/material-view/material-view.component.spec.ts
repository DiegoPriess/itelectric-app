import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MaterialViewComponent } from './material-view.component';
import { MaterialService } from '../../../core/services/material.service';
import { EnumService } from '../../../core/services/enum.service';
import { Router, ActivatedRoute } from '@angular/router';
import { ReactiveFormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatIconModule } from '@angular/material/icon';
import { of } from 'rxjs';
import { IMaterial } from '../../../core/models/Material';
import { IEnum } from '../../../core/interfaces/Enum';
import { HttpClientTestingModule } from '@angular/common/http/testing';

describe('MaterialViewComponent', () => {
  let component: MaterialViewComponent;
  let fixture: ComponentFixture<MaterialViewComponent>;
  let mockMaterialService: any;
  let mockEnumService: any;
  let mockRouter: any;
  let mockActivatedRoute: any;

  const mockMaterial: IMaterial = {
    id: 1,
    name: 'Material A',
    price: 100,
    quantityUnitMeasure: 10,
    unitMeasure: { name: 'KG', label: 'Quilograma' },
  };

  const mockUnitOfMeasureList: IEnum[] = [
    { name: 'KG', label: 'Quilograma' },
    { name: 'METER', label: 'Metros' },
  ];

  beforeEach(async () => {
    mockMaterialService = {
      get: jasmine.createSpy('get').and.returnValue(of(mockMaterial)),
    };

    mockEnumService = {
      listUnitOfMeasure: jasmine.createSpy('listUnitOfMeasure').and.returnValue(of(mockUnitOfMeasureList)),
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
        MatIconModule,
        MaterialViewComponent,
        HttpClientTestingModule
      ],
      providers: [
        { provide: MaterialService, useValue: mockMaterialService },
        { provide: EnumService, useValue: mockEnumService },
        { provide: Router, useValue: mockRouter },
        { provide: ActivatedRoute, useValue: mockActivatedRoute },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(MaterialViewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create the component', () => {
    expect(component).toBeTruthy();
  });

  it('should load unit of measure list on initialization', () => {
    component.ngOnInit();

    expect(mockEnumService.listUnitOfMeasure).toHaveBeenCalled();
    expect(component.unitOfMeasureList).toEqual(mockUnitOfMeasureList);
  });

  it('should load material data on initialization', () => {
    component.ngOnInit();

    expect(mockMaterialService.get).toHaveBeenCalledWith(1);
    expect(component.form.value.name).toBe(mockMaterial.name);
    expect(component.form.value.price).toBe(mockMaterial.price);
    expect(component.form.value.quantityUnitMeasure).toBe(mockMaterial.quantityUnitMeasure);
    expect(component.form.value.unitMeasure).toBe(mockMaterial.unitMeasure.label);
  });

  it('should navigate back on back button click', () => {
    component.back();

    expect(mockRouter.navigateByUrl).toHaveBeenCalledWith('/menu/materiais');
  });

  it('should handle missing material data gracefully', () => {
    mockMaterialService.get.and.returnValue(of(null));
    component.ngOnInit();

    expect(component.form.value.name).toBe('');
    expect(component.form.value.price).toBe('');
    expect(component.form.value.quantityUnitMeasure).toBe('');
    expect(component.form.value.unitMeasure).toBe('');
  });

  it('should display form fields as readonly', () => {
    const inputs = fixture.nativeElement.querySelectorAll('input[readonly]');
    expect(inputs.length).toBe(4);
  });

  it('should handle missing unit of measure list gracefully', () => {
    mockEnumService.listUnitOfMeasure.and.returnValue(of([]));
    component.ngOnInit();

    expect(component.unitOfMeasureList.length).toBe(0);
  });

  it('should display material details correctly in the form', () => {
    component.ngOnInit();
    fixture.detectChanges();

    const nameInput = fixture.nativeElement.querySelector('input[formControlName="name"]');
    const priceInput = fixture.nativeElement.querySelector('input[formControlName="price"]');
    const quantityInput = fixture.nativeElement.querySelector('input[formControlName="quantityUnitMeasure"]');
    const unitMeasureInput = fixture.nativeElement.querySelector('input[formControlName="unitMeasure"]');

    expect(nameInput.value).toBe(mockMaterial.name);
    expect(priceInput.value).toBe(mockMaterial.price.toString());
    expect(quantityInput.value).toBe(mockMaterial.quantityUnitMeasure.toString());
    expect(unitMeasureInput.value).toBe(mockMaterial.unitMeasure.label);
  });
});

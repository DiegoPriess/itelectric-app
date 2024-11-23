import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MaterialCreateComponent } from './material-create.component';
import { EnumService } from '../../../core/services/enum.service';
import { MaterialService } from '../../../core/services/material.service';
import { UtilsService } from '../../../core/utils/utils.service';
import { Router } from '@angular/router';
import { ReactiveFormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { of } from 'rxjs';
import { IEnum } from '../../../core/interfaces/Enum';
import { HttpClientTestingModule } from '@angular/common/http/testing';

describe('MaterialCreateComponent', () => {
  let component: MaterialCreateComponent;
  let fixture: ComponentFixture<MaterialCreateComponent>;
  let mockEnumService: any;
  let mockMaterialService: any;
  let mockUtilsService: any;
  let mockRouter: any;

  const mockUnitOfMeasureList: IEnum[] = [
    { name: 'KG', label: 'Quilogram' },
    { name: 'METERS', label: 'Metros' },
  ];

  beforeEach(async () => {
    mockEnumService = {
      listUnitOfMeasure: jasmine.createSpy('listUnitOfMeasure').and.returnValue(of(mockUnitOfMeasureList)),
    };

    mockMaterialService = {
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
        MatSelectModule,
        MatButtonModule,
        MatIconModule,
        MaterialCreateComponent,
        HttpClientTestingModule
      ],
      providers: [
        { provide: EnumService, useValue: mockEnumService },
        { provide: MaterialService, useValue: mockMaterialService },
        { provide: UtilsService, useValue: mockUtilsService },
        { provide: Router, useValue: mockRouter },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(MaterialCreateComponent);
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
      unitMeasure: 'kg',
    });

    fixture.detectChanges();

    const submitButton = fixture.nativeElement.querySelector('button[type="submit"]');
    expect(submitButton.disabled).toBeFalse();
  });

  it('should submit the form and navigate back on success', () => {
    component.form.patchValue({
      name: 'Material Test',
      price: '100',
      quantityUnitMeasure: '10',
      unitMeasure: 'kg',
    });

    component.onSubmit();

    expect(mockMaterialService.add).toHaveBeenCalledWith({
      name: 'Material Test',
      price: '100',
      quantityUnitMeasure: '10',
      unitMeasure: 'kg',
    });
    expect(mockRouter.navigateByUrl).toHaveBeenCalledWith('/menu/materiais');
    expect(mockUtilsService.showSuccessMessage).toHaveBeenCalledWith('Material adicionado com sucesso!');
  });

  it('should navigate back on back button click', () => {
    component.back();

    expect(mockRouter.navigateByUrl).toHaveBeenCalledWith('/menu/materiais');
  });

  it('should handle empty unit of measure list gracefully', () => {
    mockEnumService.listUnitOfMeasure.and.returnValue(of([]));
    component.ngOnInit();

    expect(component.unitOfMeasureList.length).toBe(0);
  });
});

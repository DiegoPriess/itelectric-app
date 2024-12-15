import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { of } from 'rxjs';
import { BsModalRef } from 'ngx-bootstrap/modal';

import { BudgetFormComponent } from './budget-form.component';
import { BudgetService } from '../../../core/services/budget.service';
import { UtilsService } from '../../../core/utils/utils.service';
import { WorkService } from '../../../core/services/work.service';
import { MaterialService } from '../../../core/services/material.service';

describe('BudgetFormComponent', () => {
  let component: BudgetFormComponent;
  let fixture: ComponentFixture<BudgetFormComponent>;
  let mockBudgetService: any;
  let mockUtilsService: any;
  let mockWorkService: any;
  let mockMaterialService: any;

  beforeEach(async () => {
    mockBudgetService = {
      add: jest.fn().mockReturnValue(of(null)),
      edit: jest.fn().mockReturnValue(of(null)),
    };

    mockUtilsService = {
      showSuccessMessage: jest.fn(),
      showErrorMessage: jest.fn(),
      getHeader: jest.fn().mockReturnValue({ 'Content-Type': 'application/json' }),
    };

    mockWorkService = {
      list: jest.fn().mockReturnValue(of({ content: [], totalElements: 0 })),
    };

    mockMaterialService = {
      list: jest.fn().mockReturnValue(of({ content: [], totalElements: 0 })),
    };

    await TestBed.configureTestingModule({
      imports: [
        BudgetFormComponent,
        ReactiveFormsModule,
        NoopAnimationsModule,
        HttpClientTestingModule,
      ],
      providers: [
        { provide: BudgetService, useValue: mockBudgetService },
        { provide: UtilsService, useValue: mockUtilsService },
        { provide: WorkService, useValue: mockWorkService },
        { provide: MaterialService, useValue: mockMaterialService },
        { provide: BsModalRef, useValue: { hide: jest.fn() } },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(BudgetFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create the component', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize the form with default values', () => {
    const form = component.form;
    expect(form).toBeDefined();
    expect(form.get('deliveryForecast')?.value).toBeNull();
    expect(form.get('customerEmail')?.value).toBeNull();
    if (component.mode === 'create') {
      expect(form.get('confirmEmail')?.value).toBeNull();
    }
  });

  it('should disable the form in view mode', () => {
    component.mode = 'view';
    component.ngOnInit();
    fixture.detectChanges();
    expect(component.form.disabled).toBeTruthy();
  });

  it('should validate email match in create mode', () => {
    component.mode = 'create';
    component.ngOnInit();
    const form = component.form;
    form.patchValue({
      customerEmail: 'email@example.com',
      confirmEmail: 'other@example.com',
    });
    expect(form.hasError('emailMismatch')).toBeTruthy();
  });

  it('should call add method on submit in create mode', () => {
    component.mode = 'create';
    component.form.patchValue({
      deliveryForecast: '2024-12-31',
      customerEmail: 'email@example.com',
      confirmEmail: 'email@example.com',
    });
    component.selectedWorkIds = [1, 2];

    component.onSubmit();

    expect(mockBudgetService.add).toHaveBeenCalledWith({
      deliveryForecast: '2024-12-31',
      customerEmail: 'email@example.com',
      workIdList: [1, 2],
    });
    expect(mockUtilsService.showSuccessMessage).toHaveBeenCalledWith(
      'Orçamento criado com sucesso!'
    );
  });

  it('should close the modal on closeModal call', () => {
    const bsModalRef = TestBed.inject(BsModalRef);
    component.closeModal();
    expect(bsModalRef.hide).toHaveBeenCalled();
  });

  it('should validate minDate correctly', () => {
    const form = component.form;
    const deliveryForecastControl = form.get('deliveryForecast');
    deliveryForecastControl?.setValue('2000-01-01');
    expect(deliveryForecastControl?.hasError('minDate')).toBeTruthy();
  });
});

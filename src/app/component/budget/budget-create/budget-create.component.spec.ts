import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { provideRouter } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatIconModule } from '@angular/material/icon';
import { MatCardModule } from '@angular/material/card';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { of } from 'rxjs';

import { BudgetCreateComponent } from './budget-create.component';
import { BudgetService } from '../../../core/services/budget.service';
import { UtilsService } from '../../../core/utils/utils.service';
import { MatNativeDateModule } from '@angular/material/core';
import { HttpClientTestingModule } from '@angular/common/http/testing';

describe('BudgetCreateComponent', () => {
  let component: BudgetCreateComponent;
  let fixture: ComponentFixture<BudgetCreateComponent>;
  let mockBudgetService: any;
  let mockUtilsService: any;

  beforeEach(async () => {
    mockBudgetService = {
      add: jasmine.createSpy('add').and.returnValue(of({})),
    };

    mockUtilsService = {
      showSuccessMessage: jasmine.createSpy('showSuccessMessage'),
    };

    await TestBed.configureTestingModule({
      imports: [
        ReactiveFormsModule,
        MatButtonModule,
        MatFormFieldModule,
        MatInputModule,
        MatIconModule,
        MatCardModule,
        MatDatepickerModule,
        MatNativeDateModule,
        BudgetCreateComponent,
        HttpClientTestingModule
      ],
      providers: [
        provideRouter([]),
        { provide: BudgetService, useValue: mockBudgetService },
        { provide: UtilsService, useValue: mockUtilsService },
      ],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(BudgetCreateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create the component', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize the form with expected fields', () => {
    const form = component.form;
    expect(form.contains('deliveryForecast')).toBeTrue();
    expect(form.contains('customerEmail')).toBeTrue();
  });

  it('should make required fields invalid when empty', () => {
    const form = component.form;
    const deliveryForecastControl = form.get('deliveryForecast');
    const customerEmailControl = form.get('customerEmail');

    deliveryForecastControl?.setValue('');
    customerEmailControl?.setValue('');

    expect(deliveryForecastControl?.valid).toBeFalse();
    expect(customerEmailControl?.valid).toBeFalse();
  });

  it('should validate the email format correctly', () => {
    const customerEmailControl = component.form.get('customerEmail');
    customerEmailControl?.setValue('invalid_email');
    expect(customerEmailControl?.valid).toBeFalse();

    customerEmailControl?.setValue('valid@email.com');
    expect(customerEmailControl?.valid).toBeTrue();
  });

  it('should call onSubmit with correct data', () => {
    const form = component.form;
    form.setValue({
      deliveryForecast: new Date(),
      customerEmail: 'client@test.com',
    });

    component.selectedWorksIds = [1, 2];
    component.onSubmit();

    expect(mockBudgetService.add).toHaveBeenCalledWith({
      deliveryForecast: form.value.deliveryForecast,
      customerEmail: form.value.customerEmail,
      workIdList: [1, 2],
    });
    expect(mockUtilsService.showSuccessMessage).toHaveBeenCalledWith(
      'Budget successfully added!'
    );
  });

  it('should navigate back to /menu/orcamentos when back is clicked', () => {
    const routerSpy = spyOn(component['router'], 'navigateByUrl');
    component.back();
    expect(routerSpy).toHaveBeenCalledWith('/menu/orcamentos');
  });
});

import { ComponentFixture, TestBed } from '@angular/core/testing';
import { BudgetViewComponent } from './budget-view.component';
import { BudgetService } from '../../../core/services/budget.service';
import { ActivatedRoute, Router } from '@angular/router';
import { ReactiveFormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatIconModule } from '@angular/material/icon';
import { MatCardModule } from '@angular/material/card';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { of } from 'rxjs';
import { IBudget } from '../../../core/models/Budget';
import { IWork } from '../../../core/models/Work';
import { MatNativeDateModule } from '@angular/material/core';
import { HttpClientTestingModule } from '@angular/common/http/testing';

describe('BudgetViewComponent', () => {
  let component: BudgetViewComponent;
  let fixture: ComponentFixture<BudgetViewComponent>;
  let mockBudgetService: any;
  let mockRouter: any;
  let mockActivatedRoute: any;

  const mockWorks: IWork[] = [
    { id: 1, name: 'Work 1', price: 100, materialList: [{id: 1, name: 'Material A', price: 50, unitMeasure: { name: 'KG', label: 'Quilogramas' }, quantityUnitMeasure: 10 }] },
    { id: 2, name: 'Work 2', price: 200, materialList: [{id: 1, name: 'Material A', price: 50, unitMeasure: { name: 'KG', label: 'Quilogramas' }, quantityUnitMeasure: 10 }] },
  ];

  const mockBudget: IBudget = {
    id: 1,
    deliveryForecast: [2024, 11, 20],
    customer: {
      id: 1,
      email: 'customer@example.com',
      name: 'Customer 1',
      dateCreated: new Date(),
      dateUpdated: new Date(),
    },
    totalValue: 1500,
    workList: mockWorks,
    status: { label: 'Pending', name: 'pending' },
  };

  beforeEach(async () => {
    mockBudgetService = {
      get: jasmine.createSpy('get').and.returnValue(of(mockBudget)),
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
        MatCardModule,
        MatDatepickerModule,
        MatNativeDateModule,
        BudgetViewComponent,
        HttpClientTestingModule
      ],
      providers: [
        { provide: BudgetService, useValue: mockBudgetService },
        { provide: Router, useValue: mockRouter },
        { provide: ActivatedRoute, useValue: mockActivatedRoute },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(BudgetViewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create the component', () => {
    expect(component).toBeTruthy();
  });

  it('should load budget data on initialization', () => {
    component.ngOnInit();

    expect(mockBudgetService.get).toHaveBeenCalledWith(1);
    expect(component.form.value.deliveryForecast).toEqual(new Date(2024, 10, 20));
    expect(component.form.value.customerEmail).toBe(mockBudget.customer.email);
    expect(component.form.value.totalValue).toBe(mockBudget.totalValue);
    expect(component.selectedWorks).toEqual(mockWorks);
  });

  it('should patch form and works on budget load', () => {
    component.loadBudgetData();

    expect(component.form.value.id).toBe(mockBudget.id);
    expect(component.form.value.customerEmail).toBe(mockBudget.customer.email);
    expect(component.form.value.totalValue).toBe(mockBudget.totalValue);
    expect(component.selectedWorks).toEqual(mockWorks);
  });

  it('should navigate back on back button click', () => {
    component.back();

    expect(mockRouter.navigateByUrl).toHaveBeenCalledWith('/menu/orcamentos');
  });

  it('should handle missing works gracefully', () => {
    mockBudgetService.get.and.returnValue(
      of({ ...mockBudget, workList: [] })
    );
    component.loadBudgetData();

    expect(component.selectedWorks.length).toBe(0);
  });

  it('should handle missing budget data gracefully', () => {
    mockBudgetService.get.and.returnValue(of(null));
    component.loadBudgetData();

    expect(component.form.value.deliveryForecast).toBe('');
    expect(component.form.value.customerEmail).toBeNull();
    expect(component.form.value.totalValue).toBe('');
    expect(component.selectedWorks.length).toBe(0);
  });
});

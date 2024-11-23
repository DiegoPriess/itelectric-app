import { ComponentFixture, TestBed } from '@angular/core/testing';
import { BudgetEditComponent } from './budget-edit.component';
import { BudgetService } from '../../../core/services/budget.service';
import { UtilsService } from '../../../core/utils/utils.service';
import { ActivatedRoute, Router } from '@angular/router';
import { ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatIconModule } from '@angular/material/icon';
import { MatCardModule } from '@angular/material/card';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { of } from 'rxjs';
import { IWork } from '../../../core/models/Work';
import { IBudget } from '../../../core/models/Budget';
import { IMaterial } from '../../../core/models/Material';
import { MatNativeDateModule } from '@angular/material/core';
import { HttpClientTestingModule } from '@angular/common/http/testing';

describe('BudgetEditComponent', () => {
  let component: BudgetEditComponent;
  let fixture: ComponentFixture<BudgetEditComponent>;
  let mockBudgetService: any;
  let mockUtilsService: any;
  let mockRouter: any;
  let mockActivatedRoute: any;

  const mockMaterials: IMaterial[] = [
    { id: 1, name: 'Material A', price: 50, unitMeasure: { name: 'KG', label: 'Quilogramas' }, quantityUnitMeasure: 10 },
    { id: 2, name: 'Material B', price: 100, unitMeasure: { name: 'METERS', label: 'Metros' }, quantityUnitMeasure: 5 },
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
    workList: [
      {
        id: 1,
        name: 'Work 1',
        price: 100,
        materialList: [
          { id: 1, name: 'Material A', price: 50, unitMeasure: { name: 'KG', label: 'Quilogramas' }, quantityUnitMeasure: 10 },
        ],
      },
      {
        id: 2,
        name: 'Work 2',
        price: 200,
        materialList: [
          { id: 2, name: 'Material B', price: 100, unitMeasure: { name: 'METERS', label: 'Metros' }, quantityUnitMeasure: 5 },
        ],
      },
    ],
    status: { label: 'Pending', name: 'pending' },
  };

  beforeEach(async () => {
    mockBudgetService = {
      get: jasmine.createSpy('get').and.returnValue(of(mockBudget)),
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
        MatButtonModule,
        MatFormFieldModule,
        MatInputModule,
        MatIconModule,
        MatCardModule,
        MatDatepickerModule,
        MatNativeDateModule,
        BudgetEditComponent,
        HttpClientTestingModule
      ],
      providers: [
        { provide: BudgetService, useValue: mockBudgetService },
        { provide: UtilsService, useValue: mockUtilsService },
        { provide: Router, useValue: mockRouter },
        { provide: ActivatedRoute, useValue: mockActivatedRoute },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(BudgetEditComponent);
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
    expect(component.selectedWorks.length).toBe(2);
    expect(component.selectedWorks[0].materialList.length).toBe(1);
    expect(component.selectedWorks[1].materialList.length).toBe(1);
  });

  it('should patch form and works on budget load', () => {
    component.loadBudgetData();

    expect(component.form.value.id).toBe(mockBudget.id);
    expect(component.form.value.customerEmail).toBe(mockBudget.customer.email);
    expect(component.selectedWorks).toEqual(mockBudget.workList);
  });

  it('should update selected works when changed', () => {
    const works: IWork[] = [
      { id: 3, name: 'Work 3', price: 300, materialList: [] },
    ];
    component.onSelectedWorksChange(works);

    expect(component.selectedWorks).toEqual(works);
    expect(component.selectedWorksIds).toEqual([3]);
  });

  it('should navigate back on back button click', () => {
    component.back();
    expect(mockRouter.navigateByUrl).toHaveBeenCalledWith('/menu/orcamentos');
  });

  it('should submit edited budget data', () => {
    component.form.patchValue({
      id: mockBudget.id,
      deliveryForecast: new Date(2024, 10, 25),
      customerEmail: 'updatedcustomer@example.com',
    });
    component.selectedWorksIds = [1, 2];

    component.onSubmit();

    expect(mockBudgetService.edit).toHaveBeenCalledWith(
      component.form.value,
      [1, 2]
    );
    expect(mockRouter.navigateByUrl).toHaveBeenCalledWith('/menu/orcamentos');
    expect(mockUtilsService.showSuccessMessage).toHaveBeenCalledWith(
      'Orçamento alterado com sucesso!'
    );
  });
});

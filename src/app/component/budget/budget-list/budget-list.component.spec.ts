import { ComponentFixture, TestBed } from '@angular/core/testing';
import { BudgetListComponent } from './budget-list.component';
import { BudgetService } from '../../../core/services/budget.service';
import { UtilsService } from '../../../core/utils/utils.service';
import { Router } from '@angular/router';
import { MatTableModule } from '@angular/material/table';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatIconModule } from '@angular/material/icon';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatInputModule } from '@angular/material/input';
import { of } from 'rxjs';
import { IBudget } from '../../../core/models/Budget';
import { Page } from '../../../core/interfaces/Page';
import { HttpClientTestingModule } from '@angular/common/http/testing';

describe('BudgetListComponent', () => {
  let component: BudgetListComponent;
  let fixture: ComponentFixture<BudgetListComponent>;
  let mockBudgetService: any;
  let mockUtilsService: any;
  let mockRouter: any;

  const mockBudgets: IBudget[] = [
    {
      id: 1,
      deliveryForecast: [2024, 11, 20],
      customer: {
        id: 1,
        email: 'customer1@example.com',
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
    },
    {
      id: 2,
      deliveryForecast: [2024, 12, 25],
      customer: {
        id: 2,
        email: 'customer2@example.com',
        name: 'Customer 2',
        dateCreated: new Date(),
        dateUpdated: new Date(),
      },
      totalValue: 2500,
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
      status: { label: 'Approved', name: 'approved' },
    },
  ];

  beforeEach(async () => {
    mockBudgetService = {
      list: jasmine.createSpy('list').and.returnValue(
        of({
          content: mockBudgets,
          totalElements: mockBudgets.length,
        } as Page<IBudget>)
      ),
      delete: jasmine.createSpy('delete').and.returnValue(of({})),
      approve: jasmine.createSpy('approve').and.returnValue(of({})),
      deny: jasmine.createSpy('deny').and.returnValue(of({})),
    };

    mockUtilsService = {
      showSuccessMessage: jasmine.createSpy('showSuccessMessage'),
    };

    mockRouter = {
      navigate: jasmine.createSpy('navigate'),
    };

    await TestBed.configureTestingModule({
      imports: [
        MatTableModule,
        MatPaginatorModule,
        MatIconModule,
        MatToolbarModule,
        MatInputModule,
        BudgetListComponent,
        HttpClientTestingModule
      ],
      providers: [
        { provide: BudgetService, useValue: mockBudgetService },
        { provide: UtilsService, useValue: mockUtilsService },
        { provide: Router, useValue: mockRouter },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(BudgetListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create the component', () => {
    expect(component).toBeTruthy();
  });

  it('should load budgets on initialization', () => {
    component.ngOnInit();

    expect(mockBudgetService.list).toHaveBeenCalledWith(0, 10, '');
    expect(component.dataSource.data.length).toBe(2);
    expect(component.totalElements).toBe(2);
  });

  it('should update data on page change', () => {
    const pageEvent = { pageIndex: 1, pageSize: 5 };
    component.onPageChange(pageEvent);

    expect(component.pageIndex).toBe(1);
    expect(component.pageSize).toBe(5);
    expect(mockBudgetService.list).toHaveBeenCalledWith(1, 5, '');
  });

  it('should search and reload data on search query change', () => {
    const event = { target: { value: 'customer1@example.com' } } as unknown as Event;
    component.onSearchChange(event);

    expect(component.searchQuery).toBe('customer1@example.com');
    expect(mockBudgetService.list).toHaveBeenCalledWith(0, 10, 'customer1@example.com');
  });

  it('should navigate to create page on "Add" button click', () => {
    component.onCreate();

    expect(mockRouter.navigate).toHaveBeenCalledWith(['/menu/orcamentos/criar']);
  });

  it('should navigate to edit page on "Edit" button click', () => {
    component.onEdit(1);

    expect(mockRouter.navigate).toHaveBeenCalledWith(['/menu/orcamentos/editar', 1]);
  });

  it('should navigate to view page on "View" button click', () => {
    component.onView(1);

    expect(mockRouter.navigate).toHaveBeenCalledWith(['/menu/orcamentos/visualizar', 1]);
  });

  it('should delete a budget and reload data', () => {
    component.delete(1);

    expect(mockBudgetService.delete).toHaveBeenCalledWith(1);
    expect(mockUtilsService.showSuccessMessage).toHaveBeenCalledWith('Orçamento removido com sucesso!');
    expect(mockBudgetService.list).toHaveBeenCalled();
  });

  it('should approve a budget and reload data', () => {
    component.approve(1);

    expect(mockBudgetService.approve).toHaveBeenCalledWith(1);
    expect(mockUtilsService.showSuccessMessage).toHaveBeenCalledWith('Orçamento Aprovado');
    expect(mockBudgetService.list).toHaveBeenCalled();
  });

  it('should deny a budget and reload data', () => {
    component.deny(1);

    expect(mockBudgetService.deny).toHaveBeenCalledWith(1);
    expect(mockUtilsService.showSuccessMessage).toHaveBeenCalledWith('Orçamento Reprovado');
    expect(mockBudgetService.list).toHaveBeenCalled();
  });
});

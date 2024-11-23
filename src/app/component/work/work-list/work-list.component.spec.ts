import { ComponentFixture, TestBed } from '@angular/core/testing';
import { WorkListComponent } from './work-list.component';
import { WorkService } from '../../../core/services/work.service';
import { UtilsService } from '../../../core/utils/utils.service';
import { Router } from '@angular/router';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatTableModule } from '@angular/material/table';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatInputModule } from '@angular/material/input';
import { MatIconModule } from '@angular/material/icon';
import { of } from 'rxjs';
import { HttpClientTestingModule } from '@angular/common/http/testing';

describe('WorkListComponent', () => {
  let component: WorkListComponent;
  let fixture: ComponentFixture<WorkListComponent>;
  let mockWorkService: any;
  let mockUtilsService: any;
  let mockRouter: any;

  beforeEach(async () => {
    mockWorkService = {
      list: jasmine.createSpy('list').and.returnValue(
        of({
          content: [
            { id: 1, name: 'Work 1', price: 100, materialList: [] },
            { id: 2, name: 'Work 2', price: 200, materialList: [] }
          ],
          totalElements: 2,
          totalPages: 1
        })
      ),
      delete: jasmine.createSpy('delete').and.returnValue(of({}))
    };

    mockUtilsService = {
      showSuccessMessage: jasmine.createSpy('showSuccessMessage')
    };

    mockRouter = {
      navigate: jasmine.createSpy('navigate')
    };

    await TestBed.configureTestingModule({
      imports: [
        MatPaginatorModule,
        MatTableModule,
        MatToolbarModule,
        MatInputModule,
        MatIconModule,
        WorkListComponent,
        HttpClientTestingModule
      ],
      providers: [
        { provide: WorkService, useValue: mockWorkService },
        { provide: UtilsService, useValue: mockUtilsService },
        { provide: Router, useValue: mockRouter }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(WorkListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should load data on initialization', () => {
    component.ngOnInit();

    expect(mockWorkService.list).toHaveBeenCalledWith(0, 10, '');
    expect(component.dataSource.data.length).toBe(2);
    expect(component.totalElements).toBe(2);
  });

  it('should update search query and reload data on search change', () => {
    const event = { target: { value: 'test query' } } as unknown as Event;
    component.onSearchChange(event);

    expect(component.searchQuery).toBe('test query');
    expect(component.pageIndex).toBe(0);
    expect(mockWorkService.list).toHaveBeenCalledWith(0, 10, 'test query');
  });

  it('should update pageIndex and pageSize on page change', () => {
    const pageEvent = { pageIndex: 1, pageSize: 5 };
    component.onPageChange(pageEvent);

    expect(component.pageIndex).toBe(1);
    expect(component.pageSize).toBe(5);
    expect(mockWorkService.list).toHaveBeenCalledWith(1, 5, '');
  });

  it('should delete a work and reload data', () => {
    component.delete(1);

    expect(mockWorkService.delete).toHaveBeenCalledWith(1);
    expect(mockUtilsService.showSuccessMessage).toHaveBeenCalledWith(
      'Trabalho removido com sucesso!'
    );
    expect(mockWorkService.list).toHaveBeenCalled();
  });

  it('should navigate to create work page', () => {
    component.onCreate();

    expect(mockRouter.navigate).toHaveBeenCalledWith(['/menu/trabalhos/criar']);
  });

  it('should navigate to edit work page', () => {
    component.onEdit(1);

    expect(mockRouter.navigate).toHaveBeenCalledWith(['/menu/trabalhos/editar', 1]);
  });

  it('should navigate to view work page', () => {
    component.onView(1);

    expect(mockRouter.navigate).toHaveBeenCalledWith(['/menu/trabalhos/visualizar', 1]);
  });
});

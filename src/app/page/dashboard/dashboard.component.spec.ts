import { ComponentFixture, TestBed } from '@angular/core/testing';
import { DashboardComponent } from './dashboard.component';
import { BreakpointObserver, BreakpointState } from '@angular/cdk/layout';
import { Router } from '@angular/router';
import { of } from 'rxjs';
import { HttpClientTestingModule } from '@angular/common/http/testing';

describe('DashboardComponent', () => {
  let component: DashboardComponent;
  let fixture: ComponentFixture<DashboardComponent>;
  let mockBreakpointObserver: jasmine.SpyObj<BreakpointObserver>;
  let mockRouter: jasmine.SpyObj<Router>;

  beforeEach(async () => {
    mockBreakpointObserver = jasmine.createSpyObj('BreakpointObserver', ['observe']);
    mockRouter = jasmine.createSpyObj('Router', ['navigate']);

    await TestBed.configureTestingModule({
      imports: [
        DashboardComponent,
        HttpClientTestingModule
      ],
      providers: [
        { provide: BreakpointObserver, useValue: mockBreakpointObserver },
        { provide: Router, useValue: mockRouter },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(DashboardComponent);
    component = fixture.componentInstance;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize with correct fillerNav based on role', () => {
    sessionStorage.setItem('role', 'ROLE_OWNER');
    component.ngOnDestroy();
    component.constructor(mockBreakpointObserver, mockRouter);
    fixture.detectChanges();

    expect(component.fillerNav).toEqual([
      { title: "Orçamentos", link: "orcamentos-cliente", show: false },
      { title: "Orçamentos", link: "orcamentos", show: true },
      { title: "Trabalhos", link: "trabalhos", show: true },
      { title: "Materiais", link: "materiais", show: true },
    ]);
  });

  it('should navigate to home page on logout', () => {
    spyOn(sessionStorage, 'clear');
    component.logout();
    expect(sessionStorage.clear).toHaveBeenCalled();
    expect(mockRouter.navigate).toHaveBeenCalledWith(['']);
  });

  it('should respond to mobile query matches', () => {
    mockBreakpointObserver.observe.and.returnValue(
      of({ matches: true } as BreakpointState)
    );

    component.constructor(mockBreakpointObserver, mockRouter);
    fixture.detectChanges();

    expect(component.mobileQueryMatches).toBeTrue();
    expect(component.isOpen).toBeFalse();
  });

  it('should unsubscribe from mobileQuerySubscription on destroy', () => {
    const unsubscribeSpy = spyOn(component['mobileQuerySubscription'], 'unsubscribe');
    component.ngOnDestroy();
    expect(unsubscribeSpy).toHaveBeenCalled();
  });

  it('should toggle the sidenav', () => {
    const snavMock = { toggle: jasmine.createSpy('toggle') };
    component.toggle(snavMock);
    expect(snavMock.toggle).toHaveBeenCalled();
  });

  it('should conditionally show navbar links based on role', () => {
    sessionStorage.setItem('role', 'ROLE_CUSTOMER');
    component.ngOnDestroy();
    component.constructor(mockBreakpointObserver, mockRouter);
    fixture.detectChanges();

    const visibleLinks = component.fillerNav.filter(nav => nav.show);
    expect(visibleLinks).toEqual([
      { title: "Orçamentos", link: "orcamentos-cliente", show: true },
    ]);
  });
});

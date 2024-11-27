import { ComponentFixture, TestBed } from '@angular/core/testing';
import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { Router } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { of } from 'rxjs';
import { DashboardComponent } from './dashboard.component';
import { MatIconModule } from '@angular/material/icon';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatListModule } from '@angular/material/list';
import { MatSidenavModule } from '@angular/material/sidenav';
import { Component } from '@angular/core';

@Component({
  selector: 'app-dummy',
  template: '<div>Dummy Component</div>'
})
class DummyComponent {}

describe('DashboardComponent', () => {
  let component: DashboardComponent;
  let fixture: ComponentFixture<DashboardComponent>;
  let mockBreakpointObserver: jasmine.SpyObj<BreakpointObserver>;
  let mockRouter: jasmine.SpyObj<Router>;

  beforeEach(async () => {
    mockBreakpointObserver = jasmine.createSpyObj('BreakpointObserver', ['observe']);
    mockBreakpointObserver.observe.and.returnValue(
      of({
        matches: false,
        breakpoints: {
          [Breakpoints.Handset]: false
        }
      })
    );

    mockRouter = jasmine.createSpyObj('Router', ['navigate']);

    await TestBed.configureTestingModule({
        imports: [
          DashboardComponent,
          MatIconModule,
          MatToolbarModule,
          MatListModule,
          MatSidenavModule,
          RouterTestingModule.withRoutes([
            { path: '', component: DummyComponent },
            { path: 'home', component: DummyComponent }
          ])
        ],
        declarations: [DummyComponent],
        providers: [
          { provide: BreakpointObserver, useValue: mockBreakpointObserver }
        ]
      }).compileComponents();      
  });

  beforeEach(() => {
    sessionStorage.setItem('role', 'ROLE_CUSTOMER');

    fixture = TestBed.createComponent(DashboardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  afterEach(() => {
    sessionStorage.clear();
  });

  it('should create the component', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize mobileQueryMatches to false', () => {
    expect(component.mobileQueryMatches).toBeFalse();
  });

  it('should populate fillerNav based on user role', () => {
    sessionStorage.setItem('role', 'ROLE_CUSTOMER');

    fixture = TestBed.createComponent(DashboardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();

    expect(component.fillerNav).toEqual([
      { title: 'Orçamentos', link: 'orcamentos-cliente', show: true },
      { title: 'Orçamentos', link: 'orcamentos', show: false },
      { title: 'Trabalhos', link: 'trabalhos', show: false },
      { title: 'Materiais', link: 'materiais', show: false }
    ]);
  });

  it('should clear session storage and navigate on logout', () => {
    spyOn(component['router'], 'navigate');
  
    component.logout();
  
    expect(sessionStorage.getItem('role')).toBeNull();
    expect(component['router'].navigate).toHaveBeenCalledWith(['']);
  });  
});

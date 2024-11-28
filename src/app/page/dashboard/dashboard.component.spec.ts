import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
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

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        MatIconModule,
        MatToolbarModule,
        MatListModule,
        MatSidenavModule,
        RouterTestingModule.withRoutes([
          { path: '', component: DummyComponent },
          { path: 'home', component: DummyComponent }
        ]),
        DashboardComponent
      ],
      declarations: [DummyComponent],
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
    expect(component.mobileQueryMatches).toBe(false);
  });

  it('should clear session storage and navigate on logout', () => {
    const navigateSpy = jest.spyOn(component['router'], 'navigate');

    component.logout();

    expect(sessionStorage.getItem('role')).toBeNull();
    expect(navigateSpy).toHaveBeenCalledWith(['']);
  });
});

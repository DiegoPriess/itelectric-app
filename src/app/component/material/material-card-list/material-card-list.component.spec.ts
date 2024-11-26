import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MaterialCardListComponent } from './material-card-list.component';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { HttpClientTestingModule } from '@angular/common/http/testing';

describe('MaterialCardListComponent', () => {
  let component: MaterialCardListComponent;
  let fixture: ComponentFixture<MaterialCardListComponent>;

  beforeEach(async () => {

    await TestBed.configureTestingModule({
      imports: [MaterialCardListComponent, HttpClientTestingModule],
      providers: [
      ],
      schemas: [NO_ERRORS_SCHEMA],
    }).compileComponents();

    fixture = TestBed.createComponent(MaterialCardListComponent);
    component = fixture.componentInstance;
  });

  it('must create component', () => {
    expect(component).toBeTruthy();
  });
});

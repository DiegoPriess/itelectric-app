import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MaterialSelectListComponent } from './material-select-list.component';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { HttpClientTestingModule } from '@angular/common/http/testing';

describe('MaterialCardListComponent', () => {
  let component: MaterialSelectListComponent;
  let fixture: ComponentFixture<MaterialSelectListComponent>;

  beforeEach(async () => {

    await TestBed.configureTestingModule({
      imports: [MaterialSelectListComponent, HttpClientTestingModule],
      providers: [
      ],
      schemas: [NO_ERRORS_SCHEMA],
    }).compileComponents();

    fixture = TestBed.createComponent(MaterialSelectListComponent);
    component = fixture.componentInstance;
  });

  it('must create component', () => {
    expect(component).toBeTruthy();
  });
});

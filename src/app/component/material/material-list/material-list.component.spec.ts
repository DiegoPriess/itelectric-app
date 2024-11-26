import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MaterialListComponent } from './material-list.component';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { HttpClientTestingModule } from '@angular/common/http/testing';

describe('MaterialListComponent', () => {
  let component: MaterialListComponent;
  let fixture: ComponentFixture<MaterialListComponent>;

  beforeEach(async () => {

    await TestBed.configureTestingModule({
      imports: [MaterialListComponent, HttpClientTestingModule],
      providers: [
      ],
      schemas: [NO_ERRORS_SCHEMA],
    }).compileComponents();

    fixture = TestBed.createComponent(MaterialListComponent);
    component = fixture.componentInstance;
  });

  it('must create component', () => {
    expect(component).toBeTruthy();
  });
});

import { ComponentFixture, TestBed } from '@angular/core/testing';
import { WorkListComponent } from './work-list.component';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { HttpClientTestingModule } from '@angular/common/http/testing';

describe('WorkListComponent', () => {
  let component: WorkListComponent;
  let fixture: ComponentFixture<WorkListComponent>;

  beforeEach(async () => {

    await TestBed.configureTestingModule({
      imports: [WorkListComponent, HttpClientTestingModule],
      providers: [
      ],
      schemas: [NO_ERRORS_SCHEMA],
    }).compileComponents();

    fixture = TestBed.createComponent(WorkListComponent);
    component = fixture.componentInstance;
  });

  it('must create component', () => {
    expect(component).toBeTruthy();
  });
});

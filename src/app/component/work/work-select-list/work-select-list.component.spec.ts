import { ComponentFixture, TestBed } from '@angular/core/testing';

import { WorkSelectListComponent } from './work-select-list.component';

describe('WorkSelectListComponent', () => {
  let component: WorkSelectListComponent;
  let fixture: ComponentFixture<WorkSelectListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [WorkSelectListComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(WorkSelectListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MaterialCardListComponent } from './material-card-list.component';

describe('MaterialCardListComponent', () => {
  let component: MaterialCardListComponent;
  let fixture: ComponentFixture<MaterialCardListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MaterialCardListComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MaterialCardListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

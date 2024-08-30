import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SetAllocationComponent } from './set-allocation.component';

describe('SetAllocationComponent', () => {
  let component: SetAllocationComponent;
  let fixture: ComponentFixture<SetAllocationComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [SetAllocationComponent]
    });
    fixture = TestBed.createComponent(SetAllocationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

import { ComponentFixture, TestBed } from '@angular/core/testing';

import { forgetComponent } from './forget.component';

describe('forgetComponent', () => {
  let component: forgetComponent;
  let fixture: ComponentFixture<forgetComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [forgetComponent]
    });
    fixture = TestBed.createComponent(forgetComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

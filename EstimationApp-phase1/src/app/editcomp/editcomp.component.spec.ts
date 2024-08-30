import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EditcompComponent } from './editcomp.component';

describe('EditcompComponent', () => {
  let component: EditcompComponent;
  let fixture: ComponentFixture<EditcompComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [EditcompComponent]
    });
    fixture = TestBed.createComponent(EditcompComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

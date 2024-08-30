import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RfpComponent } from './rfp.component';

describe('RfpComponent', () => {
  let component: RfpComponent;
  let fixture: ComponentFixture<RfpComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [RfpComponent]
    });
    fixture = TestBed.createComponent(RfpComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

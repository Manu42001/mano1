import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ResourceloadComponent } from './resourceload.component';

describe('ResourceloadComponent', () => {
  let component: ResourceloadComponent;
  let fixture: ComponentFixture<ResourceloadComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ResourceloadComponent]
    });
    fixture = TestBed.createComponent(ResourceloadComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

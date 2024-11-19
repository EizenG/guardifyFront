import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CameraParameterComponent } from './camera-parameter.component';

describe('CameraParameterComponent', () => {
  let component: CameraParameterComponent;
  let fixture: ComponentFixture<CameraParameterComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CameraParameterComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(CameraParameterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

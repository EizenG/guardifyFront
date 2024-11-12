import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ParamterComponent } from './paramter.component';

describe('ParamterComponent', () => {
  let component: ParamterComponent;
  let fixture: ComponentFixture<ParamterComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ParamterComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ParamterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

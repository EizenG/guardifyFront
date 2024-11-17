import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OffenceVideoComponent } from './offence-video.component';

describe('OffenceVideoComponent', () => {
  let component: OffenceVideoComponent;
  let fixture: ComponentFixture<OffenceVideoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [OffenceVideoComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(OffenceVideoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

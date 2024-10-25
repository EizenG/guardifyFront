import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AuthoriesAccessComponent } from './authories-access.component';

describe('AuthoriesAccessComponent', () => {
  let component: AuthoriesAccessComponent;
  let fixture: ComponentFixture<AuthoriesAccessComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AuthoriesAccessComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(AuthoriesAccessComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

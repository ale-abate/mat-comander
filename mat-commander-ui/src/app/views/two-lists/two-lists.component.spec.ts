import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TwoListsComponent } from './two-lists.component';

describe('TwoListsComponent', () => {
  let component: TwoListsComponent;
  let fixture: ComponentFixture<TwoListsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TwoListsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(TwoListsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

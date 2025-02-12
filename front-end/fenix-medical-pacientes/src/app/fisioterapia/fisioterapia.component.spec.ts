import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FisioterapiaComponent } from './fisioterapia.component';

describe('FisioterapiaComponent', () => {
  let component: FisioterapiaComponent;
  let fixture: ComponentFixture<FisioterapiaComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ FisioterapiaComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(FisioterapiaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

import { ComponentFixture, TestBed } from '@angular/core/testing';

import { WebcamComponentComponent } from './webcam-component.component';

describe('WebcamComponentComponent', () => {
  let component: WebcamComponentComponent;
  let fixture: ComponentFixture<WebcamComponentComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ WebcamComponentComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(WebcamComponentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

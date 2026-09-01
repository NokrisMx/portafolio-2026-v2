import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Experience } from './experience';

describe('Experience', () => {
  let fixture: ComponentFixture<Experience>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [Experience],
    });

    fixture = TestBed.createComponent(Experience);
    fixture.detectChanges();
  });

  it('creates the component', () => {
    expect(fixture.componentInstance).toBeTruthy();
  });
});

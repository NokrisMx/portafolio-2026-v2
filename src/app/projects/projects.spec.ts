import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Projects } from './projects';

describe('Projects', () => {
  it('renders section with id proyectos', () => {
    const { compiled } = setup();
    expect(compiled.querySelector('section#proyectos')).toBeTruthy();
  });

  function setup(): {
    fixture: ComponentFixture<Projects>;
    compiled: HTMLElement;
  } {
    TestBed.configureTestingModule({
      imports: [Projects],
    });

    const fixture = TestBed.createComponent(Projects);
    fixture.detectChanges();
    return { fixture, compiled: fixture.nativeElement as HTMLElement };
  }
});

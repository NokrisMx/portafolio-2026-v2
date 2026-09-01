import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Chip } from './chip';

describe('Chip', () => {
  it('renders the provided label', () => {
    const { compiled } = setup({ label: 'Angular' });
    expect(compiled.textContent?.trim()).toBe('Angular');
  });

  it('renders base pill classes', () => {
    const { compiled } = setup({ label: 'Angular' });
    const span = compiled.querySelector('span');

    expect(span).toBeTruthy();
    expect(span?.classList.contains('inline-block')).toBe(true);
    expect(span?.classList.contains('bg-surface-container-high')).toBe(true);
    expect(span?.classList.contains('text-on-surface')).toBe(true);
    expect(span?.classList.contains('border')).toBe(true);
    expect(span?.classList.contains('border-outline-variant')).toBe(true);
    expect(span?.classList.contains('rounded-full')).toBe(true);
  });

  it('uses sm padding by default', () => {
    const { compiled } = setup({ label: 'Angular' });
    const span = compiled.querySelector('span');

    expect(span?.classList.contains('px-3')).toBe(true);
    expect(span?.classList.contains('py-1')).toBe(true);
    expect(span?.classList.contains('px-4')).toBe(false);
    expect(span?.classList.contains('py-2')).toBe(false);
  });

  it('uses md padding when size is md', () => {
    const { compiled } = setup({ label: 'ANGULAR', size: 'md' });
    const span = compiled.querySelector('span');

    expect(span?.classList.contains('px-4')).toBe(true);
    expect(span?.classList.contains('py-2')).toBe(true);
    expect(span?.classList.contains('px-3')).toBe(false);
    expect(span?.classList.contains('py-1')).toBe(false);
  });

  function setup(inputs: { label: string; size?: 'sm' | 'md' }): {
    fixture: ComponentFixture<Chip>;
    compiled: HTMLElement;
  } {
    TestBed.configureTestingModule({
      imports: [Chip],
    });

    const fixture = TestBed.createComponent(Chip);
    fixture.componentRef.setInput('label', inputs.label);

    if (inputs.size) {
      fixture.componentRef.setInput('size', inputs.size);
    }

    fixture.detectChanges();

    return { fixture, compiled: fixture.nativeElement as HTMLElement };
  }
});

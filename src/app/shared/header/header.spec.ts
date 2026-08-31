import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Header } from './header';

describe('Header', () => {
  it('renders brand linking to #inicio', () => {
    const { compiled } = setup();
    const brand = compiled.querySelector<HTMLAnchorElement>('a[href="#inicio"]');
    expect(brand?.textContent?.trim()).toBe('Aldo Guevara Muñoz');
  });

  it('renders 6 nav links with spanish labels and fragments', () => {
    const { compiled } = setup();
    const links = Array.from(compiled.querySelectorAll<HTMLAnchorElement>('nav > div > a'));

    expect(links.length).toBe(6);
    expect(links.map((a) => a.textContent?.trim())).toEqual([
      'Inicio',
      'Sobre mí',
      'Experiencia',
      'Proyectos',
      'Habilidades',
      'Educación',
    ]);
    expect(links.map((a) => a.getAttribute('href'))).toEqual([
      '#inicio',
      '#sobre-mi',
      '#experiencia',
      '#proyectos',
      '#habilidades',
      '#educacion',
    ]);
  });

  it('renders Contacto mailto CTA', () => {
    const { compiled } = setup();
    const cta = compiled.querySelector<HTMLAnchorElement>(
      'a[href="mailto:guevaraaldo44@gmail.com"]',
    );
    expect(cta?.textContent?.trim()).toBe('Contacto');
  });

  it('toggles mobile menu and updates aria-expanded', () => {
    const { fixture, compiled } = setup();
    const button = compiled.querySelector<HTMLButtonElement>('button[aria-controls="mobile-menu"]');

    expect(button?.getAttribute('aria-expanded')).toBe('false');
    expect(compiled.querySelector('#mobile-menu')).toBeFalsy();

    button?.click();
    fixture.detectChanges();

    expect(button?.getAttribute('aria-expanded')).toBe('true');
    expect(compiled.querySelector('#mobile-menu')).toBeTruthy();

    button?.click();
    fixture.detectChanges();

    expect(compiled.querySelector('#mobile-menu')).toBeFalsy();
  });

  it('closes mobile menu when a link is clicked', () => {
    const { fixture, compiled } = setup();
    const button = compiled.querySelector<HTMLButtonElement>('button[aria-controls="mobile-menu"]');

    button?.click();
    fixture.detectChanges();

    const link = compiled.querySelector<HTMLAnchorElement>('#mobile-menu a');
    link?.click();
    fixture.detectChanges();

    expect(compiled.querySelector('#mobile-menu')).toBeFalsy();
  });

  it('marks Inicio as active by default when no sections exist', () => {
    const { compiled } = setup();
    const inicioLink = compiled.querySelector<HTMLAnchorElement>('nav > div > a[href="#inicio"]');
    const classes = inicioLink?.classList.toString() ?? '';

    expect(classes).toContain('text-primary');
    expect(classes).toContain('border-primary');
  });
});

function setup(): { fixture: ComponentFixture<Header>; compiled: HTMLElement } {
  const fixture = TestBed.createComponent(Header);
  fixture.detectChanges();
  return { fixture, compiled: fixture.nativeElement as HTMLElement };
}

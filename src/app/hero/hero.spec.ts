import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Observable, of, Subject, throwError } from 'rxjs';
import { Hero, GITHUB_URL, ROLE_LABEL } from './hero';
import { PortfolioService } from '../shared/services/portfolio.service';
import { Portfolio } from '../shared/models/portfolio.models';

describe('Hero', () => {
  let portfolioService: { getPortfolio: () => Observable<Portfolio> };

  beforeEach(() => {
    portfolioService = { getPortfolio: vi.fn() };
  });

  it('renders section with id inicio', () => {
    const { compiled } = setup(() => of(mockPortfolio()));
    expect(compiled.querySelector('section#inicio')).toBeTruthy();
  });

  it('shows skeleton while loading', () => {
    const { compiled } = setup(() => new Subject<Portfolio>().asObservable());
    expect(compiled.querySelectorAll('.animate-pulse').length).toBeGreaterThan(0);
  });

  it('renders label, name, description and links on success', () => {
    const portfolio = mockPortfolio();
    const { compiled } = setup(() => of(portfolio));

    expect(compiled.textContent).toContain(ROLE_LABEL);
    expect(compiled.textContent).toContain(portfolio.about.nombreCompleto);
    expect(compiled.textContent).toContain(portfolio.about.descripcion);

    const projectsLink = compiled.querySelector<HTMLAnchorElement>('a[href="#proyectos"]');
    expect(projectsLink?.textContent?.trim()).toBe('Ver proyectos');

    const githubLink = compiled.querySelector<HTMLAnchorElement>(`a[href="${GITHUB_URL}"]`);
    expect(githubLink?.textContent?.trim()).toBe('GitHub');
    expect(githubLink?.getAttribute('target')).toBe('_blank');
    expect(githubLink?.getAttribute('rel')).toBe('noopener noreferrer');
  });

  it('renders profile image with src and alt on success', () => {
    const portfolio = mockPortfolio();
    const { compiled } = setup(() => of(portfolio));

    const image = compiled.querySelector<HTMLImageElement>('img');
    expect(image?.getAttribute('src')).toBe(portfolio.about.foto);
    expect(image?.getAttribute('alt')).toContain(portfolio.about.nombreCompleto);
  });

  it('hides image on viewports narrower than md', () => {
    const { compiled } = setup(() => of(mockPortfolio()));
    const imageContainer = compiled.querySelector('.hidden.md\\:block');
    expect(imageContainer).toBeTruthy();
  });

  it('shows error message and retry button when fetch fails', () => {
    const { compiled } = setup(() => throwError(() => new Error('API error')));

    expect(compiled.textContent).toContain('No se pudo cargar la información');
    const retryButton = compiled.querySelector<HTMLButtonElement>('button');
    expect(retryButton?.textContent?.trim()).toBe('Reintentar');
  });

  it('reloads portfolio when retry button is clicked', async () => {
    const { fixture, compiled } = setup(() => throwError(() => new Error('API error')));
    const retryButton = compiled.querySelector<HTMLButtonElement>('button');

    retryButton?.click();
    await fixture.whenStable();

    expect(portfolioService.getPortfolio).toHaveBeenCalledTimes(2);
  });

  function setup(serviceFactory: () => Observable<Portfolio>): { fixture: ComponentFixture<Hero>; compiled: HTMLElement } {
    portfolioService.getPortfolio = vi.fn(serviceFactory);

    TestBed.configureTestingModule({
      imports: [Hero],
      providers: [{ provide: PortfolioService, useValue: portfolioService }],
    });

    const fixture = TestBed.createComponent(Hero);
    fixture.detectChanges();
    return { fixture, compiled: fixture.nativeElement as HTMLElement };
  }
});

function mockPortfolio(): Portfolio {
  return {
    about: {
      nombreCompleto: 'Aldo Guevara Muñoz',
      descripcion: 'Desarrollador full stack junior especializado en Angular y .NET.',
      email: 'test@example.com',
      ubicacion: 'Ciudad de México',
      telefono: '5555555555',
      edad: '25',
      cv: '/assets/cv.pdf',
      foto: '/assets/images/profile.png',
    },
    experiencia: [],
    proyectos: [],
    habilidades: [],
    educacion: [],
  };
}

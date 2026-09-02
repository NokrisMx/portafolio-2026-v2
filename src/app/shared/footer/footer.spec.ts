import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Observable, of, Subject, throwError } from 'rxjs';
import { Footer } from './footer';
import { GITHUB_URL, LINKEDIN_URL } from '../constants/portfolio-links';
import { PortfolioService } from '../services/portfolio.service';
import { Portfolio } from '../models/portfolio.models';

describe('Footer', () => {
  let portfolioService: { getPortfolio: () => Observable<Portfolio> };

  beforeEach(() => {
    portfolioService = { getPortfolio: vi.fn() };
  });

  it('renders footer element', () => {
    const { compiled } = setup(() => of(mockPortfolio()));
    expect(compiled.querySelector('footer')).toBeTruthy();
  });

  it('shows skeleton while loading', () => {
    const { compiled } = setup(() => new Subject<Portfolio>().asObservable());
    expect(compiled.querySelectorAll('.animate-pulse').length).toBeGreaterThan(0);
  });

  it('renders name and copyright from API on success', () => {
    const portfolio = mockPortfolio();
    const { compiled } = setup(() => of(portfolio));

    expect(compiled.textContent).toContain(portfolio.about.nombreCompleto);
    expect(compiled.textContent).toContain(
      `© ${new Date().getFullYear()} ${portfolio.about.nombreCompleto}.`,
    );
  });

  it('renders email link with mailto href from API', () => {
    const portfolio = mockPortfolio();
    const { compiled } = setup(() => of(portfolio));

    const emailLink = compiled.querySelector<HTMLAnchorElement>(
      `a[href="mailto:${portfolio.about.email}"]`,
    );
    expect(emailLink?.textContent?.trim()).toContain('Email');
    expect(emailLink?.querySelector('i.pi.pi-envelope.text-xl')).toBeTruthy();
  });

  it('renders LinkedIn and GitHub links with external attributes', () => {
    const { compiled } = setup(() => of(mockPortfolio()));

    const linkedinLink = compiled.querySelector<HTMLAnchorElement>(`a[href="${LINKEDIN_URL}"]`);
    expect(linkedinLink?.textContent?.trim()).toContain('LinkedIn');
    expect(linkedinLink?.getAttribute('target')).toBe('_blank');
    expect(linkedinLink?.getAttribute('rel')).toBe('noopener noreferrer');
    expect(linkedinLink?.querySelector('i.pi.pi-linkedin.text-xl')).toBeTruthy();

    const githubLink = compiled.querySelector<HTMLAnchorElement>(`a[href="${GITHUB_URL}"]`);
    expect(githubLink?.textContent?.trim()).toContain('GitHub');
    expect(githubLink?.getAttribute('target')).toBe('_blank');
    expect(githubLink?.getAttribute('rel')).toBe('noopener noreferrer');
    expect(githubLink?.querySelector('i.pi.pi-github.text-xl')).toBeTruthy();
  });

  it('marks icons as aria-hidden', () => {
    const { compiled } = setup(() => of(mockPortfolio()));

    const icons = compiled.querySelectorAll('i.pi');
    expect(icons.length).toBe(3);
    icons.forEach((icon) => {
      expect(icon.getAttribute('aria-hidden')).toBe('true');
    });
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

  function setup(serviceFactory: () => Observable<Portfolio>): {
    fixture: ComponentFixture<Footer>;
    compiled: HTMLElement;
  } {
    portfolioService.getPortfolio = vi.fn(serviceFactory);

    TestBed.configureTestingModule({
      imports: [Footer],
      providers: [{ provide: PortfolioService, useValue: portfolioService }],
    });

    const fixture = TestBed.createComponent(Footer);
    fixture.detectChanges();
    return { fixture, compiled: fixture.nativeElement as HTMLElement };
  }
});

function mockPortfolio(): Portfolio {
  return {
    about: {
      nombreCompleto: 'Aldo Guevara Muñoz',
      descripcion: 'Desarrollador full stack junior.',
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

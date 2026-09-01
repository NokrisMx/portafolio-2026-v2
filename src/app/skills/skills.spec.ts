import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Observable, of, Subject, throwError } from 'rxjs';
import { Skills, SECTION_TITLE } from './skills';
import { PortfolioService } from '../shared/services/portfolio.service';
import { Portfolio } from '../shared/models/portfolio.models';

describe('Skills', () => {
  let portfolioService: { getPortfolio: () => Observable<Portfolio> };

  beforeEach(() => {
    portfolioService = { getPortfolio: vi.fn() };
  });

  it('renders section with id habilidades', () => {
    const { compiled } = setup(() => of(mockPortfolio()));
    expect(compiled.querySelector('section#habilidades')).toBeTruthy();
  });

  it('shows skeleton while loading', () => {
    const { compiled } = setup(() => new Subject<Portfolio>().asObservable());
    expect(compiled.querySelectorAll('.animate-pulse').length).toBeGreaterThan(0);
  });

  it('renders title and divider on success', () => {
    const { compiled } = setup(() => of(mockPortfolio()));

    const heading = compiled.querySelector('h2');
    expect(heading?.textContent?.trim()).toBe(SECTION_TITLE);
    expect(compiled.querySelector('.h-1.w-12.bg-primary')).toBeTruthy();
  });

  it('renders one chip per skill in order with size md', () => {
    const portfolio = mockPortfolio();
    const { compiled } = setup(() => of(portfolio));

    const chips = compiled.querySelectorAll('app-chip');
    expect(chips.length).toBe(portfolio.habilidades.length);

    for (let i = 0; i < portfolio.habilidades.length; i++) {
      const skill = portfolio.habilidades[i];
      expect(chips[i].textContent?.trim()).toBe(skill.nombre);
    }
  });

  it('does not render chips when habilidades array is empty', () => {
    const portfolio = { ...mockPortfolio(), habilidades: [] };
    const { compiled } = setup(() => of(portfolio));

    expect(compiled.querySelectorAll('app-chip').length).toBe(0);
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
    fixture: ComponentFixture<Skills>;
    compiled: HTMLElement;
  } {
    portfolioService.getPortfolio = vi.fn(serviceFactory);

    TestBed.configureTestingModule({
      imports: [Skills],
      providers: [{ provide: PortfolioService, useValue: portfolioService }],
    });

    const fixture = TestBed.createComponent(Skills);
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
    habilidades: [
      { nombre: 'ANGULAR', icono: 'Angular01Icon' },
      { nombre: 'JavaScript', icono: 'Javascript01Icon' },
      { nombre: 'TAILWIND CSS', icono: 'Tailwindcss01Icon' },
      { nombre: 'C#', icono: '' },
    ],
    educacion: [],
  };
}

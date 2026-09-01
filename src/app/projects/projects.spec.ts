import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Observable, of, Subject, throwError } from 'rxjs';
import { Projects, SECTION_TITLE } from './projects';
import { PortfolioService } from '../shared/services/portfolio.service';
import { Portfolio } from '../shared/models/portfolio.models';

describe('Projects', () => {
  let portfolioService: { getPortfolio: () => Observable<Portfolio> };

  beforeEach(() => {
    portfolioService = { getPortfolio: vi.fn() };
  });

  it('renders section with id proyectos', () => {
    const { compiled } = setup(() => of(mockPortfolio()));
    expect(compiled.querySelector('section#proyectos')).toBeTruthy();
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

  it('renders one project card per project in order', () => {
    const portfolio = mockPortfolio();
    const { compiled } = setup(() => of(portfolio));

    const cards = compiled.querySelectorAll('app-project-card');
    expect(cards.length).toBe(portfolio.proyectos.length);

    for (const project of portfolio.proyectos) {
      expect(compiled.textContent).toContain(project.nombre);
    }
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
    fixture: ComponentFixture<Projects>;
    compiled: HTMLElement;
  } {
    portfolioService.getPortfolio = vi.fn(serviceFactory);

    TestBed.configureTestingModule({
      imports: [Projects],
      providers: [{ provide: PortfolioService, useValue: portfolioService }],
    });

    const fixture = TestBed.createComponent(Projects);
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
    proyectos: [
      {
        nombre: 'Guevara Librerias (Frontend)',
        descripcion: 'Frontend de librería con Angular.',
        tecnologias: ['Angular', 'Tailwind CSS'],
        github: 'https://github.com/example/guevara-librerias-front',
        demo: 'https://guevara-librerias.example.com',
        image: '/assets/images/guevaralibreriasfront.jpg',
      },
      {
        nombre: 'Guevara Librerias (Backend)',
        descripcion: 'Backend de librería con ASP.NET Core.',
        tecnologias: ['C#', 'SQL Server'],
        github: 'https://github.com/example/guevara-librerias-back',
        demo: '',
        image: '/assets/images/guevaralibreriasback.jpg',
      },
      {
        nombre: 'Blackjack',
        descripcion: 'Juego de Blackjack con Angular.',
        tecnologias: ['Angular', 'RxJS'],
        github: 'https://github.com/example/blackjack',
        demo: 'https://blackjack.example.com',
        image: '/assets/images/blackjack.jpg',
      },
      {
        nombre: 'PetCute',
        descripcion: 'Sitio estático para veterinaria con Astro.',
        tecnologias: ['Astro'],
        github: 'https://github.com/example/petcute',
        demo: 'https://petcute.example.com',
        image: 'assets/images/petcute.jpg',
      },
    ],
    habilidades: [],
    educacion: [],
  };
}

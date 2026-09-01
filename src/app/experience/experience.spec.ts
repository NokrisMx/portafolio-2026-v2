import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Observable, of, Subject, throwError } from 'rxjs';
import { Experience, SECTION_TITLE } from './experience';
import { PortfolioService } from '../shared/services/portfolio.service';
import { Portfolio } from '../shared/models/portfolio.models';

describe('Experience', () => {
  let portfolioService: { getPortfolio: () => Observable<Portfolio> };

  beforeEach(() => {
    portfolioService = { getPortfolio: vi.fn() };
  });

  it('renders section with id experiencia', () => {
    const { compiled } = setup(() => of(mockPortfolio()));
    expect(compiled.querySelector('section#experiencia')).toBeTruthy();
  });

  it('shows skeleton while loading', () => {
    const { compiled } = setup(() => new Subject<Portfolio>().asObservable());
    expect(compiled.querySelectorAll('.animate-pulse').length).toBeGreaterThan(0);
  });

  it('renders title, positions, dates, descriptions and companies on success', () => {
    const portfolio = mockPortfolio();
    const { compiled } = setup(() => of(portfolio));

    const heading = compiled.querySelector('h2');
    expect(heading?.textContent?.trim()).toBe(SECTION_TITLE);
    expect(compiled.querySelector('.h-1.w-12.bg-primary')).toBeTruthy();

    for (const item of portfolio.experiencia) {
      expect(compiled.textContent).toContain(item.puesto);
      expect(compiled.textContent).toContain(item.descripcion);
      expect(compiled.textContent).toContain(item.empresa);
      expect(compiled.textContent).toContain(`${item.fechaInicio} – ${item.fechaFin}`);
    }
  });

  it('renders company anchors with external link attributes', () => {
    const portfolio = mockPortfolio();
    const { compiled } = setup(() => of(portfolio));

    const links = compiled.querySelectorAll<HTMLAnchorElement>('a[target="_blank"]');
    expect(links.length).toBe(portfolio.experiencia.length);

    for (let i = 0; i < portfolio.experiencia.length; i++) {
      const item = portfolio.experiencia[i];
      expect(links[i].getAttribute('href')).toBe(item.url);
      expect(links[i].getAttribute('rel')).toBe('noopener noreferrer');
      expect(links[i].textContent).toContain(item.empresa);
    }
  });

  it('renders normalized logo src and alt for each company', () => {
    const portfolio = mockPortfolio();
    const { compiled } = setup(() => of(portfolio));

    const images = compiled.querySelectorAll<HTMLImageElement>('img');
    expect(images.length).toBe(portfolio.experiencia.length);

    const expectedSrcs = ['/assets/images/vitek.png', '/assets/images/vidasypensiones.png'];
    for (let i = 0; i < portfolio.experiencia.length; i++) {
      expect(images[i].getAttribute('src')).toBe(expectedSrcs[i]);
      expect(images[i].getAttribute('alt')).toContain(portfolio.experiencia[i].empresa);
    }
  });

  it('renders a chip per skill with label-mono style', () => {
    const portfolio = mockPortfolio();
    const { compiled } = setup(() => of(portfolio));

    const chips = compiled.querySelectorAll('span.border.border-outline-variant.rounded-full');
    const allSkills = portfolio.experiencia.flatMap((item) => item.habilidades);
    expect(chips.length).toBe(allSkills.length);

    for (const skill of allSkills) {
      expect(compiled.textContent).toContain(skill);
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
    fixture: ComponentFixture<Experience>;
    compiled: HTMLElement;
  } {
    portfolioService.getPortfolio = vi.fn(serviceFactory);

    TestBed.configureTestingModule({
      imports: [Experience],
      providers: [{ provide: PortfolioService, useValue: portfolioService }],
    });

    const fixture = TestBed.createComponent(Experience);
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
    experiencia: [
      {
        empresa: 'Grupo Vitek',
        url: 'https://vitek.example.com',
        logo: 'assets/images/vitek.png',
        puesto: 'Frontend Developer',
        descripcion: 'Desarrollo de módulos ERP con Angular y Tailwind CSS.',
        habilidades: ['Angular', 'TypeScript'],
        fechaInicio: 'Julio 2025',
        fechaFin: 'Enero 2026',
      },
      {
        empresa: 'Vidas y Pensiones',
        url: 'https://vidasypensiones.example.com',
        logo: '/assets/images/vidasypensiones.png',
        puesto: 'Web Developer',
        descripcion: 'Rediseño web y simuladores de pensión con PHP y SQL.',
        habilidades: ['PHP', 'SQL'],
        fechaInicio: 'Abril 2024',
        fechaFin: 'Abril 2026',
      },
    ],
    proyectos: [],
    habilidades: [],
    educacion: [],
  };
}

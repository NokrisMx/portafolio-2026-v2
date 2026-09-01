import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Observable, of } from 'rxjs';
import { Educacion, SECTION_TITLE } from './educacion';
import { PortfolioService } from '../shared/services/portfolio.service';
import { Portfolio } from '../shared/models/portfolio.models';

describe('Educacion', () => {
  let portfolioService: { getPortfolio: () => Observable<Portfolio> };

  beforeEach(() => {
    portfolioService = { getPortfolio: vi.fn() };
  });

  it('renders section with id educacion', () => {
    const { compiled } = setup(() => of(mockPortfolio()));
    expect(compiled.querySelector('section#educacion')).toBeTruthy();
  });

  function setup(serviceFactory: () => Observable<Portfolio>): {
    fixture: ComponentFixture<Educacion>;
    compiled: HTMLElement;
  } {
    portfolioService.getPortfolio = vi.fn(serviceFactory);

    TestBed.configureTestingModule({
      imports: [Educacion],
      providers: [{ provide: PortfolioService, useValue: portfolioService }],
    });

    const fixture = TestBed.createComponent(Educacion);
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

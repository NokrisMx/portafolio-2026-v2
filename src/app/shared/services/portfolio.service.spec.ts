import { TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { PortfolioService } from './portfolio.service';
import { Portfolio } from '../models/portfolio.models';

describe('PortfolioService', () => {
  const API_URL = 'https://69d19cab5043d95be971190e.mockapi.io/api/v1/portfolio';

  let service: PortfolioService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [provideHttpClient(), provideHttpClientTesting(), PortfolioService],
    });

    service = TestBed.inject(PortfolioService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('fetches from the documented endpoint', () => {
    service.getPortfolio().subscribe();

    const req = httpMock.expectOne(API_URL);
    expect(req.request.method).toBe('GET');
    req.flush([mockPortfolio()]);
  });

  it('returns the first element of the array', () => {
    const first = mockPortfolio();
    const second: Portfolio = {
      ...first,
      about: { ...first.about, nombreCompleto: 'Otro nombre' },
    };

    service.getPortfolio().subscribe((portfolio) => {
      expect(portfolio.about.nombreCompleto).toBe(first.about.nombreCompleto);
    });

    httpMock.expectOne(API_URL).flush([first, second]);
  });

  it('emits an error when the array is empty', () => {
    service.getPortfolio().subscribe({
      next: () => expect.fail('should not emit a value'),
      error: (error) => expect(error).toBeTruthy(),
    });

    httpMock.expectOne(API_URL).flush([]);
  });
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

import { TestBed } from '@angular/core/testing';
import { of } from 'rxjs';
import { Footer } from './footer';
import { PortfolioService } from '../services/portfolio.service';
import { Portfolio } from '../models/portfolio.models';

describe('Footer', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Footer],
      providers: [
        { provide: PortfolioService, useValue: { getPortfolio: () => of(mockPortfolio()) } },
      ],
    }).compileComponents();
  });

  it('should create', () => {
    const fixture = TestBed.createComponent(Footer);
    const component = fixture.componentInstance;
    expect(component).toBeTruthy();
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

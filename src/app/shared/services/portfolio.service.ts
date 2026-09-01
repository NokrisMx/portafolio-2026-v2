import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { map, Observable } from 'rxjs';
import { Portfolio } from '../models/portfolio.models';

const API_URL = 'https://69d19cab5043d95be971190e.mockapi.io/api/v1/portfolio';

@Injectable({
  providedIn: 'root',
})
export class PortfolioService {
  private readonly http = inject(HttpClient);

  getPortfolio(): Observable<Portfolio> {
    return this.http.get<Portfolio[]>(API_URL).pipe(
      map((items) => {
        if (!items || items.length === 0) {
          throw new Error('La respuesta de la API está vacía');
        }
        return items[0];
      })
    );
  }
}

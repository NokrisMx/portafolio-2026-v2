import { Component, computed, inject } from '@angular/core';
import { rxResource } from '@angular/core/rxjs-interop';
import { PortfolioService } from '../shared/services/portfolio.service';
import { Portfolio } from '../shared/models/portfolio.models';

export const SECTION_TITLE = 'Educación';

@Component({
  selector: 'app-educacion',
  styleUrl: './educacion.css',
  templateUrl: './educacion.html',
})
export class Educacion {
  readonly sectionTitle = SECTION_TITLE;

  private readonly portfolioService = inject(PortfolioService);

  readonly portfolio = rxResource<Portfolio, unknown>({
    stream: () => this.portfolioService.getPortfolio(),
  });

  readonly isLoading = this.portfolio.isLoading;
  readonly error = this.portfolio.error;
  readonly educacion = computed(() => this.portfolio.value()?.educacion ?? []);

  reload(): void {
    this.portfolio.reload();
  }
}

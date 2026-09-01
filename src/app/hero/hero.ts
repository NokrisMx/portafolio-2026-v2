import { Component, computed, inject } from '@angular/core';
import { rxResource } from '@angular/core/rxjs-interop';
import { PortfolioService } from '../shared/services/portfolio.service';
import { Portfolio } from '../shared/models/portfolio.models';

export const ROLE_LABEL = 'FullStack Developer Jr';
export const GITHUB_URL = 'https://github.com/NokrisMx';

@Component({
  imports: [],
  selector: 'app-hero',
  styleUrl: './hero.css',
  templateUrl: './hero.html',
})
export class Hero {
  private readonly portfolioService = inject(PortfolioService);

  readonly portfolio = rxResource<Portfolio, unknown>({
    stream: () => this.portfolioService.getPortfolio(),
  });

  readonly isLoading = this.portfolio.isLoading;
  readonly error = this.portfolio.error;
  readonly about = computed(() => this.portfolio.value()?.about);

  reload(): void {
    this.portfolio.reload();
  }
}

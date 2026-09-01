import { Component, computed, inject } from '@angular/core';
import { rxResource } from '@angular/core/rxjs-interop';
import { PortfolioService } from '../shared/services/portfolio.service';
import { Portfolio } from '../shared/models/portfolio.models';
import { GITHUB_URL } from '../shared/constants/portfolio-links';

export const ROLE_LABEL = 'FullStack Developer Jr';

@Component({
  imports: [],
  selector: 'app-hero',
  styleUrl: './hero.css',
  templateUrl: './hero.html',
})
export class Hero {
  readonly roleLabel = ROLE_LABEL;
  readonly githubUrl = GITHUB_URL;

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

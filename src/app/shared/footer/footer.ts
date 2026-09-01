import { Component, computed, inject } from '@angular/core';
import { rxResource } from '@angular/core/rxjs-interop';
import { PortfolioService } from '../services/portfolio.service';
import { Portfolio } from '../models/portfolio.models';
import { GITHUB_URL, LINKEDIN_URL } from '../constants/portfolio-links';

@Component({
  imports: [],
  selector: 'app-footer',
  templateUrl: './footer.html',
})
export class Footer {
  readonly githubUrl = GITHUB_URL;
  readonly linkedinUrl = LINKEDIN_URL;
  readonly currentYear = new Date().getFullYear();

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

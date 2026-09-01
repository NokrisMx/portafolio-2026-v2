import { Component, computed, inject } from '@angular/core';
import { rxResource } from '@angular/core/rxjs-interop';
import { PortfolioService } from '../shared/services/portfolio.service';
import { Portfolio } from '../shared/models/portfolio.models';
import { toAbsoluteAssetPath } from '../shared/utils/asset-path';

export const SECTION_TITLE = 'Experiencia';

@Component({
  imports: [],
  selector: 'app-experience',
  styleUrl: './experience.css',
  templateUrl: './experience.html',
})
export class Experience {
  readonly sectionTitle = SECTION_TITLE;

  private readonly portfolioService = inject(PortfolioService);

  readonly portfolio = rxResource<Portfolio, unknown>({
    stream: () => this.portfolioService.getPortfolio(),
  });

  readonly isLoading = this.portfolio.isLoading;
  readonly error = this.portfolio.error;
  readonly experiencia = computed(() => this.portfolio.value()?.experiencia ?? []);

  reload(): void {
    this.portfolio.reload();
  }

  readonly toAbsoluteAssetPath = toAbsoluteAssetPath;
}

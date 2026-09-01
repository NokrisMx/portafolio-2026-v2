import { Component, computed, inject } from '@angular/core';
import { rxResource } from '@angular/core/rxjs-interop';
import { PortfolioService } from '../shared/services/portfolio.service';
import { Portfolio } from '../shared/models/portfolio.models';
import { Chip } from '../shared/chip/chip';

export const SECTION_TITLE = 'Habilidades';

@Component({
  imports: [Chip],
  selector: 'app-skills',
  styleUrl: './skills.css',
  templateUrl: './skills.html',
})
export class Skills {
  readonly sectionTitle = SECTION_TITLE;

  private readonly portfolioService = inject(PortfolioService);

  readonly portfolio = rxResource<Portfolio, unknown>({
    stream: () => this.portfolioService.getPortfolio(),
  });

  readonly isLoading = this.portfolio.isLoading;
  readonly error = this.portfolio.error;
  readonly habilidades = computed(() => this.portfolio.value()?.habilidades ?? []);

  reload(): void {
    this.portfolio.reload();
  }
}

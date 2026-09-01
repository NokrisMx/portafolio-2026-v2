import { Component, computed, inject } from '@angular/core';
import { rxResource } from '@angular/core/rxjs-interop';
import { PortfolioService } from '../shared/services/portfolio.service';
import { Portfolio } from '../shared/models/portfolio.models';
import { ProjectCard } from './project-card/project-card';

export const SECTION_TITLE = 'Proyectos';

@Component({
  imports: [ProjectCard],
  selector: 'app-projects',
  templateUrl: './projects.html',
})
export class Projects {
  readonly sectionTitle = SECTION_TITLE;

  private readonly portfolioService = inject(PortfolioService);

  readonly portfolio = rxResource<Portfolio, unknown>({
    stream: () => this.portfolioService.getPortfolio(),
  });

  readonly isLoading = this.portfolio.isLoading;
  readonly error = this.portfolio.error;
  readonly proyectos = computed(() => this.portfolio.value()?.proyectos ?? []);

  reload(): void {
    this.portfolio.reload();
  }
}

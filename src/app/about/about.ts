import { Component, computed, inject } from '@angular/core';
import { rxResource } from '@angular/core/rxjs-interop';
import { PortfolioService } from '../shared/services/portfolio.service';
import { About as AboutModel, Portfolio } from '../shared/models/portfolio.models';

export const SECTION_TITLE = 'Sobre mí';
export const CV_BUTTON_LABEL = 'Descargar CV';

@Component({
  imports: [],
  selector: 'app-about',
  templateUrl: './about.html',
})
export class About {
  readonly sectionTitle = SECTION_TITLE;
  readonly cvButtonLabel = CV_BUTTON_LABEL;

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

import { Component, input } from '@angular/core';
import { Proyecto } from '../../shared/models/portfolio.models';
import { toAbsoluteAssetPath } from '../../shared/utils/asset-path';
import { Chip } from '../../shared/chip/chip';

@Component({
  imports: [Chip],
  selector: 'app-project-card',
  styleUrl: './project-card.css',
  templateUrl: './project-card.html',
})
export class ProjectCard {
  readonly project = input.required<Proyecto>();

  readonly toAbsoluteAssetPath = toAbsoluteAssetPath;
}

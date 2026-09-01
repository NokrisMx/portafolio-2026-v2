import { Component, input } from '@angular/core';

@Component({
  imports: [],
  selector: 'app-chip',
  templateUrl: './chip.html',
})
export class Chip {
  readonly label = input.required<string>();
  readonly size = input<'sm' | 'md'>('sm');
}

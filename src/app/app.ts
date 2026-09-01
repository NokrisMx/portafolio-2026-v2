import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { Header } from './shared/header/header';
import { Hero } from './hero/hero';
import { About } from './about/about';
import { Experience } from './experience/experience';
import { Projects } from './projects/projects';

@Component({
  imports: [RouterOutlet, Header, Hero, About, Experience, Projects],
  selector: 'app-root',
  styleUrl: './app.css',
  templateUrl: './app.html',
})
export class App {}

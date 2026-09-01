import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { Header } from './shared/header/header';
import { Hero } from './hero/hero';
import { About } from './about/about';
import { Experience } from './experience/experience';
import { Projects } from './projects/projects';
import { Skills } from './skills/skills';
import { Educacion } from './educacion/educacion';

@Component({
  imports: [RouterOutlet, Header, Hero, About, Experience, Projects, Skills, Educacion],
  selector: 'app-root',
  styleUrl: './app.css',
  templateUrl: './app.html',
})
export class App {}

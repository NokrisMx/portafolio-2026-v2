import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ProjectCard } from './project-card';
import { Proyecto } from '../../shared/models/portfolio.models';

describe('ProjectCard', () => {
  it('renders project name, description and image', () => {
    const project = mockProject();
    const { compiled } = setup(project);

    expect(compiled.textContent).toContain(project.nombre);
    expect(compiled.textContent).toContain(project.descripcion);

    const image = compiled.querySelector<HTMLImageElement>('img');
    expect(image?.getAttribute('src')).toBe('/assets/images/blackjack.jpg');
    expect(image?.getAttribute('alt')).toBe(project.nombre);
  });

  it('renders a chip per technology', () => {
    const project = mockProject();
    const { compiled } = setup(project);

    const chips = compiled.querySelectorAll('span.border.border-outline-variant.rounded-full');
    expect(chips.length).toBe(project.tecnologias.length);

    for (const tech of project.tecnologias) {
      expect(compiled.textContent).toContain(tech);
    }
  });

  it('renders GitHub anchor with external link attributes', () => {
    const project = mockProject();
    const { compiled } = setup(project);

    const githubLink = compiled.querySelector<HTMLAnchorElement>('a[href="' + project.github + '"]');
    expect(githubLink).toBeTruthy();
    expect(githubLink?.getAttribute('target')).toBe('_blank');
    expect(githubLink?.getAttribute('rel')).toBe('noopener noreferrer');
    expect(githubLink?.textContent?.trim()).toBe('GitHub');
  });

  it('renders Ver demo anchor when demo is present', () => {
    const project = mockProject();
    const { compiled } = setup(project);

    const demoLink = compiled.querySelector<HTMLAnchorElement>('a[href="' + project.demo + '"]');
    expect(demoLink).toBeTruthy();
    expect(demoLink?.getAttribute('target')).toBe('_blank');
    expect(demoLink?.getAttribute('rel')).toBe('noopener noreferrer');
    expect(demoLink?.textContent?.trim()).toBe('Ver demo');
  });

  it('does not render Ver demo anchor when demo is empty', () => {
    const project = { ...mockProject(), demo: '' };
    const { compiled } = setup(project);

    const demoLink = compiled.querySelector<HTMLAnchorElement>('a[href=""]');
    expect(demoLink).toBeFalsy();
    expect(compiled.textContent).not.toContain('Ver demo');
  });

  it('normalizes image src when path lacks leading slash', () => {
    const project = { ...mockProject(), image: 'assets/images/petcute.jpg' };
    const { compiled } = setup(project);

    const image = compiled.querySelector<HTMLImageElement>('img');
    expect(image?.getAttribute('src')).toBe('/assets/images/petcute.jpg');
  });

  function setup(project: Proyecto): {
    fixture: ComponentFixture<ProjectCard>;
    compiled: HTMLElement;
  } {
    TestBed.configureTestingModule({
      imports: [ProjectCard],
    });

    const fixture = TestBed.createComponent(ProjectCard);
    fixture.componentRef.setInput('project', project);
    fixture.detectChanges();

    return { fixture, compiled: fixture.nativeElement as HTMLElement };
  }
});

function mockProject(): Proyecto {
  return {
    nombre: 'Blackjack',
    descripcion: 'Juego de Blackjack interactivo construido con Angular.',
    tecnologias: ['Angular', 'TypeScript'],
    github: 'https://github.com/example/blackjack',
    demo: 'https://blackjack.example.com',
    image: '/assets/images/blackjack.jpg',
  };
}

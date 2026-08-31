import { Component, HostListener, signal } from '@angular/core';

interface NavItem {
  id: string;
  label: string;
}

const NAV_ITEMS: NavItem[] = [
  { id: 'inicio', label: 'Inicio' },
  { id: 'sobre-mi', label: 'Sobre mí' },
  { id: 'experiencia', label: 'Experiencia' },
  { id: 'proyectos', label: 'Proyectos' },
  { id: 'habilidades', label: 'Habilidades' },
  { id: 'educacion', label: 'Educación' },
];

const CONTACT_EMAIL = 'guevaraaldo44@gmail.com';
const BRAND_NAME = 'Aldo Guevara Muñoz';

@Component({
  selector: 'app-header',
  templateUrl: './header.html',
  styleUrl: './header.css',
})
export class Header {
  protected readonly brandName = BRAND_NAME;
  protected readonly navItems = NAV_ITEMS;
  protected readonly contactHref = `mailto:${CONTACT_EMAIL}`;
  protected readonly contactLabel = 'Contacto';

  readonly activeSection = signal('inicio');
  readonly menuOpen = signal(false);

  @HostListener('window:scroll')
  onWindowScroll(): void {
    const scrollY = window.scrollY;
    let current = 'inicio';

    for (const item of NAV_ITEMS) {
      const section = document.getElementById(item.id);
      if (!section) {
        continue;
      }
      const sectionTop = section.offsetTop;
      const sectionHeight = section.clientHeight;
      if (scrollY >= sectionTop - sectionHeight / 3) {
        current = item.id;
      }
    }

    this.activeSection.set(current);
  }

  @HostListener('document:keydown', ['$event'])
  onKeydown(event: KeyboardEvent): void {
    if (event.key === 'Escape') {
      this.closeMenu();
    }
  }

  protected toggleMenu(): void {
    this.menuOpen.update((open) => !open);
  }

  protected closeMenu(): void {
    this.menuOpen.set(false);
  }

  protected isActive(id: string): boolean {
    return this.activeSection() === id;
  }

  protected linkClasses(id: string): string {
    const base = 'pb-1 border-b-2 transition-colors hover:text-primary font-body-md text-body-md';
    return this.isActive(id)
      ? `${base} text-primary font-bold border-primary`
      : `${base} text-secondary border-transparent`;
  }

  protected mobileLinkClasses(id: string): string {
    const base =
      'block py-2 pl-3 border-l-4 transition-colors hover:text-primary font-body-md text-body-md';
    return this.isActive(id)
      ? `${base} text-primary font-bold border-primary`
      : `${base} text-secondary border-transparent`;
  }
}

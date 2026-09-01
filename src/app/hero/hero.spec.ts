import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Hero } from './hero';

describe('Hero', () => {
  it('creates', () => {
    const { fixture } = setup();
    expect(fixture.componentInstance).toBeTruthy();
  });

  it('renders section with id inicio', () => {
    const { compiled } = setup();
    expect(compiled.querySelector('section#inicio')).toBeTruthy();
  });
});

function setup(): { fixture: ComponentFixture<Hero>; compiled: HTMLElement } {
  const fixture = TestBed.createComponent(Hero);
  fixture.detectChanges();
  return { fixture, compiled: fixture.nativeElement as HTMLElement };
}

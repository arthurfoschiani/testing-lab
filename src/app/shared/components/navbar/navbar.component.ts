import { Component } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [RouterLink, RouterLinkActive],
  template: `
    <nav class="navbar">
      <a routerLink="/" class="logo">
        <span class="logo-icon">🧪</span>
        <span class="logo-text">Testing<strong>Lab</strong></span>
      </a>

      <div class="nav-links">
        <a routerLink="/inicio" routerLinkActive="active">Início</a>
        <a routerLink="/fundamentos" routerLinkActive="active">Fundamentos</a>
        <a routerLink="/matchers" routerLinkActive="active">Matchers</a>
        <a routerLink="/spies" routerLinkActive="active">Spies & Mocks</a>
        <a routerLink="/angular" routerLinkActive="active">Testando Angular</a>
        <a routerLink="/playground" routerLinkActive="active">Playground</a>
        <a routerLink="/cheatsheet" routerLinkActive="active">Cheatsheet</a>
      </div>

      <a class="repo-chip" href="https://angular.dev/guide/testing" target="_blank" rel="noopener">
        Docs oficiais ↗
      </a>
    </nav>
  `,
  styles: [`
    .navbar {
      position: fixed;
      top: 0;
      left: 0;
      right: 0;
      height: var(--navbar-height);
      background: rgba(10,17,24,0.85);
      backdrop-filter: blur(12px);
      border-bottom: 1px solid var(--border);
      display: flex;
      align-items: center;
      padding: 0 28px;
      gap: 28px;
      z-index: 100;
    }
    .logo {
      display: flex;
      align-items: center;
      gap: 10px;
      font-size: 18px;
      color: var(--text);
      text-decoration: none;
      .logo-icon { font-size: 22px; }
      strong { color: var(--primary-light); }
    }
    .nav-links {
      display: flex;
      align-items: center;
      gap: 4px;
      flex: 1;
      overflow-x: auto;

      a {
        padding: 6px 14px;
        border-radius: var(--radius-sm);
        color: var(--text-muted);
        font-size: 14px;
        font-weight: 500;
        transition: all var(--transition);
        text-decoration: none;
        white-space: nowrap;

        &:hover { color: var(--text); background: rgba(255,255,255,0.05); }
        &.active { color: var(--primary-light); background: rgba(16,185,129,0.12); }
      }
    }
    .repo-chip {
      font-size: 13px;
      font-weight: 500;
      color: var(--text-muted);
      padding: 6px 14px;
      border: 1px solid var(--border);
      border-radius: 20px;
      white-space: nowrap;
      &:hover { color: var(--text); border-color: var(--text-muted); }
    }
    @media (max-width: 720px) {
      .navbar { padding: 0 16px; gap: 14px; }
      .repo-chip { display: none; }
    }
  `]
})
export class NavbarComponent {}

import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    redirectTo: 'inicio',
    pathMatch: 'full',
  },
  {
    path: 'inicio',
    loadComponent: () =>
      import('./features/home/home.component').then(m => m.HomeComponent),
    title: 'Testing Lab · Início',
  },
  {
    path: 'fundamentos',
    loadComponent: () =>
      import('./features/fundamentos/fundamentos.component').then(m => m.FundamentosComponent),
    title: 'Fundamentos · Testing Lab',
  },
  {
    path: 'matchers',
    loadComponent: () =>
      import('./features/matchers/matchers-list.component').then(m => m.MatchersListComponent),
    title: 'Matchers · Testing Lab',
  },
  {
    path: 'matchers/:id',
    loadComponent: () =>
      import('./features/matchers/matcher-detail.component').then(m => m.MatcherDetailComponent),
    title: 'Matcher · Testing Lab',
  },
  {
    path: 'spies',
    loadComponent: () =>
      import('./features/spies/spies.component').then(m => m.SpiesComponent),
    title: 'Spies & Mocks · Testing Lab',
  },
  {
    path: 'angular',
    loadComponent: () =>
      import('./features/angular/angular-testing.component').then(m => m.AngularTestingComponent),
    title: 'Testando Angular · Testing Lab',
  },
  {
    path: 'playground',
    loadComponent: () =>
      import('./features/playground/playground.component').then(m => m.PlaygroundComponent),
    title: 'Playground · Testing Lab',
  },
  {
    path: 'cheatsheet',
    loadComponent: () =>
      import('./features/cheatsheet/cheatsheet.component').then(m => m.CheatsheetComponent),
    title: 'Cheatsheet · Testing Lab',
  },
  {
    path: '**',
    redirectTo: 'inicio',
  },
];

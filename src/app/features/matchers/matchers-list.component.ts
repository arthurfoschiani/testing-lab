import { Component, computed, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { MATCHERS } from '../../shared/data/matchers.data';
import { MATCHER_CATEGORIES, MatcherCategoryId, matcherCategoryById } from '../../shared/models/testing.model';

@Component({
  selector: 'app-matchers-list',
  standalone: true,
  imports: [RouterLink, FormsModule],
  template: `
    <div class="page page-fade">
      <div class="page-header">
        <h1>Matchers</h1>
        <p>
          O dicionário das verificações. Um <strong>matcher</strong> é o que vem depois do
          <code>expect(...)</code> e decide se o teste passa: <code>.toBe()</code>, <code>.toEqual()</code>,
          <code>.toContain()</code>... Clique em qualquer um para ver a explicação e a suíte rodando ao vivo.
        </p>
      </div>

      <div class="toolbar">
        <input
          class="search"
          type="text"
          placeholder="🔍 Buscar matcher (ex.: toEqual, throw, called)…"
          [ngModel]="query()"
          (ngModelChange)="query.set($event)"
        />
        <div class="filters">
          <button class="chip" [class.active]="active() === 'all'" (click)="active.set('all')">Todos</button>
          @for (cat of categories; track cat.id) {
            <button class="chip" [class.active]="active() === cat.id" (click)="active.set(cat.id)">
              {{ cat.icon }} {{ cat.label }}
            </button>
          }
        </div>
      </div>

      @if (active() !== 'all') {
        <p class="cat-desc">{{ catDescription() }}</p>
      }

      <div class="grid grid-3">
        @for (m of filtered(); track m.id) {
          <a class="m-card" [routerLink]="['/matchers', m.id]">
            <div class="m-top">
              <code class="m-name">{{ m.name }}</code>
              <span class="badge" [class]="badgeClass(m.category)">{{ catLabel(m.category) }}</span>
            </div>
            <p class="m-summary">{{ m.summary }}</p>
            <code class="m-sig">{{ m.signature }}</code>
          </a>
        } @empty {
          <p class="empty">Nenhum matcher encontrado para “{{ query() }}”.</p>
        }
      </div>
    </div>
  `,
  styles: [`
    .toolbar { margin-bottom: 24px; display: flex; flex-direction: column; gap: 16px; }
    .search {
      width: 100%;
      padding: 12px 16px;
      background: var(--bg-card);
      border: 1px solid var(--border);
      border-radius: var(--radius-sm);
      color: var(--text);
      font-size: 15px;
      font-family: inherit;
      &:focus { outline: none; border-color: var(--primary); }
      &::placeholder { color: var(--text-muted); }
    }
    .filters { display: flex; flex-wrap: wrap; gap: 8px; }
    .chip {
      padding: 6px 14px;
      border-radius: 20px;
      border: 1px solid var(--border);
      background: var(--bg-card);
      color: var(--text-muted);
      font-size: 13px;
      font-weight: 500;
      transition: all var(--transition);
      &:hover { color: var(--text); border-color: var(--text-muted); }
      &.active { background: rgba(16,185,129,0.15); color: var(--primary-light); border-color: var(--primary); }
    }
    .cat-desc { color: var(--text-muted); margin-bottom: 20px; max-width: 760px; line-height: 1.6; }
    .m-card {
      display: flex;
      flex-direction: column;
      gap: 10px;
      background: var(--bg-card);
      border: 1px solid var(--border);
      border-radius: var(--radius);
      padding: 20px;
      text-decoration: none;
      transition: all var(--transition);
      &:hover { border-color: var(--primary); transform: translateY(-2px); box-shadow: var(--shadow); }
    }
    .m-top { display: flex; align-items: center; justify-content: space-between; gap: 8px; }
    .m-name { font-size: 15px; font-weight: 700; background: rgba(16,185,129,0.14); }
    .m-summary { font-size: 13px; color: var(--text-muted); line-height: 1.55; flex: 1; }
    .m-sig {
      font-size: 11.5px;
      background: var(--bg-code);
      color: var(--accent-light);
      padding: 6px 10px;
      border-radius: 6px;
      border: 1px solid var(--border);
      display: block;
      overflow-x: auto;
      white-space: nowrap;
    }
    .empty { color: var(--text-muted); grid-column: 1 / -1; padding: 30px 0; }
  `]
})
export class MatchersListComponent {
  categories = MATCHER_CATEGORIES;
  query = signal('');
  active = signal<MatcherCategoryId | 'all'>('all');

  filtered = computed(() => {
    const q = this.query().trim().toLowerCase();
    const cat = this.active();
    return MATCHERS.filter(m => {
      const matchCat = cat === 'all' || m.category === cat;
      const matchQuery = !q ||
        m.name.toLowerCase().includes(q) ||
        m.summary.toLowerCase().includes(q) ||
        m.signature.toLowerCase().includes(q);
      return matchCat && matchQuery;
    });
  });

  catDescription = computed(() => {
    const cat = this.active();
    return cat === 'all' ? '' : matcherCategoryById(cat as MatcherCategoryId).description;
  });

  catLabel(id: MatcherCategoryId): string {
    return matcherCategoryById(id).label;
  }

  badgeClass(id: MatcherCategoryId): string {
    const map: Record<MatcherCategoryId, string> = {
      equality: 'badge-primary',
      truthiness: 'badge-accent',
      numbers: 'badge-info',
      collections: 'badge-warning',
      exceptions: 'badge-danger',
      spies: 'badge-success',
    };
    return map[id];
  }
}

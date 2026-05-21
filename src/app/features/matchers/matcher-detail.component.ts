import { Component, Input, computed, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { TestRunnerComponent } from '../../shared/components/test-runner/test-runner.component';
import { MATCHERS, matcherById } from '../../shared/data/matchers.data';
import { matcherCategoryById } from '../../shared/models/testing.model';

@Component({
  selector: 'app-matcher-detail',
  standalone: true,
  imports: [RouterLink, TestRunnerComponent],
  template: `
    @if (doc(); as m) {
      <div class="page page-fade detail">
        <a routerLink="/matchers" class="back">← Todos os matchers</a>

        <div class="head">
          <div>
            <code class="name">{{ m.name }}</code>
            <span class="badge badge-muted">{{ catLabel(m.category) }}</span>
          </div>
          <p class="summary">{{ m.summary }}</p>
          <code class="sig">{{ m.signature }}</code>
        </div>

        <div class="desc card">{{ m.description }}</div>

        <h2 class="block-title">Veja rodando</h2>
        <app-test-runner [code]="m.code" [suite]="m.suite" [hint]="m.hint ?? ''" />

        @if (m.tips?.length) {
          <div class="tips">
            <h3>💡 Dicas</h3>
            <ul>
              @for (tip of m.tips; track tip) { <li>{{ tip }}</li> }
            </ul>
          </div>
        }

        @if (related().length) {
          <div class="related">
            <h3>Relacionados</h3>
            <div class="rel-links">
              @for (r of related(); track r.id) {
                <a [routerLink]="['/matchers', r.id]" class="rel-chip">
                  <code>{{ r.name }}</code>
                  <span>{{ r.summary }}</span>
                </a>
              }
            </div>
          </div>
        }
      </div>
    } @else {
      <div class="page">
        <p>Matcher não encontrado. <a routerLink="/matchers">Voltar à lista</a>.</p>
      </div>
    }
  `,
  styles: [`
    .detail { max-width: 880px; }
    .back { display: inline-block; margin-bottom: 20px; font-size: 14px; color: var(--text-muted); &:hover { color: var(--primary-light); } }
    .head { margin-bottom: 24px; }
    .head > div { display: flex; align-items: center; gap: 12px; margin-bottom: 12px; }
    .name { font-size: 24px; font-weight: 800; background: rgba(16,185,129,0.14); padding: 4px 12px; }
    .summary { color: var(--text-muted); font-size: 16px; margin-bottom: 12px; }
    .sig {
      display: inline-block;
      font-size: 13px;
      background: var(--bg-code);
      color: var(--accent-light);
      padding: 8px 14px;
      border-radius: 8px;
      border: 1px solid var(--border);
    }
    .desc { line-height: 1.8; color: var(--text); margin-bottom: 28px; }
    .block-title { font-size: 18px; font-weight: 700; margin-bottom: 16px; }
    .tips {
      margin-top: 24px;
      background: rgba(139,92,246,0.08);
      border: 1px solid rgba(139,92,246,0.25);
      border-radius: var(--radius);
      padding: 18px 22px;
      h3 { font-size: 15px; margin-bottom: 10px; color: var(--accent-light); }
      ul { margin: 0; padding-left: 20px; }
      li { color: var(--text-muted); margin-bottom: 6px; line-height: 1.6; }
    }
    .related { margin-top: 28px; h3 { font-size: 15px; margin-bottom: 12px; } }
    .rel-links { display: flex; flex-direction: column; gap: 10px; }
    .rel-chip {
      display: flex; flex-direction: column; gap: 4px;
      padding: 12px 16px;
      background: var(--bg-card);
      border: 1px solid var(--border);
      border-radius: var(--radius-sm);
      text-decoration: none;
      transition: all var(--transition);
      &:hover { border-color: var(--primary); }
      code { background: none; color: var(--primary-light); font-weight: 700; padding: 0; }
      span { font-size: 13px; color: var(--text-muted); }
    }
  `]
})
export class MatcherDetailComponent {
  private _id = signal<string>('');
  /** vem do router via withComponentInputBinding() */
  @Input() set id(value: string) { this._id.set(value); }

  doc = computed(() => matcherById(this._id()));

  related = computed(() => {
    const ids = this.doc()?.related ?? [];
    return ids.map(id => MATCHERS.find(m => m.id === id)).filter((m): m is NonNullable<typeof m> => !!m);
  });

  catLabel(id: Parameters<typeof matcherCategoryById>[0]): string {
    return matcherCategoryById(id).label;
  }
}

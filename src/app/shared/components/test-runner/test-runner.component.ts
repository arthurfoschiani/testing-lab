import { Component, Input, signal } from '@angular/core';
import { CodeBlockComponent } from '../code-block/code-block.component';
import { RunReport, SpecReport, TestApi, runSuite } from '../../lib/mini-jasmine';

type Phase = 'idle' | 'running' | 'done';

// Roda uma suíte ao vivo e mostra resumo, árvore de specs com cada expectativa e o console.
@Component({
  selector: 'app-test-runner',
  standalone: true,
  imports: [CodeBlockComponent],
  template: `
    <div class="runner">
      @if (code) {
        <app-code-block [code]="code" [title]="title" />
      }

      @if (hint) {
        <p class="hint">💡 {{ hint }}</p>
      }

      <div class="controls">
        <button class="btn btn-primary btn-sm" (click)="run()" [disabled]="phase() === 'running'">
          ▶ Rodar testes
        </button>
        <button class="btn btn-ghost btn-sm" (click)="clear()" [disabled]="phase() === 'idle'">
          ✕ Limpar
        </button>

        @if (report(); as r) {
          <span class="summary" [class.ok]="r.failed === 0" [class.bad]="r.failed > 0">
            {{ r.passed }}/{{ r.total }} ✓
            @if (r.failed > 0) { · {{ r.failed }} ✕ }
            @if (r.skipped > 0) { · {{ r.skipped }} ⊘ }
            <span class="dur">{{ r.durationMs }}ms</span>
          </span>
        }
      </div>

      @if (report(); as r) {
        <div class="results card">
          @for (spec of r.specs; track spec.fullName + $index) {
            <div class="spec" [class]="spec.status">
              <div class="spec-head">
                <span class="icon">{{ icon(spec) }}</span>
                <span class="path">
                  @for (p of spec.describePath; track $index) {
                    <span class="seg">{{ p }}</span><span class="sep">›</span>
                  }
                  <span class="name">{{ spec.name }}</span>
                </span>
                @if (spec.status !== 'skipped') {
                  <span class="spec-dur">{{ spec.durationMs }}ms</span>
                }
              </div>

              @if (spec.expectations.length) {
                <div class="expectations">
                  @for (e of spec.expectations; track $index) {
                    <div class="exp" [class.pass]="e.pass" [class.fail]="!e.pass">
                      <span class="exp-icon">{{ e.pass ? '✓' : '✕' }}</span>
                      <code class="exp-matcher">{{ e.matcher }}</code>
                      <span class="exp-msg">{{ e.message }}</span>
                    </div>
                  }
                </div>
              }

              @if (spec.error) {
                <div class="spec-error">⚠ {{ spec.error }}</div>
              }
            </div>
          }
        </div>

        @if (r.logs.length) {
          <div class="console">
            <div class="console-head">console.log</div>
            @for (line of r.logs; track $index) {
              <div class="log-line">{{ line }}</div>
            }
          </div>
        }
      }
    </div>
  `,
  styles: [`
    .runner { display: flex; flex-direction: column; gap: 14px; }
    .hint {
      font-size: 13px;
      color: var(--accent-light);
      background: rgba(139,92,246,0.1);
      border: 1px solid rgba(139,92,246,0.25);
      padding: 8px 12px;
      border-radius: var(--radius-sm);
    }
    .controls { display: flex; align-items: center; gap: 8px; flex-wrap: wrap; }
    .summary {
      margin-left: auto;
      font-size: 13px;
      font-weight: 700;
      font-family: 'Fira Code', monospace;
      padding: 4px 12px;
      border-radius: 20px;
      display: inline-flex;
      gap: 8px;
      align-items: center;
      &.ok { color: #6ee7b7; background: rgba(16,185,129,0.15); }
      &.bad { color: #fca5a5; background: rgba(239,68,68,0.15); }
      .dur { opacity: 0.7; font-weight: 500; }
    }
    .results { padding: 0; overflow: hidden; }
    .spec {
      padding: 12px 16px;
      border-bottom: 1px solid var(--border);
      border-left: 3px solid transparent;
      &:last-child { border-bottom: none; }
      &.pass { border-left-color: var(--pass); }
      &.fail { border-left-color: var(--fail); background: rgba(239,68,68,0.04); }
      &.skipped { border-left-color: var(--skip); opacity: 0.7; }
    }
    .spec-head { display: flex; align-items: center; gap: 10px; font-size: 14px; }
    .spec-head .icon { font-size: 14px; }
    .spec.pass .icon { color: var(--pass); }
    .spec.fail .icon { color: var(--fail); }
    .spec.skipped .icon { color: var(--skip); }
    .path { display: inline-flex; align-items: center; gap: 6px; flex-wrap: wrap; flex: 1; }
    .path .seg { color: var(--text-muted); font-size: 13px; }
    .path .sep { color: var(--border); }
    .path .name { color: var(--text); font-weight: 600; }
    .spec-dur { font-family: 'Fira Code', monospace; font-size: 11px; color: var(--text-muted); }
    .expectations { margin: 8px 0 0 24px; display: flex; flex-direction: column; gap: 4px; }
    .exp {
      display: flex;
      align-items: baseline;
      gap: 8px;
      font-size: 12.5px;
      font-family: 'Fira Code', monospace;
    }
    .exp.pass .exp-icon { color: var(--pass); }
    .exp.fail .exp-icon { color: var(--fail); }
    .exp-matcher { background: rgba(139,92,246,0.14); color: var(--accent-light); font-size: 11px; }
    .exp.fail .exp-msg { color: #fca5a5; }
    .exp.pass .exp-msg { color: var(--text-muted); }
    .spec-error {
      margin: 8px 0 0 24px;
      font-family: 'Fira Code', monospace;
      font-size: 12px;
      color: #fca5a5;
      background: rgba(239,68,68,0.08);
      padding: 6px 10px;
      border-radius: 6px;
    }
    .console {
      background: var(--bg-code);
      border: 1px solid var(--border);
      border-radius: var(--radius);
      font-family: 'Fira Code', monospace;
      font-size: 12.5px;
      overflow: hidden;
    }
    .console-head {
      padding: 6px 14px;
      font-size: 11px;
      text-transform: uppercase;
      letter-spacing: 1px;
      color: var(--text-muted);
      border-bottom: 1px solid var(--border);
      background: rgba(255,255,255,0.02);
    }
    .log-line { padding: 4px 14px; color: var(--text); border-bottom: 1px solid rgba(255,255,255,0.03); }
    .log-line:last-child { border-bottom: none; }
  `]
})
export class TestRunnerComponent {
  /** Função que monta as suítes usando a API injetada (describe/it/expect...). */
  @Input({ required: true }) suite!: (t: TestApi) => void;
  @Input() code = '';
  @Input() title = 'exemplo.spec.ts';
  @Input() hint = '';
  /** Roda automaticamente assim que o componente aparece. */
  @Input() autoRun = false;

  report = signal<RunReport | null>(null);
  phase = signal<Phase>('idle');

  ngOnInit(): void {
    if (this.autoRun) this.run();
  }

  async run(): Promise<void> {
    this.phase.set('running');
    this.report.set(null);
    const result = await runSuite(this.suite);
    this.report.set(result);
    this.phase.set('done');
  }

  clear(): void {
    this.report.set(null);
    this.phase.set('idle');
  }

  icon(spec: SpecReport): string {
    return spec.status === 'pass' ? '✓' : spec.status === 'fail' ? '✕' : '⊘';
  }
}

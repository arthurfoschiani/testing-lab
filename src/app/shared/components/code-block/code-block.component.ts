import { Component, Input } from '@angular/core';

/** Bloco de código estilizado (cabeçalho com "dots" tipo macOS + título). */
@Component({
  selector: 'app-code-block',
  standalone: true,
  template: `
    <div class="code-block">
      <div class="code-header">
        <span class="dot red"></span>
        <span class="dot yellow"></span>
        <span class="dot green"></span>
        <span class="code-title">{{ title }}</span>
      </div>
      <pre><code>{{ code }}</code></pre>
    </div>
  `,
  styles: [`
    .code-block {
      background: var(--bg-code);
      border: 1px solid var(--border);
      border-radius: var(--radius);
      overflow: hidden;
    }
    .code-header {
      display: flex;
      align-items: center;
      gap: 6px;
      padding: 10px 16px;
      border-bottom: 1px solid var(--border);
      background: rgba(255,255,255,0.02);

      .dot { width: 11px; height: 11px; border-radius: 50%; }
      .red { background: #ef4444; }
      .yellow { background: #f59e0b; }
      .green { background: #10b981; }
      .code-title { margin-left: 8px; font-size: 12px; color: var(--text-muted); font-family: 'Fira Code', monospace; }
    }
    pre {
      margin: 0;
      padding: 18px 20px;
      font-family: 'Fira Code', monospace;
      font-size: 12.5px;
      color: #a7f3d0;
      line-height: 1.75;
      overflow-x: auto;
      white-space: pre;
    }
  `]
})
export class CodeBlockComponent {
  @Input() code = '';
  @Input() title = 'exemplo.spec.ts';
}

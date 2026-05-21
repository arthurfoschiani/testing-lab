import { Component, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { TestRunnerComponent } from '../../shared/components/test-runner/test-runner.component';
import { TestApi } from '../../shared/lib/mini-jasmine';

interface Preset {
  label: string;
  code: string;
}

@Component({
  selector: 'app-playground',
  standalone: true,
  imports: [FormsModule, TestRunnerComponent],
  template: `
    <div class="page page-fade">
      <div class="page-header">
        <h1>Playground</h1>
        <p>
          Escreva seus próprios testes e rode na hora. Use <code>describe</code>, <code>it</code>,
          <code>expect</code>, <code>beforeEach</code>, <code>createSpy</code> e <code>spyOn</code>,
          exatamente como no Jasmine. Dica: quebre um teste de propósito e veja como o
          vermelho explica o que falhou.
        </p>
      </div>

      <div class="presets">
        <span class="label">Carregar exemplo:</span>
        @for (p of presets; track p.label) {
          <button class="chip" (click)="load(p)">{{ p.label }}</button>
        }
      </div>

      <div class="editor-wrap">
        <div class="editor-head">
          <span class="dot red"></span><span class="dot yellow"></span><span class="dot green"></span>
          <span class="editor-title">meu-teste.spec.js</span>
        </div>
        <textarea
          class="editor"
          spellcheck="false"
          [ngModel]="code()"
          (ngModelChange)="code.set($event)"
          rows="18"
        ></textarea>
      </div>

      <div class="run-area">
        <app-test-runner [code]="''" [suite]="suiteFn" />
      </div>

      <div class="callout info">
        ℹ️ O Playground roda JavaScript puro (sem tipos do TypeScript) através de um mini-Jasmine.
        Matchers disponíveis: <code>toBe</code>, <code>toEqual</code>, <code>toBeTruthy/Falsy</code>,
        <code>toBeNull/Undefined/Defined</code>, <code>toContain</code>, <code>toHaveSize</code>,
        <code>toBeGreaterThan/LessThan</code>, <code>toBeCloseTo</code>, <code>toMatch</code>,
        <code>toThrow/toThrowError</code>, <code>toHaveBeenCalled[Times/With]</code>, todos com <code>.not</code>.
      </div>
    </div>
  `,
  styles: [`
    .presets { display: flex; flex-wrap: wrap; align-items: center; gap: 8px; margin-bottom: 16px; }
    .presets .label { font-size: 13px; color: var(--text-muted); margin-right: 4px; }
    .chip {
      padding: 6px 14px;
      border-radius: 20px;
      border: 1px solid var(--border);
      background: var(--bg-card);
      color: var(--text-muted);
      font-size: 13px;
      font-weight: 500;
      transition: all var(--transition);
      &:hover { color: var(--primary-light); border-color: var(--primary); }
    }
    .editor-wrap {
      background: var(--bg-code);
      border: 1px solid var(--border);
      border-radius: var(--radius);
      overflow: hidden;
      margin-bottom: 16px;
    }
    .editor-head {
      display: flex; align-items: center; gap: 6px;
      padding: 10px 16px;
      border-bottom: 1px solid var(--border);
      background: rgba(255,255,255,0.02);
      .dot { width: 11px; height: 11px; border-radius: 50%; }
      .red { background: #ef4444; } .yellow { background: #f59e0b; } .green { background: #10b981; }
      .editor-title { margin-left: 8px; font-size: 12px; color: var(--text-muted); font-family: 'Fira Code', monospace; }
    }
    .editor {
      width: 100%;
      border: none;
      background: transparent;
      color: #a7f3d0;
      font-family: 'Fira Code', monospace;
      font-size: 13px;
      line-height: 1.7;
      padding: 16px 20px;
      resize: vertical;
      &:focus { outline: none; }
      &::selection { background: rgba(16,185,129,0.25); }
    }
    .run-area { margin-bottom: 24px; }
    .callout { line-height: 1.7; }
  `]
})
export class PlaygroundComponent {
  presets: Preset[] = [
    {
      label: 'Olá, testes',
      code: `describe('meu primeiro teste', () => {
  it('soma funciona', () => {
    expect(2 + 2).toBe(4);
  });

  it('experimente quebrar este!', () => {
    expect('angular').toContain('react'); // ✕ falha de propósito
  });
});`,
    },
    {
      label: 'beforeEach',
      code: `class Pilha {
  itens = [];
  push(x) { this.itens.push(x); }
  pop() { return this.itens.pop(); }
  get tamanho() { return this.itens.length; }
}

describe('Pilha', () => {
  let pilha;
  beforeEach(() => { pilha = new Pilha(); });

  it('empilha e conta', () => {
    pilha.push('a');
    pilha.push('b');
    expect(pilha.tamanho).toBe(2);
  });

  it('desempilha o último (LIFO)', () => {
    pilha.push('a');
    pilha.push('b');
    expect(pilha.pop()).toBe('b');
  });
});`,
    },
    {
      label: 'Spy',
      code: `describe('spy', () => {
  it('verifica chamada e argumentos', () => {
    const enviar = createSpy('enviar').and.returnValue('ok');

    const r = enviar('email', { para: 'a@b.com' });

    expect(r).toBe('ok');
    expect(enviar).toHaveBeenCalledTimes(1);
    expect(enviar).toHaveBeenCalledWith('email', { para: 'a@b.com' });
  });
});`,
    },
    {
      label: 'Exceção',
      code: `function idade(ano) {
  if (ano > 2025) throw new Error('Ano no futuro');
  return 2025 - ano;
}

describe('idade', () => {
  it('calcula a idade', () => {
    expect(idade(2000)).toBe(25);
  });
  it('rejeita ano futuro', () => {
    expect(() => idade(3000)).toThrowError('Ano no futuro');
  });
});`,
    },
    {
      label: 'Assíncrono',
      code: `function pegarDados() {
  return new Promise(res => setTimeout(() => res([1, 2, 3]), 120));
}

describe('async', () => {
  it('espera a promise', async () => {
    const dados = await pegarDados();
    expect(dados).toHaveSize(3);
    expect(dados).toContain(2);
  });
});`,
    },
  ];

  code = signal<string>(this.presets[0].code);

  /** Constrói a suíte executando o texto do editor como JS via new Function. */
  suiteFn = (t: TestApi): void => {
    const source = this.code();
    const fn = new Function(
      'describe', 'fdescribe', 'xdescribe',
      'it', 'fit', 'xit',
      'beforeEach', 'afterEach', 'beforeAll', 'afterAll',
      'expect', 'createSpy', 'spyOn', 'jasmine',
      source,
    );
    fn(
      t.describe, t.fdescribe, t.xdescribe,
      t.it, t.fit, t.xit,
      t.beforeEach, t.afterEach, t.beforeAll, t.afterAll,
      t.expect, t.createSpy, t.spyOn, t.jasmine,
    );
  };

  load(p: Preset): void {
    this.code.set(p.code);
  }
}

import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { MATCHERS } from '../../shared/data/matchers.data';

interface Row { code: string; desc: string; }
interface Section { title: string; icon: string; rows: Row[]; }

@Component({
  selector: 'app-cheatsheet',
  standalone: true,
  imports: [RouterLink],
  template: `
    <div class="page page-fade">
      <div class="page-header">
        <h1>Cheatsheet</h1>
        <p>Seu colinho de bolso. Tudo que você viu, resumido para consulta rápida no dia a dia.</p>
      </div>

      <div class="grid grid-2">
        @for (sec of sections; track sec.title) {
          <div class="cheat card">
            <h2>{{ sec.icon }} {{ sec.title }}</h2>
            <table>
              @for (row of sec.rows; track row.code) {
                <tr>
                  <td class="code-cell"><code>{{ row.code }}</code></td>
                  <td class="desc-cell">{{ row.desc }}</td>
                </tr>
              }
            </table>
          </div>
        }
      </div>

      <div class="matchers-quick card">
        <h2>🟰 Todos os matchers</h2>
        <p class="hint">Clique para ver cada um rodando ao vivo.</p>
        <div class="quick-grid">
          @for (m of matchers; track m.id) {
            <a [routerLink]="['/matchers', m.id]" class="quick-chip">
              <code>{{ m.name }}</code>
            </a>
          }
        </div>
      </div>
    </div>
  `,
  styles: [`
    .cheat {
      h2 { font-size: 16px; font-weight: 700; margin-bottom: 14px; }
      table { width: 100%; border-collapse: collapse; }
      tr { border-bottom: 1px solid var(--border); }
      tr:last-child { border-bottom: none; }
      td { padding: 8px 0; vertical-align: top; font-size: 13px; }
      .code-cell { white-space: nowrap; padding-right: 14px; }
      .code-cell code { background: var(--bg-code); color: var(--primary-light); font-size: 12px; border: 1px solid var(--border); }
      .desc-cell { color: var(--text-muted); line-height: 1.5; }
    }
    .matchers-quick {
      margin-top: 20px;
      h2 { font-size: 16px; font-weight: 700; margin-bottom: 4px; }
      .hint { font-size: 13px; color: var(--text-muted); margin-bottom: 16px; }
    }
    .quick-grid { display: flex; flex-wrap: wrap; gap: 8px; }
    .quick-chip {
      padding: 6px 12px;
      background: var(--bg-code);
      border: 1px solid var(--border);
      border-radius: 6px;
      text-decoration: none;
      transition: all var(--transition);
      &:hover { border-color: var(--primary); transform: translateY(-1px); }
      code { background: none; color: var(--primary-light); padding: 0; font-size: 12.5px; }
    }
  `]
})
export class CheatsheetComponent {
  matchers = MATCHERS;

  sections: Section[] = [
    {
      title: 'Estrutura',
      icon: '🧱',
      rows: [
        { code: "describe('grupo', fn)", desc: 'Agrupa testes relacionados (pode aninhar).' },
        { code: "it('faz X', fn)", desc: 'Um teste (spec). Também existe como alias test().' },
        { code: 'expect(valor)', desc: 'Inicia uma afirmação; encadeie um matcher.' },
        { code: 'expect(x).not.toBe(y)', desc: '.not inverte qualquer matcher.' },
      ],
    },
    {
      title: 'Hooks',
      icon: '🪝',
      rows: [
        { code: 'beforeEach(fn)', desc: 'Roda antes de CADA it. Ideal para preparar o cenário.' },
        { code: 'afterEach(fn)', desc: 'Roda depois de cada it. Limpeza.' },
        { code: 'beforeAll(fn)', desc: 'Roda UMA vez antes de todos os testes do bloco.' },
        { code: 'afterAll(fn)', desc: 'Roda UMA vez ao final do bloco.' },
      ],
    },
    {
      title: 'Pular & focar',
      icon: '🎯',
      rows: [
        { code: 'xit / xdescribe', desc: 'Pula o teste/grupo (aparece como pendente).' },
        { code: 'fit / fdescribe', desc: 'Foca: só os focados rodam. Cuidado em CI!' },
      ],
    },
    {
      title: 'Igualdade',
      icon: '🟰',
      rows: [
        { code: '.toBe(x)', desc: 'Identidade (===). Use para primitivos.' },
        { code: '.toEqual(x)', desc: 'Igualdade profunda. Use para objetos/arrays.' },
        { code: '.toBeCloseTo(x, casas)', desc: 'Floats com tolerância (0.1 + 0.2).' },
      ],
    },
    {
      title: 'Verdade & nulos',
      icon: '✅',
      rows: [
        { code: '.toBeTruthy() / Falsy()', desc: 'Valor truthy/falsy do JS.' },
        { code: '.toBeNull()', desc: 'Exatamente null.' },
        { code: '.toBeDefined() / Undefined()', desc: 'Verifica se foi definido.' },
        { code: '.toBeNaN()', desc: 'É NaN.' },
      ],
    },
    {
      title: 'Coleções & strings',
      icon: '📦',
      rows: [
        { code: '.toContain(item)', desc: 'Array contém item / string contém trecho.' },
        { code: '.toHaveSize(n)', desc: 'Tamanho de array/string/objeto.' },
        { code: '.toMatch(/regex/)', desc: 'String casa com a regex.' },
        { code: '.toBeGreaterThan(n)', desc: 'Maior que (e variantes ...OrEqual / LessThan).' },
      ],
    },
    {
      title: 'Exceções',
      icon: '💥',
      rows: [
        { code: 'expect(() => f()).toThrow()', desc: 'Passe uma FUNÇÃO. Verifica que lançou.' },
        { code: ".toThrowError('msg')", desc: 'Lançou Error com a mensagem dada.' },
      ],
    },
    {
      title: 'Spies',
      icon: '🕵️',
      rows: [
        { code: "jasmine.createSpy('n')", desc: 'Cria uma função-espiã do zero.' },
        { code: "spyOn(obj, 'metodo')", desc: 'Substitui um método existente por um spy.' },
        { code: '.and.returnValue(x)', desc: 'Spy passa a retornar x.' },
        { code: '.and.callFake(fn)', desc: 'Spy usa uma implementação falsa.' },
        { code: '.and.callThrough()', desc: 'Mantém o comportamento real (e registra).' },
        { code: '.toHaveBeenCalled()', desc: 'Foi chamado ao menos uma vez.' },
        { code: '.toHaveBeenCalledWith(a)', desc: 'Foi chamado com esses argumentos.' },
        { code: '.toHaveBeenCalledTimes(n)', desc: 'Foi chamado exatamente n vezes.' },
        { code: 'spy.calls.count() / argsFor(i)', desc: 'Inspeciona o histórico de chamadas.' },
      ],
    },
    {
      title: 'TestBed (Angular)',
      icon: '🅰️',
      rows: [
        { code: 'TestBed.configureTestingModule({})', desc: 'Monta o módulo de teste.' },
        { code: 'TestBed.inject(Servico)', desc: 'Obtém uma instância via DI.' },
        { code: 'TestBed.createComponent(Comp)', desc: 'Cria o componente e o fixture.' },
        { code: '{ provide: X, useValue: mock }', desc: 'Troca uma dependência por um mock.' },
      ],
    },
    {
      title: 'ComponentFixture',
      icon: '🧩',
      rows: [
        { code: 'fixture.componentInstance', desc: 'A instância da classe do componente.' },
        { code: 'fixture.detectChanges()', desc: 'Roda change detection / renderiza.' },
        { code: 'fixture.nativeElement.querySelector', desc: 'Acessa o DOM renderizado.' },
        { code: 'debugElement.query(By.css(...))', desc: 'Busca semântica + triggerEventHandler.' },
      ],
    },
    {
      title: 'Async & HTTP',
      icon: '⏱️',
      rows: [
        { code: 'fakeAsync(() => { tick(ms) })', desc: 'Congela o tempo e avança manualmente.' },
        { code: 'fixture.whenStable()', desc: 'Espera tarefas assíncronas estabilizarem.' },
        { code: 'provideHttpClientTesting()', desc: 'Backend HTTP fake para o teste.' },
        { code: 'httpMock.expectOne(url).flush(d)', desc: 'Intercepta a requisição e responde.' },
      ],
    },
    {
      title: 'CLI',
      icon: '⌨️',
      rows: [
        { code: 'ng test', desc: 'Roda em watch (Karma + Jasmine).' },
        { code: 'ng test --watch=false', desc: 'Uma execução só (CI).' },
        { code: 'ng test --code-coverage', desc: 'Gera relatório de cobertura.' },
      ],
    },
  ];
}

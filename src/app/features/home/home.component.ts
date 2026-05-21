import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { MATCHER_CATEGORIES } from '../../shared/models/testing.model';
import { MATCHERS } from '../../shared/data/matchers.data';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [RouterLink],
  template: `
    <div class="home page-fade">
      <section class="hero">
        <div class="hero-badge">Angular 18 · Jasmine · Testes unitários na prática</div>
        <h1>Testes unitários no <span class="gradient">Angular</span>, vendo eles rodarem</h1>
        <p>
          Um guia interativo de testes unitários com Jasmine. Cada conceito vem com
          exemplos que <strong>rodam de verdade no navegador</strong>: clique em
          "Rodar testes" e veja o verde (ou o vermelho) na hora. Sem decorar teoria solta.
        </p>
        <div class="hero-actions">
          <a routerLink="/fundamentos" class="btn btn-primary">Começar pelos fundamentos</a>
          <a routerLink="/playground" class="btn btn-secondary">Ir ao Playground</a>
        </div>
        <div class="hero-stats">
          <div><strong>{{ totalMatchers }}</strong><span>matchers</span></div>
          <div><strong>{{ categories.length }}</strong><span>categorias</span></div>
          <div><strong>100%</strong><span>executável</span></div>
        </div>
      </section>

      <section class="trail">
        <h2 class="section-label">A trilha sugerida</h2>
        <div class="grid grid-3">
          @for (step of trail; track step.path) {
            <a class="trail-card" [routerLink]="step.path">
              <div class="trail-icon" [style.background]="step.color">{{ step.icon }}</div>
              <div class="trail-num">{{ step.num }}</div>
              <h3>{{ step.title }}</h3>
              <p>{{ step.desc }}</p>
              <span class="trail-go">{{ step.cta }} →</span>
            </a>
          }
        </div>
      </section>

      <section class="anatomy">
        <div class="anatomy-text">
          <h2>O que é um teste unitário?</h2>
          <p>
            É um pedacinho de código que <em>verifica automaticamente</em> se uma parte
            isolada do seu app (uma função, um service, um componente) se comporta como
            você espera. Se um dia alguém quebrar essa parte, o teste fica
            <strong>vermelho</strong> e te avisa, antes do usuário descobrir.
          </p>
          <div class="feature-list">
            @for (f of features; track f) {
              <div class="feature-item"><span class="check">✓</span><span>{{ f }}</span></div>
            }
          </div>
        </div>
        <div class="anatomy-code">
          <div class="legend">
            <span><i class="dot pass"></i> describe = agrupa</span>
            <span><i class="dot it"></i> it = um teste</span>
            <span><i class="dot exp"></i> expect = a verificação</span>
          </div>
          <pre class="ascii"><span class="c-d">describe</span>(<span class="c-s">'Calculadora'</span>, () => {{ '{' }}
  <span class="c-i">it</span>(<span class="c-s">'soma dois números'</span>, () => {{ '{' }}
    <span class="c-c">// Arrange</span>
    const calc = new Calculadora();
    <span class="c-c">// Act</span>
    const r = calc.somar(2, 3);
    <span class="c-c">// Assert</span>
    <span class="c-e">expect</span>(r).toBe(5);
  {{ '}' }});
{{ '}' }});</pre>
          <a routerLink="/fundamentos" class="btn btn-accent btn-sm">Ver isso rodando →</a>
        </div>
      </section>
    </div>
  `,
  styles: [`
    .hero {
      text-align: center;
      padding: 72px 40px 40px;
      max-width: 800px;
      margin: 0 auto;

      .hero-badge {
        display: inline-block;
        background: rgba(16,185,129,0.14);
        color: var(--primary-light);
        border: 1px solid rgba(16,185,129,0.3);
        padding: 4px 16px;
        border-radius: 20px;
        font-size: 13px;
        font-weight: 600;
        margin-bottom: 24px;
        letter-spacing: 0.3px;
      }
      h1 {
        font-size: 50px;
        font-weight: 800;
        line-height: 1.12;
        margin-bottom: 20px;
        .gradient {
          background: linear-gradient(135deg, var(--primary), var(--accent));
          -webkit-background-clip: text;
          background-clip: text;
          -webkit-text-fill-color: transparent;
        }
      }
      p { color: var(--text-muted); font-size: 18px; line-height: 1.7; margin-bottom: 30px; }
      .hero-actions { display: flex; gap: 12px; justify-content: center; margin-bottom: 36px; }
    }

    .hero-stats {
      display: flex;
      justify-content: center;
      gap: 40px;
      div { display: flex; flex-direction: column; }
      strong { font-size: 30px; font-weight: 800; color: var(--text); }
      span { font-size: 13px; color: var(--text-muted); text-transform: uppercase; letter-spacing: 0.5px; }
    }

    .trail { padding: 30px 40px 50px; max-width: 1200px; margin: 0 auto; }

    .trail-card {
      position: relative;
      display: block;
      background: var(--bg-card);
      border: 1px solid var(--border);
      border-radius: var(--radius);
      padding: 24px;
      text-decoration: none;
      transition: all var(--transition);

      &:hover { border-color: var(--primary); transform: translateY(-2px); box-shadow: var(--shadow); }

      .trail-icon {
        width: 44px; height: 44px;
        border-radius: var(--radius-sm);
        display: flex; align-items: center; justify-content: center;
        font-size: 22px; color: #fff;
        margin-bottom: 14px;
      }
      .trail-num {
        position: absolute; top: 20px; right: 22px;
        font-size: 30px; font-weight: 800; color: var(--border);
      }
      h3 { font-size: 17px; font-weight: 700; margin-bottom: 6px; color: var(--text); }
      p { font-size: 13.5px; color: var(--text-muted); line-height: 1.6; margin-bottom: 12px; }
      .trail-go { font-size: 13px; font-weight: 600; color: var(--primary-light); }
    }

    .anatomy {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 40px;
      align-items: center;
      padding: 56px 40px;
      max-width: 1200px;
      margin: 0 auto;
      background: var(--bg-card);
      border-top: 1px solid var(--border);
      border-bottom: 1px solid var(--border);

      h2 { font-size: 26px; font-weight: 700; margin-bottom: 16px; }
      p { color: var(--text-muted); margin-bottom: 22px; line-height: 1.75; }
      em { color: var(--text); font-style: italic; }
    }
    .feature-list { display: flex; flex-direction: column; gap: 10px; }
    .feature-item { display: flex; align-items: center; gap: 12px; font-size: 14px; }
    .feature-item .check { color: var(--success); font-weight: 700; }

    .anatomy-code {
      background: var(--bg-code);
      border: 1px solid var(--border);
      border-radius: var(--radius);
      padding: 20px;
    }
    .legend {
      display: flex; flex-wrap: wrap; gap: 14px; margin-bottom: 16px;
      font-size: 12px; color: var(--text-muted);
      span { display: inline-flex; align-items: center; gap: 6px; }
      .dot { width: 11px; height: 11px; border-radius: 50%; }
      .dot.pass { background: var(--primary); }
      .dot.it { background: var(--info); }
      .dot.exp { background: var(--accent); }
    }
    .ascii {
      font-family: 'Fira Code', monospace;
      font-size: 13px;
      color: var(--text);
      line-height: 1.8;
      margin-bottom: 16px;
      white-space: pre;
      overflow-x: auto;
      .c-d { color: var(--primary-light); }
      .c-i { color: #7dd3fc; }
      .c-e { color: var(--accent-light); }
      .c-s { color: #fcd34d; }
      .c-c { color: var(--text-muted); font-style: italic; }
    }

    @media (max-width: 860px) {
      .hero h1 { font-size: 36px; }
      .anatomy { grid-template-columns: 1fr; }
      .hero-stats { gap: 24px; }
    }
  `]
})
export class HomeComponent {
  categories = MATCHER_CATEGORIES;
  totalMatchers = MATCHERS.length;

  trail = [
    { num: '01', path: '/fundamentos', icon: '🧱', color: 'var(--primary)', title: 'Fundamentos', desc: 'describe, it, expect, o padrão AAA e os hooks beforeEach/afterEach. A base de tudo.', cta: 'Entender a estrutura' },
    { num: '02', path: '/matchers', icon: '🟰', color: 'var(--accent)', title: 'Matchers', desc: 'O dicionário das verificações: toBe, toEqual, toContain, toThrow e mais, rodando ao vivo.', cta: 'Explorar matchers' },
    { num: '03', path: '/spies', icon: '🕵️', color: 'var(--info)', title: 'Spies & Mocks', desc: 'Isolar dependências: espionar funções, simular retornos e verificar chamadas.', cta: 'Aprender a isolar' },
    { num: '04', path: '/angular', icon: '🅰️', color: 'var(--warning)', title: 'Testando Angular', desc: 'TestBed, ComponentFixture, fakeAsync/tick e HttpTestingController na prática.', cta: 'Ir ao mundo real' },
    { num: '05', path: '/playground', icon: '🧪', color: 'var(--danger)', title: 'Playground', desc: 'Escreva seu próprio teste, edite e rode. Quebre de propósito para ver o vermelho.', cta: 'Pôr a mão na massa' },
    { num: '06', path: '/cheatsheet', icon: '📋', color: 'var(--primary-light)', title: 'Cheatsheet', desc: 'Consulta rápida de matchers, hooks e APIs do TestBed. Seu colinho de bolso.', cta: 'Consultar' },
  ];

  features = [
    'Tudo roda no navegador, o resultado aparece, não só a teoria',
    'Exemplos curtos e isolados, um conceito de cada vez',
    'Testes vermelhos de propósito, para reconhecer falhas de relance',
    'Do "o que é um expect" até testar componentes com HttpClient',
    'Referência rápida em português para consultar no dia a dia',
  ];
}

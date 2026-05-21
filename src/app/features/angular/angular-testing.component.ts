import { Component } from '@angular/core';
import { CodeBlockComponent } from '../../shared/components/code-block/code-block.component';

@Component({
  selector: 'app-angular-testing',
  standalone: true,
  imports: [CodeBlockComponent],
  template: `
    <div class="page page-fade">
      <div class="page-header">
        <h1>Testando Angular</h1>
        <p>
          Até aqui os exemplos rodaram no navegador com nosso mini-Jasmine. Agora o mundo real:
          como testar <strong>services</strong> e <strong>componentes</strong> de verdade, com
          <code>TestBed</code>, <code>ComponentFixture</code> e amigos. Os exemplos desta página
          existem como arquivos <code>.spec.ts</code> no projeto, rode <code>ng test</code> para vê-los.
        </p>
      </div>

      <div class="callout info banner">
        🧭 <strong>Pirâmide de testes:</strong> prefira muitos testes de unidade pura (rápidos, sem TestBed),
        alguns de componente/serviço com TestBed, e poucos end-to-end. Quanto mais alto na pirâmide,
        mais lento e frágil.
      </div>

      <!-- TestBed -->
      <section class="block">
        <span class="tag">01 · O ambiente</span>
        <h2>TestBed: o módulo de testes</h2>
        <p class="lead">
          O <code>TestBed</code> monta um mini-módulo Angular só para o teste. Você declara o que precisa
          (componentes, providers, mocks) em <code>configureTestingModule</code> e depois pede instâncias
          com <code>inject()</code> ou cria componentes com <code>createComponent()</code>. É o
          equivalente de teste ao bootstrap da sua aplicação.
        </p>
        <app-code-block [code]="serviceCode" title="saudacao.service.spec.ts" />
        <div class="callout tip">
          <strong>Por que TestBed para um serviço tão simples?</strong> Você nem precisaria, bastava
          <code>new SaudacaoService()</code>. Use TestBed quando o serviço tem dependências injetadas, para
          que o Angular as resolva (e você possa trocá-las por mocks com <code>provide</code>).
        </div>
      </section>

      <!-- Mock provider -->
      <section class="block">
        <span class="tag">02 · Trocar dependências</span>
        <h2>Injetar um mock no lugar do real</h2>
        <p class="lead">
          A grande vantagem do TestBed: no array <code>providers</code> você substitui um serviço real por
          um dublê. Assim o componente recebe o mock via injeção de dependência, sem saber que é falso.
        </p>
        <app-code-block [code]="provideCode" title="perfil.component.spec.ts" />
      </section>

      <!-- Component fixture -->
      <section class="block">
        <span class="tag">03 · Componentes</span>
        <h2>ComponentFixture & detectChanges</h2>
        <p class="lead">
          <code>TestBed.createComponent()</code> devolve um <strong>fixture</strong>, uma casca em volta do
          componente que dá acesso à instância (<code>componentInstance</code>) e ao DOM
          (<code>nativeElement</code> / <code>debugElement</code>). A regra de ouro:
          <strong>mudou estado? chame <code>detectChanges()</code></strong> para o template atualizar antes
          de verificar o DOM.
        </p>
        <app-code-block [code]="componentCode" title="contador.component.spec.ts" />
        <div class="callout warn">
          <strong>Esqueceu o detectChanges()?</strong> O DOM fica desatualizado e seu <code>expect</code> lê
          o valor antigo. É o erro mais comum em testes de componente.
        </div>
      </section>

      <!-- Query DOM -->
      <section class="block">
        <span class="tag">04 · Interagir com o DOM</span>
        <h2>Consultar elementos e disparar eventos</h2>
        <p class="lead">
          Para ler texto: <code>nativeElement.querySelector(...)</code>. Para algo mais semântico:
          <code>debugElement.query(By.css(...))</code>. Para simular um clique/input use
          <code>triggerEventHandler('click')</code> ou <code>nativeElement.click()</code>, e lembre do
          <code>detectChanges()</code> depois.
        </p>
        <app-code-block [code]="domCode" title="trechos úteis" />
      </section>

      <!-- Async -->
      <section class="block">
        <span class="tag">05 · Tempo e assincronia</span>
        <h2>fakeAsync, tick e waitForAsync</h2>
        <p class="lead">
          Código com <code>setTimeout</code>, <code>debounceTime</code> ou promises precisa de ajuda para
          ser testado de forma determinística. <code>fakeAsync</code> "congela" o tempo e
          <code>tick(ms)</code> o avança manualmente, sem esperas reais. Para promises de verdade,
          <code>waitForAsync</code> + <code>fixture.whenStable()</code>.
        </p>
        <app-code-block [code]="asyncCode" title="busca.component.spec.ts" />
      </section>

      <!-- HTTP -->
      <section class="block">
        <span class="tag">06 · Testando HTTP</span>
        <h2>HttpTestingController</h2>
        <p class="lead">
          Você <strong>nunca</strong> faz HTTP real no teste. Importe <code>provideHttpClientTesting()</code>
          e use o <code>HttpTestingController</code> para interceptar a requisição, conferir método/URL e
          responder com dados fake via <code>.flush()</code>. No fim, <code>verify()</code> garante que não
          sobrou requisição pendente.
        </p>
        <app-code-block [code]="httpCode" title="usuario.service.spec.ts" />
        <div class="callout tip">
          <strong>Padrão:</strong> assine o método do serviço → capture a requisição com
          <code>httpMock.expectOne(url)</code> → confira o que foi enviado → responda com
          <code>req.flush(dados)</code> → afirme o resultado → <code>httpMock.verify()</code>.
        </div>
      </section>

      <section class="block">
        <span class="tag">Como rodar</span>
        <h2>ng test na prática</h2>
        <p class="lead">
          O Angular CLI usa <strong>Karma</strong> (roda os testes num navegador real) + <strong>Jasmine</strong>
          (a API que você aprendeu aqui). Os comandos:
        </p>
        <app-code-block [code]="cliCode" title="terminal" />
      </section>
    </div>
  `,
  styles: [`
    .block {
      max-width: 920px;
      margin: 0 auto 48px;
      h2 { font-size: 22px; font-weight: 700; margin: 10px 0 12px; }
      .lead { color: var(--text-muted); line-height: 1.75; margin-bottom: 20px; }
    }
    .callout { margin-top: 16px; }
    .banner { max-width: 920px; margin: 0 auto 40px; }
  `]
})
export class AngularTestingComponent {
  serviceCode = `import { TestBed } from '@angular/core/testing';
import { SaudacaoService } from './saudacao.service';

describe('SaudacaoService', () => {
  let service: SaudacaoService;

  beforeEach(() => {
    TestBed.configureTestingModule({});      // monta o módulo de teste
    service = TestBed.inject(SaudacaoService); // pede a instância
  });

  it('é criado', () => {
    expect(service).toBeTruthy();
  });

  it('monta a saudação com o nome', () => {
    expect(service.saudar('Ana')).toBe('Olá, Ana!');
  });
});`;

  provideCode = `const serviceMock = {
  buscar: jasmine.createSpy('buscar')
    .and.returnValue(of({ id: 7, nome: 'Bia' })),
};

beforeEach(() => {
  TestBed.configureTestingModule({
    imports: [PerfilComponent],
    providers: [
      // troca o real pelo mock, o componente nem percebe
      { provide: UsuarioService, useValue: serviceMock },
    ],
  });
  fixture = TestBed.createComponent(PerfilComponent);
});

it('exibe o usuário retornado pelo serviço', () => {
  fixture.detectChanges();
  expect(serviceMock.buscar).toHaveBeenCalledWith(7);
});`;

  componentCode = `import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { ContadorComponent } from './contador.component';

describe('ContadorComponent', () => {
  let fixture: ComponentFixture<ContadorComponent>;
  let component: ContadorComponent;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ContadorComponent],   // standalone: importa direto
    }).compileComponents();

    fixture = TestBed.createComponent(ContadorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();           // 1ª renderização
  });

  it('incrementa ao clicar no botão', () => {
    const botao = fixture.debugElement.query(By.css('button'));

    botao.triggerEventHandler('click');
    fixture.detectChanges();           // atualiza o DOM

    const p = fixture.nativeElement.querySelector('.valor');
    expect(p.textContent.trim()).toBe('1');
    expect(component.valor()).toBe(1);
  });
});`;

  domCode = `// Ler texto renderizado
const el = fixture.nativeElement.querySelector('.titulo');
expect(el.textContent).toContain('Bem-vindo');

// Buscar por seletor de forma "Angular"
import { By } from '@angular/platform-browser';
const input = fixture.debugElement.query(By.css('input'));

// Disparar eventos
input.nativeElement.value = 'angular';
input.nativeElement.dispatchEvent(new Event('input'));
fixture.detectChanges();

// Clique
fixture.debugElement.query(By.css('button'))
  .triggerEventHandler('click');`;

  asyncCode = `import { fakeAsync, tick } from '@angular/core/testing';

it('emite só após o debounce de 300ms', fakeAsync(() => {
  let resultado = '';
  component.busca$.subscribe(v => resultado = v);

  component.digitar('a');
  tick(100);            // ainda não passou o debounce
  expect(resultado).toBe('');

  tick(300);            // agora sim, avançamos o "relógio falso"
  expect(resultado).toBe('a');
}));

// Para promises reais:
it('carrega dados', waitForAsync(() => {
  component.carregar();
  fixture.whenStable().then(() => {
    fixture.detectChanges();
    expect(component.itens.length).toBe(3);
  });
}));`;

  httpCode = `import { TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import {
  HttpTestingController,
  provideHttpClientTesting,
} from '@angular/common/http/testing';

describe('UsuarioService', () => {
  let service: UsuarioService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        provideHttpClient(),
        provideHttpClientTesting(), // substitui o backend real
      ],
    });
    service = TestBed.inject(UsuarioService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => httpMock.verify()); // nada pendente

  it('busca usuário por id', () => {
    let resultado: any;
    service.buscar(7).subscribe(u => resultado = u);

    const req = httpMock.expectOne('/api/usuarios/7');
    expect(req.request.method).toBe('GET');

    req.flush({ id: 7, nome: 'Bia' }); // resposta fake

    expect(resultado).toEqual({ id: 7, nome: 'Bia' });
  });
});`;

  cliCode = `# roda em modo watch (reexecuta ao salvar)
ng test

# roda uma vez (CI) em Chrome headless, com cobertura
ng test --watch=false --code-coverage

# o relatório de cobertura sai em coverage/`;
}

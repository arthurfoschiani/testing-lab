import { Component } from '@angular/core';
import { TestRunnerComponent } from '../../shared/components/test-runner/test-runner.component';
import { TestApi } from '../../shared/lib/mini-jasmine';

@Component({
  selector: 'app-spies',
  standalone: true,
  imports: [TestRunnerComponent],
  template: `
    <div class="page page-fade">
      <div class="page-header">
        <h1>Spies & Mocks</h1>
        <p>
          Um teste <em>unitário</em> testa uma unidade <strong>isolada</strong>. Mas seu código depende
          de outras coisas, serviços, HTTP, callbacks. Um <strong>spy</strong> é uma função dublê que
          (1) registra como foi chamada e (2) pode fingir um retorno. Assim você testa sua unidade sem
          tocar nas dependências reais.
        </p>
      </div>

      <section class="block">
        <span class="tag">01 · O que é um spy</span>
        <h2>Espionar chamadas</h2>
        <p class="lead">
          <code>jasmine.createSpy('nome')</code> cria uma função vazia que <strong>anota tudo</strong>:
          quantas vezes foi chamada, com quais argumentos, em que ordem. Você passa esse spy onde seu
          código espera um callback e depois verifica o que aconteceu.
        </p>
        <app-test-runner [code]="createCode" [suite]="createSuite" hint="O spy substitui o callback real. Depois interrogamos spy.calls para ver o histórico." />
      </section>

      <section class="block">
        <span class="tag">02 · Fingir retornos</span>
        <h2>and.returnValue & and.callFake</h2>
        <p class="lead">
          Por padrão um spy retorna <code>undefined</code>. Com <code>.and.returnValue(x)</code> ele
          devolve um valor fixo; com <code>.and.callFake(fn)</code> você fornece uma implementação falsa;
          e <code>.and.returnValues(a, b)</code> devolve um valor diferente a cada chamada. É assim que
          você simula "o serviço retornou estes dados".
        </p>
        <app-test-runner [code]="stubCode" [suite]="stubSuite" />
      </section>

      <section class="block">
        <span class="tag">03 · Espionar um método existente</span>
        <h2>spyOn(objeto, 'método')</h2>
        <p class="lead">
          Quando o método já existe num objeto/serviço, <code>spyOn</code> o substitui por um spy
          (sem chamar o original, por padrão). Use <code>.and.callThrough()</code> se quiser que ele
          ainda execute a implementação real, mas ainda assim registrando as chamadas.
        </p>
        <app-test-runner [code]="spyOnCode" [suite]="spyOnSuite" hint="Espionamos console.log e o método real do serviço, note que toThrow some quando trocamos por um stub." />
      </section>

      <section class="block">
        <span class="tag">04 · O caso real</span>
        <h2>Mockando um serviço (dependência)</h2>
        <p class="lead">
          O cenário clássico do Angular: um componente depende de um <code>UserService</code> que faz
          HTTP. No teste, você passa um <strong>fake</strong> do serviço, um objeto com spies no lugar
          dos métodos, e verifica que o componente chamou o que devia e reagiu ao retorno simulado.
        </p>
        <app-test-runner [code]="mockCode" [suite]="mockSuite" hint="Nenhum HTTP real acontece: o serviço é um dublê com createSpy. Testamos só a lógica do componente." />
        <div class="callout tip">
          <strong>Spy, stub, mock, fake?</strong> Na prática se misturam, mas a ideia:
          <em>stub</em> devolve um valor pronto; <em>spy</em> registra chamadas; <em>mock</em> é um objeto
          de teste com expectativas; <em>fake</em> tem uma implementação simplificada. Um spy do Jasmine
          faz papel de stub <u>e</u> spy ao mesmo tempo.
        </div>
      </section>

      <section class="block">
        <span class="tag">05 · Inspecionar o histórico</span>
        <h2>spy.calls, o diário do spy</h2>
        <p class="lead">
          Além dos matchers, você pode interrogar o spy diretamente: <code>.calls.count()</code>,
          <code>.calls.argsFor(0)</code>, <code>.calls.mostRecent()</code>, <code>.calls.allArgs()</code>.
          Útil quando a verificação é mais complexa do que um simples <code>toHaveBeenCalledWith</code>.
        </p>
        <app-test-runner [code]="callsCode" [suite]="callsSuite" />
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
  `]
})
export class SpiesComponent {
  createCode = `describe('createSpy', () => {
  it('registra as chamadas de um callback', () => {
    const aoSalvar = jasmine.createSpy('aoSalvar');

    // imagine um componente chamando o callback:
    aoSalvar('rascunho');
    aoSalvar('publicado');

    expect(aoSalvar).toHaveBeenCalled();
    expect(aoSalvar).toHaveBeenCalledTimes(2);
    expect(aoSalvar).toHaveBeenCalledWith('publicado');
  });
});`;
  createSuite = ({ describe, it, expect, createSpy }: TestApi) => {
    describe('createSpy', () => {
      it('registra as chamadas de um callback', () => {
        const aoSalvar = createSpy('aoSalvar');
        aoSalvar('rascunho');
        aoSalvar('publicado');
        expect(aoSalvar).toHaveBeenCalled();
        expect(aoSalvar).toHaveBeenCalledTimes(2);
        expect(aoSalvar).toHaveBeenCalledWith('publicado');
      });
    });
  };

  stubCode = `describe('fingindo retornos', () => {
  it('returnValue devolve um valor fixo', () => {
    const getToken = jasmine.createSpy().and.returnValue('abc-123');
    expect(getToken()).toBe('abc-123');
    expect(getToken()).toBe('abc-123');
  });

  it('callFake usa uma implementação falsa', () => {
    const dobro = jasmine.createSpy().and.callFake((n) => n * 2);
    expect(dobro(10)).toBe(20);
  });

  it('returnValues muda a cada chamada', () => {
    const proximo = jasmine.createSpy().and.returnValues('a', 'b', 'c');
    expect(proximo()).toBe('a');
    expect(proximo()).toBe('b');
  });
});`;
  stubSuite = ({ describe, it, expect, createSpy }: TestApi) => {
    describe('fingindo retornos', () => {
      it('returnValue devolve um valor fixo', () => {
        const getToken = createSpy('getToken').and.returnValue('abc-123');
        expect(getToken()).toBe('abc-123');
        expect(getToken()).toBe('abc-123');
      });
      it('callFake usa uma implementação falsa', () => {
        const dobro = createSpy('dobro').and.callFake((n) => (n as number) * 2);
        expect(dobro(10)).toBe(20);
      });
      it('returnValues muda a cada chamada', () => {
        const proximo = createSpy('proximo').and.returnValues('a', 'b', 'c');
        expect(proximo()).toBe('a');
        expect(proximo()).toBe('b');
      });
    });
  };

  spyOnCode = `const logger = {
  registrar(msg) { return 'REAL: ' + msg; }
};

describe('spyOn', () => {
  it('substitui o método (não chama o real)', () => {
    spyOn(logger, 'registrar');

    logger.registrar('oi');

    expect(logger.registrar).toHaveBeenCalledWith('oi');
    // retorno agora é undefined, pois o original foi trocado
    expect(logger.registrar('x')).toBeUndefined();
  });

  it('callThrough mantém o comportamento real', () => {
    spyOn(logger, 'registrar').and.callThrough();
    expect(logger.registrar('oi')).toBe('REAL: oi');
    expect(logger.registrar).toHaveBeenCalled();
  });
});`;
  spyOnSuite = ({ describe, it, expect, spyOn }: TestApi) => {
    const logger = { registrar(msg: string) { return 'REAL: ' + msg; } };
    describe('spyOn', () => {
      it('substitui o método (não chama o real)', () => {
        spyOn(logger, 'registrar');
        logger.registrar('oi');
        expect(logger.registrar).toHaveBeenCalledWith('oi');
        expect(logger.registrar('x')).toBeUndefined();
      });
      it('callThrough mantém o comportamento real', () => {
        spyOn(logger, 'registrar').and.callThrough();
        expect(logger.registrar('oi')).toBe('REAL: oi');
        expect(logger.registrar).toHaveBeenCalled();
      });
    });
  };

  mockCode = `// Componente que depende de um serviço:
class PerfilComponent {
  usuario = null;
  constructor(private service) {}
  carregar(id) {
    this.usuario = this.service.buscar(id);
  }
}

describe('PerfilComponent', () => {
  it('busca o usuário pelo serviço e guarda o retorno', () => {
    // dublê do serviço, só os métodos que o componente usa
    const serviceFake = {
      buscar: jasmine.createSpy('buscar')
        .and.returnValue({ id: 7, nome: 'Bia' }),
    };
    const comp = new PerfilComponent(serviceFake);

    comp.carregar(7);

    expect(serviceFake.buscar).toHaveBeenCalledWith(7);
    expect(comp.usuario).toEqual({ id: 7, nome: 'Bia' });
  });
});`;
  mockSuite = ({ describe, it, expect, createSpy }: TestApi) => {
    interface User { id: number; nome: string; }
    interface Service { buscar(id: number): User; }
    class PerfilComponent {
      usuario: User | null = null;
      constructor(private service: Service) {}
      carregar(id: number) { this.usuario = this.service.buscar(id); }
    }
    describe('PerfilComponent', () => {
      it('busca o usuário pelo serviço e guarda o retorno', () => {
        const serviceFake = { buscar: createSpy('buscar').and.returnValue({ id: 7, nome: 'Bia' }) } as unknown as Service;
        const comp = new PerfilComponent(serviceFake);
        comp.carregar(7);
        expect(serviceFake.buscar).toHaveBeenCalledWith(7);
        expect(comp.usuario).toEqual({ id: 7, nome: 'Bia' });
      });
    });
  };

  callsCode = `describe('spy.calls', () => {
  it('expõe o histórico de chamadas', () => {
    const track = jasmine.createSpy('track');

    track('login', { userId: 1 });
    track('click', { botao: 'salvar' });

    expect(track.calls.count()).toBe(2);
    expect(track.calls.argsFor(0)).toEqual(['login', { userId: 1 }]);
    expect(track.calls.mostRecent().args[0]).toBe('click');
  });
});`;
  callsSuite = ({ describe, it, expect, createSpy }: TestApi) => {
    describe('spy.calls', () => {
      it('expõe o histórico de chamadas', () => {
        const track = createSpy('track');
        track('login', { userId: 1 });
        track('click', { botao: 'salvar' });
        expect(track.calls.count()).toBe(2);
        expect(track.calls.argsFor(0)).toEqual(['login', { userId: 1 }]);
        expect(track.calls.mostRecent()!.args[0]).toBe('click');
      });
    });
  };
}

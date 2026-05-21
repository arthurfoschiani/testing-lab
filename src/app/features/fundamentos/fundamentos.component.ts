import { Component } from '@angular/core';
import { TestRunnerComponent } from '../../shared/components/test-runner/test-runner.component';
import { CodeBlockComponent } from '../../shared/components/code-block/code-block.component';
import { TestApi } from '../../shared/lib/mini-jasmine';

@Component({
  selector: 'app-fundamentos',
  standalone: true,
  imports: [TestRunnerComponent, CodeBlockComponent],
  template: `
    <div class="page page-fade">
      <div class="page-header">
        <h1>Fundamentos</h1>
        <p>
          A estrutura de qualquer teste, sem mágica. Três funções fazem 90% do trabalho:
          <code>describe</code> agrupa, <code>it</code> descreve um caso e <code>expect</code>
          faz a verificação. Rode cada exemplo para ver acontecer.
        </p>
      </div>

      <!-- 1. As três peças -->
      <section class="block">
        <span class="tag">01 · As três peças</span>
        <h2>describe, it e expect</h2>
        <p class="lead">
          <code>describe(nome, fn)</code> cria um <strong>grupo</strong> de testes relacionados.
          Dentro dele, cada <code>it(nome, fn)</code> é <strong>um teste</strong> (também chamado de "spec").
          E <code>expect(valor)</code> encadeado a um <em>matcher</em> é a <strong>afirmação</strong> que
          precisa ser verdadeira para o teste passar.
        </p>
        <app-test-runner [code]="pecasCode" [suite]="pecasSuite" />
      </section>

      <!-- 2. AAA -->
      <section class="block">
        <span class="tag">02 · O padrão AAA</span>
        <h2>Arrange · Act · Assert</h2>
        <p class="lead">
          Quase todo bom teste tem três fases. <strong>Arrange</strong>: prepara o cenário e os dados.
          <strong>Act</strong>: executa a ação que você quer testar. <strong>Assert</strong>: verifica o
          resultado. Manter essa ordem deixa o teste legível como uma frase.
        </p>
        <app-test-runner [code]="aaaCode" [suite]="aaaSuite" hint="As três fases estão comentadas no código. Repare como cada it testa UM comportamento." />
      </section>

      <!-- 3. Hooks -->
      <section class="block">
        <span class="tag">03 · Hooks de setup</span>
        <h2>beforeEach & afterEach</h2>
        <p class="lead">
          Repetir o "Arrange" em todo <code>it</code> é chato. <code>beforeEach</code> roda
          <strong>antes de cada teste</strong>, ideal para recriar um objeto limpinho e garantir que
          um teste não contamine o outro. Existe também <code>afterEach</code> (limpeza),
          <code>beforeAll</code> e <code>afterAll</code> (rodam uma única vez).
        </p>
        <app-test-runner [code]="hooksCode" [suite]="hooksSuite" hint="O contador é recriado a cada teste pelo beforeEach, por isso ambos começam do zero." />
        <div class="callout warn">
          <strong>Por que recriar?</strong> Testes devem ser independentes. Se você criasse o objeto
          uma vez só, o estado de um teste vazaria para o próximo e a ordem passaria a importar, receita
          para bugs fantasmas.
        </div>
      </section>

      <!-- 4. Isolamento -->
      <section class="block">
        <span class="tag">04 · Um comportamento por teste</span>
        <h2>Testes pequenos e focados</h2>
        <p class="lead">
          Um <code>it</code> deve verificar <strong>uma única ideia</strong>. Quando falha, o nome do
          teste já te diz o que quebrou. Compare: em vez de um teste gigante "valida formulário",
          quebre em "rejeita e-mail sem arroba", "exige senha de 8 dígitos", etc.
        </p>
        <app-test-runner [code]="focoCode" [suite]="focoSuite" />
      </section>

      <!-- 5. Assíncrono -->
      <section class="block">
        <span class="tag">05 · Código assíncrono</span>
        <h2>Testando promises e callbacks</h2>
        <p class="lead">
          Se o que você testa é assíncrono, o teste precisa <em>esperar</em>. Há duas formas: marcar o
          <code>it</code> como <code>async</code> e usar <code>await</code>, ou receber um callback
          <code>done</code> e chamá-lo quando terminar. O teste só conclui quando a promessa resolve.
        </p>
        <app-test-runner [code]="asyncCode" [suite]="asyncSuite" hint="Estes testes esperam ~150ms antes de afirmar. O runner aguarda a Promise/done." />
      </section>

      <!-- 6. skip / focus -->
      <section class="block">
        <span class="tag">06 · Pular e focar</span>
        <h2>xit, xdescribe e fit</h2>
        <p class="lead">
          <code>xit</code> / <code>xdescribe</code> <strong>pulam</strong> um teste (aparece como ⊘).
          <code>fit</code> / <code>fdescribe</code> <strong>focam</strong>: se existir algum foco, só os
          focados rodam, o resto é ignorado. Útil para depurar um teste específico.
        </p>
        <app-test-runner [code]="skipCode" [suite]="skipSuite" hint="Note o teste ⊘ pulado. Em seguida há um fit que, se você descomentar no Playground, faria só ele rodar." />
        <div class="callout danger">
          <strong>Cuidado em produção:</strong> esquecer um <code>fit</code> faz o CI rodar só aquele
          teste e passar "verde" ignorando todos os outros. Vários times barram <code>fit</code>/<code>fdescribe</code> no lint.
        </div>
      </section>

      <!-- Onde os testes vivem -->
      <section class="block">
        <span class="tag">Bônus · Anatomia de um arquivo real</span>
        <h2>Onde os testes ficam no Angular</h2>
        <p class="lead">
          No Angular + Jasmine + Karma, os testes vivem em arquivos <code>.spec.ts</code> ao lado do
          código. <code>ng test</code> compila tudo, abre um navegador e roda. É exatamente a mesma API
          que você vê rodando aqui.
        </p>
        <app-code-block [code]="arquivoCode" title="calculadora.spec.ts" />
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
export class FundamentosComponent {
  pecasCode = `describe('primeiros passos', () => {
  it('o expect mais simples do mundo', () => {
    expect(1 + 1).toBe(2);
  });

  it('um describe pode ter vários it', () => {
    expect('Angular'.length).toBe(7);
    expect([1, 2, 3]).toContain(2);
  });
});`;
  pecasSuite = ({ describe, it, expect }: TestApi) => {
    describe('primeiros passos', () => {
      it('o expect mais simples do mundo', () => {
        expect(1 + 1).toBe(2);
      });
      it('um describe pode ter vários it', () => {
        expect('Angular'.length).toBe(7);
        expect([1, 2, 3]).toContain(2);
      });
    });
  };

  aaaCode = `class Carrinho {
  itens: number[] = [];
  add(preco) { this.itens.push(preco); }
  total() { return this.itens.reduce((s, p) => s + p, 0); }
}

describe('Carrinho (padrão AAA)', () => {
  it('soma os preços dos itens', () => {
    // Arrange, prepara o cenário
    const carrinho = new Carrinho();

    // Act, executa a ação
    carrinho.add(10);
    carrinho.add(5.5);

    // Assert, verifica o resultado
    expect(carrinho.total()).toBe(15.5);
  });

  it('começa vazio', () => {
    const carrinho = new Carrinho();        // Arrange
    expect(carrinho.total()).toBe(0);        // Assert (sem Act)
  });
});`;
  aaaSuite = ({ describe, it, expect }: TestApi) => {
    class Carrinho {
      itens: number[] = [];
      add(preco: number) { this.itens.push(preco); }
      total() { return this.itens.reduce((s, p) => s + p, 0); }
    }
    describe('Carrinho (padrão AAA)', () => {
      it('soma os preços dos itens', () => {
        const carrinho = new Carrinho();
        carrinho.add(10);
        carrinho.add(5.5);
        expect(carrinho.total()).toBe(15.5);
      });
      it('começa vazio', () => {
        const carrinho = new Carrinho();
        expect(carrinho.total()).toBe(0);
      });
    });
  };

  hooksCode = `class Contador {
  valor = 0;
  incrementar() { this.valor++; }
}

describe('Contador', () => {
  let contador;

  beforeEach(() => {
    // roda ANTES de cada it, sempre um objeto novo
    contador = new Contador();
  });

  it('incrementa de 0 para 1', () => {
    contador.incrementar();
    expect(contador.valor).toBe(1);
  });

  it('também começa do zero (não vazou estado!)', () => {
    expect(contador.valor).toBe(0);
  });
});`;
  hooksSuite = ({ describe, it, expect, beforeEach }: TestApi) => {
    class Contador { valor = 0; incrementar() { this.valor++; } }
    describe('Contador', () => {
      let contador: Contador;
      beforeEach(() => { contador = new Contador(); });
      it('incrementa de 0 para 1', () => {
        contador.incrementar();
        expect(contador.valor).toBe(1);
      });
      it('também começa do zero (não vazou estado!)', () => {
        expect(contador.valor).toBe(0);
      });
    });
  };

  focoCode = `function validarSenha(senha) {
  return {
    tamanhoOk: senha.length >= 8,
    temNumero: /\\d/.test(senha),
  };
}

describe('validarSenha', () => {
  it('exige ao menos 8 caracteres', () => {
    expect(validarSenha('1234567').tamanhoOk).toBeFalsy();
    expect(validarSenha('12345678').tamanhoOk).toBeTruthy();
  });

  it('exige ao menos um número', () => {
    expect(validarSenha('semnumero').temNumero).toBeFalsy();
    expect(validarSenha('com1numero').temNumero).toBeTruthy();
  });
});`;
  focoSuite = ({ describe, it, expect }: TestApi) => {
    function validarSenha(senha: string) {
      return { tamanhoOk: senha.length >= 8, temNumero: /\d/.test(senha) };
    }
    describe('validarSenha', () => {
      it('exige ao menos 8 caracteres', () => {
        expect(validarSenha('1234567').tamanhoOk).toBeFalsy();
        expect(validarSenha('12345678').tamanhoOk).toBeTruthy();
      });
      it('exige ao menos um número', () => {
        expect(validarSenha('semnumero').temNumero).toBeFalsy();
        expect(validarSenha('com1numero').temNumero).toBeTruthy();
      });
    });
  };

  asyncCode = `function buscarUsuario() {
  return new Promise(resolve =>
    setTimeout(() => resolve({ id: 1, nome: 'Ana' }), 150)
  );
}

describe('código assíncrono', () => {
  it('com async/await', async () => {
    const user = await buscarUsuario();
    expect(user).toEqual({ id: 1, nome: 'Ana' });
  });

  it('com callback done', (done) => {
    buscarUsuario().then(user => {
      expect(user.nome).toBe('Ana');
      done(); // avisa que terminou
    });
  });
});`;
  asyncSuite = ({ describe, it, expect }: TestApi) => {
    function buscarUsuario(): Promise<{ id: number; nome: string }> {
      return new Promise(resolve => setTimeout(() => resolve({ id: 1, nome: 'Ana' }), 150));
    }
    describe('código assíncrono', () => {
      it('com async/await', async () => {
        const user = await buscarUsuario();
        expect(user).toEqual({ id: 1, nome: 'Ana' });
      });
      it('com callback done', (done) => {
        buscarUsuario().then(user => {
          expect(user.nome).toBe('Ana');
          done!();
        });
      });
    });
  };

  skipCode = `describe('pular e focar', () => {
  it('este roda normalmente', () => {
    expect(true).toBeTruthy();
  });

  xit('este é PULADO (xit), aparece como ⊘', () => {
    expect('não roda').toBe('nunca executado');
  });

  // fit('só este rodaria', () => { ... });
});`;
  skipSuite = ({ describe, it, expect, xit }: TestApi) => {
    describe('pular e focar', () => {
      it('este roda normalmente', () => {
        expect(true).toBeTruthy();
      });
      xit('este é PULADO (xit), aparece como ⊘', () => {
        expect('não roda').toBe('nunca executado');
      });
    });
  };

  arquivoCode = `import { Calculadora } from './calculadora';

describe('Calculadora', () => {
  let calc: Calculadora;

  beforeEach(() => {
    calc = new Calculadora();
  });

  it('soma dois números', () => {
    expect(calc.somar(2, 3)).toBe(5);
  });

  it('lança ao dividir por zero', () => {
    expect(() => calc.dividir(1, 0)).toThrowError('Divisão por zero');
  });
});

// Rode com:  ng test`;
}

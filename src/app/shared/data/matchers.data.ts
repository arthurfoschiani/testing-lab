import { MatcherDoc } from '../models/testing.model';

// Dicionário de matchers. Cada suite roda no navegador via mini-jasmine.
export const MATCHERS: MatcherDoc[] = [
  // Igualdade
  {
    id: 'to-be',
    name: 'toBe',
    category: 'equality',
    signature: 'expect(actual).toBe(esperado)',
    summary: 'Compara por identidade (===). Para primitivos, é o que você quer.',
    description:
      'toBe usa o operador === . Para números, strings e booleanos, compara o valor. ' +
      'Para objetos e arrays, compara a REFERÊNCIA, ou seja, só passa se for exatamente o mesmo objeto na memória. ' +
      'Por isso o segundo teste abaixo falha: são dois objetos com o mesmo conteúdo, mas referências diferentes.',
    code: `describe('toBe', () => {
  it('compara primitivos por valor', () => {
    expect(1 + 1).toBe(2);
    expect('ab' + 'c').toBe('abc');
  });

  it('compara objetos por REFERÊNCIA (cuidado!)', () => {
    const a = { id: 1 };
    expect(a).toBe(a);          // ✓ mesma referência
    expect({ id: 1 }).toBe({ id: 1 }); // ✕ referências diferentes
  });
});`,
    suite: ({ describe, it, expect }) => {
      describe('toBe', () => {
        it('compara primitivos por valor', () => {
          expect(1 + 1).toBe(2);
          expect('ab' + 'c').toBe('abc');
        });
        it('compara objetos por REFERÊNCIA (cuidado!)', () => {
          const a = { id: 1 };
          expect(a).toBe(a);
          expect({ id: 1 }).toBe({ id: 1 } as unknown as typeof a);
        });
      });
    },
    hint: 'O segundo teste falha de propósito, é a pegadinha clássica. Para objetos, use toEqual.',
    tips: [
      'Use toBe para number, string, boolean, null e undefined.',
      'Para objetos/arrays, quase sempre você quer toEqual.',
    ],
    related: ['to-equal', 'to-be-null'],
  },
  {
    id: 'to-equal',
    name: 'toEqual',
    category: 'equality',
    signature: 'expect(actual).toEqual(esperado)',
    summary: 'Igualdade estrutural (profunda). O matcher certo para objetos e arrays.',
    description:
      'toEqual compara o CONTEÚDO recursivamente. Dois objetos diferentes na memória, mas com as mesmas chaves e valores, são considerados iguais. ' +
      'É o matcher que você mais usa ao testar retornos de funções que devolvem objetos ou listas.',
    code: `describe('toEqual', () => {
  it('compara objetos pelo conteúdo', () => {
    expect({ id: 1, nome: 'Ana' }).toEqual({ id: 1, nome: 'Ana' });
  });

  it('compara arrays e estruturas aninhadas', () => {
    expect([1, [2, 3]]).toEqual([1, [2, 3]]);
    expect({ tags: ['a', 'b'] }).toEqual({ tags: ['a', 'b'] });
  });
});`,
    suite: ({ describe, it, expect }) => {
      describe('toEqual', () => {
        it('compara objetos pelo conteúdo', () => {
          expect({ id: 1, nome: 'Ana' }).toEqual({ id: 1, nome: 'Ana' });
        });
        it('compara arrays e estruturas aninhadas', () => {
          expect([1, [2, 3]]).toEqual([1, [2, 3]]);
          expect({ tags: ['a', 'b'] }).toEqual({ tags: ['a', 'b'] });
        });
      });
    },
    tips: ['toEqual ignora a referência e olha o valor, o oposto de toBe para objetos.'],
    related: ['to-be', 'to-have-size'],
  },

  // Verdade & nulos
  {
    id: 'to-be-truthy',
    name: 'toBeTruthy / toBeFalsy',
    category: 'truthiness',
    signature: 'expect(actual).toBeTruthy()',
    summary: 'Verifica se o valor é "verdadeiro/falso" segundo o JavaScript.',
    description:
      'toBeTruthy passa para qualquer valor que o JS considere verdadeiro (tudo menos 0, "", null, undefined, NaN e false). ' +
      'toBeFalsy é o oposto. Útil quando você só quer saber "tem algo aqui?" sem comparar o valor exato.',
    code: `describe('toBeTruthy / toBeFalsy', () => {
  it('truthy aceita qualquer valor "presente"', () => {
    expect('texto').toBeTruthy();
    expect(42).toBeTruthy();
    expect([]).toBeTruthy(); // array vazio é truthy!
  });

  it('falsy pega os "vazios"', () => {
    expect(0).toBeFalsy();
    expect('').toBeFalsy();
    expect(null).toBeFalsy();
  });
});`,
    suite: ({ describe, it, expect }) => {
      describe('toBeTruthy / toBeFalsy', () => {
        it('truthy aceita qualquer valor "presente"', () => {
          expect('texto').toBeTruthy();
          expect(42).toBeTruthy();
          expect([]).toBeTruthy();
        });
        it('falsy pega os "vazios"', () => {
          expect(0).toBeFalsy();
          expect('').toBeFalsy();
          expect(null).toBeFalsy();
        });
      });
    },
    tips: ['Atenção: [] e {} são TRUTHY. Para checar lista vazia use toHaveSize(0).'],
    related: ['to-be-null', 'to-have-size'],
  },
  {
    id: 'to-be-null',
    name: 'toBeNull',
    category: 'truthiness',
    signature: 'expect(actual).toBeNull()',
    summary: 'Passa somente quando o valor é exatamente null.',
    description:
      'Diferente de toBeFalsy, que aceita vários valores, toBeNull só passa para null. ' +
      'Combine com .not para garantir que algo NÃO é nulo.',
    code: `describe('toBeNull', () => {
  it('distingue null de undefined', () => {
    expect(null).toBeNull();
    expect(undefined).not.toBeNull();
  });
});`,
    suite: ({ describe, it, expect }) => {
      describe('toBeNull', () => {
        it('distingue null de undefined', () => {
          expect(null).toBeNull();
          expect(undefined).not.toBeNull();
        });
      });
    },
    tips: ['O modificador .not inverte qualquer matcher: expect(x).not.toBeNull().'],
    related: ['to-be-undefined', 'to-be-truthy'],
  },
  {
    id: 'to-be-undefined',
    name: 'toBeUndefined / toBeDefined',
    category: 'truthiness',
    signature: 'expect(actual).toBeDefined()',
    summary: 'Checa se uma variável/propriedade foi definida ou está undefined.',
    description:
      'toBeUndefined passa quando o valor é undefined. toBeDefined passa para qualquer outra coisa (incluindo null!). ' +
      'Muito usado para verificar se uma propriedade opcional foi preenchida.',
    code: `describe('toBeDefined / toBeUndefined', () => {
  it('verifica presença de propriedades', () => {
    const user = { nome: 'Ana', idade: undefined };
    expect(user.nome).toBeDefined();
    expect(user.idade).toBeUndefined();
  });
});`,
    suite: ({ describe, it, expect }) => {
      describe('toBeDefined / toBeUndefined', () => {
        it('verifica presença de propriedades', () => {
          const user: { nome: string; idade: number | undefined } = { nome: 'Ana', idade: undefined };
          expect(user.nome).toBeDefined();
          expect(user.idade).toBeUndefined();
        });
      });
    },
    tips: ['toBeDefined considera null como "definido", null não é undefined.'],
    related: ['to-be-null'],
  },

  // Números
  {
    id: 'to-be-greater-than',
    name: 'toBeGreaterThan / toBeLessThan',
    category: 'numbers',
    signature: 'expect(n).toBeGreaterThan(limite)',
    summary: 'Comparações de grandeza (com variantes ...OrEqual).',
    description:
      'Para asserções numéricas de ordem: maior, menor, maior-ou-igual, menor-ou-igual. ' +
      'Mais expressivo (e com mensagens de erro melhores) do que fazer a conta e usar toBe.',
    code: `describe('comparações numéricas', () => {
  it('compara grandezas', () => {
    expect(10).toBeGreaterThan(3);
    expect(10).toBeGreaterThanOrEqual(10);
    expect(2).toBeLessThan(5);
    expect(2).toBeLessThanOrEqual(2);
  });
});`,
    suite: ({ describe, it, expect }) => {
      describe('comparações numéricas', () => {
        it('compara grandezas', () => {
          expect(10).toBeGreaterThan(3);
          expect(10).toBeGreaterThanOrEqual(10);
          expect(2).toBeLessThan(5);
          expect(2).toBeLessThanOrEqual(2);
        });
      });
    },
    related: ['to-be-close-to'],
  },
  {
    id: 'to-be-close-to',
    name: 'toBeCloseTo',
    category: 'numbers',
    signature: 'expect(n).toBeCloseTo(esperado, casas?)',
    summary: 'Compara floats com tolerância, resolve o famoso 0.1 + 0.2.',
    description:
      'Ponto flutuante no JS não é exato: 0.1 + 0.2 === 0.30000000000000004. ' +
      'toBe falharia. toBeCloseTo compara até N casas decimais (padrão 2), ignorando o ruído de arredondamento.',
    code: `describe('toBeCloseTo', () => {
  it('0.1 + 0.2 NÃO é exatamente 0.3', () => {
    expect(0.1 + 0.2).not.toBe(0.3);   // ✓ não são ===
    expect(0.1 + 0.2).toBeCloseTo(0.3); // ✓ perto o bastante
  });
});`,
    suite: ({ describe, it, expect }) => {
      describe('toBeCloseTo', () => {
        it('0.1 + 0.2 NÃO é exatamente 0.3', () => {
          expect(0.1 + 0.2).not.toBe(0.3);
          expect(0.1 + 0.2).toBeCloseTo(0.3);
        });
      });
    },
    tips: ['Sempre use toBeCloseTo para resultados de divisões, médias e dinheiro em float.'],
    related: ['to-be', 'to-be-greater-than'],
  },

  // Strings & listas
  {
    id: 'to-contain',
    name: 'toContain',
    category: 'collections',
    signature: 'expect(lista).toContain(item)',
    summary: 'Verifica se um array contém um item, ou se uma string contém um trecho.',
    description:
      'Funciona tanto para arrays (procura um elemento, usando igualdade profunda) quanto para strings (procura um substring). ' +
      'Ótimo para checar "está na lista?" sem se importar com a ordem ou o resto.',
    code: `describe('toContain', () => {
  it('procura em arrays e strings', () => {
    expect([1, 2, 3]).toContain(2);
    expect('angular testing').toContain('test');
    expect(['ana', 'bia']).not.toContain('cris');
  });
});`,
    suite: ({ describe, it, expect }) => {
      describe('toContain', () => {
        it('procura em arrays e strings', () => {
          expect([1, 2, 3]).toContain(2);
          expect('angular testing').toContain('test');
          expect(['ana', 'bia']).not.toContain('cris');
        });
      });
    },
    related: ['to-have-size', 'to-match'],
  },
  {
    id: 'to-have-size',
    name: 'toHaveSize',
    category: 'collections',
    signature: 'expect(lista).toHaveSize(n)',
    summary: 'Confere o tamanho de um array, string ou nº de chaves de um objeto.',
    description:
      'Mais legível do que expect(arr.length).toBe(n). Funciona para arrays, strings e objetos (conta as chaves). ' +
      'É o jeito correto de testar "a lista está vazia", porque [] é truthy.',
    code: `describe('toHaveSize', () => {
  it('mede coleções', () => {
    expect([1, 2, 3]).toHaveSize(3);
    expect('abc').toHaveSize(3);
    expect([]).toHaveSize(0); // jeito certo de checar "vazio"
  });
});`,
    suite: ({ describe, it, expect }) => {
      describe('toHaveSize', () => {
        it('mede coleções', () => {
          expect([1, 2, 3]).toHaveSize(3);
          expect('abc').toHaveSize(3);
          expect([]).toHaveSize(0);
        });
      });
    },
    related: ['to-contain', 'to-be-truthy'],
  },
  {
    id: 'to-match',
    name: 'toMatch',
    category: 'collections',
    signature: 'expect(texto).toMatch(/regex/)',
    summary: 'Verifica se uma string casa com uma expressão regular (ou substring).',
    description:
      'Útil quando você não quer comparar a string inteira, só checar um padrão (formato de e-mail, prefixo, presença de um trecho).',
    code: `describe('toMatch', () => {
  it('casa por regex', () => {
    expect('pedido-2024').toMatch(/^pedido-\\d+$/);
    expect('user@mail.com').toMatch(/@/);
  });
});`,
    suite: ({ describe, it, expect }) => {
      describe('toMatch', () => {
        it('casa por regex', () => {
          expect('pedido-2024').toMatch(/^pedido-\d+$/);
          expect('user@mail.com').toMatch(/@/);
        });
      });
    },
    related: ['to-contain'],
  },

  // Exceções
  {
    id: 'to-throw',
    name: 'toThrow / toThrowError',
    category: 'exceptions',
    signature: 'expect(() => fn()).toThrow()',
    summary: 'Garante que um trecho de código lança um erro.',
    description:
      'A pegadinha aqui é o ARGUMENTO: você passa uma FUNÇÃO (arrow) para o expect, não o resultado da chamada. ' +
      'Assim o matcher pode executar e capturar o throw. toThrowError ainda checa a mensagem do erro.',
    code: `function sacar(saldo, valor) {
  if (valor > saldo) throw new Error('Saldo insuficiente');
  return saldo - valor;
}

describe('toThrow', () => {
  it('lança quando o valor excede o saldo', () => {
    expect(() => sacar(100, 200)).toThrow();
    expect(() => sacar(100, 200)).toThrowError('Saldo insuficiente');
  });

  it('NÃO lança no caminho feliz', () => {
    expect(() => sacar(100, 50)).not.toThrow();
  });
});`,
    suite: ({ describe, it, expect }) => {
      function sacar(saldo: number, valor: number): number {
        if (valor > saldo) throw new Error('Saldo insuficiente');
        return saldo - valor;
      }
      describe('toThrow', () => {
        it('lança quando o valor excede o saldo', () => {
          expect(() => sacar(100, 200)).toThrow();
          expect(() => sacar(100, 200)).toThrowError('Saldo insuficiente');
        });
        it('NÃO lança no caminho feliz', () => {
          expect(() => sacar(100, 50)).not.toThrow();
        });
      });
    },
    hint: 'Repare no () => antes de sacar(...). Sem ele, o erro estouraria antes do expect rodar.',
    tips: ['Esqueceu o arrow? O teste quebra com o erro real em vez de capturá-lo.'],
    related: ['to-be'],
  },

  // Spies
  {
    id: 'to-have-been-called',
    name: 'toHaveBeenCalled',
    category: 'spies',
    signature: 'expect(spy).toHaveBeenCalled()',
    summary: 'Verifica se uma função-espiã chegou a ser chamada.',
    description:
      'Spies registram cada chamada. Este matcher só pergunta "foi chamado pelo menos uma vez?". ' +
      'Perfeito para confirmar que um callback ou serviço foi acionado.',
    code: `describe('toHaveBeenCalled', () => {
  it('detecta se o callback rodou', () => {
    const onClick = jasmine.createSpy('onClick');

    [1, 2, 3].forEach(() => onClick());

    expect(onClick).toHaveBeenCalled();
  });
});`,
    suite: ({ describe, it, expect, createSpy }) => {
      describe('toHaveBeenCalled', () => {
        it('detecta se o callback rodou', () => {
          const onClick = createSpy('onClick');
          [1, 2, 3].forEach(() => onClick());
          expect(onClick).toHaveBeenCalled();
        });
      });
    },
    related: ['to-have-been-called-times', 'to-have-been-called-with'],
  },
  {
    id: 'to-have-been-called-times',
    name: 'toHaveBeenCalledTimes',
    category: 'spies',
    signature: 'expect(spy).toHaveBeenCalledTimes(n)',
    summary: 'Verifica o número exato de chamadas.',
    description:
      'Vai além do "foi chamado": garante que foi chamado exatamente N vezes. ' +
      'Ótimo para flagrar bugs de chamada duplicada ou de cache que não funcionou.',
    code: `describe('toHaveBeenCalledTimes', () => {
  it('conta as chamadas', () => {
    const log = jasmine.createSpy('log');

    log(); log(); log();

    expect(log).toHaveBeenCalledTimes(3);
  });
});`,
    suite: ({ describe, it, expect, createSpy }) => {
      describe('toHaveBeenCalledTimes', () => {
        it('conta as chamadas', () => {
          const log = createSpy('log');
          log(); log(); log();
          expect(log).toHaveBeenCalledTimes(3);
        });
      });
    },
    related: ['to-have-been-called', 'to-have-been-called-with'],
  },
  {
    id: 'to-have-been-called-with',
    name: 'toHaveBeenCalledWith',
    category: 'spies',
    signature: 'expect(spy).toHaveBeenCalledWith(...args)',
    summary: 'Verifica se o spy foi chamado com determinados argumentos.',
    description:
      'Confere se em ALGUMA das chamadas os argumentos bateram (comparados por igualdade profunda). ' +
      'É como você garante que seu código repassou os parâmetros certos para um serviço.',
    code: `describe('toHaveBeenCalledWith', () => {
  it('confere os argumentos passados', () => {
    const salvar = jasmine.createSpy('salvar');

    salvar({ id: 1, nome: 'Ana' });

    expect(salvar).toHaveBeenCalledWith({ id: 1, nome: 'Ana' });
  });
});`,
    suite: ({ describe, it, expect, createSpy }) => {
      describe('toHaveBeenCalledWith', () => {
        it('confere os argumentos passados', () => {
          const salvar = createSpy('salvar');
          salvar({ id: 1, nome: 'Ana' });
          expect(salvar).toHaveBeenCalledWith({ id: 1, nome: 'Ana' });
        });
      });
    },
    tips: ['Compara por igualdade profunda (como toEqual), então objetos equivalentes batem.'],
    related: ['to-have-been-called', 'to-have-been-called-times'],
  },
];

export function matcherById(id: string): MatcherDoc | undefined {
  return MATCHERS.find(m => m.id === id);
}

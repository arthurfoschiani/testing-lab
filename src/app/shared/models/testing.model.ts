import { TestApi } from '../lib/mini-jasmine';

/** Categorias usadas para agrupar os matchers no dicionário. */
export type MatcherCategoryId =
  | 'equality'
  | 'truthiness'
  | 'numbers'
  | 'collections'
  | 'exceptions'
  | 'spies';

export interface MatcherCategoryMeta {
  id: MatcherCategoryId;
  label: string;
  icon: string;
  color: string;
  description: string;
}

/** Uma entrada do dicionário de matchers. */
export interface MatcherDoc {
  /** slug usado na rota /matchers/:id */
  id: string;
  /** nome do matcher, ex.: toBe */
  name: string;
  category: MatcherCategoryId;
  /** assinatura resumida, ex.: expect(actual).toBe(expected) */
  signature: string;
  /** frase curta para listagem/cheatsheet */
  summary: string;
  /** explicação completa exibida no detalhe */
  description: string;
  /** código exibido no bloco de exemplo (idiomático, como você escreveria) */
  code: string;
  /** suíte executável ao vivo no test-runner */
  suite: (t: TestApi) => void;
  /** dica acima do botão rodar */
  hint?: string;
  /** pegadinhas / dicas */
  tips?: string[];
  /** ids de matchers relacionados */
  related?: string[];
}

export const MATCHER_CATEGORIES: MatcherCategoryMeta[] = [
  {
    id: 'equality',
    label: 'Igualdade',
    icon: '🟰',
    color: 'var(--primary)',
    description: 'Comparam valores por identidade (===) ou por estrutura profunda. A diferença entre toBe e toEqual é a pegadinha nº 1 de quem começa.',
  },
  {
    id: 'truthiness',
    label: 'Verdade & Nulos',
    icon: '✅',
    color: 'var(--accent)',
    description: 'Verificam truthy/falsy, null, undefined e definição, sem precisar dizer o valor exato.',
  },
  {
    id: 'numbers',
    label: 'Números',
    icon: '🔢',
    color: 'var(--info)',
    description: 'Comparações de grandeza e aproximação para floats (toBeCloseTo evita a dor do 0.1 + 0.2).',
  },
  {
    id: 'collections',
    label: 'Strings & Listas',
    icon: '📦',
    color: 'var(--warning)',
    description: 'Contém, tamanho e casamento por regex em strings e arrays.',
  },
  {
    id: 'exceptions',
    label: 'Exceções',
    icon: '💥',
    color: 'var(--danger)',
    description: 'Garantem que um código lança (ou não) um erro. Repare: você passa uma FUNÇÃO, não o resultado.',
  },
  {
    id: 'spies',
    label: 'Spies',
    icon: '🕵️',
    color: 'var(--primary-light)',
    description: 'Verificam se uma função-espiã foi chamada, quantas vezes e com quais argumentos.',
  },
];

export function matcherCategoryById(id: MatcherCategoryId): MatcherCategoryMeta {
  return MATCHER_CATEGORIES.find(c => c.id === id) ?? MATCHER_CATEGORIES[0];
}

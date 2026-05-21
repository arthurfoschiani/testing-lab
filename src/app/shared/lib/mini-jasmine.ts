// Motor de testes que replica a API do Jasmine (describe/it/expect/beforeEach/spies)
// e roda no navegador, para que as demos do app executem testes reais.

export type SpecStatus = 'pass' | 'fail' | 'skipped';

export interface ExpectationRecord {
  matcher: string;
  pass: boolean;
  message: string;
}

export interface SpecReport {
  describePath: string[];
  name: string;
  fullName: string;
  status: SpecStatus;
  expectations: ExpectationRecord[];
  error?: string;
  durationMs: number;
}

/** Resultado de uma execução completa de uma ou mais suítes. */
export interface RunReport {
  specs: SpecReport[];
  passed: number;
  failed: number;
  skipped: number;
  total: number;
  durationMs: number;
  /** Linhas escritas via console.log durante a execução. */
  logs: string[];
}

// Spies

export interface CallTracker {
  count(): number;
  any(): boolean;
  argsFor(index: number): unknown[];
  allArgs(): unknown[][];
  first(): { args: unknown[] } | null;
  mostRecent(): { args: unknown[] } | null;
  reset(): void;
}

export interface Spy {
  (...args: unknown[]): unknown;
  and: SpyStrategy;
  calls: CallTracker;
  /** marca usada internamente para identificar um spy. */
  readonly __isSpy: true;
}

export interface SpyStrategy {
  returnValue(value: unknown): Spy;
  returnValues(...values: unknown[]): Spy;
  callFake(fn: (...args: unknown[]) => unknown): Spy;
  callThrough(): Spy;
  throwError(error: string | Error): Spy;
  stub(): Spy;
}

type Strategy =
  | { kind: 'stub' }
  | { kind: 'return'; value: unknown }
  | { kind: 'returnSeq'; values: unknown[] }
  | { kind: 'fake'; fn: (...args: unknown[]) => unknown }
  | { kind: 'through' }
  | { kind: 'throw'; error: string | Error };

function createSpy(name = 'spy', original?: (...args: unknown[]) => unknown): Spy {
  const callsList: unknown[][] = [];
  let strategy: Strategy = { kind: 'stub' };
  let seqIndex = 0;

  const spy = function (this: unknown, ...args: unknown[]): unknown {
    callsList.push(args);
    switch (strategy.kind) {
      case 'stub':
        return undefined;
      case 'return':
        return strategy.value;
      case 'returnSeq':
        return strategy.values[Math.min(seqIndex++, strategy.values.length - 1)];
      case 'fake':
        return strategy.fn.apply(this, args);
      case 'through':
        return original ? original.apply(this, args) : undefined;
      case 'throw':
        throw strategy.error instanceof Error ? strategy.error : new Error(strategy.error);
    }
  } as Spy;

  Object.defineProperty(spy, 'name', { value: name });
  (spy as { __isSpy: true }).__isSpy = true;

  spy.and = {
    returnValue: (value: unknown) => { strategy = { kind: 'return', value }; return spy; },
    returnValues: (...values: unknown[]) => { strategy = { kind: 'returnSeq', values }; seqIndex = 0; return spy; },
    callFake: (fn) => { strategy = { kind: 'fake', fn }; return spy; },
    callThrough: () => { strategy = { kind: 'through' }; return spy; },
    throwError: (error) => { strategy = { kind: 'throw', error }; return spy; },
    stub: () => { strategy = { kind: 'stub' }; return spy; },
  };

  spy.calls = {
    count: () => callsList.length,
    any: () => callsList.length > 0,
    argsFor: (i) => callsList[i] ?? [],
    allArgs: () => callsList.slice(),
    first: () => (callsList.length ? { args: callsList[0] } : null),
    mostRecent: () => (callsList.length ? { args: callsList[callsList.length - 1] } : null),
    reset: () => { callsList.length = 0; seqIndex = 0; },
  };

  return spy;
}

function isSpy(value: unknown): value is Spy {
  return typeof value === 'function' && (value as { __isSpy?: boolean }).__isSpy === true;
}

// Igualdade e formatação

export function stringify(value: unknown, depth = 0): string {
  if (value === null) return 'null';
  if (value === undefined) return 'undefined';
  if (typeof value === 'string') return depth === 0 ? value : `'${value}'`;
  if (typeof value === 'number' || typeof value === 'boolean') return String(value);
  if (typeof value === 'bigint') return `${value}n`;
  if (typeof value === 'function') return isSpy(value) ? `<spy ${(value as Spy).name}>` : `<function ${value.name || 'anon'}>`;
  if (value instanceof Error) return `${value.name}: ${value.message}`;
  if (value instanceof RegExp) return value.toString();
  if (Array.isArray(value)) return '[' + value.map(v => stringify(v, depth + 1)).join(', ') + ']';
  if (typeof value === 'object') {
    const entries = Object.entries(value as Record<string, unknown>)
      .map(([k, v]) => `${k}: ${stringify(v, depth + 1)}`);
    return '{ ' + entries.join(', ') + ' }';
  }
  return String(value);
}

function deepEqual(a: unknown, b: unknown): boolean {
  if (a === b) return true;
  if (typeof a === 'number' && typeof b === 'number') return a !== a && b !== b; // NaN
  if (a === null || b === null || a === undefined || b === undefined) return a === b;
  if (typeof a !== typeof b) return false;
  if (a instanceof Date && b instanceof Date) return a.getTime() === b.getTime();
  if (a instanceof RegExp && b instanceof RegExp) return a.toString() === b.toString();
  if (Array.isArray(a) && Array.isArray(b)) {
    if (a.length !== b.length) return false;
    return a.every((item, i) => deepEqual(item, b[i]));
  }
  if (typeof a === 'object' && typeof b === 'object') {
    const ak = Object.keys(a as object);
    const bk = Object.keys(b as object);
    if (ak.length !== bk.length) return false;
    return ak.every(key =>
      Object.prototype.hasOwnProperty.call(b, key) &&
      deepEqual((a as Record<string, unknown>)[key], (b as Record<string, unknown>)[key]),
    );
  }
  return false;
}

// expect(...) e matchers

interface MatcherResult { pass: boolean; message: string; }
type MatcherFn = (actual: unknown, ...expected: unknown[]) => MatcherResult;

const MATCHERS: Record<string, MatcherFn> = {
  toBe: (a, e) => ({
    pass: a === e,
    message: `Esperava ${stringify(a)} ser (===) ${stringify(e)}`,
  }),
  toEqual: (a, e) => ({
    pass: deepEqual(a, e),
    message: `Esperava ${stringify(a)} ser igual (deep) a ${stringify(e)}`,
  }),
  toBeTruthy: (a) => ({ pass: !!a, message: `Esperava ${stringify(a)} ser truthy` }),
  toBeFalsy: (a) => ({ pass: !a, message: `Esperava ${stringify(a)} ser falsy` }),
  toBeNull: (a) => ({ pass: a === null, message: `Esperava ${stringify(a)} ser null` }),
  toBeUndefined: (a) => ({ pass: a === undefined, message: `Esperava ${stringify(a)} ser undefined` }),
  toBeDefined: (a) => ({ pass: a !== undefined, message: `Esperava ${stringify(a)} estar definido` }),
  toBeNaN: (a) => ({ pass: typeof a === 'number' && a !== a, message: `Esperava ${stringify(a)} ser NaN` }),
  toContain: (a, e) => ({
    pass: typeof a === 'string'
      ? a.includes(String(e))
      : Array.isArray(a) && a.some(item => deepEqual(item, e)),
    message: `Esperava ${stringify(a)} conter ${stringify(e)}`,
  }),
  toHaveSize: (a, e) => {
    const size = typeof a === 'string' || Array.isArray(a)
      ? (a as { length: number }).length
      : a && typeof a === 'object' ? Object.keys(a).length : NaN;
    return { pass: size === e, message: `Esperava ${stringify(a)} ter tamanho ${stringify(e)} (tem ${size})` };
  },
  toBeGreaterThan: (a, e) => ({ pass: (a as number) > (e as number), message: `Esperava ${stringify(a)} ser > ${stringify(e)}` }),
  toBeGreaterThanOrEqual: (a, e) => ({ pass: (a as number) >= (e as number), message: `Esperava ${stringify(a)} ser >= ${stringify(e)}` }),
  toBeLessThan: (a, e) => ({ pass: (a as number) < (e as number), message: `Esperava ${stringify(a)} ser < ${stringify(e)}` }),
  toBeLessThanOrEqual: (a, e) => ({ pass: (a as number) <= (e as number), message: `Esperava ${stringify(a)} ser <= ${stringify(e)}` }),
  toBeCloseTo: (a, e, precision) => {
    const p = (precision as number) ?? 2;
    const pass = Math.abs((a as number) - (e as number)) < Math.pow(10, -p) / 2;
    return { pass, message: `Esperava ${stringify(a)} ser próximo de ${stringify(e)} (${p} casas)` };
  },
  toMatch: (a, e) => {
    const re = e instanceof RegExp ? e : new RegExp(String(e));
    return { pass: re.test(String(a)), message: `Esperava ${stringify(a)} casar com ${re}` };
  },
  toBeInstanceOf: (a, e) => ({
    pass: a instanceof (e as new (...args: unknown[]) => unknown),
    message: `Esperava ${stringify(a)} ser instância de ${(e as { name?: string }).name ?? e}`,
  }),
  toThrow: (a) => {
    let threw = false;
    try { (a as () => void)(); } catch { threw = true; }
    return { pass: threw, message: `Esperava a função lançar um erro` };
  },
  toThrowError: (a, e) => {
    let message = '';
    let threw = false;
    try { (a as () => void)(); } catch (err) { threw = true; message = err instanceof Error ? err.message : String(err); }
    if (e === undefined) return { pass: threw, message: `Esperava a função lançar um Error` };
    const matches = e instanceof RegExp ? e.test(message) : message === e;
    return { pass: threw && matches, message: `Esperava lançar Error com mensagem ${stringify(e)} (lançou: ${stringify(message)})` };
  },
  toHaveBeenCalled: (a) => {
    const spy = a as Spy;
    return { pass: isSpy(spy) && spy.calls.any(), message: `Esperava o spy ter sido chamado` };
  },
  toHaveBeenCalledTimes: (a, e) => {
    const spy = a as Spy;
    return { pass: isSpy(spy) && spy.calls.count() === e, message: `Esperava o spy ser chamado ${stringify(e)}x (foi ${isSpy(spy) ? spy.calls.count() : 0}x)` };
  },
  toHaveBeenCalledWith: (a, ...e) => {
    const spy = a as Spy;
    const pass = isSpy(spy) && spy.calls.allArgs().some(args => deepEqual(args, e));
    return { pass, message: `Esperava o spy ser chamado com ${stringify(e)}` };
  },
};

/** Lista de nomes de matchers, usada para validação/autocomplete didático. */
export const MATCHER_NAMES = Object.keys(MATCHERS);

export interface Expectation {
  toBe(expected: unknown): void;
  toEqual(expected: unknown): void;
  toBeTruthy(): void;
  toBeFalsy(): void;
  toBeNull(): void;
  toBeUndefined(): void;
  toBeDefined(): void;
  toBeNaN(): void;
  toContain(expected: unknown): void;
  toHaveSize(expected: number): void;
  toBeGreaterThan(expected: number): void;
  toBeGreaterThanOrEqual(expected: number): void;
  toBeLessThan(expected: number): void;
  toBeLessThanOrEqual(expected: number): void;
  toBeCloseTo(expected: number, precision?: number): void;
  toMatch(expected: string | RegExp): void;
  toBeInstanceOf(expected: unknown): void;
  toThrow(): void;
  toThrowError(expected?: string | RegExp): void;
  toHaveBeenCalled(): void;
  toHaveBeenCalledTimes(expected: number): void;
  toHaveBeenCalledWith(...args: unknown[]): void;
  readonly not: Expectation;
}

// Estrutura interna de suítes/specs

interface SpecNode {
  name: string;
  fn: SpecFn;
  mode: 'normal' | 'skip' | 'focus';
}

interface SuiteNode {
  name: string;
  parent: SuiteNode | null;
  children: SuiteNode[];
  specs: SpecNode[];
  beforeEach: HookFn[];
  afterEach: HookFn[];
  beforeAll: HookFn[];
  afterAll: HookFn[];
  mode: 'normal' | 'skip' | 'focus';
}

type SpecFn = (done?: DoneFn) => void | Promise<void>;
type HookFn = (done?: DoneFn) => void | Promise<void>;

export interface DoneFn {
  (): void;
  fail(message?: string): void;
}

/** API injetada na função-construtora de testes (equivale aos globais do Jasmine). */
export interface TestApi {
  describe(name: string, fn: () => void): void;
  fdescribe(name: string, fn: () => void): void;
  xdescribe(name: string, fn: () => void): void;
  it(name: string, fn: SpecFn): void;
  fit(name: string, fn: SpecFn): void;
  xit(name: string, fn: SpecFn): void;
  beforeEach(fn: HookFn): void;
  afterEach(fn: HookFn): void;
  beforeAll(fn: HookFn): void;
  afterAll(fn: HookFn): void;
  expect(actual: unknown): Expectation;
  createSpy(name?: string): Spy;
  spyOn<T extends object, K extends keyof T>(obj: T, method: K): Spy;
  jasmine: { createSpy(name?: string): Spy };
}

const HOOK_TIMEOUT = 4000;

// Runner

export async function runSuite(build: (api: TestApi) => void): Promise<RunReport> {
  const root: SuiteNode = {
    name: '', parent: null, children: [], specs: [],
    beforeEach: [], afterEach: [], beforeAll: [], afterAll: [], mode: 'normal',
  };
  let current = root;
  const logs: string[] = [];

  // captura console.log durante a execução para mostrar no "console" da demo
  const realLog = console.log;
  console.log = (...args: unknown[]) => {
    logs.push(args.map(a => stringify(a)).join(' '));
    realLog.apply(console, args as []);
  };

  // expect precisa saber em qual spec está rodando para registrar resultados
  let activeSpec: SpecReport | null = null;
  const installedSpies: Array<{ obj: Record<string, unknown>; key: string; original: unknown }> = [];

  function makeExpectation(actual: unknown, negated = false): Expectation {
    const handler: Record<string, (...args: unknown[]) => void> = {};
    for (const [name, matcher] of Object.entries(MATCHERS)) {
      handler[name] = (...expected: unknown[]) => {
        const result = matcher(actual, ...expected);
        const pass = negated ? !result.pass : result.pass;
        const prefix = negated ? result.message.replace('Esperava', 'Esperava NÃO') : result.message;
        activeSpec?.expectations.push({ matcher: negated ? `not.${name}` : name, pass, message: prefix });
      };
    }
    Object.defineProperty(handler, 'not', { get: () => makeExpectation(actual, !negated) });
    return handler as unknown as Expectation;
  }

  const api: TestApi = {
    describe(name, fn) { defineSuite(name, fn, 'normal'); },
    fdescribe(name, fn) { defineSuite(name, fn, 'focus'); },
    xdescribe(name, fn) { defineSuite(name, fn, 'skip'); },
    it(name, fn) { current.specs.push({ name, fn, mode: 'normal' }); },
    fit(name, fn) { current.specs.push({ name, fn, mode: 'focus' }); },
    xit(name, fn) { current.specs.push({ name, fn, mode: 'skip' }); },
    beforeEach(fn) { current.beforeEach.push(fn); },
    afterEach(fn) { current.afterEach.push(fn); },
    beforeAll(fn) { current.beforeAll.push(fn); },
    afterAll(fn) { current.afterAll.push(fn); },
    expect: (actual) => makeExpectation(actual),
    createSpy: (name) => createSpy(name),
    spyOn: (obj, method) => {
      const key = method as string;
      const record = obj as unknown as Record<string, unknown>;
      const original = record[key];
      const spy = createSpy(key, typeof original === 'function' ? (original as (...a: unknown[]) => unknown) : undefined);
      record[key] = spy;
      installedSpies.push({ obj: record, key, original });
      return spy;
    },
    jasmine: { createSpy: (name) => createSpy(name) },
  };

  function defineSuite(name: string, fn: () => void, mode: SuiteNode['mode']): void {
    const node: SuiteNode = {
      name, parent: current, children: [], specs: [],
      beforeEach: [], afterEach: [], beforeAll: [], afterAll: [], mode,
    };
    current.children.push(node);
    const prev = current;
    current = node;
    fn();
    current = prev;
  }

  // 1) Construir a árvore executando a função-construtora
  const reports: SpecReport[] = [];
  const startAll = performance.now();
  try {
    build(api);
  } catch (err) {
    console.log = realLog;
    return {
      specs: [{
        describePath: [], name: '(erro ao montar as suítes)', fullName: '(erro ao montar as suítes)',
        status: 'fail', expectations: [], error: errMessage(err), durationMs: 0,
      }],
      passed: 0, failed: 1, skipped: 0, total: 1, durationMs: 0, logs,
    };
  }

  // 2) Detectar foco (fit/fdescribe)
  const hasFocus = detectFocus(root);

  // 3) Executar specs recursivamente
  async function runHook(hook: HookFn): Promise<void> {
    await invokeWithDone(hook);
  }

  async function walk(suite: SuiteNode, path: string[], beforeChain: HookFn[], afterChain: HookFn[], skip: boolean): Promise<void> {
    const suiteSkip = skip || suite.mode === 'skip';
    const here = suite.name ? [...path, suite.name] : path;
    const beforeHere = [...beforeChain, ...suite.beforeEach];
    const afterHere = [...suite.afterEach, ...afterChain];

    for (const hook of suite.beforeAll) {
      try { await runHook(hook); } catch { /* hooks beforeAll com erro: continua */ }
    }

    for (const spec of suite.specs) {
      const focused = !hasFocus || spec.mode === 'focus' || suiteHasFocusAncestor(suite);
      const report = await runSpec(spec, here, beforeHere, afterHere, suiteSkip || spec.mode === 'skip' || !focused);
      reports.push(report);
    }

    for (const child of suite.children) {
      await walk(child, here, beforeHere, afterHere, suiteSkip);
    }

    for (const hook of suite.afterAll) {
      try { await runHook(hook); } catch { /* ignore */ }
    }
  }

  function suiteHasFocusAncestor(suite: SuiteNode | null): boolean {
    while (suite) {
      if (suite.mode === 'focus') return true;
      suite = suite.parent;
    }
    return false;
  }

  async function runSpec(spec: SpecNode, path: string[], before: HookFn[], after: HookFn[], skip: boolean): Promise<SpecReport> {
    const report: SpecReport = {
      describePath: path,
      name: spec.name,
      fullName: [...path, spec.name].join(' › '),
      status: skip ? 'skipped' : 'pass',
      expectations: [],
      durationMs: 0,
    };
    if (skip) return report;

    activeSpec = report;
    const start = performance.now();
    try {
      for (const hook of before) await runHook(hook);
      await invokeWithDone(spec.fn);
    } catch (err) {
      report.error = errMessage(err);
    } finally {
      for (const hook of after) {
        try { await runHook(hook); } catch (err) { report.error ??= errMessage(err); }
      }
      // restaurar spies instalados via spyOn (como o Jasmine faz após cada spec)
      while (installedSpies.length) {
        const { obj, key, original } = installedSpies.pop()!;
        obj[key] = original;
      }
      report.durationMs = Math.round((performance.now() - start) * 100) / 100;
      activeSpec = null;
    }

    const anyFailed = report.expectations.some(e => !e.pass);
    if (report.error || anyFailed) report.status = 'fail';
    return report;
  }

  await walk(root, [], [], [], false);
  console.log = realLog;

  const durationMs = Math.round((performance.now() - startAll) * 100) / 100;
  const passed = reports.filter(r => r.status === 'pass').length;
  const failed = reports.filter(r => r.status === 'fail').length;
  const skipped = reports.filter(r => r.status === 'skipped').length;

  return { specs: reports, passed, failed, skipped, total: reports.length, durationMs, logs };
}

function detectFocus(suite: SuiteNode): boolean {
  if (suite.mode === 'focus') return true;
  if (suite.specs.some(s => s.mode === 'focus')) return true;
  return suite.children.some(detectFocus);
}

function errMessage(err: unknown): string {
  if (err instanceof Error) return `${err.name}: ${err.message}`;
  return stringify(err);
}

// Invoca um spec/hook que pode ser síncrono, assíncrono (Promise) ou callback done.
function invokeWithDone(fn: SpecFn | HookFn): Promise<void> {
  if (fn.length >= 1) {
    // assinatura (done) => ...
    return new Promise<void>((resolve, reject) => {
      const timer = setTimeout(() => reject(new Error('Timeout: done() não foi chamado em 4s')), HOOK_TIMEOUT);
      const done = (() => { clearTimeout(timer); resolve(); }) as DoneFn;
      done.fail = (message?: string) => { clearTimeout(timer); reject(new Error(message || 'done.fail()')); };
      try {
        const maybe = fn(done);
        if (maybe instanceof Promise) maybe.catch(reject);
      } catch (err) {
        clearTimeout(timer);
        reject(err);
      }
    });
  }
  const result = (fn as () => void | Promise<void>)();
  return result instanceof Promise ? result : Promise.resolve();
}

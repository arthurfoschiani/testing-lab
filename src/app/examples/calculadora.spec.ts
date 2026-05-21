import { Calculadora } from './calculadora';

// Unidade pura: sem TestBed, porque a classe não depende do Angular.
describe('Calculadora', () => {
  let calc: Calculadora;

  beforeEach(() => {
    calc = new Calculadora();
  });

  it('soma dois números', () => {
    expect(calc.somar(2, 3)).toBe(5);
  });

  it('divide normalmente', () => {
    expect(calc.dividir(10, 2)).toBe(5);
  });

  it('lança erro ao dividir por zero', () => {
    expect(() => calc.dividir(1, 0)).toThrowError('Divisão por zero');
  });
});

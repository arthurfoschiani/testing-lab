// Classe pura, sem dependências do Angular. Teste em calculadora.spec.ts.
export class Calculadora {
  somar(a: number, b: number): number {
    return a + b;
  }

  dividir(a: number, b: number): number {
    if (b === 0) {
      throw new Error('Divisão por zero');
    }
    return a / b;
  }
}

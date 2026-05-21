import { Component, signal } from '@angular/core';

@Component({
  selector: 'app-contador',
  standalone: true,
  template: `
    <p class="valor">{{ valor() }}</p>
    <button (click)="incrementar()">+1</button>
  `,
})
export class ContadorComponent {
  valor = signal(0);
  incrementar(): void {
    this.valor.update(v => v + 1);
  }
}

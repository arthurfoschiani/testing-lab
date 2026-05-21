import { Injectable } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class SaudacaoService {
  saudar(nome: string): string {
    return `Olá, ${nome}!`;
  }
}

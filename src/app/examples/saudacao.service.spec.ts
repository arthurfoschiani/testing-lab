import { TestBed } from '@angular/core/testing';
import { SaudacaoService } from './saudacao.service';

// Serviço obtido via TestBed.inject().
describe('SaudacaoService', () => {
  let service: SaudacaoService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(SaudacaoService);
  });

  it('é criado', () => {
    expect(service).toBeTruthy();
  });

  it('monta a saudação com o nome', () => {
    expect(service.saudar('Ana')).toBe('Olá, Ana!');
  });
});

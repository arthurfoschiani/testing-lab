import { ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { Subject, of, throwError } from 'rxjs';
import { TarefasComponent } from './tarefas.component';
import { TarefasService } from './tarefas.service';
import { Tarefa } from './tarefa.model';

// Componente com o service trocado por um dublê (jasmine.SpyObj). Sem HTTP real.
// Cada it define o retorno do spy antes do detectChanges() que dispara o ngOnInit.
describe('TarefasComponent', () => {
  let fixture: ComponentFixture<TarefasComponent>;
  let component: TarefasComponent;
  let service: jasmine.SpyObj<TarefasService>;

  const fake: Tarefa[] = [
    { id: 1, titulo: 'Estudar testes', concluida: false },
    { id: 2, titulo: 'Beber água', concluida: true },
  ];

  beforeEach(async () => {
    service = jasmine.createSpyObj<TarefasService>('TarefasService', [
      'listar', 'buscar', 'criar', 'atualizar', 'remover',
    ]);
    // retornos padrão, cada teste pode sobrescrever
    service.listar.and.returnValue(of(fake));
    service.buscar.and.returnValue(of([]));
    service.criar.and.returnValue(of({ id: 99, titulo: 'Nova', concluida: false }));
    service.atualizar.and.returnValue(of(fake[0]));
    service.remover.and.returnValue(of(void 0));

    await TestBed.configureTestingModule({
      imports: [TarefasComponent],
      providers: [{ provide: TarefasService, useValue: service }],
    }).compileComponents();

    fixture = TestBed.createComponent(TarefasComponent);
    component = fixture.componentInstance;
    // repare: NÃO chamamos detectChanges aqui, deixamos cada teste decidir
  });

  function lis(): HTMLElement[] {
    return Array.from(fixture.nativeElement.querySelectorAll('.tarefa'));
  }

  // carregamento inicial
  describe('carregamento inicial', () => {
    it('chama listar() no ngOnInit e renderiza a lista', () => {
      fixture.detectChanges(); // dispara ngOnInit

      expect(service.listar).toHaveBeenCalledTimes(1);
      expect(component.tarefas()).toEqual(fake);
      expect(lis().length).toBe(2);
    });

    it('mostra "Carregando…" enquanto a requisição não respondeu', () => {
      const pendente = new Subject<Tarefa[]>();
      service.listar.and.returnValue(pendente.asObservable());

      fixture.detectChanges();
      expect(component.carregando()).toBeTrue();
      expect(fixture.nativeElement.querySelector('.carregando')).toBeTruthy();

      pendente.next(fake);
      pendente.complete();
      fixture.detectChanges();

      expect(component.carregando()).toBeFalse();
      expect(fixture.nativeElement.querySelector('.carregando')).toBeNull();
      expect(lis().length).toBe(2);
    });

    it('mostra erro + botão de retry quando a API falha', () => {
      service.listar.and.returnValue(throwError(() => new Error('500')));

      fixture.detectChanges();

      expect(component.erro()).toBe('Falha ao carregar tarefas');
      expect(component.carregando()).toBeFalse();
      expect(fixture.nativeElement.querySelector('.erro')).toBeTruthy();
      expect(fixture.nativeElement.querySelector('.retry')).toBeTruthy();
    });

    it('o botão "Tentar de novo" chama listar() novamente', () => {
      service.listar.and.returnValue(throwError(() => new Error('500')));
      fixture.detectChanges();
      expect(service.listar).toHaveBeenCalledTimes(1);

      // agora a API "volta a funcionar"
      service.listar.and.returnValue(of(fake));
      fixture.nativeElement.querySelector('.retry').click();
      fixture.detectChanges();

      expect(service.listar).toHaveBeenCalledTimes(2);
      expect(component.erro()).toBeNull();
      expect(lis().length).toBe(2);
    });

    it('mostra estado vazio quando a lista volta sem itens', () => {
      service.listar.and.returnValue(of([]));
      fixture.detectChanges();

      expect(component.vazio()).toBeTrue();
      expect(fixture.nativeElement.querySelector('.vazio')).toBeTruthy();
    });
  });

  // adicionar
  describe('adicionar', () => {
    beforeEach(() => {
      service.listar.and.returnValue(of([]));
      fixture.detectChanges();
    });

    it('cria a tarefa, adiciona à lista e limpa o input', () => {
      const nova: Tarefa = { id: 5, titulo: 'Lavar a louça', concluida: false };
      service.criar.and.returnValue(of(nova));

      component.novoTitulo.set('Lavar a louça');
      component.adicionar();

      expect(service.criar).toHaveBeenCalledWith('Lavar a louça');
      expect(component.tarefas()).toContain(nova);
      expect(component.novoTitulo()).toBe('');
      expect(component.erro()).toBeNull();
    });

    it('rejeita título vazio e NÃO chama o service', () => {
      component.novoTitulo.set('   ');
      component.adicionar();

      expect(service.criar).not.toHaveBeenCalled();
      expect(component.erro()).toBe('Informe um título');
    });

    it('seta mensagem de erro quando criar() falha', () => {
      service.criar.and.returnValue(throwError(() => new Error('fail')));

      component.novoTitulo.set('X');
      component.adicionar();

      expect(component.erro()).toBe('Falha ao criar tarefa');
    });

    it('via DOM: digitar e enviar o formulário cria a tarefa', () => {
      service.criar.and.returnValue(of({ id: 7, titulo: 'Do DOM', concluida: false }));

      const input: HTMLInputElement = fixture.nativeElement.querySelector('.novo-titulo');
      input.value = 'Do DOM';
      input.dispatchEvent(new Event('input'));
      fixture.detectChanges();

      fixture.debugElement.query(By.css('form.nova')).triggerEventHandler('submit', new Event('submit'));
      fixture.detectChanges();

      expect(service.criar).toHaveBeenCalledWith('Do DOM');
      expect(lis().length).toBe(1);
    });
  });

  // alternar concluída
  describe('alternar', () => {
    it('chama atualizar() com concluida invertida e atualiza a lista', () => {
      service.listar.and.returnValue(of([{ id: 1, titulo: 'A', concluida: false }]));
      const salva: Tarefa = { id: 1, titulo: 'A', concluida: true };
      service.atualizar.and.returnValue(of(salva));
      fixture.detectChanges();

      component.alternar(component.tarefas()[0]);

      expect(service.atualizar).toHaveBeenCalledWith({ id: 1, titulo: 'A', concluida: true });
      expect(component.tarefas()[0].concluida).toBeTrue();
    });

    it('via DOM: marcar o checkbox dispara alternar()', () => {
      service.listar.and.returnValue(of([{ id: 1, titulo: 'A', concluida: false }]));
      service.atualizar.and.returnValue(of({ id: 1, titulo: 'A', concluida: true }));
      fixture.detectChanges();

      const check = fixture.debugElement.query(By.css('.toggle'));
      check.triggerEventHandler('change', { target: { checked: true } });

      expect(service.atualizar).toHaveBeenCalledTimes(1);
    });
  });

  // remover
  describe('remover', () => {
    it('remove a tarefa da lista após sucesso', () => {
      service.listar.and.returnValue(of([...fake]));
      service.remover.and.returnValue(of(void 0));
      fixture.detectChanges();
      expect(lis().length).toBe(2);

      component.remover(1);
      fixture.detectChanges();

      expect(service.remover).toHaveBeenCalledWith(1);
      expect(component.tarefas().some(t => t.id === 1)).toBeFalse();
      expect(lis().length).toBe(1);
    });

    it('via DOM: clicar em "remover" dispara o service', () => {
      service.listar.and.returnValue(of([...fake]));
      fixture.detectChanges();

      fixture.nativeElement.querySelector('.remover').click();

      expect(service.remover).toHaveBeenCalledWith(1);
    });
  });

  // filtros e contadores (derivados / computed)
  describe('derivados', () => {
    beforeEach(() => {
      // mexe direto no signal, sem detectChanges, para isolar a lógica
      component.tarefas.set([
        { id: 1, titulo: 'A', concluida: false },
        { id: 2, titulo: 'B', concluida: true },
        { id: 3, titulo: 'C', concluida: false },
      ]);
    });

    it('totalAtivas e totalConcluidas contam certo', () => {
      expect(component.totalAtivas()).toBe(2);
      expect(component.totalConcluidas()).toBe(1);
    });

    it('filtro "ativas" devolve só as não concluídas', () => {
      component.definirFiltro('ativas');
      expect(component.tarefasFiltradas().map(t => t.id)).toEqual([1, 3]);
    });

    it('filtro "concluidas" devolve só as concluídas', () => {
      component.definirFiltro('concluidas');
      expect(component.tarefasFiltradas().map(t => t.id)).toEqual([2]);
    });

    it('filtro "todas" devolve tudo', () => {
      component.definirFiltro('todas');
      expect(component.tarefasFiltradas()).toHaveSize(3);
    });

    it('via DOM: clicar num filtro marca o botão como ativo', () => {
      fixture.detectChanges(); // precisa renderizar para clicar
      const botoes = fixture.debugElement.queryAll(By.css('.filtro'));
      botoes[1].nativeElement.click(); // "Ativas"
      fixture.detectChanges();

      expect(component.filtro()).toBe('ativas');
      expect(botoes[1].nativeElement.classList).toContain('ativo');
    });
  });

  // busca com debounce (fakeAsync + tick)
  describe('busca com debounce', () => {
    it('só chama buscar() após 300ms (debounce)', fakeAsync(() => {
      fixture.detectChanges();           // ngOnInit -> listar
      service.listar.calls.reset();      // zera para isolar a busca
      service.buscar.and.returnValue(of([{ id: 8, titulo: 'achei', concluida: false }]));

      component.buscar('agua');
      tick(299);
      expect(service.buscar).not.toHaveBeenCalled(); // ainda não passou o debounce

      tick(1);
      expect(service.buscar).toHaveBeenCalledOnceWith('agua');
      expect(component.tarefas()).toEqual([{ id: 8, titulo: 'achei', concluida: false }]);
    }));

    it('ignora valores repetidos seguidos (distinctUntilChanged)', fakeAsync(() => {
      fixture.detectChanges();
      service.buscar.and.returnValue(of([]));

      component.buscar('x');
      tick(300);
      component.buscar('x'); // mesmo valor
      tick(300);

      expect(service.buscar).toHaveBeenCalledTimes(1);
    }));

    it('termo vazio recarrega a lista completa via listar()', fakeAsync(() => {
      fixture.detectChanges();
      service.listar.calls.reset();
      service.listar.and.returnValue(of(fake));

      component.buscar('   ');
      tick(300);

      expect(service.listar).toHaveBeenCalledTimes(1);
      expect(service.buscar).not.toHaveBeenCalled();
    }));
  });
});

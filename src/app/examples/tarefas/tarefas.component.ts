import { Component, computed, inject, signal } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { Subject } from 'rxjs';
import { debounceTime, distinctUntilChanged, switchMap } from 'rxjs/operators';
import { FiltroTarefa, Tarefa } from './tarefa.model';
import { TarefasService } from './tarefas.service';

// Lista de tarefas. Estado em signals aqui; o HTTP fica no TarefasService.
// Cobre loading, erro, retry, CRUD, validação, filtros, contadores e busca com debounce.
@Component({
  selector: 'app-tarefas',
  standalone: true,
  template: `
    <section class="tarefas">
      <h2>Minhas tarefas</h2>

      <!-- formulário de criação -->
      <form class="nova" (submit)="adicionar($event)">
        <input
          class="novo-titulo"
          type="text"
          placeholder="O que precisa ser feito?"
          [value]="novoTitulo()"
          (input)="novoTitulo.set($any($event.target).value)"
        />
        <button class="adicionar" type="submit">Adicionar</button>
      </form>

      <!-- busca -->
      <input
        class="busca"
        type="search"
        placeholder="Buscar…"
        (input)="buscar($any($event.target).value)"
      />

      <!-- filtros -->
      <div class="filtros">
        @for (f of filtros; track f.id) {
          <button
            class="filtro"
            [class.ativo]="filtro() === f.id"
            (click)="definirFiltro(f.id)"
          >{{ f.label }}</button>
        }
      </div>

      <!-- estados -->
      @if (carregando()) {
        <p class="carregando">Carregando…</p>
      } @else if (erro()) {
        <div class="erro">
          <span>{{ erro() }}</span>
          <button class="retry" (click)="carregar()">Tentar de novo</button>
        </div>
      } @else if (vazio()) {
        <p class="vazio">Nenhuma tarefa por aqui. Adicione a primeira! 🎉</p>
      } @else {
        <ul class="lista">
          @for (t of tarefasFiltradas(); track t.id) {
            <li class="tarefa" [class.concluida]="t.concluida">
              <label>
                <input
                  type="checkbox"
                  class="toggle"
                  [checked]="t.concluida"
                  (change)="alternar(t)"
                />
                <span class="titulo">{{ t.titulo }}</span>
              </label>
              <button class="remover" (click)="remover(t.id)">remover</button>
            </li>
          }
        </ul>
      }

      <!-- contadores -->
      <footer class="contadores">
        <span class="ativas">{{ totalAtivas() }} ativa(s)</span>
        <span class="concluidas">{{ totalConcluidas() }} concluída(s)</span>
      </footer>
    </section>
  `,
})
export class TarefasComponent {
  private service = inject(TarefasService);

  // estado
  tarefas = signal<Tarefa[]>([]);
  carregando = signal(false);
  erro = signal<string | null>(null);
  filtro = signal<FiltroTarefa>('todas');
  novoTitulo = signal('');

  filtros: { id: FiltroTarefa; label: string }[] = [
    { id: 'todas', label: 'Todas' },
    { id: 'ativas', label: 'Ativas' },
    { id: 'concluidas', label: 'Concluídas' },
  ];

  // derivados
  tarefasFiltradas = computed(() => {
    const lista = this.tarefas();
    switch (this.filtro()) {
      case 'ativas': return lista.filter(t => !t.concluida);
      case 'concluidas': return lista.filter(t => t.concluida);
      default: return lista;
    }
  });
  totalAtivas = computed(() => this.tarefas().filter(t => !t.concluida).length);
  totalConcluidas = computed(() => this.tarefas().filter(t => t.concluida).length);
  vazio = computed(() => !this.carregando() && !this.erro() && this.tarefas().length === 0);

  // busca com debounce
  private busca$ = new Subject<string>();

  constructor() {
    this.busca$
      .pipe(
        debounceTime(300),
        distinctUntilChanged(),
        switchMap(termo => (termo.trim() ? this.service.buscar(termo.trim()) : this.service.listar())),
        takeUntilDestroyed(),
      )
      .subscribe({
        next: tarefas => this.tarefas.set(tarefas),
        error: () => this.erro.set('Falha na busca'),
      });
  }

  ngOnInit(): void {
    this.carregar();
  }

  // ações
  carregar(): void {
    this.carregando.set(true);
    this.erro.set(null);
    this.service.listar().subscribe({
      next: tarefas => {
        this.tarefas.set(tarefas);
        this.carregando.set(false);
      },
      error: () => {
        this.erro.set('Falha ao carregar tarefas');
        this.carregando.set(false);
      },
    });
  }

  adicionar(event?: Event): void {
    event?.preventDefault();
    const titulo = this.novoTitulo().trim();
    if (!titulo) {
      this.erro.set('Informe um título');
      return;
    }
    this.service.criar(titulo).subscribe({
      next: nova => {
        this.tarefas.update(lista => [...lista, nova]);
        this.novoTitulo.set('');
        this.erro.set(null);
      },
      error: () => this.erro.set('Falha ao criar tarefa'),
    });
  }

  alternar(tarefa: Tarefa): void {
    const atualizada: Tarefa = { ...tarefa, concluida: !tarefa.concluida };
    this.service.atualizar(atualizada).subscribe({
      next: salva => this.tarefas.update(lista => lista.map(t => (t.id === salva.id ? salva : t))),
      error: () => this.erro.set('Falha ao atualizar tarefa'),
    });
  }

  remover(id: number): void {
    this.service.remover(id).subscribe({
      next: () => this.tarefas.update(lista => lista.filter(t => t.id !== id)),
      error: () => this.erro.set('Falha ao remover tarefa'),
    });
  }

  definirFiltro(filtro: FiltroTarefa): void {
    this.filtro.set(filtro);
  }

  buscar(termo: string): void {
    this.busca$.next(termo);
  }
}

import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';
import { Tarefa } from './tarefa.model';

// Acesso à API REST de tarefas. Testado com HttpTestingController.
@Injectable({ providedIn: 'root' })
export class TarefasService {
  private http = inject(HttpClient);
  private readonly base = '/api/tarefas';

  /** GET /api/tarefas */
  listar(): Observable<Tarefa[]> {
    return this.http.get<Tarefa[]>(this.base);
  }

  /** GET /api/tarefas?q=termo */
  buscar(termo: string): Observable<Tarefa[]> {
    return this.http.get<Tarefa[]>(this.base, { params: { q: termo } });
  }

  /** POST /api/tarefas */
  criar(titulo: string, prioridade: Tarefa['prioridade'] = 'media'): Observable<Tarefa> {
    return this.http.post<Tarefa>(this.base, { titulo, concluida: false, prioridade });
  }

  /** PUT /api/tarefas/:id */
  atualizar(tarefa: Tarefa): Observable<Tarefa> {
    return this.http.put<Tarefa>(`${this.base}/${tarefa.id}`, tarefa);
  }

  /** DELETE /api/tarefas/:id */
  remover(id: number): Observable<void> {
    return this.http.delete<void>(`${this.base}/${id}`);
  }
}

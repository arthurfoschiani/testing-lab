import { TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { TarefasService } from './tarefas.service';
import { Tarefa } from './tarefa.model';

// Service com HttpTestingController: intercepta a requisição, confere método/URL/corpo,
// responde com flush() e no afterEach o verify() garante que nada ficou pendente.
describe('TarefasService (HTTP)', () => {
  let service: TarefasService;
  let httpMock: HttpTestingController;

  const tarefasFake: Tarefa[] = [
    { id: 1, titulo: 'Estudar testes', concluida: false, prioridade: 'alta' },
    { id: 2, titulo: 'Beber água', concluida: true, prioridade: 'baixa' },
  ];

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        provideHttpClient(),
        provideHttpClientTesting(), // substitui o backend por um mock
      ],
    });
    service = TestBed.inject(TarefasService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify(); // falha o teste se houver requisição pendente
  });

  describe('listar()', () => {
    it('faz GET em /api/tarefas e devolve a lista', () => {
      let resultado: Tarefa[] | undefined;
      service.listar().subscribe(t => (resultado = t));

      const req = httpMock.expectOne('/api/tarefas');
      expect(req.request.method).toBe('GET');

      req.flush(tarefasFake);

      expect(resultado).toEqual(tarefasFake);
      expect(resultado?.length).toBe(2);
    });

    it('propaga erro quando o servidor responde 500', () => {
      let erroCapturado: unknown;
      service.listar().subscribe({
        next: () => fail('não deveria emitir next'),
        error: err => (erroCapturado = err),
      });

      httpMock
        .expectOne('/api/tarefas')
        .flush('boom', { status: 500, statusText: 'Server Error' });

      expect(erroCapturado).toBeTruthy();
    });
  });

  describe('buscar()', () => {
    it('envia o termo como query param ?q=', () => {
      service.buscar('água').subscribe();

      const req = httpMock.expectOne(r => r.url === '/api/tarefas' && r.params.has('q'));
      expect(req.request.method).toBe('GET');
      expect(req.request.params.get('q')).toBe('água');

      req.flush([tarefasFake[1]]);
    });
  });

  describe('criar()', () => {
    it('faz POST com o corpo correto e prioridade padrão', () => {
      const criada: Tarefa = { id: 9, titulo: 'Nova', concluida: false, prioridade: 'media' };
      let resultado: Tarefa | undefined;

      service.criar('Nova').subscribe(t => (resultado = t));

      const req = httpMock.expectOne('/api/tarefas');
      expect(req.request.method).toBe('POST');
      expect(req.request.body).toEqual({ titulo: 'Nova', concluida: false, prioridade: 'media' });

      req.flush(criada);
      expect(resultado).toEqual(criada);
    });

    it('respeita a prioridade informada', () => {
      service.criar('Urgente', 'alta').subscribe();

      const req = httpMock.expectOne('/api/tarefas');
      expect(req.request.body.prioridade).toBe('alta');
      req.flush({ id: 10, titulo: 'Urgente', concluida: false, prioridade: 'alta' });
    });
  });

  describe('atualizar()', () => {
    it('faz PUT em /api/tarefas/:id com a tarefa no corpo', () => {
      const tarefa: Tarefa = { id: 1, titulo: 'Estudar testes', concluida: true };

      service.atualizar(tarefa).subscribe();

      const req = httpMock.expectOne('/api/tarefas/1');
      expect(req.request.method).toBe('PUT');
      expect(req.request.body).toEqual(tarefa);

      req.flush(tarefa);
    });
  });

  describe('remover()', () => {
    it('faz DELETE em /api/tarefas/:id', () => {
      service.remover(2).subscribe();

      const req = httpMock.expectOne('/api/tarefas/2');
      expect(req.request.method).toBe('DELETE');

      req.flush(null);
    });
  });
});

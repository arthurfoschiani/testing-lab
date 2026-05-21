/** Modelo de domínio usado pela feature de Tarefas. */
export interface Tarefa {
  id: number;
  titulo: string;
  concluida: boolean;
  /** prioridade opcional, exercita campos que podem faltar */
  prioridade?: 'baixa' | 'media' | 'alta';
}

export type FiltroTarefa = 'todas' | 'ativas' | 'concluidas';

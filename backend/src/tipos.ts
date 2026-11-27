// Lucas Paes Amaro
// Sao os tipos do sistema, usado na tela, banco, etc, eh um tipo universal do sistema
// e aos CHECK do banco, para que tela, API e Oracle aceitem os mesmos valores.

export type TipoDemanda = "Tarefa" | "Defeito" | "Melhoria" | "Documentação";
export type PrioridadeDemanda = "Crítica" | "Alta" | "Média" | "Baixa";
export type StatusDemanda = "Aberta" | "Em andamento" | "Em revisão" | "Concluída" | "Cancelada";
export type Perfil = "Administrador" | "Líder de Projeto" | "Membro da Equipe";

// Listas usadas nas validações do servidor
export const TIPOS: TipoDemanda[] = ["Tarefa", "Defeito", "Melhoria", "Documentação"];
export const PRIORIDADES: PrioridadeDemanda[] = ["Crítica", "Alta", "Média", "Baixa"];
export const STATUS: StatusDemanda[] = ["Aberta", "Em andamento", "Em revisão", "Concluída", "Cancelada"];

// Formato de uma demanda em JSON
export interface Demanda {
  id: number;
  titulo: string;
  descricao: string;
  tipo: TipoDemanda;
  prioridade: PrioridadeDemanda;
  status: StatusDemanda;
  projetoId: number;
  responsavelId: number | null;   // pode ficar vazio na criacao, q nem no banco modelado
  dataCriacao: string;            // servidor preenche
  dataAtualizacao: string;        // servidor preenche
  prazo: string | null;           // "AAAA-MM-DD"
}
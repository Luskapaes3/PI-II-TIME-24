
export const projetos = [
  { id: 1, nome: "Portal do Aluno", descricao: "Sistema acadêmico para alunos" },
  { id: 2, nome: "Sistema Financeiro", descricao: "Controle financeiro da empresa" },
  { id: 3, nome: "Aplicativo Mobile", descricao: "Aplicativo para dispositivos móveis" },
  { id: 4, nome: "Sistema de Estoque", descricao: "Gerenciamento de produtos e estoque" },
  { id: 5, nome: "Plataforma EAD", descricao: "Plataforma de ensino a distância" }
];

export const usuarios = [
  { id: 1, nome: "Carla", email: "carla@exemplo.com" },
  { id: 2, nome: "Bruno", email: "bruno@exemplo.com" },
  { id: 3, nome: "Mariana", email: "mariana@exemplo.com" },
  { id: 4, nome: "Lucas", email: "lucas@exemplo.com" },
  { id: 5, nome: "Rafael", email: "rafael@exemplo.com" }
];

export const demandas = [
  {
    id: 1,
    titulo: "Corrigir erro de login",
    descricao: "Erro ao entrar no sistema",
    tipo: "Defeito",
    prioridade: "Crítica",
    status: "Aberta",
    projetoId: 1,
    responsavelId: 1,
    dataCriacao: "2026-09-20T10:00:00.000Z",
    dataAtualizacao: "2026-09-20T10:00:00.000Z",
    prazo: "2026-10-16"
  },
  {
    id: 2,
    titulo: "Criar tela de relatórios",
    descricao: "Implementar gráficos mensais",
    tipo: "Tarefa",
    prioridade: "Alta",
    status: "Em andamento",
    projetoId: 2,
    responsavelId: 2,
    dataCriacao: "2026-09-22T10:00:00.000Z",
    dataAtualizacao: "2026-09-25T14:00:00.000Z",
    prazo: "2026-10-30"
  },
  {
    id: 3,
    titulo: "Melhorar carregamento",
    descricao: "Otimizar o carregamento da página inicial",
    tipo: "Melhoria",
    prioridade: "Média",
    status: "Em revisão",
    projetoId: 1,
    responsavelId: 2,
    dataCriacao: "2026-09-25T09:00:00.000Z",
    dataAtualizacao: "2026-09-29T11:30:00.000Z",
    prazo: "2026-10-20"
  },
  {
    id: 4,
    titulo: "Documentar API",
    descricao: "Documentar as rotas de usuários",
    tipo: "Documentação",
    prioridade: "Baixa",
    status: "Aberta",
    projetoId: 3,
    responsavelId: 1,
    dataCriacao: "2026-09-28T08:00:00.000Z",
    dataAtualizacao: "2026-09-28T08:00:00.000Z",
    prazo: null
  },
  {
    id: 5,
    titulo: "Falha ao salvar perfil",
    descricao: "Erro 500 ao atualizar a foto do perfil",
    tipo: "Defeito",
    prioridade: "Alta",
    status: "Aberta",
    projetoId: 3,
    responsavelId: 1,
    dataCriacao: "2026-10-01T13:00:00.000Z",
    dataAtualizacao: "2026-10-01T13:00:00.000Z",
    prazo: "2026-10-18"
  },
  {
    id: 6,
    titulo: "Cadastrar produtos",
    descricao: "Criar formulário para cadastro de produtos",
    tipo: "Tarefa",
    prioridade: "Média",
    status: "Em andamento",
    projetoId: 4,
    responsavelId: 3,
    dataCriacao: "2026-10-02T09:00:00.000Z",
    dataAtualizacao: "2026-10-05T15:00:00.000Z",
    prazo: "2026-10-25"
  },
  {
    id: 7,
    titulo: "Adicionar recuperação de senha",
    descricao: "Permitir redefinir a senha por e-mail",
    tipo: "Melhoria",
    prioridade: "Alta",
    status: "Aberta",
    projetoId: 5,
    responsavelId: 4,
    dataCriacao: "2026-10-03T10:00:00.000Z",
    dataAtualizacao: "2026-10-03T10:00:00.000Z",
    prazo: "2026-10-22"
  },
  {
    id: 8,
    titulo: "Atualizar manual do sistema",
    descricao: "Incluir instruções para novos usuários",
    tipo: "Documentação",
    prioridade: "Baixa",
    status: "Concluída",
    projetoId: 2,
    responsavelId: 5,
    dataCriacao: "2026-10-04T08:30:00.000Z",
    dataAtualizacao: "2026-10-08T16:00:00.000Z",
    prazo: "2026-10-12"
  },
  {
    id: 9,
    titulo: "Corrigir cálculo de valores",
    descricao: "Ajustar cálculo de descontos nos pagamentos",
    tipo: "Defeito",
    prioridade: "Crítica",
    status: "Em andamento",
    projetoId: 2,
    responsavelId: 3,
    dataCriacao: "2026-10-05T11:00:00.000Z",
    dataAtualizacao: "2026-10-07T09:00:00.000Z",
    prazo: "2026-10-17"
  },
  {
    id: 10,
    titulo: "Melhorar acessibilidade",
    descricao: "Adicionar recursos de acessibilidade às telas",
    tipo: "Melhoria",
    prioridade: "Média",
    status: "Aberta",
    projetoId: 5,
    responsavelId: null,
    dataCriacao: "2026-10-06T14:00:00.000Z",
    dataAtualizacao: "2026-10-06T14:00:00.000Z",
    prazo: null
  }
];

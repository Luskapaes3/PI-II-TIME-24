/* Autor: [Gabriel André Cogo Fernandes]*/

export type Perfil = "Administrador" | "Líder de Projeto" | "Membro da Equipe";

export interface Usuario {
  id: number;
  nome: string;
  email: string;
  senha: string;
  perfil: Perfil;
}

export const usuarios: Usuario[] = [
  { id: 1, nome: "Ana Souza",     email: "ana.souza@pi2.com",     senha: "Admin@123",  perfil: "Administrador" },
  { id: 2, nome: "Bruno Lima",    email: "bruno.lima@pi2.com",    senha: "Lider@123",  perfil: "Líder de Projeto" },
  { id: 3, nome: "Carla Mendes",  email: "carla.mendes@pi2.com",  senha: "Lider@456",  perfil: "Líder de Projeto" },
  { id: 4, nome: "Diego Alves",   email: "diego.alves@pi2.com",   senha: "Membro@123", perfil: "Membro da Equipe" },
  { id: 5, nome: "Elisa Rocha",   email: "elisa.rocha@pi2.com",   senha: "Membro@456", perfil: "Membro da Equipe" },
  { id: 6, nome: "Felipe Costa",  email: "felipe.costa@pi2.com",  senha: "Membro@789", perfil: "Membro da Equipe" }
];

/*Remove a senha de um usuário antes de enviar para o cliente.*/
export function semSenha(usuario: Usuario) {
  const { senha, ...dadosPublicos } = usuario;
  return dadosPublicos;
}

export interface IEmprestimo {
  id: number;
  livroId: number;
  clienteId: number;
  dataEmprestimo: Date;
  dataDevolucao: Date | null;
}
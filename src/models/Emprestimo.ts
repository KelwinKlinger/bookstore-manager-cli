import type { IEmprestimo } from "./IEmprestimo";

export class Emprestimo implements IEmprestimo {
  public readonly id: number;
  public readonly livroId: number;
  public readonly clienteId: number;
  public readonly dataEmprestimo: Date;
  public dataDevolucao: Date | null;

  constructor(
    id: number,
    livroId: number,
    clienteId: number,
    dataEmprestimo: Date = new Date(),
    dataDevolucao: Date | null = null
  ) {
    this.id = id;
    this.livroId = livroId;
    this.clienteId = clienteId;
    this.dataEmprestimo = dataEmprestimo;
    this.dataDevolucao = dataDevolucao;
  }
}
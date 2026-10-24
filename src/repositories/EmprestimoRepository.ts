import { Emprestimo } from "../models/Emprestimo";

export class EmprestimoRepository {
  private emprestimos: Emprestimo[] = [];

  public async inserir(emprestimo: Emprestimo): Promise<void> {
    this.emprestimos.push(emprestimo);
  }

  public async listar(): Promise<Emprestimo[]> {
    return [...this.emprestimos];
  }

  public async buscarPorId(id: number): Promise<Emprestimo | undefined> {
    return this.emprestimos.find(
      (emprestimo) => emprestimo.id === id
    );
  }

  public async listarAtivos(): Promise<Emprestimo[]> {
    return this.emprestimos.filter(
      (emprestimo) => emprestimo.dataDevolucao === null
    );
  }

  public async contarAtivosPorLivroId(livroId: number): Promise<number> {
    return this.emprestimos.filter(
      (emprestimo) => emprestimo.livroId === livroId &&
        emprestimo.dataDevolucao === null
    ).length;
  }

  public async buscarAtivoPorLivroId(
    livroId: number
  ): Promise<Emprestimo | undefined> {
    return this.emprestimos.find(
      (emprestimo) =>
        emprestimo.livroId === livroId &&
        emprestimo.dataDevolucao === null
    );
  }

  public async existePorLivroId(livroId: number): Promise<boolean> {
    return this.emprestimos.some(
      (emprestimo) => emprestimo.livroId === livroId
    );
  }

  public async existePorClienteId(clienteId: number): Promise<boolean> {
    return this.emprestimos.some(
      (emprestimo) => emprestimo.clienteId === clienteId
    );
  }

  public async registrarDevolucao(id: number, data: Date): Promise<boolean> {
    const emprestimo = await this.buscarPorId(id);

    if (!emprestimo) {
      return false;
    }

    emprestimo.dataDevolucao = data;

    return true;
  }
}

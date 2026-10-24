import { Emprestimo } from "../models/Emprestimo";

export class EmprestimoRepository {
  private emprestimos: Emprestimo[] = [];

  public inserir(emprestimo: Emprestimo): void {
    this.emprestimos.push(emprestimo);
  }

  public listar(): Emprestimo[] {
    return [...this.emprestimos];
  }

  public buscarPorId(id: number): Emprestimo | undefined {
    return this.emprestimos.find(
      (emprestimo) => emprestimo.id === id
    );
  }

  public listarAtivos(): Emprestimo[] {
    return this.emprestimos.filter(
      (emprestimo) => emprestimo.dataDevolucao === null
    );
  }

  public buscarAtivoPorLivroId(
    livroId: number
  ): Emprestimo | undefined {
    return this.emprestimos.find(
      (emprestimo) =>
        emprestimo.livroId === livroId &&
        emprestimo.dataDevolucao === null
    );
  }

  public existePorLivroId(livroId: number): boolean {
    return this.emprestimos.some(
      (emprestimo) => emprestimo.livroId === livroId
    );
  }

  public existePorClienteId(clienteId: number): boolean {
    return this.emprestimos.some(
      (emprestimo) => emprestimo.clienteId === clienteId
    );
  }

  public registrarDevolucao(id: number, data: Date): boolean {
    const emprestimo = this.buscarPorId(id);

    if (!emprestimo) {
      return false;
    }

    emprestimo.dataDevolucao = data;

    return true;
  }
}
import { Emprestimo } from "../models/Emprestimo";
import { EmprestimoService } from "../services/EmprestimoService";
import { Terminal } from "../utils/Terminal";

export class EmprestimoController {
  constructor(
    private readonly service: EmprestimoService,
    private readonly terminal: Terminal
  ) {}

  public async realizar(): Promise<void> {
    const livroId = await this.lerId("ID do livro: ");
    const clienteId = await this.lerId("ID do cliente: ");

    const emprestimo = this.service.realizar(livroId, clienteId);

    console.log(`Empréstimo registrado com ID ${emprestimo.id}.`);
  }

  public async devolver(): Promise<void> {
    const id = await this.lerId("ID do empréstimo: ");

    this.service.devolver(id);

    console.log("Devolução registrada.");
  }

  public listar(): void {
    this.exibir(this.service.listar());
  }

  public listarAtivos(): void {
    this.exibir(this.service.listarAtivos());
  }

  public async consultar(): Promise<void> {
    const id = await this.lerId("ID do empréstimo: ");

    this.exibir([this.service.buscarPorId(id)]);
  }

  private exibir(emprestimos: Emprestimo[]): void {
    if (emprestimos.length === 0) {
      console.log("Nenhum empréstimo encontrado.");
      return;
    }

    console.table(
      emprestimos.map((emprestimo) => ({
        id: emprestimo.id,
        livroId: emprestimo.livroId,
        clienteId: emprestimo.clienteId,
        dataEmprestimo: emprestimo.dataEmprestimo.toLocaleString("pt-BR"),
        dataDevolucao:
          emprestimo.dataDevolucao === null
            ? "Em aberto"
            : emprestimo.dataDevolucao.toLocaleString("pt-BR")
      }))
    );
  }

  private async lerId(mensagem: string): Promise<number> {
    const entrada = await this.terminal.perguntar(mensagem);

    if (!/^[0-9]+$/.test(entrada)) {
      throw new Error("Digite um ID inteiro positivo.");
    }

    return Number(entrada);
  }
}
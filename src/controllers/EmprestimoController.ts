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

    const emprestimo = await this.service.realizar(livroId, clienteId);

    console.log(`Empréstimo registrado com ID ${emprestimo.id}.`);
  }

  public async devolver(): Promise<void> {
    const id = await this.lerId("ID do empréstimo: ");

    await this.service.devolver(id);

    console.log("Devolução registrada.");
  }

  public async listar(): Promise<void> {
    await this.exibir(await this.service.listar());
  }

  public async listarAtivos(): Promise<void> {
    await this.exibir(await this.service.listarAtivos());
  }

  public async consultar(): Promise<void> {
    const id = await this.lerId("ID do empréstimo: ");

    await this.exibir([await this.service.buscarPorId(id)]);
  }

  private async exibir(emprestimos: Emprestimo[]): Promise<void> {
    if (emprestimos.length === 0) {
      console.log("Nenhum empréstimo encontrado.");
      return;
    }

    const registros = [];

    for (const emprestimo of emprestimos) {
      const detalhes = await this.service.consultarDetalhes(
        emprestimo.id
      );

      registros.push({
        id: emprestimo.id,
        livro: detalhes.tituloLivro,
        cliente: detalhes.nomeCliente,
        dataEmprestimo:
          emprestimo.dataEmprestimo.toLocaleString("pt-BR"),
        dataDevolucao:
          emprestimo.dataDevolucao === null
            ? "Em aberto"
            : emprestimo.dataDevolucao.toLocaleString("pt-BR")
      });
    }

    console.table(registros);
  }

  private async lerId(mensagem: string): Promise<number> {
    const entrada = await this.terminal.perguntar(mensagem);

    if (!/^[0-9]+$/.test(entrada)) {
      throw new Error("Digite um ID inteiro positivo.");
    }

    return Number(entrada);
  }
}
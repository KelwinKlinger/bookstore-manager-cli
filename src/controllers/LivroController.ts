import { LivroService } from "../services/LivroService";
import { Terminal } from "../utils/Terminal";

export class LivroController {
  constructor(
    private readonly service: LivroService,
    private readonly terminal: Terminal
  ) {}

  public async cadastrar(): Promise<void> {
    const titulo = await this.terminal.perguntar("Título do livro: ");
    const autorId = await this.lerId("ID do autor: ");

    const quantidade = await this.lerQuantidade();
    const livro = await this.service.cadastrar(titulo, autorId, quantidade);

    console.log(`Livro cadastrado com ID ${livro.id}.`);
  }

  public async listar(): Promise<void> {
    const livros = await this.service.listar();

    if (livros.length === 0) {
      console.log("Nenhum livro cadastrado.");
      return;
    }

    const registros = [];
    for (const livro of livros) {
      registros.push(await this.service.consultarDisponibilidade(livro.id));
    }
    console.table(registros);
  }

  public async consultar(): Promise<void> {
    const id = await this.lerId("ID do livro: ");

    console.table([await this.service.consultarDisponibilidade(id)]);
  }

  public async atualizar(): Promise<void> {
    const id = await this.lerId("ID do livro: ");
    await this.service.buscarPorId(id);

    const titulo = await this.terminal.perguntar("Novo título: ");
    const autorId = await this.lerId("ID do autor: ");

    const quantidade = await this.lerQuantidade();
    await this.service.atualizar(id, titulo, autorId, quantidade);

    console.log("Livro atualizado.");
  }

  public async remover(): Promise<void> {
    const id = await this.lerId("ID do livro: ");
    await this.service.remover(id);

    console.log("Livro removido.");
  }

  private async lerQuantidade(): Promise<number> {
    const entrada = await this.terminal.perguntar("Quantidade total de exemplares: ");
    if (!/^[0-9]+$/.test(entrada)) {
      throw new Error("Digite uma quantidade inteira positiva.");
    }
    return Number(entrada);
  }

  private async lerId(mensagem: string): Promise<number> {
    const entrada = await this.terminal.perguntar(mensagem);

    if (!/^[0-9]+$/.test(entrada)) {
      throw new Error("Digite um ID inteiro positivo.");
    }

    return Number(entrada);
  }
}

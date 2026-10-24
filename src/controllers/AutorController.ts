import { AutorService } from "../services/AutorService";
import { Terminal } from "../utils/Terminal";

export class AutorController {
  constructor(
    private readonly service: AutorService,
    private readonly terminal: Terminal
  ) {}

  public async cadastrar(): Promise<void> {
    const nome = await this.terminal.perguntar("Nome do autor: ");
    const autor = await this.service.cadastrar(nome);

    console.log(`Autor cadastrado com ID ${autor.id}.`);
  }

  public async listar(): Promise<void> {
    const autores = await this.service.listar();

    if (autores.length === 0) {
      console.log("Nenhum autor cadastrado.");
      return;
    }

    console.table(autores);
  }

  public async consultar(): Promise<void> {
    const id = await this.lerId();

    console.table([await this.service.buscarPorId(id)]);
  }

  public async atualizar(): Promise<void> {
    const id = await this.lerId();
    await this.service.buscarPorId(id);

    const nome = await this.terminal.perguntar("Novo nome: ");
    await this.service.atualizar(id, nome);

    console.log("Autor atualizado.");
  }

  public async remover(): Promise<void> {
    const id = await this.lerId();
    await this.service.remover(id);

    console.log("Autor removido.");
  }

  private async lerId(): Promise<number> {
    const entrada = await this.terminal.perguntar("ID do autor: ");

    if (!/^[0-9]+$/.test(entrada)) {
      throw new Error("Digite um ID inteiro positivo.");
    }

    return Number(entrada);
  }
}

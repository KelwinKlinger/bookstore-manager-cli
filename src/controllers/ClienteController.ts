import { ClienteService } from "../services/ClienteService";
import { Terminal } from "../utils/Terminal";

export class ClienteController {
  constructor(
    private readonly service: ClienteService,
    private readonly terminal: Terminal
  ) {}

  public async cadastrar(): Promise<void> {
    const nome = await this.terminal.perguntar("Nome do cliente: ");
    const email = await this.terminal.perguntar("E-mail: ");

    const cliente = this.service.cadastrar(nome, email);

    console.log(`Cliente cadastrado com ID ${cliente.id}.`);
  }

  public listar(): void {
    const clientes = this.service.listar();

    if (clientes.length === 0) {
      console.log("Nenhum cliente cadastrado.");
      return;
    }

    console.table(clientes);
  }

  public async consultar(): Promise<void> {
    const id = await this.lerId();

    console.table([this.service.buscarPorId(id)]);
  }

  public async atualizar(): Promise<void> {
    const id = await this.lerId();
    this.service.buscarPorId(id);

    const nome = await this.terminal.perguntar("Novo nome: ");
    const email = await this.terminal.perguntar("Novo e-mail: ");

    this.service.atualizar(id, nome, email);

    console.log("Cliente atualizado.");
  }

  public async remover(): Promise<void> {
    const id = await this.lerId();
    this.service.remover(id);

    console.log("Cliente removido.");
  }

  private async lerId(): Promise<number> {
    const entrada = await this.terminal.perguntar("ID do cliente: ");

    if (!/^[0-9]+$/.test(entrada)) {
      throw new Error("Digite um ID inteiro positivo.");
    }

    return Number(entrada);
  }
}
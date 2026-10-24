import { Cliente } from "../models/Cliente";

export class ClienteRepository {
  private clientes: Cliente[] = [];
  private proximoId = 1;

  public async gerarId(): Promise<number> {
    if (!Number.isSafeInteger(this.proximoId)) {
      throw new Error("Limite de IDs atingido.");
    }
    return this.proximoId++;
  }

  public async inserir(cliente: Cliente): Promise<void> {
    this.clientes.push(cliente);
    this.proximoId = Math.max(this.proximoId, cliente.id + 1);
  }

  public async listar(): Promise<Cliente[]> {
    return [...this.clientes];
  }

  public async buscarPorId(id: number): Promise<Cliente | undefined> {
    return this.clientes.find((cliente) => cliente.id === id);
  }

  public async buscarPorEmail(email: string): Promise<Cliente | undefined> {
    return this.clientes.find((cliente) => cliente.email === email);
  }

  public async atualizar(id: number, nome: string, email: string): Promise<boolean> {
    const cliente = await this.buscarPorId(id);

    if (!cliente) {
      return false;
    }

    cliente.nome = nome;
    cliente.email = email;

    return true;
  }

  public async remover(id: number): Promise<boolean> {
    const indice = this.clientes.findIndex(
      (cliente) => cliente.id === id
    );

    if (indice === -1) {
      return false;
    }

    this.clientes.splice(indice, 1);

    return true;
  }
}

import { Cliente } from "../models/Cliente";

export class ClienteRepository {
  private clientes: Cliente[] = [];

  public inserir(cliente: Cliente): void {
    this.clientes.push(cliente);
  }

  public listar(): Cliente[] {
    return [...this.clientes];
  }

  public buscarPorId(id: number): Cliente | undefined {
    return this.clientes.find((cliente) => cliente.id === id);
  }

  public buscarPorEmail(email: string): Cliente | undefined {
    return this.clientes.find((cliente) => cliente.email === email);
  }

  public atualizar(id: number, nome: string, email: string): boolean {
    const cliente = this.buscarPorId(id);

    if (!cliente) {
      return false;
    }

    cliente.nome = nome;
    cliente.email = email;

    return true;
  }

  public remover(id: number): boolean {
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
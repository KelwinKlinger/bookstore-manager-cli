import { Cliente } from "../models/Cliente";
import { ClienteRepository } from "../repositories/ClienteRepository";
import { EmprestimoRepository } from "../repositories/EmprestimoRepository";

export class ClienteService {
  constructor(
    private readonly repository: ClienteRepository,
    private readonly emprestimoRepository: EmprestimoRepository,
  ) {}

  public async cadastrar(nome: string, email: string): Promise<Cliente> {
    const nomeValidado = this.validarNome(nome);
    const emailValidado = this.validarEmail(email);

    await this.verificarEmailDisponivel(emailValidado);

    const maiorId = (await this.repository.listar())
      .reduce((maior, cliente) => Math.max(maior, cliente.id), 0);

    const cliente = new Cliente(maiorId + 1, nomeValidado, emailValidado);

    await this.repository.inserir(cliente);

    return cliente;
  }

  public async listar(): Promise<Cliente[]> {
    return await this.repository.listar();
  }

  public async buscarPorId(id: number): Promise<Cliente> {
    this.validarId(id);

    const cliente = await this.repository.buscarPorId(id);

    if (!cliente) {
      throw new Error("Cliente não encontrado.");
    }

    return cliente;
  }

  public async atualizar(id: number, nome: string, email: string): Promise<Cliente> {
    await this.buscarPorId(id);

    const nomeValidado = this.validarNome(nome);
    const emailValidado = this.validarEmail(email);

    await this.verificarEmailDisponivel(emailValidado, id);
    await this.repository.atualizar(id, nomeValidado, emailValidado);

    return await this.buscarPorId(id);
  }

  public async remover(id: number): Promise<void> {
    await this.buscarPorId(id);

    if (await this.emprestimoRepository.existePorClienteId(id)) {
      throw new Error(
        "Não é possível remover um cliente com histórico de empréstimos.",
      );
    }

    await this.repository.remover(id);
  }
  private validarNome(nome: string): string {
    const nomeTratado = nome.trim();

    if (nomeTratado.length === 0) {
      throw new Error("O nome do cliente é obrigatório.");
    }

    return nomeTratado;
  }

  private validarEmail(email: string): string {
    const emailTratado = email.trim().toLowerCase();

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(emailTratado)) {
      throw new Error("Informe um e-mail válido.");
    }

    return emailTratado;
  }

  private async verificarEmailDisponivel(email: string, clienteId?: number): Promise<void> {
    const cliente = await this.repository.buscarPorEmail(email);

    if (cliente && cliente.id !== clienteId) {
      throw new Error("Este e-mail já está cadastrado.");
    }
  }

  private validarId(id: number): void {
    if (!Number.isSafeInteger(id) || id <= 0) {
      throw new Error("O ID deve ser um número inteiro positivo.");
    }
  }
}

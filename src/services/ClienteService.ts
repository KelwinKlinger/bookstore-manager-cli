import { Cliente } from "../models/Cliente";
import { ClienteRepository } from "../repositories/ClienteRepository";
import { EmprestimoRepository } from "../repositories/EmprestimoRepository";

export class ClienteService {
  constructor(
    private readonly repository: ClienteRepository,
    private readonly emprestimoRepository: EmprestimoRepository,
  ) {}

  public cadastrar(nome: string, email: string): Cliente {
    const nomeValidado = this.validarNome(nome);
    const emailValidado = this.validarEmail(email);

    this.verificarEmailDisponivel(emailValidado);

    const maiorId = this.repository
      .listar()
      .reduce((maior, cliente) => Math.max(maior, cliente.id), 0);

    const cliente = new Cliente(maiorId + 1, nomeValidado, emailValidado);

    this.repository.inserir(cliente);

    return cliente;
  }

  public listar(): Cliente[] {
    return this.repository.listar();
  }

  public buscarPorId(id: number): Cliente {
    this.validarId(id);

    const cliente = this.repository.buscarPorId(id);

    if (!cliente) {
      throw new Error("Cliente não encontrado.");
    }

    return cliente;
  }

  public atualizar(id: number, nome: string, email: string): Cliente {
    this.buscarPorId(id);

    const nomeValidado = this.validarNome(nome);
    const emailValidado = this.validarEmail(email);

    this.verificarEmailDisponivel(emailValidado, id);
    this.repository.atualizar(id, nomeValidado, emailValidado);

    return this.buscarPorId(id);
  }

  public remover(id: number): void {
    this.buscarPorId(id);

    if (this.emprestimoRepository.existePorClienteId(id)) {
      throw new Error(
        "Não é possível remover um cliente com histórico de empréstimos.",
      );
    }

    this.repository.remover(id);
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

  private verificarEmailDisponivel(email: string, clienteId?: number): void {
    const cliente = this.repository.buscarPorEmail(email);

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

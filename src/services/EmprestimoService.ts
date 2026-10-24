import { Emprestimo } from "../models/Emprestimo";
import { EmprestimoRepository } from "../repositories/EmprestimoRepository";
import { LivroRepository } from "../repositories/LivroRepository";
import { ClienteRepository } from "../repositories/ClienteRepository";

export class EmprestimoService {
  constructor(
    private readonly repository: EmprestimoRepository,
    private readonly livroRepository: LivroRepository,
    private readonly clienteRepository: ClienteRepository
  ) {}

  public realizar(livroId: number, clienteId: number): Emprestimo {
    this.validarId(livroId);
    this.validarId(clienteId);

    if (!this.livroRepository.buscarPorId(livroId)) {
      throw new Error("Livro não encontrado.");
    }

    if (!this.clienteRepository.buscarPorId(clienteId)) {
      throw new Error("Cliente não encontrado.");
    }

    if (this.repository.buscarAtivoPorLivroId(livroId)) {
      throw new Error("O livro já está emprestado.");
    }

    const maiorId = this.repository.listar().reduce(
      (maior, emprestimo) => Math.max(maior, emprestimo.id),
      0
    );

    const emprestimo = new Emprestimo(
      maiorId + 1,
      livroId,
      clienteId
    );

    this.repository.inserir(emprestimo);

    return emprestimo;
  }

  public devolver(id: number): Emprestimo {
    const emprestimo = this.buscarPorId(id);

    if (emprestimo.dataDevolucao !== null) {
      throw new Error("Este empréstimo já foi devolvido.");
    }

    this.repository.registrarDevolucao(id, new Date());

    return emprestimo;
  }

  public listar(): Emprestimo[] {
    return this.repository.listar();
  }

  public listarAtivos(): Emprestimo[] {
    return this.repository.listarAtivos();
  }

  public buscarPorId(id: number): Emprestimo {
    this.validarId(id);

    const emprestimo = this.repository.buscarPorId(id);

    if (!emprestimo) {
      throw new Error("Empréstimo não encontrado.");
    }

    return emprestimo;
  }

  private validarId(id: number): void {
    if (!Number.isSafeInteger(id) || id <= 0) {
      throw new Error("O ID deve ser um número inteiro positivo.");
    }
  }
}
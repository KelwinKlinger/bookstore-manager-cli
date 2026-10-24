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

  public async realizar(livroId: number, clienteId: number): Promise<Emprestimo> {
    this.validarId(livroId);
    this.validarId(clienteId);

    if (!await this.livroRepository.buscarPorId(livroId)) {
      throw new Error("Livro não encontrado.");
    }

    if (!await this.clienteRepository.buscarPorId(clienteId)) {
      throw new Error("Cliente não encontrado.");
    }

    if (await this.repository.buscarAtivoPorLivroId(livroId)) {
      throw new Error("O livro já está emprestado.");
    }

    const maiorId = (await this.repository.listar()).reduce(
      (maior, emprestimo) => Math.max(maior, emprestimo.id),
      0
    );

    const emprestimo = new Emprestimo(
      maiorId + 1,
      livroId,
      clienteId
    );

    await this.repository.inserir(emprestimo);

    return emprestimo;
  }

  public async devolver(id: number): Promise<Emprestimo> {
    const emprestimo = await this.buscarPorId(id);

    if (emprestimo.dataDevolucao !== null) {
      throw new Error("Este empréstimo já foi devolvido.");
    }

    await this.repository.registrarDevolucao(id, new Date());

    return emprestimo;
  }

  public async listar(): Promise<Emprestimo[]> {
    return await this.repository.listar();
  }

  public async listarAtivos(): Promise<Emprestimo[]> {
    return await this.repository.listarAtivos();
  }

  public async buscarPorId(id: number): Promise<Emprestimo> {
    this.validarId(id);

    const emprestimo = await this.repository.buscarPorId(id);

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

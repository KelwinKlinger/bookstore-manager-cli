import { Livro } from "../models/Livro";
import { AutorRepository } from "../repositories/AutorRepository";
import { LivroRepository } from "../repositories/LivroRepository";
import { EmprestimoRepository } from "../repositories/EmprestimoRepository";

export class LivroService {
  constructor(
    private readonly repository: LivroRepository,
    private readonly autorRepository: AutorRepository,
    private readonly emprestimoRepository: EmprestimoRepository,
  ) {}

  public async cadastrar(titulo: string, autorId: number): Promise<Livro> {
    const tituloValidado = this.validarTitulo(titulo);
    await this.validarAutor(autorId);

    const maiorId = (await this.repository.listar())
      .reduce((maior, livro) => Math.max(maior, livro.id), 0);

    const livro = new Livro(maiorId + 1, tituloValidado, autorId);
    await this.repository.inserir(livro);

    return livro;
  }

  public async listar(): Promise<Livro[]> {
    return await this.repository.listar();
  }

  public async buscarPorId(id: number): Promise<Livro> {
    this.validarId(id);

    const livro = await this.repository.buscarPorId(id);

    if (!livro) {
      throw new Error("Livro não encontrado.");
    }

    return livro;
  }

  public async atualizar(id: number, titulo: string, autorId: number): Promise<Livro> {
    await this.buscarPorId(id);
    const tituloValidado = this.validarTitulo(titulo);
    await this.validarAutor(autorId);

    await this.repository.atualizar(id, tituloValidado, autorId);

    return await this.buscarPorId(id);
  }

  public async remover(id: number): Promise<void> {
    await this.buscarPorId(id);

    if (await this.emprestimoRepository.existePorLivroId(id)) {
      throw new Error(
        "Não é possível remover um livro com histórico de empréstimos.",
      );
    }

    await this.repository.remover(id);
  }

  private validarTitulo(titulo: string): string {
    const tituloTratado = titulo.trim();

    if (tituloTratado.length === 0) {
      throw new Error("O título do livro é obrigatório.");
    }

    return tituloTratado;
  }

  private async validarAutor(autorId: number): Promise<void> {
    this.validarId(autorId);

    if (!await this.autorRepository.buscarPorId(autorId)) {
      throw new Error("Autor não encontrado. Cadastre o autor primeiro.");
    }
  }

  private validarId(id: number): void {
    if (!Number.isSafeInteger(id) || id <= 0) {
      throw new Error("O ID deve ser um número inteiro positivo.");
    }
  }
}

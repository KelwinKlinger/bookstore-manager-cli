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

  public cadastrar(titulo: string, autorId: number): Livro {
    const tituloValidado = this.validarTitulo(titulo);
    this.validarAutor(autorId);

    const maiorId = this.repository
      .listar()
      .reduce((maior, livro) => Math.max(maior, livro.id), 0);

    const livro = new Livro(maiorId + 1, tituloValidado, autorId);
    this.repository.inserir(livro);

    return livro;
  }

  public listar(): Livro[] {
    return this.repository.listar();
  }

  public buscarPorId(id: number): Livro {
    this.validarId(id);

    const livro = this.repository.buscarPorId(id);

    if (!livro) {
      throw new Error("Livro não encontrado.");
    }

    return livro;
  }

  public atualizar(id: number, titulo: string, autorId: number): Livro {
    this.buscarPorId(id);
    const tituloValidado = this.validarTitulo(titulo);
    this.validarAutor(autorId);

    this.repository.atualizar(id, tituloValidado, autorId);

    return this.buscarPorId(id);
  }

  public remover(id: number): void {
    this.buscarPorId(id);

    if (this.emprestimoRepository.existePorLivroId(id)) {
      throw new Error(
        "Não é possível remover um livro com histórico de empréstimos.",
      );
    }

    this.repository.remover(id);
  }

  private validarTitulo(titulo: string): string {
    const tituloTratado = titulo.trim();

    if (tituloTratado.length === 0) {
      throw new Error("O título do livro é obrigatório.");
    }

    return tituloTratado;
  }

  private validarAutor(autorId: number): void {
    this.validarId(autorId);

    if (!this.autorRepository.buscarPorId(autorId)) {
      throw new Error("Autor não encontrado. Cadastre o autor primeiro.");
    }
  }

  private validarId(id: number): void {
    if (!Number.isSafeInteger(id) || id <= 0) {
      throw new Error("O ID deve ser um número inteiro positivo.");
    }
  }
}

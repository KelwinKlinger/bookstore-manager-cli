import { Autor } from "../models/Autor";
import { AutorRepository } from "../repositories/AutorRepository";
import { LivroRepository } from "../repositories/LivroRepository";

export class AutorService {
  constructor(
    private readonly repository: AutorRepository,
    private readonly livroRepository: LivroRepository,
  ) {}

  public cadastrar(nome: string): Autor {
    const nomeValidado = this.validarNome(nome);

    const maiorId = this.repository
      .listar()
      .reduce((maior, autor) => Math.max(maior, autor.id), 0);

    const autor = new Autor(maiorId + 1, nomeValidado);

    this.repository.inserir(autor);

    return autor;
  }

  public listar(): Autor[] {
    return this.repository.listar();
  }

  public buscarPorId(id: number): Autor {
    this.validarId(id);

    const autor = this.repository.buscarPorId(id);

    if (!autor) {
      throw new Error("Autor não encontrado.");
    }

    return autor;
  }

  public atualizar(id: number, nome: string): Autor {
    this.buscarPorId(id);
    const nomeValidado = this.validarNome(nome);

    this.repository.atualizar(id, nomeValidado);

    return this.buscarPorId(id);
  }

  public remover(id: number): void {
    this.buscarPorId(id);

    if (this.livroRepository.existePorAutorId(id)) {
      throw new Error(
        "Não é possível remover um autor com livros cadastrados.",
      );
    }

    this.repository.remover(id);
  }

  private validarNome(nome: string): string {
    const nomeTratado = nome.trim();

    if (nomeTratado.length === 0) {
      throw new Error("O nome do autor é obrigatório.");
    }

    return nomeTratado;
  }

  private validarId(id: number): void {
    if (!Number.isSafeInteger(id) || id <= 0) {
      throw new Error("O ID deve ser um número inteiro positivo.");
    }
  }
}

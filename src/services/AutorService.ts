import { Autor } from "../models/Autor";
import { AutorRepository } from "../repositories/AutorRepository";
import { LivroRepository } from "../repositories/LivroRepository";

export class AutorService {
  constructor(
    private readonly repository: AutorRepository,
    private readonly livroRepository: LivroRepository,
  ) {}

  public async cadastrar(nome: string): Promise<Autor> {
    const nomeValidado = this.validarNome(nome);

    const id = await this.repository.gerarId();

    const autor = new Autor(id, nomeValidado);

    await this.repository.inserir(autor);

    return autor;
  }

  public async listar(): Promise<Autor[]> {
    return await this.repository.listar();
  }

  public async buscarPorId(id: number): Promise<Autor> {
    this.validarId(id);

    const autor = await this.repository.buscarPorId(id);

    if (!autor) {
      throw new Error("Autor não encontrado.");
    }

    return autor;
  }

  public async atualizar(id: number, nome: string): Promise<Autor> {
    await this.buscarPorId(id);
    const nomeValidado = this.validarNome(nome);

    await this.repository.atualizar(id, nomeValidado);

    return await this.buscarPorId(id);
  }

  public async remover(id: number): Promise<void> {
    await this.buscarPorId(id);

    if (await this.livroRepository.existePorAutorId(id)) {
      throw new Error(
        "Não é possível remover um autor com livros cadastrados.",
      );
    }

    await this.repository.remover(id);
  }

  private validarNome(nome: string): string {
    const nomeTratado = nome.trim();

    if (nomeTratado.length === 0) {
      throw new Error("O nome do autor é obrigatório.");
    }

    if ([...nomeTratado].length > 150) {
      throw new Error("O nome deve ter no máximo 150 caracteres.");
    }

    return nomeTratado;
  }

  private validarId(id: number): void {
    if (!Number.isSafeInteger(id) || id <= 0) {
      throw new Error("O ID deve ser um número inteiro positivo.");
    }
  }
}

import { Livro } from "../models/Livro";

export class LivroRepository {
  private livros: Livro[] = [];

  public async inserir(livro: Livro): Promise<void> {
    this.livros.push(livro);
  }

  public async listar(): Promise<Livro[]> {
    return [...this.livros];
  }

  public async buscarPorId(id: number): Promise<Livro | undefined> {
    return this.livros.find((livro) => livro.id === id);
  }

  public async existePorAutorId(autorId: number): Promise<boolean> {
    return this.livros.some((livro) => livro.autorId === autorId);
  }

  public async atualizar(
    id: number,
    titulo: string,
    autorId: number
  ): Promise<boolean> {
    const livro = await this.buscarPorId(id);

    if (!livro) {
      return false;
    }

    livro.titulo = titulo;
    livro.autorId = autorId;

    return true;
  }

  public async remover(id: number): Promise<boolean> {
    const indice = this.livros.findIndex((livro) => livro.id === id);

    if (indice === -1) {
      return false;
    }

    this.livros.splice(indice, 1);

    return true;
  }
}

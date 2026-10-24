import { Livro } from "../models/Livro";

export class LivroRepository {
  private livros: Livro[] = [];

  public inserir(livro: Livro): void {
    this.livros.push(livro);
  }

  public listar(): Livro[] {
    return [...this.livros];
  }

  public buscarPorId(id: number): Livro | undefined {
    return this.livros.find((livro) => livro.id === id);
  }

  public existePorAutorId(autorId: number): boolean {
    return this.livros.some((livro) => livro.autorId === autorId);
  }

  public atualizar(
    id: number,
    titulo: string,
    autorId: number
  ): boolean {
    const livro = this.buscarPorId(id);

    if (!livro) {
      return false;
    }

    livro.titulo = titulo;
    livro.autorId = autorId;

    return true;
  }

  public remover(id: number): boolean {
    const indice = this.livros.findIndex((livro) => livro.id === id);

    if (indice === -1) {
      return false;
    }

    this.livros.splice(indice, 1);

    return true;
  }
}
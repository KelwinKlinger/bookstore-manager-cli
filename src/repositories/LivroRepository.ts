import { Livro } from "../models/Livro";

export class LivroRepository {
  private livros: Livro[] = [];
  private proximoId = 1;

  public async gerarId(): Promise<number> {
    if (!Number.isSafeInteger(this.proximoId)) {
      throw new Error("Limite de IDs atingido.");
    }
    return this.proximoId++;
  }

  public async inserir(livro: Livro): Promise<void> {
    this.livros.push(livro);
    this.proximoId = Math.max(this.proximoId, livro.id + 1);
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
    autorId: number,
    quantidadeTotal: number
  ): Promise<boolean> {
    const livro = await this.buscarPorId(id);

    if (!livro) {
      return false;
    }

    livro.titulo = titulo;
    livro.autorId = autorId;
    livro.quantidadeTotal = quantidadeTotal;

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

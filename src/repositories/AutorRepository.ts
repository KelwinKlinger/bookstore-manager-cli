import { Autor } from "../models/Autor";

export class AutorRepository {
  private autores: Autor[] = [];

  public async inserir(autor: Autor): Promise<void> {
    this.autores.push(autor);
  }

  public async listar(): Promise<Autor[]> {
    return [...this.autores];
  }

  public async buscarPorId(id: number): Promise<Autor | undefined> {
    return this.autores.find((autor) => autor.id === id);
  }

  public async atualizar(id: number, nome: string): Promise<boolean> {
    const autor = await this.buscarPorId(id);

    if (!autor) {
      return false;
    }

    autor.nome = nome;
    return true;
  }

  public async remover(id: number): Promise<boolean> {
    const indice = this.autores.findIndex((autor) => autor.id === id);

    if (indice === -1) {
      return false;
    }

    this.autores.splice(indice, 1);
    return true;
  }
}

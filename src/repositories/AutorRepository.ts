import { Autor } from "../models/Autor";

export class AutorRepository {
  private autores: Autor[] = [];

  public inserir(autor: Autor): void {
    this.autores.push(autor);
  }

  public listar(): Autor[] {
    return [...this.autores];
  }

  public buscarPorId(id: number): Autor | undefined {
    return this.autores.find((autor) => autor.id === id);
  }

  public atualizar(id: number, nome: string): boolean {
    const autor = this.buscarPorId(id);

    if (!autor) {
      return false;
    }

    autor.nome = nome;
    return true;
  }

  public remover(id: number): boolean {
    const indice = this.autores.findIndex((autor) => autor.id === id);

    if (indice === -1) {
      return false;
    }

    this.autores.splice(indice, 1);
    return true;
  }
}
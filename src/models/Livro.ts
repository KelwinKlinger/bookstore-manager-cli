import type { ILivro } from "./ILivro";

export class Livro implements ILivro {
  public readonly id: number;
  public titulo: string;
  public autorId: number;

  constructor(id: number, titulo: string, autorId: number) {
    this.id = id;
    this.titulo = titulo;
    this.autorId = autorId;
  }
}
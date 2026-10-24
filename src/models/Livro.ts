import type { ILivro } from "./ILivro";

export class Livro implements ILivro {
  public readonly id: number;
  public titulo: string;
  public autorId: number;
  public quantidadeTotal: number;

  constructor(id: number, titulo: string, autorId: number, quantidadeTotal: number = 1) {
    this.id = id;
    this.titulo = titulo;
    this.autorId = autorId;
    this.quantidadeTotal = quantidadeTotal;
  }
}
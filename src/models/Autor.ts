import type { IAutor } from "./IAutor";

export class Autor implements IAutor {
  public readonly id: number;
  public nome: string;

  constructor(id: number, nome: string) {
    this.id = id;
    this.nome = nome;
  }
}
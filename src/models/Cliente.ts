import type { ICliente } from "./ICliente";

export class Cliente implements ICliente {
  public readonly id: number;
  public nome: string;
  public email: string;

  constructor(id: number, nome: string, email: string) {
    this.id = id;
    this.nome = nome;
    this.email = email;
  }
}
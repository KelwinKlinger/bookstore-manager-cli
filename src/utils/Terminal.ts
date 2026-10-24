import { createInterface } from "node:readline/promises";
import { stdin, stdout } from "node:process";

export class Terminal {
  private readonly interface = createInterface({
    input: stdin,
    output: stdout
  });

  public async perguntar(mensagem: string): Promise<string> {
    const resposta = await this.interface.question(mensagem);
    return resposta.trim();
  }

  public fechar(): void {
    this.interface.close();
  }
}
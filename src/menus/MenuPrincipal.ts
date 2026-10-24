import { AutorMenu } from "./AutorMenu";
import { LivroMenu } from "./LivroMenu";
import { ClienteMenu } from "./ClienteMenu";
import { Terminal } from "../utils/Terminal";
import { EmprestimoMenu } from "./EmprestimoMenu";

export class MenuPrincipal {
  constructor(
    private readonly autorMenu: AutorMenu,
    private readonly livroMenu: LivroMenu,
    private readonly clienteMenu: ClienteMenu,
    private readonly emprestimoMenu: EmprestimoMenu,
    private readonly terminal: Terminal,
  ) {}

  public async executar(): Promise<void> {
    while (true) {
      console.log("\n--- BookStore Manager CLI ---");
      console.log("1 - Autores");
      console.log("2 - Livros");
      console.log("3 - Clientes");
      console.log("4 - Empréstimos");
      console.log("0 - Encerrar");

      const opcao = await this.terminal.perguntar("Escolha: ");

      switch (opcao) {
        case "1":
          await this.autorMenu.executar();
          break;
        case "2":
          await this.livroMenu.executar();
          break;
        case "3":
          await this.clienteMenu.executar();
          break;
        case "4":
          await this.emprestimoMenu.executar();
          break;
        case "0":
          console.log("Aplicação encerrada.");
          return;
        default:
          console.log("Opção inválida.");
      }
    }
  }
}

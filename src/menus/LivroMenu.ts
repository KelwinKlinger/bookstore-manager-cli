import { LivroController } from "../controllers/LivroController";
import { Terminal } from "../utils/Terminal";

export class LivroMenu {
  constructor(
    private readonly controller: LivroController,
    private readonly terminal: Terminal
  ) {}

  public async executar(): Promise<void> {
    while (true) {
      console.log("\n--- Livros ---");
      console.log("1 - Cadastrar");
      console.log("2 - Listar");
      console.log("3 - Consultar por ID");
      console.log("4 - Atualizar");
      console.log("5 - Remover");
      console.log("0 - Voltar");

      const opcao = await this.terminal.perguntar("Escolha: ");

      try {
        switch (opcao) {
          case "1":
            await this.controller.cadastrar();
            break;
          case "2":
            await this.controller.listar();
            break;
          case "3":
            await this.controller.consultar();
            break;
          case "4":
            await this.controller.atualizar();
            break;
          case "5":
            await this.controller.remover();
            break;
          case "0":
            return;
          default:
            console.log("Opção inválida.");
        }
      } catch (erro) {
        if (erro instanceof Error) {
          console.log(`Erro: ${erro.message}`);
        } else {
          throw erro;
        }
      }
    }
  }
}
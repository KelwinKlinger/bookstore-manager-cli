import { ClienteController } from "../controllers/ClienteController";
import { Terminal } from "../utils/Terminal";

export class ClienteMenu {
  constructor(
    private readonly controller: ClienteController,
    private readonly terminal: Terminal
  ) {}

  public async executar(): Promise<void> {
    while (true) {
      console.log("\n--- Clientes ---");
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
            this.controller.listar();
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
import { EmprestimoController } from "../controllers/EmprestimoController";
import { Terminal } from "../utils/Terminal";

export class EmprestimoMenu {
  constructor(
    private readonly controller: EmprestimoController,
    private readonly terminal: Terminal
  ) {}

  public async executar(): Promise<void> {
    while (true) {
      console.log("\n--- Empréstimos ---");
      console.log("1 - Realizar empréstimo");
      console.log("2 - Registrar devolução");
      console.log("3 - Listar todos");
      console.log("4 - Listar ativos");
      console.log("5 - Consultar por ID");
      console.log("0 - Voltar");

      const opcao = await this.terminal.perguntar("Escolha: ");

      try {
        switch (opcao) {
          case "1":
            await this.controller.realizar();
            break;
          case "2":
            await this.controller.devolver();
            break;
          case "3":
            this.controller.listar();
            break;
          case "4":
            this.controller.listarAtivos();
            break;
          case "5":
            await this.controller.consultar();
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
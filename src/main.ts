import { AutorController } from "./controllers/AutorController";
import { AutorMenu } from "./menus/AutorMenu";
import { AutorRepository } from "./repositories/AutorRepository";
import { AutorService } from "./services/AutorService";
import { Terminal } from "./utils/Terminal";

async function main(): Promise<void> {
  const terminal = new Terminal();

  try {
    const repository = new AutorRepository();
    const service = new AutorService(repository);
    const controller = new AutorController(service, terminal);
    const menu = new AutorMenu(controller, terminal);

    console.log("BookStore Manager CLI");

    await menu.executar();
  } finally {
    terminal.fechar();
  }
}

main().catch((erro: unknown) => {
  console.error(
    "Falha na aplicação:",
    erro instanceof Error ? erro.message : erro
  );

  process.exitCode = 1;
});
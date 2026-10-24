import { AutorController } from "./controllers/AutorController";
import { LivroController } from "./controllers/LivroController";
import { AutorMenu } from "./menus/AutorMenu";
import { LivroMenu } from "./menus/LivroMenu";
import { MenuPrincipal } from "./menus/MenuPrincipal";
import { AutorRepository } from "./repositories/AutorRepository";
import { LivroRepository } from "./repositories/LivroRepository";
import { AutorService } from "./services/AutorService";
import { LivroService } from "./services/LivroService";
import { Terminal } from "./utils/Terminal";

async function main(): Promise<void> {
  const terminal = new Terminal();

  try {
    const autorRepository = new AutorRepository();
    const livroRepository = new LivroRepository();

    const autorService = new AutorService(
      autorRepository,
      livroRepository
    );

    const livroService = new LivroService(
      livroRepository,
      autorRepository
    );

    const autorController = new AutorController(autorService, terminal);
    const livroController = new LivroController(livroService, terminal);

    const autorMenu = new AutorMenu(autorController, terminal);
    const livroMenu = new LivroMenu(livroController, terminal);

    const menuPrincipal = new MenuPrincipal(
      autorMenu,
      livroMenu,
      terminal
    );

    await menuPrincipal.executar();
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
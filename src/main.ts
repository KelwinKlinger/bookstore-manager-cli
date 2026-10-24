import { AutorController } from "./controllers/AutorController";
import { LivroController } from "./controllers/LivroController";
import { ClienteController } from "./controllers/ClienteController";
import { AutorMenu } from "./menus/AutorMenu";
import { LivroMenu } from "./menus/LivroMenu";
import { ClienteMenu } from "./menus/ClienteMenu";
import { MenuPrincipal } from "./menus/MenuPrincipal";
import { AutorRepository } from "./repositories/AutorRepository";
import { LivroRepository } from "./repositories/LivroRepository";
import { ClienteRepository } from "./repositories/ClienteRepository";
import { AutorService } from "./services/AutorService";
import { LivroService } from "./services/LivroService";
import { ClienteService } from "./services/ClienteService";
import { Terminal } from "./utils/Terminal";
import { EmprestimoRepository } from "./repositories/EmprestimoRepository";
import { EmprestimoService } from "./services/EmprestimoService";
import { EmprestimoController } from "./controllers/EmprestimoController";
import { EmprestimoMenu } from "./menus/EmprestimoMenu";
import { carregarDadosIniciais } from "./data/seed";

async function main(): Promise<void> {
  const terminal = new Terminal();

  try {
    const autorRepository = new AutorRepository();
    const livroRepository = new LivroRepository();
    const clienteRepository = new ClienteRepository();
    const emprestimoRepository = new EmprestimoRepository();

    await carregarDadosIniciais(
      autorRepository,
      livroRepository,
      clienteRepository,
      emprestimoRepository,
    );

    const autorService = new AutorService(autorRepository, livroRepository);

    const livroService = new LivroService(
      livroRepository,
      autorRepository,
      emprestimoRepository,
    );

    const clienteService = new ClienteService(
      clienteRepository,
      emprestimoRepository,
    );

    const emprestimoService = new EmprestimoService(
      emprestimoRepository,
      livroRepository,
      clienteRepository,
    );

    const autorController = new AutorController(autorService, terminal);
    const livroController = new LivroController(livroService, terminal);
    const clienteController = new ClienteController(clienteService, terminal);
    const emprestimoController = new EmprestimoController(
      emprestimoService,
      terminal,
    );

    const autorMenu = new AutorMenu(autorController, terminal);
    const livroMenu = new LivroMenu(livroController, terminal);
    const clienteMenu = new ClienteMenu(clienteController, terminal);
    const emprestimoMenu = new EmprestimoMenu(emprestimoController, terminal);

    const menuPrincipal = new MenuPrincipal(
      autorMenu,
      livroMenu,
      clienteMenu,
      emprestimoMenu,
      terminal,
    );

    await menuPrincipal.executar();
  } finally {
    terminal.fechar();
  }
}

main().catch((erro: unknown) => {
  console.error(
    "Falha na aplicação:",
    erro instanceof Error ? erro.message : erro,
  );

  process.exitCode = 1;
});

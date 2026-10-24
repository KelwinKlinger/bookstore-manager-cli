import { AutorRepository } from "./repositories/AutorRepository";
import { AutorService } from "./services/AutorService";

const repository = new AutorRepository();
const service = new AutorService(repository);

console.log("BookStore Manager CLI");

const autor1 = service.cadastrar("Machado de Assis");
const autor2 = service.cadastrar("Clarice Lispector");

console.log("\nAutores cadastrados:");
console.table(service.listar());

console.log("\nConsulta por ID:");
console.log(service.buscarPorId(autor1.id));

service.atualizar(autor1.id, "Joaquim Maria Machado de Assis");

console.log("\nAutor atualizado:");
console.log(service.buscarPorId(autor1.id));

service.remover(autor2.id);

console.log("\nApós remover Clarice:");
console.table(service.listar());

try {
  service.cadastrar("   ");
} catch (erro) {
  if (erro instanceof Error) {
    console.log("\nErro tratado:", erro.message);
  } else {
    throw erro;
  }
}
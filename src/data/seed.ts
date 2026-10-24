import { Autor } from "../models/Autor";
import { Livro } from "../models/Livro";
import { Cliente } from "../models/Cliente";
import { Emprestimo } from "../models/Emprestimo";
import { AutorRepository } from "../repositories/AutorRepository";
import { LivroRepository } from "../repositories/LivroRepository";
import { ClienteRepository } from "../repositories/ClienteRepository";
import { EmprestimoRepository } from "../repositories/EmprestimoRepository";

export async function carregarDadosIniciais(
  autorRepository: AutorRepository,
  livroRepository: LivroRepository,
  clienteRepository: ClienteRepository,
  emprestimoRepository: EmprestimoRepository
): Promise<void> {
  await autorRepository.inserir(new Autor(1, "Machado de Assis"));
  await autorRepository.inserir(new Autor(2, "Clarice Lispector"));

  await livroRepository.inserir(new Livro(1, "Dom Casmurro", 1));
  await livroRepository.inserir(
    new Livro(2, "Memórias Póstumas de Brás Cubas", 1)
  );
  await livroRepository.inserir(new Livro(3, "A Hora da Estrela", 2));

  await clienteRepository.inserir(
    new Cliente(1, "Ana Silva", "ana@example.com")
  );
  await clienteRepository.inserir(
    new Cliente(2, "Bruno Souza", "bruno@example.com")
  );

  await emprestimoRepository.inserir(
    new Emprestimo(
      1,
      1,
      1,
      new Date("2026-10-20T12:00:00Z")
    )
  );

  await emprestimoRepository.inserir(
    new Emprestimo(
      2,
      3,
      2,
      new Date("2026-10-18T12:00:00Z"),
      new Date("2026-10-21T12:00:00Z")
    )
  );
}
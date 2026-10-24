import { Livro } from "../models/Livro";
import { AutorRepository } from "../repositories/AutorRepository";
import { LivroRepository } from "../repositories/LivroRepository";
import { EmprestimoRepository } from "../repositories/EmprestimoRepository";

export class LivroService {
  constructor(
    private readonly repository: LivroRepository,
    private readonly autorRepository: AutorRepository,
    private readonly emprestimoRepository: EmprestimoRepository,
  ) {}

  public async cadastrar(titulo: string, autorId: number, quantidadeTotal: number): Promise<Livro> {
    this.validarQuantidade(quantidadeTotal);
    const tituloValidado = this.validarTitulo(titulo);
    await this.validarAutor(autorId);

    const id = await this.repository.gerarId();

    const livro = new Livro(id, tituloValidado, autorId, quantidadeTotal);
    await this.repository.inserir(livro);

    return livro;
  }

  public async listar(): Promise<Livro[]> {
    return await this.repository.listar();
  }

  public async buscarPorId(id: number): Promise<Livro> {
    this.validarId(id);

    const livro = await this.repository.buscarPorId(id);

    if (!livro) {
      throw new Error("Livro não encontrado.");
    }

    return livro;
  }

  public async atualizar(id: number, titulo: string, autorId: number, quantidadeTotal: number): Promise<Livro> {
    await this.buscarPorId(id);
    this.validarQuantidade(quantidadeTotal);
    const tituloValidado = this.validarTitulo(titulo);
    await this.validarAutor(autorId);

    const emprestados = await this.emprestimoRepository.contarAtivosPorLivroId(id);
    if (quantidadeTotal < emprestados) {
      throw new Error("O total não pode ser menor que a quantidade de exemplares emprestados.");
    }

    await this.repository.atualizar(id, tituloValidado, autorId, quantidadeTotal);

    return await this.buscarPorId(id);
  }

  public async remover(id: number): Promise<void> {
    await this.buscarPorId(id);

    if (await this.emprestimoRepository.existePorLivroId(id)) {
      throw new Error(
        "Não é possível remover um livro com histórico de empréstimos.",
      );
    }

    await this.repository.remover(id);
  }

  public async consultarDisponibilidade(id: number): Promise<Livro & {
    quantidadeDisponivel: number;
  }> {
    const livro = await this.buscarPorId(id);
    const emprestados = await this.emprestimoRepository.contarAtivosPorLivroId(id);
    return { ...livro, quantidadeDisponivel: livro.quantidadeTotal - emprestados };
  }

  private validarQuantidade(quantidade: number): void {
    if (!Number.isSafeInteger(quantidade) || quantidade <= 0 || quantidade > 2147483647) {
      throw new Error("A quantidade total deve ser um inteiro entre 1 e 2147483647.");
    }
  }

  private validarTitulo(titulo: string): string {
    const tituloTratado = titulo.trim();

    if (tituloTratado.length === 0) {
      throw new Error("O título do livro é obrigatório.");
    }

    if ([...tituloTratado].length > 200) {
      throw new Error("O título deve ter no máximo 200 caracteres.");
    }

    return tituloTratado;
  }

  private async validarAutor(autorId: number): Promise<void> {
    this.validarId(autorId);

    if (!await this.autorRepository.buscarPorId(autorId)) {
      throw new Error("Autor não encontrado. Cadastre o autor primeiro.");
    }
  }

  private validarId(id: number): void {
    if (!Number.isSafeInteger(id) || id <= 0) {
      throw new Error("O ID deve ser um número inteiro positivo.");
    }
  }
}

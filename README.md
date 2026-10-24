# BookStore Manager CLI

Projeto individual desenvolvido no curso de Desenvolvimento Back-End com Node.js do SCtec.

Aplicação de terminal para gerenciar autores, livros, clientes, empréstimos e devoluções, utilizando TypeScript e arquitetura em camadas.

## Objetivo

Organizar os cadastros da livraria e controlar o empréstimo e a devolução de múltiplos exemplares por título, aplicando validações e preservando o histórico das operações.

O projeto também inclui a modelagem e implementação independente de um banco relacional no PostgreSQL.

## Tecnologias

- Node.js
- TypeScript
- tsx
- Git e GitHub
- PostgreSQL
- pgAdmin

## Instalação e execução

### Pré-requisitos

- Node.js e npm instalados para executar a aplicação.
- Git instalado para clonar o repositório.
- PostgreSQL e pgAdmin instalados para executar a etapa SQL.

### Instalação

Clone o repositório e acesse a pasta:

```bash
git clone https://github.com/KelwinKlinger/bookstore-manager-cli.git
cd bookstore-manager-cli
```

Instale as dependências:

```bash
npm install
```

### Executar em desenvolvimento

```bash
npm run dev
```

### Compilar e executar

```bash
npm run build
npm start
```

O comando de compilação gera os arquivos JavaScript na pasta `dist`.

No Windows, caso o PowerShell bloqueie os comandos do npm, utilize `npm.cmd` no lugar de `npm`:

```cmd
npm.cmd run build
npm.cmd start
```

## Funcionalidades

- Autores: cadastrar, listar, consultar por ID, atualizar e remover.
- Livros: cadastrar, listar, consultar por ID, atualizar e remover, informando a quantidade total de exemplares.
- Disponibilidade: apresentar as quantidades total e disponível nas listagens e consultas de livros.
- Clientes: cadastrar, listar, consultar por ID, atualizar e remover.
- Empréstimos: realizar, consultar por ID, listar todos e listar ativos.
- Consultas de empréstimos: apresentar título do livro, nome do cliente e datas.
- Devoluções: registrar a devolução de um empréstimo ativo.
- Tratamento de erros com mensagens no terminal.

## Regras de negócio

- Nomes e títulos não podem ficar vazios.
- IDs devem ser números inteiros positivos e seguros.
- O autor precisa existir para cadastrar ou atualizar um livro.
- E-mails são normalizados, removendo espaços nas extremidades e convertendo para letras minúsculas.
- E-mails devem possuir formato válido e não podem se repetir entre clientes.
- Livro e cliente precisam existir para realizar um empréstimo.
- Cada registro de livro representa um título com uma quantidade total de exemplares.
- A quantidade total deve ser um número inteiro entre 1 e 2147483647.
- Cada empréstimo utiliza um exemplar.
- Um título pode possuir vários empréstimos ativos, respeitando sua quantidade total.
- Não é permitido emprestar um livro sem exemplares disponíveis.
- Não é permitido reduzir a quantidade total abaixo da quantidade de exemplares emprestados.
- A devolução libera um exemplar para um novo empréstimo.
- Um empréstimo já devolvido não pode ser devolvido novamente.
- Autores com livros cadastrados não podem ser removidos.
- Livros e clientes com histórico de empréstimos não podem ser removidos.

### Cálculo da disponibilidade

```text
Quantidade disponível = quantidade total - empréstimos ativos
```

Exemplo: um título com três exemplares e dois empréstimos ativos possui um exemplar disponível.

A quantidade disponível é calculada a partir dos empréstimos, sem armazenar um segundo valor de estoque.

O controle é quantitativo por título. Cada exemplar físico não possui identificação individual por patrimônio ou código de barras.

## Armazenamento e dados iniciais

A aplicação utiliza arrays em memória e não se conecta ao PostgreSQL.

Os dados iniciais são carregados pelo arquivo `src/data/seed.ts` a cada execução:

- 2 autores;
- 3 títulos de livros, totalizando 6 exemplares;
- 2 clientes;
- 2 empréstimos, sendo um ativo e um devolvido.

### Estoque inicial

| ID | Livro | Total de exemplares | Emprestados | Disponíveis |
| --- | --- | ---: | ---: | ---: |
| 1 | Dom Casmurro | 3 | 1 | 2 |
| 2 | Memórias Póstumas de Brás Cubas | 2 | 0 | 2 |
| 3 | A Hora da Estrela | 1 | 0 | 1 |

As alterações realizadas durante o uso são perdidas ao encerrar a aplicação. Na próxima execução, os dados iniciais são carregados novamente.

As operações da CLI não alteram os dados do PostgreSQL, e as operações SQL não alteram os dados em memória da CLI.

## Arquitetura e estrutura de pastas

| Pasta ou arquivo | Responsabilidade |
| --- | --- |
| `src/models` | Interfaces e classes das entidades |
| `src/repositories` | Armazenamento e manipulação dos arrays |
| `src/services` | Validações, regras de negócio e cálculo da disponibilidade |
| `src/controllers` | Interação com o terminal e apresentação dos resultados |
| `src/menus` | Navegação e opções do terminal |
| `src/utils` | Utilitários de interação com o terminal |
| `src/data` | Dados iniciais da aplicação |
| `src/main.ts` | Criação dos componentes, carregamento do seed e inicialização do menu |
| `database` | Script SQL e diagrama do banco |

O fluxo das funcionalidades segue as camadas Menu, Controller, Service e Repository.

Os métodos públicos de Services e Repositories são assíncronos, retornam Promises e são chamados com `await`. A leitura das respostas no terminal também utiliza `async/await`.

Os menus tratam as exceções das operações com `try/catch`, exibindo mensagens sem encerrar a aplicação por erros de validação.

## Exemplos de utilização

### Empréstimo e devolução

1. Execute `npm run dev`.
2. Acesse Livros e consulte o livro de ID 2.
3. Confira o total de 2 exemplares disponíveis nos dados iniciais.
4. Acesse Empréstimos e realize um empréstimo do livro 2 para o cliente 1.
5. Liste os empréstimos ativos e anote o ID do novo empréstimo.
6. Consulte novamente o livro 2: haverá 1 exemplar disponível.
7. Registre a devolução utilizando o ID do empréstimo.
8. Consulte o livro 2: haverá novamente 2 exemplares disponíveis.

### Limite de exemplares

Em uma nova execução:

1. Consulte o livro 1: total de 3 exemplares, sendo 2 disponíveis.
2. Realize dois novos empréstimos desse livro para um cliente cadastrado.
3. Tente realizar mais um empréstimo: o sistema deverá bloquear por falta de exemplares.
4. Devolva um dos empréstimos ativos.
5. Consulte o livro: deverá apresentar 1 exemplar disponível.

### Exemplos de erros tratados

- Cadastrar um cliente com e-mail inválido ou duplicado.
- Cadastrar um livro com autor inexistente.
- Informar uma quantidade total inválida.
- Emprestar um livro sem exemplares disponíveis.
- Reduzir o total abaixo da quantidade de exemplares emprestados.
- Devolver um empréstimo já devolvido.
- Remover um livro ou cliente com histórico de empréstimos.

## Banco de dados SQL

A etapa SQL é independente da aplicação CLI.

O arquivo `database/script.sql` contém:

- Criação das quatro tabelas: autores, livros, clientes e empréstimos.
- Chaves primárias e estrangeiras.
- Restrições de integridade com `NOT NULL`, `UNIQUE` e `CHECK`.
- Quantidade total de exemplares por título.
- Índice parcial não único para os empréstimos ativos.
- Funções e triggers para validar a disponibilidade e a redução do estoque.
- Dados iniciais correspondentes aos da aplicação.
- Exemplos de `INSERT`, `UPDATE`, `DELETE` e `SELECT`.
- Consultas com `INNER JOIN`, `LEFT JOIN`, `GROUP BY`, `HAVING`, `ORDER BY`, `LIMIT` e funções de agregação.

### Validações automáticas

Triggers são rotinas executadas automaticamente pelo PostgreSQL quando determinadas operações ocorrem.

Neste projeto, elas impedem:

- Registrar ou alterar um empréstimo ativo ultrapassando a quantidade total de exemplares do livro.
- Reduzir a quantidade total abaixo da quantidade de exemplares atualmente emprestados.

### Como executar no pgAdmin

1. Crie um banco de dados vazio, por exemplo `bookstore_manager_exemplares`.
2. Selecione esse banco e abra o Query Tool.
3. Abra o arquivo `database/script.sql`.
4. Execute o script completo.
5. Para visualizar cada relatório, selecione e execute sua consulta individualmente.

O script deve ser executado em um banco vazio, pois cria as tabelas, funções e triggers e insere os dados iniciais.

O arquivo é um script de criação, não uma migração do banco da versão anterior. Para testar novamente desde o início, utilize outro banco vazio.

### Relatórios

- Livros disponíveis, com quantidade total, emprestada e disponível.
- Livros emprestados, com cliente e data.
- Quantidade de títulos cadastrados por autor.
- Quantidade de empréstimos por livro.
- Clientes com empréstimos ativos.
- Até cinco livros mais emprestados.

Um título pode aparecer simultaneamente nos relatórios de livros disponíveis e emprestados quando apenas parte dos seus exemplares está emprestada.

## Diagrama de Entidade-Relacionamento

![Diagrama do banco de dados](database/der.png)

Relacionamentos:

- Um autor pode ter zero ou vários livros; cada livro pertence a um autor.
- Um livro pode ter zero ou vários empréstimos no histórico; cada empréstimo utiliza uma unidade do estoque desse título.
- Um cliente pode ter zero ou vários empréstimos; cada empréstimo pertence a um cliente.

## Versionamento

O desenvolvimento foi organizado com as branches `main`, `develop` e branches específicas para funcionalidades, correções e documentação.

As funcionalidades foram desenvolvidas incrementalmente e integradas à `develop`. A `main` reúne as versões de entrega integradas.

## Organização do projeto

[Quadro Kanban — BookStore Manager CLI](https://github.com/users/KelwinKlinger/projects/2)

## Vídeo de apresentação

Link do vídeo: a adicionar.

## Autor

Kelwin Klinger.
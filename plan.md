# JavaScript Visualmente — plano de implementação

## Produto

Laboratório educativo interativo em português para aprender JavaScript fazendo. Cada aula combina contexto e explicação breve, código que a pessoa pode editar, execução isolada, saída legível e um desafio para continuar experimentando. Conteúdos são autorais, relacionados ao curso de Backend de `gabrielaraujo-eng/Curso_senai`, e não reproduzem suas aulas. Não é um material oficial do SENAI.

## Design aprovado

**Movimento:** editorial digital de um laboratório de aprendizagem; une a energia de jogo e o feedback visual de Matemática Blitz, a organização e legibilidade do Provão Paulista e a exploração “mexa e veja” do Laboratório Visual.

**Princípios:** aprender pelo experimento; cada tela responde a uma pergunta; exemplos cotidianos e industriais; progresso visível sem pressão; controles legíveis e inclusivos.

**Paleta:** marinho quase-preto dá foco ao código; papel creme torna a leitura acolhedora; âmbar é a assinatura de JavaScript e sinaliza ação; ciano marca execução e informação; violeta diferencia conceitos e navegação.

**Layout:** barra superior compacta, hero editorial assimétrico, painel de progresso e biblioteca de trilhas ao lado do espaço de experimentação; em telas estreitas tudo passa a uma coluna com navegação acessível.

**Assinaturas:** monograma `JS` em um bloco âmbar inclinado; cartões de laboratório com etiquetas de categoria; linha de saída ciano e cápsulas de progresso.

**Interação e movimento:** cada execução dá feedback imediato; ações podem ser realizadas pelo teclado; transições são discretas, sem movimento essencial; respeitar `prefers-reduced-motion`.

**Tipografia:** pilha de sistema sem dependência externa; títulos compactos e fortes, texto confortável e mono-espaçada para editor e saída.

**Essência:** “JavaScript se aprende mexendo no código.” É curioso, direto e acolhedor.

**Voz:** clara, encorajadora, sem jargão desnecessário. Exemplos: “Mude um valor. Rode. Veja o que muda.” e “Um erro também é uma pista.”

## Arquitetura e restrições

Site estático, sem frameworks, TypeScript, backend ou dependências. `index.html` na raiz é a entrada que o GitHub Pages reconhece; arquivos de interface, dados e ativos ficam em `public/`. O mesmo script de aplicação detecta sua localização para funcionar tanto a partir da raiz quanto de `public/`. `public/data/lessons.json` guarda o catálogo editorial.

Cada exemplo roda em um `iframe` com sandbox de navegador `allow-scripts`, sem `allow-same-origin`, sem DOM da página-mãe e com CSP restritiva. O pai recria o iframe a cada execução e recebe apenas linhas de saída via `postMessage`, validando `event.source`. A execução tem limite de tempo e tamanho de saída. Código e progresso permanecem no dispositivo; a aplicação não transmite o código a um servidor.

O conteúdo-base cobre fundamentos, variáveis e tipos, operadores, condições, laços, funções, arrays, objetos, DOM, tratamento de erros, JSON, promessas/async e conceitos introdutórios de HTTP/API. Contextos próprios incluem logística de entregas, sensores, equipamentos e estoque, inspirados nos temas encontrados nas aulas Backend do repositório do curso. O material é reescrito como aulas e exemplos novos.

## Organização dos arquivos

- `index.html`: entrada da raiz, documento com conteúdo semântico inicial, SEO e aplicação carregada de `public/`.
- `public/style.css`: sistema visual, layout responsivo, estados acessíveis e temas.
- `public/script.js`: navegação, biblioteca, filtros, playground isolado e progresso local.
- `public/data/lessons.json`: conteúdo estruturado das aulas e exemplos.
- `public/assets/favicon.svg`: ícone vetorial do produto.
- `public/assets/javascript-visualmente-og.svg` e `.png`: banner de compartilhamento e seu original editável.
- `robots.txt` e `sitemap.xml`: descoberta e indexação da página pública.
- `.github/workflows/pages.yml`: workflow pronto para GitHub Pages após a ativação pelo proprietário.
- `README.md`, `plan.md`, `TODO.md`: visão, organização, referências e estado do trabalho.

## SEO e publicação

A página usa conteúdo útil no HTML de origem, título, descrição, palavras-chave apropriadas, canonical no endereço de projeto previsto para GitHub Pages, OG/Twitter, JSON-LD de `WebSite`/`LearningResource`, favicon, `robots.txt`, `sitemap.xml` e manifesto de rota. O sitemap só lista a entrada canônica. O repositório é público, mas GitHub Pages não será ativado nem o site publicado nesta tarefa. O workflow e a documentação deixam explícito como o proprietário pode autorizar a publicação no GitHub.

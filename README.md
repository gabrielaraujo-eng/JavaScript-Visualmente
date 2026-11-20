# JavaScript Visualmente

Laboratório interativo em português para aprender JavaScript na prática: leia uma ideia, edite um exemplo, rode o código e observe a saída. O projeto é estático, gratuito e não exige instalação para quem visita o site.

## O que existe

O catálogo começa com trilhas de fundamentos, lógica, dados, web e conexões com backend. Há aulas sobre console, variáveis, tipos, operadores, condicionais, laços, funções, arrays, objetos, JSON, DOM, tratamento de erros, modularização, `async`/`await` e o desenho de uma API HTTP.

Os exemplos são autorais e usam temas de logística, sensores, estoque e serviços para aproximar o estudo do contexto de desenvolvimento de sistemas. A seleção temática foi inspirada pela organização e pelos assuntos encontrados no [Curso_senai](https://github.com/gabrielaraujo-eng/Curso_senai/tree/main/2_termo/BACKEND), sem reproduzir aulas e sem apresentar este laboratório como material oficial do SENAI. A clareza visual também dialoga com [Matemática Blitz](https://github.com/gabrielaraujo-eng/matematica-blitz), [Provão Paulista 2027](https://github.com/gabrielaraujo-eng/provao-paulista-2027) e o [Laboratório Visual de HTML & CSS](https://loboratorio-html.vercel.app/).

## Estrutura

- `index.html`: entrada na raiz, conteúdo semântico e metadados para GitHub Pages.
- `public/style.css`: identidade visual, responsividade, contraste, foco e tema claro/escuro.
- `public/script.js`: catálogo, busca, filtros, progresso local e playground.
- `public/data/lessons.json`: conteúdo editorial das aulas.
- `public/assets/`: favicon e arte social OG.
- `public/manus-routes.json`: manifesto de rotas do projeto.
- `robots.txt`, `sitemap.xml`, `site.webmanifest`: descoberta e integração futura.
- `.github/workflows/pages.yml`: verificação automatizada; não publica o site por conta própria.

## Segurança do playground

Cada execução acontece em um `iframe` com `sandbox="allow-scripts"`, sem `allow-same-origin`. A aplicação recria o frame a cada execução, aceita mensagens somente da janela criada, limita a quantidade de linhas e encerra o experimento em poucos segundos. O conteúdo editado e o progresso ficam no dispositivo; não há backend, conta ou envio do código para um servidor.

O sandbox não é uma promessa de segurança para código arbitrário fora deste contexto. Ele é uma camada de contenção apropriada para os exemplos educativos do navegador, com CSP restritiva e sem permissões de rede, armazenamento ou acesso à página principal.

## Rodar localmente

Com Python instalado:

```bash
python3 -m http.server 3000 --bind 0.0.0.0
```

Abra `http://localhost:3000/`. Não abra o HTML como `file://`, porque o navegador pode bloquear o carregamento do catálogo JSON.

## Publicar no GitHub Pages

A publicação está deliberadamente desativada. Quando quiser autorizar, abra **Settings → Pages**, escolha **Deploy from a branch**, selecione `main` e a pasta `/ (root)`, e salve. O `index.html` na raiz já está pronto para o mecanismo do Pages.

Antes de publicar em um domínio diferente, atualize `canonical`, `og:url`, `og:image`, `twitter:image` e `sitemap.xml` para o endereço real. O workflow atual apenas valida os arquivos; ele não habilita Pages nem cria uma publicação automática.

## Contribuição

Leia [CONTRIBUTING.md](CONTRIBUTING.md) antes de abrir uma issue ou pull request. Mudanças de conteúdo devem manter exemplos pequenos, executáveis e compreensíveis. Não adicione TypeScript, frameworks ou dependências sem uma decisão documentada.

## Licença e autoria

Projeto acadêmico e autoral de Gabriel Araújo. Consulte o repositório para a licença aplicável e os termos de uso dos conteúdos.

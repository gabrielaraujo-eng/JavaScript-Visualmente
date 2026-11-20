# Contribuindo

Abra uma issue antes de mudanças grandes. Explique o resultado esperado, a trilha afetada e como uma pessoa iniciante perceberá a melhoria.

Use branches curtas e descritivas, como `feat/catalogo-interativo`, `fix/execucao-timeout` ou `docs/seo-pages`. Cada pull request deve ter escopo claro, descrição do comportamento e evidência das verificações executadas.

## Critérios para aulas

Uma aula precisa conter explicação breve, exemplo executável, desafio aberto e palavras-chave úteis para busca. Prefira nomes em português, dados pequenos e situações próximas de desenvolvimento web ou backend. Evite copiar exercícios, textos extensos ou soluções do curso de referência.

## Verificações locais

```bash
python3 -m json.tool public/data/lessons.json >/dev/null
python3 -m json.tool public/manus-routes.json >/dev/null
python3 -m http.server 3000 --bind 127.0.0.1
```

Teste teclado, celular, tema claro/escuro e movimento reduzido quando alterar a interface. O código do playground deve continuar isolado em `iframe` sandbox e sem `allow-same-origin`.

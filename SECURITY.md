# Segurança

O JavaScript Visualmente executa exemplos escritos pelo visitante apenas em um `iframe` com `sandbox="allow-scripts"` e sem `allow-same-origin`. A comunicação usa `postMessage` e o documento principal verifica a origem da janela antes de aceitar linhas de saída. A CSP do documento filho bloqueia rede, imagens e recursos externos.

A execução tem limite de tempo e de volume de saída. O código não é enviado ao servidor, salvo em banco ou associado a uma conta. O progresso usa somente `localStorage` do navegador.

Esse mecanismo foi desenhado para exemplos educativos e não deve ser usado como sandbox profissional para código não confiável em uma aplicação com dados sensíveis. Para relatar um problema de segurança, abra uma issue privada no GitHub ou contate o mantenedor antes de publicar detalhes exploráveis.

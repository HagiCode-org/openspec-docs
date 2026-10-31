---
title: "Vitrine da comunidade"
---

Uma lista colaborativa de projetos e recursos criados com OpenSpec e para OpenSpec. Ferramentas, integrações, fluxos de trabalho e materiais de aprendizado são bem-vindos. Os membros da comunidade ampliam esta vitrine abrindo issues; os mantenedores adicionam as entradas.

Os projetos listados são mantidos de forma independente. A inclusão não significa suporte ou endosso oficial do OpenSpec. Consulte a documentação e o rastreador de problemas de cada projeto para obter instruções de configuração e suporte.

## Projetos e recursos

- **[OpenSpec Workbench](https://github.com/VeryComplexAndLongName/OpenSpec-UI)**: Executa e supervisiona agents que trabalham em mudanças do OpenSpec.
- **[openspec-guard](https://github.com/guillaume-flambard/spec-guard)**: CLI e GitHub Action que informa quais cenários do OpenSpec são cobertos por testes do Vitest ou Jest, sem executar os testes.

## Serviços hospedados

Produtos hospedados que adicionam uma capacidade do OpenSpec que a CLI não oferece. Cada entrada informa os termos de conta, pagamento e tratamento de dados.

- **[MySpec](https://myspec.dev)**: Beta em nuvem (exige conta; plano gratuito, sem cartão de crédito) que conduz entrevistas guiadas de especificação e exporta pacotes de quatro arquivos ou mudanças compatíveis com o OpenSpec. Seu servidor MCP (`@myspec/mcp-server`) e os [plugins do Claude Code](https://github.com/myspecs/claude-plugins) permitem que coding agents leiam essas especificações, escrevam mudanças do OpenSpec e as implementem tarefa por tarefa. O serviço envia o conteúdo enviado a provedores de IA de terceiros e não foi projetado para dados sensíveis.
- **[Entalpa](https://entalpa.com/en/openspec)**: Importa o `openspec/specs/` de um repositório público do GitHub (até 300 requisitos) para um projeto navegável, adiciona stakeholders, histórias e questões em aberto marcadas como inferidas, e exporta o resultado como uma árvore `openspec/specs/`; ele nunca grava no repositório. Importar e ler não exigem conta; salvar ou editar exige uma, e os recursos de IA usam créditos pagos. O conteúdo importado é enviado a provedores de IA de terceiros.
- **[OpenSpec Review](https://skillgild.dev/skills/openspec-review) e [OpenSpec Compact](https://skillgild.dev/skills/openspec-compact)**: Skills hospedadas pela SkillGild para Claude Code, Codex, Cursor, Gemini CLI ou qualquer cliente MCP. O Review publica uma mudança como um link no qual quem o tiver pode aprovar, pedir alterações ou comentar por requisito, sem conta; mostra a especificação principal como o `openspec archive` a gravaria; e sinaliza requisitos que outras mudanças abertas também alteram. O Compact encontra requisitos lexicalmente semelhantes e cenários repetidos nas especificações principais e escreve a limpeza como uma mudança do OpenSpec. Exige a CLI da SkillGild e uma conta gratuita (25 execuções por mês por skill). Ambas enviam o conteúdo das especificações aos servidores da SkillGild, que executam código fechado e não fazem chamadas a modelos de IA; o Review também envia a proposta, o design e as tarefas, e mantém a mudança por 30 dias.

## Adicione seu projeto

Abra uma issue com a linha que você gostaria de incluir: o nome do seu projeto, um link direto e uma breve descrição de como ele se relaciona com o OpenSpec. Um mantenedor a adiciona a este arquivo.

- Mantenha as entradas focadas em algo criado com OpenSpec ou que ajude a usá-lo, em vez de fazer propaganda geral de um produto.
- Descreva o que as pessoas podem usar. Evite alegações promocionais, links de indicação e links de rastreamento.
- Informe na entrada se houver recursos pagos ou contas obrigatórias.
- Serviços hospedados ou pagos são listados em Serviços hospedados somente quando adicionam uma capacidade do OpenSpec que a CLI ainda não oferece e têm uma forma gratuita de experimentá-los. Um serviço que apenas reempacota as skills ou os comandos do próprio OpenSpec não é listado.

Correções e atualizações de entradas existentes também são bem-vindas.

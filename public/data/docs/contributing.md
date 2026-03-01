# Guia de Engenheiros Estelares (Como Contribuir)

Seja expandindo constelações (adicionando linguagens não mapeadas), consertando buracos negros (resolvendo bugs do State) ou reticulando texturas 3D, a sua contribuição expande fisicamente este cosmos. 

## Ambiente de Desenvolvimento e Clone

1. **Faça o Fork:** Inicie bifurcando ("Forking") o repositório principal no GitHub para o seu porto seguro de desenvolvimento.
2. **Boot da Sonda Local:**
   ```bash
   git clone https://github.com/SeuUsername/CodeOrigins.git
   cd CodeOrigins
   npm install
   ```
3. **Run Ignition (Vite):** 
   ```bash
   npm run dev
   ```

A aplicação agora reside no `http://localhost:3000`. Alterações nos scripts React engatilham o *Hot-Reload* re-renderizando o canvas dinamicamente sem perdas pesadas de estado em cena.

## Expandindo o Universo (Processo Padrão)

A maior demanda colaborativa em CodeOrigins é **Acurácia Histórica**. Nossos logs temporais podem apresentar equívocos (ex: Errar quem influenciou quem nos anos 80). Se você quer adicionar linguagens ou consertar pesos/texturas, mexa especificamente nos arquivos contidos em `src/data/`.

*   `languages.ts` (ou derivados divididos `languages2.ts`, `languages3.ts` para aliviar o ast e tempo de type-checking).
*   Abastecer a matriz do `src/lang/` com a chave `description` referente aquela alteração no inglês fundamental.

## Utilitários de Terraformação Automática (Scripts)

O repositório root possui dois scripts NodeJS pesados criados para auto-população, caso o contribuidor esteja manuseando milhares de dados em formato bruto. (Embora sejam de uso avançado estrito de manutenções primárias do mantenedor).
*   `update_categories.js`: Escaneia e aplica auto-filtro referencial nos arrays do JSON das dependências (Atuando como um categorizador pesado para salvar tempo manual).
*   `add_speed.js`: Utiliza injeções massivas de dados via processamento sequencial Node (e acesso raw via regex ou parsers) para alterar em batch matrizes inteiras.

> [!WARNING]
> Tenha cuidado usando os *Scripts Node* puros na root. É necessário rodá-los isoladamente (`node script.js`) antes da build para gerar novas constantes geradas.

## Abrindo o Contato Aberto (Pull Requests)

- Crie Branchs significativas: `git checkout -b feature/update-ruby-relations`.
- Comite microscopicamente: Suas descrições ajudam os auditores a entender as mudanças físicas no cosmos.
- Abra um **PR (Pull Request)** contra o braço `main` principal e anexe capturas de tela se tiver alterado a renderização ou HUD.

Nós avaliamos velocidade. Renderizar um novo shader nos anéis de um Planeta não pode afetar em declínio o FPS geral.

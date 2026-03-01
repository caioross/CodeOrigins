# O Motor Sob o Capô (Tecnologias)

Para simular nossa galáxia de forma estável, performática e extremamente imersiva, o CodeOrigins apoia-se num stack de tecnologias front-end extremamente maduro e de ponta (v2025+). Separamos nossas ferramentas em grandes categorias para facilitar o mapeamento.

## Propulsores Gráficos & Simulação (O Simulador)

-   **Three.js (0.183+)**: O coração matemático. A engine bruta Javascript que comunica com a API WebGL e computa posições de nós, câmera perspectiva e materiais dos planetas siderais.
-   **@react-three/fiber (R3F)**: O Maestro. R3F encapsula quase todo o código imperativo verboso e complexo da raw-API Three.js em maravilhosos componentes declarativos do React.
-   **@react-three/drei**: O Caixa de Ferramentas. Coleção auxiliar com componentes poderosos prontos para R3F, fornecendo para nós o `OrbitControls` estabilizado, fontes 3D vetoriais, e cálculos complexos de bounds e texturas.

## Estrutura Operacional Básica (Core UI)

-   **React 19**: A espinha dorsal das nossas interfaces em tempo real. Orquestrando todas as montagens da tela (HUD, Radares, janelas) fora do simulador 3D usando os novos compiladores dinâmicos de velocidade assombrosa.
-   **Vite 6**: Módulo Master de Compilação Extremamente ágil (Hot Module Replacement) para o ambiente de desenvolvimento acelerado e bundling robusto e instantâneo da build.
-   **TypeScript v5.8+**: Contratos Estritos e Redução Crítica de Falhas. Nossos planetas, dados JSON formatados e instâncias do store dependem fervorosamente da rigidez tipificada do TS para evitar que a navegação lance erros em tempo real perante a tela de exploração.

## Materialização e Interface Visual HTML

A Camada Física do display flutuante sobre o WebGL. Trata de Menus Hi-Tech, painéis informativos de linguagens e Minimapas 2D. 
-   **Tailwind CSS v4**: Estilização Utility First moderna e super rápida em compilação sob demada (JIT). Permitindo nós criar designs complexos *dark interfaces* repletos de "glassmorphism", gradientes espaciais com nomes semânticos longos sem vazar escopo de CSS puro.
-   **Framer Motion 12 / motion**: Manipulando dobras do tempo. Framer dita a animação suave da maioria dos blocos, painéis UI, notificações popups que abrem progressivamente sem solavancos. Usamos para animações complexas baseadas em física e keyframes.
-   **Lucide-react**: Para ícones modernos e leves (SVG) presentes nos controles de radar e navegação.

## Memória, Ferramentas e Gravidade Local

-   **Zustand v5**: A loja global (State Manager). Optamos pelo Zustand frente ao Redux ou Context puro devida à sua natureza ultraleve (pequeno footprint) e ao fato brutalmente necessário de que seu setup permite ligações externas ou mutáveis vitais para `react-three-fiber` funcionar sem gargalar todo re-render da árvore no front.
-   **Ferramentas Node auxiliares (`express`, `better-sqlite3`, utilitários python/scripts JS base)**: Embora majoritariamente local (SSG/SPA Front First) CodeOrigins carrega e limpa conjuntos de bases de dados ou injeta *categories automáticas* e "Massa de Dados JSON" valendo-se dos scripts que rodam nativos sob ambientes NodeJS que parseiam grandes listas de influências em linguagens reais durante os processos de construção pre-flight.

A sinergia entre o R3F controlando o estelar e o Tailwind guiando o HUD resulta numa aplicação coesa de alta precisão que nunca paralisa sua máquina.

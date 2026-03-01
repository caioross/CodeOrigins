# O Guia Completo dos Componentes (Sonda Espacial)

Um mergulho na hierarquia de construção dentro da pasta `src/components/`, explicando as engrenagens principais envolvidas na renderização entre o sistema DOM puro e a engine Fiber/ThreeJS. Esta é a visão "Por Trás Das Lentes" de como agrupamos o espaço renderizável.

## 🌌 `SolarSystem.tsx` (Root System/Motor)
O ecossistema Primário. Ele é a `Mesh` montagem central que gerencia os planetas, não em si apenas os elementos, mas as configurações de Luz e a Lógica de Raycasting profunda.
- **Função:** Atua como um Canvas wrapper imenso da Galáxia. Dentro dele são instaciados luzes ambientes, `Stars` (Point-lights microscópicas) e repassado via iterador a lista massiva do Global State de "linguagens válidas ativas do momento".
- **Comportamento Específico:** Observa diretamente as datas do `Zustand` para renderizar se as linhas conectores da Genealogia estarão atômicas ou ocultas à visão geral.

## 🌎 `Planet.tsx` / `InstancedPlanet.tsx` (Corpos Celestes Físicos)
O invólucro unitário do material computado. O `Planet` desenha uma Textura circular (`<sphereGeometry />`), define um Shader Material (`<meshStandardMaterial />` e suas emissões).
- **O Click/Hover:** Cada Planeta carrega consigo detecção de intersecção nativa da API WebGL (`onPointerOver`, `onClick`), permitindo a retroalimentação imersiva em HTML e disparando atualizações na store Global do Zustand ("Usuário Focou Planeta Alpha").
- **Versões *Instanced*:** São utilizadas quando o `SolarSystem` decide despachar listas pesadas sob um mesmo vetor computacional invés do Render Unitário de árvore R3F, prevenindo afogamento de CallStacks.

## 🔍 O Radar Naval: `Minimap.tsx`
Construído inteiramente em React Nativo (HTML e Tailwind). Repousando no esqueleto de UI em absolute position. 
- Ele varre as coordenadas 3D globais (`x,y,z`), projeta as distâncias tridimensionais achatando-as num canavial HUD transparente de 2 dimensões. Ele escuta constantemente o `State.SelectedNodes` e exibe pontos luminescentes vermelhos quando "Mirados" por pesquisas do Radar Sidebar.

## ⏳ `Timeline.tsx` / `TimelineSlider.tsx`
Painel Slider UI encapsulado, renderiza do Radix/UI moderno ou sliders HTML puros reagíveis. 
- Tem o simples propósito interativo de registrar posições do polegar ou mouse arrastando nos marcadores de anos (1950 - 2025). Mas seus efeitos engatilham chamadas pesadas Zustand filtrando a listagem de Arrays dos arrays de "Dados" para a visualização sideral. Retrocessão de Timeline afeta imediações pesadas de render.

## 📖 Janelas Descritivas: `DocsPopup.tsx` e `UI.tsx`
Esses componentes empurram layouts em Overlay em volta do Canavial WebGL 3D.
- Responsáveis por puxar o locale ativado (`pt`, `en`, `es`) do serviço Loader (`localeLoader.ts`), montam a interface de leitor de Markdown flutuante, e tratam todas as informações humanas legíveis traduzidas daquele planeta selecionado pela matriz.
- É aqui onde os utilitários TailwindCSS e os keyframing fluídos do *Framer Motion* realmente brilham para animar telas holográficas suaves subindo ao clique.

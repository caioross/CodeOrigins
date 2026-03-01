# Engenharia e Arquitetura do Espaço Sideral

Construir o CodeOrigins exige manter milhares de objetos processados no canvas 3D e, simultaneamente, permitir que sistemas HUD e ferramentas complexas HTML respondam instantaneamente. A arquitetura principal foca em **desacoplamento severo da UI e motor WebGL**.

## Visão Geral do Sistema

CodeOrigins é uma Single Page Application desenvolvida em **React** e **Vite**, operando em duas camadas fundamentais que nunca devem interromper a thread uma da outra:

1. **Camada Atmosférica (UI / DOM):** Contém os painéis de Tailwind, botões, barras deslizantes temporais e o Minimapa interativo.
2. **Camada Sideral (WebGL/Canvas):** A simulação pura via `Three.js` + `@react-three/fiber` gerindo toda a renderização densa de malhas 3D e vértices.

### A Ponte de Einstein-Rosen (Zustand)

O React sofre de cascatas de re-renderização quando as props mudam no topo da árvore. Se um slider HTML atualizasse o estado central do React que encapsula a engine 3D, ocorreria gaguejo extremo (stuttering) e queda repentina de FPS toda vez que você mexesse o mouse.

**Para combater isso, usamos o `Zustand`.**
Ele age como a nossa store central e, mais importante, de modo não reativo direto na hierarquia principal:
- **Painéis UI** leem (via hooks Zustand) e escrevem ações na Store.
- O **Motor 3D**, principalmente através dós hooks assíncronos `useFrame()`, espiona a Store por fora do ciclo de vida React (*transient updates*).

Dessa forma, a navegação flui sem re-painters custosos do DOM. O Canvas gira a maravilhosos 60FPS a 144FPS contínuos.

## O Desafio da Performance 3D (InstancedMesh)

O maior gargalo potencial da nossa sonda seria renderizar ~3.000 instâncias de um componente React `<Planet />` usando nós `<mesh />` elementares na pipeline. Para o navegador, isso causaria *drawcalls* fatais para a CPU.

A solução na Arquitetura é **Instanced Rendering**.
Ao invés de processar o Planeta 'Ruby' e o Planeta 'PHP' separadamente do zero, invocamos malhas *Instanced* (várias cópias da mesma geometria base orbitando coordenadas espaciais distópicas) em lotes volumosos (`<instancedMesh>`). 

Isso agrupa milhares de corpos num subconjunto singular enviado ao buffer da placa de vídeo (GPU) *de uma só vez*! 

## Fluxo de Estado Visual:
```
[Interação do Minimapa UI (Click HTML)] 
  👉 [Ação Executada no Zustand Store] 
    👉 [Zustand dispara notificação atômica] 
      👉 [Componente SolarSystem WebGL repara a variável com let/ref] 
        👉 [Threejs Hook usa easing matemático e voa Câmera 3D ao Alvo]
```

## Roteador (Single Page Navigation)
Atualmente, a navegação entre HUDs na UI é inteiramente ancorada por um painel de estado (ex: "showDocs", "selectedPlanetId", "hudMode"). Assim, a cena 3D ao fundo permanece constante, enquanto as "telas" são abertas sobrepostas pela engine React de interface.

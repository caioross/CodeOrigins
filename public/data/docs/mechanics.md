# Mecânicas de Navegação e Interação

Para compreender totalmente como explorar a "vastidão espacial" renderizada pelas lentes WebGL do CodeOrigins, listamos os comandos basais e mecânicas da câmera simuladora:

## Dinâmica de Vôo e Controles (Câmera Orbicular)

A navegação interage primariamente com o mouse/trackpad operando sob a doutrina de "Controles Arbitrários Orbitais" alimentadas pelo `@react-three/drei` (`OrbitControls`).

1.  **Rotação Cilíndrica:** Segure o **botão Esquerdo** do mouse e arraste sobre qualquer ponto vazio do universo. Isso não muda a posição absoluta da câmera, mas gira sobre o Alvo (Centro Atual/Pivot Point).
2.  **Zoom FTL:** O Scroll do mouse (Roda), ou as pinças duplas no Mac OS Trackpad e Celulares. Aproxima vertiginosamente, transformando sóis grandes em planetas titânicos, e se afastando até virarem ínfimas poeiras estelares na teia panorâmica.
3.  **Pan Espacial Tracking:** Pressionando o clique **Direito** e puxando altera as diretrizes esféricas centrais X/Y da câmera. Em outras palavras, "arrastar o universo horizontal/verticalmente". Permite navegar longas distâncias sem rotacionar.

## Sistema de Focalização de Planetas (Raycasting)
Não se usa botões engessados de links web padrão para selecionar planetas. 
A física de seleção dentro do Three.js usa **Raycasting**. A placa do monitor projeta um "Raio Invisível" (Laser) milimétrico partindo de onde o curslor do mouse repousa até esbarrar a caixa colisora (Bounding Box) do Planeta renderizado no Grid.

Ao clicar validamente em um Planeta:
1.  **Enquadramento (Easing Camera):** A Câmera automaticamente computa posições de distância (`lerp()`), assumindo uma posição lateral cinematográfica perto do planeta selecionado. O *Pivot Point* muda de "Livre", tornando-se esse planeta específico.
2.  **Pop-up do Banco de Dados:** A HUD atende via Zustand que algo foi selecionado. Imediatamente a gravidade da UI baixa o Painel lateral de "Banco de Dados da Linguagem", com uma janela recheada das descrições i18n traduzidas em HTML.
3.  **Sistema "Focar Pai/Criador":** Dentro dessa enciclopédia frontal, links para outras linguagens (Ex: clicar que C é pai do C++) fazem o `OrbitControls` usar viagem-rápida, girando e varrendo o espaço físico 3D na velocidade da luz de onde a câmera estava até a localização em `vec3(x,y,z)` recém-computada do planeta do C.

## Painéis Sobrepostos (Z-Index Escalonado)
Os popups flutuam acima do elemento WebGL. Você pode arrastá-los (dependendo do painel principal de logs) ou fechá-los livremente nos botões em formato `X` do neon superior, restaurando a vista periférica completa intergaláctica (Zen Mode) sem poluição HTML.

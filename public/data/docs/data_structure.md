# Gestão de Dados (A Matéria Oscura da Aplicação)

Para um motor gráfico projetar as linguagens como planetas, é preciso traduzir os traços históricos e de semântica abstrata em pura matemática serializável. Esses dados estruturados vivem centralmente espalhados por constantes nos arquivos `src/data/languages.ts` ou equivalentes listados em blocos imensos da matriz JSON.

## Esquema Universal da Linguagem

Cada planeta no CodeOrigins é renderizado a partir de um objeto padronizado com campos mandatórios. Considere a seguinte interface vital TypeScript (ou JSON subjacente):

```typescript
export interface LanguageData {
  id: string;              // "c", "python", "php" (Sempre minúsculo em Kebab/Snake case como Chave Primária)
  name: string;            // Nome real capitalizado: "C", "Python", "PHP"
  year: number;            // O Big Bang do Elemento - 1972, 1991, 1995. Eixo controlador de Timeline
  creators: string[];      // ["Dennis Ritchie", "Guido van Rossum"]
  paradigms: string[];     // ["Imperative", "Procedural", "Object-Oriented"] - Governa a Cor e Textura do material 3D
  influencedBy: string[];  // ["b", "algol-68"] - Os Array Strings atrelados ao sistema de criação das Orbit Lines
  website: string | null;  // Aterragem opcional do site original da ref. externa
  github: string | null;   // Se possuir repositório vitalício indexado.
  // Propriedades Espaciais Computadas (Para o Modelo Drei):
  mass: number;            // Controla a BoundingBox Radius do planeta R3F. Valores de 1.0 (Satélite modesto) à 8.0/10.0 (Estrelas do tipo C, Java).
  color?: string;          // Usado nas partículas visuais HUD hexadecimais em UI ou fallbacks de material.
}
```

## A Metrificação de Dados

*   **A Matriz de Influência (Órbitas):** O campo `influencedBy` determina para onde o R3F deve apontar os raios/fios conectores durante o layout principal. Um array contendo cinco IDs causará ao Render três nós tubulares traçando geometria cúbica na simulação apontada para o Centro dos IDs mencionados.
*   **Massas Relativas:** Definida "na mão" nas compilações atuais baseadas livremente na adoção e tempo da linguagem, refletindo sua popularidade gravídica. Aumentar excessivamente a `mass` de uma linguagem a escalona imensamente dentro do vetor `useFrame()`.
*   **Categorias baseadas no Ano:** Para o sistema *Timeline do Ano* não falhar num frame vazio e parar, um conjunto de Array de anos chaves (`1950, 1960, ... 2025`) processa internamente e injeta quais objetos com `year: < T` podem ficar Visíveis=`true`. 

## Inserindo Novas Linguagens

Um Engenheiro Espacial querendo adicionar uma Linguagem `FooBar` nascida hoje, teria de:
1. Ir na fonte local dentro da pasta de Dados.
2. Adicionar o bloco padrão com Nome `foobar`, Data `1985`, e *influenciada por* `x`.
3. Certificar-se que o Objeto pai *já existe* ativamente antes. Inserir órbitas de objetos (no `influencedBy`) apontando para um ID fantasma sem dados fará a rota quebrar nas cordas conectáveis ao renderizar o grafo.
4. Consequentemente as Locales dinâmicas teriam que possuir chaves mapeando a história dessa inserção.

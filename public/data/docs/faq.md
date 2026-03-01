# FAQs: Dúvidas Frequentes da Tripulação

**1. O CodeOrigins Roda no Celular? 📱**
Sim. A otimização do React-Three-Fiber e uso pesado do *Canvas HTML5 WebGL* em CodeOrigins permite que rodemos o grafo tridimensional em dispositivos ARM modernos (iPhones recentes e flagships Android). Há contenções de framerates devido a throttling térmico no aparelho, mas os controles (Pinch zoom) funcionam ativamente de forma nativa.

**2. A Tela ficou preta ou meu FPS está beirando 12! O que fazer? 🐢**
- Hardware Acceleration: Confirme com absoluta certeza que o **Aceleração de Hardware do Navegador (Hardware Acceleration)** não foi desativada equivocadamente no Chrome/Firefox. Canvas WebGL sem a GPU morre asfixiado renderizando via CPU pura.
- Limpeza de Browser: Feche outras abas complexas renderizando 3D ou extensões gráficas conflitantes. O CodeOrigins lida diretamente com memória WebGL bruta instanciada.

**3. Discordo violentamente de que {Linguagem X} influenciou a {Linguagem Y}! O mapa mente! 😡**
Como dissecadores historiadores em software, montamos o mapa via agregação coletânea manual (Wikipedia, compêndios, blogs dos criadores, manifestos estritos). A história de influências não é binária. Pode ocorrer intercessão semântica e discordância na comunidade (ex: quem inventou realmente o modelo Objeto padrão ouro funcional).
Se você possui provas de que uma rota (`influencedBy`) está gravemente atrelada de forma equivocada e historicamente fictícia, abra um [Pull Request](contributing.md) retificando a constante JSON. Nós amamos a verdade!

**4. Posso embutir CodeOrigins em projetos visuais com um Iframe? 🖼️**
Sim. Pode necessitar de supressão forçada no CORS caso sua distribuição bloqueie renderização externa WebGL por segurança cruzada.

**5. Por que as estrelas do fundo ficam coloridas e mudam? 🌟**
Você ativou os Globos Filtradores, ou a timeline (Máquina do tempo) pulou décadas! É o sistema dinâmico refletindo nas partículas menores no cenário espacial.

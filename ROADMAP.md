# GameRadar BR — Roteiro de evolução

Objetivo: comparar ofertas de jogos e keys com preços em reais, transparência sobre região, edição, taxas e origem dos dados. Preservar o tema OLED e a experiência móvel.

## Etapas
- [x] Base v1: Steam Brasil, CheapShark, SuperDuperBundle, Epic grátis, câmbio, favoritos locais, busca aproximada e descontos.
- [x] v2.0 código: comparação unificada de Steam, CheapShark e SuperDuperBundle; preços válidos; filtros de categoria, região e DRM; indicação de fontes indisponíveis; distinção entre link direto e comparador; ordenação em BRL; deduplicação dentro de uma mesma fonte; testes simulados de normalização e falhas parciais.
- [ ] v2.0 validação real: teste ponta a ponta em produção, confirmar disponibilidade das lojas e a correspondência exata de edições; integração comercial quando autorizada.
- [x] v2.1 interface básica: carrossel de jogos populares, filtros de preço/desconto/gênero/idioma, modo compacto, paginação, navegação móvel, pesquisas recentes. Busca por link/voz e cobertura de plataformas ainda pendentes.
- [x] v2.2 dados (parcial): histórico Steam Brasil observado em memória do servidor e no navegador, interface 30/90/365 dias, menor/maior/último preço, aviso de preço acima do mínimo observado, status da última consulta às fontes, descarte de ofertas datadas há mais de 72 horas. Testes simulados aprovados.
- [ ] v2.2 persistência: adaptador Supabase e schema SQL preparados; falta criar/autorizar projeto externo, aplicar schema, configurar segredos no Render e validar leitura/escrita. Histórico de outras lojas, coleta contínua, cache persistente e detecção robusta de descontos ainda pendentes.
- [x] v2.3 perfil local (parcial): favoritos, backup/importação, metas em BRL para Steam e CheapShark, consultas em primeiro plano a cada cinco minutos, notificações opcionais do navegador quando suportadas.
- [ ] v2.3 contas online: autenticação, sincronização, notificações em segundo plano, email/Telegram/Discord e painel de economia; dependem de infraestrutura externa autorizada.
- [x] v2.4 expansão parcial: hub de assinaturas com páginas oficiais Xbox Game Pass, PlayStation Plus e Nintendo Switch Online; adaptador experimental do catálogo brasileiro Game Pass para console e PC, paginado; jogos Steam free-to-play e resgates Epic com prazo confirmado. Testes simulados de produto e validade de resgate aprovados.
- [ ] v2.4 expansão restante: validação real do Game Pass e catálogo Steam, preços de compra de consoles, comparação de preços de assinaturas, catálogo automatizado PlayStation/Nintendo, bundles e gift cards.
- [x] v2.5 ferramentas (parcial): perfil de hardware local, comparação numérica conservadora de RAM e armazenamento com requisitos Steam, descrição e modos de jogo informados pela fonte, recomendações por gêneros em comum, planejador de compras em BRL, análise descritiva de preços observados com mínimo de três dias.
- [ ] v2.5 restante: benchmarks verificáveis de CPU/GPU, estimativas de desempenho, duração dos jogos, avaliações, previsão de preço e validação real das ferramentas. Não há IA generativa ou garantia de compatibilidade nesta versão.
- [x] v3.0 infraestrutura (parcial): manifesto PWA, ícones PNG, instalação pelo navegador, fallback offline sem cache de ofertas, aviso de conexão, cabeçalhos de segurança, limite de requisições, foco visível e testes de regressão de manifesto/limites.
- [ ] v3.0 restante: validar instalação em dispositivos e APIs reais, testar suite Node completa, autenticação administrativa, backups remotos, persistência, monitoramento contínuo e auditoria de segurança. Limite por endereço de conexão pode ser compartilhado entre visitantes atrás do proxy do Render; calibrar com métricas reais.

## Critérios de aceite
1. Nunca exibir zero como preço pago ou inventar oferta ausente.
2. Mostrar desconto somente quando preço anterior e atual forem comparáveis.
3. Distinguir BRL nativo de conversão estimada; não presumir impostos ou taxas.
4. Não afirmar que key global é ativável no Brasil sem confirmação.
5. Não confundir marketplace com revendedora autorizada.
6. Não ocultar falhas de fontes nem prometer cobertura universal.
7. Não misturar edição, DLC, conta ou plataforma com jogo completo confirmado.
8. Identificar fonte e horário real de coleta, quando fornecido.
9. Preservar links e atribuições exigidos pela fonte.
10. Não habilitar serviço pago ou API comercial sem autorização do proprietário.

## Dependências e limites
GG.deals, Nuuvem, Eneba e outras integrações comerciais dependem de credenciais e permissão de uso. A hospedagem gratuita não garante execução contínua, histórico permanente ou notificações em segundo plano. Os testes simulados não substituem testes reais.

## Configuração de histórico persistente
Execute database/history.sql em um projeto Supabase autorizado. Configure SUPABASE_URL e SUPABASE_SERVICE_ROLE_KEY exclusivamente como variáveis de ambiente no Render. Nunca coloque a chave no GitHub ou na interface. Enquanto não configurado, a API usa memória temporária limitada; os registros locais permanecem no navegador. O banco gratuito do Render expira em 30 dias, portanto não foi criado para esta finalidade. Não há coleta contínua ou garantia de armazenamento permanente nesta versão.

## v3.1 — validação e estabilidade
- Validado em produção na v3.0: /health, /api/status, /api/history, /api/search (Red Dead 2), /api/free, manifesto PWA, /api/gamepass (PC) e /api/compare-all (Red Dead 2).
- Falha observada: catálogo geral Epic. A consulta GraphQL direta em store.epicgames.com respondeu com dados BRL; adaptador atualizado para esse host, aguardando reteste no Render.
- Comparador agora separa preços com Brasil informado dos globais ou sem região confirmada; ofertas de outras regiões não recebem destaque brasileiro. Horário real do cache Steam exibido.
- Banco externo ainda não configurado. Não há validação completa de todas as lojas ou instalação PWA em aparelho real.

## v3.2 — pesquisa por link e tratamento de falhas
- v3.1 confirmada online. Reteste do catálogo Epic no Render ainda devolveu HTTP 502; busca Steam continua respondendo. O catálogo Epic tem pausa de 90 segundos após falha, independente do feed de resgates grátis, e mensagem com alternativa oficial.
- Pesquisa por URL oficial de jogo Steam, extraindo apenas ID numérico e nunca consultando endereço fornecido pelo visitante. Links de outras lojas não são aceitos nessa função.
- Produtos internacionais sem classificação confirmada recebem indicação de tipo não confirmado quando exibidos nos cards.
- Catálogo direto GOG consultado, mas retornou zero produtos no teste; não foi ativado sem dados válidos.
- Supabase disponível como integração externa, mas ainda depende de autorização do proprietário e configuração do projeto.

## v3.3 — cache e transparência
- Publicação v3.2 confirmada pelo Render. Reteste HTTP externo retornou 503 inclusive em /health; logs confirmam início do processo, mas não explicam a indisponibilidade.
- Cache fresco reduzido a cinco minutos; fallback temporário de até uma hora identificado pelo horário original nas ofertas Steam. Limite global de 24 consultas externas simultâneas, descarte incremental do cache e métricas agregadas em /api/status.
- Banco Supabase ainda não conectado. A nova versão precisa de testes HTTP reais.

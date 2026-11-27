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

## v3.3.2 — links individuais de oferta
- Consulta CheapShark por SteamAppID retorna uma lista de correspondências; agora busca detalhes pelo gameID correspondente e valida novamente o SteamAppID antes de incluir as ofertas.
- Exemplo real confirmado: Cyberpunk 2077 (Steam 1091500, CheapShark 202350) retornou dois dealIDs na consulta de detalhes. Testes simulados de correspondência aprovados.
- Interface prioriza links específicos e separa comparações. O destino final dos redirects CheapShark não foi confirmado, pois a verificação externa foi bloqueada. SuperDuperBundle ainda fornece apenas a comparação do jogo.

## Ajuste de filtros e validação v3.3.2
- Produção confirmada: Cyberpunk 2077 retornou 7 ofertas (3 com link de produto ou redirect); Red Dead Redemption 2 retornou 12 (6 com link de produto ou redirect). Os destinos finais dos redirects não foram confirmados.
- Resumo de menor preço e quantidade agora acompanha os filtros ativos. Ofertas de outras regiões não entram no menor preço brasileiro; ofertas somente de comparação não entram no resumo quando filtradas.
- Prioridades restantes: links de produto verificados, estabilidade Epic, integração de novas lojas, Supabase, autenticação/sincronização, notificações e auditoria real.

## v3.4 — links de resgate e regressão
- A consulta real do feed Epic apresentou Bread and Fred com preço original R$ 39,99 e slug de produto específico. O código agora usa os mapeamentos de produto oficiais, exige BRL e desconto de 100% ativo, exibe preço original e omite o botão se o endereço específico não existir.
- Catálogo geral Epic ainda retorna 502 no Render; resgates funcionam por fonte independente.
- Validadores de links e correspondência CheapShark extraídos para offers.mjs; testes Node adicionados em tests/offers.test.mjs. Fixtures JavaScript aprovadas; suíte Node completa e publicação precisam ser validadas.
- Paginação de jogos grátis preserva os resultados anteriores caso uma próxima consulta falhe. Supabase ainda não conectado.

## v3.4.1 — recuperação do catálogo Epic
- v3.4 confirmada em produção; /api/free retornou Bread and Fred com link de produto e preço original. /api/browse Epic continuava em HTTP 502.
- Catálogo principal continua sendo consultado; em falha, usa seleção limitada do feed oficial de promoções com preço BRL positivo e link específico. Resgates gratuitos permanecem na área Grátis. Interface identifica cobertura parcial ou fonte indisponível, sem simular catálogo completo. Testes simulados de filtragem, deduplicação e paginação aprovados.
- Falta validar nova publicação e recuperar a integração completa com a Epic; Supabase ainda depende de conexão.

## v3.4.2 — catálogo complementar Epic
- v3.4.1 online: rota Epic retornou nove jogos via feed oficial, sem HTTP 502.
- egdata retorna catálogo de terceiros com milhares de registros; preços BRL somente com registro de até 72h, outros preços não confirmados. Origem e data explícitas, links oficiais do produto, sem incorporar registros externos ao histórico local.
- Integração temporária com endpoint público legado: até 10 consultas novas/minuto por processo, cache 30 minutos, até dez páginas; a migração para v1 requer chave de API gratuita autorizada. Mantém fallback oficial independente. Testes simulados de preço/região/links/paginação aprovados; falta validar nova publicação. Não significa catálogo oficial integral recuperado.

## v3.5-prep — preparação da persistência
- v3.4.2 confirmada em produção: catálogo complementar Epic retornou 21 produtos com preços BRL na primeira página.
- Escritas do histórico serializadas por registro; validação de datas e preços, limite de quatro escritas simultâneas e pausa após falhas. SQL preparado com trigger que preserva observações mais recentes. Status do armazenamento visível na seção Lojas.
- Testes simulados de memória, observações fora de ordem e gravação concorrente aprovados. A integração Supabase não está conectada; schema ainda não aplicado, credenciais não configuradas e persistência real não testada. Nenhum plano pago contratado. A memória continua temporária e registros não enviados não têm garantia de recuperação.

## v3.5-prep.1 — estatísticas de sessões
- Consulta de métricas e logs de requisições Render não retornou registros históricos de visitas; não é possível estimar visitantes anteriores nem excluir o proprietário retroativamente.
- Contagem agregada anônima de sessões por aba após 30 segundos visíveis, uma tentativa por sessionStorage, respeitando DNT/GPC e opção de exclusão em Meu perfil. Sem coletar identificador de visitante no contador. Registros agregados GR_VISITS nos logs de aplicação; contagem temporária reinicia com processo/dia UTC, logs dependem da retenção Render. Não equivale a pessoas únicas, pode incluir bots e excluir sessões curtas ou bloqueadas.
- Endpoint POST restrito a origem oficial, limitado por minuto. Testes simulados de limites, dia e origem aprovados. Falta testar em produção e armazenar agregados permanentemente após conexão do Supabase.

## v3.5-prep.2 — painel privado
- v3.5-prep.1 confirmado online; consulta de logs GR_VISITS não retornou eventos no intervalo verificado. Não significa ausência de pessoas.
- Painel /admin com contagens agregadas por dia UTC, estado do banco e fontes. Até sete dias de registros em memória, reiniciados com processo. Autenticação HTTP Basic com usuário admin, senha forte de 32–256 caracteres definida exclusivamente em GR_ADMIN_PASSWORD no Render; sem senha válida, rota retorna 404. Comparação de hash de tamanho fixo, limitação de tentativas malsucedidas, no-store e noindex. Nenhuma credencial criada automaticamente.
- Testes de regressão adicionados; fixtures de decisões de acesso e contagem aprovadas. Suíte Node e autenticação real ainda precisam de teste. Persistência depende de Supabase.

## v3.5-prep.3 — exportação e recuperação
- v3.5-prep.2 confirmado em produção; /admin retornou 404 sem senha configurada, conforme previsto. Banco ainda não conectado.
- Exportação JSON de preços públicos e sessões agregadas em memória, no endpoint /admin/backup protegido pela mesma autenticação. Sem credenciais ou identificadores de visitantes no arquivo; não é backup integral do banco, e não inclui registros de processos anteriores.
- Fila limitada aos registros existentes em memória para reenviar preços não sincronizados nas próximas consultas, respeitando pausa de falha e limite de concorrência. Testes simulados de recuperação, drenagem e exportação aprovados. Falta validar produção, configuração da senha e persistência real. Nenhum custo adicional.

## v3.5-prep.4 — testes automatizados
- Comandos npm test e npm run check sem dependências externas. Novos testes de regressão egdata e de servidor HTTP local, incluindo compilação do script do navegador, /health, bloqueio de /admin e /admin/backup sem senha, validação de histórico e rejeição de origem externa.
- Workflow GitHub Actions configurado para executar os testes em pushes main e pull requests usando Node 22, sem segredos. Não bloqueia publicação Render automaticamente; execução da suíte precisa ser confirmada.
- Banco permanente e senha administrativa continuam pendentes. Nenhum serviço pago contratado.

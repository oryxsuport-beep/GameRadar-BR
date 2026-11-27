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
- [ ] v2.4 expansão: Xbox, PlayStation, Nintendo, assinaturas, bundles, gift cards e categorias gratuitas.
- [ ] v2.5 inteligência: requisitos de PC, orçamento, recomendações, avaliações, duração, cooperativo, lançamentos e previsão de preço com incerteza.
- [ ] v3.0 infraestrutura: PWA, administração, testes de regressão, backups, proteção de API e acessibilidade.

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

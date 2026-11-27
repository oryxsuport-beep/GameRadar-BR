# GameRadar BR — Roteiro de evolução

Objetivo: comparar ofertas de jogos e keys com preços em reais, transparência sobre região, edição, taxas e origem dos dados. Preservar o tema OLED e a experiência móvel.

## Etapas
- [x] Base v1: Steam Brasil, CheapShark, SuperDuperBundle, Epic grátis, câmbio, favoritos locais, busca aproximada e descontos.
- [x] v2.0 código: comparação unificada de Steam, CheapShark e SuperDuperBundle; preços válidos; filtros de categoria, região e DRM; indicação de fontes indisponíveis; distinção entre link direto e comparador; ordenação em BRL; deduplicação dentro de uma mesma fonte; testes simulados de normalização e falhas parciais.
- [ ] v2.0 validação real: teste ponta a ponta em produção, confirmar disponibilidade das lojas e a correspondência exata de edições; integração comercial quando autorizada.
- [ ] v2.1 experiência: carrossel, filtros de preço/desconto/gênero/plataforma/tipo de produto, modo compacto, paginação, navegação móvel, pesquisas recentes, busca por link e voz.
- [ ] v2.2 dados: banco persistente, snapshots de preço, histórico por loja em 30/90/365 dias, menor/maior histórico, alertas de descontos enganosos, cache persistente e monitoramento.
- [ ] v2.3 contas: autenticação opcional, sincronização, listas de desejos, alertas por navegador/email/Telegram/Discord e painel de economia.
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

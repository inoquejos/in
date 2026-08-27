# 🏦 Cofres — Controle Financeiro Pessoal

App financeiro **instalável no celular** (PWA), que funciona **100% offline**,
para controlar entradas, saídas e investimentos usando o método dos **5 cofres**:

| Cofre | % padrão | Para quê |
|---|---|---|
| 🧾 Despesas | 50% | Custo de vida |
| 📈 Investimentos | 20% | Construção de patrimônio |
| 🙏 Dízimo | 10% | Contribuição |
| 🤝 Responsabilidade Social | 10% | Doações e causas |
| 🛟 Fundo de Emergência | 10% | Reserva para imprevistos |

Toda vez que você registra uma **entrada** (salário, freelance, etc.), o valor é
dividido automaticamente entre os 5 cofres nessas proporções — sem perder nem
sobrar centavo (usa o método do maior resto para o arredondamento). Os
percentuais podem ser ajustados na aba **Cofres**, desde que a soma dê 100%.

## Funcionalidades

- **Lançamentos**: entradas, saídas (por cofre) e transferências entre cofres.
- **Dashboard**: saldo total, saldo de cada cofre, últimos lançamentos.
- **Relatórios**: resumo mensal (entradas/saídas/saldo), gráfico de tendência
  dos últimos 6 meses, gráfico de distribuição por cofre, extrato filtrável
  por cofre/tipo/descrição e **exportação em CSV**.
- **Backup/restauração** dos dados em JSON (os dados ficam só no seu
  aparelho — não há servidor nem nuvem).
- **Offline-first**: depois de aberto uma vez, funciona sem internet.
- **Instalável**: "Adicionar à tela de início" no Android e no iPhone.

## Como usar agora (sem instalar nada)

Este é um site estático puro (HTML/CSS/JS), sem build e sem dependências.
Para rodar localmente:

```bash
python3 -m http.server 8080
# depois abra http://localhost:8080 no navegador
```

> Service Worker (o que permite funcionar offline) só funciona em `http://localhost`
> ou em HTTPS — nunca abrindo o `index.html` direto como `file://`.

## Como instalar no celular

1. Hospede a pasta em um servidor HTTPS (veja abaixo) e abra a URL no celular.
2. **Android/Chrome**: menu (⋮) → "Instalar aplicativo" (ou "Adicionar à tela inicial").
3. **iPhone/Safari**: toque em Compartilhar (□↑) → "Adicionar à Tela de Início".
4. Abra o app uma vez com internet — depois disso ele funciona offline.

### Hospedar de graça (GitHub Pages)

1. Em *Settings → Pages* do repositório, escolha a branch e a raiz (`/`) como origem.
2. Acesse a URL gerada (`https://<usuário>.github.io/<repo>/`) pelo celular.

Qualquer outro host estático (Netlify, Vercel, Cloudflare Pages) também funciona —
não precisa de backend, é só servir os arquivos.

## Estrutura do projeto

```
index.html            tela única do app (Início / Relatórios / Cofres / Config)
manifest.webmanifest   metadados do PWA (ícone, nome, cor, modo standalone)
sw.js                   service worker: cacheia o app shell para uso offline
css/style.css           todo o visual (tema claro + escuro automático)
js/
  storage.js            persistência em localStorage (schema + backup/restore)
  util.js                formatação de moeda/data, parsing, download de arquivo
  vaults.js              regras dos cofres: split automático, transferência
  transactions.js        CRUD de lançamentos (mantém saldos dos cofres consistentes)
  reports.js              agregações (resumo mensal, tendência, CSV)
  charts.js                gráficos em <canvas>, sem libs externas
  ui.js                     funções de renderização (DOM)
  app.js                    controlador: liga estado + eventos + telas
icons/                  ícones do PWA (192, 512, maskable)
tools/generate-icons.js gerador dos ícones (Node puro, sem dependências)
```

## Dados e privacidade

Todos os dados ficam salvos **apenas no seu navegador/aparelho**
(`localStorage`), nada é enviado para nenhum servidor. Por isso:

- **Exporte um backup (JSON)** de vez em quando na aba Config — se limpar os
  dados do navegador ou trocar de aparelho, é o backup que te salva.
- Trocar de navegador ou usar modo anônimo = começa com dados vazios.

## Regenerar os ícones

```bash
node tools/generate-icons.js
```

## Próximos passos sugeridos

- Editar um lançamento existente (hoje: excluir e lançar de novo).
- Metas por categoria dentro do cofre de Despesas.
- Gráfico de evolução do saldo de cada cofre ao longo do tempo.

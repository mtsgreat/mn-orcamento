# MN Orçamento

Aplicação web para criação e gestão de orçamentos, com exportação em PDF e compartilhamento por e-mail.

## Stack

- **[Next.js 16](https://nextjs.org/)** — framework React com App Router
- **[React 19](https://react.dev/)** — interface
- **[TypeScript 5](https://www.typescriptlang.org/)** — tipagem estática
- **[Tailwind CSS 4](https://tailwindcss.com/)** — estilização
- **[Supabase](https://supabase.com/)** — banco de dados PostgreSQL, autenticação e API
- **[html2canvas](https://html2canvas.hertzen.com/) + [jsPDF](https://github.com/parallax/jsPDF)** — geração de PDF no browser
- **[Vercel](https://vercel.com/)** — deploy e hospedagem

## Funcionalidades

- Cadastro de clientes (nome, CNPJ, endereço, contato)
- Criação de orçamentos com múltiplos itens e serviços
- Cálculo automático de subtotal, desconto, frete e total
- Formas de pagamento: à vista, PIX, boleto, transferência, parcelado, 50%/50%, cartão de crédito com e sem juros (com número de parcelas)
- Prazo de entrega configurável
- Exportação do orçamento em PDF
- Opção de mostrar ou ocultar valor unitário no PDF
- Compartilhamento do PDF por e-mail (Web Share API)
- Configuração de dados bancários e chave PIX para exibição no PDF
- Histórico de orçamentos com status (rascunho, enviado, aprovado)

## Banco de dados

Tabelas principais no Supabase:

| Tabela | Descrição |
|---|---|
| `clientes` | Dados dos clientes |
| `orcamentos` | Cabeçalho do orçamento (totais, forma de pagamento, status) |
| `orcamento_itens` | Itens/serviços de cada orçamento |
| `servicos` | Catálogo de serviços reutilizáveis |
| `configuracao_pagamento` | Dados bancários e PIX exibidos no PDF |

As migrations estão em `supabase/migrations/`.

## Configuração local

1. Clone o repositório:
   ```bash
   git clone <url-do-repo>
   cd mn-orcamento
   ```

2. Instale as dependências:
   ```bash
   npm install
   ```

3. Crie o arquivo `.env.local` na raiz com suas credenciais do Supabase:
   ```
   NEXT_PUBLIC_SUPABASE_URL=https://seu-projeto.supabase.co
   NEXT_PUBLIC_SUPABASE_ANON_KEY=sua_anon_key
   ```

4. Execute as migrations no painel do Supabase (SQL Editor) ou via Supabase CLI.

5. Inicie o servidor de desenvolvimento:
   ```bash
   npm run dev
   ```

   Acesse em [http://localhost:3000](http://localhost:3000).

## Deploy

O projeto está configurado para deploy na Vercel. Basta conectar o repositório e adicionar as variáveis de ambiente `NEXT_PUBLIC_SUPABASE_URL` e `NEXT_PUBLIC_SUPABASE_ANON_KEY` nas configurações do projeto.

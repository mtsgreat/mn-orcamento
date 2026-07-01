-- Clientes
create table if not exists clientes (
  id uuid primary key default gen_random_uuid(),
  nome text not null,
  cnpj text,
  endereco text,
  telefone text,
  contato text,
  created_at timestamptz default now()
);

-- Catálogo de serviços (reutilizável)
create table if not exists servicos (
  id uuid primary key default gen_random_uuid(),
  nome text not null,
  descricao text,
  preco_unitario numeric(12,2) default 0,
  created_at timestamptz default now()
);

-- Orçamentos
create table if not exists orcamentos (
  id uuid primary key default gen_random_uuid(),
  numero serial unique,
  cliente_id uuid references clientes(id) on delete set null,
  prazo_entrega text,
  frete numeric(12,2) default 0,
  subtotal numeric(12,2) default 0,
  total numeric(12,2) default 0,
  status text default 'rascunho',
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- Itens do orçamento
create table if not exists orcamento_itens (
  id uuid primary key default gen_random_uuid(),
  orcamento_id uuid references orcamentos(id) on delete cascade,
  servico_id uuid references servicos(id) on delete set null,
  descricao text not null,
  quantidade numeric(10,2) default 1,
  valor_unitario numeric(12,2) default 0,
  subtotal numeric(12,2) default 0
);

-- Configuração de pagamento (single row, upsert by id = 1)
create table if not exists configuracao_pagamento (
  id int primary key default 1,
  banco text,
  agencia text,
  conta text,
  favorecido text,
  cnpj_favorecido text,
  chave_pix text,
  tipo_chave text,
  updated_at timestamptz default now()
);

-- Row Level Security (anon key access for MVP)
alter table clientes enable row level security;
alter table servicos enable row level security;
alter table orcamentos enable row level security;
alter table orcamento_itens enable row level security;
alter table configuracao_pagamento enable row level security;

create policy "Allow all on clientes" on clientes for all using (true) with check (true);
create policy "Allow all on servicos" on servicos for all using (true) with check (true);
create policy "Allow all on orcamentos" on orcamentos for all using (true) with check (true);
create policy "Allow all on orcamento_itens" on orcamento_itens for all using (true) with check (true);
create policy "Allow all on configuracao_pagamento" on configuracao_pagamento for all using (true) with check (true);

-- Auto-update updated_at for orcamentos
create or replace function update_updated_at()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

create trigger orcamentos_updated_at
  before update on orcamentos
  for each row execute function update_updated_at();

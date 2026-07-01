-- Adiciona campos na tabela de clientes
ALTER TABLE clientes ADD COLUMN IF NOT EXISTS inscricao_estadual TEXT;

-- Adiciona forma de pagamento na tabela de orçamentos
ALTER TABLE orcamentos ADD COLUMN IF NOT EXISTS forma_pagamento TEXT DEFAULT 'A Vista';

-- Adiciona dados da empresa emissora na configuração
ALTER TABLE configuracao_pagamento ADD COLUMN IF NOT EXISTS nome_empresa TEXT;
ALTER TABLE configuracao_pagamento ADD COLUMN IF NOT EXISTS cnpj_empresa TEXT;
ALTER TABLE configuracao_pagamento ADD COLUMN IF NOT EXISTS endereco_empresa TEXT;
ALTER TABLE configuracao_pagamento ADD COLUMN IF NOT EXISTS contato_empresa TEXT;

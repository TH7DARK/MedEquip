-- Migration number: 0001 	 2025-04-24
DROP TABLE IF EXISTS equipamentos;
DROP TABLE IF EXISTS manutencoes;
DROP TABLE IF EXISTS alertas;
DROP TABLE IF EXISTS campos_personalizados;
DROP TABLE IF EXISTS valores_campos_personalizados;

-- Tabela de equipamentos médicos
CREATE TABLE IF NOT EXISTS equipamentos (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  numero_serie TEXT NOT NULL,
  marca TEXT NOT NULL,
  modelo TEXT,
  nota_fiscal TEXT,
  unidade TEXT NOT NULL,
  cidade TEXT NOT NULL,
  telefone_suporte TEXT,
  data_aquisicao DATE,
  data_garantia_ate DATE,
  status TEXT DEFAULT 'Ativo',
  foto_url TEXT,
  manual_url TEXT,
  created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- Tabela de manutenções (preventivas e corretivas)
CREATE TABLE IF NOT EXISTS manutencoes (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  equipamento_id INTEGER NOT NULL,
  tipo TEXT NOT NULL CHECK (tipo IN ('Preventiva', 'Corretiva')),
  data_realizacao DATE NOT NULL,
  data_proxima_manutencao DATE,
  tecnico_responsavel TEXT NOT NULL,
  tempo_servico INTEGER, -- em minutos
  descricao TEXT,
  pecas_substituidas TEXT,
  custo REAL,
  status TEXT DEFAULT 'Concluída',
  observacoes TEXT,
  created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (equipamento_id) REFERENCES equipamentos(id) ON DELETE CASCADE
);

-- Tabela de alertas para manutenções programadas
CREATE TABLE IF NOT EXISTS alertas (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  equipamento_id INTEGER NOT NULL,
  data_alerta DATE NOT NULL,
  tipo_manutencao TEXT NOT NULL,
  descricao TEXT,
  status TEXT DEFAULT 'Pendente' CHECK (status IN ('Pendente', 'Enviado', 'Concluído', 'Cancelado')),
  created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (equipamento_id) REFERENCES equipamentos(id) ON DELETE CASCADE
);

-- Tabela para definição de campos personalizados
CREATE TABLE IF NOT EXISTS campos_personalizados (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  nome TEXT NOT NULL,
  tipo TEXT NOT NULL CHECK (tipo IN ('Texto', 'Número', 'Data', 'Booleano')),
  obrigatorio BOOLEAN DEFAULT 0,
  created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- Tabela para valores dos campos personalizados
CREATE TABLE IF NOT EXISTS valores_campos_personalizados (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  equipamento_id INTEGER NOT NULL,
  campo_id INTEGER NOT NULL,
  valor TEXT,
  created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (equipamento_id) REFERENCES equipamentos(id) ON DELETE CASCADE,
  FOREIGN KEY (campo_id) REFERENCES campos_personalizados(id) ON DELETE CASCADE
);

-- Criação de índices para melhorar performance
CREATE INDEX idx_equipamentos_numero_serie ON equipamentos(numero_serie);
CREATE INDEX idx_equipamentos_marca ON equipamentos(marca);
CREATE INDEX idx_equipamentos_unidade ON equipamentos(unidade);
CREATE INDEX idx_equipamentos_cidade ON equipamentos(cidade);
CREATE INDEX idx_manutencoes_equipamento_id ON manutencoes(equipamento_id);
CREATE INDEX idx_manutencoes_data_realizacao ON manutencoes(data_realizacao);
CREATE INDEX idx_manutencoes_data_proxima ON manutencoes(data_proxima_manutencao);
CREATE INDEX idx_alertas_equipamento_id ON alertas(equipamento_id);
CREATE INDEX idx_alertas_data ON alertas(data_alerta);
CREATE INDEX idx_alertas_status ON alertas(status);
CREATE INDEX idx_valores_campos_equipamento ON valores_campos_personalizados(equipamento_id, campo_id);

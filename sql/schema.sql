-- QAPHoy - Esquema de base de datos
-- Ejecutar en Vercel Postgres o cualquier PostgreSQL

CREATE TABLE IF NOT EXISTS disponibilidades (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  indicativo VARCHAR(10) NOT NULL,
  numero_operador VARCHAR(2),
  frecuencia VARCHAR(20) NOT NULL,
  banda VARCHAR(5) NOT NULL,
  estado VARCHAR(20) NOT NULL,
  hora_desde TIME NOT NULL,
  hora_hasta TIME NOT NULL,
  observaciones TEXT,
  fecha_creacion TIMESTAMPTZ DEFAULT NOW(),
  fecha_expiracion TIMESTAMPTZ DEFAULT NOW() + INTERVAL '24 hours'
);

CREATE INDEX IF NOT EXISTS idx_disponibilidades_fecha_expiracion 
  ON disponibilidades (fecha_expiracion);

CREATE INDEX IF NOT EXISTS idx_disponibilidades_banda 
  ON disponibilidades (banda);

CREATE INDEX IF NOT EXISTS idx_disponibilidades_fecha_creacion 
  ON disponibilidades (fecha_creacion DESC);

-- Limpieza automática (opcional,也可以 usar un cron job)
-- DELETE FROM disponibilidades WHERE fecha_expiracion < NOW();
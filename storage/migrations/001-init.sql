CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

CREATE TABLE IF NOT EXISTS migrations (
  id uuid default uuid_generate_v4(),
  identifier text not null,
  created TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW()
);

INSERT INTO migrations (identifier) VALUES ('init');

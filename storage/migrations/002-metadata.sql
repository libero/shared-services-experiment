
CREATE TABLE IF NOT EXISTS metadata (
  id uuid default uuid_generate_v4(),
  updated TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
  size int not null,
  key text NOT NULL,
  "publicLink" text,
  tags jsonb,
  "mimeType" text not null,
  namespace text not null,

  primary key(id),
  CONSTRAINT file_key UNIQUE(key)
);

INSERT INTO migrations (identifier) VALUES ('metadata-table');

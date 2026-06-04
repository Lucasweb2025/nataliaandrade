-- Galeria de fotos (painel — upload pela Nathalia)
-- Rode no Supabase: SQL Editor → New query → Run
-- Requer schema.sql + schema-auth.sql (usuário autenticado no painel)

-- Tabela de metadados
create table if not exists galeria_fotos (
  id uuid primary key default gen_random_uuid(),
  storage_path text not null unique,
  category text not null check (char_length(trim(category)) between 2 and 40),
  alt text not null default 'Trabalho',
  sort_order bigint not null default 0,
  created_at timestamptz default now()
);

create index if not exists galeria_fotos_sort_idx on galeria_fotos (sort_order desc, created_at desc);

alter table galeria_fotos enable row level security;

drop policy if exists "Galeria leitura publica" on galeria_fotos;
drop policy if exists "Galeria inserir autenticado" on galeria_fotos;
drop policy if exists "Galeria atualizar autenticado" on galeria_fotos;
drop policy if exists "Galeria excluir autenticado" on galeria_fotos;

create policy "Galeria leitura publica"
  on galeria_fotos for select
  using (true);

create policy "Galeria inserir autenticado"
  on galeria_fotos for insert
  to authenticated
  with check (true);

create policy "Galeria atualizar autenticado"
  on galeria_fotos for update
  to authenticated
  using (true)
  with check (true);

create policy "Galeria excluir autenticado"
  on galeria_fotos for delete
  to authenticated
  using (true);

-- Bucket de imagens (público para leitura no site)
insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values (
  'galeria',
  'galeria',
  true,
  10485760,
  array['image/jpeg', 'image/png', 'image/webp', 'image/gif']
)
on conflict (id) do update set
  public = excluded.public,
  file_size_limit = excluded.file_size_limit,
  allowed_mime_types = excluded.allowed_mime_types;

drop policy if exists "Galeria storage leitura publica" on storage.objects;
drop policy if exists "Galeria storage upload autenticado" on storage.objects;
drop policy if exists "Galeria storage delete autenticado" on storage.objects;

create policy "Galeria storage leitura publica"
  on storage.objects for select
  using (bucket_id = 'galeria');

create policy "Galeria storage upload autenticado"
  on storage.objects for insert
  to authenticated
  with check (bucket_id = 'galeria');

create policy "Galeria storage delete autenticado"
  on storage.objects for delete
  to authenticated
  using (bucket_id = 'galeria');

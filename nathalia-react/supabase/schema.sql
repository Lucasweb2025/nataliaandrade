-- Execute no Supabase: SQL Editor → New query → Run

create table if not exists agendamentos (
  id uuid primary key default gen_random_uuid(),
  date text not null,
  time text not null,
  name text not null,
  phone text not null,
  service text not null,
  created_at timestamptz default now()
);

create unique index if not exists agendamentos_date_time_unique
  on agendamentos (date, time);

alter table agendamentos enable row level security;

drop policy if exists "Leitura publica" on agendamentos;
drop policy if exists "Inserir agendamento" on agendamentos;

create policy "Leitura publica"
  on agendamentos for select
  using (true);

create policy "Inserir agendamento"
  on agendamentos for insert
  with check (true);

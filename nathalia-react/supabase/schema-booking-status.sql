-- Atendimento realizado + pagamento (painel)
-- Rode no Supabase SQL Editor DEPOIS de schema.sql e schema-auth.sql

alter table agendamentos add column if not exists status text not null default 'scheduled';
alter table agendamentos add column if not exists amount_paid numeric(10, 2);
alter table agendamentos add column if not exists payment_method text;

alter table agendamentos drop constraint if exists agendamentos_status_check;
alter table agendamentos add constraint agendamentos_status_check
  check (status in ('scheduled', 'completed', 'no_show'));

alter table agendamentos drop constraint if exists agendamentos_payment_method_check;
alter table agendamentos add constraint agendamentos_payment_method_check
  check (payment_method is null or payment_method in ('pix', 'credito', 'debito', 'dinheiro'));

-- status + pagamento só no painel (authenticated) — update já permitido em schema-auth.sql

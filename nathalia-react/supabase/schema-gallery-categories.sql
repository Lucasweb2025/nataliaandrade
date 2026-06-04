-- Migração: categorias personalizadas na galeria (opção A — Outra)
-- Rode no Supabase SQL Editor DEPOIS do schema-gallery.sql

alter table galeria_fotos drop constraint if exists galeria_fotos_category_check;

alter table galeria_fotos drop constraint if exists galeria_fotos_category_len;

alter table galeria_fotos add constraint galeria_fotos_category_len
  check (char_length(trim(category)) between 2 and 40);

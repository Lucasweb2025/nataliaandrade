-- Rode DEPOIS do schema.sql (agendamentos)
-- Permite que usuarios logados cancelem/atualizem agendamentos no painel

create policy "Admin atualizar agendamentos"
  on agendamentos for update
  to authenticated
  using (true)
  with check (true);

create policy "Admin excluir agendamentos"
  on agendamentos for delete
  to authenticated
  using (true);

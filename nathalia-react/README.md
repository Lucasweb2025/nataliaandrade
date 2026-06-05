# Nathalia Andrade — Salão de Beleza

Site e sistema de agendamento online para o salão em Parque Arariba, SP.

**Site publicado:** https://salaonathaliaandrade.com.br/  
(Mirror GitHub Pages: https://lucasweb2025.github.io/nataliaandrade/)

---

## Funcionalidades

### Site público
- Landing page (início, serviços, galeria, sobre, local)
- Agenda online com calendário e horários em tempo real
- PWA (instalável no celular)
- Botão WhatsApp
- Instagram: [@nathaliaestrela1235](https://www.instagram.com/nathaliaestrela1235/)

### Painel (login)
- Autenticação Supabase (e-mail + senha)
- **Fotos** — enviar e remover imagens da galeria do site (Supabase Storage)
- Agenda de hoje e próximos 7 dias
- Histórico (30 dias)
- Resumo financeiro estimado + gráfico de serviços
- Agendar manualmente e bloquear horários
- Confirmar cliente via WhatsApp
- Busca e filtro por serviço
- Exportar lista da semana

---

## Rotas

| Rota | Descrição |
|------|-----------|
| `#/` | Início |
| `#/servicos` | Serviços e preços |
| `#/galeria` | Fotos dos trabalhos |
| `#/sobre` | Sobre o salão |
| `#/local` | Endereço e mapa |
| `#/agenda` | Agendamento (clientes) |
| `#/login` | Login do painel |
| `#/painel` | Dashboard (protegido) |

---

## Stack

- React 19 + Vite
- Tailwind CSS v4
- Framer Motion
- React Router (HashRouter — GitHub Pages)
- Supabase (agendamentos + auth)

---

## Desenvolvimento local

```bash
cd nathalia-react
npm install
cp .env.example .env.local   # preencher chaves Supabase
npm run dev
```

Abre em `http://localhost:5173/`

### Variáveis de ambiente (`.env.local`)

```env
VITE_SUPABASE_URL=https://seu-projeto.supabase.co
VITE_SUPABASE_ANON_KEY=sua-chave-anon-ou-publishable
```

Nunca commitar `.env.local`.

---

## Build e deploy (GitHub Pages)

```bash
npm run build
```

Copiar conteúdo de `dist/` para a raiz do repositório (`index.html`, `assets/`, `gallery/`, etc.) e fazer push na branch `main`.

Domínio: **salaonathaliaandrade.com.br** (`public/CNAME` + DNS no Registro.br + Custom domain no GitHub Pages).

---

## Supabase

1. Executar `supabase/schema.sql` — tabela `agendamentos` + RLS leitura/inserção pública
2. Executar `supabase/schema-auth.sql` — políticas de update/delete para usuários autenticados (painel)
3. Executar `supabase/schema-gallery.sql` — tabela `galeria_fotos` + bucket Storage `galeria`
4. Executar `supabase/schema-gallery-categories.sql` — permite categorias custom (Outra) e presets Sobrancelha/Salão
5. **Database → Replication** — ativar Realtime na tabela `galeria_fotos` (opcional; o site atualiza ao recarregar)
6. **Authentication → Users** — criar usuário da profissional
7. Habilitar provider **Email**

---

## Estrutura principal

```
src/
  pages/       Home, Servicos, Galeria, Sobre, Local, Agenda, Login, Painel
  components/  Navbar, Footer, Gallery, PanelScheduleForm, ...
  lib/         constants, bookings, supabase, dates, pricing, schedule
  context/     AuthContext
public/
  gallery/     Fotos dos trabalhos
  logo.png, proprietaria.jpg, sw.js, manifest.json
```

---

## Manual da cliente

Instruções de uso do site e do painel: [MANUAL-CLIENTE.md](MANUAL-CLIENTE.md)

---

## Créditos

Desenvolvido por [Lucasweb](https://www.instagram.com/lucasdmxx/)

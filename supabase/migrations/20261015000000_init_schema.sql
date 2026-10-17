-- =====================================================================
-- Imagio chatbot: initial schema
-- Put this file in: supabase/migrations/20261015000000_init_schema.sql
-- Then run: npx supabase db push
-- (or paste it into Supabase Dashboard > SQL Editor > Run)
-- =====================================================================

-- ---------------------------------------------------------------------
-- Helper: keep updated_at fresh
-- ---------------------------------------------------------------------
create or replace function public.set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

-- ---------------------------------------------------------------------
-- CATALOG
-- One row per product. Sizes / prices live in product_variants.
-- Anything category-specific (notes, firmness, coverage...) goes in the
-- `attributes` jsonb column so we never need a new column per category.
-- ---------------------------------------------------------------------
create table public.products (
  id                uuid primary key default gen_random_uuid(),
  slug              text not null unique,
  sku               text unique,
  category          text not null check (category in (
                      'diffuser_machine',
                      'fragrance_oil',
                      'mattress',
                      'pillow',
                      'bedset',
                      'duvet',
                      'room_spray',
                      'candle',
                      'zen_set',
                      'reed_diffuser'
                    )),
  name              text not null,
  short_description text,
  description       text,
  base_price        numeric(12,2),            -- fixed price, or "starting from" price
  currency          text not null default 'NGN',
  attributes        jsonb not null default '{}'::jsonb,
  image_urls        text[] not null default '{}',
  product_url       text,
  in_stock          boolean not null default true,
  active            boolean not null default true,
  created_at        timestamptz not null default now(),
  updated_at        timestamptz not null default now()
);

create index products_category_idx on public.products (category) where active;
create index products_attributes_gin on public.products using gin (attributes jsonb_path_ops);

create trigger products_set_updated_at
  before update on public.products
  for each row execute function public.set_updated_at();

-- Sizes of a mattress, volumes of an oil (10ml / 100ml / 250ml / 500ml), etc.
create table public.product_variants (
  id          uuid primary key default gen_random_uuid(),
  product_id  uuid not null references public.products(id) on delete cascade,
  label       text not null,                  -- e.g. '6x7 ft' or '250ml'
  price       numeric(12,2) not null,
  attributes  jsonb not null default '{}'::jsonb,  -- e.g. {"size_cm": "180cm x 210cm"}
  in_stock    boolean not null default true,
  active      boolean not null default true,
  sort_order  int not null default 0,
  created_at  timestamptz not null default now(),
  updated_at  timestamptz not null default now(),
  unique (product_id, label)
);

create index product_variants_product_idx on public.product_variants (product_id) where active;

create trigger product_variants_set_updated_at
  before update on public.product_variants
  for each row execute function public.set_updated_at();

-- ---------------------------------------------------------------------
-- CONVERSATIONS
-- ---------------------------------------------------------------------
create table public.conversations (
  id          uuid primary key default gen_random_uuid(),
  session_id  text not null,                  -- generated in the browser
  entry_path  text check (entry_path in ('furniture', 'scent', 'comfort', 'free')),
  stage       text not null default 'question' check (stage in ('question', 'needs', 'answer')),
  status      text not null default 'open' check (status in ('open', 'handed_off', 'closed')),
  created_at  timestamptz not null default now(),
  updated_at  timestamptz not null default now()
);

create index conversations_session_idx on public.conversations (session_id);

create trigger conversations_set_updated_at
  before update on public.conversations
  for each row execute function public.set_updated_at();

create table public.messages (
  id               uuid primary key default gen_random_uuid(),
  conversation_id  uuid not null references public.conversations(id) on delete cascade,
  role             text not null check (role in ('user', 'assistant', 'tool')),
  content          text not null,
  product_ids      uuid[] not null default '{}',   -- products shown in this message
  created_at       timestamptz not null default now()
);

create index messages_conversation_idx on public.messages (conversation_id, created_at);

-- What the bot has learned about the customer in this conversation
-- e.g. {"sleeper_type": "side", "back_ache": true, "budget_max": 900000}
create table public.customer_profiles (
  conversation_id  uuid primary key references public.conversations(id) on delete cascade,
  data             jsonb not null default '{}'::jsonb,
  updated_at       timestamptz not null default now()
);

create trigger customer_profiles_set_updated_at
  before update on public.customer_profiles
  for each row execute function public.set_updated_at();

-- ---------------------------------------------------------------------
-- LEADS, HANDOFFS, FEEDBACK
-- ---------------------------------------------------------------------
create table public.leads (
  id               uuid primary key default gen_random_uuid(),
  conversation_id  uuid references public.conversations(id) on delete set null,
  name             text,
  phone            text,
  email            text,
  interest         text,                       -- short summary of what they want
  created_at       timestamptz not null default now()
);

create table public.handoffs (
  id               uuid primary key default gen_random_uuid(),
  conversation_id  uuid not null references public.conversations(id) on delete cascade,
  reason           text,
  status           text not null default 'pending' check (status in ('pending', 'contacted', 'closed')),
  created_at       timestamptz not null default now()
);

create table public.feedback (
  id          uuid primary key default gen_random_uuid(),
  message_id  uuid not null references public.messages(id) on delete cascade,
  rating      smallint not null check (rating in (-1, 1)),
  comment     text,
  created_at  timestamptz not null default now()
);

-- ---------------------------------------------------------------------
-- KNOWLEDGE BASE + LEARNING LOOP
-- ---------------------------------------------------------------------
-- Approved answers the bot can look up (delivery, warranty, business rules...)
create table public.knowledge_base (
  id          uuid primary key default gen_random_uuid(),
  topic       text not null,                   -- e.g. 'delivery', 'warranty', 'rules'
  question    text not null,
  answer      text not null,
  source      text not null default 'manual' check (source in ('manual', 'from_unanswered')),
  active      boolean not null default true,
  created_at  timestamptz not null default now(),
  updated_at  timestamptz not null default now()
);

create trigger knowledge_base_set_updated_at
  before update on public.knowledge_base
  for each row execute function public.set_updated_at();

-- Questions the bot could not answer: reviewed weekly, then turned into
-- knowledge_base entries. This is how the system "learns" safely.
create table public.unanswered_questions (
  id               uuid primary key default gen_random_uuid(),
  conversation_id  uuid references public.conversations(id) on delete set null,
  question         text not null,
  resolved         boolean not null default false,
  created_at       timestamptz not null default now()
);

-- ---------------------------------------------------------------------
-- ROW LEVEL SECURITY
-- The Edge Function uses the service role key, which bypasses RLS.
-- The browser (anon key) can only read the active catalog.
-- Every other table has RLS on and no policies = no direct access.
-- ---------------------------------------------------------------------
alter table public.products             enable row level security;
alter table public.product_variants     enable row level security;
alter table public.conversations        enable row level security;
alter table public.messages             enable row level security;
alter table public.customer_profiles    enable row level security;
alter table public.leads                enable row level security;
alter table public.handoffs             enable row level security;
alter table public.feedback             enable row level security;
alter table public.knowledge_base       enable row level security;
alter table public.unanswered_questions enable row level security;

create policy "Public can read active products"
  on public.products for select
  to anon, authenticated
  using (active = true);

create policy "Public can read active variants"
  on public.product_variants for select
  to anon, authenticated
  using (active = true);

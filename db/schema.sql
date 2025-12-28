create table if not exists products (
  id uuid primary key default gen_random_uuid(),
  code text not null unique,
  name text not null,
  brand text not null check (brand in ('Antam', 'UBS')),
  weight numeric not null,
  price numeric not null,
  image_url text,
  certificate text,
  created_at timestamp with time zone default now()
);

create table if not exists stocks (
  id uuid primary key default gen_random_uuid(),
  product_id uuid references products(id) on delete cascade,
  available integer not null default 0,
  mutation_note text,
  created_at timestamp with time zone default now()
);

create table if not exists settings (
  id uuid primary key default gen_random_uuid(),
  margin_annual numeric not null,
  admin_fee numeric not null,
  stamp_duty numeric not null,
  dp_min numeric not null,
  dp_max numeric not null,
  tenor_options integer[] not null,
  late_fee_daily numeric not null,
  updated_at timestamp with time zone default now()
);

create table if not exists simulations (
  id uuid primary key default gen_random_uuid(),
  product_id uuid references products(id),
  price numeric not null,
  dp_amount numeric not null,
  tenor integer not null,
  monthly_installment numeric not null,
  total_pay numeric not null,
  created_at timestamp with time zone default now()
);

create table if not exists applications (
  id uuid primary key default gen_random_uuid(),
  user_name text not null,
  phone text not null,
  email text not null,
  product_id uuid references products(id),
  price numeric not null,
  dp_amount numeric not null,
  tenor integer not null,
  status text not null default 'Pending',
  created_at timestamp with time zone default now()
);

create table if not exists installment_schedule (
  id uuid primary key default gen_random_uuid(),
  application_id uuid references applications(id) on delete cascade,
  month_index integer not null,
  due_date date not null,
  installment numeric not null,
  principal numeric not null,
  margin numeric not null,
  status text not null default 'Belum Dibayar',
  late_days integer not null default 0,
  penalty numeric not null default 0,
  total_due numeric not null
);

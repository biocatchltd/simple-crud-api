CREATE TABLE sessions(
  SESSION_ID uuid PRIMARY KEY default gen_random_uuid(),
  TIMESTAMP bigint not null,
  CUSTOMER_ID text not null,
  TYPING_SPEED real not null,
  CURSOR_HOPS int not null,
  IP cidr not null,
  PASSWORD_PASTED boolean not null,
  SCORE int,
  DELETED boolean default false
);
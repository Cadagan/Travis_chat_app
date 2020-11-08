GRANT ALL PRIVILEGES ON DATABASE postgres TO grupo21;
CREATE TABLE IF NOT EXISTS postgres.public.rooms
(
	id serial,
	name text NOT NULL,
	PRIMARY KEY (id)
);

CREATE TABLE IF NOT EXISTS postgres.public.messages
(
    id serial,
    username text NOT NULL,
    message text NOT NULL,
    roomid text NOT NULL,
    datetime timestamp with time zone DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (id)
);

CREATE TABLE IF NOT EXISTS postgres.public.users
(
    id serial,
    username text NOT NULL,
    password text NOT NULL,
    salt text NOT NULL,
    PRIMARY KEY (id)
);

ALTER TABLE public.messages
    OWNER to grupo21;
ALTER TABLE public.rooms
	OWNER to grupo21;

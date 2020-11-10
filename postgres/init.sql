GRANT ALL PRIVILEGES ON DATABASE postgres TO postgres;
CREATE TABLE IF NOT EXISTS postgres.public.rooms
(
	id serial,
	name text NOT NULL,
	room_image text,
    private boolean,
    password varchar(50),
	PRIMARY KEY (id)
);

CREATE TABLE IF NOT EXISTS postgres.public.messages
(
    id serial,
    username text NOT NULL,
    message text NOT NULL,
    roomid text NOT NULL,
    datetime timestamp with time zone DEFAULT CURRENT_TIMESTAMP,
    censured boolean,
    originalmessage text,
    PRIMARY KEY (id)
);

CREATE TABLE IF NOT EXISTS postgres.public.users
(
    id serial,
    username text NOT NULL,
    hashedpassword text NOT NULL,
    name text NOT NULL,
    email text NOT NULL,
    role text DEFAULT user,
    googleId text DEFAULT 0,
    PRIMARY KEY (id),
    CONSTRAINT unique_username UNIQUE (username)
);

ALTER TABLE public.messages
    OWNER to postgres;
ALTER TABLE public.rooms
	OWNER to postgres;
ALTER TABLE public.users
	OWNER to postgres;

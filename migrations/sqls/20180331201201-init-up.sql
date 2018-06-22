CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

CREATE TABLE aired_songs (
  aired_songs_id uuid DEFAULT uuid_generate_v4(),
  artist text,
  title text,
  air_date timestamp with time zone,
  page_date timestamp with time zone,
  spotify_track_id char(22),
  deezer_track_id integer,
  PRIMARY KEY (aired_songs_id),
  UNIQUE (artist, title, air_date)
);

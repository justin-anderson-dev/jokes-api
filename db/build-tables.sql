DROP TABLE IF EXISTS jokes;

CREATE TABLE
  jokes (id SERIAL PRIMARY KEY, joke TEXT NOT NULL);

DROP TABLE IF EXISTS users;

CREATE TABLE
  users (
    id SERIAL PRIMARY KEY,
    username VARCHAR(128) NOT NULL UNIQUE,
    password VARCHAR(128) NOT NULL
  );

DROP TABLE IF EXISTS user_jokes;

CREATE TABLE
  user_jokes (
    id SERIAL PRIMARY KEY,
    userId INTEGER REFERENCES users (id),
    jokeId INTEGER REFERENCES jokes (id)
  );

INSERT INTO
  users (username, password)
VALUES
  ('john@noemail.com', 'abc123'),
  ('jane@noemail.com', 'abc123'),
  ('rick@noemail.com', 'abc123');

INSERT INTO
  jokes (joke)
VALUES
  (
    'Why don''t scientists trust atoms? Because they make up everything.'
  ),
  (
    'Why did the chicken go to the seance? To talk to the other side.'
  ),
  (
    'Why don''t some fish play piano? They get lost in the scales.'
  );

INSERT INTO
  user_jokes (userId, jokeId)
VALUES
  (1, 1),
  (1, 2),
  (1, 3),
  (2, 1),
  (2, 2),
  (3, 3);

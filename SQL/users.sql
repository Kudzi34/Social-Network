DROP TABLE IF EXISTS chats;
DROP TABLE IF EXISTS friendships;
DROP TABLE IF EXISTS users;

CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    firstname VARCHAR(255) NOT NULL,
    lastname VARCHAR (255)  NOT NULL,
    email VARCHAR (255) NOT NULL UNIQUE,
    hashedpassword VARCHAR(255) NOT NULL,
    imageUrl VARCHAR (500),
    bio VARCHAR (500)
);

CREATE TABLE friendships (
    id SERIAL PRIMARY KEY,
    sender_id INTEGER NOT NULL REFERENCES users(id),
    reciever_id INTEGER NOT NULL REFERENCES users(id),
    status INTEGER NOT NULL DEFAULT 1
);

CREATE TABLE chats(
    id SERIAL PRIMARY KEY,
    sender_id INTEGER NOT NULL REFERENCES users(id),
    sent TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    message VARCHAR(1000) not null
);

CREATE TABLE IF NOT EXISTS users (
    id SERIAL PRIMARY KEY,
    nome VARCHAR(255) NOT NULL,
    cpf VARCHAR(20) NOT NULL,
    number VARCHAR(30),
    birth DATE NOT NULL,
    role VARCHAR(100) NOT NULL,
    is_active BOOLEAN NOT NULL DEFAULT TRUE
);

CREATE TABLE IF NOT EXISTS time_entries (
    id SERIAL PRIMARY KEY,
    user_id INTEGER NOT NULL,
    action TIMESTAMP NOT NULL,
    CONSTRAINT fk_time_entries_user
        FOREIGN KEY (user_id)
        REFERENCES users(id)
        ON DELETE CASCADE
);
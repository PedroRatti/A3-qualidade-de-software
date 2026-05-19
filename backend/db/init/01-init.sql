CREATE TABLE IF NOT EXISTS users
(
    id SERIAL PRIMARY KEY,
    name VARCHAR (255) NOT NULL,
    email VARCHAR (255) NOT NULL,
    password VARCHAR (255) NOT NULL,
    cpf VARCHAR (20) NOT NULL,
    number VARCHAR (30),
    birth DATE NOT NULL,
    role VARCHAR (100) NOT NULL,
    is_active BOOLEAN NOT NULL DEFAULT TRUE
);

CREATE TABLE IF NOT EXISTS time_entries
(
    id SERIAL PRIMARY KEY,
    user_id INTEGER NOT NULL,
    action VARCHAR (255) NOT NULL,
    created_at TIMESTAMP NOT NULL, 
    CONSTRAINT fk_time_entries_user FOREIGN KEY (user_id)
    REFERENCES users (id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS requests
(
    id SERIAL PRIMARY KEY,
    user_id INTEGER NOT NULL,
    supervisor_id INTEGER NOT NULL,
    type VARCHAR(50) NOT NULL,
    start_date DATE NOT NULL,
    end_date DATE NOT NULL,
    reason TEXT NOT NULL,
    attachment_url VARCHAR(500),
    status VARCHAR(30) NOT NULL DEFAULT 'pendente',
    created_at TIMESTAMP NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMP NOT NULL DEFAULT NOW(),
    CONSTRAINT fk_requests_user FOREIGN KEY (user_id)
        REFERENCES users (id) ON DELETE CASCADE,
    CONSTRAINT fk_requests_supervisor FOREIGN KEY (supervisor_id)
        REFERENCES users (id) ON DELETE RESTRICT,
    CONSTRAINT chk_requests_type CHECK (type IN ('ferias', 'abono_falta', 'outro')),
    CONSTRAINT chk_requests_status CHECK (status IN ('pendente', 'aprovada', 'rejeitada')),
    CONSTRAINT chk_requests_period CHECK (start_date <= end_date)
);
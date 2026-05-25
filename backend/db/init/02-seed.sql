INSERT INTO users (name, email, password, cpf, number, birth, role, is_active)
VALUES ('Pedro Admin', 'pedro.admin@example.com', 'pedro123', '12345678900', '48999990001', '1995-05-17', 'admin', TRUE),
       ('Ana Admin', 'ana.admin@example.com', 'ana123', '12345678901', '48999990002', '1998-03-12', 'admin', TRUE),
       ('Bruno Lima', 'bruno.lima@example.com', 'bruno123', '12345678902', '48999990003', '1997-07-25', 'employee', TRUE),
       ('Carla Mendes', 'carla.mendes@example.com', 'carla123', '12345678903', '48999990004', '1999-11-02', 'employee', TRUE),
       ('Daniel Rocha', 'daniel.rocha@example.com', 'daniel123', '12345678904', '48999990005', '1996-09-18', 'employee', TRUE),
       ('Eduarda Alves', 'eduarda.alves@example.com', 'eduarda123', '12345678905', '48999990006', '2000-01-30', 'employee', TRUE),
       ('Felipe Martins', 'felipe.martins@example.com', 'felipe123', '12345678906', '48999990007', '1994-06-14', 'employee', TRUE),
       ('Gabriela Costa', 'gabriela.costa@example.com', 'gabriela123', '12345678907', '48999990008', '1998-12-09', 'employee', TRUE),
       ('Henrique Dias', 'henrique.dias@example.com', 'henrique123', '12345678908', '48999990009', '1997-04-21', 'employee', TRUE),
       ('Isabela Fernandes', 'isabela.fernandes@example.com', 'isabela123', '12345678909', '48999990010', '1999-08-05', 'employee', TRUE),
       ('Joao Pedro', 'joao.pedro@example.com', 'joao123', '12345678910', '48999990011', '1995-10-28', 'employee', TRUE);

INSERT INTO time_entries (user_id, action, created_at)
SELECT u.id,
       e.action,
       d.day::timestamp + e.base_time + ((u.id + EXTRACT(DAY FROM d.day)::int) % 11) * INTERVAL '1 minute'
FROM users u
         CROSS JOIN generate_series(
                CURRENT_DATE - INTERVAL '1 month',
                CURRENT_DATE - INTERVAL '1 day',
                INTERVAL '1 day'
                    ) AS d(day)
         CROSS JOIN (
                VALUES
                    ('entrada', TIME '08:00:00'),
                    ('saida_almoco', TIME '12:00:00'),
                    ('entrada_almoco', TIME '13:00:00'),
                    ('saida', TIME '17:00:00')
                    ) AS e(action, base_time)
WHERE u.is_active = TRUE
  AND EXTRACT(ISODOW FROM d.day) BETWEEN 1 AND 5;

INSERT INTO requests (user_id, type, start_date, end_date, reason, attachment_url, status)
VALUES
    (2, 1, 'ferias', '2026-06-10', '2026-06-20', 'Ferias programadas', NULL, 'pendente'),
    (2, 1, 'abono_falta', '2026-05-06', '2026-05-06', 'Consulta medica', 'https://meu-arquivo.com/atestado.pdf', 'aprovada');
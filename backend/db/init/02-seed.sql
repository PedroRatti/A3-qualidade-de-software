INSERT INTO users (nome, cpf, number, birth, role, is_active)
VALUES ('Pedro Admin', '12345678900', '48999990001', '1995-05-17', 'admin', TRUE),
       ('Ana Souza', '12345678901', '48999990002', '1998-03-12', 'employee', TRUE),
       ('Bruno Lima', '12345678902', '48999990003', '1997-07-25', 'employee', TRUE),
       ('Carla Mendes', '12345678903', '48999990004', '1999-11-02', 'employee', TRUE),
       ('Daniel Rocha', '12345678904', '48999990005', '1996-09-18', 'employee', TRUE),
       ('Eduarda Alves', '12345678905', '48999990006', '2000-01-30', 'employee', TRUE),
       ('Felipe Martins', '12345678906', '48999990007', '1994-06-14', 'employee', TRUE),
       ('Gabriela Costa', '12345678907', '48999990008', '1998-12-09', 'employee', TRUE),
       ('Henrique Dias', '12345678908', '48999990009', '1997-04-21', 'employee', TRUE),
       ('Isabela Fernandes', '12345678909', '48999990010', '1999-08-05', 'employee', TRUE),
       ('João Pedro', '12345678910', '48999990011', '1995-10-28', 'employee', TRUE);

INSERT INTO time_entries (user_id, action)
SELECT u.id,
       (d::timestamp + TIME '08:00:00')
FROM users u
         CROSS JOIN generate_series(
                CURRENT_DATE - INTERVAL '1 month',
                CURRENT_DATE,
                INTERVAL '1 day'
                    ) d
WHERE EXTRACT(ISODOW FROM d) BETWEEN 1 AND 5;

INSERT INTO time_entries (user_id, action)
SELECT u.id,
       (d::timestamp + TIME '17:00:00')
FROM users u
         CROSS JOIN generate_series(
                CURRENT_DATE - INTERVAL '1 month',
                CURRENT_DATE,
                INTERVAL '1 day'
                    ) d
WHERE EXTRACT(ISODOW FROM d) BETWEEN 1 AND 5;
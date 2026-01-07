USE quizmaster;

-- Utilisateurs de test (mot de passe: Test1234!)
-- Hash bcrypt pour "Test1234!" avec 10 rounds
INSERT INTO users (email, password, role, is_premium) VALUES
('prof@test.com', '$2b$10$rQZ8K1X5kV5Q5X5X5X5X5OX5X5X5X5X5X5X5X5X5X5X5X5X5X5X5X', 'prof', FALSE),
('prof.premium@test.com', '$2b$10$rQZ8K1X5kV5Q5X5X5X5X5OX5X5X5X5X5X5X5X5X5X5X5X5X5X5X5X', 'prof', TRUE),
('eleve@test.com', '$2b$10$rQZ8K1X5kV5Q5X5X5X5X5OX5X5X5X5X5X5X5X5X5X5X5X5X5X5X5X', 'eleve', FALSE);

-- Quiz de test
INSERT INTO quizzes (user_id, title, access_code) VALUES
(1, 'Quiz Culture Generale', 'ABC12'),
(2, 'Quiz Histoire', 'XYZ99');

-- Questions de test
INSERT INTO questions (quiz_id, type, question_text, options, correct_answer) VALUES
(1, 'qcm', 'Quelle est la capitale de la France ?', '["Paris", "Lyon", "Marseille", "Bordeaux"]', 'Paris'),
(1, 'vf', 'Le soleil se leve a l\'ouest.', '["Vrai", "Faux"]', 'Faux'),
(1, 'qcm', 'Combien font 2 + 2 ?', '["3", "4", "5", "6"]', '4');

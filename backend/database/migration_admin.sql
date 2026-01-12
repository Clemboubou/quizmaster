-- Migration pour ajouter le systeme admin
-- A executer sur une base existante

-- 1. Modifier la colonne role pour ajouter 'admin'
ALTER TABLE users MODIFY COLUMN role ENUM('prof', 'eleve', 'admin') NOT NULL;

-- 2. Ajouter la colonne is_active si elle n'existe pas
ALTER TABLE users ADD COLUMN IF NOT EXISTS is_active BOOLEAN DEFAULT TRUE;

-- 3. Creer la table logs
CREATE TABLE IF NOT EXISTS logs (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NULL,
    action VARCHAR(100) NOT NULL,
    target_type VARCHAR(50) NULL,
    target_id INT NULL,
    details JSON NULL,
    ip_address VARCHAR(45) NULL,
    user_agent TEXT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE SET NULL
);

-- 4. Ajouter les index pour la table logs
CREATE INDEX IF NOT EXISTS idx_logs_user ON logs(user_id);
CREATE INDEX IF NOT EXISTS idx_logs_action ON logs(action);
CREATE INDEX IF NOT EXISTS idx_logs_created ON logs(created_at);

-- 5. Creer un compte admin par defaut
-- Email: admin@quizmaster.com
-- Password: Admin123!
-- (Le hash doit etre genere avec bcrypt - voir note ci-dessous)

-- NOTE: Pour creer l'admin, executez cette requete APRES avoir genere le hash
-- avec le script create-admin.js ou via l'API

-- Verification: SELECT * FROM users WHERE role = 'admin';

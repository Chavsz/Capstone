--naggamit rako terminal,dili kabalo mag export og .sql pa. imanual2 lang sa

CREATE DATABASE jwt_auth_multiuser;
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

--set extension for uuid
CREATE TABLE users(
  user_id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_name VARCHAR(255) NOT NULL,
  user_email VARCHAR(255) NOT NULL,
  user_password VARCHAR(255) NOT NULL,
  user_role VARCHAR(20) NOT NULL DEFAULT 'student'
);

-- data stored
INSERT INTO users (user_name, user_email, user_password, user_role) VALUES ('Chavyst', 'chavyst@gmail.com', '123456', 'student'); --role = tutee
INSERT INTO users (user_name, user_email, user_password, user_role) VALUES ('Chavy', 'chavy.com', 'chavy123', 'tutor'); --role = tutor
INSERT INTO users (user_name, user_email, user_password, user_role) VALUES ('ChavyAdmin', 'admin@gmail.com', 'adminpassword', 'admin'); --role = admin

SELECT * FROM users;






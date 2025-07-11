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

--Profile Tutor table
CREATE TABLE profile (
  profile_id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id uuid REFERENCES users(user_id) ON DELETE CASCADE,
  program VARCHAR(100),
  college VARCHAR(100),
  year_level VARCHAR(20),
  specialization VARCHAR(100),
  topics TEXT,
  profile_image VARCHAR(255)
);

--Tutor Schedule table
CREATE TABLE schedule (
  schedule_id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id uuid REFERENCES users(user_id) ON DELETE CASCADE,
  day VARCHAR(20) NOT NULL, -- e.g., Monday, Tuesday
  start_time TIME NOT NULL,
  end_time TIME NOT NULL
);

-- Example: Insert multiple time slots for a tutor on Monday
-- INSERT INTO schedule (user_id, day, start_time, end_time) VALUES ('<tutor_user_id>', 'Monday', '07:00', '11:00');
-- INSERT INTO schedule (user_id, day, start_time, end_time) VALUES ('<tutor_user_id>', 'Monday', '13:00', '14:30');
-- INSERT INTO schedule (user_id, day, start_time, end_time) VALUES ('<tutor_user_id>', 'Monday', '15:30', '16:30');

--data stored
INSERT INTO users (user_name, user_email, user_password, user_role) VALUES ('Chavyst', 'chavyst@gmail.com', '123456', 'student'); --role = tutee
INSERT INTO users (user_name, user_email, user_password, user_role) VALUES ('Chavy', 'chavy@gmail.com', 'chavy123', 'tutor'); --role = tutor
INSERT INTO users (user_name, user_email, user_password, user_role) VALUES ('ChavyAdmin', 'admin@gmail.com', 'admin123', 'admin'); --role = admin

--queries
SELECT * FROM users;
UPDATE users SET user_role = 'admin' WHERE user_name = 'Chavy';






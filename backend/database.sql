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

CREATE TABLE appointment (
  appointment_id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id uuid REFERENCES users(user_id) ON DELETE CASCADE,
  tutor_id uuid REFERENCES users(user_id) ON DELETE CASCADE,
  subject VARCHAR(255) NOT NULL,
  topic VARCHAR(255) NOT NULL,
  mode_of_session VARCHAR(255) NOT NULL,
  date DATE NOT NULL,
  start_time TIME NOT NULL,
  end_time TIME NOT NULL,
  status VARCHAR(255) NOT NULL DEFAULT 'pending',
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE feedback (
  feedback_id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id uuid REFERENCES users(user_id) ON DELETE CASCADE,
  tutor_id uuid REFERENCES users(user_id) ON DELETE CASCADE,
  appointment_id uuid REFERENCES appointment(appointment_id) ON DELETE CASCADE,
  rating INT NOT NULL,  -- 1-5 stars
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

--Landing Page Table
CREATE TABLE landing (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),        -- UUID as the primary key with automatic generation
  home_image VARCHAR(255) NOT NULL,                        -- Home image URL
  home_title VARCHAR(255) NOT NULL,                        -- Home title text
  home_description TEXT NOT NULL,                          -- Home description text
  home_more VARCHAR(255) NOT NULL,                         -- Home "Learn More" button text
  about_image VARCHAR(255) NOT NULL,                       -- About image URL
  about_title VARCHAR(255) NOT NULL,                       -- About title text
  about_description TEXT NOT NULL,                         -- About description text
  about_link VARCHAR(255) NOT NULL,                        -- About link URL
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,         -- Timestamp for record creation
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP          -- Timestamp for record updates
);

--Event Page Table
CREATE TABLE event (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),               
  event_title VARCHAR(255) NOT NULL,    
  event_description TEXT NOT NULL,     
  event_time TIME,                    
  event_date DATE,                     
  event_location VARCHAR(255),         
  event_image VARCHAR(255),            
  created_at TIMESTAMP DEFAULT NOW(),  
  updated_at TIMESTAMP DEFAULT NOW()   
);

--Announcement Page Table
CREATE TABLE announcement ( 
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  announcement_content TEXT NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

--Notification Table
CREATE TABLE notification (
  notification_id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id uuid REFERENCES users(user_id) ON DELETE CASCADE,
  notification_content VARCHAR(255) NOT NULL,
  status VARCHAR(255) NOT NULL DEFAULT 'unread',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Auto-incrementing primary key
-- Auto-incrementing primary key
-- Event title
-- Event description
-- Event time
-- Event date
-- Event location
-- Timestamp for when the event was created
-- Timestamp for when the event was last updated

-- Path to event image (nullable if no image)
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






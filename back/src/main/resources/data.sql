INSERT INTO TEACHERS (first_name, last_name) VALUES
('Margot', 'DELAHAYE'),
('Hélène', 'THIERCELIN');

INSERT INTO USERS (first_name, last_name, admin, email, password) VALUES
('Admin', 'Admin', true, 'yoga@studio.com', '$2a$10$LYzbb0GeSeFlPGE6/P7VP.Mna4Nk6c4w2viRvOB6b2ymL8axat6uG'),
('wass', 'wass', false, 'wass@gmail.com', '$2a$10$LYzbb0GeSeFlPGE6/P7VP.Mna4Nk6c4w2viRvOB6b2ymL8axat6uG');

INSERT INTO SESSIONS (name, description, date, teacher_id, created_at, updated_at) VALUES
('Session1', 'Session1 description', CURRENT_TIMESTAMP, 1, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP);

INSERT INTO PARTICIPATE (user_id, session_id) VALUES
(1, 1); 
CREATE TABLE guests(
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    verificationCode VARCHAR(255) NOT NULL,
    signedAt timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
    isCheckedIN boolean NOT NULL DEFAULT false
);
CREATE TABLE students(
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    studentId integer NOT NULL,
    signedAt timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
    isCheckedIN boolean NOT NULL DEFAULT false
);


TEST:
INSERT INTO students(name, studentId, signedAt, isCheckedIN) VALUES('Samet', 581207, CURRENT_TIMESTAMP, false);
INSERT INTO guests(name, verificationCode, signedAt, isCheckedIN) VALUES('Samet', 10022, CURRENT_TIMESTAMP, false);
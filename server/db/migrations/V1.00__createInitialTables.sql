CREATE TABLE user_multiplier (
    id INT PRIMARY KEY IDENTITY (1,1),
    arms DECIMAL(4,3) DEFAULT 1.000,
    legs DECIMAL(4,3) DEFAULT 1.000,
    chest DECIMAL(4,3) DEFAULT 1.000,
    back DECIMAL(5,3) DEFAULT 1.000
);

CREATE TABLE major_muscle_group (
    id INT PRIMARY KEY IDENTITY (1,1),
    name VARCHAR(50)
);

CREATE TABLE user_profile (
    id INT PRIMARY KEY IDENTITY (1,1),
    name VARCHAR(50),
    email VARCHAR(50),
    user_multiplier_id INT,
    FOREIGN KEY (user_multiplier_id) REFERENCES user_multiplier (id)
);

CREATE TABLE exercise (
    id INT PRIMARY KEY IDENTITY (1,1),
    name VARCHAR(50),
    description VARCHAR(250),
    std_reps INT,
    std_reps_time_sec INT,
    major_muscle_group_id INT,
    FOREIGN KEY (major_muscle_group_id) REFERENCES major_muscle_group (id)
);

CREATE TABLE user_workout_pref (
    id INT PRIMARY KEY IDENTITY (1,1)
);

CREATE TABLE user_multiplier (
    id INT PRIMARY KEY IDENTITY (1,1)
);

CREATE TABLE gender (
    id INT PRIMARY KEY IDENTITY (1,1),
    gender_name VARCHAR (50)
);

CREATE TABLE user_profile (
    id INT PRIMARY KEY IDENTITY (1,1),
    real_name VARCHAR (50),
    user_name VARCHAR (50),
    email VARCHAR (50),
    age INT,
    user_weight DECIMAL (5,2),
    height DECIMAL (5,2),
    gender_id INT,
    user_multiplier_id INT,
    user_workout_pref_id INT,
    FOREIGN KEY (gender_id) REFERENCES gender (id),
    FOREIGN KEY (user_multiplier_id) REFERENCES user_multiplier (id),
    FOREIGN KEY (user_workout_pref_id) REFERENCES user_workout_pref (id)
);
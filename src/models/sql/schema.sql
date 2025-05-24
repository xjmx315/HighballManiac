CREATE TABLE IF NOT EXISTS users (
    id INT AUTO_INCREMENT PRIMARY KEY, 
    email VARCHAR(127), 
    password VARCHAR(225) NOT NULL, 
    name VARCHAR(127) NOT NULL UNIQUE, 
    created_at DATETIME NOT NULL
);

CREATE TABLE IF NOT EXISTS items (
    id INT AUTO_INCREMENT PRIMARY KEY, 
    name VARCHAR(127), 
    description VARCHAR(225), 
    image VARCHAR(225)
);

CREATE TABLE IF NOT EXISTS recipes (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT,
    name VARCHAR(127),
    description VARCHAR(511),
    image VARCHAR(225),
    alcohol_percentage FLOAT,
    created_at DATETIME,
);

CREATE TABLE IF NOT EXISTS tags (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(64)
);

CREATE TABLE IF NOT EXISTS recipe_tags (
    recipe_id INT,
    tag_id INT,
    PRIMARY KEY (recipe_id, tag_id)
);

CREATE TABLE IF NOT EXISTS steps (
    id INT AUTO_INCREMENT PRIMARY KEY,
    recipe_id INT,
    description VARCHAR(511),
    image VARCHAR(225),
    step_number INT
);

CREATE TABLE IF NOT EXISTS steps_items (
    setp_id INT,
    item_id INT
);

CREATE TABLE IF NOT EXISTS recipes_items (
    recipe_id INT, 
    item_id INT
);
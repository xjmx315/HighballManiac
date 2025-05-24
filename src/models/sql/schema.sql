CREATE TABLE IF NOT EXISTS users (
    id INT AUTO_INCREMENT PRIMARY KEY, 
    email VARCHAR(127), 
    password VARCHAR(225) NOT NULL, 
    name VARCHAR(127) NOT NULL UNIQUE, 
    created_at DATETIME NOT NULL
);

CREATE TABLE IF NOT EXISTS items (
    id INT AUTO_INCREMENT PRIMARY KEY, 
    name VARCHAR(127) UNIQUE, 
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

    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    INDEX (alcohol_percentage)
);

CREATE TABLE IF NOT EXISTS tags (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(64)
);

CREATE TABLE IF NOT EXISTS recipe_tags (
    recipe_id INT,
    tag_id INT,
    PRIMARY KEY (recipe_id, tag_id),

    FOREIGN KEY (recipe_id) REFERENCES recipes(id) ON DELETE CASCADE,
    FOREIGN KEY (tag_id) REFERENCES tags(id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS steps (
    id INT AUTO_INCREMENT PRIMARY KEY,
    recipe_id INT,
    description VARCHAR(511),
    image VARCHAR(225),
    step_number INT,

    FOREIGN KEY (recipe_id) REFERENCES recipes(id) ON DELETE CASCADE,
    INDEX (recipe_id, step_number)
);

CREATE TABLE IF NOT EXISTS recipes_items (
    recipe_id INT, 
    item_id INT

    FOREIGN KEY (recipe_id) REFERENCES recipes(id) ON DELETE CASCADE,
    FOREIGN KEY (item_id) REFERENCES items(id) ON DELETE CASCADE
);
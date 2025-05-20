CREATE TABLE IF NOT EXISTS users (
    id int auto_increment primary key, 
    email varchar(127), 
    password varchar(225) not null, 
    name varchar(127) not null unique, 
    created_at datetime not null
);

CREATE TABLE IF NOT EXISTS items (
    id int auto_increment primary key, 
    name varchar(127), 
    description varchar(225), 
    image varchar(225)
);

CREATE TABLE IF NOT EXISTS recipes (
    id int auto_increment primary key,
    user_id int,
    name varchar(127),
    description varchar(511),
    image varchar(225),
    alcohol_percentage float,
    created_at datetime,
);

CREATE TABLE IF NOT EXISTS tags (
    id int auto_increment primary key,
    name varchar(64)
);

CREATE TABLE IF NOT EXISTS recipe_tags (
    recipe_id int,
    tag_id int,
    primary key (recipe_id, tag_id)
);

CREATE TABLE IF NOT EXISTS steps (
    id int auto_increment primary key,
    recipe_id int,
    description varchar(511),
    image varchar(225),
    step_number int
);

CREATE TABLE IF NOT EXISTS steps_items (
    setp_id int,
    item_id int
);

CREATE TABLE IF NOT EXISTS recipes_items (
    recipe_id int, 
    item_id int
);
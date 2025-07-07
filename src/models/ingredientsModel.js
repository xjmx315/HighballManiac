//ingredientsModel.js

import db from './db.js';

const newIngredient = async ({name, description, image}) => {
    const result = await db.execute(
        'INSERT INTO ingredients (name, description, image) VALUES (?, ?, ?)',
        [name, description, image]
    );
    return result;
}
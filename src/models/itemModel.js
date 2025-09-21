//itemModel.js

import {getPool} from './db.js';
const db = getPool();

const getItems = async () => {
    const [results] = await db.query('SELECT * FROM items');
    return results;
};

const searchItemByName = async (searchTerm) => {
    const [results] = await db.query('SELECT * FROM items WHERE name LIKE ?', [`%${searchTerm}%`]);
    return results;
};

export default {
    getItems,
    searchItemByName
};

/*콜백 기반 쿼리
app.get('/items', (req, res) => {
    db.query('SELECT * FROM items', (err, result) => {
        if (err){
            console.error('쿼리 오류: ', err);
            res.status(500).send('서버 오류 - 쿼리 오류');
            return;
        }
        res.json(result);
    });
});
*/

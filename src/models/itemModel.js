//itemModel.js

import db from './db.js';

const getItems = async () => {
    try{
        const [results] = await db.query('SELECT * FROM items');
        return results;
    }
    catch(err){
        console.error('쿼리 실패: ', err);
        return err;
    }
};

export default {getItems: getItems};

/*
app.get('/items', (req, res) => {
    db.query('SELECT * FROM items', (err, result) => {
        if (err){
            console.error('쿼리 오류: ', err);
            res.status(500).send('서버 오류 - 쿼리 오류');
            return;
        }
        res.json(result);
    })
});
*/
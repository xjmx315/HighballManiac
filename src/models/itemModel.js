//itemModel.js

import db from './db';

exports.getItems = async () => {
    return db.query('SELECT * FROM items', (err, result) => {
        if (err){
            console.error('쿼리 오류: ', err);
        }
        return result;
    });
};

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
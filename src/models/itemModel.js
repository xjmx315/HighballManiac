//itemModel.js

//import getItems from '../services/itemService';
import db from './db.js';

const getItems = async () => {
    return db.query('SELECT * FROM items', (err, result) => {
        if (err){
            console.error('쿼리 오류: ', err);
        }
        return result;
    });
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
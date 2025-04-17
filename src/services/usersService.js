//usersService.js
import users from '../models/users.js';

const getIdByName = (name) => {
    return users.getIdByName(name);
};

const createUser = (userData) => {
    
};

export default {
    getIdByName: getIdByName
}
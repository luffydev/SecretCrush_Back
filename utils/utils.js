async function hashPassword(password){
    
    const bcrypt = require('bcrypt');
    const saltRound = 10;

    const hashedPassword = await bcrypt.hash(password, saltRound);

    return hashedPassword;
}


module.exports = {
    hashPassword
}
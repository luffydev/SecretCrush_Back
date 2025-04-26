const axios = require('axios');
const {RECAPTCHA_SERVER_TOKEN} = require('./../config/config');

async function verifyRecaptcha(token){
    try{
        const response = await axios.post('https://www.google.com/recaptcha/api/siteverify',
            new URLSearchParams({
                secret: RECAPTCHA_SERVER_TOKEN,
                response: token,
            }),
        );

        const data = response.data;

        if(!data.success || data.score < 0.5)
            return false;

        return true;

    }catch(error){
        console.error('[Server] -> Recaptcha Error : ', error);
        return false;
    }
}

async function hashPassword(password){
    
    const bcrypt = require('bcrypt');
    const saltRound = 10;

    const hashedPassword = await bcrypt.hash(password, saltRound);

    return hashedPassword;
}


module.exports = {
    hashPassword,
    verifyRecaptcha
}
const axios = require('axios');
const {RECAPTCHA_SERVER_TOKEN, SECRETCRUSH_URL} = require('./../config/config');
const fs = require('fs');
const path = require('path');


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


function generateRandomString(length = 40) {
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let result = '';
    const charactersLength = characters.length;
    for (let i = 0; i < length; i++) {
      result += characters.charAt(Math.floor(Math.random() * charactersLength));
    }
    return result;
}

async function sendMail(subject, to, template, token, from = '"SecretCrush" <sc@liliumnetwork.fr>') {

    let html = fs.readFileSync(path.join(__dirname, '../template/email/' + template), 'utf8');
    const activationLink = SECRETCRUSH_URL + '/login?activate=' + token;

    html = html.replace('{{activation_link}}', activationLink);

    console.log("SENDING MAIL TO : ", to, " FROM : ", from, " SUBJECT : " + subject, " HTML LEN : " + html.length)

    await smtp.sendMail({
        from: from,
        to: to,
        subject: subject,
        html: html,
    });
}


module.exports = {
    hashPassword,
    verifyRecaptcha,
    generateRandomString,  
    sendMail  
}
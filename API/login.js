const userModel = require('./../ORM/models/user');
const {hashPassword} = require('./../utils/utils');
const bcrypt = require('bcrypt');

app.post('/account/login', csrfProtection, async (request, ressource) => {

    // incomplete form return bad request
    if(!('email' in request.body) || !('password' in request.body)){
        ressource.status(400).json({success: false, error : "bad_request"});
        return;
    }

    let email = request.body.email;
    let password = request.body.password;

    const User = userModel(database, Sequelize.DataTypes);

    const findedUser = await User.findOne({where : { email: email}});

    if(!findedUser)
        return ressource.status(404).json({success: false, error: 'invalid_email_password'});

    const isPasswordValid = await bcrypt.compare(password, findedUser.password);

    console.log(isPasswordValid);

    if(!isPasswordValid)
        return ressource.status(404).json({success: false, error: 'invalid_email_password'});
    


    // user logged in update last_login
    

    /*console.log("EMAIL : ", email);
    console.log("PASSWORD : ", password);

    let payload = {
        email : email,
        user_id : 1234
    }

    const jwt = require('jsonwebtoken');
    const { PRIVATE_KEY } = require('./../config/config');

    const token = jwt.sign(payload, PRIVATE_KEY, {algorithm: 'RS256', expiresIn:'1h'});

    return ressource.json({
        success: true,
        message: 'Login successful',
        token: token,  // Le JWT envoyé au frontend
    });*/
})
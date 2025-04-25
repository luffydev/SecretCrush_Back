const userModel = require('./../ORM/models/user');
const {hashPassword} = require('./../utils/utils');
const bcrypt = require('bcrypt');

app.post('/account/login', csrfProtection, async (request, ressource) => {

    // incomplete form return bad request
    if(!('email' in request.body) || !('password' in request.body)){
        ressource.status(400).json({success: false, error : "bad_request"});
        return;
    }

    console.log(request.cleanedIp);

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
    findedUser.last_login = new Date();
    findedUser.save();

    let jwtPayload = {
        email: email,
        user_id: findedUser.id,
        remote_addr: request.cleanedIp
    };

    const jwt = require('jsonwebtoken');
    const {PRIVATE_KEY} = require('./../config/config');

    const token = jwt.sign(jwtPayload, PRIVATE_KEY, {algorithm: 'RS256', expiresIn:'24h'});

    return ressource.status(200).json({success: true, token, token});
})
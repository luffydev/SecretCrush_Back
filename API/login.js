const userModel = require('./../ORM/models/users');
const bcrypt = require('bcrypt');
const { ENABLE_SSL } = require('./../config/config');


app.post('/account/check_session', csrfProtection, async(request, ressource) => {

    if(!('token' in request.body))
        return ressource.json({success: false, error:'bad_request'});

    const token = request.body.token;

    const jwt = require('jsonwebtoken');
    const {PUBLIC_KEY} = require('./../config/config');

    try{

        const decoded = jwt.verify(token, PUBLIC_KEY, {algorithm: 'RS256'});
        return ressource.json({success: true});

    }catch (error) {
    
        console.error("Erreur de validation du token:", error.message);  // Afficher le message d'erreur
        return ressource.json({ success: false, error: error.message });
    }
});

app.post('/account/login', csrfProtection, async (request, ressource) => {

    // incomplete form return bad request
    if(!('email' in request.body) || !('password' in request.body)){
        ressource.json({success: false, error : "bad_request"});
        return;
    }

    let email = request.body.email;
    let password = request.body.password;

    const User = userModel(database, Sequelize.DataTypes);

    const findedUser = await User.findOne({where : { email: email}});

    if(!findedUser)
        return ressource.json({success: false, error: 'invalid_email_password'});

    const isPasswordValid = await bcrypt.compare(password, findedUser.password);

    if(!isPasswordValid)
        return ressource.json({success: false, error: 'invalid_email_password'});
    

    if(!findedUser.is_activated)
        return ressource.json({success: false, error: 'not_activated_account'});

    // user logged in update last_login
    findedUser.last_login = new Date();
    findedUser.last_ip = request.cleanedIp;

    findedUser.save();

    let jwtPayload = {
        email: email,
        user_id: findedUser.id,
        remote_addr: request.cleanedIp
    };

    const jwt = require('jsonwebtoken');
    const {PRIVATE_KEY} = require('./../config/config');

    const token = jwt.sign(jwtPayload, PRIVATE_KEY, {algorithm: 'RS256', expiresIn:'24h'});

    ressource.cookie('auth_token', token, {
        httpOnly: false,
        secure: ENABLE_SSL, 
        maxAge: 86400000,  // durée de 24h ( a changer si il sauvegarde sa session )
        sameSite: 'Strict', // Protection contre les attaques CSRF
    })

    return ressource.status(200).json({success: true, token, token});
})
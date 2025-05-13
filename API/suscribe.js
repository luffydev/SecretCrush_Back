const { Sequelize } = require('sequelize');
const userModel = require('./../ORM/models/users');
const validator = require('validator');
const {verifyRecaptcha, hashPassword, generateRandomString, sendMail} = require('./../utils/utils');

// send form, for register a new account
app.post('/account/signup', csrfProtection, async (request, ressource) => {
    

    const requiredField = ['email', 'password', 'firstname', 'gender', 'birthDate', 'latitude', 'longitude', 'orientation', 'relations'];
    const acceptedGender = ['Homme', 'Femme', 'Non-binaire', 'Transgenre', 'Autre'];
    const acceptedOrientation = ['Hétérosexuel', 'Bisexuel', 'Gay'];
    const acceptedRelations = ['Une rencontre sans lendemain', 'Un·e partenaire régulier·e', 'Je ne sais pas encore', 'Une relation sérieuse', 'Un trouple'];

    const missingFields = requiredField.filter(field => !request.body.hasOwnProperty(field));

    if(!('token' in request.body))
        return ressource.json({success: false, error: 'error_missing_token'});

    const isTokenValid = await verifyRecaptcha(request.body.token);

    if(!isTokenValid)
        return ressource.json({success: false, error: 'invalid_recaptcha_token'});

    if(missingFields.length > 0)
        return ressource.json({success: false, error: 'error_missing_field'});

    // we check orientation not empty
    if (!Array.isArray(request.body.orientation) || request.body.orientation.length === 0)
        return ressource.json({ success: false, error: 'invalid_orientation_field' });

    
    // we check relations not empty
    if(!Array.isArray(request.body.relations) || request.body.relations.length == 0)
        return ressource.json({success: false, error: 'invalid_relations_field'});

    const payload = {
        email: request.body.email,
        password: request.body.password,
        firstname: request.body.firstname,
        gender: request.body.gender,
        birth_date: new Date(request.body.birthDate * 1000),
        latitude: request.body.latitude,
        longitude: request.body.longitude,
        sexual_orientation: request.body.orientation,
        relations: request.body.relations,
        last_ip: request.cleanedIp
    }

    // we check if email is valid
    if(!validator.isEmail(payload.email))
        return ressource.json({success: false, error: 'invalid_email'});

    const User = userModel(database, Sequelize.DataTypes);
    const findedUser = await User.findOne({where: {email: payload.email}});

    if(findedUser)
        return ressource.json({success: false, error: 'email_already_exist'});

    const isValidPassword = validator.isStrongPassword(payload.password,
    {
          minLength: 8,
          minLowercase: 1,
          minUppercase: 1,
          minNumbers: 1,
          minSymbols: 1
    });

    // we check if password is valid !
    if(!isValidPassword)
        return ressource.json({success: false, error: 'invalid_password'});

    // we check if gender exist in acceptedGender list
    if(!acceptedGender.includes(payload.gender))
        return ressource.json({success: false, error: 'invalid_gender'});

    if(acceptedOrientation.includes(payload.sexual_orientation))
        return ressource.json({success: false, error: 'invalid_orientation'});

    const allRelationsValid = payload.relations.every(relation => acceptedRelations.includes(relation));

    if(!allRelationsValid)
        return ressource.json({success: false, error: 'invalid_selected_relations'});

    // we hash our password
    payload.password = await hashPassword(payload.password);
    payload.activation_token = generateRandomString();

    //sendMail('Activation de ton compte SecretCrush !', payload.email, 'activation.html', payload.activation_token);

    const user = await User.create(payload);
    return ressource.json({success: true, debug_activation_code:payload.activation_token});
});

app.post('/account/activate', csrfProtection, async (request, ressource) => {

    if(!('token' in request.body))
        return ressource.json({success: false, error: 'bad_request'});

    let token = request.body.token;
    
    const User = userModel(database, Sequelize.DataTypes);
    const findedUser = await User.findOne({where: {activation_token : token, is_activated: false}});

    if(!findedUser)
        return ressource.json({success: false, error: 'invalid_token'});

    findedUser.is_activated = true;
    findedUser.save();

    return ressource.json({success: true});
});

// check if email exist in database
app.post('/account/checkEmail', csrfProtection, async (request, ressource) => {

    if(!('email' in request.body))
        return ressource.json({success: false, error: 'bad_request'});

    let email = request.body.email;

    if(!validator.isEmail(email))
        return ressource.json({success: false, error: 'invalid_email'});

    const User = userModel(database, Sequelize.DataTypes);
    const findedUser = await User.findOne({where: {email: email}});

    if(!findedUser)
        return ressource.json({success: true});

    return ressource.json({success: false, error: 'email_already_exist'});

});

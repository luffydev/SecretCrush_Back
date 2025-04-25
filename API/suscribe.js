const userModel = require('./../ORM/models/user');
const {hashPassword} = require('./../utils/utils');

// send form, for register a new account
app.post('/account/signup', csrfProtection, (request, ressource) => {

});

// check if email exist in database
app.post('/account/checkEmail', csrfProtection, (request, ressource) => {

});

// send form for checking if name is available or no ( not used ATM )
app.post('/account/signup/checkLoginAvailable', (request, ressource) => {

});
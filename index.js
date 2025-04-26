const express = require('express');
const fs = require('fs');
const jwt = require('jsonwebtoken');
const csrf = require('csurf');
const cookieParser = require('cookie-parser');
const cors = require('cors');
const { Sequelize } = require('sequelize'); 

const { SERVER_PORT, API_KEY, ENABLE_SSL, CORS_POLICY_ORIGIN, DATABASE_CONFIG, SSL_CERTIFICATE, SSL_PRIVATE_KEY } = require('./config/config');
const ignoreJWT = ['/account/signup', '/csrf-token', '/account/login', '/account/checkEmail'];

// Connecting to DB

console.log('[Database] -> connecting to ', DATABASE_CONFIG.host, ':', DATABASE_CONFIG.port, ' on database : ', DATABASE_CONFIG.database);

global.database = new Sequelize(DATABASE_CONFIG.database, DATABASE_CONFIG.user, DATABASE_CONFIG.password, {
    host: DATABASE_CONFIG.host,
    dialect: 'postgres',
    logging: false,  // Désactive les logs des requêtes SQL
});

database.authenticate().then(async () => {
    
    database.sync({ force: false }).then(() => {
        console.log('[Database] -> database and ORM models are synchronized');
      }).catch((err) => {
        console.error('[Database] -> database synchronisation error : ', err);
        process.exit(1);
      });

    console.log('[Database] -> connected ! ');
    global.Sequelize = Sequelize;

}).catch((err) => {
    console.log('[Database] -> unable to connect : ', err);
    process.exit(1);
})

global.csrfProtection = csrf({
    cookie: true,  // Utiliser les cookies
    ignoreMethods: ['GET', 'HEAD', 'OPTIONS'],  // Ne pas vérifier ces méthodes
    value: (req) => {
      if (req.headers['csrf-token']) 
        return req.headers['csrf-token'];
    }
  });

global.app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.set('trust proxy', true);

app.use(cors({
    origin: function (origin, callback) {
        if (CORS_POLICY_ORIGIN.indexOf(origin) !== -1) {
            callback(null, true); // L'origine est autorisée
        } else {
            callback(new Error('Non autorisé par CORS'), false); // L'origine n'est pas autorisée
        }
    },
    methods: ['GET', 'POST', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'x-api-key', 'Authorization', 'csrf-token'],
    credentials: true,
}));

// middleware, here we check API auth and other stuff ...   
app.use((request, ressource, next) => {

    // we check base api key
     if(!('x-api-key' in request.headers) || request.headers['x-api-key'] != API_KEY){
        ressource.status(400).json({success: false, error: 'invalid_base_api_key'});
        return;
     }

     // TODO check JWT Token

     // Request methods you wish to allow
     ressource.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');
 
     // Request headers you wish to allow
     ressource.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type');
 
     // Set to true if you need the website to include cookies in the requests sent
     // to the API (e.g. in case you use sessions)
     ressource.setHeader('Access-Control-Allow-Credentials', true);

     // Récupérer l'IP de l'utilisateur
    let userIp = request.ip;

    // Si l'IP est de la forme ::ffff:127.0.0.1, on enlève le préfixe ::ffff:
    if (userIp.startsWith('::ffff:')) {
        userIp = userIp.substring(7); // Enlever "::ffff:"
    }

    console.log('[Server] -> Recv request : ' + request.path);

    // Attacher l'IP nettoyée à l'objet de requête
    request.cleanedIp = userIp;

     if (ignoreJWT.indexOf(request.path) !== -1)
        next();
     else
     {

     }
});

fs.readdir(__dirname + '/API', (err, files) => {
    files.forEach(file => {

        console.log("[Server] -> LOAD API : " + file);
        require(__dirname + '/API/' + file);

    });
});

// TODO : Launch as SSL Server

if(!ENABLE_SSL)
{
    const http = require('http');
    httpServer = http.createServer(app);
}
else
{
    const https = require('https');
    const credentials = {key : SSL_PRIVATE_KEY, cert: SSL_CERTIFICATE};
    httpServer = https.createServer(credentials, app);
}

httpServer.listen(SERVER_PORT);
console.log(" \r\n[Server] -> Launched on port : ", SERVER_PORT);

module.exports = app;

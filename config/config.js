const fs = require('fs');
const path = require('path');


const API_ROUTE_PREFIX = '';
const PRIVATE_KEY = fs.readFileSync(path.join(__dirname, '../keys/private.key'), 'utf8');
const PUBLIC_KEY = fs.readFileSync(path.join(__dirname, '../keys/public.key'), 'utf8');
const API_KEY   = 'c3bc7d56-e96c-4e00-ae5a-cfb74fb5a2a2';
const ENABLE_SSL = false;
const CORS_POLICY_ORIGIN = ['https://secretcrush.fr', 'http://127.0.0.1:3000'];
const SECRETCRUSH_URL = "http://127.0.0.1";
const RECAPTCHA_SERVER_TOKEN = '6LffUyUrAAAAAL51qzuGuWO98p-xz5YvN7mp4QTY';

const SSL_PRIVATE_KEY = fs.readFileSync(path.join(__dirname, '../ssl/private.key'), 'utf8');
const SSL_CERTIFICATE = fs.readFileSync(path.join(__dirname, '../ssl/certificate.crt'), 'utf8');

const DATABASE_CONFIG = {
    host: "127.0.0.1",
    user: "luffydev",
    password:"luffydev",
    port:5432,
    database:"secretcrush"
}

const SMTP_CONFIG = {
    host:'ssl0.ovh.net',
    port: 465,
    auth:{
      user: 'sc@liliumnetwork.fr',
      pass: 'Client145!$!$!$'
    }
}

const SERVER_PORT = 3001;

module.exports = {
  PRIVATE_KEY,
  PUBLIC_KEY, 
  SERVER_PORT, 
  API_KEY,
  ENABLE_SSL,
  CORS_POLICY_ORIGIN,
  DATABASE_CONFIG,
  SSL_PRIVATE_KEY,
  SSL_CERTIFICATE,
  RECAPTCHA_SERVER_TOKEN, 
  SMTP_CONFIG,
  SECRETCRUSH_URL
};
const fs = require('fs');
const path = require('path');


const API_ROUTE_PREFIX = '';
const PRIVATE_KEY = fs.readFileSync(path.join(__dirname, '../keys/private.key'), 'utf8');
const PUBLIC_KEY = fs.readFileSync(path.join(__dirname, '../keys/public.key'), 'utf8');
const API_KEY   = 'c3bc7d56-e96c-4e00-ae5a-cfb74fb5a2a2';
const ENABLE_SSL = false;
const CORS_POLICY_ORIGIN = ['https://secretcrush.fr', 'http://127.0.0.1:3000'];

const DATABASE_CONFIG = {
    host: "127.0.0.1",
    user: "luffydev",
    password:"luffydev",
    port:5432,
    database:"secretcrush"
}

const SERVER_PORT = 3001;

module.exports = {
  PRIVATE_KEY,
  PUBLIC_KEY, 
  SERVER_PORT, 
  API_KEY,
  ENABLE_SSL,
  CORS_POLICY_ORIGIN,
  DATABASE_CONFIG
};
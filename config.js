var config = {}

config.apiUrl = '//24fin-api.azurewebsites.net';
config.apiPostUrl = '24fin-api.azurewebsites.net';
config.refererUrl = 'https://24fin-backend.azurewebsites.net';
config.loginUrl = 'https://24fin-auth.azurewebsites.net/lock';

config.crypto = {};
config.crypto.algorithm = 'aes256';
config.crypto.password = '24FIN';

config.cookie = {};
config.cookie.password = '24FIN';
config.cookie.expire = 86400000*365; //365 Day (1000*3600*24)

module.exports = config;
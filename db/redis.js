var redis = require("redis");
var client = redis.createClient({"host": "redis"}); // "redis" <- docker container // <- locally need to start redis
const { promisify } = require("util");

const getAsync = promisify(client.get).bind(client);
const setAsync = promisify(client.set).bind(client);
const delAsync = promisify(client.del).bind(client);
const expAsync = promisify(client.expire).bind(client);
const scanAsync = promisify(client.scan).bind(client);

module.exports.getAsync = getAsync;
module.exports.setAsync = setAsync;
module.exports.delAsync = delAsync;
module.exports.expAsync = expAsync;
module.exports.scanAsync = scanAsync;
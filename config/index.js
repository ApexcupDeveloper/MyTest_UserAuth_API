const { CONFIG_PROD } = require("./config.prod");
const { CONFIG_DEV } = require("./config.dev");

const CONFIG = process.env.NODE_ENV  === 'production' ? CONFIG_PROD : CONFIG_DEV;

module.exports = {
    CONFIG
};
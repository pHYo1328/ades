const config = require('../config/config');
const SibApiV3Sdk = require('sib-api-v3-sdk');

SibApiV3Sdk.ApiClient.instance.authentications['api-key'].apiKey =
  config.sendinblue_api;

module.exports = new SibApiV3Sdk.TransactionalEmailsApi();

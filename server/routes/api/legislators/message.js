/**
 * Handles posting one or more new message via POTC.
 */

var async = require('async');
var map = require('lodash.map');
var partial = require('lodash.partial');

var apiHelpers = require('../helpers/api');
var models = require('../../../../models');
var potc = require('../../../services/third-party-apis/potc');
var potcHelpers = require('../helpers/potc');
var resHelpers = require('../helpers/response');
const {google} = require('googleapis');

var crypto = require('crypto');

var post = function (req, res) {
  var messages = apiHelpers.getModelData(req.body, models.Message);

  const values = map(messages, function(message) {
    const { sender, canonicalAddress } = message
    return [
      `${sender.namePrefix} ${sender.firstName} ${sender.lastName}`,
      sender.phone,
      sender.email,
      canonicalAddress.address,
      canonicalAddress.county,
      canonicalAddress.district,
      message.bioguideId,
      message.topic,
      message.subject,
      message.message
    ]
  })

  const query = {
    spreadsheetId: '1n8A9MYUAP3cROKZDaVZkBPqpn0Y4bXRyPN5wZDVOKL4',
    insertDataOption: 'INSERT_ROWS',
    valueInputOption: 'RAW',
    range: 'Sheet1!A:J',
    requestBody: {
      values
    }
  }

  const oauth2Client = new google.auth.OAuth2(
    process.env.GOOGLE_API_CLIENT_ID || req.app.locals.CONFIG.get('CREDENTIALS.GOOGLE_API.CLIENT_ID'),
    process.env.GOOGLE_API_SECRET_KEY || req.app.locals.CONFIG.get('CREDENTIALS.GOOGLE_API.SECRET_KEY'),
    'http://localhost'
  );

  const token =  {
    access_token: process.env.GOOGLE_API_ACCESS_TOKEN || req.app.locals.CONFIG.get('CREDENTIALS.GOOGLE_API.ACCESS_TOKEN'),
    refresh_token: process.env.GOOGLE_API_REFRESH_TOKEN || req.app.locals.CONFIG.get('CREDENTIALS.GOOGLE_API.REFRESH_TOKEN'),
    scope: ["https://www.googleapis.com/auth/spreadsheets"],
    expires_in: 1512516678
  }

  oauth2Client.setCredentials(token);

  const sheets = google.sheets({
    version: 'v4',
    auth: oauth2Client
  });

  sheets.spreadsheets.values.append(query).then((value) => {
    console.log('Appended to sheet')
  }, (err) => {
    console.log(`Sheet error: ${err}`)
  })

  var potcMessages = map(messages, function(message) {
    var tag = req.app.locals.CONFIG.get('CAMPAIGNS.DEFAULT_TAG');
    tag += '-' + crypto.randomBytes(16).toString('hex');
    return potcHelpers.makePOTCMessage(message, tag);
  });

  var onComplete = function(err, data) {
    if (err)
      return res.status(400).json(resHelpers.makeError(err));

    var modelData = map(data, function(res) {
      return new models.MessageResponse(res);
    });
    res.json(resHelpers.makeResponse(modelData));
  };

  async.parallel(map(potcMessages, function(message) {
    return function(cb) {
      potc.sendMessage(message, req.app.locals.CONFIG, function(err, res) {
        res.bioguideId = message['bio_id'];
        cb(err, res);
      });
    };
  }), onComplete);
};


module.exports.post = post;

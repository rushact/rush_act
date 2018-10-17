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

const oauth2Client = new google.auth.OAuth2(
  '233973318239-vjqqtsp9gurpl05ip7vhikma91vr2dgl.apps.googleusercontent.com',
  'uKxoFG-pCuoOrlUKVp6aA_i8',
  'http://localhost'
);

const token =  {
  access_token: 'ya29.GlwaBYQhARVMnBqKP3yrnFV3swf7Rk-SYrg3uh-Dwfj6IcdjaiGGK7ZScmerP5KpAwz2p_r6OsQtLgpDGG8krU1zx7vOXmvzMwQU_-_kHDR5JIWXPXKQoHhaPrelvw',
  refresh_token: '1/eZHcyG-7g2reQBlkZsb0_c6W8lwCtKGtOBvzPaZcew4',
  scope: ["https://www.googleapis.com/auth/spreadsheets"],
  expires_in: 1512516678
}

oauth2Client.setCredentials(token);

var post = function (req, res) {
  const sheets = google.sheets({
    version: 'v4',
    auth: oauth2Client
  });
  // sheets.spreadsheets.get({ spreadsheetId: '1n8A9MYUAP3cROKZDaVZkBPqpn0Y4bXRyPN5wZDVOKL4', includeGridData: true }).then((value) => {
  //   debugger;
  //   console.log(`Sheet: ${JSON.stringify(value.data)}`)
  // }, (err) => {
  //   debugger;
  //   console.log(`Sheet error: ${err}`)
  // })
  const query = {
    spreadsheetId: '1n8A9MYUAP3cROKZDaVZkBPqpn0Y4bXRyPN5wZDVOKL4',
    insertDataOption: 'INSERT_ROWS',
    valueInputOption: 'RAW',
    range: 'Sheet1!A:C',
    requestBody: {
      values: [
        [ 'a' , 'b' , 'c' ]
      ]
    }
  }
  sheets.spreadsheets.values.append(query).then((value) => {
    debugger;
  }, (err) => {
    debugger;
    console.log(`Sheet error: ${err}`)
  })

  console.log('hit the post route /api/1/legislators/message');
  var messages = apiHelpers.getModelData(req.body, models.Message);
  var potcMessages = map(messages, function(message) {
    var tag = req.app.locals.CONFIG.get('CAMPAIGNS.DEFAULT_TAG');
    tag += '-' + crypto.randomBytes(16).toString('hex');
    return potcHelpers.makePOTCMessage(message, tag);
  });

  var onComplete = function(err, data) {
    console.log('callback to the callback to the message')
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
        console.log('callback to the message');
        res.bioguideId = message['bio_id'];
        cb(err, res);
      });
    };
  }), onComplete);
};


module.exports.post = post;

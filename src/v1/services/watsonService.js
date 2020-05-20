const watson = require('ibm-watson/assistant/v1');
const { IamAuthenticator } = require('ibm-watson/auth');
const assistantWorkspaceId = process.env.ASSISTANT_WORKSPACE_ID;

const assistant = new watson({
  version: '2020-05-13',
  authenticator: new IamAuthenticator({
    apikey: process.env.ASSISTANT_IAM_APIKEY,
  }),
  url: process.env.ASSISTANT_URL,
  workspaceId: assistantWorkspaceId
});

exports.getMessage = messageSendToWatson =>
  new Promise((resolve, reject) => {
    assistant.message(
      {
        workspaceId: assistantWorkspaceId,
        input: { text: messageSendToWatson }
      },
      function(err, response) {
        if (err) {
          console.log(err);
          reject(err);
        } else {
          resolve(response);
        }
      }
    );
  });
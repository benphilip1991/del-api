/* This module kicks in if no Botkit Studio token has been provided */


module.exports = function(controller) {
  const getMessage = require('../services/watsonService').getMessage;

    controller.on('hello', conductOnboarding);
    controller.on('welcome_back', conductOnboarding);

    function conductOnboarding(bot, message) {

      console.log(message.type, message.user)
      console.log(message.text)

      bot.startConversation(message, function(err, convo) {

        convo.say({
          text: 'Hi, this is DEL Chatbot. You can ask me questions.'
        });
      });

    }

  // Use this if using botkit-middleware-watson
  /*const { WatsonMiddleware } = require('botkit-middleware-watson');

  const watsonMiddleware = new WatsonMiddleware({
    iam_apikey: 'dNKhxcXesXFQ8IQQxMo_cTJ_HMkneJxfqVrChxgwudS7',
    url: 'https://api.au-syd.assistant.watson.cloud.ibm.com/',
    workspace_id: 'ac1399d2-ed9f-4e7d-8b9a-b6bedde37325',
    version: '2020-03-25',
    minimum_confidence: 0.75, // (Optional) Default is 0.75,
  });
  */

    /*const receiveMiddleware = (bot, message, next) => {
      if (message.type === 'message_received') {
        watsonMiddleware.receive(bot, message, next);
      } else {
        next();
      }
    };

    controller.middleware.receive.use(receiveMiddleware);
    */
   // Every message that is received is sent to Watson and its replies are sent to client. Change this for further choices.
    controller.hears(
      ['.*'],
      'message_received',
      async function(bot, message) {
        console.log("Client is sending: ", message.text)
        watsonResponse = await getMessage(message.text);
        console.log("Watson Replied: ")
        console.log(watsonResponse.result)
        bot.reply(message, watsonResponse.result.output.text.join('\n'))
        }
    );
    }

const uuid = require('uuid');


module.exports = function (controller) {
  const getDelBotResponse = require('../services/botService').getDelBotResponse;

  controller.on('hello', conductOnboarding);
  // controller.on('welcome_back', conductOnboarding);

  function conductOnboarding(bot, message) {

    console.log(`Message Type : ${message.type}`, message.user)
    console.log(`Onboarding Message : ${message.text}`)

    bot.startConversation(message, function (err, convo) {

      convo.say({
        text: 'Hi, I am the DEL bot! What can I do for you?'
      });
    });

  }

  // User messages are sent to Dialogflow and the responses are sent to the client
  // The app also needs to perform actions based on the parameters and responses returned
  // by the service
  controller.hears(
    ['.*'],
    'message_received',
    async function (bot, message) {

      // Same session ID for the same conversation (joke and another joke)
      // Need to send this to the google bot
      const sessionId = uuid.v4();
      console.log(`SessionId : ${sessionId}`);

      console.log("Client is sending: ", message.text)
      botResponse = await getDelBotResponse(message.text, sessionId);
      console.log(`Del Bot response : ${JSON.stringify(botResponse, null, 4)}`)

      // App needs to handle response object
      if(botResponse) {
        bot.reply(message, {
          text: botResponse.text, 
          action: botResponse.action, 
          params: botResponse.params
        })
      }
    }
  );
}

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

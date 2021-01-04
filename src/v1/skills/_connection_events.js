/**
 * Handle bot messages using the BotKit framework
 * All user messages are passed on to dialogflow and the responses
 * are sent back to the user
 * 
 * @author Ben Philip
 */

module.exports = function (controller) {
  const getDelBotResponse = require('../services/botService').getDelBotResponse;

  controller.on('hello', conductOnboarding);
  // controller.on('welcome_back', conductOnboarding);

  function conductOnboarding(bot, message) {

    console.log(`Message Type : ${message.type}`, message.user)
    bot.startConversation(message, function (err, convo) {

      convo.say({
        text: 'Hi, I am the DEL bot! What can I do for you?'
      });
    });
  }

  // User messages are sent to Dialogflow and the responses are sent to the client
  // The app also needs to perform actions based on the parameters and responses returned
  // by the service. Handle the following system events -
  // message_received - received a message
  // welcome_back - returning user established new connectedn
  // reconnect - ongoing session experienced a disconnect/reconnect
  controller.hears(['.*'], 'message_received', handleMessage);
  controller.hears(['.*'], 'welcome_back', handleMessage);
  controller.hears(['.*'], 'reconnect', handleMessage);

  async function handleMessage (bot, message) {

    // A unique session ID is required for maintaining context information
    // at dialogflow. Each new bot instance from the user's smartphone sends a new
    // ID that can be used here
    var sessionId = message.user
    console.log(`SessionId : ${sessionId}`)

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
}

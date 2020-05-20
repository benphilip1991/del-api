/* This module kicks in if no Botkit Studio token has been provided */


module.exports = function(controller) {
  const getMessage = require('../services/watsonService').getMessage;

    controller.on('hello', conductOnboarding);
    controller.on('welcome_back', conductOnboarding);

    function conductOnboarding(bot, message) {

      console.log(message.type, message.user)

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

      /*bot.startConversation(message, function(err, convo) {

        convo.say("I received " + message.text);

        // set up a menu thread which other threads can point at.
        /*convo.ask({
          text: 'I can point you to resources, and connect you with experts who can help.',
          quick_replies: [
            {
              title: 'Read the Docs',
              payload: 'documentation',
            },
            {
              title: 'Join the Community',
              payload: 'community',
            },
            {
              title: 'Expert Help',
              payload: 'contact us',
            },
          ]
        },[
          {
            pattern: 'documentation',
            callback: function(res, convo) {
              convo.gotoThread('docs');
              convo.next();
            }
          },
          {
            pattern: 'community',
            callback: function(res, convo) {
              convo.gotoThread('community');
              convo.next();
            }
          },
          {
            pattern: 'contact',
            callback: function(res, convo) {
              convo.gotoThread('contact');
              convo.next();
            }
          },
          {
            default: true,
            callback: function(res, convo) {
              convo.gotoThread('end');
            }
          }
        ]);

        // set up docs threads
        convo.addMessage({
          text: 'I do not know how to help with that. Say `help` at any time to access this menu.'
        },'end');
                
        // set up docs threads
        convo.addMessage({
          text: 'Botkit is extensively documented! Here are some useful links:\n\n[Botkit Studio Help Desk](https://botkit.groovehq.com/help_center)\n\n[Botkit Anywhere README](https://github.com/howdyai/botkit-starter-web/blob/master/readme.md#botkit-anywhere)\n\n[Botkit Developer Guide](https://github.com/howdyai/botkit/blob/master/readme.md#build-your-bot)',
        },'docs');

        convo.addMessage({
          action: 'default'
        }, 'docs');


        // set up community thread
        convo.addMessage({
          text: 'Our developer community has thousands of members, and there are always friendly people available to answer questions about building bots!',
        },'community');

        convo.addMessage({
          text: '[Join our community Slack channel](https://community.botkit.ai) to chat live with the Botkit team, representatives from major messaging platforms, and other developers just like you!',
        },'community');

        convo.addMessage({
          text: '[Checkout the Github Issue Queue](https://github.com/howdyai/botkit/issues) to find frequently asked questions, bug reports and more.',
        },'community');

        convo.addMessage({
          action: 'default'
        }, 'community');



        // set up contact thread
        convo.addMessage({
          text: 'The team who built me can help you build the perfect robotic assistant! They can answer all of your questions, and work with you to develop custom applications and integrations.\n\n[Use this form to get in touch](https://botkit.ai/contact.html), or email us directly at [help@botkit.ai](mailto:help@botkit.ai), and a real human will get in touch!',
        },'contact');
        convo.addMessage({
          action: 'default'
        }, 'contact');

      });*/

    //});
    //}
    );
    }

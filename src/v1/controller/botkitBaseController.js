'use strict';

//import { WatsonMiddleware } from 'botkit-middleware-watson';
console.log("accessing botkit base controller");
const { WatsonMiddleware } = require('botkit-middleware-watson');
const { Botkit } = require('botkit');
const WebAdapter = require('botbuilder-adapter-web').WebAdapter;
const adapter = new WebAdapter({});

const botkit = new Botkit({
  adapter:adapter,
  webhook_uri: "/api/messages"
});

/*botkit.webserver.use((request, response) => {
    //console.log(request);
  });
*/
  const watsonMiddleware = new WatsonMiddleware({
    iam_apikey: 'dNKhxcXesXFQ8IQQxMo_cTJ_HMkneJxfqVrChxgwudS7',
    url: 'https://api.au-syd.assistant.watson.cloud.ibm.com/',
    workspace_id: 'ac1399d2-ed9f-4e7d-8b9a-b6bedde37325',
    version: '2020-03-25',
    minimum_confidence: 0.75, // (Optional) Default is 0.75,
  });
  
  botkit.middleware.receive.use(
    watsonMiddleware.receive.bind(watsonMiddleware),
  );

  botkit.on("hello", async (bot, message) => {
    console.log("botkit is on")
    if (message.watsonData) {
        await bot.reply(message, message.watsonData.output);
    }
});

botkit.hears(['.*'],'message', async(bot, message) => {
    if (message.watsonError) {
        console.log(watson_msg);
        await bot.reply(
            message,
            "I'm sorry, but for technical reasons I can't respond to your message"
        );
    } else {
        var watson_msg = message.watsonData.output;
        console.log(watson_msg.generic[0].response_type);
        if (watson_msg.generic[0].response_type == 'text') {
            await bot.reply(message, watson_msg.text[0]);
        }
        else {
            await bot.reply(message, 'Received reply is not a text');
        }   
        
    }
},
);

/*controller.on('message,direct_message', async(bot, message) => {
    await bot.reply(message, `Echo: ${ message.text }`);
});*/





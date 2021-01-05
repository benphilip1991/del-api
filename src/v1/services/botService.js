const dialogflow = require('@google-cloud/dialogflow');

/**
 * Returns an object containing the response, action and parameters
 * @param {*} userMessage 
 * @param {*} sessionId 
 * @param {*} projectId 
 */
async function getDelBotResponse(userMessage, sessionId, projectId = 'del-bot') {
    
    // Create new session
    const sessionClient = new dialogflow.SessionsClient();
    const sessionPath = sessionClient.projectAgentSessionPath(projectId, sessionId);

    // Query to the bot
    const request = {
        session: sessionPath,
        queryInput: {
            text: {
                text: userMessage,
                languageCode: 'en-US',
            }, 
        },
    };

    // Send request and print result
    const responses = await sessionClient.detectIntent(request);

    const action = responses[0].queryResult.action;
    const botResponse = responses[0].queryResult.fulfillmentText;
    const botParams = responses[0].queryResult.parameters.fields;

    return {
        text: botResponse,
        action: action,
        params: botParams
    }
}


module.exports = {
    getDelBotResponse: getDelBotResponse
}
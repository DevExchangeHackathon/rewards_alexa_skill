    'use strict';
    var http = require('http');
    const sessionAttributes = {};
    var accounts = [];
    const accountsResponse = "{ \
        \"rewardsAccounts\": [ \
            { \
                \"rewardsAccountReferenceId\": \"+jaR3Du6APE+x4kQue7NB2l3cLJHm0Rg9qspJbY65DpNtAOoLJnAguw4SVcuOlJuWVrEIiLswYp4ZZ0NX1veFw==\", \
                \"accountDisplayName\": \"Capital One Visaplatinum Miles *3582\", \
                \"rewardsCurrency\": \"Miles\", \
                \"productAccountType\": \"Credit Card\", \
                \"creditCardAccount\": { \
                    \"issuer\": \"Capital One\", \
                    \"product\": \"Visaplatinum\", \
                    \"lastFour\": \"3582\", \
                    \"network\": \"Visa\", \
                    \"isBusinessAccount\": false \
                } \
            }, \
            { \
                \"rewardsAccountReferenceId\": \"+jaR3Du6APE+x4kQue7NB76pzE2EghQD5frCU8NquuYUCjno3GzJDe6bKPmH9nruRwMPivkpoT+3PCwGfwJavg==\", \
                \"accountDisplayName\": \"Capital One Mastercardworldcard Points *4734\", \
                \"rewardsCurrency\": \"Points\", \
                \"productAccountType\": \"Credit Card\", \
                \"creditCardAccount\": { \
                    \"issuer\": \"Capital One\", \
                    \"product\": \"Mastercardworldcard\", \
                    \"lastFour\": \"4734\", \
                    \"network\": \"MasterCard\", \
                    \"isBusinessAccount\": false \
                } \
            }, \
            { \
                \"rewardsAccountReferenceId\": \"+jaR3Du6APE+x4kQue7NB5B3s8P1SDCKUMnePdqKMMQTh1NOnzYjjwoO7vJ4efuJTXFEosem897LbHrdUjWXw==\", \
                \"accountDisplayName\": \"Capital One Visasignature Cash *8729\", \
                \"rewardsCurrency\": \"Cash\", \
                \"productAccountType\": \"Credit Card\", \
                \"creditCardAccount\": { \
                    \"issuer\": \"Capital One\", \
                    \"product\": \"Visasignature\", \
                    \"lastFour\": \"8729\", \
                    \"network\": \"Visa\", \
                    \"isBusinessAccount\": false \
                } \
            } \
        ] \
    }";

    /**
     * This sample demonstrates a simple skill built with the Amazon Alexa Skills Kit.
     * The Intent Schema, Custom Slots, and Sample Utterances for this skill, as well as
     * testing instructions are located at http://amzn.to/1LzFrj6
     *
     * For additional samples, visit the Alexa Skills Kit Getting Started guide at
     * http://amzn.to/1LGWsLG
     */


    // --------------- Helpers that build all of the responses -----------------------


    function buildSpeechletResponse(title, output, repromptText, shouldEndSession) {
        return {
            outputSpeech: {
                type: 'PlainText',
                text: output,
            },
            card: {
                type: 'Simple',
                title: `SessionSpeechlet - ${title}`,
                content: `SessionSpeechlet - ${output}`,
            },
            reprompt: {
                outputSpeech: {
                    type: 'PlainText',
                    text: repromptText,
                },
            },
            shouldEndSession,
        };
    }

    function buildResponse(sessionAttributes, speechletResponse) {
        return {
            version: '1.0',
            sessionAttributes,
            response: speechletResponse,
        };
    }


    // --------------- Functions that control the skill's behavior -----------------------

    function getWelcomeResponse(callback) {
        // If we wanted to initialize the session to have some attributes we could add those here.
        const cardTitle = 'Welcome';
        const speechOutput = 'Welcome to Capital One Rewards. ' +
            'You can say view my rewards for access to accounts';
        // If the user either does not reply to the welcome message or says something that is not
        // understood, they will be prompted again with this text.
        const repromptText = 'Please say view my rewards';
        const shouldEndSession = false;

        callback(sessionAttributes,
            buildSpeechletResponse(cardTitle, speechOutput, repromptText, shouldEndSession));
    }

    function handleSessionEndRequest(callback) {
        const cardTitle = 'Session Ended';
        const speechOutput = 'Thank you for using Capital One Rewards. Have a nice day!';
        // Setting this to true ends the session and exits the skill.
        const shouldEndSession = true;

        callback({}, buildSpeechletResponse(cardTitle, speechOutput, null, shouldEndSession));
    }



    function getAccounts(intent, session, callback) {
        accounts = [];
        let speechOutput = 'You have 12 accounts';
        const repromptText = null;
        let shouldEndSession = false;
        let api = "http://api.devexhacks.com/rewards/accounts/";
        // let url = "http://google.com";
        var headers = {
            'Accept': 'application/json;v=1',
            'Authorization': 'Bearer eyJlbmMiOiJBMTI4Q0JDLUhTMjU2IiwicGNrIjoxLCJhbGciOiJkaXIiLCJ0diI6Miwia2lkIjoiYTdxIn0..Q8EPUTo189PyagVaeXKw9XgvYN1pEz5Vgp1bgF4Hj9TE2anFkmGILcf7UX9iO6L0cUTgJQm3blatkUZUyUKc6cHFyyuVPKmtZDIU2zmP6VEhxmroUfeqh8YJnOEw9LRVKU1Pq4fVRuZMsIM1Mf6F2oMOAFL8JTw7AK4CQVUWtti4KHaNBtDX9cHOuwRtDbKhQbmySLP0g5ENzrC9gWMLprmq66hX5bI4TAiF2f7KlgjtT9lvph9pLyDsfBhtOanWj6gVmYMqxcNQlUHcgtsH3nlthX1PsOKQppDtmS09hPELzTxEn2kxk2btJ0KPy2iQFQyDSWfER1xgJnFDASr1sg8MNeQh3Qjmp4vuruQMimu1IFVvb1cIsIDS7cWPCUPa2UFYz9YfW1uXVnUpOyZTCWZ3E28YL70Rn2TbP4Hw030rgBWF5Ok1YD51e7BWJXXCq1lIWUG85WmjWZ5Il4nVNZBxBFDPR7lQMG2Gw36ibffzfTDwwHfWhlpkmbqtRLawKEVtYNDcpIvocujQJFHlwCRJ9uex5BXJzQQ6Mrp1cvxp3sp65mU5EPSU4J1OK0Iuj8Yv.I3YRuEIDtnqtHjjjrb9OK0A'
        }

        // Configure the request
        var options = {
            url: api,
            method: 'GET',
            headers: headers
        }

        // getWebRequest(options, function webResonseCallback(err, data) {
        //     if (err) {
        //         speechOutput = "Sorry I couldn't connect to the server: " + err + " " + options.url;
        //         callback(sessionAttributes,
        //             buildSpeechletResponse(intent.name, speechOutput, repromptText, shouldEndSession));
        //     } else {
        //         //something like this
        //         const balance = data.rewardsAccounts[0].rewardsAccountReferenceId;
        //         speechOutput = `${balance} account ref`;            
        //         callback({}, buildSpeechletResponse(intent.name, speechOutput, repromptText, shouldEndSession));
        //     }
        // });
        var accountObject = JSON.parse(accountsResponse);
        var size = accountObject.rewardsAccounts.length;
        speechOutput = "you have " +  accountObject.rewardsAccounts.length + " accounts. ";
        var index;
        for(index = 0;index < size; index++) {
            speechOutput += "Account " + (index + 1) + ". . " + accountObject.rewardsAccounts[index].accountDisplayName.substring(0,(accountObject.rewardsAccounts[index].accountDisplayName.length - 5)) + ". . ";
            accounts.push(accountObject.rewardsAccounts[index]);
        }
        speechOutput += ". . say view my rewards to see rewards details. . ";
        callback(sessionAttributes,
                buildSpeechletResponse(intent.name, speechOutput, repromptText, shouldEndSession));
    }

    function getRewards(intent, session, callback) {
        let speechOutput = "You have rewards for " + accounts.length + " accounts. . ";
        if (accounts.length > 0) {
            speechOutput += "which account would you like details for? You can say card 1 or card 2?";
        }
        let shouldEndSession = false;
        const repromptText = null;
        callback(sessionAttributes,
            buildSpeechletResponse(intent.name, speechOutput, repromptText, shouldEndSession));
    }

    function redeemRewards(intent, session, callback) {
        let speechOutput = 'You can not redeem';
        let shouldEndSession = false;
        const repromptText = null;
        callback(sessionAttributes,
            buildSpeechletResponse(intent.name, speechOutput, repromptText, shouldEndSession));
    }

    // --------------- Events -----------------------

    /**
     * Called when the session starts.
     */
    function onSessionStarted(sessionStartedRequest, session) {
        console.log(`onSessionStarted requestId=${sessionStartedRequest.requestId}, sessionId=${session.sessionId}`);
    }

    /**
     * Called when the user launches the skill without specifying what they want.
     */
    function onLaunch(launchRequest, session, callback) {
        console.log(`onLaunch requestId=${launchRequest.requestId}, sessionId=${session.sessionId}`);

        // Dispatch to your skill's launch.
        getWelcomeResponse(callback);
    }

    /**
     * Called when the user specifies an intent for this skill.
     */
    function onIntent(intentRequest, session, callback) {
        console.log(`onIntent requestId=${intentRequest.requestId}, sessionId=${session.sessionId}`);

        const intent = intentRequest.intent;
        const intentName = intentRequest.intent.name;

        // Dispatch to your skill's intent handlers
        if (intentName === 'MyRewardsIntent') {
            getRewards(intent, session, callback);
        } else if (intentName === 'MyAccountsIntent') {
            getAccounts(intent, session, callback);
        } else if (intentName === 'RedeemRewardsIntent') {
            redeemRewards(intent, session, callback);
        } else if (intentName === 'AMAZON.HelpIntent') {
            getWelcomeResponse(callback);
        } else if (intentName === 'AMAZON.StopIntent' || intentName === 'AMAZON.CancelIntent') {
            handleSessionEndRequest(callback);
        } else {
            throw new Error('Invalid intent');
        }
    }

    function getWebRequest(options, doWebRequestCallBack) {
        http.get(options, function (res) {
            var webResponseString = '';
            //console.log('Status Code: ' + res.statusCode);

            if (res.statusCode != 200) {
                doWebRequestCallBack(new Error("Non 200 Response"));
            }

            res.on('data', function (data) {
                webResponseString += data;
            });

            res.on('end', function () {
                //console.log('Got some data: '+ webResponseString);            
                var webResponseObject = JSON.parse(webResponseString);
                if (webResponseObject.error) {
                    //console.log("Web error: " + webResponseObject.error.message);
                    doWebRequestCallBack(new Error(webResponseObject.error.message));
                } else {
                    //console.log("web success");
                    doWebRequestCallBack(null, webResponseObject);
                }
            });
        }).on('error', function (e) {
            //console.log("Communications error: " + e.message);
            doWebRequestCallBack(new Error(e.message));
        });
    }
    /**
     * Called when the user ends the session.
     * Is not called when the skill returns shouldEndSession=true.
     */
    function onSessionEnded(sessionEndedRequest, session) {
        console.log(`onSessionEnded requestId=${sessionEndedRequest.requestId}, sessionId=${session.sessionId}`);
        // Add cleanup logic here
    }


    // --------------- Main handler -----------------------

    // Route the incoming request based on type (LaunchRequest, IntentRequest,
    // etc.) The JSON body of the request is provided in the event parameter.
    exports.handler = (event, context, callback) => {
        try {
            console.log(`event.session.application.applicationId=${event.session.application.applicationId}`);

            /**
             * Uncomment this if statement and populate with your skill's application ID to
             * prevent someone else from configuring a skill that sends requests to this function.
             */
            /*
            if (event.session.application.applicationId !== 'amzn1.echo-sdk-ams.app.[unique-value-here]') {
                callback('Invalid Application ID');
            }
            */

            if (event.session.new) {
                onSessionStarted({
                    requestId: event.request.requestId
                }, event.session);
            }

            if (event.request.type === 'LaunchRequest') {
                onLaunch(event.request,
                    event.session,
                    (sessionAttributes, speechletResponse) => {
                        callback(null, buildResponse(sessionAttributes, speechletResponse));
                    });
            } else if (event.request.type === 'IntentRequest') {
                onIntent(event.request,
                    event.session,
                    (sessionAttributes, speechletResponse) => {
                        callback(null, buildResponse(sessionAttributes, speechletResponse));
                    });
            } else if (event.request.type === 'SessionEndedRequest') {
                onSessionEnded(event.request, event.session);
                callback();
            }
        } catch (err) {
            callback(err);
        }
    };
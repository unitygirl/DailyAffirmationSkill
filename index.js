/**
    Copyright 2014-2015 Amazon.com, Inc. or its affiliates. All Rights Reserved.

    Licensed under the Apache License, Version 2.0 (the "License"). You may not use this file except in compliance with the License. A copy of the License is located at

        http://aws.amazon.com/apache2.0/

    or in the "license" file accompanying this file. This file is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied. See the License for the specific language governing permissions and limitations under the License.
*/

/**
 * This simple sample has no external dependencies or session management, and shows the most basic
 * example of how to create a Lambda function for handling Alexa Skill requests.
 *
 * Examples:
 * One-shot model:
 *  User: "Alexa, ask Daily Affirmations for an affirmation"
 *  Alexa: "Here's your affirmation: ..."
 */

/**
 * App ID for the skill
 */
var APP_ID = "amzn1.echo-sdk-ams.app.a17bc005-a00c-422f-8858-9fed34da389f"; //replace with "amzn1.echo-sdk-ams.app.[your-unique-value-here]";

/**
 * Array containing space facts.
 */
var AFFIRMATIONS = [
	"I attune to being whole and complete, and express perfect health.",
	"I am completely and divinely loved.",
	"God guides me on my unique path.",
	"My thoughts and actions contribute to peace in the world.",
	"I embrace abundant living and give thanks.",
	"The light of truth illumines my mind and body. I am whole and well.",
	"I act on divine guidance with confidence and faith.",
	"I am at peace in the present moment.",
	"My peaceful presence contributes to peace in the world.",
	"Divine ideas prosper and bless me.",
	"I am strong, healthy, and vigorous.",
	"I act on my guidance from my highest self.",
	"I am one with all that is, and I am at peace.",
	"I find joy in my own company.",
	"I love who I am, and the choices I make today, determine who I will be tomorrow.",
	"I enjoy my own company, and take pleasure in stillness.",
	"I focus on my breath to bring calmness and peace to each momemt",
	"I make the right choices by using the combination of, Love and Wisdom to discern what needs to be done.",
	"I trust my instincts, and find comfort in trusting my intuition",
	"Money comes to me easily, and effortlessly, to meet my every need.",
	"I am unique, and special, and I have inherent gifts to share with the world.",
	"I am the architect of my life, I build its foundation, and choose its direction.",
	"Today, I am shining with energy, and overflowing with joy.",
	"My body is healthy, my mind is brilliant, my soul is tranquil.",
	"I am no longer controlled by negative thoughts and actions. I think and act from love.",
	"I have been given endless gifts of talent and passion, which I begin to utilize today",
	"I forgive those who have hurt me, and peacefully detach from hurtful situations.",
	"An ocean of compassion washes away my fear, and replaces it with love.",
	"I am guided in my every step by my highest self, who leads me towards what I must know and do.",
	"I have within me, the qualities needed to be extremely successful, happy and prosperous.",
	"Creative energy flows through me, and guides me to new, brilliant ideas.",
	"Happiness is a choice. I choose happiness based on my own accomplishments and the blessings I've been given.",
	"My ability to overcome my challenges is limitless, my potential to succeed is infinite.",
	"I am brave and I stand up for myself. People respect my courage.",
	"My thoughts are filled with positivity and joy, and my life is abundant with prosperity.",
	"Today, I let go of my old bad habits, and take up new, more positive ones.",
	"People look up to me and recognize my worth, I am admired and cherished.",
	"I am blessed with an incredible family, and wonderful friends.",
	"I acknowledge my own self-worth, my confidence is soaring.",
	"Everything that is happening now is happening for my ultimate benefit, and the benefit of all concerned.",
	"I am a powerhouse, I am confident.",
	"Though these times may seem hard, they are only a short phase of life. I choose to focus on the good.",
	"My future is a perfect reflection of what I envision now.",
	"My dreams are being supported by the universe; my dreams manifest into reality before my eyes.",
	"I radiate beauty, peace, and love.",
	"I am conquering sickness; I am defeating it steadily each day.",
	"Every day in every way, I am getting better, better, and better.",
	"My challenges are easily overcome, my path is paved with greatness.",
	"I wake up today with love in my heart, and clarity in my mind.",
	"My fears of what will be are simply melting away. I am excited about the present moment.",
	"I am at peace with all that has happened, is happening, and will happen.",
	"My life is just beginning. Today is a wonder-filled day."
];

/**
 * The AlexaSkill prototype and helper functions
 */
var AlexaSkill = require('./AlexaSkill');

/**
 * DailyAffirmations is a child of AlexaSkill.
 * To read more about inheritance in JavaScript, see the link below.
 *
 * @see https://developer.mozilla.org/en-US/docs/Web/JavaScript/Introduction_to_Object-Oriented_JavaScript#Inheritance
 */
var DailyAffirmations = function() {
	AlexaSkill.call(this, APP_ID);
};

// Extend AlexaSkill
DailyAffirmations.prototype = Object.create(AlexaSkill.prototype);
DailyAffirmations.prototype.constructor = DailyAffirmations;

DailyAffirmations.prototype.eventHandlers.onSessionStarted = function(sessionStartedRequest, session) {
	console.log("DailyAffirmations onSessionStarted requestId: " + sessionStartedRequest.requestId + ", sessionId: " + session.sessionId);
	// any initialization logic goes here
};

DailyAffirmations.prototype.eventHandlers.onLaunch = function(launchRequest, session, response) {
	console.log("DailyAffirmations onLaunch requestId: " + launchRequest.requestId + ", sessionId: " + session.sessionId);
	handleNewAffirmationRequest(response);
};

/**
 * Overridden to show that a subclass can override this function to teardown session state.
 */
DailyAffirmations.prototype.eventHandlers.onSessionEnded = function(sessionEndedRequest, session) {
	console.log("DailyAffirmations onSessionEnded requestId: " + sessionEndedRequest.requestId + ", sessionId: " + session.sessionId);
	// any cleanup logic goes here
};

DailyAffirmations.prototype.intentHandlers = {
	"GetNewAffirmationIntent": function(intent, session, response) {
		handleNewAffirmationRequest(response);
	},
	"DefineAffirmationIntent": function(intent, session, response) {
		handleDefineAffirmationRequest(response);
	},
	"HelpIntent": function(intent, session, response) {
		response.ask("You can ask Daily Affirmations for an affirmation, or, you can say exit... What can I help you with?", "What can I help you with?");
	}
 /**   "AMAZON.StopIntent": function (intent, session, response) {
        var speechOutput = "Goodbye";
        response.tell(speechOutput);
    },

    "AMAZON.CancelIntent": function (intent, session, response) {
        var speechOutput = "Goodbye";
        response.tell(speechOutput);
    }
	 */
};
/**
 * Gets the definition of Affirmation and returns to the user.
 */

function handleDefineAffirmationRequest(response) {

	// Create speech output
	var speechOutput = "Affirmations are proven methods of re-wireing your brain and provide a way for you to consciously control what you think about. Affirmations improve the level of feel-good hormones and help you break the patterns that negative thoughts can cause. ";

	response.tellWithCard(speechOutput, "Daily Affirmations", speechOutput);
};
/**
 * Gets a random affirmation from the list and returns to the user.
 */

function handleNewAffirmationRequest(response) {
	// Get a random affirmation from the affirmations list
	var affirmationIndex = Math.floor(Math.random() * AFFIRMATIONS.length);
	var affirmation = AFFIRMATIONS[affirmationIndex];

	// Create speech output
	var speechOutput = "Here is Your Affirmation for today. " + affirmation;

	response.tellWithCard(speechOutput, "Here's Your Daily Affirmation, ", speechOutput);
};

// Create the handler that responds to the Alexa Request.
exports.handler = function(event, context) {
	// Create an instance of the DailyAffirmations skill.
	var dailyAffirmations = new DailyAffirmations();
	dailyAffirmations.execute(event, context);
};

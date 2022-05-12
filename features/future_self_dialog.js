const { BotkitConversation } = require('botkit');

module.exports = function(controller) {
    // define the conversation
    const dialog = new BotkitConversation('dialog', controller);

    dialog.say('Vandaag gaan wij een leuke oefening doen die je gaat helpen te stoppen met roken en genoeg te bewegen. ...');
    dialog.say('bla bla ...');

    dialog.addQuestion(
    {text: 'Welke woorden passen bij jou als roker? Roken is...?', action: 'confirm_thread'},
    async(answer) => {
        // do nothing.
    }, {key: 'smoker_words'});

    dialog.addMessage({
        text: 'Anyways, moving on...',
        action: 'confirm_thread',
    });

    // collect a value with conditional actions
    dialog.addQuestion('Je hebt {{vars.smoker_words}} gekozen, klopt dat?', [
        {
            pattern: 'ja',
            handler: async function(answer, convo, bot) {
                await convo.gotoThread('likes_tacos');
            }
        },
        {
            pattern: 'nee',
            handler: async function(answer, convo, bot) {
                await convo.gotoThread('hates_life');
            }
        },
        {
            default: true,
            handler: async function(answer, convo, bot) {
                bot.say('Kies alsjeblieft uit "ja" of "nee"');
                await convo.gotoThread('confirm_thread');
            }
        }
    ],{}, 'confirm_thread');

    // define a 'likes_tacos' thread
    dialog.addMessage('HOORAY TACOS', 'likes_tacos');

    // define a 'hates_life' thread
    dialog.addMessage('TOO BAD!', 'hates_life');

    // handle the end of the conversation
    dialog.after(async(results, bot) => {
        const name = results.name;
    });

    // add the conversation to the dialogset
    controller.addDialog(dialog);

    // launch the dialog in response to a message or event
    controller.hears(['future-self dialog', 'future self dialog', 'future-self'], 'message', async(bot, message) => {
        await bot.beginDialog('dialog');
    });
}
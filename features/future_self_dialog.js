const { BotkitConversation } = require('botkit');

module.exports = function(controller) {
    // define the conversation
    const dialog = new BotkitConversation('dialog', controller);

    dialog.say('Vandaag gaan wij een leuke oefening doen die je gaat helpen te stoppen met roken en genoeg te bewegen. ...');
    dialog.say('bla bla ...');
    dialog.addAction('ask_smoker_words_thread')

    // ask_smoker_words_thread
    dialog.addQuestion('Welke woorden passen bij jou als roker? Roken is...?',
        handlers=[],
        key='smoker_words',
        thread_name='ask_smoker_words_thread');
    dialog.addAction(action='confirm_smoker_words_threat', thread_name='ask_smoker_words_thread')

    // confirm_smoker_words_threat
    dialog.addQuestion('Je hebt {{vars.smoker_words}} gekozen, klopt dat?', [
        {
            pattern: 'ja',
            handler: async function(answer, convo, bot) {
                await convo.gotoThread('ask_mover_words_thread');
            }
        },
        {
            pattern: 'nee',
            handler: async function(answer, convo, bot) {
                await convo.gotoThread('ask_smoker_words_thread');
            }
        },
        {
            default: true,
            handler: async function(answer, convo, bot) {
                bot.say('Kies alsjeblieft uit "ja" of "nee"');
                await convo.gotoThread('confirm_smoker_words_threat');
            }
        }
    ], key=null, thread_name='confirm_smoker_words_threat');

    // ask_mover_words_thread
    dialog.addMessage('We gaan nu dezelfde oefening doen voor bewegen. ...', thread_name='ask_mover_words_thread')
    dialog.addQuestion('Welke woorden vind jij passen bij bewegen? Bewegen is...?',
        handlers=[],
        key='mover_words',
        thread_name='ask_mover_words_thread');
    dialog.addAction('confirm_mover_words_threat', thread_name='ask_mover_words_thread')

    // confirm_smoker_words_threat
    dialog.addQuestion('Je hebt {{vars.mover_words}} gekozen, klopt dat?', [
        {
            pattern: 'ja',
            handler: async function(answer, convo, bot) {
                await convo.gotoThread('likes_tacos');
            }
        },
        {
            pattern: 'nee',
            handler: async function(answer, convo, bot) {
                await convo.gotoThread('ask_mover_words_thread');
            }
        },
        {
            default: true,
            handler: async function(answer, convo, bot) {
                bot.say('Kies alsjeblieft uit "ja" of "nee"');
                await convo.gotoThread('confirm_mover_words_threat');
            }
        }
    ], key=null, thread_name='confirm_mover_words_threat');

    // define a 'likes_tacos' thread
    dialog.addMessage('HOORAY TACOS', 'likes_tacos');

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
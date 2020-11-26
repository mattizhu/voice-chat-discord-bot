const {messageEmbedSend} = require('../../utilities/utilities');
const intLang = require('../../locale/language');

// Command Module
module.exports = {
    name: 'credits',
    description: 'Displays and credits awesome contributors who worked on the development.',
    hide: true,
    cooldown: 5,
    execute(client, message) {

        // Message Embed Response
        messageEmbedSend(client, message.channel, true, intLang('commands.credits.embedMessage.title', client.user.username), intLang('commands.credits.embedMessage.description'));
    }
};

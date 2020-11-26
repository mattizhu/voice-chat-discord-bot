const {messageEmbedSend} = require('../../utilities/utilities');
const intLang = require('../../locale/language');
const {discord} = require('../../config/config');

// Command Module
module.exports = {
    name: 'help',
    description: 'Displays list of commands.',
    aliases: ['commands'],
    cooldown: 30,
    execute(client, message) {

        // Command List
        const commandList = client.commands.reduce((accumulator, command) => {
            if (!command.hide) accumulator.push(`**\`${discord.prefix}${command.name}\`** ${command.aliases ? `or **\`${discord.prefix}${command.aliases}\`**`:''}\n${command.description}\n\n`);
            return accumulator;
        }, []);

        // Message Embed Response
        messageEmbedSend(client, message.channel, true, intLang('commands.help.embedMessage.title', client.user.username), intLang('commands.help.embedMessage.description', commandList.join(' '), discord.prefix));
    }
};

const {Collection} = require('discord.js');
const logger = require('../config/logger');
const intLang = require('../locale/language');
const {discord} = require('../config/config');

// Event Emittion
module.exports = (client, message) => {

    // Message Verification
    if (message.author.bot || message.channel.type !== 'text') return;
    if (!message.content.startsWith(discord.prefix)) return;

    // Message Commands Parser
    let args = message.content.slice(discord.prefix.length).trim().split(/\s+/g);
    let commandName = args.shift().toLowerCase();

    // Command Query
    const command = client.commands.get(commandName) || client.commands.find(command => command.aliases && command.aliases.includes(commandName));
    if (!command) return message.reply(intLang('events.message._errors.commandUnknown', discord.prefix))
        .catch(error => logger.error(intLang('discord._errors.messageIneffective', error)));

    // Command Permission Verification
    if (command.permission && !message.member.hasPermission('ADMINISTRATOR')) return message.reply(intLang('events.message._errors.permissionInsufficient'));

    // Command Disabled Verification
    if (command.disabled) return message.reply(intLang('events.message._errors.commandDisabled'))
        .catch(error => logger.error(intLang('discord._errors.messageIneffective', error)));

    // Command Arguments Verification
    if (command.arguments && !args.length) return message.reply(intLang('events.message._errors.argumentsRequired', discord.prefix))
        .catch(error => logger.error(intLang('discord._errors.messageIneffective', error)));

    // Command Colldown Verification
    if (!client.cooldowns.has(command.name)) client.cooldowns.set(command.name, new Collection());
    const now = Date.now();
    const cooldown = client.cooldowns.get(command.name);
    const cooldownTime = (command.cooldown || 3) * 1000;
    if (cooldown.has(message.author.id)) {
        const expiration = cooldown.get(message.author.id) + cooldownTime;
        if (now < expiration) {
            const remaining = (expiration - now) / 1000;
            return message.reply(intLang('events.message._errors.cooldownInsufficient', Math.ceil(remaining)))
                .catch(error => logger.error(intLang('discord._errors.messageIneffective', error)));
        }
    }
    cooldown.set(message.author.id, now);
    setTimeout(() => cooldown.delete(message.author.id), cooldownTime);

    // Command Execution
    try {
        command.execute(client, message,args);
    } catch(error) {
        logger.error(intLang('commands._errors.executionIneffective', command.name, error));
        message.reply(intLang('events.message._errors.executionIneffective'))
            .catch(error => logger.error(intLang('discord._errors.messageIneffective', error)));
    }
};

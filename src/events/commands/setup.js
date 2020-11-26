const {dbGuilds} = require('../../utilities/datastore');
const logger = require('../../config/logger');
const intLang = require('../../locale/language');
const {messageEmbedSend} = require('../../utilities/utilities');
const {discord} = require('../../config/config');

// Command Module
module.exports = {
    name: 'setup',
    description: 'Dynamically configures the server with required text and voice channels.',
    permission: true,
    hide: true,
    cooldown: 10,
    execute(client, message) {

        // Message Reaction Function
        async function messageReaction(reactMessage) {
            const automaticEmoji = '🔮';
            const manualEmoji = '⚙️';

            // Message Reaction Insertion
            await reactMessage.react(automaticEmoji)
                .catch(error => logger.error(intLang('discord._errors.messageReactIneffective', error)));
            await reactMessage.react(manualEmoji)
                .catch(error => logger.error(intLang('discord._errors.messageReactIneffective', error)));

            // Await Message Reaction
            reactMessage.awaitReactions((reaction, member) => [automaticEmoji, manualEmoji].includes(reaction.emoji.name) && member.id === message.author.id, {max: 1, time: 120000, errors: ['time']})
                .then(collection => {
                    const reaction = collection.first();

                    // Message Reaction Responses
                    if (reaction.emoji.name === automaticEmoji) return automaticSetup();
                    if (reaction.emoji.name === manualEmoji) return manualSetup();
                }).catch(() => message.reply(intLang('commands.setup._errors.reactionUnresponsive')));
        };

        // Automatic Setup Function
        async function automaticSetup() {
            const clientPermissions = ['MANAGE_CHANNELS', 'MANAGE_ROLES', 'VIEW_CHANNEL', 'CONNECT', 'MOVE_MEMBERS'];

            // Category Channel Creation
            const channelCategory = await message.guild.channels.create(intLang('discord.channels.category'), {type: 'category', permissionOverwrites: [{id: message.guild.members.cache.get(client.user.id).id, allow: clientPermissions}]})
                .catch(error => {
                    logger.error(intLang('discord._errors.channelCreateIneffective', error));
                    return message.reply(intLang('commands.setup._errors.commandIneffective'));
                });

            // Category Text Creation
            const channelText = await message.guild.channels.create(intLang('discord.channels.text'), {type: 'text', parent: channelCategory, permissionOverwrites: [{id: message.guild.members.cache.get(client.user.id).id, allow: clientPermissions}]})
                .catch(error => {
                    logger.error(intLang('discord._errors.channelCreateIneffective', error));
                    return message.reply(intLang('commands.setup._errors.commandIneffective'));
                });

            // Category Voice Creation
            const channelVoice = await message.guild.channels.create(intLang('discord.channels.voice'), {type: 'voice', parent: channelCategory, permissionOverwrites: [{id: message.guild.members.cache.get(client.user.id).id, allow: clientPermissions}]})
                .catch(error => {
                    logger.error(intLang('discord._errors.channelCreateIneffective', error));
                    return message.reply(intLang('commands.setup._errors.commandIneffective'));
                });

            // NeDB Guilds Insertion
            dbGuilds.insert({id: message.guild.id, name: message.guild.name, channels: {category: channelCategory.id, text: channelText.id, voice: channelVoice.id}}, error => {
                if (error) return logger.error(intLang('nedb._errors.guildsInsertIneffective', error));

                // Success Response
                messageEmbedSend(client, message.channel, false, intLang('commands.setup.automatic.success.embedMessage.title'), intLang('commands.setup.automatic.success.embedMessage.description', discord.prefix));
            });
        };

        // Manual Setup Function
        function manualSetup() {
            messageEmbedSend(client, message.channel, false, intLang('commands.setup.manual.embedMessage.title'), intLang('commands.setup.manual.embedMessage.description', message.author.displayName, discord.prefix));
        };
        
        // NeDB Guilds Query & Verification
        dbGuilds.findOne({id: message.guild.id}, (error, Guild) => {
            if (error) return logger.error(intLang('nedb._errors.guildsFindOneIneffective', error));
            if (Guild) return message.reply(intLang('commands.setup._errors.alreadySetup'));

            // Message Embed Response
            messageEmbedSend(client, message.channel, true, intLang('commands.setup.embedMessage.title', client.user.username) ,intLang('commands.setup.embedMessage.description'))
                .then(embedMessage => messageReaction(embedMessage));
        });
    }
};

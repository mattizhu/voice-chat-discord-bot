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
                    if (reaction.emoji.name === manualEmoji) return manualSetup('categoryChannel');
                }).catch(() => message.reply(intLang('commands.setup._errors.reactionUnresponsive')));
        };

        // Automatic Setup Function
        async function automaticSetup() {
            const clientPermissions = ['MANAGE_CHANNELS', 'SEND_MESSAGES', 'VIEW_CHANNEL', 'CONNECT', 'MOVE_MEMBERS', 'ADD_REACTIONS'];

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
        function manualSetup(section, errorMessage) {

            // Error Message
            if (errorMessage) message.channel.send(intLang(`commands.setup.manual.${section}._errors.${errorMessage}`, message.author))
                .then(responseMessage => awaitManualSetupMessages(section, responseMessage))
                .catch(error => logger.error(intLang('discord._errors.messageIneffective', error)));

            // Section Message
            else messageEmbedSend(client, message.channel, false, intLang(`commands.setup.manual.${section}.embedMessage.title`), intLang(`commands.setup.manual.${section}.embedMessage.description`))
                .then(responseMessage => awaitManualSetupMessages(section, responseMessage));
        };

        // Manual Setup Await Messages Function
        let manualSettings = {};
        async function awaitManualSetupMessages(section, responseMessage) {

            // Message Await
            if (section !== 'permissions') responseMessage.channel.awaitMessages(msg => msg.author.id === message.author.id, {max: 1, time: 600000, errors: ['time']})
                .then(responses => {
                    const response = responses.first();
                    if (response.content.toLowerCase() === 'cancel') return message.reply(intLang('commands.setup.manual._errors.processCancelled'));
                    return verifyManualSetup(section, response);
                }).catch(() => message.reply(intLang('commands.setup._errors.responseTimeout')));

            // Message Reaction Await
            else {
                
                // Message Reaction Insertion
                await responseMessage.react('✅')
                    .catch(error => logger.error(intLang('discord._errors.messageReactIneffective', error)));

                // Await Message Reaction
                responseMessage.awaitReactions((reaction, member) => reaction.emoji.name === '✅' && member.id === message.author.id, {max: 1, time: 600000, errors: ['time']})
                    .then(() => {

                        // NeDB Guilds Insertion
                        dbGuilds.insert({id: message.guild.id, name: message.guild.name, channels: {category: manualSettings.category, text: manualSettings.text, voice: manualSettings.voice}}, error => {
                            if (error) return logger.error(intLang('nedb._errors.guildsInsertIneffective', error));
            
                            // Success Response
                            messageEmbedSend(client, message.channel, false, intLang('commands.setup.manual.success.embedMessage.title'), intLang('commands.setup.manual.success.embedMessage.description', discord.prefix));
                        });
                    }).catch(() => message.reply(intLang('commands.setup._errors.responseTimeout')));
            }
        };

        // Manual Setup Verification
        function verifyManualSetup(section, response) {
            switch(section) {

                // Category Channel Setup Verification
                case 'categoryChannel':
                    let channelCategory = message.guild.channels.cache.get(response.content);
                    if (!channelCategory) return manualSetup('categoryChannel', 'unknownChannel');
                    if (channelCategory.type !== 'category') return manualSetup('categoryChannel', 'incorrectChannelType');
                    manualSettings.category = channelCategory.id;
                    return manualSetup('voiceChannel');

                // Voice Channel Setup Verification
                case 'voiceChannel':
                    let channelVoice = message.guild.channels.cache.get(response.content);
                    if (!channelVoice) return manualSetup('voiceChannel', 'unknownChannel');
                    if (channelVoice.type !== 'voice') return manualSetup('voiceChannel', 'incorrectChannelType');
                    if (channelVoice.parentID !== manualSettings.category) return manualSetup('voiceChannel', 'incorrectChannelCategory');
                    manualSettings.voice = channelVoice.id;
                    return manualSetup('textChannel');

                // Text Channel Setup Verification
                case 'textChannel':
                    let channelText = message.guild.channels.cache.get(response.content);
                    if (!channelText) return manualSetup('textChannel', 'unknownChannel');
                    if (channelText.type !== 'text') return manualSetup('textChannel', 'incorrectChannelType');
                    if (channelText.parentID !== manualSettings.category) return manualSetup('textChannel', 'incorrectChannelCategory');
                    manualSettings.text = channelText.id;
                    return manualSetup('permissions');
            }
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

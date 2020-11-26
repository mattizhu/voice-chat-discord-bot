const {dbVoiceChannels} = require('../../utilities/datastore');
const logger = require('../../config/logger');
const intLang = require('../../locale/language');

// Command Module
module.exports = {
    name: 'unlock',
    description: 'Unlocks your voice channel that allows everyone to join.',
    cooldown: 5,
    async execute(client, message) {

        // NeDB VoiceChannels Query
        dbVoiceChannels.findOne({id: message.member.voice.channelID, guild: message.guild.id}, async (error, VoiceChannel) => {
            if (error) return logger.error(intLang('nedb._errors.voiceChannelsFindOneIneffective', error));

            // Voice Channel Verification
            if (!message.member.voice.channel || message.member.voice.channel.id !== VoiceChannel.id) return message.reply(intLang('commands.unlock._errors.incorrectChannel'));
            if (!VoiceChannel || VoiceChannel.channelOwner !== message.author.id) return message.reply(intLang('commands.unlock._errors.unownedChannel'));

            // Voice Channel Permission Overwrites
            await message.member.voice.channel.updateOverwrite(message.guild.roles.everyone.id, {CONNECT: true}, intLang('commands.unlock.permissionOverwrites.everyoneUnlockReason'))
                .catch(error => logger.error(intLang('discord._errors.channelUpdateOverwriteIneffective', error)));

            // Success Response
            message.react('✅');
        });
    }
};

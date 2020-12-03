const {dbVoiceChannels} = require('../../utilities/datastore');
const logger = require('../../config/logger');
const intLang = require('../../locale/language');

// Command Module
module.exports = {
    name: 'lock',
    description: 'Locks your voice channel that prevents anyone from joining.',
    cooldown: 5,
    async execute(client, message) {

        // NeDB VoiceChannels Query
        dbVoiceChannels.findOne({id: message.member.voice.channelID, guild: message.guild.id}, async (error, VoiceChannel) => {
            if (error) return logger.error(intLang('nedb._errors.voiceChannelsFindOneIneffective', error));

            // Voice Channel Verification
            if (!message.member.voice.channel || !VoiceChannel || message.member.voice.channelID !== VoiceChannel.id) return message.reply(intLang('commands.lock._errors.incorrectChannel'));
            if (VoiceChannel.channelOwner !== message.author.id) return message.reply(intLang('commands.lock._errors.unownedChannel'));

            // Voice Channel Permission Overwrites
            await message.member.voice.channel.updateOverwrite(message.author.id, {CONNECT: true}, intLang('commands.lock.permissionOverwrites.userlockReason', message.author.tag))
                .catch(error => logger.error(intLang('discord._errors.channelUpdateOverwriteIneffective', error)));
            await message.member.voice.channel.updateOverwrite(message.guild.roles.everyone.id, {CONNECT: false}, intLang('commands.lock.permissionOverwrites.everyonelockReason'))
                .catch(error => logger.error(intLang('discord._errors.channelUpdateOverwriteIneffective', error)));

            // Success Response
            message.react('✅');
        });
    }
};

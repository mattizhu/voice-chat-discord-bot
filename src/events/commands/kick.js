const {dbVoiceChannels} = require('../../utilities/datastore');
const logger = require('../../config/logger');
const intLang = require('../../locale/language');

// Command Module
module.exports = {
    name: 'kick',
    description: 'Kicks a user from your voice channel.',
    arguments: true,
    usage: '<MemberMention>',
    cooldown: 5,
    async execute(client, message) {

        // NeDB VoiceChannels Query
        dbVoiceChannels.findOne({id: message.member.voice.channelID, guild: message.guild.id}, async (error, VoiceChannel) => {
            if (error) return logger.error(intLang('nedb._errors.voiceChannelsFindOneIneffective', error));

            // Voice Channel Verification
            if (!message.member.voice.channel || !VoiceChannel || message.member.voice.channelID !== VoiceChannel.id) return message.reply(intLang('commands.kick._errors.incorrectChannel'));
            if (VoiceChannel.channelOwner !== message.author.id) return message.reply(intLang('commands.kick._errors.unownedChannel'));

            // Member Mention Verification
            const member = message.mentions.members.first();
            if (!member) return message.reply(intLang('commands.kick._errors.invalidMember'));
            if (member.id === message.author.id) return message.reply(intLang('commands.kick._errors.selfMember'));
            if (!message.member.voice.channel.members.some(user => user.id === member.id)) return message.reply(intLang('commands.kick._errors.unknownMember'));

            // Voice Channel Member Disconnection
            await member.voice.kick(intLang('commands.kick.voiceKick.kickMemberReason', message.author.tag, member.user.tag))
                .catch(error => logger.error(intLang('discord._errors.channelKickIneffective', error)));
            
            // Success Response
            message.react('✅');
        });
    }
};

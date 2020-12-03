const {dbGuilds, dbVoiceChannels} = require('../utilities/datastore');
const logger = require('../config/logger');
const intLang = require('../locale/language');

// Event Emittion
module.exports = (client, oldState, newState) => {

    // Voice Channel Creation Function
    function createVoiceChannel(Guild) {
        const guild = newState.guild;
        const channelCategory = guild.channels.cache.get(Guild.channels.category);
        const member = newState.member;

        // NeDB VoiceChannels Query & Verification
        dbVoiceChannels.findOne({guild: newState.guild.id, channelOwner: member.id}, async (error, VoiceChannel) => {
            if (error) return logger.error(intLang('nedb._errors.voiceChannelsFindOneIneffective', error));
            if (VoiceChannel) return;

            // Voice Channel Creation
            const channelVoice = await guild.channels.create(intLang('discord.channels.voiceUser', member.user.username), {type: 'voice', parent: channelCategory, userLimit: 10, reason: intLang('events.voiceStateUpdate.channelVoiceReason', member.user.tag)})
                .catch(error => logger.error(intLang('discord._errors.channelCreateIneffective', error)));

            // Member Voice Channel Movement
            member.voice.setChannel(channelVoice);

            // NeDB VoiceChannels Insertion
            dbVoiceChannels.insert({id: channelVoice.id, guild: guild.id, channelOwner: member.id}, error => {
                if (error) return logger.error(intLang('nedb._errors.voiceChannelsInsertIneffective', error));
            });
        })
    };

    // Voice Channel Deletion Function
    function deleteVoiceChannel(Guild) {
        const guild = oldState.guild;
        const channel = oldState.channel;

        // Voice Channel Verification
        if (channel.parent.id !== Guild.channels.category || channel.id === Guild.channels.voice) return;
        if (channel.members.array().length) return;

        // NeDB VoiceChannels Removal
        dbVoiceChannels.remove({id: channel.id, guild: guild.id}, {}, error => {
            if (error) return logger.error(intLang('nedb._errors.voiceChannelsRemoveIneffective', error));

            // Voice Channel Deletion
            channel.delete()
                .catch(error => logger.error(intLang('discord._errors.channelDeleteIneffective', error)));
        });
    };

    // NeDB Guilds Query & Verification
    dbGuilds.findOne({id: newState.guild.id}, (error, Guild) => {
        if (error) return logger.error(intLang('nedb._errors.guildsFindOneIneffective', error));
        if (!Guild) return;

        // Member joins "Create a channel" Voice Channel
        if (newState.channelID === Guild.channels.voice) {
            createVoiceChannel(Guild);
        }

        // Member leaves Voice Channel
        if (oldState.channelID) {
            deleteVoiceChannel(Guild);
        }
    });
};

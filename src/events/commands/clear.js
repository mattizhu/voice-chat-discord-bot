const {dbGuilds} = require('../../utilities/datastore');
const logger = require('../../config/logger');
const intLang = require('../../locale/language');

// Command Module
module.exports = {
    name: 'clear',
    description: 'Clears all invalid voice channels in the datastore.',
    permission: true,
    hide: true,
    cooldown: 30,
    execute(client, message) {

        // NeDB VoiceChannels Query
        dbGuilds.findOne({id: message.guild.id}, async (error, Guild) => {
            if (error) return logger.error(intLang('nedb._errors.guildFindOneIneffective', error));

            // Voice Channel Deletion
            await message.guild.channels.cache.filter(channel => channel.parentID === Guild.channels.category).each(channel => {
                channel.fetch()
                    .then(channel => {
                        if (channel.type !== 'voice' || channel.id === Guild.channels.voice || channel.members.array().length) return;
                        channel.delete(intLang('commands.clear.voiceDelete.deleteChannelReason', message.author.tag))
                            .catch(error => logger.error(intLang('discord._errors.channelDeleteIneffective', error)));
                    }).catch(error => logger.error(intLang('discord._errors.channelFetchIneffective', error)));
            });

            // Success Response
            message.react('✅');
        });
    }
};

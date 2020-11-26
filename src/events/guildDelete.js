const {dbGuilds, dbVoiceChannels} = require('../utilities/datastore');
const logger = require('../config/logger');
const intLang = require('../locale/language');

// Event Emittion
module.exports = (client, guild) => {

    // NeDB Guilds Removal
    dbGuilds.remove({id: guild.id}, error => {
        if (error) return logger.error(intLang('nedb._errors.guildsRemoveIneffective', error));
    });

    // NeDB VoiceChannels Removal
    dbVoiceChannels.remove({guild: guild.id}, {multi: true}, error => {
        if (error) return logger.error(intLang('nedb._errors.voiceChannelsRemoveIneffective', error));
    });
};

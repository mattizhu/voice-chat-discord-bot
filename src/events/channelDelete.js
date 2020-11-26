const {dbVoiceChannels} = require('../utilities/datastore');
const logger = require('../config/logger');
const intLang = require('../locale/language');

// Event Emittion
module.exports = (client, channel) => {

    // NeDB VoiceChannels Removal
    dbVoiceChannels.remove({id: channel.id}, {}, error => {
        if (error) return logger.error(intLang('nedb._errors.voiceChannelsRemoveIneffective', error));
    });
};

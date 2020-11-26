const Datastore = require('nedb');

// NeDB Datastore Collections
const dbGuilds = new Datastore({filename: './data/guilds.db', autoload: true});
const dbVoiceChannels = new Datastore({filename: './data/voiceChannels.db', autoload: true});

// Datastore Module
module.exports = {

    // NeDB Guilds Queries
    dbGuilds: {
        
        // NeDB Guilds Find Query
        find: (query, callback) => {
            return dbGuilds.find(query, (error, document) => callback(error, document));
        },

        // NeDB Guilds FindOne Query
        findOne: (query, callback) => {
            return dbGuilds.findOne(query, (error, document) => callback(error, document));
        },

        // NeDB Guilds Insertion Query
        insert: (query, callback) => {
            return dbGuilds.insert(query, (error, document) => callback(error, document));
        },

        // NeDB Guilds Removal Query
        remove: (query, options, callback) => {
            return dbGuilds.remove(query, options, (error, document) => callback(error, document));
        }
    },

    // NeDB VoiceChannels Queries
    dbVoiceChannels: {
        
        // NeDB VoiceChannels Find Query
        find: (query, callback) => {
            return dbVoiceChannels.find(query, (error, document) => callback(error, document));
        },

        // NeDB VoiceChannels FindOne Query
        findOne: (query, callback) => {
            return dbVoiceChannels.findOne(query, (error, document) => callback(error, document));
        },

        // NeDB VoiceChannels Insertion Query
        insert: (query, callback) => {
            return dbVoiceChannels.insert(query, (error, document) => callback(error, document));
        },

        // NeDB VoiceChannels Removal Query
        remove: (query, options, callback) => {
            return dbVoiceChannels.remove(query, options, (error, document) => callback(error, document));
        }
    }
};

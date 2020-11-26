const {MessageEmbed} = require('discord.js');
const logger = require('../config/logger');
const intLang = require('../locale/language');
const {discord} = require('../config/config');

// Utilties Module
module.exports = {
    
    // Message Response
    messageEmbedSend(client, channel, thumbnail, title, description, footer) {
        const embedMessage = new MessageEmbed()
            .setColor(discord.embedColor)
            .setThumbnail(thumbnail ? client.user.avatarURL({format: 'png', size: 128}):'')
            .setTitle(title)
            .setDescription(description)
            .setFooter((footer ? footer:`Powered by ${client.user.username}`), client.user.avatarURL({format: 'png', size: 32}));
        return channel.send(embedMessage)
            .catch(error => logger.error(intLang('discord._errors.messageIneffective', error)));
    }
};

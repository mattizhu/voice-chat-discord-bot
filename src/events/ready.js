const logger = require('../config/logger');
const intLang = require('../locale/language');

// Event Emittion
module.exports = client => {

    // User Activity
    setInterval(() => {
        client.user.setActivity(intLang('events.ready.activity.name'), {type: intLang('events.ready.activity.type')});
    }, 30000);

    // Ready Success
    logger.info(intLang('events.ready.success', client.user.tag, client.guilds.cache.reduce((accumulator, value) => accumulator + value.memberCount, 0)));
};

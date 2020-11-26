const fs = require('fs');
const {settings} = require('../config/config');

// Language Locale Parser
module.exports = function() {
    const externals = arguments[0].split('.');
    let language = JSON.parse(fs.readFileSync(`${__dirname}/${settings.locale}.json`, 'utf8'));

    // Locate Language Value
    for (const external of externals) {
        if (language[external] != null) {
            language = language[external];
        }
    }
    if (Array.isArray(language)) return language[Math.floor(Math.random() * language.length)];
    if (typeof language !== 'string') return;

    // Parse Segments
    if (arguments.length > 2) {
        let args = [];
        for (i=1; i < arguments.length; i++) args.push(arguments[i]);
        for (const argument of args) language = language.replace(/%s/, argument);
    } else {
        language = language.replace(/%s/g, arguments[1]);
    }

    return language;
};

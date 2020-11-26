/**
 * Voice Chat Discord Bot
 * @version 0.1.0
 * @author Matthew Williams
 * @authorEmail mattwillcreative@gmail.com
 * @license MIT
 * 
 * The MIT License (MIT)
 * 
 * Copyright (c) 2020, Matthew Williams
 * 
 * Permission is hereby granted, free of charge, to any person obtaining a copy of this
 * software and associated documentation files (the "Software"), to deal in the Software
 * without restriction, including without limitation the rights to use, copy, modify, merge,
 * publish, distribute, sublicense, and/or sell copies of the Software, and to permit 
 * persons to whom the Software is furnished to do so, subject to the following conditions:
 * 
 * The above copyright notice and this permission notice shall be included in all copies or
 * substantial portions of the Software.
 * 
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED,
 * INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR
 * PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE
 * FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR
 * OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER
 * DEALINGS IN THE SOFTWARE.
 **/
const {Client, Collection} = require('discord.js');
const client = new Client();
const fs = require('fs');
const {discord} = require('./config/config');

// Discord Native Collections
client.commands = new Collection();
client.cooldowns = new Collection();

// Discord Dynamic API Events Collection
const events = fs.readdirSync(`${__dirname}/events`).filter(file => file.endsWith('.js'));
for (const file of events) {
    const event = require(`${__dirname}/events/${file}`);
    const name = file.split('.')[0];
    client.on(name, event.bind(null, client));
}

// Discord Dynamic Commands Collection
const commands = fs.readdirSync(`${__dirname}/events/commands`).filter(file => file.endsWith('.js'));
for (const file of commands) {
    const command = require(`${__dirname}/events/commands/${file}`);
    client.commands.set(command.name, command);
}

// Discord Client Login
client.login(discord.token);

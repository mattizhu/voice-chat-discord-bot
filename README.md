![alt text](https://repository-images.githubusercontent.com/316337111/efa212f8-4971-45e1-9434-b461af002f93)

VoiceChatBot is a Discord bot that is developed to allow Discord communities to create and manage their own voice channels.

## 📃 About
Too many channels in your community for your members to join? VoiceChatBot eliminates countless unused voice channels and generates voice channels for your community when in need.

When setup, your community can join a configured, permanent voice channel that allows them to generate a new voice channel and allow them to manage it using various commands. The voice channel will be automatically deleted once emptied.

## 🔐 Bot Permissions
The Discord bot requires certain global permissions in your server to be able to work properly:

- Manage Channels
- View Channels
- Send Messages
- Read Message History
- Connect
- Move Members

## 📡 Command List
### Administrator Commands
| Name | Commands | Description |
| ---- | -------- | ----------- |
| **Setup** | `$setup` | Setup the Discord bot to run on your server. |
| **Clear** | `$clear` | Deletes all vacant voice channels in your server and channels stored. |

> **Notice:** Only members who have the administrator global permission can execute these commands.

### Community Commands
| Name | Commands  | Channel Required? | Description |
| ---- | --------- | ----------------- | ---------- |
| **Help** | `$help`   || Displays list of commands. |
| **Lock** | `$lock`   | ✅ | Locks voice channels to prevent anyone from joining. |
| **Unlock** | `$unlock` | ✅ | Unlocks voice channels to allow anyone to join. |
| **Kick** | `$kick <@member>` | ✅ | Kicks a member out of the voice channel. |
| **Credits** | `$credits` | | Displays awesome contributors who made this bot possible. |

> **Notice:** Some commands require you to be inside your own voice channel.

## ⚙️ Install
### Install with npm

**Dependencies Install**

	npm install

**Run**

	npm start

## 😎 Author & Contributors
👤 **Mattizhu**
Twitter: [@Mattizhu](https://twitter.com/Mattizhu)
Github: [@Mattizhu](https://github.com/Mattizhu)
Discord: [Mattizhu#1993](https://discord.com/users/209966957385089024)

**Big Thanks to**
[@HuskiesxD](https://twitter.com/HuskiesxD) for feature ideas and taking time to test.

## 📑 MIT Licensing
MIT License. Copyright (c) 2012-2020, Matthew Williams

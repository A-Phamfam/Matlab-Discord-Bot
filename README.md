# Matlab-Discord-Bot

A bot for searching commands from MathWorks docs within Discord.
Allows for Octave integration through Discord chat when installed on a Linux system.   

See [help.md](https://github.com/matlab-discord/Matlab-Discord-Bot/blob/master/msg/help.md) for all commands or type `!help` in chat.

## Installation

1. Clone this repository (either to your PC or a host).
2. Create a new copy of the `.env.example` file and rename it to `.env` in the root directory.
2. Fill in each one of the environment variables in your new `.env` file.

    - ### Environment Variables
        `BOT_TOKEN` - Discord Client Secret token from the [Developer Portal](https://discord.com/developers/applications/) when you create a new application.

        `NEWS_CHANNEL_ID` - Discord channel ID for newest MathWorks blog posts and videos. This can be left blank.

        `DM_INTRO` - Set this boolean value to 1 (true) or 0 (false) to control if the bot sends an intro message to new users who join the server.

        `YOUTUBE_AUTH_KEY` - The Youtube authentication key used in the Youtube data api v3 for getting the last youtube video published on the MATLAB channel.

        `TWITTER_BEARER_TOKEN` - Twitter API OAuth 2.0 Bearer authorization token used for tweet pulling

        `OWNER_ID` - The user ID for the owner of the bot (You, probably!) for debugging purposes only.

        `GUILD_ID` - This is the "test" guild which commands are immediately registered to. Due to slash command registration, if the test guild is not listed here it will take about 1 hour for Discord to register the command globally.

        `BOT_ID` - The user ID of the bot. This is listed in the [Developer Portal](https://discord.com/developers/applications/) as "Application ID".

4. Install library dependencies with `npm install`.
The following libraries have been used:
    * [cheerio](https://github.com/cheeriojs/cheerio)
    * [discord.js](https://github.com/discordjs/discord.js/)
    * [dotenv](https://github.com/motdotla/dotenv)
    * [mustache.js](https://github.com/janl/mustache.js/)
    * [request](https://github.com/request/request)
    * [request-promise](https://github.com/request/request-promise)

5. Start the bot by running the following command. (Note: Make sure that you are using **Node 16.6 or greater**.)
    ```
    node index.js
    ```

## Structure

- Events such as `interactionCreate`, `messageCreate`, and `ready` are located in `./events`.

- Slash commands can be created in `./commands` using the format below.
   ```js
   const { SlashCommandBuilder } = require('@discordjs/builders');
   
   module.exports = {
       data: new SlashCommandBuilder()
           .setName('COMMAND_NAME')
           .setDescription('COMMAND_DESCRIPTION'),
       async execute(client, interaction) {
           // Command behavior
       },
   };
   ```
- The bot responds to commands with rendered messages. The templates for these messages are in the [msg](https://github.com/matlab-discord/Matlab-Discord-Bot/tree/master/msg) directory.


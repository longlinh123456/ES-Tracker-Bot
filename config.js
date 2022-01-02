"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.config = void 0;
const discord_js_1 = require("discord.js");
exports.config = {
    guildId: "926139718851256351",
    clientId: "926088136310808606",
    channelId: "926872409737420800",
    roleId: "926871029706539069",
    defaultEmbed() {
        return new discord_js_1.MessageEmbed()
            .setColor("BLUE")
            .setAuthor({ name: "ES Tracker Bot", iconURL: "https://i.imgur.com/vNUqpKcl.png" })
            .setTimestamp()
            .setThumbnail("https://i.imgur.com/vNUqpKcl.png")
            .setFooter({
            text: "Tracking ES retards since 2022",
            iconURL: "https://i.imgur.com/vNUqpKcl.png"
        });
    },
    defaultEmbedMessage(message, ephemeral = false) {
        return { embeds: [this.defaultEmbed()
                    .setDescription(message)],
            ephemeral: ephemeral
        };
    },
    gameId: 2262441883,
    checkInterval: 1.5 * 60 * 1000,
    notifyCooldown: 10 * 60 * 1000 // in ms
};

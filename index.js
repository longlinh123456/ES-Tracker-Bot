"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const fs_1 = __importDefault(require("fs"));
const discord_js_1 = require("discord.js");
const config_1 = require("./config");
const tracker_1 = require("./tracker/tracker");
(async () => {
    const token = process.env.TOKEN;
    const client = new discord_js_1.Client({ intents: [discord_js_1.Intents.FLAGS.GUILDS] });
    client.commands = new discord_js_1.Collection();
    const commandFiles = fs_1.default.readdirSync("./commands").filter(file => file.endsWith(".js"));
    for (const file of commandFiles) {
        const { command } = await Promise.resolve().then(() => __importStar(require(`./commands/${file}`)));
        client.commands.set(command.data.name, command);
    }
    client.once("ready", () => {
        console.log("Ready!");
        (0, tracker_1.tracker)(client);
    });
    client.on("interactionCreate", async (interaction) => {
        if (!interaction.isCommand())
            return;
        const command = client.commands.get(interaction.commandName);
        if (!command)
            return;
        try {
            await command.execute(interaction);
        }
        catch (error) {
            console.error(error);
            if (interaction.replied) {
                await interaction.editReply({ embeds: [config_1.config.defaultEmbed().setColor("RED").setDescription("There was an error while executing this command!")] });
                return;
            }
            else {
                return interaction.reply({ embeds: [config_1.config.defaultEmbed().setColor("RED").setDescription("There was an error while executing this command!")], ephemeral: true });
            }
        }
    });
    client.login(token);
})();

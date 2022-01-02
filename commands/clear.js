"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.command = void 0;
const builders_1 = require("@discordjs/builders");
const store_1 = require("../tracker/idStore/store");
const store_2 = require("../tracker/idDescriptionStore/store");
const config_1 = require("../config");
exports.command = {
    permissions: [{
            id: "926439540355387452",
            type: "ROLE",
            permission: true
        }],
    data: new builders_1.SlashCommandBuilder()
        .setName("clear")
        .setDescription("Clears target or tier description list.")
        .setDefaultPermission(false)
        .addSubcommand(subcommand => subcommand
        .setName("targets")
        .setDescription("Clears target list."))
        .addSubcommand(subcommand => subcommand
        .setName("descriptions")
        .setDescription("Clears description list."))
        .addSubcommand(subcommand => subcommand
        .setName("tier")
        .setDescription("Clears all targets in a tier.")
        .addIntegerOption(option => option
        .setName("tier")
        .setRequired(true)
        .setDescription("The tier whose targets should be cleared.")
        .setMinValue(1)
        .setMaxValue(20))),
    async execute(interaction) {
        if (interaction.options.getSubcommand() === "targets") {
            store_1.IDStore.clear();
            return interaction.reply(config_1.config.defaultEmbedMessage("Target list cleared!", true));
        }
        else if (interaction.options.getSubcommand() === "descriptions") {
            store_2.DescriptionStore.clear();
            return interaction.reply(config_1.config.defaultEmbedMessage("Tier description list cleared!", true));
        }
        else if (interaction.options.getSubcommand() === "tier") {
            const tier = interaction.options.getInteger("tier", true);
            if (tier > 20 || tier < 1)
                return interaction.reply({
                    embeds: [config_1.config.defaultEmbed().setDescription("Tier must be in the range of 1-20!").setColor("RED")],
                    ephemeral: true
                });
            store_1.IDStore.clearTier(tier);
            return interaction.reply(config_1.config.defaultEmbedMessage(`Targets in tier ${tier} cleared!`, true));
        }
    }
};

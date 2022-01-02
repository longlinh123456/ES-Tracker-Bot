"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.command = void 0;
const builders_1 = require("@discordjs/builders");
const store_1 = require("../tracker/idStore/store");
const config_1 = require("../config");
const store_2 = require("../tracker/idDescriptionStore/store");
exports.command = {
    permissions: [{
            id: "926439540355387452",
            type: "ROLE",
            permission: true
        }],
    data: new builders_1.SlashCommandBuilder()
        .setName("update")
        .setDescription("Updates a target or tier description.")
        .setDefaultPermission(false)
        .addSubcommand(subcommand => subcommand
        .setName("target")
        .setDescription("Updates a target in target list.")
        .addIntegerOption(option => option.setName("userid")
        .setDescription("The target's userId.")
        .setRequired(true)
        .setMinValue(1))
        .addIntegerOption(option => option.setName("tier")
        .setDescription("The tier the target should be in.")
        .setRequired(true)
        .setMinValue(1)
        .setMaxValue(20)))
        .addSubcommand(subcommand => subcommand
        .setName("description")
        .setDescription("Updates a tier's description from description list.")
        .addIntegerOption(option => option.setName("tier")
        .setDescription("The tier whose description should be updated.")
        .setRequired(true)
        .setMinValue(1)
        .setMaxValue(20))
        .addStringOption(option => option.setName("description")
        .setDescription("The description for the updated tier.")
        .setRequired(true))),
    async execute(interaction) {
        if (interaction.options.getSubcommand() === "target") {
            const targetId = interaction.options.getInteger("userid", true);
            const tier = interaction.options.getInteger("tier", true);
            if (targetId < 1)
                return interaction.reply({
                    embeds: [config_1.config.defaultEmbed().setDescription("Target's user ID must be larger than 0!").setColor("RED")],
                    ephemeral: true
                });
            if (tier > 20 || tier < 1)
                return interaction.reply({
                    embeds: [config_1.config.defaultEmbed().setDescription("Tier must be in the range of 1-20!").setColor("RED")],
                    ephemeral: true
                });
            store_1.IDStore.update(targetId, tier);
            interaction.reply(config_1.config.defaultEmbedMessage(`Target ${targetId} updated in the tracker!`, true));
        }
        else if (interaction.options.getSubcommand() === "description") {
            const description = interaction.options.getString("description", true);
            const tier = interaction.options.getInteger("tier", true);
            if (tier > 20 || tier < 1)
                return interaction.reply({
                    embeds: [config_1.config.defaultEmbed().setDescription("Tier must be in the range of 1-20!")],
                    ephemeral: true
                });
            store_2.DescriptionStore.update(tier, description);
            interaction.reply(config_1.config.defaultEmbedMessage(`Tier ${tier}'s description updated in the tracker!`, true));
        }
    },
};

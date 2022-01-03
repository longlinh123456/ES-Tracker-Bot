"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.command = void 0;
const builders_1 = require("@discordjs/builders");
const store_1 = require("../tracker/idStore/store");
const store_2 = require("../tracker/idDescriptionStore/store");
const config_1 = require("../config");
exports.command = {
    permissions: [{
            id: config_1.config.managerRoleId,
            type: "ROLE",
            permission: true
        }],
    data: new builders_1.SlashCommandBuilder()
        .setName("remove")
        .setDescription("Removes a target or tier description.")
        .setDefaultPermission(false)
        .addSubcommand(subcommand => subcommand
        .setName("target")
        .setDescription("Removes a target from target list.")
        .addIntegerOption(option => option.setName("userid")
        .setDescription("The target's userId.")
        .setRequired(true)
        .setMinValue(1)))
        .addSubcommand(subcommand => subcommand
        .setName("description")
        .setDescription("Removes a tier from description list.")
        .addIntegerOption(option => option.setName("tier")
        .setDescription("The removed description's tier.")
        .setRequired(true)
        .setMinValue(1)
        .setMaxValue(20))),
    async execute(interaction) {
        if (interaction.options.getSubcommand() === "target") {
            const targetId = interaction.options.getInteger("userid", true);
            if (targetId < 1)
                return interaction.reply({
                    embeds: [config_1.config.defaultEmbed().setDescription("Target's user ID must be larger than 0!").setColor("RED")],
                    ephemeral: true
                });
            try {
                await store_1.IDStore.remove(targetId);
                return interaction.reply(config_1.config.defaultEmbedMessage(`Target ${targetId} removed from the tracker!`, true));
            }
            catch (message) {
                return interaction.reply(config_1.config.defaultEmbedMessage(message, true));
            }
        }
        else if (interaction.options.getSubcommand() === "description") {
            const tier = interaction.options.getInteger("tier", true);
            if (tier > 20 || tier < 1)
                return interaction.reply({
                    embeds: [config_1.config.defaultEmbed().setDescription("Tier must be in the range of 1-20!").setColor("RED")],
                    ephemeral: true
                });
            try {
                await store_2.DescriptionStore.remove(tier);
                return interaction.reply(config_1.config.defaultEmbedMessage(`Description of tier ${tier} removed from the tracker!`, true));
            }
            catch (message) {
                return interaction.reply(config_1.config.defaultEmbedMessage(message, true));
            }
        }
    }
};

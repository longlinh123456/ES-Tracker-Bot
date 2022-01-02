import {SlashCommandBuilder} from "@discordjs/builders"
import {Command} from "../typings/command"
import {CommandInteraction} from "discord.js"
import {IDStore} from "../tracker/idStore/store"
import {DescriptionStore} from "../tracker/idDescriptionStore/store"
import {config} from "../config"
export const command: Command = {
	permissions: [{
		id: "926439540355387452",
		type: "ROLE",
		permission: true
	}],
	data: new SlashCommandBuilder()
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
				.setMaxValue(20)
			)
		) as SlashCommandBuilder,
	async execute(interaction: CommandInteraction) {
		if (interaction.options.getSubcommand() === "targets") {
			IDStore.clear()
			return interaction.reply(config.defaultEmbedMessage("Target list cleared!", true))
		}
		else if (interaction.options.getSubcommand() === "descriptions") {
			DescriptionStore.clear()
			return interaction.reply(config.defaultEmbedMessage("Tier description list cleared!", true))
		}
		else if (interaction.options.getSubcommand() === "tier") {
			const tier = interaction.options.getInteger("tier", true)
			if (tier > 20 || tier < 1) return interaction.reply({
				embeds: [config.defaultEmbed().setDescription("Tier must be in the range of 1-20!").setColor("RED")],
				ephemeral: true
			})
			IDStore.clearTier(tier)
			return interaction.reply(config.defaultEmbedMessage(`Targets in tier ${tier} cleared!`, true))
		}
	}
}
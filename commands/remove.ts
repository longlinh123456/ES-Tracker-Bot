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
		.setName("remove")
		.setDescription("Removes a target or tier description.")
		.setDefaultPermission(false)
		.addSubcommand(subcommand => subcommand
			.setName("target")
			.setDescription("Removes a target from target list.")
			.addIntegerOption(option =>
				option.setName("userid")
					.setDescription("The target's userId.")
					.setRequired(true)
					.setMinValue(1)
			))
		.addSubcommand(subcommand => subcommand
			.setName("description")
			.setDescription("Removes a tier from description list.")
			.addIntegerOption(option =>
				option.setName("tier")
					.setDescription("The removed description's tier.")
					.setRequired(true)
					.setMinValue(1)
					.setMaxValue(20)
			)) as SlashCommandBuilder,
	async execute(interaction: CommandInteraction) {
		if (interaction.options.getSubcommand() === "target") {
			const targetId = interaction.options.getInteger("userid", true)
			if (targetId < 1) return interaction.reply({
				embeds: [config.defaultEmbed().setDescription("Target's user ID must be larger than 0!").setColor("RED")],
				ephemeral: true
			})
			try {
				await IDStore.remove(targetId)
				return interaction.reply(config.defaultEmbedMessage(`Target ${targetId} removed from the tracker!`, true))
			}
			catch (message) {
				return interaction.reply(config.defaultEmbedMessage(message as string, true))
			}
		}
		else if (interaction.options.getSubcommand() === "description") {
			const tier = interaction.options.getInteger("tier", true)
			if (tier > 20 || tier < 1) return interaction.reply({
				embeds: [config.defaultEmbed().setDescription("Tier must be in the range of 1-20!").setColor("RED")],
				ephemeral: true
			})
			try {
				await DescriptionStore.remove(tier)
				return interaction.reply(config.defaultEmbedMessage(`Description of tier ${tier} removed from the tracker!`, true))
			}
			catch (message) {
				return interaction.reply(config.defaultEmbedMessage(message as string, true))
			}
		}
	}
}
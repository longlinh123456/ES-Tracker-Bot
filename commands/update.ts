import {SlashCommandBuilder} from "@discordjs/builders"
import {Command} from "../typings/command"
import {CommandInteraction} from "discord.js"
import {IDStore} from "../tracker/idStore/store"
import {config} from "../config"
import {DescriptionStore} from "../tracker/idDescriptionStore/store"
export const command: Command = {
	permissions: [{
		id: config.managerRoleId,
		type: "ROLE",
		permission: true
	}],
	data: new SlashCommandBuilder()
		.setName("update")
		.setDescription("Updates a target or tier description.")
		.setDefaultPermission(false)
		.addSubcommand(subcommand => subcommand
			.setName("target")
			.setDescription("Updates a target in target list.")
			.addIntegerOption(option =>
				option.setName("userid")
					.setDescription("The target's userId.")
					.setRequired(true)
					.setMinValue(1)
			)
			.addIntegerOption(option =>
				option.setName("tier")
					.setDescription("The tier the target should be in.")
					.setRequired(true)
					.setMinValue(1)
					.setMaxValue(20)
			))
		.addSubcommand(subcommand => subcommand
			.setName("description")
			.setDescription("Updates a tier's description from description list.")
			.addIntegerOption(option =>
				option.setName("tier")
					.setDescription("The tier whose description should be updated.")
					.setRequired(true)
					.setMinValue(1)
					.setMaxValue(20)
			)
			.addStringOption(option =>
				option.setName("description")
					.setDescription("The description for the updated tier.")
					.setRequired(true)
			)) as SlashCommandBuilder,
	async execute(interaction: CommandInteraction) {
		if (interaction.options.getSubcommand() === "target") {
			const targetId = interaction.options.getInteger("userid", true)
			const tier = interaction.options.getInteger("tier", true)
			if (targetId < 1) return interaction.reply({
				embeds: [config.defaultEmbed().setDescription("Target's user ID must be larger than 0!").setColor("RED")],
				ephemeral: true
			})
			if (tier > 20 || tier < 1) return interaction.reply({
				embeds: [config.defaultEmbed().setDescription("Tier must be in the range of 1-20!").setColor("RED")],
				ephemeral: true
			})
			await IDStore.update(targetId, tier)
			interaction.reply(config.defaultEmbedMessage(`Target ${targetId} updated in the tracker!`, true))
		}
		else if (interaction.options.getSubcommand() === "description") {
			const description = interaction.options.getString("description", true)
			const tier = interaction.options.getInteger("tier", true)
			if (tier > 20 || tier < 1) return interaction.reply({
				embeds: [config.defaultEmbed().setDescription("Tier must be in the range of 1-20!")],
				ephemeral: true
			})
			await DescriptionStore.update(tier, description)
			interaction.reply(config.defaultEmbedMessage(`Tier ${tier}'s description updated in the tracker!`, true))
		}
	},
}
import {SlashCommandBuilder} from "@discordjs/builders"
import {Command} from "../typings/command"
import {CommandInteraction, EmbedFieldData, MessageEmbed, MessageEmbedOptions} from "discord.js"
import {IDStore} from "../tracker/idStore/store"
import {DescriptionStore} from "../tracker/idDescriptionStore/store"
import {config} from "../config"
import {APIEmbed} from "discord-api-types"
import noblox from "noblox.js"
export const command: Command = {
	permissions: [{
		id: config.managerRoleId,
		type: "ROLE",
		permission: true
	}],
	data: new SlashCommandBuilder()
		.setName("list")
		.setDescription("Displays target list.")
		.setDefaultPermission(false) as SlashCommandBuilder,
	async execute(interaction: CommandInteraction) {
		await interaction.deferReply({ephemeral: true})
		const list: Record<number, number[]> = {}
		const descriptionList = await DescriptionStore.getAll()
		const processedList: EmbedFieldData[] = []
		for (const target of await IDStore.getAll()) {
			list[target.tier] ??= []
			list[target.tier].push(target.userId)
		}
		for (const tier in list) {
			const listWithUsernames: string[] = []
			for (const userId of list[tier]) {
				try {
					const username = await noblox.getUsernameFromId(userId)
					listWithUsernames.push(`${userId} (${username})`)
				} 
				catch {
					listWithUsernames.push(`${userId} (failed to get username)`)
				}
			}
			const tierName = descriptionList[tier] ? `Tier ${tier} (${descriptionList[tier]}):` : `Tier ${tier}:`
			processedList.push({
				name: tierName,
				value: listWithUsernames.join(", ")
			})
		}
		for (const tier in descriptionList) {
			const tierName = descriptionList[tier] ? `Tier ${tier} (${descriptionList[tier]}):` : `Tier ${tier}:`
			if (!list[tier]) processedList.push({
				name: tierName,
				value: "(empty)"
			})
		}
		let embed: MessageEmbed | MessageEmbedOptions | APIEmbed
		if (processedList.length > 0) {
			embed = config.defaultEmbed()
				.setTitle("Tracker target list:")
				.addFields(...processedList)
		}
		else {
			embed = config.defaultEmbed()
				.setTitle("Tracker target list:")
				.setDescription("(empty)")
		}
		return interaction.editReply({embeds: [embed]})
	}
}
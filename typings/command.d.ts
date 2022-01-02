import {SlashCommandBuilder} from "@discordjs/builders"
import {ApplicationCommandPermissionData, ApplicationCommandPermissionType} from "discord.js"
export interface Command {
	readonly data: SlashCommandBuilder
	readonly execute: function
	readonly permissions?: CommandPermission[]
}
export interface CommandModule {
	readonly command: Command
}
export interface ApiGuildApplicationCommandPermissionData {
	name: string
	version: string
	id: string
	application_id: string
	default_permission: false
	type: ApplicationCommandPermissionType | 1 | 2
	description: string
	guild_id: string
	options: ApplicationCommandPermissionData[]
}
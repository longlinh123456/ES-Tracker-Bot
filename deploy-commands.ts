import fs from "fs"
import {REST} from "@discordjs/rest"
import {RESTPostAPIApplicationCommandsJSONBody, Routes} from "discord-api-types/v9"
import {ApiGuildApplicationCommandPermissionData, Command} from "./typings/command"
import dotenv from "dotenv"
import {config} from "./config"
import {ApplicationCommandPermissionData, GuildApplicationCommandPermissionData} from "discord.js"

dotenv.config()
const clientId = config.clientId
const token = process.env.token
const guildId = config.guildId

const commandPermissions: Record<string, ApplicationCommandPermissionData[]> = {}
const commandIDs: Record<string, string> = {}
const commandPermissionList: GuildApplicationCommandPermissionData[] = []
const commandsJSONString: RESTPostAPIApplicationCommandsJSONBody[] = []
const commandFiles = fs.readdirSync("./commands").filter(file => file.endsWith(".js"));

(async() => {
	for (const file of commandFiles) {
		const {command}: {command: Command} = await import(`./commands/${file}`)
		if (command.permissions) commandPermissions[command.data.name] = command.permissions
		commandsJSONString.push(command.data.toJSON())
	}
	if (clientId && token && guildId) {
		const rest = new REST({version: "9"}).setToken(token)
		const commandPermissionData = await rest.put(Routes.applicationGuildCommands(clientId, guildId), {body: commandsJSONString}) as ApiGuildApplicationCommandPermissionData[]
		commandPermissionData.forEach((command) => commandIDs[command.name] = command.id)

		for (const commandName in commandPermissions) {
			const processedCommandPermissions = commandPermissions[commandName]
			processedCommandPermissions.map(permission => {
				if (permission.type === "ROLE") permission.type = 1
				if (permission.type === "USER") permission.type = 2
				return permission
			})
			commandPermissions[commandName] = processedCommandPermissions
		}
		for (const commandName in commandIDs) {
			commandPermissionList.push({
				id: commandIDs[commandName],
				permissions: commandPermissions[commandName]
			})
		}
		await rest.put(Routes.guildApplicationCommandsPermissions(clientId, guildId), {
			body: commandPermissionList
		})
		console.log("Successfully deployed commands!")
	}
	else {
		throw "One of more environmental variables are not defined"
	}
})()
import fs from "fs"
import {Client, Collection, Intents, TextChannel} from "discord.js"
import {ClientWithCommands} from "./typings/client"
import {Command} from "./typings/command"
import {config} from "./config"
import {tracker} from "./tracker/tracker"
(async() => {
	const token = process.env.TOKEN
	const client = new Client({intents: [Intents.FLAGS.GUILDS]}) as ClientWithCommands
	
	client.commands = new Collection<string, Command>()
	const commandFiles = fs.readdirSync("./commands").filter(file => file.endsWith(".js"))

	for (const file of commandFiles) {
		const {command}: {command: Command} = await import(`./commands/${file}`)
		client.commands.set(command.data.name, command)
	}

	client.once("ready", () => {
		console.log("Ready!")
		tracker(client)
	})

	client.on("interactionCreate", async interaction => {
		if (!interaction.isCommand()) return

		const command = client.commands.get(interaction.commandName)

		if (!command) return

		try {
			await command.execute(interaction)
		}
		catch (error) {
			console.error(error)
			if (interaction.replied) {
				return interaction.reply({embeds: [config.defaultEmbed().setColor("RED").setDescription("There was an error while executing this command!")], ephemeral: true})
			}
			else {
				await interaction.editReply({embeds: [config.defaultEmbed().setColor("RED").setDescription("There was an error while executing this command!")]})
				return
			}
		}
	})

	client.login(token)
})()
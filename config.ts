import {MessageEmbed} from "discord.js"

export const config = {
	guildId: "926139718851256351",
	clientId: "926088136310808606",
	channelId: "926872409737420800",
	roleId: "926871029706539069",
	defaultEmbed() {
		return new MessageEmbed()
			.setColor("BLUE")
			.setAuthor({name: "ES Tracker Bot", iconURL: "https://i.imgur.com/vNUqpKcl.png"})
			.setTimestamp()
			.setThumbnail("https://i.imgur.com/vNUqpKcl.png")
			.setFooter({
				text: "Tracking ES retards since 2022", 
				iconURL: "https://i.imgur.com/vNUqpKcl.png"
			})
	},
	defaultEmbedMessage(message, ephemeral = false) {
		return {embeds: [this.defaultEmbed()
			.setDescription(message)],
		ephemeral: ephemeral
		}
	},
	gameId: 2262441883, // game id to track
	checkInterval: 1.5 * 60 * 1000, // in ms
	notifyCooldown: 10 * 60 * 1000 // in ms
}
import * as tsRetry from "ts-retry"
import noblox, {GameInstance} from "noblox.js"
import _ from "lodash"
import {ClientWithCommands} from "../typings/client"
import {IDStore} from "./idStore/store"
import {DescriptionStore} from "./idDescriptionStore/store"
import {config} from "../config"
import {TextChannel} from "discord.js"
import {ReturnedTarget} from "../typings/target"
if (process.env.COOKIE) noblox.setCookie(process.env.COOKIE)
async function getServers(gameId: number): Promise<GameInstance[]> {
	const servers: GameInstance[] = []
	let currentServerIndex = 0
	do {
		const currentServers = await tsRetry.retryAsync(() => noblox.getGameInstances(gameId, currentServerIndex), {
			delay: 1500,
			maxTry: 5
		})
		if (currentServers.Collection.length < 10) {
			break
		}
		servers.push(...currentServers.Collection)
		currentServerIndex += currentServers.Collection.length
	// eslint-disable-next-line no-constant-condition
	} while (true)
	return servers
}
async function findPlayersInServers(userIds: number[], gameId: number) {
	const headshotUrls: Record<string, number> = {};
	(await noblox.getPlayerThumbnail(userIds, 48, "png", false, "headshot")).forEach((thumbnailData) => headshotUrls[thumbnailData.imageUrl as string] = thumbnailData.targetId)
	const servers = (await getServers(gameId))
	const serverHeadshotUrlsToServerIds: Record<string, string> = {}
	servers.map(server => {
		return {
			id: server.Guid,
			players: server.CurrentPlayers
		}
	}).forEach(({id, players}) => {
		players
			.map(player => player.Thumbnail.Url)
			.forEach(headshotUrl => {
				serverHeadshotUrlsToServerIds[headshotUrl] = id
			})
	})
	const returnedPlayersAndServers: Record<number, string> = {}
	_.intersection(_.keys(headshotUrls), _.keys(serverHeadshotUrlsToServerIds)).forEach(headshotUrl => {
		returnedPlayersAndServers[headshotUrls[headshotUrl]] = serverHeadshotUrlsToServerIds[headshotUrl]
	})
	return returnedPlayersAndServers
}
export async function tracker(client: ClientWithCommands) {
	let lastNotified: Record<number, number> = {}
	lastNotified = await trackerCycle(client, lastNotified)
	setInterval(async() => {
		try {
			lastNotified = await trackerCycle(client, lastNotified)
		}
		catch (error) {
			console.log(error)
			try {
				(client.channels.cache.get(config.channelId) as TextChannel).send({embeds: [config.defaultEmbed().setColor("RED").setDescription("There was an error while executing this check cycle!")]})
			}
			catch (error) {
				console.log(`Failed to send error message to tracker channel, error:\n${error}`)
			}
		}
	}, config.checkInterval)
}

async function trackerCycle(client: ClientWithCommands, lastNotified: Record<number, number>) {
	(client.channels.cache.get(config.channelId) as TextChannel).bulkDelete(100)
	const idDB: Record<number, number> = {};
	(await IDStore.getAll()).forEach((target: ReturnedTarget) => idDB[target.userId] = target.tier)
	const descriptionDB = await DescriptionStore.getAll()
	const trackedIds = _.keys(idDB).map(id => Number(id))
	if (trackedIds.length > 0) {
		const activePlayersAndServerIds = await findPlayersInServers(trackedIds, config.gameId)
		for (const userId in activePlayersAndServerIds) {
			lastNotified[userId] ??= 0
			let pingContent
			if (Date.now() - lastNotified[userId] >= config.notifyCooldown)
				pingContent = `<@&${config.pingRoleId}>`
			await (client.channels.cache.get(config.channelId) as TextChannel).send({
				content: pingContent,
				embeds: [
					config.defaultEmbed()
						.setTitle(`Target ${await tsRetry.retryAsync(() => noblox.getUsernameFromId(parseInt(userId)), {
							delay: 1000,
							maxTry: 5
						})} at Tier ${idDB[userId]} (${descriptionDB[idDB[userId]]}) detected!`)
						.setURL(`https://www.roblox.com/users/${userId}/profile`)
						.setImage((await tsRetry.retryAsync(() => noblox.getPlayerThumbnail(parseInt(userId), 180, "png", false, "body"), {
							delay: 1000,
							maxTry: 5
						}))[0].imageUrl as string)
						.addFields(
							{name: "User ID", value: userId, inline: true},
							{
								name: "Account Age", value: `${String(await tsRetry.retryAsync(async() => (await noblox.getPlayerInfo(parseInt(userId))).age, {
									delay: 1000,
									maxTry: 5
								}) as number)} days`,
								inline: true
							},
							{name: "Gamepasses", value: `https://www.roblox.com/users/${userId}/inventory#!/game-passes`, inline: true},
							{name: "Server Join Link", value: `https://www.roblox.com/home?placeId=${config.gameId}&gameId=${activePlayersAndServerIds[userId]}`}
						)
				]
			})
			lastNotified[userId] = Date.now()
		}
		if (_.keys(activePlayersAndServerIds).length === 0)
			await (client.channels.cache.get(config.channelId) as TextChannel).send(config.defaultEmbedMessage("No targets detected for this check cycle!"))
		return lastNotified
	}
	else {
		await (client.channels.cache.get(config.channelId) as TextChannel).send(config.defaultEmbedMessage("No targets to check for this check cycle!"))
		return lastNotified
	}
}

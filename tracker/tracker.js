"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.tracker = void 0;
const tsRetry = __importStar(require("ts-retry"));
const noblox_js_1 = __importDefault(require("noblox.js"));
const lodash_1 = __importDefault(require("lodash"));
const store_1 = require("./idStore/store");
const store_2 = require("./idDescriptionStore/store");
const config_1 = require("../config");
if (process.env.COOKIE)
    noblox_js_1.default.setCookie(process.env.COOKIE);
async function getServers(gameId) {
    const servers = [];
    let currentServerIndex = 0;
    do {
        const currentServers = await tsRetry.retryAsync(() => noblox_js_1.default.getGameInstances(gameId, currentServerIndex), {
            delay: 1500,
            maxTry: 5
        });
        if (currentServers.Collection.length < 10) {
            break;
        }
        servers.push(...currentServers.Collection);
        currentServerIndex += currentServers.Collection.length;
        // eslint-disable-next-line no-constant-condition
    } while (true);
    return servers;
}
async function findPlayersInServers(userIds, gameId) {
    const headshotUrls = {};
    (await noblox_js_1.default.getPlayerThumbnail(userIds, 48, "png", false, "headshot")).forEach((thumbnailData) => headshotUrls[thumbnailData.imageUrl] = thumbnailData.targetId);
    const servers = (await getServers(gameId));
    const serverHeadshotUrlsToServerIds = {};
    servers.map(server => {
        return {
            id: server.Guid,
            players: server.CurrentPlayers
        };
    }).forEach(({ id, players }) => {
        players
            .map(player => player.Thumbnail.Url)
            .forEach(headshotUrl => {
            serverHeadshotUrlsToServerIds[headshotUrl] = id;
        });
    });
    const returnedPlayersAndServers = {};
    lodash_1.default.intersection(lodash_1.default.keys(headshotUrls), lodash_1.default.keys(serverHeadshotUrlsToServerIds)).forEach(headshotUrl => {
        returnedPlayersAndServers[headshotUrls[headshotUrl]] = serverHeadshotUrlsToServerIds[headshotUrl];
    });
    return returnedPlayersAndServers;
}
async function tracker(client) {
    let lastNotified = {};
    lastNotified = await trackerCycle(client, lastNotified);
    setInterval(async () => {
        lastNotified = await trackerCycle(client, lastNotified);
    }, config_1.config.checkInterval);
}
exports.tracker = tracker;
async function trackerCycle(client, lastNotified) {
    client.channels.cache.get(config_1.config.channelId).bulkDelete(100);
    const idDB = {};
    (await store_1.IDStore.getAll()).forEach((target) => idDB[target.userId] = target.tier);
    const descriptionDB = await store_2.DescriptionStore.getAll();
    const trackedIds = lodash_1.default.keys(idDB).map(id => Number(id));
    if (trackedIds.length > 0) {
        const activePlayersAndServerIds = await findPlayersInServers(trackedIds, config_1.config.gameId);
        for (const userId in activePlayersAndServerIds) {
            lastNotified[userId] ?? (lastNotified[userId] = 0);
            let pingContent;
            if (Date.now() - lastNotified[userId] >= config_1.config.notifyCooldown)
                pingContent = `<@&${config_1.config.pingRoleId}>`;
            await client.channels.cache.get(config_1.config.channelId).send({
                content: pingContent,
                embeds: [
                    config_1.config.defaultEmbed()
                        .setTitle(`Target ${await tsRetry.retryAsync(() => noblox_js_1.default.getUsernameFromId(parseInt(userId)), {
                        delay: 1000,
                        maxTry: 5
                    })} at Tier ${idDB[userId]} (${descriptionDB[idDB[userId]]}) detected!`)
                        .setURL(`https://www.roblox.com/users/${userId}/profile`)
                        .setImage((await tsRetry.retryAsync(() => noblox_js_1.default.getPlayerThumbnail(parseInt(userId), 180, "png", false, "body"), {
                        delay: 1000,
                        maxTry: 5
                    }))[0].imageUrl)
                        .addFields({ name: "User ID", value: userId, inline: true }, {
                        name: "Account Age", value: `${String(await tsRetry.retryAsync(async () => (await noblox_js_1.default.getPlayerInfo(parseInt(userId))).age, {
                            delay: 1000,
                            maxTry: 5
                        }))} days`,
                        inline: true
                    }, { name: "Gamepasses", value: `https://www.roblox.com/users/${userId}/inventory#!/game-passes`, inline: true }, { name: "Server Join Link", value: `https://www.roblox.com/home?placeId=${config_1.config.gameId}&gameId=${activePlayersAndServerIds[userId]}` })
                ]
            });
            lastNotified[userId] = Date.now();
        }
        if (lodash_1.default.keys(activePlayersAndServerIds).length === 0)
            await client.channels.cache.get(config_1.config.channelId).send(config_1.config.defaultEmbedMessage("No targets detected for this check cycle!"));
        return lastNotified;
    }
    else {
        await client.channels.cache.get(config_1.config.channelId).send(config_1.config.defaultEmbedMessage("No targets to check for this check cycle!"));
        return lastNotified;
    }
}

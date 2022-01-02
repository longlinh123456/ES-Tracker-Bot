"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.command = void 0;
const builders_1 = require("@discordjs/builders");
const store_1 = require("../tracker/idStore/store");
const store_2 = require("../tracker/idDescriptionStore/store");
const config_1 = require("../config");
const noblox_js_1 = __importDefault(require("noblox.js"));
exports.command = {
    permissions: [{
            id: "926439540355387452",
            type: "ROLE",
            permission: true
        }],
    data: new builders_1.SlashCommandBuilder()
        .setName("list")
        .setDescription("Displays target list.")
        .setDefaultPermission(false),
    async execute(interaction) {
        var _a;
        await interaction.deferReply({ ephemeral: true });
        const list = {};
        const descriptionList = store_2.DescriptionStore.getAll();
        const processedList = [];
        for (const target of store_1.IDStore.getAll()) {
            list[_a = target.tier] ?? (list[_a] = []);
            list[target.tier].push(target.userId);
        }
        for (const tier in list) {
            const listWithUsernames = [];
            for (const userId of list[tier]) {
                try {
                    const username = await noblox_js_1.default.getUsernameFromId(userId);
                    listWithUsernames.push(`${userId} (${username})`);
                }
                catch {
                    listWithUsernames.push(`${userId} (failed to get username)`);
                }
            }
            const tierName = descriptionList[tier] ? `Tier ${tier} (${descriptionList[tier]}):` : `Tier ${tier}:`;
            processedList.push({
                name: tierName,
                value: listWithUsernames.join(", ")
            });
        }
        for (const tier in descriptionList) {
            const tierName = descriptionList[tier] ? `Tier ${tier} (${descriptionList[tier]}):` : `Tier ${tier}:`;
            if (!list[tier])
                processedList.push({
                    name: tierName,
                    value: "(empty)"
                });
        }
        let embed;
        if (processedList.length > 0) {
            embed = config_1.config.defaultEmbed()
                .setTitle("Tracker target list:")
                .addFields(...processedList);
        }
        else {
            embed = config_1.config.defaultEmbed()
                .setTitle("Tracker target list:")
                .setDescription("(empty)");
        }
        return interaction.editReply({ embeds: [embed] });
    }
};

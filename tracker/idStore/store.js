"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.IDStore = void 0;
const node_json_file_storage_1 = __importDefault(require("node-json-file-storage"));
const storage = new node_json_file_storage_1.default("./idStore.json");
class IDStore {
    static update(userId, tier) {
        storage.put({
            id: userId,
            tier: tier
        });
    }
    static remove(userId) {
        if (this.get(userId))
            storage.remove(userId);
        else
            throw "You can't remove a non-existent target!";
    }
    static get(userId) {
        if (typeof userId === "number") {
            const target = storage.get(userId);
            return {
                userId: target.id,
                tier: target.tier
            };
        }
        else
            return;
    }
    static getAll() {
        const db = storage.all();
        const returnedList = [];
        for (const id in db) {
            returnedList.push({
                userId: db[id].id,
                tier: db[id].tier
            });
        }
        return returnedList;
    }
    static clear() {
        storage.clear();
    }
    static clearTier(tier) {
        const db = this.getAll();
        const sortedDB = {};
        sortedDB[tier] = [];
        for (const target of db) {
            if (target.tier === tier) {
                sortedDB[tier].push(target.userId);
            }
        }
        storage.removeBulk(sortedDB[tier]);
    }
}
exports.IDStore = IDStore;

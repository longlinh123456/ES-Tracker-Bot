"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.DescriptionStore = void 0;
const node_json_file_storage_1 = __importDefault(require("node-json-file-storage"));
const fs_1 = __importDefault(require("fs"));
fs_1.default.mkdir("./.data", { recursive: true }, () => {
    console.log("already made .data folder");
});
const storage = new node_json_file_storage_1.default("./.data/idDescriptionStore.json");
class DescriptionStore {
    static async update(tier, description) {
        storage.put({
            id: tier,
            description: description
        });
    }
    static async remove(tier) {
        if (await this.get(tier))
            storage.remove(tier);
        else
            throw "You can't remove a non-existent description!";
    }
    static async get(tier) {
        if (typeof tier === "number") {
            return storage.get(tier).description;
        }
        else
            return;
    }
    static async getAll() {
        const returnedDescriptions = {};
        const db = storage.all();
        for (const tier in db) {
            returnedDescriptions[tier] = db[tier].description;
        }
        return returnedDescriptions;
    }
    static async clear() {
        storage.clear();
    }
}
exports.DescriptionStore = DescriptionStore;

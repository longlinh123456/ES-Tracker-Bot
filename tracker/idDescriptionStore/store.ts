import JSONFileStorage from "node-json-file-storage"
import {TierDescription} from "../../typings/tiers"
import fs from "fs"
fs.mkdir("./.data", {recursive: true}, () => {
	console.log("already made .data folder")
})
const storage = new JSONFileStorage("./.data/idDescriptionStore.json")
export class DescriptionStore {
	static async update(tier: number, description: string): Promise<void> {
		storage.put({
			id: tier,
			description: description
		})
	}
	static async remove(tier: number): Promise<void> {
		if (await this.get(tier)) storage.remove(tier)
		else throw "You can't remove a non-existent description!"
	}
	static async get(tier?: number): Promise<string | void> {
		if (typeof tier === "number") {
			return storage.get(tier).description
		}
		else return
	}
	static async getAll(): Promise<Record<number, string>> {
		const returnedDescriptions: Record<number, string> = {}
		const db: Record<string, TierDescription> = storage.all()
		for (const tier in db) {
			returnedDescriptions[tier] = db[tier].description
		}
		return returnedDescriptions
	}
	static async clear(): Promise<void> {
		storage.clear()
	}
}
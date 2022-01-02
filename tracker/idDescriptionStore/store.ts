import JSONFileStorage from "node-json-file-storage"
import {TierDescription} from "../../typings/tiers"
const storage = new JSONFileStorage("./.data/idDescriptionStore.json")
export class DescriptionStore {
	static update(tier: number, description: string): void {
		storage.put({
			id: tier,
			description: description
		})
	}
	static remove(tier: number): void {
		if (this.get(tier)) storage.remove(tier)
		else throw "You can't remove a non-existent description!"
	}
	static get(tier?: number): string | void {
		if (typeof tier === "number") {
			return storage.get(tier).description
		}
		else return
	}
	static getAll(): Record<number, string> {
		const returnedDescriptions: Record<number, string> = {}
		const db: Record<string, TierDescription> = storage.all()
		for (const tier in db) {
			returnedDescriptions[tier] = db[tier].description
		}
		return returnedDescriptions
	}
	static clear(): void {
		storage.clear()
	}
}
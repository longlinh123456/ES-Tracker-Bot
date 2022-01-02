import JSONFileStorage from "node-json-file-storage"
import {ReturnedTarget, Target} from "../../typings/target"
const storage = new JSONFileStorage("./.data/idStore.json")
export class IDStore {
	static update(userId: number, tier: number): void {
		storage.put({
			id: userId,
			tier: tier
		})
	}
	static remove(userId: number): void {
		if (this.get(userId)) storage.remove(userId)
		else throw "You can't remove a non-existent target!"
	}
	static get(userId?: number): ReturnedTarget | void {
		if (typeof userId === "number") {
			const target = storage.get(userId)
			return {
				userId: target.id,
				tier: target.tier
			}
		}
		else return
	}
	static getAll(): ReturnedTarget[] {
		const db: Record<string, Target> = storage.all()
		const returnedList: ReturnedTarget[] = []
		for (const id in db) {
			returnedList.push({
				userId: db[id].id,
				tier: db[id].tier
			})
		}
		return returnedList
	}
	static clear(): void {
		storage.clear()
	}
	static clearTier(tier: number): void {
		const db = this.getAll()
		const sortedDB: Record<number, number[]> = {}
		sortedDB[tier] = []
		for (const target of db) {
			if (target.tier === tier) {
				sortedDB[tier].push(target.userId)
			}
		}
		storage.removeBulk(sortedDB[tier])
	}
}
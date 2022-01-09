import JSONFileStorage from "node-json-file-storage"
import {ReturnedTarget, Target} from "../../typings/target"
import fs from "fs"
fs.mkdir("./.data", {recursive: true}, () => {
	console.log("already made .data folder")
})
const storage = new JSONFileStorage("./.data/idStore.json")
export class IDStore {
	static async update(userId: number, tier: number): Promise<void> {
		storage.put({
			id: userId,
			tier: tier
		})
	}
	static async remove(userId: number): Promise<void> {
		if (await this.get(userId)) storage.remove(userId)
		else throw new Error("You can't remove a non-existent target!")
	}
	static async get(userId?: number): Promise<void | ReturnedTarget> {
		if (typeof userId === "number") {
			const target = storage.get(userId)
			return {
				userId: target.id,
				tier: target.tier
			}
		}
		else return
	}
	static async getAll(): Promise<ReturnedTarget[]> {
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
	static async clear(): Promise<void> {
		storage.clear()
	}
	static async clearTier(tier: number): Promise<void> {
		const db = await this.getAll()
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
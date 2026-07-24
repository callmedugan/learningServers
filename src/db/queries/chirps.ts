import { asc } from "drizzle-orm";
import { db } from "../index.js";
import { ChirpRecord, chirps } from "../schema.js";

export async function createChirp(chirp: ChirpRecord): Promise<ChirpRecord> {
	const [result] = await db
		.insert(chirps)
		.values(chirp)
		.onConflictDoNothing()
		.returning();
	return result;
}

export async function getAllChirps(): Promise<ChirpRecord[]> {
	const result = await db.select().from(chirps).orderBy(asc(chirps.createdAt));
	return result;
}

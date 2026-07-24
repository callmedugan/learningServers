import { db } from "../index.js";
import { UserRecord, users } from "../schema.js";

export async function createUser(user: UserRecord) {
	const [result] = await db
		.insert(users)
		.values(user)
		.onConflictDoNothing()
		.returning();
	return result;
}

export async function deleteAll() {
	const [result] = await db.delete(users).returning();
	return result;
}

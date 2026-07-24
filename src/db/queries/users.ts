import { eq } from "drizzle-orm";
import { db } from "../index.js";
import { UserRecordReq as UserRecord, users } from "../schema.js";

export async function createUser(user: UserRecord): Promise<UserRecord> {
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

export async function getUserByEmail(email: string): Promise<UserRecord> {
	const [result] = await db.select().from(users).where(eq(users.email, email));
	return result;
}

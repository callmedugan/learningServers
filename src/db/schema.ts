import { pgTable, timestamp, varchar, uuid, text } from "drizzle-orm/pg-core";

export const users = pgTable("users", {
	id: uuid("id").primaryKey().defaultRandom(),
	createdAt: timestamp("created_at").notNull().defaultNow(),
	updatedAt: timestamp("updated_at")
		.notNull()
		.defaultNow()
		.$onUpdate(() => new Date()),
	email: varchar("email", { length: 256 }).unique().notNull(),
	hashedPassword: varchar("hashed_password").notNull().default("unset"),
});

export const chirps = pgTable("chirps", {
	id: uuid("id").primaryKey().defaultRandom(),
	createdAt: timestamp("created_at").notNull().defaultNow(),
	updatedAt: timestamp("updated_at")
		.notNull()
		.defaultNow()
		.$onUpdate(() => new Date()),
	body: text("body").notNull(),
	userId: uuid("user_id")
		.notNull()
		.references(() => users.id, { onDelete: "cascade" }),
});

//infers the type of a row based on the table
export type UserRecordReq = typeof users.$inferInsert;
//export type UserRecordRes = Omit<UserRecordReq, "hashedPassword">;
export type ChirpRecord = typeof chirps.$inferInsert;

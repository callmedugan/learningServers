import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";

import * as schema from "./schema.js";
import { config } from "../config.js";

import type { MigrationConfig } from "drizzle-orm/migrator";

//create db var
const conn = postgres(config.db.URL);
export const db = drizzle(conn, { schema });

//set migration out folder
export const migrationConfig: MigrationConfig = {
	migrationsFolder: "./src/db/migrations",
};

export type DBConfig = {
	URL: string;
	migrationConfig: MigrationConfig;
};

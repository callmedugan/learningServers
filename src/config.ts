import type { MigrationConfig } from "drizzle-orm/migrator";
import dotenv from "dotenv";

//on startup check env vars
dotenv.config();
if (process.env.DB_URL == null || process.env.PLATFORM == null) {
	throw new Error("env variable missing");
}
export const envVariables = {
	dbURL: process.env.DB_URL,
	platform: process.env.PLATFORM,
};

type APIConfig = {
	fileserverHits: number;
	db: DBConfig;
	platform: string;
};

//set migration out folder
export const migrationConfig: MigrationConfig = {
	migrationsFolder: "./src/db/migrations",
};

export type DBConfig = {
	URL: string;
	migrationConfig: MigrationConfig;
};

export const config: APIConfig = {
	fileserverHits: 0,
	platform: envVariables.platform,
	db: {
		URL: envVariables.dbURL,
		migrationConfig: migrationConfig,
	},
};

import { DBConfig, migrationConfig } from "./db/index.js";

type APIConfig = {
	fileserverHits: number;
	db: DBConfig;
};

export const config: APIConfig = {
	fileserverHits: 0,
	db: {
		URL: process.env.DB_URL as string,
		migrationConfig: migrationConfig,
	},
};

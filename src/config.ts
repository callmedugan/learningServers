//on startup check env vars
process.loadEnvFile();
if (process.env.DB_URL == null) {
	throw new Error("env variable missing");
}

type APIConfig = {
	fileserverHits: number;
	dbURL: string;
};

export const config: APIConfig = {
	fileserverHits: 0,
	dbURL: process.env.DB_URL,
};
